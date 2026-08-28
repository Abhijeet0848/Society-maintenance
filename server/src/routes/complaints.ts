import { Router } from 'express';
import Complaint from '../models/Complaint';
import { authMiddleware, AuthRequest, adminMiddleware } from '../middleware/auth';

const router = Router();

// Apply Auth to all complaint routes
router.use(authMiddleware as any);

router.get('/', async (req: AuthRequest, res) => {
  const { userId } = req.query;
  try {
    // Security: Users can only see their own complaints unless Admin
    if (userId && userId !== req.user?.id && req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Authorization Failure: Restricted dataset access.' });
    }
    
    // If no userId provided, only Admins can see "everything"
    if (!userId && req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Administrative credentials required for global view.' });
    }

    const query: Record<string, any> = userId ? { userId: String(userId) } : {};
    const complaints = await Complaint.find(query).populate('userId', 'name flatNo').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { title, description, userId, category } = req.body;
    
    // Security: Prevent impersonation (user can't create complaint for someone else)
    if (userId !== req.user?.id) {
        return res.status(403).json({ message: 'Security Breach: Profile impersonation attempt.' });
    }

    if (!title || !description || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const complaint = new Complaint({
      title,
      description,
      userId,
      category: category || 'Maintenance',
      status: 'OPEN'
    });

    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error while creating complaint' });
  }
});

// Update complaint status (Admins only)
router.patch('/:id', adminMiddleware as any, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updated = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Complaint not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update complaint status' });
  }
});

export default router;
