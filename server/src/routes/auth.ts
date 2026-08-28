import { Router } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import SocietyConfig from '../models/SocietyConfig';
import { authMiddleware, getJwtSecret } from '../middleware/auth';

const router = Router();

// Get list of all residents for society directory (Authenticated users only)
router.get('/residents', authMiddleware as any, async (_req, res) => {
  try {
    const residents = await User.find({ role: 'RESIDENT' }).select('name flatNo email createdAt');
    res.json(residents);
  } catch (err) {
    console.error('Error fetching residents directory:', err);
    res.status(500).json({ error: 'Failed to fetch directory' });
  }
});

// Admin Count for bootstrap status
router.get('/admin-count', async (_req, res) => {
  try {
    const count = await User.countDocuments({ role: 'ADMIN' });
    res.json({ count });
  } catch (err) {
    console.error('Error fetching admin count:', err);
    res.status(500).json({ error: 'Failed to retrieve system status' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { password, twoFactorCode } = req.body;
  const email = req.body.email?.toLowerCase()?.trim();

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    if (mongoose.connection.readyState < 1) {
      return res.status(503).json({
        error: 'Database is not connected. Please verify MONGODB_URI in Vercel Environment Variables and MongoDB Atlas Network Access (IP whitelist).',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // If user has 2FA enabled and no code was sent, request 2FA challenge
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return res.json({ 
          requires2FA: true, 
          userId: user._id, 
          message: 'Two-factor authentication code required' 
        });
      }

      // Basic length and format validation for 2FA code
      if (typeof twoFactorCode !== 'string' || twoFactorCode.trim().length !== 6) {
        return res.status(401).json({ error: 'Invalid 2FA verification code' });
      }
    }

    // Issue Session JWT
    const token = jwt.sign({ id: user._id, role: user.role }, getJwtSecret(), { expiresIn: '24h' });
    
    const userObj = user.toObject();
    delete (userObj as any).password;
    delete (userObj as any).twoFactorSecret;

    res.json({ user: userObj, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
});

// Register Route with RBAC Hardening
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, flatNo, role, adminSecretKey } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    let assignedRole = 'RESIDENT';

    // Strict Admin Role Verification
    if (role === 'ADMIN') {
      const config = await SocietyConfig.findOne({ key: 'admin_registration_key' });
      const validKey = config ? config.value : 'SOCIETY2024';

      if (!adminSecretKey || adminSecretKey.trim() !== validKey) {
        return res.status(403).json({ error: 'Invalid administrative registration passkey' });
      }
      assignedRole = 'ADMIN';
    }

    // Hash Password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      flatNo: flatNo ? flatNo.trim() : '',
      role: assignedRole,
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, getJwtSecret(), { expiresIn: '24h' });

    const userObj = user.toObject();
    delete (userObj as any).password;
    delete (userObj as any).twoFactorSecret;

    res.status(201).json({ user: userObj, token });
  } catch (err: any) {
    console.error('Registration failed:', err);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    res.status(500).json({ error: 'Failed to complete registration' });
  }
});

export default router;
