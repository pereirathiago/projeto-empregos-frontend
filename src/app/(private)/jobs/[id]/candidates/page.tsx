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
import { JobCandidate, SendFeedbackFormData } from "@/lib/validations/jobs";
import {
  ArrowLeft,
  GraduationCap,
  Mail,
  MessageSquare,
  Phone,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SendFeedbackDialog } from "../../components/send-feedback-dialog";

export default function JobCandidatesPage() {
  const params = useParams();
  const jobId = Number(params.id);
  const {
    selectedJob,
    jobCandidates,
    getJobById,
    getJobCandidates,
    sendFeedback,
    isLoading,
    formErrors,
  } = useJobs();
  const [role, setRole] = useState<"user" | "company" | null>(null);
  const [candidateToFeedback, setCandidateToFeedback] =
    useState<JobCandidate | null>(null);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);

    if (userRole !== "company") {
      toast.error("Apenas empresas podem acessar esta página");
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (role === "company" && jobId) {
      getJobById(jobId);
      getJobCandidates(jobId);
    }
  }, [role, jobId, getJobById, getJobCandidates]);

  const handleSendFeedback = (candidate: JobCandidate) => {
    setCandidateToFeedback(candidate);
  };

  const confirmSendFeedback = async (
    jobIdParam: number,
    data: SendFeedbackFormData
  ) => {
    setIsSending(true);
    const success = await sendFeedback(jobIdParam, data);
    setIsSending(false);

    if (success) {
      setCandidateToFeedback(null);
    }
    return success;
  };

  if (!role || role !== "company") {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-24 w-full rounded-xl" />
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
          Voltar para vagas
        </Link>
      </Button>

      {selectedJob && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedJob.title}</CardTitle>
            <CardDescription>
              {selectedJob.city}, {selectedJob.state}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Users className="size-6" />
          Candidatos ({jobCandidates.length})
        </h2>
        <p className="text-muted-foreground">
          Gerencie os candidatos desta vaga
        </p>
      </div>

      {jobCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobCandidates.map((candidate) => (
            <Card key={candidate.user_id} className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="size-5" />
                  {candidate.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 space-y-3">
                <div className="flex flex-col gap-2 text-sm">
                  {candidate.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="size-4" />
                      <span className="truncate">{candidate.email}</span>
                    </div>
                  )}

                  {candidate.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="size-4" />
                      <span>{candidate.phone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Formação
                      </p>
                      <p className="text-sm line-clamp-2">
                        {candidate.education}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <User className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Experiência
                      </p>
                      <p className="text-sm line-clamp-2">
                        {candidate.experience}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleSendFeedback(candidate)}
                >
                  <MessageSquare className="size-4" />
                  Enviar Feedback
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="size-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Nenhum candidato</h3>
          <p className="text-muted-foreground">
            Esta vaga ainda não recebeu candidaturas
          </p>
        </div>
      )}

      <SendFeedbackDialog
        candidate={candidateToFeedback}
        jobId={jobId}
        open={!!candidateToFeedback}
        onOpenChange={(open) => !open && setCandidateToFeedback(null)}
        onSubmit={confirmSendFeedback}
        isLoading={isSending}
        formErrors={formErrors}
      />
    </div>
  );
}
