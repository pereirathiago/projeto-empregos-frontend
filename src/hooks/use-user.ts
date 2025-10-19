"use client";

import { fetchCurrentUser, removeAuthToken } from "@/lib/auth";
import { useUserStore } from "@/store/user-store";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

interface ApiErrorResponse {
  message: string;
}

export function useUser() {
  const { user, isLoading, error, setUser, setLoading, setError, clearUser } =
    useUserStore();
  const router = useRouter();

  const fetchUser = async () => {
    if (user) return;

    try {
      setLoading(true);
      setError(null);
      const userData = await fetchCurrentUser();
      setUser(userData);
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorData = err.response?.data as ApiErrorResponse;

        if (err.status === 401 || err.status === 403) {
          const message = "Sessão expirada. Faça login novamente.";
          toast.error(message);
          removeAuthToken();
          clearUser();
          router.push("/sign-in");
          return;
        }

        if (err.status === 404) {
          const message = "Usuário não encontrado";
          setError(message);
          toast.error(message);
          return;
        }

        const message = errorData?.message || "Erro ao buscar dados do usuário";
        setError(message);
        toast.error(message);
      } else if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        const message = "Erro ao buscar dados do usuário";
        setError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    user,
    isLoading,
    error,
    refetch: fetchUser,
  };
}
