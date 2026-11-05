import { z } from 'zod';

const correo = z
  .string({ error: 'El correo es obligatorio' })
  .trim()
  .toLowerCase()
  .pipe(z.email('El correo no es válido'));

export const registroSchema = z.object(
  {
    nombre: z
      .string({ error: 'El nombre es obligatorio' })
      .trim()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(80, 'El nombre puede tener como máximo 80 caracteres'),
    correo,
    contrasena: z
      .string({ error: 'La contraseña es obligatoria' })
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(72, 'La contraseña puede tener como máximo 72 caracteres'),
    rol: z.enum(['EXPLORADOR', 'ORGANIZADOR'], {
      error: 'El rol debe ser EXPLORADOR u ORGANIZADOR',
    }),
  },
  { error: 'Debes enviar los datos en formato JSON' },
);

export const loginSchema = z.object(
  {
    correo,
    contrasena: z
      .string({ error: 'La contraseña es obligatoria' })
      .min(1, 'La contraseña es obligatoria'),
  },
  { error: 'Debes enviar los datos en formato JSON' },
);

export type RegistroInput = z.infer<typeof registroSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
