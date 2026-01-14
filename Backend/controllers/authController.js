// controllers/authController.js
import bcrypt from 'bcrypt';
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import z from "zod";
import { JWT_PASSWORD } from "../config.js";
import { UserModel } from "../models/user.model.js";

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM;


// --------- Validation Schemas ---------
const signupSchema = z.object({
  username: z.string().email({ message: "Username must be a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});
const signinSchema = z.object({
  username: z.string().email({ message: "Username must be a valid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Signup
export async function signup(req, res) {
  try {
    const parseResult = signupSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Validation error", errors: parseResult.error.flatten() });
    }
    const { username, password } = parseResult.data;

    // Check if existing user by username OR email
    const exists = await UserModel.findOne({
      $or: [{ username }, { email: username }]
    });

    if (exists) {
      if (exists.googleId && !exists.password) {
        return res.status(409).json({ message: "User exists via Google. Please login with Google." });
      }
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save both username and email
    const newUser = await UserModel.create({
      username,
      email: username,
      password: hashedPassword,
      credits: 20 // Ensure free credits on normal signup too
    });
    const token = jwt.sign({ id: newUser._id }, JWT_PASSWORD);
    res.json({ message: "User signed up", token });
  } catch (error) {
    console.error("Sign up error:", error);
    res.status(500).json({ message: "Failed to sign up", error: error.message });
  }
};


// Signin route
export async function signin(req, res) {
  try {

    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Missing credentials" });

    // Find by username OR email
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email: username }]
    });
    if (!existingUser) return res.status(403).json({ message: "Incorrect credentials" });

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) return res.status(403).json({ message: "Incorrect credentials" });

    const token = jwt.sign({ id: existingUser._id }, JWT_PASSWORD);
    res.json({ token });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).json({ message: "Sign in failed", error: error.message });
  }
};


// Get current user info
export async function getMe(req, res) {
  try {
    const user = await UserModel.findById(req.userId).select("_id username email name avatar credits");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Get /me error:", error);
    res.status(500).json({ error: "Failed to get user info" });
  }
};

// Send OTP for password reset
export async function sendOtp(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Generate resetToken (64 chars)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Set expiry (10 minutes from now)
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    // Save to user
    user.otp = hashedOtp;
    user.otpExpiry = expiry;
    user.resetToken = resetToken;
    user.resetTokenExpiry = expiry;
    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

// Verify OTP
export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp || !user.otpExpiry) return res.status(400).json({ message: "OTP not found or expired" });

    // Check if OTP is expired
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Verify OTP
    const isValidOtp = await bcrypt.compare(otp, user.otp);
    if (!isValidOtp) return res.status(400).json({ message: "Invalid OTP" });

    // Return resetToken
    res.json({ resetToken: user.resetToken });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Failed to verify OTP", error: error.message });
  }
};

// Reset password
export async function resetPassword(req, res) {
  try {
    const { email, resetToken, newPassword } = req.body;
    if (!email || !resetToken || !newPassword) return res.status(400).json({ message: "Email, resetToken, and newPassword are required" });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.resetToken || user.resetToken !== resetToken) return res.status(400).json({ message: "Invalid reset token" });

    if (!user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
      return res.status(400).json({ message: "Reset token expired" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset fields
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Failed to reset password", error: error.message });
  }
};

// DEV ONLY: Refill credits
export async function refillCredits(req, res) {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.credits = 50;
    await user.save();

    res.json({ message: "Credits refilled to 50", credits: user.credits });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};