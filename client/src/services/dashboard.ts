import type { Appointment } from "../types";
import { api } from "./api";

export interface DashboardSummary {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  recent: Appointment[];
}

export const dashboardApi = {
  summary: () => api.get<DashboardSummary>("/dashboard/summary"),
};
