import { Router } from 'express';
import User from '../models/User';
import Complaint from '../models/Complaint';
import MaintenanceBill from '../models/MaintenanceBill';

const router = Router();

// Get aggregated statistics for Admin Dashboard
router.get('/stats', async (req, res) => {
  try {
    const residentCount = await User.countDocuments({ role: 'RESIDENT' });
    const openComplaints = await Complaint.countDocuments({ status: 'OPEN' });
    
    // Calculate collection percentage for current month
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' });
    const currentYear = now.getFullYear();
    
    const bills = await MaintenanceBill.find({ month: currentMonth, year: currentYear });
    const totalBills = bills.length;
    const paidBills = bills.filter(b => b.status === 'PAID').length;
    
    const collectionRate = totalBills > 0 ? Math.round((paidBills / totalBills) * 100) : 0;
    
    // Calculate total reserve (sum of all paid bills)
    const paidBillsAll = await MaintenanceBill.find({ status: 'PAID' });
    const totalReserve = paidBillsAll.reduce((sum, bill) => sum + bill.amount, 0);

    // Get recent complaints
    const recentComplaints = await Complaint.find({ status: 'OPEN' })
      .populate('userId', 'name flatNo')
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      residents: residentCount,
      complaints: openComplaints,
      collection: `${collectionRate}%`,
      reserve: `₹ ${(totalReserve / 1000).toFixed(1)}k`,
      recentIssues: recentComplaints
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;

