import { Router } from "express";
import {
  createAppointment,
  getSlots,
  listAppointments,
  rescheduleAppointment,
  updateAppointmentStatus,
} from "../controllers/appointmentController";
import { bookingLimiter } from "../middleware/rateLimiter";
import { requireAuth } from "../middleware/requireAuth";
import { validate } from "../middleware/validate";
import { createAppointmentSchema, rescheduleAppointmentSchema, updateAppointmentStatusSchema } from "../schemas";

const router = Router();

// Public — patients never need an account to book
router.get("/slots", getSlots);
router.post("/", bookingLimiter, validate(createAppointmentSchema), createAppointment);

// Admin only
router.get("/", requireAuth, listAppointments);
router.patch("/:id/status", requireAuth, validate(updateAppointmentStatusSchema), updateAppointmentStatus);
router.patch("/:id/reschedule", requireAuth, validate(rescheduleAppointmentSchema), rescheduleAppointment);

export default router;
