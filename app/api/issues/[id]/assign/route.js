import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Issue from "@/models/Issue";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";

export async function PATCH(request, { params }) {
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

    const { id } = params;
    const { adminId } = await request.json();

    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { admin: adminId },
      { new: true }
    ).populate('admin', 'name');

    if (!updatedIssue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json(updatedIssue);
  } catch (error) {
    console.error("Error assigning issue:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
