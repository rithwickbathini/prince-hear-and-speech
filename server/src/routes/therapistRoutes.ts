import { Router } from "express";
import { createTherapist, deleteTherapist, listTherapists, updateTherapist } from "../controllers/therapistController";
import { requireAuth } from "../middleware/requireAuth";
import { validate } from "../middleware/validate";
import { createTherapistSchema, updateTherapistSchema } from "../schemas";

const router = Router();

router.get("/", listTherapists);
router.post("/", requireAuth, validate(createTherapistSchema), createTherapist);
router.patch("/:id", requireAuth, validate(updateTherapistSchema), updateTherapist);
router.delete("/:id", requireAuth, deleteTherapist);

export default router;
