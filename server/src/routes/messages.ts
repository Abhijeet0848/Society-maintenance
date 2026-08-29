import { Router } from 'express';
import mongoose from 'mongoose';
import Message from '../models/Message';
import User from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authMiddleware as any);

// Get messages for a specific conversation
router.get('/:otherUserId', async (req: AuthRequest, res) => {
  try {
    let otherUserId = String(req.params.otherUserId || '');
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Resolve non-ObjectId aliases to active administrator
    if (!otherUserId || !mongoose.Types.ObjectId.isValid(otherUserId)) {
      const admin = await User.findOne({ role: 'ADMIN' });
      if (!admin) {
        return res.json([]);
      }
      otherUserId = admin._id.toString();
    }

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/', async (req: AuthRequest, res) => {
  try {
    let { receiverId, content } = req.body;
    const senderId = req.user?.id;

    if (!senderId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!content || !String(content).trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const receiverIdStr = String(receiverId || '');

    // Resolve non-ObjectId aliases to active administrator
    if (!receiverIdStr || !mongoose.Types.ObjectId.isValid(receiverIdStr)) {
      const admin = await User.findOne({ role: 'ADMIN' });
      if (!admin) {
        return res.status(404).json({ error: 'No society administrator found to receive message' });
      }
      receiverId = admin._id;
    }

    const message = new Message({
      senderId,
      receiverId,
      content: String(content).trim(),
      read: false
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
