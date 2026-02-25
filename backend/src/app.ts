import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";
import authRoutes from "./routers/auth.route";
import cartRoutes from "./routers/cart.routes";
import path from "node:path";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
     " https://aqwesitod-shop.onrender.com"
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

//serve frontend
const dispatch = path.resolve(process.cwd(), "frontend", "dist");
app.use(express.static(dispatch));

//spa fallback for react router
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(dispatch, "index.html"));
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("ERROR:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
