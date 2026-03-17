import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Schema de validação das variáveis de ambiente
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  MAX_FILE_SIZE: z.string().default('10485760'),
  UPLOAD_DIR: z.string().default('uploads'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
  // Google OAuth - configuração opcional
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().optional(),
});

// Parse e validação
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const config = {
  nodeEnv: parsedEnv.data.NODE_ENV,
  port: parseInt(parsedEnv.data.PORT, 10),
  databaseUrl: parsedEnv.data.DATABASE_URL,
  jwtSecret: parsedEnv.data.JWT_SECRET,
  jwtExpiresIn: parsedEnv.data.JWT_EXPIRES_IN,
  corsOrigin: parsedEnv.data.CORS_ORIGIN.split(','),
  maxFileSize: parseInt(parsedEnv.data.MAX_FILE_SIZE, 10),
  uploadDir: parsedEnv.data.UPLOAD_DIR,
  rateLimitWindowMs: parseInt(parsedEnv.data.RATE_LIMIT_WINDOW_MS, 10),
  rateLimitMaxRequests: parseInt(parsedEnv.data.RATE_LIMIT_MAX_REQUESTS, 10),
  // Google OAuth
  googleClientId: parsedEnv.data.GOOGLE_CLIENT_ID || '',
  googleClientSecret: parsedEnv.data.GOOGLE_CLIENT_SECRET || '',
  googleRedirectUri: parsedEnv.data.GOOGLE_REDIRECT_URI || '',
};

export default config;