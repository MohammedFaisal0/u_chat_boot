// models/ChatMessage.js
import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  message_id: {
    type: Number,
    required: true,
  },
  from: { type: String, required: true },
  message_text: { type: String, required: true },
  time_sent: { type: Date, default: Date.now },
});

// Add a pre-save hook to generate a unique message_id
ChatMessageSchema.pre("save", async function (next) {
  if (!this.message_id) {
    const lastMessage = await this.constructor.findOne(
      {},
      {},
      { sort: { message_id: -1 } }
    );
    this.message_id =
      lastMessage && lastMessage.message_id ? lastMessage.message_id + 1 : 1;
  }
  next();
});

export default mongoose.models.ChatMessage ||
  mongoose.model("ChatMessage", ChatMessageSchema);
