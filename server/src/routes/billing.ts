import { Router } from 'express';
import MaintenanceBill from '../models/MaintenanceBill';

const router = Router();

router.get('/:userId', async (req, res) => {
  try {
    const bills = await MaintenanceBill.find({ userId: req.params.userId }).sort({ year: -1, month: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post('/', async (req, res) => {
  try {
    const bill = new MaintenanceBill(req.body);
    await bill.save();
    res.status(201).json(bill);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;
