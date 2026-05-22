import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import { sendResetEmail } from "../config/emailService.js";
import crypto from "crypto";
import { cacheService, ratelimit } from "../config/redisClient.js";

const generateToken = (user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "10d" },
  );

  return token;
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ success: false, message: "User already exists, Please login" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      provider: "manual"
    });

    const token = generateToken(user);

    res
      .status(201)
      .json({
        message: "You have registered successfully",
        token,
        role: user.role,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    return res
      .status(200)
      .json({
        message: "You have logged in successfully",
        token,
        role: user.role,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const googleRegister = async (req, res) => {

  try {

    const { token, role } = req.body

    if (!token) {
      return res.json({ success: false, message: "Google login failed, please try again" })
    }

    if (!role) {
      return res.status(400).json({ success: false, message: "Please select a role" })
    }

    const googleResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (googleResponse.status === 200) {
      const { name, email } = googleResponse.data

      const userExists = await User.findOne({ email })

      if (userExists) {
        return res.status(400).json({ success: false, message: "User Already exists, please login" })
      }

      const user = await User.create({
        name,
        email,
        role,
        password: Math.random().toString(36).slice(-10),
        method: "google"
      })

      const customJwtToken = generateToken(user);

      res.status(200).json({
        message: "Google Login Successful",
        token: customJwtToken,
        role: user.role
      })
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
}

export const linkedinRegister = async (req, res) => {
  try {

    const { role, code } = req.body

    const tokenResponse = await axios.post("https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: "http://localhost:5173/linkedin/callback",
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )

    const accessToken = tokenResponse.data.access_token

    const profileResponse = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    const { name, email } = profileResponse.data

    const userExists = await User.findOne({ email })

    // Login functionality
    if (!role) {
      if (!userExists) {
        return res.status(400).json({ success: false, message: "No account found, please register first." })
      }

      if (userExists.method !== "linkedin") {
        return res.status(400).json({ success: false, message: `Please login using ${userExists.method}` })
      }

      const customJwtToken = generateToken(userExists)

      return res.status(200).json({ success: true, message: "You have logged in successfully", role: userExists.role, token: customJwtToken })
    }

    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists, please login" })
    }

    const user = await User.create({
      name,
      email,
      password: Math.random().toString(36).slice(-10),
      method: "linkedin",
      role
    })

    const customJwtToken = generateToken(user);

    res.status(200).json({
      message: "Linkedin Login Successful",
      token: customJwtToken,
      role: user.role
    })

  } catch (error) {
    console.log("ERROR STATUS:", error.response?.status);
    console.log("ERROR DATA:", error.response?.data);
    console.log(error.message);

    return res.status(500).json({ success: false, message: "Internal Server error" })
  }
}

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.json({ success: false, message: "Google login failed, please try again" })
    }

    const googleResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const { email } = googleResponse.data

    const userExists = await User.findOne({ email })

    if (!userExists) {
      return res.status(400).json({ success: false, message: "No account found, please register first." })
    }

    if (userExists.method !== "google") {
      return res.status(400).json({ success: false, message: `Please login using ${userExists.method}` })
    }

    const customJwtToken = generateToken(userExists);

    if (userExists) {
      return res.status(200).json({ success: true, message: "You have logged in successfully", role: userExists.role, token: customJwtToken })
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server error, Please try again after some time." })
  }
}

export const getEmail = async (req, res) => {

  try {
    
    const { email } = req.body
    
    if (!email) {
      return res.status(400).json({ success: false, message: "Please Provide an email to generate OTP" })
    } 
    
    const rateLimitKey = `ratelimit:email:${req.ip}:${email.toLowerCase().trim()}` //here we don't used direct client ip or direct email instead we used mix of them because suppose we use only email and if attacker may know user email then they can request with that email and if that email reaches maximum request then real user who owns email can't request and support we used only ip then for example if both user are connected to same public wifi and requesting something then because of both user's ip is same requests will be blocked even after first user has made request two times and second user made request three times and in our case we are allowing 5 req in 1 min to individual user and that's why we have used email + ip 
    const { success } = await ratelimit.limit(rateLimitKey) // here req.ip provides user's ip address coming from frontend

    if (!success) {
      return res.status(429).json({
        success: false, message: "You are doing that too fast! Please wait a minute."
      })
    }
  
    const userExists = await User.findOne({ email })
  
    if (!userExists) {
      return res.status(400).json({ success: false, message: "Please provide registered email address" })
    }
  
    if (userExists.method !== "manual") {
      return res.status(400).json({ success: false, message: `Please Login using ${userExists.method}` })
    }
  
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex")
    
    if(hashedOtp) {
      await cacheService.set(`otp:${userExists.id}`, hashedOtp, 300)
    }
    
    const token = crypto.randomBytes(32).toString("hex") 
    const hashedToken = crypto.createHash('sha256').update(token).digest("hex")
    if(hashedToken) {
      await cacheService.set(`token:${hashedToken}`, userExists.id, 600)
    }
    
    const resetLink = `http://localhost:5173/reset-password/${token}`
    const response = await sendResetEmail(email, otp, resetLink)
    
    if (response.success) {
      return res.status(200).json({ success: true, message: "Email sent successfully", token })
    }

    return res.status(400).json({success: false, message: "Email isn't sended yet, please try again after some time"})
  } catch (error) {
    console.log(error)
    return res.status(500).json({success: false, message: "Internal server error"})
  }
}

export const verifyOtp = async (req, res) => {

  try {
    const {otp, email} = req.body

    const userExists = await User.findOne({email})

    if(!userExists) {
      return res.status(400).json({success: false, message: "User not found, please regiister first"})
    }
    
    const hashedOtp = crypto.createHash("sha256").update(otp.toString()).digest("hex")
      
    if(hashedOtp) {
      const redisOtp = await cacheService.get(`otp:${userExists.id}`)

      if(hashedOtp === redisOtp) {
        return res.status(200).json({success: true, message: "otp verified successfully"})
      }
      
      return res.status(400).json({success: false, message: "Wrong otp or it is expired, please generate new otp"})
    } 
  } catch (error) {
    console.log(error);
    return res.status(500).json({success: false, message: "Internal server error"})
  }
}

export const setNewPassword = async (req, res) => {
  
  try {
    const { token, newPassword } = req.body

    if(!token) {
      return res.status(400).json({success: false, message: "Unable to set password, please generate and verify otp again"})
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const userId = await cacheService.get(`token:${hashedToken}`)
    
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const updatedUser = await User.findOneAndUpdate({_id: userId}, {password: hashedPassword})

    if(updatedUser) {
      await cacheService.del(`token:${hashedToken}`)
      return res.status(200).json({success: true, message: "Password Reset Successfully"})
    }
    return res.status(400).json({success: false, message: "Unable to reset password, please try again."})
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({success: false, message: "Internal server error"})
  }
}