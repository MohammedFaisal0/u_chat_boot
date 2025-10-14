// models/FacultyMaterial.js
import mongoose from "mongoose";

const FacultyMaterialSchema = new mongoose.Schema({
  material_id: { type: Number, required: true, unique: true },
  // Reference the owning account (faculty user account)
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
  title: { type: String, required: true },
  description: { type: String },
  file_url: { type: String },
  course: { type: String },
  topic: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  submitted_at: { type: Date, default: Date.now },
  approved_at: { type: Date },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
});

export default mongoose.models.FacultyMaterial ||
  mongoose.model("FacultyMaterial", FacultyMaterialSchema);


