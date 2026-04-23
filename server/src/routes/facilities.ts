import { Router } from 'express';
import Facility from '../models/Facility';
import Booking from '../models/Booking';

const router = Router();

// Get all facilities
router.get('/', async (req, res) => {
  try {
    const facilities = await Facility.find();
    // Seed dummy facilities if none exist
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
    res.status(500).json({ error: err });
  }
});

// Get user bookings
router.get('/bookings/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate('facilityId').sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Create new booking
router.post('/book', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

export default router;

