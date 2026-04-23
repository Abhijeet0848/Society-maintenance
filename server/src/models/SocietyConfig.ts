import mongoose from 'mongoose';

const SocietyConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('SocietyConfig', SocietyConfigSchema);
