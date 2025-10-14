// models/Chat.js
import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  name: { type: String, required: true },
  customName: { type: String }, // Custom name set by student
  isFavorite: { type: Boolean, default: false },
  isSaved: { type: Boolean, default: false }, // New field for saved conversations
  savedAt: { type: Date }, // When the conversation was saved
  saveReason: { type: String }, // Why the conversation was saved
  status: { type: String, enum: ["open", "closed", "archived"], default: "open" },
  time_started: { type: Date, default: Date.now },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "ChatMessage" }],
});

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
