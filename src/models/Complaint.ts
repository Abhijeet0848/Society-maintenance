import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['OPEN', 'RESOLVED'], default: 'OPEN' },
  category: { type: String, default: 'General' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Complaint || mongoose.model('Complaint', ComplaintSchema);
