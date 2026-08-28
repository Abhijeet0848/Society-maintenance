export default async function handler(req: any, res: any) {
  const origin = req.headers?.origin || '*';

  // Set explicit CORS headers for all incoming requests
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Instantly handle preflight OPTIONS without loading backend dependencies
  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') {
      return res.status(200).end();
    }
    res.statusCode = 200;
    return res.end();
  }

  try {
    // Dynamic import to catch any module load or runtime initialization error
    const serverModule = await import('../server/src/index');
    const app = serverModule.default || serverModule;
    return app(req, res);
  } catch (error: any) {
    console.error('Serverless Handler Exception:', error);
    if (typeof res.status === 'function') {
      return res.status(500).json({
        error: 'Backend Serverless Execution Error',
        message: error?.message || String(error),
        stack: error?.stack,
      });
    }
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(
      JSON.stringify({
        error: 'Backend Serverless Execution Error',
        message: error?.message || String(error),
        stack: error?.stack,
      })
    );
  }
}


