import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Feedback from "@/models/Feedback";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";

export async function GET(request) {
  await dbConnect();
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyAuth(token.value);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const studentId = searchParams.get("studentId");

    const skip = (page - 1) * limit;

    let query = {};
    if (studentId) {
      query.student = studentId;
    }

    const [feedbacks, total] = await Promise.all([
      Feedback.find(query)
        .populate('student', 'name email academic_id')
        .populate('conversation', 'name')
        .populate('message', 'message_text time_sent')
        .sort({ submitted_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Feedback.countDocuments(query),
    ]);

    return NextResponse.json({
      feedbacks,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalFeedbacks: total,
    });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await dbConnect();
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyAuth(token.value);
    if (payload.accountType !== "student") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const { rating, comment, conversationId, messageId } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const newFeedback = new Feedback({
      student: payload.studentId,
      conversation: conversationId,
      message: messageId,
      rating,
      comment,
      submitted_at: new Date(),
    });

    const savedFeedback = await newFeedback.save();
    return NextResponse.json(savedFeedback, { status: 201 });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
