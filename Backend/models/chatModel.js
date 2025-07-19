// models/ChatModel.js
import mongoose from "mongoose";
const ChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  contentId: { type: mongoose.Types.ObjectId, ref: "Content", required: false }, // made optional
  message: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
export const ChatModel = mongoose.model("Chat", ChatSchema);