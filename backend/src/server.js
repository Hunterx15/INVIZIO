import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";

const app = express();

// ===============================
// Middleware
// ===============================

app.use(express.json());

app.use(
  cors({
    origin: ENV.CLIENT_URL, // your Vercel frontend URL
    credentials: true,
  })
);

app.use(clerkMiddleware());

// ===============================
// Routes
// ===============================

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

// Health check route (important for Render)
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running..." });
});

app.get("/health", (req, res) => {
  res.status(200).json({ message: "API is healthy" });
});

// ===============================
// Server Start
// ===============================

const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (error) {
    console.error("❌ Error starting the server:", error);
    process.exit(1);
  }
};

startServer();
