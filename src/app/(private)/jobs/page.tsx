"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useJobs } from "@/hooks/use-jobs";
import { getUserRole } from "@/lib/auth";
import { Job, JobSearchFilters } from "@/lib/validations/jobs";
import { Briefcase, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { JobCard } from "./components/job-card";
import { JobFilters } from "./components/job-filters";

export default function JobsPage() {
  const { jobs, isLoading, searchJobs } = useJobs();
  const [role, setRole] = useState<"user" | "company" | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
  }, []);

  useEffect(() => {
    if (role) {
      searchJobs();
      setHasSearched(true);
    }
  }, [role, searchJobs]);

  const handleFilter = async (filters: JobSearchFilters) => {
    await searchJobs(filters);
    setHasSearched(true);
  };

  if (!role) {
    return null;
  }

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
            <JobCard key={job.job_id} job={job} />
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
    </div>
  );
}
