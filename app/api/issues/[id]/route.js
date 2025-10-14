// app/api/issues/[id]/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Issue from "@/models/Issue";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const issue = await Issue.findById(params.id)
      .populate('student', 'name email academic_id')
      .populate('conversation', 'name')
      .populate('message', 'message_text time_sent')
      .populate('admin', 'name');
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }
    return NextResponse.json(issue);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const issue = await Issue.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }
    return NextResponse.json(issue);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const deletedIssue = await Issue.findByIdAndDelete(params.id);
    if (!deletedIssue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Issue deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
