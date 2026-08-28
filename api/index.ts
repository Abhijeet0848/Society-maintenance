import type { IncomingMessage, ServerResponse } from 'http';
import app from '../server/src/index';

const ALLOWED_ORIGINS = [
  'https://society-maintenance.gautamabhijeet050.workers.dev',
  'https://society-maintenance-api-sandy.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
];

export default async function handler(
  req: IncomingMessage & { method?: string; headers: Record<string, any> },
  res: ServerResponse & { status?: any; json?: any; setHeader: (k: string, v: string) => void; end: () => void }
) {
  const origin = (req.headers.origin as string) || '';

  // Set explicit CORS headers
  if (
    ALLOWED_ORIGINS.includes(origin) ||
    origin.endsWith('.workers.dev') ||
    origin.endsWith('.pages.dev') ||
    origin.endsWith('.vercel.app')
  ) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Instantly return 200 OK for browser preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    if (typeof res.writeHead === 'function') {
      res.writeHead(200);
    } else {
      res.statusCode = 200;
    }
    res.end();
    return;
  }

  // Forward all application requests to Express
  return app(req, res);
}

