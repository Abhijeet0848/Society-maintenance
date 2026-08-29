import { Router } from 'express';
import User from '../models/User';
import Complaint from '../models/Complaint';
import MaintenanceBill from '../models/MaintenanceBill';
import Booking from '../models/Booking';
import Notification from '../models/Notification';

import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Protect all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Get aggregated statistics for Admin Dashboard
router.get('/stats', async (req, res) => {
  try {
    const residentCount = await User.countDocuments({ role: 'RESIDENT' });
    const openComplaints = await Complaint.countDocuments({ status: { $ne: 'RESOLVED' } });
    
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
    const recentComplaints = await Complaint.find({ status: { $ne: 'RESOLVED' } })
      .populate('userId', 'name flatNo')
      .sort({ createdAt: -1 })
      .limit(3);

    // Get recent bookings
    const recentBookings = await Booking.find()
      .populate('userId', 'name flatNo')
      .populate('facilityId', 'name icon')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      residents: residentCount,
      complaints: openComplaints,
      collection: `${collectionRate}%`,
      reserve: `₹ ${(totalReserve / 1000).toFixed(1)}k`,
      recentIssues: recentComplaints,
      recentBookings: recentBookings
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Get all residents with their latest bill status
router.get('/residents-dues', async (req, res) => {
  try {
    const residents = await User.find({ role: 'RESIDENT' }).select('name email flatNo');
    const now = new Date();
    const currentMonth = now.toLocaleString('en-US', { month: 'long' });
    const currentYear = now.getFullYear();

    const residentsWithDues = await Promise.all(residents.map(async (r) => {
      const bill = await MaintenanceBill.findOne({ 
        userId: r._id, 
        month: currentMonth, 
        year: currentYear 
      });
      return {
        _id: r._id,
        name: r.name,
        email: r.email,
        flatNo: r.flatNo,
        billStatus: bill ? bill.status : 'NOT_GENERATED',
        billId: bill ? bill._id : null,
        amount: bill ? bill.amount : 0
      };
    }));

    console.log(`Fetched ${residentsWithDues.length} residents with dues status`);
    res.json(residentsWithDues);
  } catch (err) {
    console.error('Error in /residents-dues:', err);
    res.status(500).json({ error: err });
  }
});

// Request payment (create bill if not exists and notify)
router.post('/request-payment', async (req, res) => {
  const { userId, amount, month, year } = req.body;
  console.log(`Admin Requesting Payment: ${userId} for ${month} ${year}`);
  try {
    let bill = await MaintenanceBill.findOne({ userId, month, year });
    
    if (!bill) {
      bill = new MaintenanceBill({ userId, amount, month, year, status: 'PENDING' });
      await bill.save();
    }

    // Send notification to user
    const notification = new Notification({
      userId,
      title: 'Maintenance Due',
      message: `Admin has requested maintenance payment of ₹${amount} for ${month} ${year}. Please pay at your earliest.`,
      type: 'WARNING'
    });
    await notification.save();

    res.json({ success: true, message: 'Payment requested successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;

