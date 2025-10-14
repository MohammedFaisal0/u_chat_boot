// setup-instructions.js - إضافة التعليمات الافتراضية للبوت
import mongoose from "mongoose";
import dotenv from "dotenv";
import ChatbotInstruction from "./app/models/ChatbotInstruction.js";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

async function setupInstructions() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if instructions already exist
    const existingInstructions = await ChatbotInstruction.find();
    if (existingInstructions.length > 0) {
      console.log("Instructions already exist, skipping setup.");
      return;
    }

    console.log("Setting up default instructions...");
    
    // Default Chatbot Instructions
    const defaultInstructions = [
      {
        instruction_id: 1,
        title: "تعليمات أساسية للبوت",
        content: "أنت مساعد ذكي لطلاب جامعة الإمام محمد بن سعود الإسلامية. يمكنك مساعدتهم في:\n- الأسئلة الأكاديمية\n- معلومات الجامعة\n- الدعم التقني\n- التوجيه والإرشاد\n",
        details: "تعليمات أساسية للبوت الذكي"
      },

      {
        instruction_id: 2,
        title: "معلومات الجامعة",
        content: "جامعة الإمام محمد بن سعود الإسلامية:\n- تأسست عام 1953\n- تقع في الرياض\n- تقدم برامج أكاديمية متنوعة\n- لديها كليات في الشريعة والعلوم والهندسة\n- توفر خدمات طلابية شاملة",
        details: "معلومات عامة عن الجامعة"
      }
    ];

    for (const instructionData of defaultInstructions) {
      const instruction = new ChatbotInstruction(instructionData);
      await instruction.save();
    }
    
    console.log("Default instructions setup completed successfully");
  } catch (error) {
    console.error("Setup failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

setupInstructions();
