import { toggleSaveJob, getSavedJobs } from "../controllers/userController.js";
import protect  from "../middleware/authMiddleware.js";
import express from "express"
import authorize from "../middleware/authorizationMiddleware.js";

const router = express.Router();

router.post("/save-job/:jobId", protect, authorize("job_seeker") ,toggleSaveJob);
router.get("/saved-jobs", protect, authorize("job_seeker") ,getSavedJobs);

export default router;
