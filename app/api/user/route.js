// app/api/user/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";

export async function GET(request) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyAuth(token.value);
    return NextResponse.json({
      userId: payload.id,
      studentId: payload.studentId,
      accountType: payload.accountType,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
