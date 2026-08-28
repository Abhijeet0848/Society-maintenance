import { Router, Response } from 'express';
import Facility from '../models/Facility';
import Booking from '../models/Booking';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all facilities (Public / Authenticated)
router.get('/', async (_req, res) => {
  try {
    const facilities = await Facility.find();
    if (facilities.length === 0) {
      const dummy = [
        { name: "Club House", icon: "🏠", description: "For parties and events", capacity: 50, location: "Near Wing A" },
        { name: "Gymnasium", icon: "🏋️", description: "Available 6 AM - 10 PM", capacity: 10, location: "Basement 1" },
        { name: "Swimming Pool", icon: "🏊", description: "Closed on Mondays", capacity: 20, location: "Ground Central" }
      ];
      await Facility.insertMany(dummy);
      return res.json(await Facility.find());
    }
    res.json(facilities);
  } catch (err) {
    console.error('Error fetching facilities:', err);
    res.status(500).json({ error: 'Failed to fetch facilities' });
  }
});

// Get user bookings (Auth protected with IDOR isolation)
router.get('/bookings/:userId', authMiddleware as any, async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;

  if (userId !== req.user?.id && req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. You can only view your own bookings.' });
  }

  try {
    const bookings = await Booking.find({ userId }).populate('facilityId').sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
});

// Create new booking (Auth protected, forced user ownership)
router.post('/book', authMiddleware as any, async (req: AuthRequest, res: Response) => {
  const { facilityId, bookingDate, timeSlot } = req.body;

  if (!facilityId || !bookingDate || !timeSlot) {
    return res.status(400).json({ error: 'Facility ID, booking date, and time slot are required' });
  }

  try {
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    // Force authenticated user's ID
    const booking = new Booking({
      facilityId,
      userId: req.user?.id,
      bookingDate,
      timeSlot,
      status: 'CONFIRMED'
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Failed to process facility booking' });
  }
});

export default router;
