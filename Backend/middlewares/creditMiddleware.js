// middlewares/creditMiddleware.js
import { UserModel } from "../models/user.model.js";

// Check if user has sufficient credits
export async function checkCredits(req, res, next) {
  try {
    const userId = req.userId;
    const creditsRequired = 1; // 1 credit per chat message

    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        error: "User not found" 
      });
    }

    // Check if plan is expired
    if (user.planExpiry && new Date() > user.planExpiry) {
      user.plan = "free";
      user.credits = 3;
      user.planExpiry = null;
      await user.save();
      
      return res.status(403).json({
        error: "Your plan has expired. Downgraded to free plan.",
        plan: "free",
        credits: user.credits,
        needsUpgrade: true
      });
    }

    // Check credits
    if (user.credits < creditsRequired) {
      return res.status(403).json({
        error: "Insufficient credits. Please upgrade your plan.",
        credits: user.credits,
        required: creditsRequired,
        needsUpgrade: true,
        upgradeUrl: "/pricing"
      });
    }

    // Attach user to request
    req.user = user;
    next();
    
  } catch (error) {
    console.error("Credit check error:", error);
    res.status(500).json({ error: "Failed to check credits" });
  }
}

// Deduct credits after successful chat
export   async function deductCredits(userId, amount = 1) {
  try {
    const user = await UserModel.findById(userId);
    
    if (!user) {
      throw new Error("User not found");
    }

    if (user.credits < amount) {
      throw new Error("Insufficient credits");
    }

    // Deduct credits
    user.credits -= amount;
    
    // Record usage (if you have transactions array)
    if (user.transactions) {
      user.transactions.push({
        type: "usage",
        credits: -amount,
        operation: "ai_chat",
        status: "completed",
        timestamp: new Date()
      });
    }

    await user.save();
    
    console.log(`✅ Deducted ${amount} credits from user ${userId}. Remaining: ${user.credits}`);
    
    return {
      success: true,
      remainingCredits: user.credits
    };
  } catch (error) {
    console.error("Credit deduction error:", error);
    throw error;
  }
}