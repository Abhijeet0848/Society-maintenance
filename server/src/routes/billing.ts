import { Router } from 'express';
import MaintenanceBill from '../models/MaintenanceBill';
import Notification from '../models/Notification';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Apply Auth to all billing routes
router.use(authMiddleware as any);

router.get('/:userId', async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;
    
    // Data Isolation Policy: Users can only see their own bills unless they are Admin
    if (userId !== req.user?.id && req.user?.role !== 'ADMIN') {
       return res.status(403).json({ message: 'Security Policy: Access to external billing records is prohibited.' });
    }

    console.log(`Fetching bills for user: ${userId}`);
    const bills = await MaintenanceBill.find({ userId }).sort({ year: -1, month: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: 'Failed to access billing ledger' });
  }
});

// Simulated payment route
router.post('/pay/:id', async (req: AuthRequest, res) => {
  try {
    const bill = await MaintenanceBill.findById(req.params.id);
    if (!bill) return res.status(404).json({ error: 'Bill not found' });

    // Authorization: User can only pay their own bill
    if (bill.userId.toString() !== req.user?.id && req.user?.role !== 'ADMIN') {
       return res.status(403).json({ message: 'Unauthorized Payment Attempt.' });
    }

    bill.status = 'PAID';
    await bill.save();

    // Create a success notification
    const notification = new Notification({
      userId: bill.userId,
      title: 'Payment Successful',
      message: `Your maintenance payment of ₹${bill.amount} for ${bill.month} ${bill.year} has been processed successfully.`,
      type: 'SUCCESS'
    });
    await notification.save();

    res.json({ success: true, bill });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;

