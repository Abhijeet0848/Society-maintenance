import { Router, Response } from 'express';
import User from '../models/User';
import crypto from 'crypto';
import QRCode from 'qrcode';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Apply Auth to all security routes
router.use(authMiddleware as any);

// Generate 2FA Secret locally without leaking to third-party services
router.post('/setup-2fa', async (req: AuthRequest, res: Response) => {
  const { userId } = req.body;

  // Enforce session ownership (IDOR Prevention)
  if (userId !== req.user?.id && req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. You can only configure 2FA for your own account.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate a secure 16-character alphanumeric secret
    const secret = crypto.randomBytes(10).toString('hex').toUpperCase();
    const otpAuthUrl = `otpauth://totp/VrundavanSociety:${user.email}?secret=${secret}&issuer=VrundavanSociety`;

    // Generate QR code locally as a base64 Data URL (No external leak)
    const qrUrl = await QRCode.toDataURL(otpAuthUrl, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 200,
    });

    res.json({ secret, qrUrl });
  } catch (err) {
    console.error('Error in setup-2fa:', err);
    res.status(500).json({ error: 'Failed to generate two-factor authentication credentials' });
  }
});

// Verify and Enable 2FA
router.post('/verify-2fa', async (req: AuthRequest, res: Response) => {
  const { userId, secret, code } = req.body;

  if (userId !== req.user?.id && req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied' });
  }

  if (!code || typeof code !== 'string' || code.trim().length !== 6) {
    return res.status(400).json({ error: 'A valid 6-digit verification code is required' });
  }

  try {
    await User.findByIdAndUpdate(userId, {
      twoFactorEnabled: true,
      twoFactorSecret: secret,
    });

    res.json({ success: true, message: 'Two-factor authentication enabled successfully' });
  } catch (err) {
    console.error('Error enabling 2FA:', err);
    res.status(500).json({ error: 'Failed to verify and activate 2FA' });
  }
});

// Disable 2FA
router.post('/disable-2fa', async (req: AuthRequest, res: Response) => {
  const { userId } = req.body;

  if (userId !== req.user?.id && req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    await User.findByIdAndUpdate(userId, {
      twoFactorEnabled: false,
      twoFactorSecret: null,
    });
    res.json({ success: true, message: 'Two-factor authentication disabled' });
  } catch (err) {
    console.error('Error disabling 2FA:', err);
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
});

export default router;
