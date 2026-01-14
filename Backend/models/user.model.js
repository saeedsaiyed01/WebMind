import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true, default: null, trim: true, lowercase: true },
  password: { type: String, minLength: 6 },
  googleId: { type: String, unique: true, sparse: true },
  name: String,
  email: { type: String, unique: true, sparse: true },
  avatar: String,
  
  // Plan details
  plan: { type: String, enum: ["free", "pro", "premium"], default: "free" },
  credits: { type: Number, default: 20 },
  planExpiry: { type: Date, default: null },
  
  // Payment tracking (NEW - IMPORTANT!)
  transactions: [{
    paymentId: String,
    plan: String,
    credits: Number,
    amount: Number,
    status: { type: String, enum: ["pending", "completed", "failed", "refunded"] },
    createdAt: { type: Date, default: Date.now }
  }],

  // Password reset fields
  otp: String, // hashed
  otpExpiry: Date,
  resetToken: String,
  resetTokenExpiry: Date
}, { timestamps: true });

export const UserModel = mongoose.model("User", UserSchema);
