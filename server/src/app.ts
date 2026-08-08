import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import { errorHandler, notFound } from "./middleware/errorHandler";
import routes from "./routes";

export function createApp(): Express {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_URL ?? "http://localhost:5173",
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api", routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
