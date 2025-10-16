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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('course', form.course);
      formData.append('topic', form.topic);
      
      if (file) {
        formData.append('file', file);
      }

      const response = await fetch('/api/faculty/materials', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit material');
      }

      setSuccess("Material submitted successfully! It will be reviewed by administrators.");
      setForm({ title: "", description: "", course: "", topic: "" });
      setFile(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <span className="font-medium">Back to Materials</span>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#1e40af] mb-4 flex items-center justify-center">
              <FileText className="w-10 h-10 mr-3 text-[#60a5fa]" />
              Submit New Material
            </h1>
            <p className="text-[#60a5fa] text-lg max-w-2xl mx-auto">
              Share your educational materials with students. Upload PDF files and provide detailed information about your content.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1e40af] mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-[#60a5fa]" />
                Basic Information
              </h2>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1e40af]">
                  Material Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter the educational material title"
                  required
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-[#1e40af] placeholder-gray-500 focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1e40af]">
                  Material Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter a detailed description of the educational material"
                  rows="4"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-[#1e40af] placeholder-gray-500 focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Course Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1e40af] mb-4 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-[#60a5fa]" />
                Course Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1e40af]">
                    Course Name
                  </label>
                  <input
                    type="text"
                    name="course"
                    value={form.course}
                    onChange={(e) => setForm(prev => ({ ...prev, course: e.target.value }))}
                    placeholder="e.g., Programming 101"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-[#1e40af] placeholder-gray-500 focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1e40af]">
                    Topic
                  </label>
                  <input
                    type="text"
                    name="topic"
                    value={form.topic}
                    onChange={(e) => setForm(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="e.g., Programming Fundamentals"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-[#1e40af] placeholder-gray-500 focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1e40af] mb-4 flex items-center">
                <Upload className="w-6 h-6 mr-3 text-[#60a5fa]" />
                File Upload
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
                    <p className="text-sm text-[#1e40af]">Click to upload PDF file</p>
                    <p className="text-xs text-[#60a5fa]">or drag and drop here</p>
                  </label>
                </div>

                {/* File Preview */}
                {file && (
                  <div className="p-4 bg-[#dbeafe]/20 border border-[#60a5fa]/20 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <File className="w-8 h-8 text-[#60a5fa]" />
                        <div>
                          <p className="font-medium text-[#1e40af]">{file.name}</p>
                          <p className="text-sm text-[#60a5fa]">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* PDF Guidelines */}
                <div className="p-6 bg-[#dbeafe]/20 border border-[#60a5fa]/20 rounded-2xl">
                  <h4 className="font-semibold text-[#1e40af] mb-3 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    PDF File Guidelines
                  </h4>
                  <div className="text-[#60a5fa] text-sm space-y-2">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Recommended size: Up to 10 MB, 10-100 pages</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Text-based PDF: Not scanned images</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Language: Arabic or English</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Note: Text longer than 100,000 characters will be truncated</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-green-700">{success}</p>
              </div>
            )}

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
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Material</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
