// models/ChatbotInstruction.js
import mongoose from "mongoose";

const ChatbotInstructionSchema = new mongoose.Schema({
  instruction_id: { type: Number, required: true, unique: true },
  title: { type: String },
  content: { type: String },
  version: { type: String },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  material: { type: mongoose.Schema.Types.ObjectId, ref: "FacultyMaterial" },
  // fallback for legacy records
  details: { type: String },
});

export default mongoose.models.ChatbotInstruction ||
  mongoose.model("ChatbotInstruction", ChatbotInstructionSchema);
