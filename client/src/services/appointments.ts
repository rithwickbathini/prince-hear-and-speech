import type { Appointment, AppointmentStatus } from "../types";
import { api } from "./api";

export interface BookAppointmentInput {
  patientName: string;
  phone: string;
  email?: string;
  age?: string;
  serviceId: string;
  therapistId?: string;
  appointmentDate: string;
  appointmentTime: string;
  homeVisit: boolean;
  message?: string;
}

export const appointmentsApi = {
  getSlots: (therapistId: string, date: string, excludeAppointmentId?: string) =>
    api.get<{ slots: string[] }>(
      `/appointments/slots?therapistId=${therapistId}&date=${date}${
        excludeAppointmentId ? `&excludeAppointmentId=${excludeAppointmentId}` : ""
      }`,
    ),
  create: (data: BookAppointmentInput) => api.post<{ appointment: Appointment }>("/appointments", data),
  list: (status?: AppointmentStatus) =>
    api.get<{ appointments: Appointment[] }>(`/appointments${status ? `?status=${status}` : ""}`),
  updateStatus: (id: string, status: AppointmentStatus) =>
    api.patch<{ appointment: Appointment }>(`/appointments/${id}/status`, { status }),
  reschedule: (id: string, appointmentDate: string, appointmentTime: string) =>
    api.patch<{ appointment: Appointment }>(`/appointments/${id}/reschedule`, { appointmentDate, appointmentTime }),
};
