
import DodoPayments from "dodopayments";
import express from "express";
import { userMiddleware } from "../middlewares/authMiddleware.js";
import { UserModel } from "../models/user.model.js";
import { PLANS } from "../services/pricing.js";

const router = express.Router();
const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
});

router.post("/create-session", userMiddleware, async (req, res) => {
  try {
    // Debug: Log the entire request body
    console.log("🔵 RAW req.body:", JSON.stringify(req.body));
    console.log("🔵 req.body type:", typeof req.body);

    const { plan, email, name } = req.body || {};
    const userId = req.userId;

    console.log("🔵 Create session request:", { plan, email, name, userId });
    console.log("🔵 Plan value:", plan, "Type:", typeof plan);

    // Validate plan
    const planInfo = PLANS[plan];
    if (!planInfo) {
      console.error("❌ Invalid plan:", plan, "Available plans:", Object.keys(PLANS));
      return res.status(400).json({
        error: "Invalid plan",
        received: plan,
        receivedType: typeof plan,
        rawBody: req.body,
        available: Object.keys(PLANS)
      });
    }

    // Prevent payment for free plan
    if (plan === "free") {
      return res.status(400).json({ error: "Free plan does not require payment" });
    }

    // Get user details
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create checkout session
    const successUrl = `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.FRONTEND_URL}/payment-cancel`;

    console.log("🔗 Success URL:", successUrl);
    console.log("🔗 Cancel URL:", cancelUrl);

    const session = await dodo.checkoutSessions.create({
      product_cart: [
        {
          product_id: planInfo.productId,
          quantity: 1
        }
      ],
      customer: null,
      metadata: {
        plan: plan,
        userId: userId.toString(),
        credits: planInfo.credits.toString()
      },
      success_url: successUrl,
      cancel_url: cancelUrl
    });

    // Store pending transaction
    user.transactions.push({
      paymentId: session.payment_id,
      plan: plan,
      credits: planInfo.credits,
      amount: planInfo.price,
      status: "pending"
    });
    await user.save();

    res.json({
      checkout_url: session.checkout_url,
      session_id: session.id
    });

  } catch (err) {
    console.error("❌ Dodo session creation error:", err);
    res.status(500).json({
      error: "Payment creation failed",
      details: err.message
    });
  }
});

// Check payment status (for frontend polling)
router.get("/status/:sessionId", userMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await dodo.checkoutSessions.retrieve(sessionId);

    res.json({
      status: session.status,
      payment_id: session.payment_id
    });
  } catch (err) {
    console.error("❌ Payment status check error:", err);
    res.status(500).json({ error: "Failed to check payment status" });
  }
});

export default router;
