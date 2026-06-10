import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import { connectCloudinary } from "./config/cloudinary.js";
import helmet from "helmet";
import Job from "./models/Job.js";

const app = express();

app.set("trust proxy", 1); // trust proxy means trust the headers coming from proxy server and here proxy server means vercel server from which request is coming. Actually the flow is request is travelling from frontend development server to vercel server and then vercel server provides user ip as headers to backend and that's why backend needs to trust that server otherwise any client could forward fake headers

await connectCloudinary();

app.use(helmet());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});
app.use(express.json()); //this middleware is used if data coming from frontend is of application/json type and after that this middleware transform json.stringify data coming from frontend into js object and attaches it to req.body.

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/dbtest", async (req, res) => {
  const jobs = await Job.find().limit(5).lean();
  res.json(jobs);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
