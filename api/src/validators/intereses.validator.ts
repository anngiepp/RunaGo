import { z } from 'zod';

export const interesesSchema = z.object(
  {
    categoriaIds: z.array(
      z
        .int('Cada id de categoría debe ser un número entero')
        .positive('Los ids deben ser positivos'),
      { error: 'categoriaIds debe ser una lista de ids de categorías' },
    ),
  },
  { error: 'Debes enviar los datos en formato JSON' },
);
