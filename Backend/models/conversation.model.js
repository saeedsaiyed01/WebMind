import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "New Chat" },
    lastMessageAt: { type: Date, default: Date.now }
}, { timestamps: true });

ConversationSchema.index({ userId: 1, updatedAt: -1 });

export const ConversationModel = mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);
