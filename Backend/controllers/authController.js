// controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import z from "zod";
import { JWT_PASSWORD } from "../config.js";
import { UserModel } from "../models/user.model.js";


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
    // Check if existing user
    const exists = await UserModel.findOne({ username });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({ username, password: hashedPassword });
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

    const existingUser = await UserModel.findOne({ username });
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
    const user = await UserModel.findById(req.userId).select("_id username email name avatar");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Get /me error:", error);
    res.status(500).json({ error: "Failed to get user info" });
  }
};