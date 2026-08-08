import { z } from "zod";

const serviceCategory = z.enum(["SPEECH_THERAPY", "AUDIOLOGY", "STROKE_REHAB", "HOME_BASED"]);
const appointmentStatus = z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]);

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(1, "Password is required."),
  }),
});

const serviceBody = z.object({
  name: z.string().min(1, "Name is required."),
  category: serviceCategory,
  description: z.string().min(1, "Description is required."),
  active: z.boolean().optional(),
});
export const createServiceSchema = z.object({ body: serviceBody });
export const updateServiceSchema = z.object({ body: serviceBody.partial() });

const therapistBody = z.object({
  name: z.string().min(1, "Name is required."),
  qualification: z.string().min(1, "Qualification is required."),
  specialization: z.string().min(1, "Specialization is required."),
  bio: z.string().min(1, "Bio is required."),
  image: z.string().optional(),
  active: z.boolean().optional(),
});
export const createTherapistSchema = z.object({ body: therapistBody });
export const updateTherapistSchema = z.object({ body: therapistBody.partial() });

const availabilityBody = z.object({
  therapistId: z.string().min(1, "Therapist is required."),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format."),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format."),
  slotDurationMinutes: z.number().int().positive().optional(),
  active: z.boolean().optional(),
});
export const createAvailabilitySchema = z.object({ body: availabilityBody });
export const updateAvailabilitySchema = z.object({ body: availabilityBody.partial() });

export const createAppointmentSchema = z.object({
  body: z.object({
    patientName: z.string().min(1, "Patient name is required."),
    phone: z.string().min(6, "Enter a valid phone number."),
    email: z.union([z.string().email(), z.literal("")]).optional(),
    age: z.union([z.number(), z.string(), z.literal("")]).optional(),
    serviceId: z.string().min(1, "Please select a service."),
    therapistId: z.union([z.string().min(1), z.literal("")]).optional(),
    appointmentDate: z.string().min(1, "Please select a date."),
    appointmentTime: z.string().min(1, "Please select a time."),
    homeVisit: z.boolean().optional(),
    message: z.string().optional(),
  }),
});

export const updateAppointmentStatusSchema = z.object({
  body: z.object({ status: appointmentStatus }),
});

export const rescheduleAppointmentSchema = z.object({
  body: z.object({
    appointmentDate: z.string().min(1, "Please select a date."),
    appointmentTime: z.string().min(1, "Please select a time."),
  }),
});

export const contactSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, "Name is required."),
      email: z.union([z.string().email(), z.literal("")]).optional(),
      phone: z.string().optional(),
      message: z.string().min(1, "Message is required."),
    })
    .refine((data) => Boolean(data.email) || Boolean(data.phone), {
      message: "Provide an email or a phone number so we can reach you.",
      path: ["email"],
    }),
});
