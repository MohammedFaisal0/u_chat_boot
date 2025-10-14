// models/Student.js
import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  academic_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  major: { type: String, required: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
  issues: [{ type: mongoose.Schema.Types.ObjectId, ref: "Issue" }],
});

export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);
