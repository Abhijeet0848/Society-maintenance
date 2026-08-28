import { Router, Response } from 'express';
import SocietyConfig from '../models/SocietyConfig';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Whitelist of keys that can be queried publicly without authentication
const PUBLIC_CONFIG_KEYS = new Set(['maintenance_fee']);

// Get a config value
router.get('/:key', async (req: AuthRequest, res: Response) => {
  const key = String(req.params.key);

  try {
    // If querying sensitive config (like admin_registration_key), require admin authentication
    if (!PUBLIC_CONFIG_KEYS.has(key)) {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Authentication required to access this configuration.' });
      }

      return authMiddleware(req, res, () => {
        return adminMiddleware(req, res, async () => {
          const config = await SocietyConfig.findOne({ key });
          return res.json(config ? config.value : null);
        });
      });
    }

    const config = await SocietyConfig.findOne({ key });
    res.json(config ? config.value : null);
  } catch (err) {
    console.error('Error fetching config:', err);
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
});

// Update or create a config value (Admin only)
router.post('/', authMiddleware as any, adminMiddleware as any, async (req: AuthRequest, res: Response) => {
  const { key, value } = req.body;

  if (!key || value === undefined) {
    return res.status(400).json({ error: 'Both key and value are required' });
  }

  try {
    const config = await SocietyConfig.findOneAndUpdate(
      { key },
      { value, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(config);
  } catch (err) {
    console.error('Error updating config:', err);
    res.status(500).json({ error: 'Failed to update configuration' });
  }
});

export default router;
