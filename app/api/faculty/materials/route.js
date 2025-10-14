// app/api/faculty/materials/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import FacultyMaterial from "@/models/FacultyMaterial";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

function requireFaculty(payload) {
  if (!payload || payload.accountType !== "faculty") {
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
    requireFaculty(payload);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const query = { faculty: payload.id };
    if (status) query.status = status;

    const materials = await FacultyMaterial.find(query).sort({ submitted_at: -1 }).lean();
    return NextResponse.json({ materials });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyAuth(token.value);
    requireFaculty(payload);

    const contentType = request.headers.get("content-type") || "";

    const last = await FacultyMaterial.findOne().sort("-material_id");
    const nextId = last ? last.material_id + 1 : 1;

    // Handle multipart form-data upload
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const title = form.get("title") || "Untitled";
      const description = form.get("description") || "";
      const course = form.get("course") || "";
      const topic = form.get("topic") || "";
      const file = form.get("file");

      let file_url = form.get("file_url") || "";
      if (file && typeof file === "object" && "arrayBuffer" in file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });
        const safeName = `${Date.now()}-${file.name}`.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const filePath = path.join(uploadDir, safeName);
        await writeFile(filePath, buffer);
        file_url = `/uploads/${safeName}`;
      }

      const doc = await FacultyMaterial.create({
        material_id: nextId,
        faculty: payload.id,
        title,
        description,
        file_url,
        course,
        topic,
        status: "pending",
      });

      return NextResponse.json(doc, { status: 201 });
    }

    // Fallback: JSON body (no direct file upload)
    const body = await request.json();
    const doc = await FacultyMaterial.create({
      material_id: nextId,
      faculty: payload.id,
      title: body.title,
      description: body.description,
      file_url: body.file_url,
      course: body.course,
      topic: body.topic,
      status: "pending",
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}


