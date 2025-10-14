// app/components/admin/ManageInstructions.jsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { Edit, Trash2, PlusCircle, BookOpen, FileText, CheckCircle } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/uis";
import { useI18n } from "@/lib/i18n";
import { DataTable } from "@/components/ui/AdvancedDataTable";

export default function ManageInstructions() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingInstruction, setEditingInstruction] = useState(null);
  const [newInstructionDetails, setNewInstructionDetails] = useState("");
  const [newInstructionTitle, setNewInstructionTitle] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [approvedMaterials, setApprovedMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const { t, isRTL } = useI18n();

  const fetchInstructions = useCallback(async (page, search) => {
    try {
      const response = await fetch(
        `/api/chatbot-instructions?page=${page}&search=${search}`
      );
      if (!response.ok) throw new Error("Failed to fetch instructions");
      const data = await response.json();
      return {
        items: data.instructions || [],
        totalPages: data.totalPages || 1,
      };
    } catch (error) {
      console.error("Error fetching instructions:", error);
      return {
        items: [],
        totalPages: 1,
      };
    }
  }, []);

  const fetchApprovedMaterials = useCallback(async () => {
    try {
      setLoadingMaterials(true);
      const response = await fetch('/api/admin/faculty-materials?status=approved');
      if (!response.ok) throw new Error("Failed to fetch approved materials");
      const data = await response.json();
      setApprovedMaterials(data.materials || []);
    } catch (error) {
      console.error("Error fetching approved materials:", error);
      setApprovedMaterials([]);
    } finally {
      setLoadingMaterials(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovedMaterials();
  }, [fetchApprovedMaterials]);

  const deleteInstruction = async (id) => {
    const response = await fetch(`/api/chatbot-instructions/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete instruction");
    setRefreshTrigger((prev) => prev + 1);
  };

  const updateInstruction = async (id, updatedData) => {
    const response = await fetch(`/api/chatbot-instructions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error("Failed to update instruction");
    setRefreshTrigger((prev) => prev + 1);
  };

  const convertMaterialToInstruction = async (materialId) => {
    try {
      const response = await fetch(`/api/admin/faculty-materials/${materialId}/create-instruction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to convert material to instruction");
      
      // Remove the material from the local list immediately
      setApprovedMaterials(prevMaterials => 
        prevMaterials.filter(material => material._id !== materialId)
      );
      
      // Refresh instructions list
      setRefreshTrigger((prev) => prev + 1);
      
      alert(isRTL ? "تم تحويل المادة إلى تعليمة بنجاح!" : "Material converted to instruction successfully!");
    } catch (error) {
      console.error("Error converting material:", error);
      alert(isRTL ? "فشل في تحويل المادة إلى تعليمة" : "Failed to convert material to instruction");
    }
  };

  const handleEditClick = (instruction) => {
    setEditingInstruction(instruction);
    setIsEditModalOpen(true);
  };

  const handleEditConfirm = async () => {
    if (!editingInstruction) return;
    await updateInstruction(editingInstruction._id, {
      title: editingInstruction.title,
      content: editingInstruction.content,
      // Keep details for backward compatibility
      details: editingInstruction.content || editingInstruction.details,
    });
    setIsEditModalOpen(false);
    setEditingInstruction(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAddInstruction = async () => {
    try {
      const response = await fetch("/api/chatbot-instructions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newInstructionTitle || "New Instruction",
          content: newInstructionDetails,
          details: newInstructionDetails, // Backward compatibility
        }),
      });
      if (!response.ok) throw new Error("Failed to add instruction");
      setIsEditModalOpen(false);
      setNewInstructionDetails("");
      setNewInstructionTitle("");
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("An error occurred while adding the instruction:", err);
    }
  };

  const columns = [
    {
      key: "instruction_id",
      label: "ID",
      render: (instruction) => {
        if (!instruction) {
          return <div className="text-gray-500">-</div>;
        }
        return <div className="font-mono text-sm text-[#1e40af]">{instruction.instruction_id || instruction._id}</div>;
      }
    },
    {
      key: "title",
      label: "Title",
      render: (instruction) => {
        if (!instruction) {
          return <div className="text-gray-500">-</div>;
        }
        return <div className="font-medium text-[#1e40af]">{instruction.title || "Untitled"}</div>;
      }
    },
    {
      key: "content",
      label: "Content",
      render: (instruction) => {
        if (!instruction) {
          return <div className="text-gray-500">No data</div>;
        }

        const content = instruction.content || instruction.details || "";
        const truncatedContent = content.length > 80
          ? content.substring(0, 80) + "..."
          : content;
        
        return (
          <div className="max-w-xs">
            <div className="text-sm text-[#1e40af] mb-2 leading-relaxed">
              {truncatedContent}
            </div>
            {content.length > 80 && (
              <button
                onClick={() => {
                  // Create a modal to display the full content
                  const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[80] p-4';
                  modal.innerHTML = `
                    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
                      <div class="bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white p-6">
                        <div class="flex justify-between items-center">
                          <h3 class="text-xl font-bold">Full Instruction Content</h3>
                          <button onclick="this.closest('.fixed').remove()" class="text-gray-200 hover:text-white text-2xl">&times;</button>
                        </div>
                      </div>
                      <div class="p-6">
                        <div class="bg-[#f8fafc] border border-[#dbeafe] rounded-xl p-4 max-h-96 overflow-y-auto">
                          <div class="whitespace-pre-wrap text-sm text-[#1e40af] leading-relaxed">
                            ${content}
                          </div>
                        </div>
                        <div class="mt-4 text-xs text-[#1e40af]">
                          Character count: ${content.length.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  `;
                  document.body.appendChild(modal);
                }}
                className="text-[#60a5fa] hover:text-[#3b82f6] text-xs font-medium hover:underline transition-colors"
              >
                View Full Content
              </button>
            )}
          </div>
        );
      }
    },
    {
      key: "material",
      label: "Source Material",
      render: (instruction) => {
        if (!instruction) {
          return <div className="text-gray-500">No data</div>;
        }

        if (instruction.material) {
          return (
            <div className="text-sm">
              <div className="text-[#1e40af] font-medium">From PDF Material</div>
              <div className="text-[#1e40af] text-xs">ID: {instruction.material}</div>
            </div>
          );
        }
        return (
          <div className="text-sm text-[#1e40af]">Manual Entry</div>
        );
      }
    },
    {
      key: "version",
      label: "Version",
      render: (instruction) => {
        if (!instruction) {
          return <div className="text-gray-500">-</div>;
        }
        return <div className="text-sm text-[#1e40af]">{instruction.version || "1.0"}</div>;
      }
    },
  ];

  return (
    <div className="min-h-screen bg-[#d7e7fd] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#f8fafc]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#dbeafe]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Add Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white px-6 py-3 rounded-2xl hover:from-[#3b82f6] hover:to-[#60a5fa] transition-all duration-300 transform hover:scale-105 font-bold flex items-center"
          >
            <PlusCircle size={20} className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'إضافة تعليمة' : 'Add Instruction'}
          </button>
        </div>

        {/* Approved Materials Section */}
        <div className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h3 className={`text-xl font-semibold text-[#1e40af] flex items-center gap-3 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              <BookOpen className="w-6 h-6 text-[#60a5fa]" />
              {isRTL ? 'المواد المعتمدة - تحويل إلى تعليمات' : 'Approved Materials - Convert to Instructions'}
            </h3>
            <p className={`text-[#1e40af] text-sm mt-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {isRTL ? 'المواد التعليمية التي تمت الموافقة عليها ويمكن تحويلها إلى تعليمات للبوت' : 'Educational materials that have been approved and can be converted to bot instructions'}
            </p>
          </div>
          
          <div className="p-6">
            {loadingMaterials ? (
              <div className="text-center py-8">
                <div className="text-[#1e40af] text-lg">{isRTL ? 'جاري التحميل...' : 'Loading...'}</div>
              </div>
            ) : approvedMaterials.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className={`text-lg font-semibold text-[#1e40af] mb-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {isRTL ? 'لا توجد مواد معتمدة' : 'No Approved Materials'}
                </h4>
                <p className={`text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {isRTL ? 'لم يتم العثور على أي مواد تعليمية معتمدة' : 'No approved educational materials found'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {approvedMaterials.map((material) => (
                  <div key={material._id} className="bg-white/5 border border-white/20 rounded-xl p-4 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="w-5 h-5 text-[#60a5fa]" />
                          <h4 className={`text-[#1e40af] font-semibold ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                            {material.title}
                          </h4>
                          <span className="text-xs font-semibold text-[#1e40af] bg-[#f8fafc]/20 px-2 py-1 rounded-full">
                            {isRTL ? 'معتمد' : 'Approved'}
                          </span>
                        </div>
                        
                        {material.description && (
                          <p className={`text-[#1e40af] text-sm mb-2 line-clamp-1 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                            {material.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-[#1e40af]">
                          {material.course && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{isRTL ? 'المقرر:' : 'Course:'}</span>
                              <span>{material.course}</span>
                            </div>
                          )}
                          {material.topic && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{isRTL ? 'الموضوع:' : 'Topic:'}</span>
                              <span>{material.topic}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => convertMaterialToInstruction(material._id)}
                        className="ml-4 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white px-4 py-2 rounded-lg hover:from-[#3b82f6] hover:to-[#60a5fa] transition-all duration-300 font-semibold text-sm flex items-center gap-2 whitespace-nowrap"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {isRTL ? 'تحويل إلى تعليمة' : 'Convert to Instruction'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DataTable */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h3 className={`text-xl font-semibold text-[#1e40af] flex items-center gap-3 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              <FileText className="w-6 h-6 text-[#60a5fa]" />
              {isRTL ? 'التعليمات اليدوية' : 'Manual Instructions'}
            </h3>
            <p className={`text-[#1e40af] text-sm mt-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {isRTL ? 'التعليمات التي تم إنشاؤها يدوياً من قبل المشرف' : 'Instructions created manually by the administrator'}
            </p>
          </div>
          <DataTable
            fetchData={fetchInstructions}
            columns={columns}
            refreshTrigger={refreshTrigger}
            onEdit={(instruction) => {
              setEditingInstruction(instruction);
              setIsEditModalOpen(true);
            }}
            onDelete={deleteInstruction}
            searchPlaceholder={isRTL ? "البحث في التعليمات..." : "Search instructions..."}
          />
        </div>
      </div>

      {/* Custom Modal for Add/Edit Instruction */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold text-white ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {editingInstruction ? (isRTL ? "تعديل التعليمة" : "Edit Instruction") : (isRTL ? "إضافة تعليمة جديدة" : "Add New Instruction")}
                </h3>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingInstruction(null);
                    setNewInstructionDetails("");
                    setNewInstructionTitle("");
                  }}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (editingInstruction) {
                  handleEditConfirm();
                } else {
                  handleAddInstruction();
                }
              }} className="space-y-6">
                <div>
                  <label htmlFor="instructionTitle" className={`block mb-2 text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? "العنوان:" : "Title:"}
                  </label>
                  <input
                    id="instructionTitle"
                    type="text"
                    value={
                      editingInstruction
                        ? editingInstruction.title || ""
                        : newInstructionTitle
                    }
                    onChange={(e) =>
                      editingInstruction
                        ? setEditingInstruction({
                          ...editingInstruction,
                          title: e.target.value,
                        })
                        : setNewInstructionTitle(e.target.value)
                    }
                    className={`w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] text-white placeholder-gray-300 ${isRTL ? 'font-arabic' : 'font-latin'}`}
                    placeholder={isRTL ? "عنوان التعليمة" : "Instruction title"}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="instructionContent" className={`block mb-2 text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? "المحتوى:" : "Content:"}
                  </label>
                  <textarea
                    id="instructionContent"
                    value={
                      editingInstruction
                        ? editingInstruction.content || editingInstruction.details || ""
                        : newInstructionDetails
                    }
                    onChange={(e) =>
                      editingInstruction
                        ? setEditingInstruction({
                          ...editingInstruction,
                          content: e.target.value,
                        })
                        : setNewInstructionDetails(e.target.value)
                    }
                    className={`w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] text-white placeholder-gray-300 resize-none ${isRTL ? 'font-arabic' : 'font-latin'}`}
                    rows="6"
                    placeholder={isRTL ? "محتوى التعليمة" : "Instruction content"}
                    required
                  />
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingInstruction(null);
                      setNewInstructionDetails("");
                    }}
                    className="px-6 py-3 bg-[#60a5fa]/20 text-[#60a5fa] border border-[#60a5fa]/30 rounded-2xl hover:bg-[#60a5fa]/30 transition-colors"
                  >
                    {isRTL ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white rounded-2xl hover:from-[#3b82f6] hover:to-[#60a5fa] transition-all duration-300 transform hover:scale-105 font-bold"
                  >
                    {editingInstruction ? (isRTL ? "تحديث" : "Update") : (isRTL ? "إضافة" : "Add")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
