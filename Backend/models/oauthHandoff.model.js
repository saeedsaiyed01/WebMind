import mongoose from "mongoose";

const schema = new mongoose.Schema({
  codeHash: { type: String, required: true, unique: true },
  challenge: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expiresAt: { type: Date, required: true, expires: 0 },
});
export const OAuthHandoff =
  mongoose.models.OAuthHandoff || mongoose.model("OAuthHandoff", schema);
