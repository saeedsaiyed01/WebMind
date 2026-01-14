// middlewares/creditMiddleware.js
import { UserModel } from "../models/user.model.js";

// Check if user has sufficient credits
export async function checkCredits(req, res, next) {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // DEV MODE: BYPASS ALL CHECKS
    console.log("Creating bypass for user:", user._id);
    req.user = user;
    next();
  } catch (error) {
    console.error("Credit check error:", error);
    res.status(500).json({ error: "Failed to check credits" });
  }
}

// Deduct credits after successful chat
// Deduct credits after successful chat
export async function deductCredits(userId, amount = 1) {
  try {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    // DEV MODE: Allow negative
    user.credits -= amount;

    // Record usage
    if (user.transactions) {
      user.transactions.push({
        credits: -amount,
        operation: "ai_chat",
        status: "completed",
        createdAt: new Date()
      });
    }

    await user.save();
    console.log(`✅ Deducted ${amount}, Rem: ${user.credits}`);
    return { success: true, remainingCredits: user.credits };
  } catch (error) {
    console.error("Credit deduction error:", error);
    // Don't throw for now to avoid breaking chat
    return { success: true, remainingCredits: 0 };
  }
}