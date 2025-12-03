"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  CreateJobFormData,
  JOB_AREAS,
  createJobSchema,
} from "@/lib/validations/jobs";
import { Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface JobFormProps {
  initialData?: Partial<CreateJobFormData>;
  onSubmit: (data: CreateJobFormData) => Promise<boolean>;
  isLoading?: boolean;
  formErrors?: Record<string, string>;
  title?: string;
  description?: string;
}

export function JobForm({
  initialData,
  onSubmit,
  isLoading,
  formErrors: externalErrors,
  title = "Nova Vaga",
  description = "Preencha os dados da vaga",
}: JobFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateJobFormData>({
    title: initialData?.title || "",
    area: initialData?.area || ("" as CreateJobFormData["area"]),
    description: initialData?.description || "",
    state: initialData?.state || "",
    city: initialData?.city || "",
    salary: initialData?.salary,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateJobFormData, string>>
  >({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof CreateJobFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const validation = createJobSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof CreateJobFormData, string>> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof CreateJobFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const success = await onSubmit(validation.data);
    if (success) {
      router.push("/jobs/company");
    }
  };

  const allErrors = { ...errors, ...externalErrors };

  return (
    <div className="space-y-6 flex flex-col w-full items-center">
      <div className="w-full max-w-2xl pl-3">
        <h1 className="text-balance text-3xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground text-balance">{description}</p>
      </div>

      <div className="w-full max-w-2xl">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Informações da Vaga</CardTitle>
            <CardDescription>
              Campos marcados com * são obrigatórios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Título da Vaga{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Ex: Auxiliar de Produção"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                {allErrors.title && (
                  <p className="text-sm text-red-600">{allErrors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">
                  Área{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </Label>
                <select
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecione uma área</option>
                  {JOB_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                {allErrors.area && (
                  <p className="text-sm text-red-600">{allErrors.area}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Descrição{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descreva as responsabilidades, requisitos e benefícios da vaga..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  required
                />
                {allErrors.description && (
                  <p className="text-sm text-red-600">{allErrors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">
                    Estado{" "}
                    <span className="text-red-500" aria-hidden>
                      *
                    </span>
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    placeholder="Ex: PR"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                  {allErrors.state && (
                    <p className="text-sm text-red-600">{allErrors.state}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">
                    Cidade{" "}
                    <span className="text-red-500" aria-hidden>
                      *
                    </span>
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Ex: Ponta Grossa"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                  {allErrors.city && (
                    <p className="text-sm text-red-600">{allErrors.city}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salário (opcional)</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 1800.00"
                  value={formData.salary ?? ""}
                  onChange={handleChange}
                />
                {allErrors.salary && (
                  <p className="text-sm text-red-600">{allErrors.salary}</p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Spinner className="size-4" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="size-4" />
                      Salvar
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  <X className="size-4" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
