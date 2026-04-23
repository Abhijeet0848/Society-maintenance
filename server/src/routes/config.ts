import { Router } from 'express';
import SocietyConfig from '../models/SocietyConfig';

const router = Router();

// Get a config value
router.get('/:key', async (req, res) => {
  try {
    const config = await SocietyConfig.findOne({ key: req.params.key });
    res.json(config ? config.value : null);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Update or create a config value
router.post('/', async (req, res) => {
  const { key, value } = req.body;
  try {
    const config = await SocietyConfig.findOneAndUpdate(
      { key },
      { value, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(config);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

export default router;

