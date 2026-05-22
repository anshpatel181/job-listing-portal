import express from "express";
import { register, login, linkedinRegister, googleRegister, googleLogin, getEmail, verifyOtp, setNewPassword} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/googleRegister", googleRegister);
router.post("/linkedinRegister", linkedinRegister);
router.post("/googleLogin", googleLogin);
router.post("/sendEmail", getEmail)
router.post("/verifyOtp", verifyOtp)
router.post("/set-new-password", setNewPassword)

export default router;
