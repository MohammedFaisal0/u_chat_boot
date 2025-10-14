// app/api/admins/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";

export async function GET(request) {
  try {
    await dbConnect();
    const admins = await Admin.find({}).select("-__v");
    return NextResponse.json(admins);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const admin = await Admin.create(body);
    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
