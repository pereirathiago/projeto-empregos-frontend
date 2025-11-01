import { jwtDecode } from "jwt-decode";
import api from "./api";

interface JwtPayload {
  sub: string;
  username: string;
  role: string;
  exp: number;
}

export interface User {
  name: string;
  username: string;
  email: string;
  phone: string;
  experience: string;
  education: string;
}

export interface Company {
  name: string;
  username: string;
  business: string;
  street: string;
  number: string;
  city: string;
  state: string;
  phone: string;
  email: string;
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

export function getUserIdFromToken(token: string): string | null {
  const decoded = decodeToken(token);
  return decoded?.sub ?? null;
}

export function setAuthToken(token: string) {
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
}

export function getAuthToken(): string | null {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((c) => c.trim().startsWith("token="));

  if (!tokenCookie) return null;

  return tokenCookie.split("=")[1];
}

export function removeAuthToken() {
  document.cookie = "token=; path=/; max-age=0";
}

export function getUserId(): string | null {
  const token = getAuthToken();

  if (!token) return null;

  return getUserIdFromToken(token);
}

export function getUserRole(): "user" | "company" | null {
  const token = getAuthToken();

  if (!token) return null;

  const decoded = decodeToken(token);
  const role = decoded?.role;

  if (role === "user" || role === "company") {
    return role;
  }

  return null;
}

export async function logout(): Promise<void> {
  try {
    await api.post("/logout");
    removeAuthToken();
  } catch (error) {
    console.error("Logout error:", error);
    removeAuthToken();
  }
}

export async function fetchCurrentUser(): Promise<User> {
  const userId = getUserId();

  if (!userId) {
    throw new Error("No user ID found");
  }

  const response = await api.get<User>(`/users/${userId}`);
  return response.data;
}

export interface UpdateUserData {
  name: string;
  email?: string;
  password: string;
  phone?: string;
  experience?: string;
  education?: string;
}

export async function updateUser(data: UpdateUserData): Promise<void> {
  const userId = getUserId();

  if (!userId) {
    throw new Error("No user ID found");
  }

  await api.patch(`/users/${userId}`, data);
}

export async function deleteUser(): Promise<{ message: string }> {
  const userId = getUserId();

  if (!userId) {
    throw new Error("No user ID found");
  }

  const response = await api.delete<{ message: string }>(`/users/${userId}`);

  return response.data;
}

export async function fetchCurrentCompany(): Promise<Company> {
  const companyId = getUserId();

  if (!companyId) {
    throw new Error("No company ID found");
  }

  const response = await api.get<Company>(`/companies/${companyId}`);

  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Erro ao buscar empresa");
  }
}

export interface UpdateCompanyData {
  name: string;
  business: string;
  password: string;
  street: string;
  number: string;
  city: string;
  state: string;
  phone?: string;
  email?: string;
}

export async function updateCompany(data: UpdateCompanyData): Promise<void> {
  const companyId = getUserId();

  if (!companyId) {
    throw new Error("No company ID found");
  }

  const response = await api.patch(`/companies/${companyId}`, data);

  if (response.status !== 200) {
    throw new Error("Erro ao atualizar empresa");
  }
}

export async function deleteCompany(): Promise<{ message: string }> {
  const companyId = getUserId();

  if (!companyId) {
    throw new Error("No company ID found");
  }

  const response = await api.delete<{ message: string }>(
    `/companies/${companyId}`
  );

  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Erro ao deletar empresa");
  }
}
