// models/Admin.js
import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String },
  account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
});

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
