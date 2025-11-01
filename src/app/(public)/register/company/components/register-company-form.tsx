"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  registerCompanySchema,
  type RegisterCompanyFormData,
} from "@/lib/validations/auth";
import { AxiosError } from "axios";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Array<{
    field: string;
    error: string;
  }>;
}

export function RegisterCompanyForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterCompanyFormData>({
    name: "",
    business: "",
    username: "",
    password: "",
    street: "",
    number: "",
    city: "",
    state: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterCompanyFormData, string>>
  >({});

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof RegisterCompanyFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const validation = registerCompanySchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<
        Record<keyof RegisterCompanyFormData, string>
      > = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof RegisterCompanyFormData] =
            err.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/companies", validation.data);

      if (response.status === 200) {
        toast.success(
          "Empresa cadastrada com sucesso! Faça login para continuar."
        );
        router.push("/sign-in");
      } else {
        const errorData = response.data as ApiErrorResponse;
        const message = errorData.message || "Erro ao cadastrar empresa";
        toast.error(message);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorData = error.response.data as ApiErrorResponse;

        if (errorData.details && Array.isArray(errorData.details)) {
          const fieldErrors: Partial<
            Record<keyof RegisterCompanyFormData, string>
          > = {};
          errorData.details.forEach((detail) => {
            const field = detail.field as keyof RegisterCompanyFormData;
            fieldErrors[field] = detail.error;
          });
          setErrors(fieldErrors);
          toast.error("Erro ao criar conta. Verifique os campos.");
        } else {
          const message = errorData.message || "Erro ao criar conta";
          toast.error(message);
        }
      } else {
        toast.error("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Cadastre sua empresa</CardTitle>
          <CardDescription>Publique vagas de emprego</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-3">
              <Field className="gap-2">
                <FieldLabel htmlFor="name">
                  Nome da Empresa{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Empresa"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="business">
                  Ramo de Atividade{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </FieldLabel>
                <Input
                  id="business"
                  name="business"
                  type="text"
                  placeholder="Alimentação"
                  value={formData.business}
                  onChange={handleChange}
                  required
                />
                {errors.business && (
                  <p className="text-sm text-red-600">{errors.business}</p>
                )}
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="username">
                  Nome de Usuário{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </FieldLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="empresa123"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username}</p>
                )}
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="password">
                  Senha
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="password"
                    name="password"
                    required
                    placeholder="••••••"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      onClick={() => setShowPassword(!showPassword)}
                      size="icon-xs"
                      type="button"
                      className="cursor-pointer"
                    >
                      {showPassword ? <Eye /> : <EyeClosed />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="street">
                  Rua{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </FieldLabel>
                <Input
                  id="street"
                  name="street"
                  type="text"
                  placeholder="Av. Presidente Kennedy"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />
                {errors.street && (
                  <p className="text-sm text-red-600">{errors.street}</p>
                )}
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="number">
                  Número{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </FieldLabel>
                <Input
                  id="number"
                  name="number"
                  type="text"
                  placeholder="1234"
                  value={formData.number}
                  onChange={handleChange}
                  required
                />
                {errors.number && (
                  <p className="text-sm text-red-600">{errors.number}</p>
                )}
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="city">
                  Cidade{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </FieldLabel>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Ponta Grossa"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city}</p>
                )}
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="state">
                  Estado{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </FieldLabel>
                <Input
                  id="state"
                  name="state"
                  type="text"
                  placeholder="PR"
                  maxLength={2}
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
                {errors.state && (
                  <p className="text-sm text-red-600">{errors.state}</p>
                )}
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="phone">
                  Telefone{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(42) 91234-5678"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone}</p>
                )}
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="email">
                  Email{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contato@empresa.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </Field>

              <Field>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  {isLoading && <Spinner />}
                  {isLoading ? "Cadastrando..." : "Cadastrar Empresa"}
                </Button>
                <FieldDescription className="text-center">
                  Já tem uma conta? <Link href="/sign-in">Entrar</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
