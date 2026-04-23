import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import noticeRoutes from './routes/notices';
import complaintRoutes from './routes/complaints';
import billingRoutes from './routes/billing';
import configRoutes from './routes/config';
import adminRoutes from './routes/admin';
import facilityRoutes from './routes/facilities';
import securityRoutes from './routes/security';
import notificationRoutes from './routes/notifications';
import messageRoutes from './routes/messages';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/config', configRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/society-maintenance';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
