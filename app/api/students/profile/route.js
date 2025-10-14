// app/api/students/[id]/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const student = await Student.findById(params.id)
      .select("-__v -account")
      .lean();

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();

    // Fields that are allowed to be updated
    const allowedUpdates = ["name", "email", "major", "phone", "address"];
    const updates = {};
    for (let key of allowedUpdates) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    const student = await Student.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-__v -account");

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
