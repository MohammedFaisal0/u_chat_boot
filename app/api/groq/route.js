// app/api/groq/route.js

import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import dbConnect from "@/lib/db";
import "@/lib/models"; // Ensure all models are registered
import ChatbotInstruction from "@/models/ChatbotInstruction";
import { jwtVerify } from "jose";

// Load environment variables explicitly
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groq = new Groq({
  apiKey: GROQ_API_KEY,
});

let conversationHistory = [];
let botInstructions = null;

async function getInstructions() {
  // Always fetch fresh instructions to ensure we have the latest updates
    await dbConnect();
    const instructions = await ChatbotInstruction.find().sort({
      instruction_id: 1,
    });
  
  const processedInstructions = instructions.map((instruction) => {
      // Use new content field if available, fallback to details for backward compatibility
      let content = instruction.content || instruction.details;
      
      // Truncate very long instructions to prevent token overflow
      if (content && content.length > 2000) {
        content = content.substring(0, 2000) + "...\n[تم تقصير المحتوى لتجنب تجاوز الحد المسموح]";
      }
      
      return content;
    });
  
  // Update the cached instructions
  botInstructions = processedInstructions;
  
  return processedInstructions;
}

export async function POST(request) {
  try {
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token || token === 'undefined' || token === 'null') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    let verifiedToken;
    try {
      const result = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      verifiedToken = result.payload;
    } catch (error) {
      console.error("JWT verification error:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    if (!verifiedToken.accountId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const { message } = body;

    // Always fetch fresh instructions to ensure we have the latest updates
    const instructions = await getInstructions();
    console.log("📋 Loaded instructions:", instructions.length);

    // Reset conversation history if instructions have changed
    if (conversationHistory.length === 0 || 
        (botInstructions && botInstructions.length !== instructions.length)) {
      conversationHistory = []; // Reset to force reload with new instructions
    }

    if (conversationHistory.length === 0) {
      // Initialize conversation history with system instructions from database
      if (instructions.length > 0) {
        // Combine all instructions into one comprehensive system instruction
        const combinedInstructions = instructions.join('\n\n---\n\n');
        conversationHistory = [{
          role: "system",
          content: `أنت مساعد ذكي لطلاب جامعة الإمام محمد بن سعود الإسلامية. 

تعليمات مهمة:
- أجب على الأسئلة مباشرة من المرة الأولى إذا كانت واضحة ومحددة
- إذا كان السؤال غامضاً أو غير واضح، اطلب توضيحاً محدداً
- استخدم المعلومات المتاحة في التعليمات التالية للإجابة على الأسئلة الأكاديمية
- أجب باللغة العربية بشكل مفيد ومختصر
- أمثلة على الأسئلة الغامضة التي تحتاج توضيح:
  * "معلومات" (غير محدد)
  * "ساعدني" (بدون تفاصيل)
  * "كيف" (بدون موضوع محدد)
  * "متى" (بدون حدث محدد)

المعلومات المتاحة:
${combinedInstructions}`,
        }];
        console.log("🤖 Initialized conversation with all database instructions:", instructions.length);
      } else {
        // Fallback to default instruction if no instructions in database
        const defaultInstruction = "أنت مساعد ذكي لطلاب جامعة الإمام محمد بن سعود الإسلامية. يمكنك مساعدتهم في الأسئلة الأكاديمية ومعلومات الجامعة والدعم التقني. أجب باللغة العربية بشكل مفيد ومختصر. أجب على الأسئلة مباشرة من المرة الأولى إذا كانت واضحة، وإذا كانت غامضة اطلب توضيحاً محدداً.";
        conversationHistory = [{
        role: "system",
          content: defaultInstruction,
        }];
        console.log("🤖 Initialized conversation with fallback instruction");
      }
    }

    // Add user message to conversation history
    conversationHistory.push({ role: "user", content: message });

    // Keep conversation history manageable (max 10 messages)
    if (conversationHistory.length > 10) {
      // Keep system instruction and last 9 messages
      conversationHistory = [
        conversationHistory[0], // system instruction
        ...conversationHistory.slice(-9) // last 9 messages
      ];
    }

    let reply;
    
    // Check if GROQ_API_KEY is available and valid
    if (!GROQ_API_KEY || 
        GROQ_API_KEY === 'your-groq-api-key-here' || 
        GROQ_API_KEY === 'gsk_test_1234567890abcdef' ||
        !GROQ_API_KEY.startsWith('gsk_')) {
      console.log("GROQ_API_KEY not found or invalid, using smart fallback response");
      
      // Generate intelligent responses based on the message content
      const msg = message.toLowerCase();
      
      if (msg.includes('مرحبا') || msg.includes('السلام') || msg.includes('hello') || msg.includes('hi')) {
        reply = "مرحباً بك! أنا مساعدك الذكي في جامعة الإمام محمد بن سعود الإسلامية. كيف يمكنني مساعدتك اليوم؟";
      } else if (msg.includes('مساعدة') || msg.includes('help') || msg.includes('ساعدني')) {
        reply = "يمكنني مساعدتك في:\n\n📚 **الخدمات الأكاديمية:**\n- معلومات عن التخصصات\n- الجدول الدراسي\n- النتائج والدرجات\n\n🏫 **معلومات الجامعة:**\n- المواعيد المهمة\n- الخدمات الطلابية\n- الأنشطة والفعاليات\n\n💻 **الدعم التقني:**\n- مشاكل النظام\n- تسجيل الدخول\n- استخدام المنصة\n\nما الذي تحتاج مساعدة فيه تحديداً؟";
      } else if (msg.includes('شكرا') || msg.includes('thanks') || msg.includes('ممتاز') || msg.includes('جيد')) {
        reply = "العفو! سعيد أن أتمكن من مساعدتك. هل لديك أي أسئلة أخرى؟";
      } else if (msg.includes('جامعة') || msg.includes('university') || msg.includes('الجامعة')) {
        reply = "جامعة الإمام محمد بن سعود الإسلامية هي إحدى أعرق الجامعات في المملكة العربية السعودية. يمكنني مساعدتك في:\n\n- معلومات عن التخصصات المتاحة\n- شروط القبول\n- الخدمات الطلابية\n- المواعيد المهمة\n\nما الذي تود معرفته عن الجامعة؟";
      } else if (msg.includes('نتائج') || msg.includes('درجات') || msg.includes('marks') || msg.includes('grades')) {
        reply = "للحصول على نتائجك الدراسية:\n\n1. ادخل إلى البوابة الطلابية\n2. اختر 'النتائج' من القائمة\n3. حدد الفصل الدراسي\n4. ستظهر لك جميع درجاتك\n\nهل تحتاج مساعدة في أي خطوة من هذه الخطوات؟";
      } else if (msg.includes('جدول') || msg.includes('schedule') || msg.includes('مواعيد')) {
        reply = "للاطلاع على جدولك الدراسي:\n\n1. ادخل إلى البوابة الطلابية\n2. اختر 'الجدول الدراسي'\n3. حدد الفصل الدراسي الحالي\n4. ستظهر لك جميع المحاضرات والمواعيد\n\nهل تريد معرفة المزيد عن أي مادة معينة؟";
      } else if (msg.includes('تسجيل') || msg.includes('login') || msg.includes('دخول')) {
        reply = "لمساعدتك في تسجيل الدخول:\n\n1. تأكد من صحة اسم المستخدم\n2. تأكد من صحة كلمة المرور\n3. إذا نسيت كلمة المرور، استخدم 'نسيت كلمة المرور'\n4. تأكد من اتصالك بالإنترنت\n\nهل تواجه مشكلة معينة في تسجيل الدخول؟";
      } else if (msg.includes('مشكلة') || msg.includes('خطأ') || msg.includes('error') || msg.includes('problem')) {
        reply = "أفهم أنك تواجه مشكلة. يمكنني مساعدتك في:\n\n- مشاكل تسجيل الدخول\n- مشاكل في عرض النتائج\n- مشاكل في الجدول الدراسي\n- مشاكل تقنية أخرى\n\nيرجى وصف المشكلة التي تواجهها بالتفصيل وسأحاول مساعدتك في حلها.";
      } else if (msg.includes('تخصص') || msg.includes('major') || msg.includes('كلية')) {
        reply = "جامعة الإمام محمد بن سعود الإسلامية تقدم العديد من التخصصات في:\n\n🏛️ **الكليات الشرعية:**\n- الشريعة\n- أصول الدين\n- القرآن الكريم\n\n🏛️ **الكليات العلمية:**\n- الهندسة\n- علوم الحاسب\n- الطب\n- الصيدلة\n\n🏛️ **الكليات الإنسانية:**\n- الآداب\n- التربية\n- اللغات\n\nأي تخصص يهمك معرفة المزيد عنه؟";
      } else {
        // Check if it's a vague question that needs clarification
        const msg = message.toLowerCase().trim();
        if (msg.length < 3 || 
            msg === 'معلومات' || 
            msg === 'ساعدني' || 
            msg === 'كيف' || 
            msg === 'متى' || 
            msg === 'ماذا' || 
            msg === 'أين' || 
            msg === 'لماذا' ||
            msg === 'help' ||
            msg === 'info' ||
            msg === 'what' ||
            msg === 'how' ||
            msg === 'when' ||
            msg === 'where' ||
            msg === 'why') {
          reply = "أفهم أنك تحتاج مساعدة، لكن سؤالك غير محدد. يرجى توضيح ما تريد معرفته تحديداً.\n\nمثال على الأسئلة الواضحة:\n- \"ما هي Multivalued data types؟\"\n- \"كيف أعيد تعيين كلمة المرور؟\"\n- \"متى موعد اختبار الفيزياء؟\"\n- \"ما هي معلومات الجامعة؟\"\n\nما الذي تود معرفته تحديداً؟";
        } else if (msg.includes('multivalued') || msg.includes('data types') || msg.includes('sets') || msg.includes('multisets')) {
          reply = "بناءً على المعلومات المتاحة، Multivalued data types تشمل:\n\n1. **Sets** - مجموعات من القيم الفريدة\n2. **Multisets** - مجموعات تسمح بتكرار القيم\n\nهذه الأنواع من البيانات تُستخدم في النماذج شبه المنظمة (Semi-Structured Data Models) وتدعمها معظم أنظمة قواعد البيانات الحديثة.";
        } else if (msg.includes('json') || msg.includes('xml') || msg.includes('semi-structured')) {
          reply = "بناءً على المعلومات المتاحة:\n\n**JSON (JavaScript Object Notation):**\n- تمثيل نصي يُستخدم على نطاق واسع لتبادل البيانات\n- يدعم أنواع البيانات: integer, real, string, boolean\n- الكائنات هي خرائط key-value\n\n**XML (Extensible Markup Language):**\n- يستخدم العلامات (tags) لتمييز النص\n- يجعل البيانات ذاتية التوثيق\n- يمكن أن تكون العلامات هرمية\n\n**Semi-Structured Data:**\n- مخطط مرن يسمح بتغيير البنية\n- مفيد لتبادل البيانات بين التطبيقات\n- يدعم أنواع البيانات المعقدة";
        } else if (msg.includes('object') || msg.includes('relational') || msg.includes('inheritance')) {
          reply = "بناءً على المعلومات المتاحة:\n\n**Object-Relational Database Systems:**\n- توفر نظام أنواع أكثر ثراءً\n- تدعم أنواع البيانات المعقدة والتوجه للكائنات\n\n**Type Inheritance:**\n- يمكن إنشاء أنواع جديدة تحت أنواع موجودة\n- مثال: Student تحت Person, Teacher تحت Person\n\n**Table Inheritance:**\n- الجداول يمكن أن ترث من جداول أخرى\n- يدعم PostgreSQL و Oracle\n\n**Object-Relational Mapping (ORM):**\n- يسمح بتحديد التخطيط بين كائنات لغة البرمجة وصفوف قاعدة البيانات\n- إنشاء وتحديث وحذف تلقائي";
        } else {
          reply = "شكراً لرسالتك! أنا هنا لمساعدتك في جميع استفساراتك حول جامعة الإمام محمد بن سعود الإسلامية.\n\nيمكنني مساعدتك في:\n- المعلومات الأكاديمية\n- الخدمات الطلابية\n- الدعم التقني\n- التوجيه والإرشاد\n\nما الذي تود معرفته أو الاستفسار عنه؟";
        }
      }
    } else {
      try {
        console.log("Using GROQ API with model: llama-3.1-8b-instant");
        
        const completion = await groq.chat.completions.create({
          messages: conversationHistory,
          model: "llama-3.1-8b-instant",
          temperature: 0.7,
          max_tokens: 500, // Reduced to avoid token limit
          top_p: 1,
          stream: false,
        });

        reply = completion.choices[0]?.message?.content;

        if (!reply) {
          throw new Error("No reply from Groq API");
        }
        
        console.log("GROQ API response received successfully");
      } catch (groqError) {
        console.error("Groq API error:", groqError);
        
        // Check if it's an authentication error
        if (groqError.message?.includes('401') || groqError.message?.includes('unauthorized')) {
          reply = "عذراً، هناك مشكلة في إعدادات API. يرجى التحقق من مفتاح GROQ API.";
        } else if (groqError.message?.includes('rate limit') || groqError.message?.includes('429')) {
          reply = "تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً.";
        } else {
          // Use smart fallback response if Groq API fails
          const msg = message.toLowerCase();
          if (msg.includes('مرحبا') || msg.includes('السلام') || msg.includes('hello')) {
            reply = "مرحباً بك! أنا مساعدك الذكي. حالياً أستخدم نظام الردود الذكية. كيف يمكنني مساعدتك؟";
          } else if (msg.includes('مساعدة') || msg.includes('help')) {
            reply = "يمكنني مساعدتك في:\n- الأسئلة الأكاديمية\n- معلومات الجامعة\n- الدعم التقني\n\nما الذي تحتاج مساعدة فيه؟";
          } else {
            // Check if it's a vague question that needs clarification
            const msg = message.toLowerCase().trim();
            if (msg.length < 3 || 
                msg === 'معلومات' || 
                msg === 'ساعدني' || 
                msg === 'كيف' || 
                msg === 'متى' || 
                msg === 'ماذا' || 
                msg === 'أين' || 
                msg === 'لماذا' ||
                msg === 'help' ||
                msg === 'info' ||
                msg === 'what' ||
                msg === 'how' ||
                msg === 'when' ||
                msg === 'where' ||
                msg === 'why') {
              reply = "أفهم أنك تحتاج مساعدة، لكن سؤالك غير محدد. يرجى توضيح ما تريد معرفته تحديداً.\n\nمثال على الأسئلة الواضحة:\n- \"ما هي Multivalued data types؟\"\n- \"كيف أعيد تعيين كلمة المرور؟\"\n- \"متى موعد اختبار الفيزياء؟\"\n- \"ما هي معلومات الجامعة؟\"\n\nما الذي تود معرفته تحديداً؟";
            } else if (msg.includes('multivalued') || msg.includes('data types') || msg.includes('sets') || msg.includes('multisets')) {
              reply = "بناءً على المعلومات المتاحة، Multivalued data types تشمل:\n\n1. **Sets** - مجموعات من القيم الفريدة\n2. **Multisets** - مجموعات تسمح بتكرار القيم\n\nهذه الأنواع من البيانات تُستخدم في النماذج شبه المنظمة (Semi-Structured Data Models) وتدعمها معظم أنظمة قواعد البيانات الحديثة.";
            } else if (msg.includes('json') || msg.includes('xml') || msg.includes('semi-structured')) {
              reply = "بناءً على المعلومات المتاحة:\n\n**JSON (JavaScript Object Notation):**\n- تمثيل نصي يُستخدم على نطاق واسع لتبادل البيانات\n- يدعم أنواع البيانات: integer, real, string, boolean\n- الكائنات هي خرائط key-value\n\n**XML (Extensible Markup Language):**\n- يستخدم العلامات (tags) لتمييز النص\n- يجعل البيانات ذاتية التوثيق\n- يمكن أن تكون العلامات هرمية\n\n**Semi-Structured Data:**\n- مخطط مرن يسمح بتغيير البنية\n- مفيد لتبادل البيانات بين التطبيقات\n- يدعم أنواع البيانات المعقدة";
            } else if (msg.includes('object') || msg.includes('relational') || msg.includes('inheritance')) {
              reply = "بناءً على المعلومات المتاحة:\n\n**Object-Relational Database Systems:**\n- توفر نظام أنواع أكثر ثراءً\n- تدعم أنواع البيانات المعقدة والتوجه للكائنات\n\n**Type Inheritance:**\n- يمكن إنشاء أنواع جديدة تحت أنواع موجودة\n- مثال: Student تحت Person, Teacher تحت Person\n\n**Table Inheritance:**\n- الجداول يمكن أن ترث من جداول أخرى\n- يدعم PostgreSQL و Oracle\n\n**Object-Relational Mapping (ORM):**\n- يسمح بتحديد التخطيط بين كائنات لغة البرمجة وصفوف قاعدة البيانات\n- إنشاء وتحديث وحذف تلقائي";
            } else {
              reply = "شكراً لرسالتك! أنا هنا لمساعدتك في جميع استفساراتك الأكاديمية والتقنية. ما الذي تود معرفته؟";
            }
          }
        }
      }
    }

    // Add AI response to conversation history
    conversationHistory.push({ role: "assistant", content: reply });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Groq API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
