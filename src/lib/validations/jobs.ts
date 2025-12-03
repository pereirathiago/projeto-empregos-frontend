import { z } from "zod";

export const BRAZILIAN_STATES = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MS",
  "MT",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;

export type BrazilianState = (typeof BRAZILIAN_STATES)[number];

export const JOB_AREAS = [
  "Administração",
  "Agricultura",
  "Artes",
  "Atendimento ao Cliente",
  "Comercial",
  "Comunicação",
  "Construção Civil",
  "Consultoria",
  "Contabilidade",
  "Design",
  "Educação",
  "Engenharia",
  "Finanças",
  "Jurídica",
  "Logística",
  "Marketing",
  "Produção",
  "Recursos Humanos",
  "Saúde",
  "Segurança",
  "Tecnologia da Informação",
  "Telemarketing",
  "Vendas",
  "Outros",
] as const;

export type JobArea = (typeof JOB_AREAS)[number];

export const createJobSchema = z.object({
  title: z
    .string()
    .min(3, "Título deve ter no mínimo 3 caracteres")
    .max(150, "Título deve ter no máximo 150 caracteres"),
  area: z.enum(JOB_AREAS, {
    message: "Selecione uma área válida",
  }),
  description: z
    .string()
    .min(10, "Descrição deve ter no mínimo 10 caracteres")
    .max(5000, "Descrição deve ter no máximo 5000 caracteres"),
  state: z.enum(BRAZILIAN_STATES, {
    message: "Selecione um estado válido",
  }),
  city: z.string().min(1, "Cidade é obrigatória"),
  salary: z.preprocess((val) => {
    if (val === "" || val === undefined || val === null) return undefined;
    if (typeof val === "string") {
      const parsed = parseFloat(val.replace(",", "."));
      return isNaN(parsed) ? undefined : parsed;
    }
    return val;
  }, z.number().positive("Salário deve ser maior que zero").optional()),
});

export type CreateJobFormData = z.infer<typeof createJobSchema>;

export const updateJobSchema = createJobSchema;

export type UpdateJobFormData = z.infer<typeof updateJobSchema>;

export const jobSearchFiltersSchema = z.object({
  title: z.string().optional(),
  area: z.string().optional(),
  company: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  salary_range: z
    .object({
      min: z.number().optional().nullable(),
      max: z.number().optional().nullable(),
    })
    .optional(),
});

export type JobSearchFilters = z.infer<typeof jobSearchFiltersSchema>;

export interface Job {
  job_id: number;
  title: string;
  area: string;
  description: string;
  company: string;
  state: string;
  city: string;
  salary: number | null;
  contact: string;
}

export interface JobsResponse {
  items: Job[];
}

export const applyJobSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(150, "Nome deve ter no máximo 150 caracteres"),
  email: z.preprocess((val) => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      return trimmed === "" ? undefined : trimmed;
    }
    return val;
  }, z.string().email("Email inválido").optional()),
  phone: z.preprocess((val) => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      return trimmed === "" ? undefined : trimmed;
    }
    return val;
  }, z.string().min(10, "Telefone deve ter entre 10 e 14 dígitos").max(14, "Telefone deve ter entre 10 e 14 dígitos").optional()),
  education: z
    .string()
    .min(1, "Formação é obrigatória")
    .max(600, "Formação deve ter no máximo 600 caracteres"),
  experience: z
    .string()
    .min(1, "Experiência é obrigatória")
    .max(600, "Experiência deve ter no máximo 600 caracteres"),
});

export type ApplyJobFormData = z.infer<typeof applyJobSchema>;
