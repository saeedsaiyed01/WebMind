import crypto from "node:crypto";
import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { JWT_PASSWORD, GOOGLE_REDIRECT_URI } from "../config.js";
import { OAuthHandoff } from "../models/oauthHandoff.model.js";
import { authLimiter } from "../middlewares/sanitization.js";
import {
  createMobileState,
  verifyMobileState,
  mobileCallback,
  digest,
} from "../utils/mobileOAuth.js";

const router = express.Router();

router.post("/google/mobile-start", authLimiter, (req, res) => {
  const { verifier, challenge, signedState } = createMobileState(JWT_PASSWORD);
  // Build from the configured callback, never from an untrusted Host header.
  const callback = new URL(GOOGLE_REDIRECT_URI);
  const authorizationUrl = new URL("/api/v1/auth/google", callback.origin);
  authorizationUrl.searchParams.set("state", signedState);
  res
    .set("Cache-Control", "no-store")
    .json({
      authorizationUrl: authorizationUrl.toString(),
      verifier,
      state: challenge,
    });
});

router.post("/google/mobile-exchange", authLimiter, async (req, res) => {
  res.set("Cache-Control", "no-store");
  const { code, verifier } = req.body;
  if (
    typeof code !== "string" ||
    typeof verifier !== "string" ||
    !/^[a-f0-9]{64}$/.test(code) ||
    !/^[a-f0-9]{64}$/.test(verifier)
  )
    return res.status(400).json({ message: "Invalid sign-in code." });
  try {
    const handoff = await OAuthHandoff.findOneAndDelete({
      codeHash: digest(code),
      challenge: digest(verifier),
      expiresAt: { $gt: new Date() },
    });
    if (!handoff)
      return res
        .status(401)
        .json({
          message: "Sign-in code expired or already used. Please try again.",
        });
    const token = jwt.sign({ id: handoff.userId }, JWT_PASSWORD, {
      expiresIn: "7d",
    });
    return res.json({ token });
  } catch {
    return res
      .status(500)
      .json({ message: "Unable to complete sign-in. Please try again." });
  }
});

router.get("/google", (req, res, next) => {
  let state;
  if (req.query.state !== undefined) {
    try {
      verifyMobileState(req.query.state, JWT_PASSWORD);
      state = req.query.state;
    } catch {
      return res
        .status(400)
        .json({ message: "Invalid or expired sign-in request." });
    }
  }
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    ...(state ? { state } : {}),
  })(req, res, next);
});

router.get("/google/callback", (req, res, next) => {
  let challenge;
  if (req.query.state !== undefined) {
    try {
      challenge = verifyMobileState(req.query.state, JWT_PASSWORD);
    } catch {
      return res
        .status(400)
        .json({ message: "Invalid or expired sign-in request." });
    }
  }
  passport.authenticate("google", { session: false }, async (error, user) => {
    res.set("Cache-Control", "no-store");
    if (error || !user) {
      if (challenge)
        return res.redirect(
          mobileCallback(challenge, { error: "google_failed" }),
        );
      return res.redirect("/login");
    }
    if (challenge) {
      try {
        const code = crypto.randomBytes(32).toString("hex");
        await OAuthHandoff.create({
          codeHash: digest(code),
          challenge,
          userId: user._id,
          expiresAt: new Date(Date.now() + 60_000),
        });
        return res.redirect(mobileCallback(challenge, { code }));
      } catch {
        return res.redirect(
          mobileCallback(challenge, { error: "google_failed" }),
        );
      }
    }
    const token = jwt.sign({ id: user._id }, JWT_PASSWORD, { expiresIn: "7d" });
    const frontend = new URL(
      process.env.FRONTEND_URL || "http://localhost:5173",
    );
    frontend.searchParams.set("token", token);
    return res.redirect(frontend.toString());
  })(req, res, next);
});
export default router;
