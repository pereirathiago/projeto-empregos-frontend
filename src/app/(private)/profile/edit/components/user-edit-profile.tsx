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
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-user";
import { removeAuthToken, updateUser } from "@/lib/auth";
import {
  updateProfileSchema,
  type UpdateProfileFormData,
} from "@/lib/validations/auth";
import { useUserStore } from "@/store/user-store";
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

export function UserEditProfile() {
  const router = useRouter();
  const { user } = useUser();
  const { updateUserData, clearUser } = useUserStore();

  const [formData, setFormData] = useState<UpdateProfileFormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    experience: "",
    education: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdateProfileFormData, string>>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email || "",
        password: "",
        phone: user.phone || "",
        experience: user.experience || "",
        education: user.education || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof UpdateProfileFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSaving(true);

    const validation = updateProfileSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof UpdateProfileFormData, string>> =
        {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof UpdateProfileFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSaving(false);
      toast.error("Erro ao atualizar perfil. Verifique os campos.");
      return;
    }

    try {
      await updateUser(validation.data);

      updateUserData({
        name: validation.data.name,
        email: validation.data.email,
        phone: validation.data.phone,
        experience: validation.data.experience,
        education: validation.data.education,
      });

      toast.success("Perfil atualizado com sucesso!");

      router.push("/profile");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorData = error.response.data as ApiErrorResponse;

        if (error.response.status === 401 || error.response.status === 404) {
          const message = "Sessão expirada. Faça login novamente.";
          toast.error(message);
          removeAuthToken();
          clearUser();
          router.push("/sign-in");
          return;
        }

        if (error.response.status === 403) {
          toast.error("Você não tem permissão para realizar esta ação.");
          return;
        }

        if (
          error.response.status === 422 &&
          errorData.details &&
          Array.isArray(errorData.details)
        ) {
          const fieldErrors: Partial<
            Record<keyof UpdateProfileFormData, string>
          > = {};

          errorData.details.forEach((detail) => {
            const field = detail.field as keyof UpdateProfileFormData;
            fieldErrors[field] = detail.error;
          });

          setErrors(fieldErrors);
          toast.error("Erro ao atualizar perfil. Verifique os campos.");
        } else {
          const message = errorData.message || "Erro ao atualizar perfil";
          toast.error(message);
        }
      } else {
        toast.error("Erro ao atualizar perfil. Tente novamente.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 flex flex-col w-full items-center">
      <div className="w-full max-w-xl pl-3">
        <h1 className="text-balance text-3xl font-bold tracking-tight">
          Editar Perfil
        </h1>
        <p className="text-muted-foreground text-balance">
          Atualize suas informações pessoais e profissionais
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <div className="w-full">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Preencha os campos abaixo para atualizar seu perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informações Básicas</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nome Completo
                      <span className="text-red-500" aria-hidden>
                        *
                      </span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Digite seu nome completo"
                      required
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={user.username}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contato</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu.email@exemplo.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Segurança</h3>
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
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Informações Profissionais
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experiência</Label>
                    <Textarea
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Descreva sua experiência profissional..."
                      rows={4}
                    />
                    {errors.experience && (
                      <p className="text-sm text-red-600">
                        {errors.experience}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education">Educação</Label>
                    <Textarea
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="Descreva sua formação acadêmica..."
                      rows={4}
                    />
                    {errors.education && (
                      <p className="text-sm text-red-600">{errors.education}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 cursor-pointer"
                >
                  {isSaving ? <Spinner /> : <Save className="mr-2 h-4 w-4" />}
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="cursor-pointer"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
