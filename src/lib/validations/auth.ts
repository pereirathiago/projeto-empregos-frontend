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

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(4, "Nome completo deve ter no mínimo 4 caracteres")
    .max(150, "Nome completo deve ter no máximo 150 caracteres")
    .transform((s) => s.toUpperCase()),
  email: z.preprocess((val) => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      return trimmed === "" ? undefined : trimmed;
    }
    return val;
  }, z.email("Email inválido").optional()),
  password: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        (val.length >= 3 && val.length <= 20 && PASSWORD_REGEX.test(val)),
      {
        message:
          "Senha só pode conter letras e números, sem espaços e deve ter entre 3 e 20 caracteres",
      }
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

export const registerCompanySchema = z.object({
  name: z
    .string()
    .min(4, "Nome da empresa deve ter no mínimo 4 caracteres")
    .max(150, "Nome da empresa deve ter no máximo 150 caracteres")
    .transform((s) => s.toUpperCase()),
  business: z
    .string()
    .min(4, "Ramo de atividade deve ter no mínimo 4 caracteres")
    .max(100, "Ramo de atividade deve ter no máximo 100 caracteres"),
  username: z
    .string()
    .min(3, "Nome de usuário deve ter no mínimo 3 caracteres")
    .max(20, "Nome de usuário deve ter no máximo 20 caracteres")
    .regex(
      USERNAME_REGEX,
      "Nome de usuário só pode conter letras e números, sem espaços"
    ),
  password: z
    .string()
    .min(3, "Senha deve ter no mínimo 3 caracteres")
    .max(20, "Senha deve ter no máximo 20 caracteres")
    .regex(
      PASSWORD_REGEX,
      "Senha só pode conter letras e números, sem espaços"
    ),
  street: z
    .string()
    .min(3, "Rua deve ter no mínimo 3 caracteres")
    .max(150, "Rua deve ter no máximo 150 caracteres"),
  number: z
    .string()
    .min(1, "Número é obrigatório")
    .max(8, "Número deve ter no máximo 8 caracteres"),
  city: z
    .string()
    .min(3, "Cidade deve ter no mínimo 3 caracteres")
    .max(150, "Cidade deve ter no máximo 150 caracteres"),
  state: z
    .string()
    .length(2, "Estado deve ter 2 caracteres (ex: PR)")
    .transform((s) => s.toUpperCase()),
  phone: z.preprocess((val) => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      return trimmed === "" ? undefined : trimmed;
    }
    return val;
  }, z.string().min(10, "Telefone deve ter entre 10 e 12 dígitos").max(12, "Telefone deve ter entre 10 e 12 dígitos")),
  email: z.preprocess((val) => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      return trimmed === "" ? undefined : trimmed;
    }
    return val;
  }, z.email("Email inválido")),
});

export const updateCompanySchema = z.object({
  name: z
    .string()
    .min(4, "Nome da empresa deve ter no mínimo 4 caracteres")
    .max(150, "Nome da empresa deve ter no máximo 150 caracteres")
    .transform((s) => s.toUpperCase()),
  business: z
    .string()
    .min(4, "Ramo de atividade deve ter no mínimo 4 caracteres")
    .max(100, "Ramo de atividade deve ter no máximo 100 caracteres"),
  password: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        (val.length >= 3 && val.length <= 20 && PASSWORD_REGEX.test(val)),
      {
        message:
          "Senha só pode conter letras e números, sem espaços e deve ter entre 3 e 20 caracteres",
      }
    ),
  street: z
    .string()
    .min(3, "Rua deve ter no mínimo 3 caracteres")
    .max(150, "Rua deve ter no máximo 150 caracteres"),
  number: z
    .string()
    .min(1, "Número é obrigatório")
    .max(8, "Número deve ter no máximo 8 caracteres"),
  city: z
    .string()
    .min(3, "Cidade deve ter no mínimo 3 caracteres")
    .max(150, "Cidade deve ter no máximo 150 caracteres"),
  state: z
    .string()
    .length(2, "Estado deve ter 2 caracteres (ex: PR)")
    .transform((s) => s.toUpperCase()),
  phone: z.preprocess((val) => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      return trimmed === "" ? undefined : trimmed;
    }
    return val;
  }, z.string().min(10, "Telefone deve ter entre 10 e 12 dígitos").max(12, "Telefone deve ter entre 10 e 12 dígitos")),
  email: z.preprocess((val) => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      return trimmed === "" ? undefined : trimmed;
    }
    return val;
  }, z.email("Email inválido")),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type RegisterCompanyFormData = z.infer<typeof registerCompanySchema>;
export type UpdateCompanyFormData = z.infer<typeof updateCompanySchema>;
