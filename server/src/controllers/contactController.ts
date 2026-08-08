import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";

export const submitContact = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, message } = req.body;

  // No email/SMS service was requested — log server-side so the clinic can wire one in later
  // without changing the contract the client relies on.
  console.log("[contact-form]", { name, email, phone, message, receivedAt: new Date().toISOString() });

  res.status(201).json({ success: true });
});
