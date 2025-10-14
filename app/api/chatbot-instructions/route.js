// app/api/chatbot-instructions/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ChatbotInstruction from "@/models/ChatbotInstruction";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "8");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const query = search ? {
      $or: [
        { details: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } }
      ]
    } : {};

    const [instructions, total] = await Promise.all([
      ChatbotInstruction.find(query)
        .sort({ instruction_id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ChatbotInstruction.countDocuments(query),
    ]);

    return NextResponse.json({
      instructions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalInstructions: total,
    });
  } catch (error) {
    console.error("Error fetching chatbot instructions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const newInstruction = new ChatbotInstruction({
      instruction_id: await generateUniqueInstructionId(),
      title: body.title,
      content: body.content,
      details: body.details || body.content, // Backward compatibility
    });

    const savedInstruction = await newInstruction.save();

    return NextResponse.json(savedInstruction, { status: 201 });
  } catch (error) {
    console.error("Error creating chatbot instruction:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;

    const updatedInstruction = await ChatbotInstruction.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedInstruction) {
      return NextResponse.json(
        { error: "Instruction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedInstruction);
  } catch (error) {
    console.error("Error updating chatbot instruction:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function generateUniqueInstructionId() {
  const lastInstruction = await ChatbotInstruction.findOne().sort(
    "-instruction_id"
  );
  return lastInstruction ? lastInstruction.instruction_id + 1 : 1;
}
