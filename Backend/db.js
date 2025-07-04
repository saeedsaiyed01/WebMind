
// db.ts
import mongoose from "mongoose";
import { MONGO_URI } from "./config.js";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// ✅ Define schemas
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true, lowercase: true },
  password: { type: String, required: true, minLength: 6 },
});

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
export const UserModel = mongoose.model("User", UserSchema);
export const ContentModel = mongoose.model("Content", ContentSchema);