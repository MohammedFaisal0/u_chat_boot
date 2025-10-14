// app/faculty/materials/submit/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Upload, 
  BookOpen, 
  Tag, 
  File,
  ArrowLeft,
  Send,
  Loader2,
  X
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function SubmitMaterial() {
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    course: "", 
    topic: "" 
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { t, isRTL } = useI18n();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError("");
  };

  const removeFile = () => {
    setFile(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      let res;
      
      if (file) {
        // Upload with file
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.description);
        fd.append("course", form.course);
        fd.append("topic", form.topic);
        fd.append("file", file);
        
        res = await fetch("/api/faculty/materials", { 
          method: "POST", 
          body: fd 
        });
      } else {
        // Upload without file
        res = await fetch("/api/faculty/materials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit material");
      }

      const result = await res.json();
      setSuccess(isRTL ? "تم تقديم المادة بنجاح!" : "Material submitted successfully!");
      
      // Reset form
      setForm({ title: "", description: "", course: "", topic: "" });
      setFile(null);
      removeFile();
      
      // Redirect after 2 seconds
      setTimeout(() => {
      router.push("/faculty/materials");
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormField = ({ label, name, type = "text", required = false, placeholder = "", rows = 1, children }) => (
    <div className="space-y-2">
      <label className={`block text-sm font-medium text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children || (
        type === "textarea" ? (
          <textarea
            name={name}
            value={form[name]}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            required={required}
            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-[#1e40af] placeholder-gray-500 focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent resize-none ${isRTL ? 'font-arabic' : 'font-latin'}`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-[#1e40af] placeholder-gray-500 focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent ${isRTL ? 'font-arabic' : 'font-latin'}`}
          />
        )
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#d7e7fd] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#f8fafc]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#dbeafe]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-[#f8fafc]/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/faculty/materials"
              className="flex items-center space-x-2 text-[#60a5fa] hover:text-[#3b82f6] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className={`${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? 'العودة للمواد' : 'Back to Materials'}
              </span>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className={`text-4xl font-bold text-[#1e40af] mb-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {isRTL ? 'تقديم مادة تعليمية جديدة' : 'Submit New Educational Material'}
            </h1>
            <p className={`text-lg text-[#60a5fa] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {isRTL ? 'قدم مادة تعليمية جديدة للمراجعة والموافقة' : 'Submit a new educational material for review and approval'}
            </p>
          </div>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8">
            <form onSubmit={onSubmit} className="space-y-8">
              {/* Error/Success Messages */}
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-600 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className={`${isRTL ? 'font-arabic' : 'font-latin'}`}>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-2xl text-[#1e40af] flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className={`${isRTL ? 'font-arabic' : 'font-latin'}`}>{success}</span>
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className={`text-2xl font-bold text-[#1e40af] mb-4 flex items-center ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  <FileText className="w-6 h-6 mr-3 text-[#60a5fa]" />
                  {isRTL ? 'المعلومات الأساسية' : 'Basic Information'}
                </h2>

                <FormField
                  label={isRTL ? 'عنوان المادة' : 'Material Title'}
                  name="title"
                  required
                  placeholder={isRTL ? 'أدخل عنوان المادة التعليمية' : 'Enter the educational material title'}
                />

                <FormField
                  label={isRTL ? 'وصف المادة' : 'Material Description'}
                  name="description"
                  type="textarea"
                  rows={4}
                  placeholder={isRTL ? 'أدخل وصفاً مفصلاً للمادة التعليمية' : 'Enter a detailed description of the educational material'}
                />
              </div>

              {/* Course Information */}
              <div className="space-y-6">
                <h2 className={`text-2xl font-bold text-[#1e40af] mb-4 flex items-center ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  <BookOpen className="w-6 h-6 mr-3 text-[#60a5fa]" />
                  {isRTL ? 'معلومات المقرر' : 'Course Information'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label={isRTL ? 'اسم المقرر' : 'Course Name'}
                    name="course"
                    placeholder={isRTL ? 'مثال: البرمجة 101' : 'e.g., Programming 101'}
                  />

                  <FormField
                    label={isRTL ? 'الموضوع' : 'Topic'}
                    name="topic"
                    placeholder={isRTL ? 'مثال: أساسيات البرمجة' : 'e.g., Programming Fundamentals'}
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-6">
                <h2 className={`text-2xl font-bold text-[#1e40af] mb-4 flex items-center ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  <Upload className="w-6 h-6 mr-3 text-[#60a5fa]" />
                  {isRTL ? 'رفع الملف' : 'File Upload'}
                </h2>

                <div className="space-y-4">
                  <div className="relative">
          <input 
            type="file" 
            accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer hover:border-[#60a5fa] hover:bg-white/5 transition-all duration-300"
                    >
                      <Upload className="w-8 h-8 text-[#60a5fa] mb-2" />
                      <p className={`text-sm text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                        {isRTL ? 'انقر لرفع ملف PDF' : 'Click to upload PDF file'}
                      </p>
                      <p className={`text-xs text-[#60a5fa] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                        {isRTL ? 'أو اسحب الملف هنا' : 'or drag and drop here'}
                      </p>
                    </label>
                  </div>

                  {/* File Preview */}
                  {file && (
                    <div className="p-4 bg-white/5 border border-white/20 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <File className="w-8 h-8 text-[#60a5fa]" />
                          <div>
                            <p className={`text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                              {file.name}
                            </p>
                            <p className={`text-sm text-[#60a5fa] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
          
          {/* PDF Guidelines */}
                  <div className="p-6 bg-[#dbeafe]/20 border border-[#60a5fa]/20 rounded-2xl">
                    <h4 className={`font-semibold text-[#1e40af] mb-3 flex items-center ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                      <Info className="w-5 h-5 mr-2" />
                      {isRTL ? 'إرشادات ملف PDF' : 'PDF File Guidelines'}
            </h4>
                    <div className={`text-[#60a5fa] text-sm space-y-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{isRTL ? 'الحجم الموصى به: حتى 10 ميجابايت، 10-100 صفحة' : 'Recommended size: Up to 10 MB, 10-100 pages'}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{isRTL ? 'ملف PDF نصي: وليس صور ممسوحة ضوئياً' : 'Text-based PDF: Not scanned images'}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{isRTL ? 'اللغة: العربية أو الإنجليزية' : 'Language: Arabic or English'}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{isRTL ? 'ملاحظة: النص الأطول من 100,000 حرف سيتم اقتطاعه' : 'Note: Text longer than 100,000 characters will be truncated'}</span>
                      </div>
                    </div>
                  </div>
            </div>
          </div>
          
              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white rounded-2xl hover:from-[#3b82f6] hover:to-[#60a5fa] transition-all duration-300 transform hover:scale-105 font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className={`${isRTL ? 'font-arabic' : 'font-latin'}`}>
                        {isRTL ? 'جاري التقديم...' : 'Submitting...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span className={`${isRTL ? 'font-arabic' : 'font-latin'}`}>
                        {isRTL ? 'تقديم المادة' : 'Submit Material'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
            </div>
        </div>
      </div>
    </div>
  );
}


