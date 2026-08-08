import type { Availability } from "../types";
import { api } from "./api";

export const availabilityApi = {
  list: (therapistId?: string) => api.get<{ availability: Availability[] }>(`/availability${therapistId ? `?therapistId=${therapistId}` : ""}`),
  create: (data: Partial<Availability>) => api.post<{ availability: Availability }>("/availability", data),
  update: (id: string, data: Partial<Availability>) => api.patch<{ availability: Availability }>(`/availability/${id}`, data),
  remove: (id: string) => api.delete<{ success: boolean }>(`/availability/${id}`),
};
