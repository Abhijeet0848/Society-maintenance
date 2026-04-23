import { Router } from 'express';
import Notice from '../models/Notice';
import User from '../models/User';
import Notification from '../models/Notification';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Broadcast notice and notify all residents (Admin only)
router.post('/', authMiddleware as any, adminMiddleware as any, async (req, res) => {
  try {
    const { title, content, priority } = req.body;
    
    // 1. Create the official notice
    const notice = new Notice({ title, content, priority });
    await notice.save();

    // 2. Alert all residents via their notification bell
    const residents = await User.find({ role: 'RESIDENT' });
    
    const notifications = residents.map(resident => ({
      userId: resident._id,
      title: `New Notice: ${title}`,
      message: priority === 'High' 
        ? `URGENT: A high-priority society circular has been issued. Check the Bulletin board.` 
        : `A new society notice has been published.`,
      type: priority === 'High' ? 'WARNING' : 'INFO'
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json(notice);
  } catch (err) {
    console.error('Failed to broadcast notice:', err);
    res.status(500).json({ error: err });
  }
});

// Delete a notice (Admin only)
router.delete('/:id', authMiddleware as any, adminMiddleware as any, async (req, res) => {
    try {
        const deleted = await Notice.findByIdAndDelete(req.params.id);
        if (deleted) {
            res.json({ message: 'Notice retracted successfully' });
        } else {
            res.status(404).json({ error: 'Notice not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Deletion failed' });
    }
});

export default router;

