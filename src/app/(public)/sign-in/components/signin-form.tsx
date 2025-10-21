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
import { setAuthToken } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
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

export function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof LoginFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post<{ token: string; expires_in: number }>(
        "/login",
        formData
      );

      if (response.status === 200) {
        setAuthToken(response.data.token);
        toast.success("Login realizado com sucesso!");
        router.push("/");
        router.refresh();
      } else {
        toast.error("Erro ao fazer login");
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorData = error.response.data as ApiErrorResponse;

        if (errorData.details && Array.isArray(errorData.details)) {
          const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
          errorData.details.forEach((detail) => {
            const field = detail.field as keyof LoginFormData;
            fieldErrors[field] = detail.error;
          });
          setErrors(fieldErrors);
          toast.error("Erro ao fazer login. Verifique os campos.");
        } else {
          const message = errorData.message || "Erro ao fazer login";
          toast.error(message);
        }
      } else {
        toast.error("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Entrar</CardTitle>
          <CardDescription>Faça login na sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-3">
              <Field className="gap-2">
                <FieldLabel htmlFor="username">
                  Nome de Usuário
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </FieldLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="username"
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
                <Button type="submit" disabled={isLoading} className="cursor-pointer">
                  {isLoading && <Spinner />}
                  {isLoading ? "Entrando..." : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Não tem uma conta? <Link href="/register">Cadastrar</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
