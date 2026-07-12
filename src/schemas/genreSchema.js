import { z } from 'zod';

export const genreSchema = z.object({
  genreName: z
    .string()
    .trim()
    .min(1, 'El nombre del género es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
});
