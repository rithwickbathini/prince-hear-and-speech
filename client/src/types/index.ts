export type ServiceCategory = "SPEECH_THERAPY" | "AUDIOLOGY" | "STROKE_REHAB" | "HOME_BASED";
export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  active: boolean;
}

export interface Therapist {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  bio: string;
  image?: string | null;
  active: boolean;
}

export interface Appointment {
  id: string;
  /** Public-facing 4-digit appointment ID (e.g. "0742"). */
  publicId: string;
  patientName: string;
  phone: string;
  email?: string | null;
  age?: number | null;
  serviceId: string;
  service?: Service;
  therapistId?: string | null;
  therapist?: Therapist | null;
  appointmentDate: string;
  appointmentTime: string;
  homeVisit: boolean;
  message?: string | null;
  status: AppointmentStatus;
  rescheduled: boolean;
  createdAt: string;
}

export interface Availability {
  id: string;
  therapistId: string;
  therapist?: { id: string; name: string };
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  active: boolean;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
}

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  SPEECH_THERAPY: "Speech Therapy",
  AUDIOLOGY: "Audiology",
  STROKE_REHAB: "Stroke Rehabilitation",
  HOME_BASED: "Home-Based Therapy",
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
