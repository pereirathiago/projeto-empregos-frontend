"use client";

import { fetchCurrentCompany, getUserRole, removeAuthToken } from "@/lib/auth";
import { useCompanyStore } from "@/store/company-store";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

interface ApiErrorResponse {
  message: string;
}

export function useCompany() {
  const {
    company,
    isLoading,
    error,
    setCompany,
    setLoading,
    setError,
    clearCompany,
  } = useCompanyStore();
  const router = useRouter();

  const fetchCompany = async () => {
    if (company) return;

    try {
      if (getUserRole() !== "company") {
        return;
      }
      setLoading(true);
      setError(null);
      const companyData = await fetchCurrentCompany();
      setCompany(companyData);
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        const errorData = err.response.data as ApiErrorResponse;

        if (
          err.response.status === 401 ||
          err.response.status === 404 ||
          err.response.status === 403
        ) {
          const message =
            err.response.status === 403
              ? "Você não tem permissão para acessar este recurso."
              : "Sessão expirada. Faça login novamente.";
          toast.error(message);
          removeAuthToken();
          clearCompany();
          router.push("/sign-in");
          return;
        }

        const message = errorData.message || "Erro ao buscar dados da empresa";
        setError(message);
        toast.error(message);
      } else if (err instanceof Error) {
        const message = err.message || "Erro ao buscar dados da empresa";
        setError(message);
        toast.error(message);
      } else {
        const message = "Erro ao buscar dados da empresa";
        setError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    user: company,
    isLoading,
    error,
    refetch: fetchCompany,
  };
}
