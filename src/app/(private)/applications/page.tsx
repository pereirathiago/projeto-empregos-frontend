"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobs } from "@/hooks/use-jobs";
import { getUserRole } from "@/lib/auth";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  ClipboardList,
  FileText,
  MapPin,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MyApplicationsPage() {
  const { userApplications, getUserApplications, isLoading } = useJobs();
  const [role, setRole] = useState<"user" | "company" | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);

    if (userRole !== "user") {
      toast.error("Apenas usuários podem acessar esta página");
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (role === "user") {
      getUserApplications();
    }
  }, [role, getUserApplications]);

  if (!role || role !== "user") {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/">
          <ArrowLeft className="size-4" />
          Voltar para início
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ClipboardList className="size-8" />
          Minhas Candidaturas
        </h1>
        <p className="text-muted-foreground">
          Acompanhe o status das suas candidaturas
        </p>
      </div>

      {userApplications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userApplications.map((application) => (
            <Card key={application.job_id} className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-2">
                  {application.title}
                </CardTitle>
                <CardDescription className="flex flex-col gap-1">
                  <span className="flex items-center gap-1">
                    <Building2 className="size-3" />
                    {application.company_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {application.city}, {application.state}
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="size-4 text-muted-foreground" />
                  <span className="text-sm">{application.area}</span>
                </div>

                {application.applied_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span className="text-sm">
                      Candidatou-se em{" "}
                      {new Date(application.applied_at).toLocaleDateString(
                        "pt-BR"
                      )}
                    </span>
                  </div>
                )}

                {application.feedback && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="size-4 text-primary" />
                      <span className="text-sm font-medium">
                        Feedback da empresa
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-4">
                      {application.feedback}
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/jobs/${application.job_id}`}>
                    <FileText className="size-4" />
                    Ver vaga
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ClipboardList className="size-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">
            Nenhuma candidatura encontrada
          </h3>
          <p className="text-muted-foreground mb-4">
            Você ainda não se candidatou a nenhuma vaga
          </p>
          <Button asChild>
            <Link href="/jobs">
              <Briefcase className="size-4" />
              Explorar vagas
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
