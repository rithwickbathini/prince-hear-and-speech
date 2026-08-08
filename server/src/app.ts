import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import path from "path";
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
  app.use("/api", notFound);

  // In production this single service also serves the built client, so the
  // whole site lives behind one URL/origin instead of a separate frontend host.
  if (process.env.NODE_ENV === "production") {
    const clientDist = path.resolve(__dirname, "../../client/dist");
    app.use(express.static(clientDist));
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(clientDist, "index.html"));
    });
  }

  app.use(errorHandler);

  return app;
}
