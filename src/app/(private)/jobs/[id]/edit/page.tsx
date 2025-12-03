"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useJobs } from "@/hooks/use-jobs";
import { getUserRole } from "@/lib/auth";
import { CreateJobFormData, JobArea, JOB_AREAS } from "@/lib/validations/jobs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { JobForm } from "../../components/job-form";

export default function EditJobPage() {
  const params = useParams();
  const jobId = Number(params.id);
  const { selectedJob, getJobById, updateJob, isLoading, formErrors, setFormErrors } =
    useJobs();
  const [role, setRole] = useState<"user" | "company" | null>(null);
  const [isLoadingJob, setIsLoadingJob] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);

    if (userRole !== "company") {
      toast.error("Apenas empresas podem editar vagas");
      router.push("/jobs");
    }
  }, [router]);

  useEffect(() => {
    if (role === "company" && jobId) {
      setIsLoadingJob(true);
      getJobById(jobId).finally(() => setIsLoadingJob(false));
    }
  }, [role, jobId, getJobById]);

  const handleSubmit = async (data: CreateJobFormData) => {
    setFormErrors({});
    return await updateJob(jobId, data);
  };

  if (!role || role !== "company") {
    return null;
  }

  if (isLoadingJob) {
    return (
      <div className="space-y-6 flex flex-col w-full items-center">
        <div className="w-full max-w-2xl pl-3">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-64 mt-2" />
        </div>
        <div className="w-full max-w-2xl">
          <Skeleton className="h-[600px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!selectedJob) {
    return (
      <div className="space-y-6 flex flex-col w-full items-center">
        <div className="w-full max-w-2xl text-center py-12">
          <h1 className="text-2xl font-bold">Vaga não encontrada</h1>
          <p className="text-muted-foreground mt-2">
            A vaga que você está tentando editar não existe ou foi removida.
          </p>
        </div>
      </div>
    );
  }

  const initialData: Partial<CreateJobFormData> = {
    title: selectedJob.title,
    area: JOB_AREAS.includes(selectedJob.area as JobArea)
      ? (selectedJob.area as JobArea)
      : undefined,
    description: selectedJob.description,
    state: selectedJob.state,
    city: selectedJob.city,
    salary: selectedJob.salary ?? undefined,
  };

  return (
    <JobForm
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      formErrors={formErrors}
      title="Editar Vaga"
      description="Atualize as informações da vaga"
    />
  );
}
