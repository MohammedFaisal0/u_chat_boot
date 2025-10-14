// models/Account.js
import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  accountNo: { type: Number, required: true, unique: true },
  accountType: { type: String, required: true },
  userName: { type: String, required: true },
  password: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending", "approved", "suspended", "rejected"],
    default: "pending"
  },
  approved_at: { type: Date },
  suspended_at: { type: Date },
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  suspension_reason: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.models.Account ||
  mongoose.model("Account", AccountSchema);
