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
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
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

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    experience: "",
    education: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({});

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof RegisterFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/users", formData);

      if (response.status === 201) {
        toast.success("Conta criada com sucesso! Faça login para continuar.");
        router.push("/sign-in");
      } else {
        const errorData = response.data as ApiErrorResponse;
        const message = errorData.message || "Erro ao criar conta";
        toast.error(message);
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorData = error.response.data as ApiErrorResponse;

        if (errorData.details && Array.isArray(errorData.details)) {
          const fieldErrors: Partial<Record<keyof RegisterFormData, string>> =
            {};
          errorData.details.forEach((detail) => {
            const field = detail.field as keyof RegisterFormData;
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
          <CardTitle className="text-xl">Crie sua conta</CardTitle>
          <CardDescription>Busque vagas de emprego</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-3">
              <Field className="gap-2">
                <FieldLabel htmlFor="name">
                  Nome Completo{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Thiago Pereira"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
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
                  placeholder="thiagopereira"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username}</p>
                )}
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="thiago.pereira@teste.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
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
                <FieldLabel htmlFor="phone">Telefone</FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(42) 91234-5678"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone}</p>
                )}
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="experience">Experiência</FieldLabel>
                <Textarea
                  id="experience"
                  name="experience"
                  placeholder="Descreva sua experiência"
                  value={formData.experience}
                  onChange={handleChange}
                />
                {errors.experience && (
                  <p className="text-sm text-red-600">{errors.experience}</p>
                )}
              </Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="education">Educação</FieldLabel>
                <Textarea
                  id="education"
                  name="education"
                  placeholder="Descreva sua educação"
                  value={formData.education}
                  onChange={handleChange}
                />
                {errors.education && (
                  <p className="text-sm text-red-600">{errors.education}</p>
                )}
              </Field>

              <Field>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  {isLoading && <Spinner />}
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
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
