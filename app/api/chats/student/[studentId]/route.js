// app/api/chats/student/[studentId]/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import Chat from "@/models/Chat";
import ChatMessage from "@/models/ChatMessage";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { studentId } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    // Find the student
    const student = await Student.findById(studentId).exec();

    if (!student) {
      console.log(`Student not found with ID: ${studentId}`);
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Fetch chats for the student, favorites first
    const [chats, total] = await Promise.all([
      Chat.find({ student: studentId })
        .sort({ isFavorite: -1, time_started: -1 }) // Favorites first, then by date
        .skip(skip)
        .limit(limit)
        .populate("messages")
        .lean(),
      Chat.countDocuments({ student: studentId }),
    ]);

    return NextResponse.json({
      chats,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalChats: total,
    });
  } catch (error) {
    console.error("Error fetching student chats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { studentId } = params;
    const body = await request.json();

    // Find the student
    const student = await Student.findById(studentId).exec();

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Create a new chat
    const newChat = new Chat({
      student: studentId,
      name: body.name || `Chat ${Date.now()}`,
    });

    const savedChat = await newChat.save();

    // If there's an initial message, create it
    if (body.initialMessage) {
      const newMessage = new ChatMessage({
        chat: savedChat._id,
        from: "student",
        message_text: body.initialMessage,
      });

      const savedMessage = await newMessage.save();

      // Add the message to the chat
      savedChat.messages.push(savedMessage._id);
      await savedChat.save();
    }

    return NextResponse.json(savedChat, { status: 201 });
  } catch (error) {
    console.error("Error creating new chat:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
