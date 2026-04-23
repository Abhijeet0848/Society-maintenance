import mongoose from 'mongoose';

const MaintenanceBillSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['PAID', 'PENDING'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('MaintenanceBill', MaintenanceBillSchema);
