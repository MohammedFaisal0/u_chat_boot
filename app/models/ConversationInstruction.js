// models/ConversationInstruction.js
import mongoose from "mongoose";

const ConversationInstructionSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  instruction: { type: mongoose.Schema.Types.ObjectId, ref: "ChatbotInstruction", required: true },
  used_at: { type: Date, default: Date.now },
});

ConversationInstructionSchema.index({ conversation: 1, instruction: 1 });

export default mongoose.models.ConversationInstruction ||
  mongoose.model("ConversationInstruction", ConversationInstructionSchema);



