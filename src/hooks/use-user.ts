"use client";

import { fetchCurrentUser, removeAuthToken, type User } from "@/lib/auth";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UseUserReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface ApiErrorResponse {
  message: string;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await fetchCurrentUser();
      setUser(userData);
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorData = err.response?.data as ApiErrorResponse;

        if (err.status === 401 || err.status === 403) {
          toast.error("Sessão expirada. Faça login novamente.");
          removeAuthToken();
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
      setIsLoading(false);
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
