
import mongoose from "mongoose";
// ✅ Define schemas
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true, trim: true, lowercase: true },
  password: { type: String, required: true, minLength: 6 },
});

export const UserModel = mongoose.model("User", UserSchema);