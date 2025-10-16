// app/api/faculty/materials/[id]/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import FacultyMaterial from "@/models/FacultyMaterial";
import fs from "fs";
import path from "path";

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const payload = await verifyAuth(token.value);
    
    // Check if user is faculty
    if (payload.accountType !== "faculty") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { id } = params;
    
    // Find the material
    const material = await FacultyMaterial.findById(id);
    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    // Check if the material belongs to this faculty member
    if (material.faculty.toString() !== payload.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Only allow deletion of pending materials
    if (material.status !== "pending") {
      return NextResponse.json({ 
        error: "Cannot delete approved or rejected materials" 
      }, { status: 400 });
    }

    // Delete the file if it exists
    if (material.file_url) {
      try {
        const filePath = path.join(process.cwd(), 'public', material.file_url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error("Error deleting file:", error);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete the material from database
    await FacultyMaterial.findByIdAndDelete(id);

    return NextResponse.json({ 
      message: "Material deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting material:", error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const payload = await verifyAuth(token.value);
    
    // Check if user is faculty
    if (payload.accountType !== "faculty") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { id } = params;
    
    // Find the material
    const material = await FacultyMaterial.findById(id);
    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    // Check if the material belongs to this faculty member
    if (material.faculty.toString() !== payload.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Only allow editing of pending materials
    if (material.status !== "pending") {
      return NextResponse.json({ 
        error: "Cannot edit approved or rejected materials" 
      }, { status: 400 });
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

    // Handle file upload if new file is provided
    let file_url = material.file_url; // Keep existing file
    if (file && file.size > 0) {
      try {
        // Delete old file if exists
        if (material.file_url) {
          const oldFilePath = path.join(process.cwd(), 'public', material.file_url);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name;
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

    // Update the material
    const updatedMaterial = await FacultyMaterial.findByIdAndUpdate(
      id,
      {
        title,
        description: description || "",
        course: course || "",
        topic: topic || "",
        file_url,
        submitted_at: new Date()
      },
      { new: true }
    );

    return NextResponse.json({ 
      message: "Material updated successfully",
      material: updatedMaterial
    });
  } catch (error) {
    console.error("Error updating material:", error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
