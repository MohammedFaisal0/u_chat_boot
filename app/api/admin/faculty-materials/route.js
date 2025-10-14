// app/api/admin/faculty-materials/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import FacultyMaterial from "@/models/FacultyMaterial";

function requireAdmin(payload) {
  if (!payload || payload.accountType !== "admin") {
    throw new Error("Access denied");
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyAuth(token.value);
    requireAdmin(payload);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const query = {};
    if (status) query.status = status;

    const materials = await FacultyMaterial.find(query)
      .populate("faculty", "name email")
      .sort({ submitted_at: -1 })
      .lean();
    return NextResponse.json({ materials });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request) {
  try {
    await dbConnect();
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyAuth(token.value);
    requireAdmin(payload);

    const body = await request.json();
    const { id, action } = body; // action: approve | reject
    if (!id || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const update = { status: action === "approve" ? "approved" : "rejected", admin: payload.id };
    if (action === "approve") update.approved_at = new Date();

    const updated = await FacultyMaterial.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}



