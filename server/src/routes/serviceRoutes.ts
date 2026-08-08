import { Router } from "express";
import { createService, deleteService, listServices, updateService } from "../controllers/serviceController";
import { requireAuth } from "../middleware/requireAuth";
import { validate } from "../middleware/validate";
import { createServiceSchema, updateServiceSchema } from "../schemas";

const router = Router();

router.get("/", listServices);
router.post("/", requireAuth, validate(createServiceSchema), createService);
router.patch("/:id", requireAuth, validate(updateServiceSchema), updateService);
router.delete("/:id", requireAuth, deleteService);

export default router;
