import mongoose from 'mongoose';

const FacilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String, default: '🏢' },
  capacity: { type: Number, default: 20 },
  location: { type: String },
  status: { type: String, enum: ['AVAILABLE', 'MAINTENANCE'], default: 'AVAILABLE' }
}, { timestamps: true });

export default mongoose.model('Facility', FacilitySchema);

