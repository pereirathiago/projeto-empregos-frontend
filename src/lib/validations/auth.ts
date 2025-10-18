import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const USERNAME_REGEX = /^[a-zA-Z0-9]+$/;
const PASSWORD_REGEX = /^[a-zA-Z0-9]+$/;

export const registerSchema = z.object({
  name: z
    .string()
    .min(4, "Nome completo deve ter no mínimo 4 caracteres")
    .max(150, "Nome completo deve ter no máximo 150 caracteres")
    .transform((s) => s.toUpperCase()),
  username: z
    .string()
    .min(3, "Nome de usuário deve ter no mínimo 3 caracteres")
    .max(20, "Nome de usuário deve ter no máximo 20 caracteres")
    .regex(
      USERNAME_REGEX,
      "Nome de usuário só pode conter letras e números, sem espaços"
    ),
  email: z.preprocess((val) => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      return trimmed === "" ? undefined : trimmed;
    }
    return val;
  }, z.email("Email inválido").optional()),
  password: z
    .string()
    .min(3, "Senha deve ter no mínimo 3 caracteres")
    .max(20, "Senha deve ter no máximo 20 caracteres")
    .regex(
      PASSWORD_REGEX,
      "Senha só pode conter letras e números, sem espaços"
    ),
  phone: z.preprocess((val) => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      return trimmed === "" ? undefined : trimmed;
    }
    return val;
  }, z.string().min(10, "Telefone deve ter entre 10 e 14 dígitos").max(14, "Telefone deve ter entre 10 e 14 dígitos").optional()),
  experience: z.preprocess((val) => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      return trimmed === "" ? undefined : trimmed;
    }
    return val;
  }, z.string().min(10, "Experiência deve ter no mínimo 10 caracteres").max(600, "Experiência deve ter no máximo 600 caracteres").optional()),
  education: z.preprocess((val) => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      return trimmed === "" ? undefined : trimmed;
    }
    return val;
  }, z.string().min(10, "Formação deve ter no mínimo 10 caracteres").max(600, "Formação deve ter no máximo 600 caracteres").optional()),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
