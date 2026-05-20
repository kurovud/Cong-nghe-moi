import cors from 'cors';

const STATIC_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean);

const FRONTEND_URL = process.env.FRONTEND_URL;

export function isAllowedOrigin(origin?: string | null): boolean {
  if (!origin) return true;
  if (STATIC_ALLOWED_ORIGINS.includes(origin)) return true;
  if (FRONTEND_URL && origin === FRONTEND_URL) return true;
  return false;
}

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
