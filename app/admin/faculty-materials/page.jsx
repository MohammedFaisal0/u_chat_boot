// app/admin/faculty-materials/page.jsx
"use client";
import { useEffect, useState } from "react";
import PDFGuidelines from "@/components/admin/PDFGuidelines";
import { useI18n } from "@/lib/i18n";

export default function AdminFacultyMaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t, isRTL } = useI18n();


  const fetchData = async (status) => {
    setLoading(true);
    setError("");
    try {
      // Use real API data
      const res = await fetch(`/api/admin/faculty-materials?status=${status}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch materials");
      setMaterials(data.materials || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  const act = async (id, action) => {
    const res = await fetch(`/api/admin/faculty-materials`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || "Operation failed");
    fetchData(filter);
  };

  const createInstruction = async (materialId) => {
    if (!confirm("Create instruction from this material?")) return;
    try {
      const res = await fetch(`/api/admin/faculty-materials/${materialId}/create-instruction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create instruction");
      alert("Instruction created successfully!");
      fetchData(filter);
    } catch (e) {
      alert(e.message);
    }
  };

  const viewPDFContent = async (materialId) => {
    try {
      const res = await fetch(`/api/admin/faculty-materials/${materialId}/extract-pdf`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to extract PDF content");

      // Create a modal to display the content
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[80] p-4';
      modal.innerHTML = `
        <div class="bg-gradient-to-br from-white to-[#f8fafc] rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-[#dbeafe]/30">
          <!-- Header -->
          <div class="p-6 bg-[#f8fafc] border-b border-[#dbeafe]/30 text-[#1e40af]">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h2 class="text-2xl font-bold mb-2 flex items-center gap-3">
                  <svg class="w-8 h-8 text-[#60a5fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  ${data.material.title}
                </h2>
                <p class="text-[#60a5fa] text-sm">PDF Content Viewer</p>
              </div>
              <button onclick="this.closest('.fixed').remove()" class="text-[#60a5fa] hover:text-[#3b82f6] transition-colors p-2 hover:bg-[#dbeafe]/20 rounded-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="flex flex-col h-[calc(90vh-120px)]">
            <!-- Info Cards -->
            <div class="p-6 border-b border-[#dbeafe]/30">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <!-- Course Info -->
                <div class="bg-[#dbeafe]/20 border border-[#dbeafe]/30 rounded-xl p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-5 h-5 text-[#60a5fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span class="font-semibold text-[#1e40af]">Course</span>
                  </div>
                  <p class="text-[#60a5fa] text-sm">${data.material.course || 'N/A'}</p>
                </div>

                <!-- Topic Info -->
                <div class="bg-[#dbeafe]/20 border border-[#dbeafe]/30 rounded-xl p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-5 h-5 text-[#60a5fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span class="font-semibold text-[#1e40af]">Topic</span>
                  </div>
                  <p class="text-[#60a5fa] text-sm">${data.material.topic || 'N/A'}</p>
                </div>

                <!-- Status Info -->
                <div class="bg-[#dbeafe]/20 border border-[#dbeafe]/30 rounded-xl p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-5 h-5 text-[#60a5fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-semibold text-[#1e40af]">Status</span>
                  </div>
                  <span class="px-2 py-1 rounded-full text-xs font-semibold ${
                    data.material.status === 'approved' ? 'bg-[#f8fafc] text-[#1e40af] border border-[#1e40af]/30' :
                    data.material.status === 'rejected' ? 'bg-[#f8fafc] text-[#1e40af] border border-[#1e40af]/30' :
                    'bg-[#dbeafe] text-[#60a5fa] border border-[#60a5fa]/30'
                  }">
                    ${data.material.status}
                  </span>
                </div>

                <!-- File Info -->
                <div class="bg-[#dbeafe]/20 border border-[#dbeafe]/30 rounded-xl p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-5 h-5 text-[#60a5fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="font-semibold text-[#1e40af]">File Size</span>
                  </div>
                  <p class="text-[#60a5fa] text-sm">${data.pdfInfo.fileSizeMB} MB</p>
                </div>
              </div>

              <!-- Additional Stats -->
              <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="flex items-center gap-2 text-sm text-[#60a5fa]">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span><strong>Pages:</strong> ${data.pdfInfo.pages}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-[#60a5fa]">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span><strong>Characters:</strong> ${data.pdfInfo.textLength.toLocaleString()}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-[#60a5fa]">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Extracted:</strong> ${new Date(data.extractionTime).toLocaleString()}</span>
                </div>
              </div>

              <!-- Warnings -->
              ${data.pdfInfo.isLargeFile || data.pdfInfo.isLongText ? `
                <div class="mt-4 p-3 bg-[#dbeafe]/20 border border-[#dbeafe]/30 rounded-lg">
                  <div class="flex items-center gap-2 text-[#1e40af]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span class="font-semibold">File Information</span>
                  </div>
                  <div class="text-[#60a5fa] text-sm mt-1">
                    ${data.pdfInfo.isLargeFile ? '• Large file - may take longer to process<br>' : ''}
                    ${data.pdfInfo.isLongText ? '• Long text - may be truncated for chatbot<br>' : ''}
                  </div>
          </div>
              ` : ''}
            </div>

            <!-- Text Content -->
            <div class="flex-1 p-6 overflow-hidden">
              <div class="h-full flex flex-col">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold text-[#1e40af] flex items-center gap-2">
                    <svg class="w-5 h-5 text-[#60a5fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Extracted Text Content
                  </h3>
                  <div class="text-sm text-[#60a5fa]">
                    ${data.extractedText.length.toLocaleString()} characters
                  </div>
                </div>
                <div class="flex-1 bg-white border border-[#dbeafe]/30 rounded-xl overflow-hidden">
                  <div class="h-full overflow-y-auto p-4">
                    <div class="whitespace-pre-wrap text-sm text-[#1e40af] leading-relaxed font-mono">
              ${data.extractedText}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } catch (e) {
      alert("Error viewing PDF content: " + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#d7e7fd] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#f8fafc]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#dbeafe]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Filters */}
        <div className="mb-6 flex gap-4 items-center justify-between">
          <select
            className={`px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="pending" className="bg-[#60a5fa] text-white">{isRTL ? 'في الانتظار' : 'Pending'}</option>
            <option value="approved" className="bg-[#60a5fa] text-white">{isRTL ? 'موافق عليه' : 'Approved'}</option>
            <option value="rejected" className="bg-[#60a5fa] text-white">{isRTL ? 'مرفوض' : 'Rejected'}</option>
            <option value="" className="bg-[#60a5fa] text-white">{isRTL ? 'الكل' : 'All'}</option>
          </select>
          <PDFGuidelines />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-500">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-[#1e40af] text-lg">{isRTL ? 'جاري التحميل...' : 'Loading...'}</div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                      {isRTL ? 'العنوان' : 'Title'}
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                      {isRTL ? 'الأستاذ' : 'Faculty'}
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                      {isRTL ? 'المقرر' : 'Course'}
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                      {isRTL ? 'الموضوع' : 'Topic'}
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                      {isRTL ? 'الحالة' : 'Status'}
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                      {isRTL ? 'الملف' : 'File'}
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                      {isRTL ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {materials.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <p className={`text-gray-400 text-lg ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                            {isRTL ? 'لا توجد مواد' : 'No materials found'}
                          </p>
                          <p className={`text-gray-500 text-sm mt-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                            {isRTL ? 'لم يتم العثور على أي مواد تعليمية' : 'No educational materials were found'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    materials.map((m) => (
                      <tr key={m._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <div className="font-medium text-[#1e40af]">{m.title}</div>
                            {m.description && (
                              <div className="text-sm text-[#1e40af] truncate">{m.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-[#1e40af]">{m.faculty?.name || "-"}</div>
                            {m.faculty?.email && (
                              <div className="text-[#1e40af] text-xs">{m.faculty.email}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-[#1e40af]">{m.course || "-"}</div>
                            {m.topic && (
                              <div className="text-[#1e40af] text-xs">{m.topic}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-[#1e40af]">{m.topic || "-"}</div>
                            {m.submitted_at && (
                              <div className="text-[#1e40af] text-xs">
                                {new Date(m.submitted_at).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${m.status === "pending" ? "bg-[#dbeafe]/20 text-[#60a5fa] border border-[#60a5fa]/30" :
                              m.status === "approved" ? "bg-[#f8fafc]/20 text-[#1e40af] border border-[#1e40af]/30" :
                                "bg-[#f8fafc]/20 text-[#1e40af] border border-[#1e40af]/30"
                            }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {m.file_url ? (
                              <a
                                className="text-[#60a5fa] hover:text-[#3b82f6] underline text-sm"
                                href={m.file_url}
                                target="_blank"
                              >
                              {isRTL ? 'فتح الملف' : 'Open File'}
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {m.status === "pending" ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => act(m._id, "approve")}
                                className="px-4 py-2 bg-green-500/20 text-green-500 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
                              >
                                {isRTL ? 'موافقة' : 'Approve'}
                              </button>
                              <button
                                onClick={() => act(m._id, "reject")}
                                className="px-4 py-2 bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                              >
                                {isRTL ? 'رفض' : 'Reject'}
                              </button>
                            </div>
                          ) : m.status === "approved" ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => createInstruction(m._id)}
                                className="px-4 py-2 bg-[#60a5fa]/20 text-[#60a5fa] border border-[#60a5fa]/30 rounded-lg hover:bg-[#60a5fa]/30 transition-colors text-sm"
                              >
                                {isRTL ? 'إنشاء تعليمة' : 'Create Instruction'}
                              </button>
                              <button
                                onClick={() => viewPDFContent(m._id)}
                                className="px-4 py-2 bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30 rounded-lg hover:bg-[#3b82f6]/30 transition-colors text-sm"
                              >
                                {isRTL ? 'عرض PDF' : 'View PDF'}
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



