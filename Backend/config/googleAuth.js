import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { JWT_PASSWORD } from "../config.js";

const router = express.Router();

// Step 1: Start Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    if (!req.user) {
      console.error("❌ No user returned from Google!");
      return res.status(400).json({ error: "User not found" });
    }

    // ✅ Create JWT
    const token = jwt.sign({ id: req.user._id }, JWT_PASSWORD, { expiresIn: "7d" });

    // ✅ Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}?token=${token}`);
  }
);

export default router;
