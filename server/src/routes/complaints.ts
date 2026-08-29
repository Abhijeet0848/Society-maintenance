import { Router } from 'express';
import Complaint from '../models/Complaint';
import { authMiddleware, AuthRequest, adminMiddleware } from '../middleware/auth';

const router = Router();

// Apply Auth to all complaint routes
router.use(authMiddleware as any);

router.get('/', async (req: AuthRequest, res) => {
  const { userId } = req.query;
  try {
    let query: Record<string, any> = {};
    if (req.user?.role === 'ADMIN') {
      if (userId) {
        query.userId = String(userId);
      }
    } else {
      // Residents automatically see their own complaints
      query.userId = req.user?.id;
    }

    const complaints = await Complaint.find(query)
      .populate('userId', 'name flatNo email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const complaint = new Complaint({
      title,
      description,
      userId,
      category: category || 'MAINTENANCE',
      priority: priority || 'MEDIUM',
      status: 'PENDING'
    });

    await complaint.save();
    await complaint.populate('userId', 'name flatNo email');
    res.status(201).json(complaint);
  } catch (err: any) {
    console.error('Error creating complaint:', err);
    res.status(500).json({ error: err?.message || 'Internal server error while creating complaint' });
  }
});

// Update complaint status (Admins only)
router.patch('/:id', adminMiddleware as any, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updated = await Complaint.findByIdAndUpdate(id, { status }, { new: true }).populate('userId', 'name flatNo email');
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
