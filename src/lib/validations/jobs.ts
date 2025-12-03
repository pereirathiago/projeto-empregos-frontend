import { z } from "zod";

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
  state: z.string().min(1, "Estado é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  salary: z.preprocess(
    (val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      if (typeof val === "string") {
        const parsed = parseFloat(val.replace(",", "."));
        return isNaN(parsed) ? undefined : parsed;
      }
      return val;
    },
    z
      .number()
      .positive("Salário deve ser maior que zero")
      .optional()
  ),
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
