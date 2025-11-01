"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/hooks/use-user";
import { deleteUser, removeAuthToken } from "@/lib/auth";
import { useUserStore } from "@/store/user-store";
import { AxiosError } from "axios";
import {
  AtSign,
  Briefcase,
  Edit,
  GraduationCap,
  Mail,
  Phone,
  Trash2,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ApiErrorResponse {
  message: string;
}

export function UserProfile() {
  const { user, isLoading } = useUser();
  const { clearUser } = useUserStore();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteUser = async () => {
    setIsDeleting(true);

    try {
      const response = await deleteUser();

      toast.success(response.message || "Usuário deletado com sucesso!");

      removeAuthToken();
      clearUser();

      router.push("/sign-in");
      router.refresh();
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

        const message = errorData.message || "Erro ao deletar usuário";
        toast.error(message);
      } else {
        toast.error("Erro ao deletar usuário. Tente novamente.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 flex flex-col w-full items-center">
        <div className="w-full max-w-xl pl-3">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="w-full max-w-xl">
          <Card className="w-full">
            <CardHeader>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-5 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-5 w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Informações Profissionais */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-56" />
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-5 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 flex flex-col w-full items-center">
      <div className="w-full max-w-xl pl-3 flex items-center justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">
            Perfil do Usuário
          </h1>
          <p className="text-muted-foreground text-balance">
            Visualize e gerencie suas informações pessoais
          </p>
        </div>
        <Link href="/profile/edit">
          <Button variant="outline" className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" /> Editar Perfil
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-xl">
        <Card className="w-full ">
          <CardHeader>
            <CardTitle>Detalhes do Perfil</CardTitle>
            <CardDescription>
              Informações de contato e profissionais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações Básicas</h3>
              <div className="flex items-center gap-3">
                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                  <UserCircle className="text-muted-foreground h-5 w-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Nome</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                  <AtSign className="text-muted-foreground h-5 w-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Username</p>
                  <p className="font-medium">@{user.username}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contato</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                    <Mail className="text-muted-foreground h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Email</p>
                    <p
                      className={`font-medium ${
                        user.email ? "" : "text-muted-foreground"
                      }`}
                    >
                      {user.email || "Não informado"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                    <Phone className="text-muted-foreground h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Telefone</p>
                    <p
                      className={`font-medium ${
                        user.phone ? "" : "text-muted-foreground"
                      }`}
                    >
                      {user.phone || "Não informado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Informações Profissionais
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                    <Briefcase className="text-muted-foreground h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground text-sm">Experiência</p>
                    <p
                      className={`font-medium ${
                        user.experience ? "" : "text-muted-foreground"
                      }`}
                    >
                      {user.experience || "Não informado"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                    <GraduationCap className="text-muted-foreground h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground text-sm">Educação</p>
                    <p
                      className={`font-medium ${
                        user.education ? "" : "text-muted-foreground"
                      }`}
                    >
                      {user.education || "Não informado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full border-destructive mt-4">
          <CardHeader>
            <CardTitle className="text-destructive">Perigo</CardTitle>
            <CardDescription>
              Ações irreversíveis relacionadas à sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isDeleting}
                  className="cursor-pointer"
                >
                  {isDeleting ? (
                    <Spinner />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  {isDeleting ? "Deletando..." : "Deletar Conta"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso irá deletar
                    permanentemente sua conta.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteUser}
                    className="bg-destructive cursor-pointer text-destructive-foreground hover:bg-destructive/90"
                  >
                    Deletar Conta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
