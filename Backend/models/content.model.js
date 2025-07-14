import mongoose from "mongoose";

const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  extractedText: { type: String, default: "" },
  originalLink: { type: String, default: "" },
  type: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  pineconeId: { type: String, required: true },
  timestamp: { type: String, required: true },
});

// ✅ Create models (after defining schemas)

export const ContentModel = mongoose.model("Content", ContentSchema);