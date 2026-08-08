import type { Admin } from "../types";
import { api } from "./api";

export const authApi = {
  login: (email: string, password: string) => api.post<{ admin: Admin }>("/auth/login", { email, password }),
  logout: () => api.post<{ success: boolean }>("/auth/logout"),
  me: () => api.get<{ admin: Admin }>("/auth/me"),
};
