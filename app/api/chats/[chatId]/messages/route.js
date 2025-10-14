// app/api/chats/[chatId]/messages/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Chat from "@/models/Chat";
import ChatMessage from "@/models/ChatMessage";

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { chatId } = params;
    const body = await request.json();

    // Find the chat
    const chat = await Chat.findById(chatId).exec();
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Generate a new message_id
    const lastMessage = await ChatMessage.findOne().sort("-message_id");
    const newMessageId = lastMessage ? lastMessage.message_id + 1 : 1;

    // Create a new message
    const newMessage = new ChatMessage({
      message_id: newMessageId,
      chat: chatId,
      from: body.from,
      message_text: body.message_text,
    });

    const savedMessage = await newMessage.save();

    // Add the message to the chat
    chat.messages.push(savedMessage._id);
    await chat.save();

    // Return the message with populated data
    const populatedMessage = await ChatMessage.findById(savedMessage._id)
      .populate('chat')
      .lean();

    return NextResponse.json(populatedMessage, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
