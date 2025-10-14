// models/Issue.js
import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema({
  issue_id: { type: Number, required: true, unique: true },
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  message: { type: mongoose.Schema.Types.ObjectId, ref: "ChatMessage" },
  type: { type: String },
  details: { type: String, required: true },
  time_sent: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["open", "in_progress", "resolved", "closed"],
    default: "open",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  admin_notes: { type: String },
});

export default mongoose.models.Issue || mongoose.model("Issue", IssueSchema);
