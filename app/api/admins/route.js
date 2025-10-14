import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
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
    if (payload.accountType !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const admins = await Admin.find()
      .populate('account', 'userName')
      .select('name email account')
      .lean();

    return NextResponse.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
