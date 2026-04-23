import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  facilityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
  bookingDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'CANCELLED'], default: 'CONFIRMED' },
  members: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.model('Booking', BookingSchema);

