import { Router } from "express";
import { login, logout, me } from "../controllers/authController";
import { loginLimiter } from "../middleware/rateLimiter";
import { requireAuth } from "../middleware/requireAuth";
import { validate } from "../middleware/validate";
import { loginSchema } from "../schemas";

const router = Router();

router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;
