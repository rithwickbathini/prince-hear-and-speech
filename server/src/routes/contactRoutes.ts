import { Router } from "express";
import { submitContact } from "../controllers/contactController";
import { bookingLimiter } from "../middleware/rateLimiter";
import { validate } from "../middleware/validate";
import { contactSchema } from "../schemas";

const router = Router();

router.post("/", bookingLimiter, validate(contactSchema), submitContact);

export default router;
