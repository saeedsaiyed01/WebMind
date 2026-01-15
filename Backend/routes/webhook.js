
import crypto from "crypto";
import express from "express";
import { UserModel } from "../models/user.model.js";
import { PLANS } from "../services/pricing.js";

const router = express.Router();

// Svix signature verification (used by Dodo Payments)
function verifySvixSignature(payload, signature, timestamp, secret) {
  if (!secret) {
    console.error("❌ DODO_PAYMENTS_WEBHOOK_SECRET not set - rejecting webhook");
    return false; // Reject if no secret
  }

  try {
    // Extract the signature (format: v1,base64signature)
    const signatureParts = signature.split(",");
    if (signatureParts.length < 2) {
      console.error("Invalid signature format");
      return false;
    }

    const receivedSig = signatureParts[1]; // Get the base64 part

    // Svix uses the format: v1,base64(HMAC-SHA256(webhook_id.timestamp.payload))
    // But for simpler verification, we'll try common formats

    // Remove 'whsec_' prefix if present
    const secretKey = secret.startsWith('whsec_') ? secret.slice(6) : secret;

    // Try different payload formats
    const payloadStr = typeof payload === 'string' ? payload : JSON.stringify(payload);

    const formats = [
      `${timestamp}.${payloadStr}`,  // timestamp.payload
      payloadStr,                     // just payload
    ];

    for (const format of formats) {
      const expectedSig = crypto
        .createHmac("sha256", Buffer.from(secretKey, 'base64'))
        .update(format)
        .digest("base64");

      if (receivedSig === expectedSig) {
        console.log("✅ Signature verified!");
        return true;
      }
    }

    console.error("❌ Signature verification failed");
    return false; // Always reject failed signatures
  } catch (err) {
    console.error("Signature verification error:", err.message);
    return false;
  }
}

// Webhook endpoint - accepts both raw and parsed JSON
router.post("/dodo-webhook", express.json(), async (req, res) => {
  try {
    console.log("\n📨 ========== WEBHOOK RECEIVED ==========");

    // Get the webhook data - handle both raw buffer and parsed JSON
    let event;
    if (Buffer.isBuffer(req.body)) {
      const bodyStr = req.body.toString("utf8");
      event = JSON.parse(bodyStr);
    } else if (typeof req.body === 'object') {
      event = req.body;
    } else {
      event = JSON.parse(req.body);
    }

    console.log("📨 Event Type:", event.type);
    console.log("📨 Event Data:", JSON.stringify(event.data || event, null, 2));

    // Get signature headers (Svix format)
    const signature = req.headers["webhook-signature"];
    const timestamp = req.headers["webhook-timestamp"];
    const webhookId = req.headers["webhook-id"];

    console.log("🔐 Webhook ID:", webhookId);
    console.log("� Timestamp:", timestamp);
    console.log("🔐 Signature:", signature?.substring(0, 30) + "...");

    // Verify signature (required)
    const secret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "Webhook secret not configured" });
    }
    
    if (!signature) {
      return res.status(401).json({ error: "Signature required" });
    }
    
    const payloadStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (!verifySvixSignature(payloadStr, signature, timestamp, secret)) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    // Handle different event types
    // Dodo might send different event structures
    const eventType = event.type || event.event_type || "unknown";
    const eventData = event.data || event.payload || event;

    console.log("� Processing event:", eventType);

    switch (eventType) {
      case "payment.succeeded":
      case "payment.completed":
      case "checkout.session.completed":
      case "payment_intent.succeeded":
        await handlePaymentSuccess(eventData);
        break;

      case "payment.failed":
      case "payment_intent.payment_failed":
        await handlePaymentFailed(eventData);
        break;

      case "payment.refunded":
      case "charge.refunded":
        await handlePaymentRefunded(eventData);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${eventType}`);
      // Still return 200 to acknowledge receipt
    }

    console.log("========== WEBHOOK COMPLETE ==========\n");
    res.status(200).json({ received: true });

  } catch (err) {
    console.error("❌ Webhook processing error:", err);
    // Still return 200 to prevent retries for parsing errors
    res.status(200).json({ error: "Processing failed but acknowledged", message: err.message });
  }
});

// Handle successful payment
async function handlePaymentSuccess(data) {
  try {
    console.log("💰 Processing payment success...");
    console.log("💰 Full data received:", JSON.stringify(data, null, 2));

    // Try to extract metadata from various possible locations
    const metadata = data.metadata || data.payment_metadata || {};
    const userId = metadata.userId || metadata.user_id || data.userId || data.customerId;
    const plan = metadata.plan || data.plan || "pro";
    const credits = parseInt(metadata.credits || data.credits || PLANS[plan]?.credits || 100);
    const paymentId = data.payment_id || data.id || data.paymentId || "unknown";

    console.log(`💰 User ID: ${userId}`);
    console.log(`💰 Plan: ${plan}`);
    console.log(`💰 Credits: ${credits}`);
    console.log(`💰 Payment ID: ${paymentId}`);

    if (!userId) {
      console.error("❌ No user ID found in webhook data!");
      console.error("Available data keys:", Object.keys(data));
      return;
    }

    // Find user
    const user = await UserModel.findById(userId);
    if (!user) {
      console.error(`❌ User not found: ${userId}`);
      return;
    }

    console.log(`💰 Found user: ${user.email || user.username}`);
    console.log(`💰 Current credits: ${user.credits}`);

    // Update user plan and credits
    user.plan = plan;
    user.credits = (user.credits || 0) + credits;
    user.planExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Update or create transaction record
    if (!user.transactions) {
      user.transactions = [];
    }

    const existingTransaction = user.transactions.find(t => t.paymentId === paymentId);
    if (existingTransaction) {
      existingTransaction.status = "completed";
    } else {
      user.transactions.push({
        paymentId: paymentId,
        plan: plan,
        credits: credits,
        amount: data.amount ? data.amount / 100 : 0,
        status: "completed"
      });
    }

    await user.save();
    console.log(`✅ SUCCESS! User ${userId} now has ${user.credits} credits (added ${credits})`);

  } catch (err) {
    console.error("❌ Error in handlePaymentSuccess:", err);
  }
}

// Handle failed payment
async function handlePaymentFailed(data) {
  try {
    const metadata = data.metadata || {};
    const userId = metadata.userId || data.userId;
    const paymentId = data.payment_id || data.id;

    console.log(`❌ Payment failed for user ${userId}`);

    if (userId) {
      const user = await UserModel.findById(userId);
      if (user && user.transactions) {
        const transaction = user.transactions.find(t => t.paymentId === paymentId);
        if (transaction) {
          transaction.status = "failed";
          await user.save();
        }
      }
    }
  } catch (err) {
    console.error("❌ Error in handlePaymentFailed:", err);
  }
}

// Handle refund
async function handlePaymentRefunded(data) {
  try {
    const metadata = data.metadata || {};
    const userId = metadata.userId || data.userId;
    const paymentId = data.payment_id || data.id;

    console.log(`🔄 Processing refund for user ${userId}`);

    if (userId) {
      const user = await UserModel.findById(userId);
      if (user) {
        user.plan = "free";
        user.credits = PLANS.free?.credits || 20;
        user.planExpiry = null;

        if (user.transactions) {
          const transaction = user.transactions.find(t => t.paymentId === paymentId);
          if (transaction) {
            transaction.status = "refunded";
          }
        }

        await user.save();
        console.log(`✅ Refunded user ${userId} - downgraded to free plan`);
      }
    }
  } catch (err) {
    console.error("❌ Error in handlePaymentRefunded:", err);
  }
}

export default router;
