import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'RESIDENT'], default: 'RESIDENT' },
  flatNo: { type: String },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', UserSchema);
