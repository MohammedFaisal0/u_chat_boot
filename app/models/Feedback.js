// models/Feedback.js
import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  message: { type: mongoose.Schema.Types.ObjectId, ref: "ChatMessage" },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  submitted_at: { type: Date, default: Date.now },
});

export default mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);



