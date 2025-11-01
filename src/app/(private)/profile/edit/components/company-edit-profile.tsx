"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useCompany } from "@/hooks/use-company";
import { removeAuthToken, updateCompany } from "@/lib/auth";
import {
  updateCompanySchema,
  type UpdateCompanyFormData,
} from "@/lib/validations/auth";
import { useCompanyStore } from "@/store/company-store";
import { AxiosError } from "axios";
import { Eye, EyeClosed, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Array<{
    field: string;
    error: string;
  }>;
}

export function CompanyEditProfile() {
  const router = useRouter();
  const { user } = useCompany();
  const { updateCompanyData, clearCompany } = useCompanyStore();

  const [formData, setFormData] = useState<UpdateCompanyFormData>({
    name: "",
    business: "",
    password: "",
    street: "",
    number: "",
    city: "",
    state: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdateCompanyFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        business: user.business || "",
        password: "",
        street: user.street || "",
        number: user.number || "",
        city: user.city || "",
        state: user.state || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof UpdateCompanyFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const validation = updateCompanySchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof UpdateCompanyFormData, string>> =
        {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof UpdateCompanyFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      await updateCompany(validation.data);

      toast.success("Perfil atualizado com sucesso!");

      updateCompanyData(validation.data);

      router.push("/profile");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorData = error.response.data as ApiErrorResponse;
        const status = error.response.status;

        if (status === 401 || status === 404) {
          const message = "Sessão expirada. Faça login novamente.";
          toast.error(message);
          removeAuthToken();
          clearCompany();
          router.push("/sign-in");
          return;
        }

        if (status === 403) {
          toast.error("Você não tem permissão para realizar esta ação.");
          return;
        }

        if (status === 422) {
          if (errorData.details && Array.isArray(errorData.details)) {
            const fieldErrors: Partial<
              Record<keyof UpdateCompanyFormData, string>
            > = {};
            errorData.details.forEach((detail) => {
              const field = detail.field as keyof UpdateCompanyFormData;
              fieldErrors[field] = detail.error;
            });
            setErrors(fieldErrors);
            toast.error("Erro de validação. Verifique os campos.");
          } else {
            const message = errorData.message || "Erro de validação nos campos";
            toast.error(message);
          }
          return;
        }

        const message = errorData.message || "Erro ao atualizar perfil";
        toast.error(message);
      } else {
        toast.error("Erro ao atualizar perfil. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 flex flex-col w-full items-center">
      <div className="w-full max-w-xl pl-3">
        <h1 className="text-balance text-3xl font-bold tracking-tight">
          Editar Perfil da Empresa
        </h1>
        <p className="text-muted-foreground text-balance">
          Atualize as informações da sua empresa
        </p>
      </div>

      <div className="w-full max-w-xl">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
            <CardDescription>
              Preencha os campos que deseja atualizar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nome da Empresa{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Madero"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="business">
                  Ramo de Atividade{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </Label>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Senha
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </Label>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="street">
                  Rua{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </Label>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="number">
                  Número{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </Label>
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
                  placeholder="Ponta Grossa"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city}</p>
                )}
              </div>

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
                  placeholder="PR"
                  maxLength={2}
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
                {errors.state && (
                  <p className="text-sm text-red-600">{errors.state}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contato@madero.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 cursor-pointer"
                >
                  {isLoading && <Spinner />}
                  {!isLoading && <Save className="mr-2 h-4 w-4" />}
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/profile")}
                  className="cursor-pointer"
                >
                  <X className="mr-2 h-4 w-4" />
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
