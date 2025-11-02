
import crypto from "crypto";
import express from "express";
import { UserModel } from "../models/user.model.js";
import { PLANS } from "../services/pricing.js";

const router = express.Router();

// IMPORTANT: Use raw body parser for webhooks
router.use(express.raw({ type: "application/json" }));

// Verify Dodo webhook signature
function verifyWebhookSignature(payload, signature, timestamp) {
  const webhookSecret = process.env.DODO_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error("⚠️ DODO_WEBHOOK_SECRET not set!");
    return false;
  }

  console.log("🔍 Debug webhook signature:");
  console.log("Webhook Secret:", webhookSecret?.substring(0, 10) + "...");
  console.log("Received Signature:", signature);
  console.log("Timestamp:", timestamp);

  // Try different signature formats
  const formats = [
    `${timestamp}.${payload}`,                    // Format 1: timestamp.payload
    payload,                                       // Format 2: just payload
    JSON.stringify(JSON.parse(payload))           // Format 3: stringified JSON
  ];

  for (let i = 0; i < formats.length; i++) {
    const signedPayload = formats[i];
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(signedPayload)
      .digest("hex");

    console.log(`Format ${i + 1} expected:`, expectedSignature);

    try {
      if (signature === expectedSignature || 
          crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        console.log(`✅ Signature matched with format ${i + 1}`);
        return true;
      }
    } catch (err) {
      // Continue to next format
    }
  }

  console.error("❌ None of the signature formats matched");
  return false;
}

router.post("/dodo-webhook", async (req, res) => {
  try {
    // Get signature from headers
    const signature = req.headers["x-dodo-signature"] || req.headers["dodo-signature"];
    const timestamp = req.headers["x-dodo-timestamp"] || req.headers["dodo-timestamp"];
    
    // Convert raw body to string
    const payload = req.body.toString("utf8");
    
    // Verify signature (CRITICAL SECURITY!)
    if (!verifyWebhookSignature(payload, signature, timestamp)) {
      console.error("❌ Invalid webhook signature!");
      return res.status(401).json({ error: "Invalid signature" });
    }

    // Parse event
    const event = JSON.parse(payload);
    console.log("📨 Webhook received:", event.type);

    // Handle different event types
    switch (event.type) {
      case "payment.succeeded":
      case "checkout.session.completed":
        await handlePaymentSuccess(event.data);
        break;

      case "payment.failed":
        await handlePaymentFailed(event.data);
        break;

      case "payment.refunded":
        await handlePaymentRefunded(event.data);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });

  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    res.status(400).json({ error: "Webhook processing failed" });
  }
});

// Handle successful payment
async function handlePaymentSuccess(data) {
  try {
    const { customer, metadata, payment_id, amount } = data;
    const userId = metadata.userId;
    const plan = metadata.plan;
    const credits = parseInt(metadata.credits);

    console.log(`✅ Processing payment success for user ${userId}, plan: ${plan}`);

    // Find user
    const user = await UserModel.findById(userId);
    if (!user) {
      console.error(`❌ User not found: ${userId}`);
      return;
    }

    // Update user plan and credits
    user.plan = plan;
    user.credits = credits;
    user.planExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Update transaction status
    const transaction = user.transactions.find(t => t.paymentId === payment_id);
    if (transaction) {
      transaction.status = "completed";
    } else {
      // If transaction not found, create it
      user.transactions.push({
        paymentId: payment_id,
        plan: plan,
        credits: credits,
        amount: amount / 100, // Convert from cents
        status: "completed"
      });
    }

    await user.save();
    console.log(`✅ Successfully upgraded user ${userId} to ${plan} plan with ${credits} credits`);

    // TODO: Send confirmation email here

  } catch (err) {
    console.error("❌ Error in handlePaymentSuccess:", err);
    // TODO: Implement retry logic or alert system
  }
}

// Handle failed payment
async function handlePaymentFailed(data) {
  try {
    const { customer, metadata, payment_id } = data;
    const userId = metadata.userId;

    console.log(`❌ Payment failed for user ${userId}`);

    const user = await UserModel.findById(userId);
    if (user) {
      const transaction = user.transactions.find(t => t.paymentId === payment_id);
      if (transaction) {
        transaction.status = "failed";
        await user.save();
      }
    }

    // TODO: Send failure notification email

  } catch (err) {
    console.error("❌ Error in handlePaymentFailed:", err);
  }
}

// Handle refund
async function handlePaymentRefunded(data) {
  try {
    const { customer, metadata, payment_id } = data;
    const userId = metadata.userId;
    const credits = parseInt(metadata.credits);

    console.log(`🔄 Processing refund for user ${userId}`);

    const user = await UserModel.findById(userId);
    if (user) {
      // Downgrade to free plan
      user.plan = "free";
      user.credits = PLANS.free.credits;
      user.planExpiry = null;

      // Update transaction status
      const transaction = user.transactions.find(t => t.paymentId === payment_id);
      if (transaction) {
        transaction.status = "refunded";
      }

      await user.save();
      console.log(`✅ Refunded user ${userId} - downgraded to free plan`);
    }

  } catch (err) {
    console.error("❌ Error in handlePaymentRefunded:", err);
  }
}

export default router;
