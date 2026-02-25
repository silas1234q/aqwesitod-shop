import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";
import authRoutes from "./routers/auth.route";
import cartRoutes from './routers/cart.routes'

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://silas1234q.github.io",
      "https://silas1234q.github.io/aquesitod-shop"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(morgan(":method :url :status :response-time ms"));

app.use(clerkMiddleware());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api", cartRoutes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("ERROR:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
