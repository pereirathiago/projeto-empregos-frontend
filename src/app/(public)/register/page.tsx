import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Briefcase, Building2, User } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Criar conta - Empregos",
};

export default function RegisterPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Briefcase className="size-4" />
          </div>
          <h1>Empregos.</h1>
        </div>
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">Como deseja se cadastrar?</h2>
          <p className="text-muted-foreground mt-2">
            Escolha o tipo de conta que deseja criar
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/register/user" className="cursor-pointer">
            <Card className="hover:border-primary transition-colors h-full">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto bg-primary text-primary-foreground flex size-16 items-center justify-center rounded-lg">
                  <User className="size-8" />
                </div>
                <CardTitle className="text-xl">Sou Candidato</CardTitle>
                <CardDescription className="text-base">
                  Busco oportunidades de emprego e quero me candidatar a vagas
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/register/company" className="cursor-pointer">
            <Card className="hover:border-primary transition-colors h-full">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto bg-primary text-primary-foreground flex size-16 items-center justify-center rounded-lg">
                  <Building2 className="size-8" />
                </div>
                <CardTitle className="text-xl">Sou Empresa</CardTitle>
                <CardDescription className="text-base">
                  Quero publicar vagas e encontrar candidatos qualificados
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
