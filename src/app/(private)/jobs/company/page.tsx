"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobs } from "@/hooks/use-jobs";
import { getUserRole } from "@/lib/auth";
import { Job, JobSearchFilters } from "@/lib/validations/jobs";
import { Briefcase, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DeleteJobDialog } from "../components/delete-job-dialog";
import { JobCard } from "../components/job-card";
import { JobFilters } from "../components/job-filters";

export default function CompanyJobsPage() {
  const { companyJobs, isLoading, getCompanyJobs, deleteJob } = useJobs();
  const [role, setRole] = useState<"user" | "company" | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);

    if (userRole !== "company") {
      toast.error("Apenas empresas podem acessar esta página");
      router.push("/jobs");
    }
  }, [router]);

  useEffect(() => {
    if (role === "company") {
      getCompanyJobs();
      setHasSearched(true);
    }
  }, [role, getCompanyJobs]);

  const handleFilter = async (filters: JobSearchFilters) => {
    await getCompanyJobs(filters);
    setHasSearched(true);
  };

  const handleEdit = (job: Job) => {
    router.push(`/jobs/${job.job_id}/edit`);
  };

  const handleDelete = (job: Job) => {
    setJobToDelete(job);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;

    setIsDeleting(true);
    const success = await deleteJob(jobToDelete.job_id);
    setIsDeleting(false);

    if (success) {
      setJobToDelete(null);
    }
  };

  if (!role || role !== "company") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minhas Vagas</h1>
          <p className="text-muted-foreground">
            Gerencie as vagas da sua empresa
          </p>
        </div>
        <Button asChild>
          <Link href="/jobs/new">
            <Plus className="size-4" />
            Nova Vaga
          </Link>
        </Button>
      </div>

      <JobFilters
        onFilter={handleFilter}
        isLoading={isLoading}
        showCompanyFilter={false}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : companyJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companyJobs.map((job: Job) => (
            <JobCard
              key={job.job_id}
              job={job}
              showActions
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : hasSearched ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="size-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Nenhuma vaga encontrada</h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros de busca
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Briefcase className="size-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Nenhuma vaga cadastrada</h3>
          <p className="text-muted-foreground mb-4">
            Comece criando sua primeira vaga
          </p>
          <Button asChild>
            <Link href="/jobs/new">
              <Plus className="size-4" />
              Criar Vaga
            </Link>
          </Button>
        </div>
      )}

      <DeleteJobDialog
        job={jobToDelete}
        open={!!jobToDelete}
        onOpenChange={(open) => !open && setJobToDelete(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
