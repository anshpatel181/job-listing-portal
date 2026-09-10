import express from "express";
import protect from "../middleware/authMiddleware.js";
import { applyToJob, checkApplied, employerStats, getApplicantsForJob, getMyApplications, updateApplicationStatus } from "../controllers/applicationController.js";
import authorize from "../middleware/authorizationMiddleware.js";

const router = express.Router();

router.get("/check/:jobId", protect, authorize("job_seeker"), checkApplied);
router.get("/job/:jobId", protect, authorize("employer"), getApplicantsForJob)
router.get("/my", protect, authorize("job_seeker") ,getMyApplications);
router.get("/employer/stats", protect, authorize("employer"), employerStats);
router.post("/:jobId/apply", protect, authorize("job_seeker") ,applyToJob);
router.patch("/:applicationId/status", protect, authorize("employer") ,updateApplicationStatus);



export default router;
