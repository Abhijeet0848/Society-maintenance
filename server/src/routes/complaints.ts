import { Router } from 'express';
import Complaint from '../models/Complaint';

const router = Router();

router.get('/', async (req, res) => {
  const { userId } = req.query;
  try {
    const query = userId ? { userId } : {};
    const complaints = await Complaint.find(query).populate('userId', 'name flatNo').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, userId, category } = req.body;
    
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
    console.error('Error creating complaint:', err);
    res.status(500).json({ error: 'Internal server error while creating complaint' });
  }
});

export default router;

