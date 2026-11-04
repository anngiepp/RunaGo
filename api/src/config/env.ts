import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce
    .number({ error: 'PORT es obligatoria y debe ser un número' })
    .int()
    .positive('PORT debe ser un número positivo'),
  DATABASE_URL: z
    .string({ error: 'DATABASE_URL es obligatoria' })
    .min(1, 'DATABASE_URL no puede estar vacía'),
  DIRECT_URL: z
    .string({ error: 'DIRECT_URL es obligatoria' })
    .min(1, 'DIRECT_URL no puede estar vacía'),
  CORS_ORIGIN: z.string().default('http://localhost:8081'),
  JWT_SECRET: z
    .string({ error: 'JWT_SECRET es obligatoria' })
    .min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('7d'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('No se pudo iniciar el servidor. Revisa las variables de entorno:');
  for (const issue of result.error.issues) {
    console.error(`- ${issue.message}`);
  }
  process.exit(1);
}

export const env = result.data;
