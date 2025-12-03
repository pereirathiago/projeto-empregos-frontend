"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useJobs } from "@/hooks/use-jobs";
import {
  ApplyJobFormData,
  Job,
  JobSearchFilters,
} from "@/lib/validations/jobs";
import { Briefcase, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApplyJobDialog } from "../../jobs/components/apply-job-dialog";
import { JobCard } from "../../jobs/components/job-card";
import { JobFilters } from "../../jobs/components/job-filters";

export function UserDashboard() {
  const { jobs, isLoading, searchJobs, applyToJob, formErrors } = useJobs();
  const [hasSearched, setHasSearched] = useState(false);
  const [jobToApply, setJobToApply] = useState<Job | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    searchJobs();
    setHasSearched(true);
  }, [searchJobs]);

  const handleFilter = async (filters: JobSearchFilters) => {
    await searchJobs(filters);
    setHasSearched(true);
  };

  const handleViewDetails = (job: Job) => {
    router.push(`/jobs/${job.job_id}`);
  };

  const handleApply = (job: Job) => {
    setJobToApply(job);
  };

  const confirmApply = async (data: ApplyJobFormData) => {
    if (!jobToApply) return false;

    setIsApplying(true);
    const success = await applyToJob(jobToApply.job_id, data);
    setIsApplying(false);

    if (success) {
      setJobToApply(null);
    }
    return success;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vagas de Emprego</h1>
        <p className="text-muted-foreground">
          Encontre as melhores oportunidades para sua carreira
        </p>
      </div>

      <JobFilters onFilter={handleFilter} isLoading={isLoading} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job: Job) => (
            <JobCard
              key={job.job_id}
              job={job}
              showApplyButton
              onViewDetails={handleViewDetails}
              onApply={handleApply}
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
          <h3 className="text-lg font-semibold">Busque por vagas</h3>
          <p className="text-muted-foreground">
            Use os filtros acima para encontrar oportunidades
          </p>
        </div>
      )}

      <ApplyJobDialog
        job={jobToApply}
        open={!!jobToApply}
        onOpenChange={(open) => !open && setJobToApply(null)}
        onSubmit={confirmApply}
        isLoading={isApplying}
        formErrors={formErrors}
      />
    </div>
  );
}
