import { z } from "zod";

const currentYear = new Date().getFullYear() + 2;

export const movieSchema = z.object({
  title: z
    .string()
    .min(1, "El título es obligatorio")
    .max(150, "Máximo 150 caracteres"),
  director: z.string().min(1, "El director es obligatorio").max(100),
  year: z.coerce
    .number({ invalid_type_error: "Ingresá un año válido" })
    .int("Debe ser un número entero")
    .min(1888, "Año inválido")
    .max(currentYear, `El año no puede ser mayor a ${currentYear}`),
  genresIds: z.array(z.number()).min(1, "Elegí al menos un género"),
  description: z
    .string()
    .max(2000, "Máximo 2000 caracteres")
    .optional()
    .or(z.literal("")),
  posterUrl: z
    .string()
    .url("Debe ser una URL válida")
    .optional()
    .or(z.literal("")),
});
