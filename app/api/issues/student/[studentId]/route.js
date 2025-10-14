// app/api/issues/student/[studentId]/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import Issue from "@/models/Issue";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { studentId } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Find the student using the student ID
    const student = await Student.findById(studentId).exec();

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Create the query for issues
    let query = { student: studentId };
    if (search) {
      query.details = { $regex: search, $options: "i" };
    }

    // Fetch issues for the student
    const [issues, total] = await Promise.all([
      Issue.find(query)
        .populate('conversation', 'name')
        .populate('admin', 'name')
        .sort({ time_sent: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Issue.countDocuments(query),
    ]);

    return NextResponse.json({
      issues,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalIssues: total,
    });
  } catch (error) {
    console.error("Error fetching student issues:", error);
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

    // Find the student using the student ID
    const student = await Student.findById(studentId).exec();

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Create a new issue
    const newIssue = new Issue({
      issue_id: await generateUniqueIssueId(),
      details: body.details,
      type: body.type || "other",
      status: "open", // Default status for new issues
      student: studentId, // Associate the issue with the student
      conversation: body.conversationId || null,
      message: body.messageId || null,
    });

    const savedIssue = await newIssue.save();

    return NextResponse.json(savedIssue, { status: 201 });
  } catch (error) {
    console.error("Error creating new issue:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function generateUniqueIssueId() {
  const lastIssue = await Issue.findOne().sort("-issue_id");
  return lastIssue ? lastIssue.issue_id + 1 : 1000; // Start from 1000 if no issues exist
}
