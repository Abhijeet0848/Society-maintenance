import mongoose from 'mongoose';

const MaintenanceBillSchema = new mongoose.Schema({
  month: { type: String, required: true },
  year: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['PAID', 'PENDING'], default: 'PENDING' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paidOn: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.MaintenanceBill || mongoose.model('MaintenanceBill', MaintenanceBillSchema);
