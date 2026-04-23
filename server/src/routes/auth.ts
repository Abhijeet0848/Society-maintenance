import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'vrundavan_society_secret_key_2026';

// Get list of all residents for society directory
router.get('/residents', async (req, res) => {
  try {
    const residents = await User.find({ role: 'RESIDENT' }).select('name flatNo email createdAt');
    res.json(residents);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Admin Count for bootstrap
router.get('/admin-count', async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'ADMIN' });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Admin Verification Route
router.post('/verify-admin', async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (user && user.role === 'ADMIN') {
      res.json({ verified: true });
    } else {
      res.status(403).json({ verified: false, message: 'Unauthorized administrative access.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

router.post('/login', async (req, res) => {
  const { password } = req.body;
  const email = req.body.email?.toLowerCase();
  try {
    const user = await User.findOne({ email });
    if (user) {
      // Secure Password Check
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Issue Secure JWT
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      
      const userObj = user.toObject();
      delete (userObj as any).password;

      res.json({ user: userObj, token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { password, ...otherData } = req.body;
    
    // Hash Password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const email = otherData.email?.toLowerCase();
    const user = new User({ ...otherData, email, password: hashedPassword });
    await user.save();
    
    // Auto-login on register
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    
    const userObj = user.toObject();
    delete (userObj as any).password;

    res.status(201).json({ user: userObj, token });
  } catch (err) {
    console.error('Registration failed:', err);
    res.status(400).json({ error: err });
  }
});

export default router;
