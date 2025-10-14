// app/api/students/[id]/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const student = await Student.findById(params.id).select("-__v");
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const student = await Student.findByIdAndUpdate(params.id, body, {
      new: true,
    }).select("-__v");
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const student = await Student.findByIdAndDelete(params.id);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
