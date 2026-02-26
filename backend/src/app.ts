import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";
import authRoutes from "./routers/auth.route";
import cartRoutes from "./routers/cart.routes";
import productRoute from './routers/product.route'
import path from "node:path";

const app = express();


app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": [
          "'self'",
          "https://*.clerk.accounts.dev",
          "https://*.clerk.com",
          "blob:" // ✅ allow blob scripts if needed
        ],
        "worker-src": ["'self'", "blob:"], // ✅ required for Clerk workers
        "connect-src": [
          "'self'",
          "https://*.clerk.accounts.dev",
          "https://*.clerk.com"
        ],
        "img-src": ["'self'", "data:", "https:"],
        "frame-src": [
          "'self'",
          "https://*.clerk.accounts.dev",
          "https://*.clerk.com"
        ]
      }
    }
  })
);

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
app.use("/api/products", productRoute);

//serve frontend
const dispatch = path.resolve(process.cwd(), "../frontend/dist");
app.use(express.static(dispatch));

console.log("Serving static files from:", dispatch);

//spa fallback for react router
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(dispatch, "index.html"));
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("ERROR:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
