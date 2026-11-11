import { z } from 'zod';

export const perfilSchema = z.object(
  {
    nombre: z
      .string({ error: 'El nombre es obligatorio' })
      .trim()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(80, 'El nombre puede tener como máximo 80 caracteres'),
  },
  { error: 'Debes enviar los datos en formato JSON' },
);
