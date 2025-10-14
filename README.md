# 🤖 Naseeh - نظام المحادثة الذكي للجامعة

<div align="center">

![Naseeh Logo](public/univ-chat-bot-logo.png)

**نظام محادثة ذكي متطور لطلاب جامعة الإمام محمد بن سعود الإسلامية**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Groq AI](https://img.shields.io/badge/Groq-AI-purple?style=for-the-badge)](https://groq.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 📋 جدول المحتويات

- [🌟 نظرة عامة](#-نظرة-عامة)
- [✨ المميزات الرئيسية](#-المميزات-الرئيسية)
- [👥 أدوار المستخدمين](#-أدوار-المستخدمين)
- [🛠️ التقنيات المستخدمة](#️-التقنيات-المستخدمة)
- [📋 متطلبات النظام](#-متطلبات-النظام)
- [🚀 التثبيت والتشغيل](#-التثبيت-والتشغيل)
- [⚙️ إعداد متغيرات البيئة](#️-إعداد-متغيرات-البيئة)
- [🗂️ هيكل المشروع](#️-هيكل-المشروع)
- [📱 واجهات المستخدم](#-واجهات-المستخدم)
- [🔧 API Documentation](#-api-documentation)
- [🌐 النشر](#-النشر)
- [🤝 المساهمة](#-المساهمة)
- [📄 الترخيص](#-الترخيص)

---

## 🌟 نظرة عامة

**Naseeh** هو نظام محادثة ذكي متطور مصمم خصيصاً لطلاب جامعة الإمام محمد بن سعود الإسلامية. يوفر النظام مساعدة أكاديمية وتقنية شاملة باستخدام الذكاء الاصطناعي المتقدم، مع واجهات مخصصة لكل نوع من المستخدمين.

### 🎯 الهدف الرئيسي

توفير منصة ذكية ومتكاملة تمكن الطلاب من الحصول على المساعدة الأكاديمية والتقنية في أي وقت، مع إدارة شاملة للمواد التعليمية والتواصل بين جميع أطراف العملية التعليمية.

---

## ✨ المميزات الرئيسية

### 🤖 **البوت الذكي المتقدم**

- **ذكاء اصطناعي متطور:** استخدام Groq API مع نموذج Llama 3.1
- **تعليمات قابلة للتخصيص:** الإدمن يمكنه إضافة وتعديل تعليمات البوت
- **استجابة فورية:** ردود سريعة ودقيقة على استفسارات الطلاب
- **نظام محادثة متقدم:** حفظ وتتبع المحادثات
- **دعم متعدد اللغات:** العربية والإنجليزية

### 👨‍💼 **لوحة تحكم الإدارة**

- **إدارة المستخدمين:** إضافة وإدارة الطلاب وأعضاء هيئة التدريس
- **إدارة التعليمات:** إضافة وتعديل تعليمات البوت الذكي
- **إدارة المواد التعليمية:** مراجعة وموافقة المواد المقدمة
- **إحصائيات شاملة:** متابعة نشاط الطلاب والمحادثات والمواد
- **نظام التقارير:** تقارير مفصلة عن أداء النظام
- **إدارة البلاغات:** متابعة وحل مشاكل الطلاب

### 👨‍🏫 **لوحة تحكم أعضاء هيئة التدريس**

- **تقديم المواد:** رفع المواد التعليمية (PDF) للمراجعة
- **متابعة المواد:** عرض حالة المواد المقدمة
- **لوحة تحكم تفاعلية:** إحصائيات ومعلومات شخصية
- **إدارة المحتوى:** تنظيم وتصنيف المواد التعليمية

### 👨‍🎓 **لوحة تحكم الطلاب**

- **محادثة ذكية:** تفاعل مع البوت الذكي للحصول على المساعدة
- **إدارة المحادثات:** إنشاء وحفظ المحادثات المهمة
- **نظام البلاغات:** إرسال وتتبع المشاكل التقنية
- **الملف الشخصي:** إدارة المعلومات الشخصية
- **واجهة متعددة اللغات:** دعم العربية والإنجليزية

### 🔐 **نظام الأمان والصلاحيات**

- **مصادقة متقدمة:** JWT مع تشفير آمن
- **أدوار متعددة:** إدمن، طالب، عضو هيئة تدريس
- **حالات الحساب:** معلق، معتمد، معلق، مرفوض
- **حماية المسارات:** middleware للحماية
- **تسجيل العمليات:** تتبع جميع العمليات

---

## 👥 أدوار المستخدمين

### 🔑 **الإدمن (Admin)**

- **الصلاحيات الكاملة:** إدارة جميع جوانب النظام
- **إدارة المستخدمين:** إضافة، تعديل، تعليق، رفض المستخدمين
- **إدارة التعليمات:** إضافة وتعديل تعليمات البوت
- **مراجعة المواد:** موافقة أو رفض المواد التعليمية
- **التقارير والإحصائيات:** عرض تقارير مفصلة عن النظام
- **إدارة البلاغات:** حل مشاكل الطلاب

### 👨‍🎓 **الطالب (Student)**

- **المحادثة الذكية:** التفاعل مع البوت للحصول على المساعدة
- **إدارة المحادثات:** إنشاء وحفظ المحادثات
- **نظام البلاغات:** إرسال وتتبع المشاكل
- **الملف الشخصي:** إدارة المعلومات الشخصية

### 👨‍🏫 **عضو هيئة التدريس (Faculty)**

- **تقديم المواد:** رفع المواد التعليمية للمراجعة
- **متابعة المواد:** عرض حالة المواد المقدمة
- **لوحة التحكم:** إحصائيات شخصية

---

## 🛠️ التقنيات المستخدمة

### **Frontend**

- **Next.js 14** - إطار عمل React متقدم
- **React 18** - مكتبة واجهة المستخدم
- **Tailwind CSS** - إطار عمل CSS
- **Lucide React** - مكتبة الأيقونات
- **Recharts** - مكتبة الرسوم البيانية

### **Backend**

- **Next.js API Routes** - واجهات برمجة التطبيقات
- **Node.js** - بيئة تشغيل JavaScript
- **JWT** - نظام المصادقة
- **bcryptjs** - تشفير كلمات المرور

### **قاعدة البيانات**

- **MongoDB** - قاعدة بيانات NoSQL
- **Mongoose** - مكتبة ODM لـ MongoDB
- **MongoDB Atlas** - خدمة قاعدة البيانات السحابية

### **الذكاء الاصطناعي**

- **Groq API** - خدمة الذكاء الاصطناعي
- **Llama 3.1** - نموذج الذكاء الاصطناعي
- **PDF Parse** - استخراج النصوص من PDF

### **أدوات التطوير**

- **ESLint** - فحص جودة الكود
- **PostCSS** - معالجة CSS
- **Docker** - حاويات التطبيق

---

## 📋 متطلبات النظام

### **الحد الأدنى**

- **Node.js:** الإصدار 18.0.0 أو أحدث
- **npm:** الإصدار 8.0.0 أو أحدث
- **MongoDB:** الإصدار 4.4 أو أحدث
- **RAM:** 4 GB على الأقل
- **مساحة التخزين:** 2 GB متاحة

### **المتطلبات الموصى بها**

- **Node.js:** الإصدار 20.0.0 أو أحدث
- **RAM:** 8 GB أو أكثر
- **مساحة التخزين:** 5 GB متاحة
- **اتصال إنترنت:** مستقر وسريع

---

## 🚀 التثبيت والتشغيل

### **1. تحضير البيئة**

```bash
# استنساخ المشروع
git clone https://github.com/MohammedFaisal0/u_chat_boot.git
cd u_chat_boot

# تثبيت المتطلبات
npm install
```

### **2. إعداد متغيرات البيئة**

أنشئ ملف `.env.local` في المجلد الرئيسي:

```env
# قاعدة البيانات
MONGODB_URI=mongodb://localhost:27017/uni-chat-bot

# مفاتيح API
GROQ_API_KEY=your-groq-api-key-here
OPENAI_API_KEY=your-openai-api-key-here

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random-123456789

# إعدادات التطبيق
NODE_ENV=development
API_URL=http://localhost:3000
```

### **3. الحصول على Groq API Key**

1. اذهب إلى [Groq Console](https://console.groq.com/)
2. سجل حساب جديد أو سجل دخول
3. اذهب إلى "API Keys" في القائمة الجانبية
4. اضغط "Create API Key"
5. انسخ المفتاح وضعه في `.env.local`

### **4. تشغيل قاعدة البيانات**

#### **خيار 1: MongoDB محلي**

```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

#### **خيار 2: MongoDB مع Docker**

```bash
# تشغيل MongoDB باستخدام Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### **خيار 3: MongoDB Atlas (سحابي)**

1. اذهب إلى [MongoDB Atlas](https://cloud.mongodb.com/)
2. أنشئ حساب جديد
3. أنشئ cluster جديد
4. احصل على connection string
5. ضع الرابط في `MONGODB_URI`

### **5. تشغيل التطبيق**

```bash
# وضع التطوير
npm run dev

# أو وضع الإنتاج
npm run build
npm start
```

### **6. إعداد البيانات الأولية**

```bash
# إضافة حساب الإدمن
node setup-admin.js

# إضافة التعليمات الافتراضية
node setup-instructions.js
```

---

## ⚙️ إعداد متغيرات البيئة

### **ملف .env.local (للتطوير المحلي)**

```env
# قاعدة البيانات المحلية
MONGODB_URI=mongodb://localhost:27017/uni-chat-bot

# مفاتيح API
GROQ_API_KEY=gsk_your_actual_groq_key_here
OPENAI_API_KEY=sk-your_actual_openai_key_here

# JWT Secret (يجب أن يكون طويل ومعقد)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random-123456789

# إعدادات التطبيق
NODE_ENV=development
API_URL=http://localhost:3000
```

### **ملف .env (للإنتاج)**

```env
# قاعدة البيانات السحابية
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

# مفاتيح API للإنتاج
GROQ_API_KEY=gsk_your_production_groq_key_here
OPENAI_API_KEY=sk-your_production_openai_key_here

# JWT Secret للإنتاج
JWT_SECRET=your-production-super-secret-jwt-key-here

# إعدادات الإنتاج
NODE_ENV=production
API_URL=https://your-domain.com
```

---

## 🗂️ هيكل المشروع

```
uni-chat-bot-main/
├── app/                           # Next.js App Router
│   ├── (auth)/                    # صفحات المصادقة
│   │   ├── login/                 # صفحة تسجيل الدخول
│   │   └── register/              # صفحة التسجيل
│   ├── admin/                     # صفحات الإدارة
│   │   ├── dashboard/             # لوحة تحكم الإدمن
│   │   ├── users/                 # إدارة المستخدمين
│   │   ├── students/              # إدارة الطلاب
│   │   ├── issues/                # إدارة البلاغات
│   │   ├── feedback/              # إدارة التقييمات
│   │   ├── reports/               # التقارير
│   │   ├── chatbot-instructions/ # إدارة تعليمات البوت
│   │   └── faculty-materials/     # إدارة المواد التعليمية
│   ├── student/                   # صفحات الطلاب
│   │   ├── dashboard/             # لوحة تحكم الطالب
│   │   ├── chats/                 # المحادثات
│   │   ├── issues/                # البلاغات
│   │   └── profile/               # الملف الشخصي
│   ├── faculty/                   # صفحات أعضاء هيئة التدريس
│   │   ├── dashboard/             # لوحة تحكم عضو هيئة التدريس
│   │   └── materials/             # المواد التعليمية
│   ├── api/                       # API Routes
│   │   ├── auth/                  # مصادقة
│   │   ├── groq/                  # البوت الذكي
│   │   ├── chats/                 # المحادثات
│   │   ├── issues/                # البلاغات
│   │   ├── feedback/              # التقييمات
│   │   ├── admin/                 # إدارة
│   │   └── faculty/               # أعضاء هيئة التدريس
│   ├── components/                # مكونات React
│   │   ├── admin/                 # مكونات الإدارة
│   │   ├── student/               # مكونات الطلاب
│   │   ├── common/                # مكونات مشتركة
│   │   ├── landing/               # مكونات الصفحة الرئيسية
│   │   └── ui/                    # مكونات واجهة المستخدم
│   ├── lib/                       # مكتبات مساعدة
│   │   ├── auth.js                # نظام المصادقة
│   │   ├── db.js                  # اتصال قاعدة البيانات
│   │   ├── i18n.js                # الترجمة
│   │   └── api.js                 # واجهات API
│   ├── models/                    # نماذج قاعدة البيانات
│   │   ├── Account.js             # نموذج الحسابات
│   │   ├── Student.js             # نموذج الطلاب
│   │   ├── Admin.js               # نموذج الإدمن
│   │   ├── Faculty.js             # نموذج أعضاء هيئة التدريس
│   │   ├── Chat.js                # نموذج المحادثات
│   │   ├── Issue.js               # نموذج البلاغات
│   │   ├── Feedback.js            # نموذج التقييمات
│   │   └── FacultyMaterial.js     # نموذج المواد التعليمية
│   ├── middleware.js              # حماية المسارات
│   └── layout.js                  # التخطيط الرئيسي
├── public/                        # الملفات الثابتة
│   ├── images/                    # الصور
│   └── uploads/                   # الملفات المرفوعة
├── setup-admin.js                 # سكريبت إضافة الإدمن
├── setup-instructions.js          # سكريبت إضافة التعليمات
├── docker-compose.yml             # إعداد Docker
├── Dockerfile                     # صورة Docker
├── package.json                   # متطلبات المشروع
├── tailwind.config.js             # إعداد Tailwind
├── next.config.mjs                # إعداد Next.js
└── README.md                      # هذا الملف
```

---

## 📱 واجهات المستخدم

### **🏠 الصفحة الرئيسية**

- **Hero Section:** مقدمة جذابة عن النظام
- **المميزات:** عرض المميزات الرئيسية
- **حول النظام:** معلومات مفصلة
- **الفريق:** معلومات فريق التطوير
- **اتصل بنا:** معلومات التواصل

### **👨‍💼 لوحة تحكم الإدمن**

- **لوحة التحكم الرئيسية:** إحصائيات شاملة
- **إدارة المستخدمين:** إضافة وتعديل المستخدمين
- **إدارة الطلاب:** إدارة حسابات الطلاب
- **إدارة البلاغات:** متابعة وحل المشاكل
- **التقارير:** تقارير مفصلة عن النظام
- **إدارة التعليمات:** إضافة وتعديل تعليمات البوت
- **إدارة المواد:** مراجعة وموافقة المواد التعليمية

### **👨‍🎓 لوحة تحكم الطالب**

- **لوحة التحكم الشخصية:** إحصائيات شخصية
- **المحادثات:** التفاعل مع البوت الذكي
- **البلاغات:** إرسال وتتبع المشاكل
- **الملف الشخصي:** إدارة المعلومات الشخصية

### **👨‍🏫 لوحة تحكم عضو هيئة التدريس**

- **لوحة التحكم:** إحصائيات المواد
- **تقديم المواد:** رفع المواد التعليمية
- **متابعة المواد:** عرض حالة المواد

---

## 🔧 API Documentation

### **المصادقة (Authentication)**

#### **تسجيل الدخول**

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

#### **التسجيل**

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "password": "string",
  "accountType": "student|faculty|admin"
}
```

### **البوت الذكي (AI Chat)**

#### **إرسال رسالة**

```http
POST /api/groq
Content-Type: application/json
Authorization: Bearer <token>

{
  "message": "string"
}
```

### **المحادثات (Chats)**

#### **الحصول على المحادثات**

```http
GET /api/chats
Authorization: Bearer <token>
```

#### **إنشاء محادثة جديدة**

```http
POST /api/chats
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "string"
}
```

### **البلاغات (Issues)**

#### **الحصول على البلاغات**

```http
GET /api/issues
Authorization: Bearer <token>
```

#### **إنشاء بلاغ جديد**

```http
POST /api/issues
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "string",
  "description": "string",
  "priority": "low|medium|high"
}
```
---

<div align="center">

**تم تطويره بـ ❤️ لطلاب جامعة الإمام محمد بن سعود الإسلامية**

![University Logo](public/univ-chat-bot-logo.png)

_آخر تحديث: ديسمبر 2025_

</div>
