import express from "express";
import {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  toggleJobStatus,
  getFilteredJobs,
} from "../controllers/jobController.js";
import protect from "../middleware/authMiddleware.js";
import { getJobById } from "../controllers/jobController.js";

const router = express.Router();

router.post("/", protect, createJob);
router.get("/my", protect, getMyJobs);
router.get("/", getFilteredJobs);
router.get("/:id", getJobById);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);
router.patch("/:id/status", protect, toggleJobStatus);

export default router;
