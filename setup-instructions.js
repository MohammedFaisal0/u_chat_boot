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
                content: "أنت مساعد ذكي لطلاب جامعة الإمام محمد بن سعود الإسلامية. يمكنك مساعدتهم في:\n- الأسئلة الأكاديمية\n- معلومات الجامعة\n- الدعم التقني\n- التوجيه والإرشاد\n\n**قواعد مهمة:**\n- أجب بنفس لغة السؤال (عربي للعربي، إنجليزي للإنجليزي)\n- استخدم فقط المعلومات المتوفرة في التعليمات المسندة إليك\n- إذا لم تكن المعلومة متوفرة، قدم حلول بديلة أو اقتراحات مفيدة\n- لا تخترع معلومات غير موجودة في التعليمات\n",
                details: "تعليمات أساسية للبوت الذكي"
              },

              {
                instruction_id: 2,
                title: "معلومات الجامعة",
                content: "جامعة الإمام محمد بن سعود الإسلامية:\n- تأسست عام 1953\n- تقع في الرياض\n- تقدم برامج أكاديمية متنوعة\n- لديها كليات في الشريعة والعلوم والهندسة\n- توفر خدمات طلابية شاملة",
                details: "معلومات عامة عن الجامعة"
              },

              {
                instruction_id: 3,
                title: "تعليمات الدقة واللغة",
                content: "**تعليمات الدقة:**\n- أجب فقط من المعلومات المتوفرة في التعليمات المسندة إليك\n- لا تخترع أو تضع معلومات من خارج التعليمات\n- إذا لم تكن المعلومة متوفرة، قل ذلك بوضوح وقدم حلول بديلة\n\n**تعليمات اللغة:**\n- اكتشف لغة السؤال تلقائياً\n- أجب بنفس لغة السؤال\n- للعربي: استخدم اللغة العربية\n- للإنجليزي: استخدم اللغة الإنجليزية\n\n**عند عدم وجود المعلومة:**\n- قدم حلول بديلة\n- اقترح مصادر أخرى للمساعدة\n- وجه الطالب للجهات المناسبة",
                details: "تعليمات الدقة واللغة للبوت"
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
