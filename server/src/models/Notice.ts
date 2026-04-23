import mongoose from 'mongoose';

const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  sender: { type: String, default: 'Admin' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Notice', NoticeSchema);
