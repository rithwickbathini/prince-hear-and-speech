import type { Service } from "../types";
import { api } from "./api";

export const serviceCatalogApi = {
  list: (all = false) => api.get<{ services: Service[] }>(`/services${all ? "?all=true" : ""}`),
  create: (data: Partial<Service>) => api.post<{ service: Service }>("/services", data),
  update: (id: string, data: Partial<Service>) => api.patch<{ service: Service }>(`/services/${id}`, data),
  remove: (id: string) => api.delete<{ success: boolean; deactivated: boolean }>(`/services/${id}`),
};
