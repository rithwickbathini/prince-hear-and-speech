import type { Therapist } from "../types";
import { api } from "./api";

export const therapistsApi = {
  list: (all = false) => api.get<{ therapists: Therapist[] }>(`/therapists${all ? "?all=true" : ""}`),
  create: (data: Partial<Therapist>) => api.post<{ therapist: Therapist }>("/therapists", data),
  update: (id: string, data: Partial<Therapist>) => api.patch<{ therapist: Therapist }>(`/therapists/${id}`, data),
  remove: (id: string) => api.delete<{ success: boolean; deactivated: boolean }>(`/therapists/${id}`),
};
