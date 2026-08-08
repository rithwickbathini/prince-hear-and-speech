import { Router } from "express";
import { getSummary } from "../controllers/dashboardController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.get("/summary", requireAuth, getSummary);

export default router;
