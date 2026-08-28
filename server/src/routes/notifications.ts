import { Router, Response } from 'express';
import Notification from '../models/Notification';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Apply Auth to all notification routes
router.use(authMiddleware as any);

// Get all notifications for a user (Data isolation enforced)
router.get('/:userId', async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;

  if (userId !== req.user?.id && req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. You cannot view other residents notifications.' });
  }

  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);
    
    if (notifications.length === 0) {
      return res.json([
        {
          title: "Welcome to Vrundavan Society!",
          message: "Your resident profile is now active. Explore the dashboard.",
          type: "SUCCESS",
          read: false,
          createdAt: new Date()
        }
      ]);
    }
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Failed to retrieve notifications' });
  }
});

// Mark notification as read
router.patch('/read/:id', async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId.toString() !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    notification.read = true;
    await notification.save();

    res.json({ success: true });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

export default router;
