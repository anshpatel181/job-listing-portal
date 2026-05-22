import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["job_seeker", "employer"], required: true, },
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    method: { type: String, enum: ["manual", "google", "linkedin"], default: "manual", required: true }
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
