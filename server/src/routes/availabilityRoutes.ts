import { Router } from "express";
import {
  createAvailability,
  deleteAvailability,
  listAvailability,
  updateAvailability,
} from "../controllers/availabilityController";
import { requireAuth } from "../middleware/requireAuth";
import { validate } from "../middleware/validate";
import { createAvailabilitySchema, updateAvailabilitySchema } from "../schemas";

const router = Router();

router.use(requireAuth);
router.get("/", listAvailability);
router.post("/", validate(createAvailabilitySchema), createAvailability);
router.patch("/:id", validate(updateAvailabilitySchema), updateAvailability);
router.delete("/:id", deleteAvailability);

export default router;
