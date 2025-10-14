// app/api/issues/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Issue from "@/models/Issue";
import Student from "@/models/Student";
import Chat from "@/models/Chat";
import ChatMessage from "@/models/ChatMessage";
import Admin from "@/models/Admin";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const type = searchParams.get("type") || "";

    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.details = { $regex: search, $options: "i" };
    }
    if (status) {
      query.status = status;
    }
    if (type) {
      query.type = type;
    }

    const [issues, total] = await Promise.all([
      Issue.find(query)
        .populate('student', 'name email academic_id')
        .populate('conversation', 'name')
        .populate('message', 'message_text time_sent')
        .populate('admin', 'name')
        .sort({ time_sent: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Issue.countDocuments(query),
    ]);


    return NextResponse.json({
      issues: issues || [],
      currentPage: page,
      totalPages: Math.ceil((total || 0) / limit) || 1,
      totalIssues: total || 0,
    });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json({
      issues: [],
      currentPage: 1,
      totalPages: 1,
      totalIssues: 0
    });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const newIssue = new Issue({
      issue_id: await generateUniqueIssueId(),
      details: body.details,
      type: body.type || "other",
      status: body.status || "open",
      student: body.studentId,
      conversation: body.conversationId || null,
      message: body.messageId || null,
      admin: body.adminId || null,
    });

    const savedIssue = await newIssue.save();

    return NextResponse.json(savedIssue, { status: 201 });
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;

    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedIssue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json(updatedIssue);
  } catch (error) {
    console.error("Error updating issue:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function generateUniqueIssueId() {
  const lastIssue = await Issue.findOne().sort("-issue_id");
  return lastIssue ? lastIssue.issue_id + 1 : 1;
}
