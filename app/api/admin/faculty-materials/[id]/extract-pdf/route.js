// app/api/admin/faculty-materials/[id]/extract-pdf/route.js
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

// Function to extract text from PDF
async function extractTextFromPDF(filePath) {
  try {
    const pdfParse = require('pdf-parse');
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    
    // Clean and format the extracted text
    let extractedText = data.text || "لا يوجد نص في ملف PDF";
    
    // Remove excessive whitespace and format
    extractedText = extractedText
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n\n') // Replace multiple newlines with double newline
      .trim();
    
    return {
      success: true,
      text: extractedText,
      pages: data.numpages || 0,
      info: data.info || {}
    };
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return {
      success: false,
      error: error.message,
      text: null
    };
  }
}

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyAuth(token.value);
    requireAdmin(payload);

    const { id } = params;
    
    // Find the material
    const material = await FacultyMaterial.findById(id);
    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }
    
    if (!material.file_url) {
      return NextResponse.json({ error: "No PDF file associated with this material" }, { status: 400 });
    }

    // Extract content from PDF
    const filePath = path.join(process.cwd(), 'public', material.file_url);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "PDF file not found on server" }, { status: 404 });
    }

    const extractionResult = await extractTextFromPDF(filePath);
    
    if (!extractionResult.success) {
      return NextResponse.json({ 
        error: "Failed to extract text from PDF", 
        details: extractionResult.error 
      }, { status: 500 });
    }

    const fileStats = fs.statSync(filePath);
    const fileSizeKB = (fileStats.size / 1024).toFixed(2);
    const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);
    
    return NextResponse.json({
      material: {
        id: material._id,
        title: material.title,
        description: material.description,
        course: material.course,
        topic: material.topic,
        status: material.status,
        submitted_at: material.submitted_at
      },
      pdfInfo: {
        pages: extractionResult.pages,
        info: extractionResult.info,
        fileSize: fileStats.size,
        fileSizeKB: fileSizeKB,
        fileSizeMB: fileSizeMB,
        textLength: extractionResult.text.length,
        isLargeFile: fileStats.size > 5 * 1024 * 1024, // 5MB
        isLongText: extractionResult.text.length > 100000
      },
      extractedText: extractionResult.text,
      extractionTime: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error extracting PDF content:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
