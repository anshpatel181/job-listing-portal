import express from "express"
import { getProfile, updateProfile } from "../controllers/profileController.js";
import protect from "../middleware/authMiddleware.js";
import { handleUpload } from "../middleware/multerErrorHandlerMiddleware.js";
import authorize from "../middleware/authorizationMiddleware.js";

const router = express.Router();
router.get("/get-profile", protect, getProfile);
router.put("/update-employer-profile", protect, authorize("employer"), handleUpload('companyLogo'), updateProfile);
router.put("/update-seeker-profile", protect, authorize("job_seeker"), handleUpload('resumeFile'), updateProfile);

export default router;
