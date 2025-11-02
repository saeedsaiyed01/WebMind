import { UserModel } from "../models/user.model.js";
import { PLANS } from "../services/pricing.js";

// Manual upgrade (for testing or admin)
export async function upgradePlan(req, res) {
  try {
    const { plan } = req.body;
    const userId = req.userId;

    if (!PLANS[plan]) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        plan: plan,
        credits: PLANS[plan].credits,
        planExpiry: plan === "free" ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: `Successfully upgraded to ${PLANS[plan].name} plan`,
      plan: user.plan,
      credits: user.credits,
      planExpiry: user.planExpiry,
    });
  } catch (error) {
    console.error("Upgrade plan error:", error);
    res.status(500).json({ message: "Failed to upgrade plan" });
  }
}

// Get user plan details
export async function getUserPlan(req, res) {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId).select("plan credits planExpiry transactions");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      plan: user.plan,
      credits: user.credits,
      planExpiry: user.planExpiry,
      planDetails: PLANS[user.plan],
      recentTransactions: user.transactions.slice(-5) // Last 5 transactions
    });
  } catch (error) {
    console.error("Get user plan error:", error);
    res.status(500).json({ message: "Failed to get user plan" });
  }
}

// Use credits (deduct for API usage)
export async function useCredits(req, res) {
  try {
    const userId = req.userId;
    const { amount = 1 } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.credits < amount) {
      return res.status(403).json({
        message: "Insufficient credits",
        credits: user.credits
      });
    }

    user.credits -= amount;
    await user.save();

    res.json({
      message: "Credits deducted successfully",
      remainingCredits: user.credits
    });
  } catch (error) {
    console.error("Use credits error:", error);
    res.status(500).json({ message: "Failed to use credits" });
  }
}

// Reset credits to 3 for testing
export async function resetCredits(req, res) {
  try {
    const userId = req.userId;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { credits: 3 },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Credits reset to 3",
      credits: user.credits
    });
  } catch (error) {
    console.error("Reset credits error:", error);
    res.status(500).json({ message: "Failed to reset credits" });
  }
}

