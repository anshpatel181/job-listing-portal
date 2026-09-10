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
import authorize from "../middleware/authorizationMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("employer") ,createJob);
router.get("/my", protect, authorize("employer") ,getMyJobs);
router.get("/", getFilteredJobs);
router.get("/:id", getJobById);
router.put("/:id", protect, authorize("employer") ,updateJob);
router.delete("/:id", protect, authorize("employer") ,deleteJob);
router.patch("/:id/status", protect, authorize("employer") ,toggleJobStatus);

export default router;
