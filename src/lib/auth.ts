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

export async function logout(): Promise<void> {
  try {
    await api.post("/logout");
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
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
