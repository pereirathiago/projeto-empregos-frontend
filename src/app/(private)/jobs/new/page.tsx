"use client";

import { useJobs } from "@/hooks/use-jobs";
import { getUserRole } from "@/lib/auth";
import { CreateJobFormData } from "@/lib/validations/jobs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { JobForm } from "../components/job-form";

export default function NewJobPage() {
  const { createJob, isLoading, formErrors, setFormErrors } = useJobs();
  const [role, setRole] = useState<"user" | "company" | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);

    if (userRole !== "company") {
      toast.error("Apenas empresas podem criar vagas");
      router.push("/jobs");
    }
  }, [router]);

  const handleSubmit = async (data: CreateJobFormData) => {
    setFormErrors({});
    return await createJob(data);
  };

  if (!role || role !== "company") {
    return null;
  }

  return (
    <JobForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      formErrors={formErrors}
      title="Cadastrar Nova Vaga"
      description="Preencha os dados para criar uma nova vaga de emprego"
    />
  );
}
