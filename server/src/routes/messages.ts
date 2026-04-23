import { Router } from 'express';
import Message from '../models/Message';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authMiddleware as any);

// Get messages for a specific conversation
router.get('/:otherUserId', async (req: AuthRequest, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user?.id;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user?.id;

    const message = new Message({
      senderId,
      receiverId,
      content,
      read: false
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
