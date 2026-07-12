import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "El email es obligatorio").email("Email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "El usuario debe tener al menos 3 caracteres")
      .max(50, "Máximo 50 caracteres"),
    email: z.string().min(1, "El email es obligatorio").email("Email inválido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirmá tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
