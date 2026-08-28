import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore DNS override errors on restricted environments
}

dotenv.config();

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

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting on Vercel/reverse proxy
app.set('trust proxy', 1);

// 1. CORS configuration (Always first to handle preflights cleanly)
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile apps, server-to-server)
    if (!origin) return callback(null, true);

    const corsOrigin = process.env.CLIENT_URL || process.env.CORS_ORIGIN;
    if (corsOrigin) {
      const allowed = corsOrigin.split(',').map(s => s.trim());
      if (allowed.includes(origin) || allowed.includes('*')) {
        return callback(null, true);
      }
    }

    if (
      origin.endsWith('.workers.dev') ||
      origin.endsWith('.pages.dev') ||
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }

    // Default allow all origins to prevent unexpected CORS blocks
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// 2. Security HTTP Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// 3. Rate Limiting (Skip preflight OPTIONS requests)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  message: { error: 'Too many authentication attempts. Please try again after 15 minutes.' },
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use(express.json({ limit: '1mb' }));

// Health check endpoint (Instant, no DB dependency)
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    dbConnected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString() 
  });
});

// Root API Welcome endpoint
app.get('/', (_req, res) => {
  res.json({ message: 'Vrundavan Society Management API is running' });
});

// Database connection middleware for Serverless & Standalone
const DEFAULT_MONGODB_URI =
  'mongodb+srv://gautamabhijeet050_db_user:XA5pl6w7dkRmP0Rp@cluster1.ph5nmmj.mongodb.net/society-maintenance?retryWrites=true&w=majority&appName=Cluster1';
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

let cachedPromise: Promise<typeof mongoose> | null = null;
export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch {}

  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      })
      .then((m) => {
        console.log('Connected to MongoDB Atlas');
        return m;
      })
      .catch((err) => {
        cachedPromise = null;
        console.error('MongoDB Atlas connection error:', err);
        throw err;
      });
  }
  try {
    return await cachedPromise;
  } catch (err) {
    cachedPromise = null;
    throw err;
  }
};

// Ensure DB connection is initiated on API requests
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection middleware error:', err);
  }
  next();
});

// API Routes
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

// Production Static Serving for Single-Service Deployments
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.use((_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Standalone Server Start (When not running in Vercel Serverless environment)
const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
if (!isServerless) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

export default app;

