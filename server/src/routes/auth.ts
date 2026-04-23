import { Router } from 'express';
import User from '../models/User';

const router = Router();

// Get list of all residents for society directory
router.get('/residents', async (req, res) => {
  try {
    const residents = await User.find({ role: 'RESIDENT' }).select('name flatNo email createdAt');
    res.json(residents);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Get count of admins to determine if bootstrapping is needed
router.get('/admin-count', async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'ADMIN' });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

export default router;

