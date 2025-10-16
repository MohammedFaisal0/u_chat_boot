// app/api/chats/[chatId]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Chat from "@/models/Chat";
import Student from "@/models/Student";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";

export async function GET(request, { params }) {
  await dbConnect();
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyAuth(token.value);
    const { chatId } = params;

    const chat = await Chat.findById(chatId)
      .populate('student', 'name email academic_id')
      .populate('messages')
      .lean();

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Check if user has access to this chat
    if (payload.accountType === "student" && chat.student._id.toString() !== payload.studentId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  await dbConnect();
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyAuth(token.value);
    const { chatId } = params;
    const body = await request.json();

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Check if user has access to this chat
    if (payload.accountType === "student" && chat.student.toString() !== payload.studentId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Update chat with new data
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $set: body },
      { new: true }
    ).populate('student', 'name email academic_id');

    return NextResponse.json(updatedChat);
  } catch (error) {
    console.error("Error updating chat:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { chatId } = params;

    // Find the chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Remove the chat reference from the student
    await Student.findByIdAndUpdate(chat.student, {
      $pull: { chats: chatId },
    });

    // Delete the chat
    await Chat.findByIdAndDelete(chatId);

    return NextResponse.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

