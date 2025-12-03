"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobs } from "@/hooks/use-jobs";
import { getUserRole } from "@/lib/auth";
import { ApplyJobFormData } from "@/lib/validations/jobs";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Mail,
  MapPin,
  Send,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApplyJobDialog } from "../components/apply-job-dialog";

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = Number(params.id);
  const { selectedJob, getJobById, applyToJob, isLoading, formErrors } =
    useJobs();
  const [role, setRole] = useState<"user" | "company" | null>(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, []);

  useEffect(() => {
    if (role && jobId) {
      getJobById(jobId);
    }
  }, [role, jobId, getJobById]);

  const formatSalary = (salary: number | null) => {
    if (!salary) return "A combinar";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(salary);
  };

  const handleApply = async (data: ApplyJobFormData) => {
    setIsApplying(true);
    const success = await applyToJob(jobId, data);
    setIsApplying(false);
    return success;
  };

  if (!role) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!selectedJob) {
    return (
      <div className="space-y-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/jobs">
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </Button>
        <div className="text-center py-12">
          <Briefcase className="size-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Vaga não encontrada</h1>
          <p className="text-muted-foreground mt-2">
            A vaga que você está procurando não existe ou foi removida.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/jobs">
          <ArrowLeft className="size-4" />
          Voltar para vagas
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{selectedJob.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-base">
                <Building2 className="size-5" />
                {selectedJob.company}
              </CardDescription>
            </div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Tag className="size-4 mr-1" />
              {selectedJob.area}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <MapPin className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Localização</p>
                <p className="font-medium">
                  {selectedJob.city}, {selectedJob.state}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Briefcase className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Salário</p>
                <p className="font-medium">
                  {formatSalary(selectedJob.salary)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Mail className="size-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Contato</p>
                <p className="font-medium truncate">{selectedJob.contact}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Descrição da Vaga</h3>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {selectedJob.description}
            </p>
          </div>

          <div className="pt-4 border-t flex flex-col sm:flex-row gap-3">
            {role === "user" && (
              <Button size="lg" onClick={() => setShowApplyDialog(true)}>
                <Send className="size-4" />
                Candidatar-se
              </Button>
            )}
            <Button
              asChild
              size="lg"
              variant={role === "user" ? "outline" : "default"}
            >
              <a href={`mailto:${selectedJob.contact}`}>
                <Mail className="size-4" />
                Enviar currículo por email
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {role === "user" && (
        <ApplyJobDialog
          job={selectedJob}
          open={showApplyDialog}
          onOpenChange={setShowApplyDialog}
          onSubmit={handleApply}
          isLoading={isApplying}
          formErrors={formErrors}
        />
      )}
    </div>
  );
}
