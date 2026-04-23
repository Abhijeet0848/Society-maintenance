import { Router } from 'express';
import Notification from '../models/Notification';

const router = Router();

// Get all notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 }).limit(10);
    // If no notifications, return demo/welcome notifications
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
    res.status(500).json({ error: err });
  }
});

// Mark as read
router.patch('/read/:id', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;

