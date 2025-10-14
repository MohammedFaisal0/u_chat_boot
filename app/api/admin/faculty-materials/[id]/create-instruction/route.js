// app/api/admin/faculty-materials/[id]/create-instruction/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import FacultyMaterial from "@/models/FacultyMaterial";
import ChatbotInstruction from "@/models/ChatbotInstruction";
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
    
    // Limit text length to avoid overwhelming the chatbot
    const maxLength = 100000; // Increased to 100,000 characters for large documents
    if (extractedText.length > maxLength) {
      extractedText = extractedText.substring(0, maxLength) + `\n\n... (تم اقتطاع النص من ${extractedText.length} حرف إلى ${maxLength} حرف لتوفير المساحة)`;
    }
    
    return extractedText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return `تعذر استخراج النص من ملف PDF: ${error.message}`;
  }
}

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyAuth(token.value);
    requireAdmin(payload);

    const { id } = params;
    
    // Find the approved material
    const material = await FacultyMaterial.findById(id);
    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }
    
    if (material.status !== "approved") {
      return NextResponse.json({ error: "Material must be approved first" }, { status: 400 });
    }

    // Generate next instruction ID
    const lastInstruction = await ChatbotInstruction.findOne().sort("-instruction_id");
    const nextId = lastInstruction ? lastInstruction.instruction_id + 1 : 1;

    // Extract content from PDF if file exists
    let content = material.description || material.title;
    if (material.file_url) {
      try {
        const filePath = path.join(process.cwd(), 'public', material.file_url);
        if (fs.existsSync(filePath)) {
          const pdfContent = await extractTextFromPDF(filePath);
          content = `عنوان المادة: ${material.title}\n\nوصف المادة: ${material.description || 'لا يوجد وصف'}\n\nمحتوى المادة من ملف PDF:\n${pdfContent}\n\n---\nتم استخراج هذا المحتوى تلقائياً من ملف PDF المرتبط بهذه المادة.`;
        } else {
          content = `عنوان المادة: ${material.title}\n\nوصف المادة: ${material.description || 'لا يوجد وصف'}\n\nملاحظة: ملف PDF غير موجود في المسار المحدد`;
        }
      } catch (error) {
        console.error("Error processing PDF file:", error);
        content = `عنوان المادة: ${material.title}\n\nوصف المادة: ${material.description || 'لا يوجد وصف'}\n\nملاحظة: تعذر استخراج محتوى ملف PDF - ${error.message}`;
      }
    }

    // Create instruction from material
    const instruction = await ChatbotInstruction.create({
      instruction_id: nextId,
      title: material.title,
      content: content,
      version: "1.0",
      admin: payload.id,
      material: material._id,
      // Keep details for backward compatibility
      details: content,
    });

    return NextResponse.json(instruction, { status: 201 });
  } catch (error) {
    console.error("Error creating instruction:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
