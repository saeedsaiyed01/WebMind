import express from "express";
import { getUserPlan, resetCredits, upgradePlan, useCredits } from "../controllers/pricingController.js";
import { userMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/upgrade", userMiddleware, upgradePlan);
router.get("/plan", userMiddleware, getUserPlan);
router.post("/use-credits", userMiddleware, useCredits);
router.post("/reset-credits", userMiddleware, resetCredits); // For testing

export default router;
