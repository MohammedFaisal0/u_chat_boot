// app/api/chats/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import "@/lib/models"; // Ensure all models are registered
import Chat from "@/models/Chat";
import ChatMessage from "@/models/ChatMessage";
import Student from "@/models/Student";
import { jwtVerify } from "jose";

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token || token === 'undefined' || token === 'null') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    let verifiedToken;
    try {
      const result = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      verifiedToken = result.payload;
    } catch (error) {
      console.error("JWT verification error:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    if (!verifiedToken.accountId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.log("Fetching chats for accountId:", verifiedToken.accountId);

    // First, find the student by account ID
    const student = await Student.findOne({ account: verifiedToken.accountId });
    console.log("Found student:", student);

    if (!student) {
      console.log("No student found for accountId:", verifiedToken.accountId);
      return NextResponse.json([]);
    }

    // Fetch chats for the current student with messages
    const chats = await Chat.find({ student: student._id })
      .populate('messages')
      .sort({ isFavorite: -1, time_started: -1 })
      .lean();

    console.log("Found chats:", chats.length, chats);

    // Return empty array if no chats exist
    if (chats.length === 0) {
      console.log("No chats found for student:", student._id);
      return NextResponse.json([]);
    }

    return NextResponse.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token || token === 'undefined' || token === 'null') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    let verifiedToken;
    try {
      const result = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      verifiedToken = result.payload;
    } catch (error) {
      console.error("JWT verification error:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    if (!verifiedToken.accountId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    // First, find the student by account ID
    const student = await Student.findOne({ account: verifiedToken.accountId });
    
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const newChat = new Chat({
      name,
      student: student._id,
      messages: [],
    });

    const savedChat = await newChat.save();

    return NextResponse.json(savedChat, { status: 201 });
  } catch (error) {
    console.error("Error creating new chat:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
