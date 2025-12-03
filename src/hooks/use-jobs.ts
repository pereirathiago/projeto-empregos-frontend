"use client";

import api from "@/lib/api";
import { getUserId, getUserRole, removeAuthToken } from "@/lib/auth";
import {
  ApplyJobFormData,
  CreateJobFormData,
  Job,
  JobCandidate,
  JobCandidatesResponse,
  JobSearchFilters,
  JobsResponse,
  SendFeedbackFormData,
  UpdateJobFormData,
  UserApplication,
  UserApplicationsResponse,
} from "@/lib/validations/jobs";
import { useJobsStore } from "@/store/jobs-store";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Array<{
    field: string;
    error: string;
  }>;
}

export function useJobs() {
  const {
    jobs,
    companyJobs,
    selectedJob,
    isLoading,
    error,
    setJobs,
    setCompanyJobs,
    setSelectedJob,
    setLoading,
    setError,
    removeJob,
    clearJobs,
  } = useJobsStore();

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [userApplications, setUserApplications] = useState<UserApplication[]>(
    []
  );
  const [jobCandidates, setJobCandidates] = useState<JobCandidate[]>([]);
  const router = useRouter();

  const handleAuthError = useCallback(
    (status: number) => {
      if (status === 401) {
        toast.error("Sessão expirada. Faça login novamente.");
        removeAuthToken();
        clearJobs();
        router.push("/sign-in");
        return true;
      }
      if (status === 403) {
        toast.error("Você não tem permissão para realizar esta ação.");
        return true;
      }
      return false;
    },
    [clearJobs, router]
  );

  const searchJobs = useCallback(
    async (filters?: JobSearchFilters) => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.post<JobsResponse>("/jobs/search", {
          filters: filters
            ? [
                {
                  title: filters.title || undefined,
                  area: filters.area || undefined,
                  company: filters.company || undefined,
                  state: filters.state || undefined,
                  city: filters.city || undefined,
                  salary_range: filters.salary_range || undefined,
                },
              ]
            : [],
        });

        setJobs(response.data.items || []);
        return response.data.items || [];
      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          const status = err.response.status;
          if (handleAuthError(status)) return [];

          if (status === 404) {
            setJobs([]);
            return [];
          }

          const errorData = err.response.data as ApiErrorResponse;
          const message = errorData.message || "Erro ao buscar vagas";
          setError(message);
          toast.error(message);
        } else {
          setError("Erro ao buscar vagas");
          toast.error("Erro ao buscar vagas. Tente novamente.");
        }
        return [];
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError, setError, setJobs, setLoading]
  );

  const getJobById = useCallback(
    async (jobId: number) => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get<Job>(`/jobs/${jobId}`);
        setSelectedJob(response.data);
        return response.data;
      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          const status = err.response.status;
          if (handleAuthError(status)) return null;

          if (status === 404) {
            toast.error("Vaga não encontrada");
            return null;
          }

          const errorData = err.response.data as ApiErrorResponse;
          const message = errorData.message || "Erro ao buscar vaga";
          setError(message);
          toast.error(message);
        } else {
          setError("Erro ao buscar vaga");
          toast.error("Erro ao buscar vaga. Tente novamente.");
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError, setError, setLoading, setSelectedJob]
  );

  const getCompanyJobs = useCallback(
    async (filters?: Omit<JobSearchFilters, "company">) => {
      try {
        setLoading(true);
        setError(null);

        const companyId = getUserId();
        if (!companyId) {
          toast.error("Sessão expirada. Faça login novamente.");
          router.push("/sign-in");
          return [];
        }

        const role = getUserRole();
        if (role !== "company") {
          toast.error("Apenas empresas podem acessar suas vagas.");
          return [];
        }

        const response = await api.post<JobsResponse>(
          `/companies/${companyId}/jobs`,
          {
            filters: filters
              ? [
                  {
                    title: filters.title || undefined,
                    area: filters.area || undefined,
                    state: filters.state || undefined,
                    city: filters.city || undefined,
                    salary_range: filters.salary_range || undefined,
                  },
                ]
              : [],
          }
        );

        setCompanyJobs(response.data.items || []);
        return response.data.items || [];
      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          const status = err.response.status;
          if (handleAuthError(status)) return [];

          if (status === 404) {
            setCompanyJobs([]);
            return [];
          }

          const errorData = err.response.data as ApiErrorResponse;
          const message =
            errorData.message || "Erro ao buscar vagas da empresa";
          setError(message);
          toast.error(message);
        } else {
          setError("Erro ao buscar vagas da empresa");
          toast.error("Erro ao buscar vagas da empresa. Tente novamente.");
        }
        return [];
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError, router, setCompanyJobs, setError, setLoading]
  );

  const createJob = useCallback(
    async (data: CreateJobFormData) => {
      try {
        setLoading(true);
        setError(null);
        setFormErrors({});

        const role = getUserRole();
        if (role !== "company") {
          toast.error("Apenas empresas podem criar vagas.");
          return false;
        }

        await api.post("/jobs", data);
        toast.success("Vaga criada com sucesso!");
        return true;
      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          const status = err.response.status;
          if (handleAuthError(status)) return false;

          const errorData = err.response.data as ApiErrorResponse;

          if (status === 422 && errorData.details) {
            const fieldErrors: Record<string, string> = {};
            errorData.details.forEach((detail) => {
              fieldErrors[detail.field] = detail.error;
            });
            setFormErrors(fieldErrors);
            toast.error("Erro de validação. Verifique os campos.");
            return false;
          }

          const message = errorData.message || "Erro ao criar vaga";
          setError(message);
          toast.error(message);
        } else {
          setError("Erro ao criar vaga");
          toast.error("Erro ao criar vaga. Tente novamente.");
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError, setError, setLoading]
  );

  const updateJob = useCallback(
    async (jobId: number, data: UpdateJobFormData) => {
      try {
        setLoading(true);
        setError(null);
        setFormErrors({});

        const role = getUserRole();
        if (role !== "company") {
          toast.error("Apenas empresas podem editar vagas.");
          return false;
        }

        await api.patch(`/jobs/${jobId}`, data);
        toast.success("Vaga atualizada com sucesso!");
        return true;
      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          const status = err.response.status;
          if (handleAuthError(status)) return false;

          if (status === 404) {
            toast.error("Vaga não encontrada");
            return false;
          }

          const errorData = err.response.data as ApiErrorResponse;

          if (status === 422 && errorData.details) {
            const fieldErrors: Record<string, string> = {};
            errorData.details.forEach((detail) => {
              fieldErrors[detail.field] = detail.error;
            });
            setFormErrors(fieldErrors);
            toast.error("Erro de validação. Verifique os campos.");
            return false;
          }

          const message = errorData.message || "Erro ao atualizar vaga";
          setError(message);
          toast.error(message);
        } else {
          setError("Erro ao atualizar vaga");
          toast.error("Erro ao atualizar vaga. Tente novamente.");
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError, setError, setLoading]
  );

  const deleteJob = useCallback(
    async (jobId: number) => {
      try {
        setLoading(true);
        setError(null);

        const role = getUserRole();
        if (role !== "company") {
          toast.error("Apenas empresas podem deletar vagas.");
          return false;
        }

        await api.delete(`/jobs/${jobId}`);
        removeJob(jobId);
        toast.success("Vaga deletada com sucesso!");
        return true;
      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          const status = err.response.status;
          if (handleAuthError(status)) return false;

          if (status === 404) {
            toast.error("Vaga não encontrada");
            return false;
          }

          const errorData = err.response.data as ApiErrorResponse;
          const message = errorData.message || "Erro ao deletar vaga";
          setError(message);
          toast.error(message);
        } else {
          setError("Erro ao deletar vaga");
          toast.error("Erro ao deletar vaga. Tente novamente.");
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError, removeJob, setError, setLoading]
  );

  const applyToJob = useCallback(
    async (jobId: number, data: ApplyJobFormData) => {
      try {
        setLoading(true);
        setError(null);
        setFormErrors({});

        const role = getUserRole();
        if (role !== "user") {
          toast.error("Apenas usuários podem se candidatar a vagas.");
          return false;
        }

        await api.post(`/jobs/${jobId}`, data);
        toast.success("Candidatura enviada com sucesso!");
        return true;
      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          const status = err.response.status;
          if (handleAuthError(status)) return false;

          if (status === 404) {
            toast.error("Vaga não encontrada");
            return false;
          }

          const errorData = err.response.data as ApiErrorResponse;

          if (status === 422 && errorData.details) {
            const fieldErrors: Record<string, string> = {};
            errorData.details.forEach((detail) => {
              fieldErrors[detail.field] = detail.error;
            });
            setFormErrors(fieldErrors);
            toast.error("Erro de validação. Verifique os campos.");
            return false;
          }

          const message = errorData.message || "Erro ao se candidatar";
          setError(message);
          toast.error(message);
        } else {
          setError("Erro ao se candidatar");
          toast.error("Erro ao se candidatar. Tente novamente.");
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError, setError, setLoading]
  );

  // Listar candidaturas do usuário logado
  const getUserApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = getUserId();
      if (!userId) {
        toast.error("Sessão expirada. Faça login novamente.");
        router.push("/sign-in");
        return [];
      }

      const role = getUserRole();
      if (role !== "user") {
        toast.error("Apenas usuários podem ver suas candidaturas.");
        return [];
      }

      const response = await api.get<UserApplicationsResponse>(
        `/users/${userId}/jobs`
      );

      setUserApplications(response.data.items || []);
      return response.data.items || [];
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        const status = err.response.status;
        if (handleAuthError(status)) return [];

        if (status === 404) {
          setUserApplications([]);
          return [];
        }

        const errorData = err.response.data as ApiErrorResponse;
        const message = errorData.message || "Erro ao buscar candidaturas";
        setError(message);
        toast.error(message);
      } else {
        setError("Erro ao buscar candidaturas");
        toast.error("Erro ao buscar candidaturas. Tente novamente.");
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, [handleAuthError, router, setError, setLoading]);

  // Listar candidatos de uma vaga (empresa)
  const getJobCandidates = useCallback(
    async (jobId: number) => {
      try {
        setLoading(true);
        setError(null);

        const companyId = getUserId();
        if (!companyId) {
          toast.error("Sessão expirada. Faça login novamente.");
          router.push("/sign-in");
          return [];
        }

        const role = getUserRole();
        if (role !== "company") {
          toast.error("Apenas empresas podem ver os candidatos.");
          return [];
        }

        const response = await api.get<JobCandidatesResponse>(
          `/companies/${companyId}/jobs/${jobId}`
        );

        setJobCandidates(response.data.items || []);
        return response.data.items || [];
      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          const status = err.response.status;
          if (handleAuthError(status)) return [];

          if (status === 404) {
            toast.error("Vaga não encontrada");
            setJobCandidates([]);
            return [];
          }

          const errorData = err.response.data as ApiErrorResponse;
          const message = errorData.message || "Erro ao buscar candidatos";
          setError(message);
          toast.error(message);
        } else {
          setError("Erro ao buscar candidatos");
          toast.error("Erro ao buscar candidatos. Tente novamente.");
        }
        return [];
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError, router, setError, setLoading]
  );

  // Enviar feedback para candidato
  const sendFeedback = useCallback(
    async (jobId: number, data: SendFeedbackFormData) => {
      try {
        setLoading(true);
        setError(null);
        setFormErrors({});

        const role = getUserRole();
        if (role !== "company") {
          toast.error("Apenas empresas podem enviar feedback.");
          return false;
        }

        await api.post(`/jobs/${jobId}/feedback`, data);
        toast.success("Feedback enviado com sucesso!");
        return true;
      } catch (err) {
        if (err instanceof AxiosError && err.response) {
          const status = err.response.status;
          if (handleAuthError(status)) return false;

          if (status === 404) {
            toast.error("Vaga ou usuário não encontrado");
            return false;
          }

          const errorData = err.response.data as ApiErrorResponse;

          if (status === 422 && errorData.details) {
            const fieldErrors: Record<string, string> = {};
            errorData.details.forEach((detail) => {
              fieldErrors[detail.field] = detail.error;
            });
            setFormErrors(fieldErrors);
            toast.error("Erro de validação. Verifique os campos.");
            return false;
          }

          const message = errorData.message || "Erro ao enviar feedback";
          setError(message);
          toast.error(message);
        } else {
          setError("Erro ao enviar feedback");
          toast.error("Erro ao enviar feedback. Tente novamente.");
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError, setError, setLoading]
  );

  return {
    jobs,
    companyJobs,
    selectedJob,
    userApplications,
    jobCandidates,
    isLoading,
    error,
    formErrors,
    setFormErrors,
    searchJobs,
    getJobById,
    getCompanyJobs,
    createJob,
    updateJob,
    deleteJob,
    applyToJob,
    getUserApplications,
    getJobCandidates,
    sendFeedback,
    clearJobs,
  };
}
