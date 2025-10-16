// app/api/admin/faculty-materials/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import FacultyMaterial from "@/models/FacultyMaterial";
import fs from "fs";
import path from "path";

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

export async function POST(request) {
  try {
    await dbConnect();
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyAuth(token.value);
    
    // Check if user is faculty
    if (payload.accountType !== "faculty") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const course = formData.get("course");
    const topic = formData.get("topic");
    const file = formData.get("file");

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Handle file upload
    let file_url = null;
    if (file && file.size > 0) {
      try {
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name;
        const fileExtension = path.extname(originalName);
        const fileName = `${timestamp}-${originalName}`;
        const filePath = path.join(uploadsDir, fileName);

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        fs.writeFileSync(filePath, buffer);

        // Set the file URL for database
        file_url = `/uploads/${fileName}`;
      } catch (error) {
        console.error("Error saving file:", error);
        return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
      }
    }

    // Generate unique material_id
    const lastMaterial = await FacultyMaterial.findOne().sort({ material_id: -1 });
    const nextMaterialId = lastMaterial ? lastMaterial.material_id + 1 : 1;

    const material = new FacultyMaterial({
      material_id: nextMaterialId,
      title,
      description: description || "",
      course: course || "",
      topic: topic || "",
      file_url,
      faculty: payload.id,
      status: "pending",
      submitted_at: new Date()
    });

    await material.save();

    return NextResponse.json({ 
      message: "Material submitted successfully", 
      material: {
        id: material._id,
        title: material.title,
        status: material.status
      }
    });
  } catch (error) {
    console.error("Error submitting material:", error);
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



