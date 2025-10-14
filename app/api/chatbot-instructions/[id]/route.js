// app/api/chatbot-instructions/[id]/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ChatbotInstruction from "@/models/ChatbotInstruction";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const instruction = await ChatbotInstruction.findById(params.id);
    if (!instruction) {
      return NextResponse.json(
        { error: "Instruction not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(instruction);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const instruction = await ChatbotInstruction.findByIdAndUpdate(
      params.id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!instruction) {
      return NextResponse.json(
        { error: "Instruction not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(instruction);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const deletedInstruction = await ChatbotInstruction.findByIdAndDelete(
      params.id
    );

    if (!deletedInstruction) {
      return NextResponse.json(
        { error: "Instruction not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Instruction deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
