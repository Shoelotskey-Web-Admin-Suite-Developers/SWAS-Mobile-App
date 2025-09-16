import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import connectDB from "./db";
import customerRoutes from "./routes/authRoutes"; // 👈 Import routes

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 API is running...");
});

// Customer routes
app.use("/api", customerRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
