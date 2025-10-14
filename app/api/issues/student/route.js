// app/api/issues/student/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import "@/lib/models"; // Ensure all models are registered
import Issue from "@/models/Issue";
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

    console.log("Student ID from token:", verifiedToken.accountId);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Create the query for issues
    let query = { student: verifiedToken.accountId };
    if (search) {
      query.details = { $regex: search, $options: "i" };
    }
    
    console.log("Query for issues:", query);

    // Fetch issues for the current student
    const [issues, total] = await Promise.all([
      Issue.find(query)
        .populate('conversation', 'name')
        .populate('admin', 'name')
        .sort({ time_sent: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .catch(err => {
          console.error("Error fetching issues:", err);
          return [];
        }),
      Issue.countDocuments(query).catch(err => {
        console.error("Error counting issues:", err);
        return 0;
      }),
    ]);

    console.log("Found issues:", issues.length, "Total:", total);
    
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
    console.log("Creating issue with data:", body);
    console.log("Student ID from token:", verifiedToken.accountId);

    // Generate unique issue ID
    const issueId = await generateUniqueIssueId();
    console.log("Generated issue ID:", issueId);
    
    // Create a new issue
    const newIssue = new Issue({
      issue_id: issueId,
      details: body.details,
      type: body.type || "other",
      status: "open", // Default status for new issues
      student: verifiedToken.accountId, // Associate the issue with the current student
      conversation: body.conversationId || null,
      message: body.messageId || null,
    });

    const savedIssue = await newIssue.save();
    console.log("Issue saved successfully:", savedIssue);

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
