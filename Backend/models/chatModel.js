// models/ChatModel.js
import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  contentId: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: false },
  message: { type: String, required: true },
  response: { type: String, required: true },
  creditsUsed: { type: Number, default: 1 }, // ✅ ADD THIS
  createdAt: { type: Date, default: Date.now }
});

// Add index for faster queries
ChatSchema.index({ userId: 1, createdAt: -1 });

// Prevent OverwriteModelError by checking if model exists
const ChatModel = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);

export { ChatModel };
