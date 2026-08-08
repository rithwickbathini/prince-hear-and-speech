import { Router } from "express";
import appointmentRoutes from "./appointmentRoutes";
import authRoutes from "./authRoutes";
import availabilityRoutes from "./availabilityRoutes";
import contactRoutes from "./contactRoutes";
import dashboardRoutes from "./dashboardRoutes";
import serviceRoutes from "./serviceRoutes";
import therapistRoutes from "./therapistRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/services", serviceRoutes);
router.use("/therapists", therapistRoutes);
router.use("/availability", availabilityRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/contact", contactRoutes);

export default router;
