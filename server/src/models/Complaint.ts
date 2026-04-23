import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['OPEN', 'RESOLVED'], default: 'OPEN' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Complaint', ComplaintSchema);
