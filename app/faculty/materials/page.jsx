// app/faculty/materials/page.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Search, 
  Filter, 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlusCircle,
  RefreshCw,
  Edit,
  Trash2,
  Upload,
  File,
  X
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function FacultyMaterialsList() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    course: "",
    topic: ""
  });
  const [editFile, setEditFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, isRTL } = useI18n();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
      try {
      setLoading(true);
      setError("");
        const res = await fetch("/api/faculty/materials");
      if (!res.ok) throw new Error("Failed to fetch materials");
      
        const data = await res.json();
        setMaterials(data.materials || []);
    } catch (err) {
      setError(err.message);
      } finally {
        setLoading(false);
      }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setEditForm({
      title: material.title || "",
      description: material.description || "",
      course: material.course || "",
      topic: material.topic || ""
    });
    setEditFile(null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('description', editForm.description);
      formData.append('course', editForm.course);
      formData.append('topic', editForm.topic);
      
      if (editFile) {
        formData.append('file', editFile);
      }

      const response = await fetch(`/api/faculty/materials/${editingMaterial._id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update material');
      }

      // Update local state
      const updatedMaterial = await response.json();
      setMaterials(prev => prev.map(m => 
        m._id === editingMaterial._id ? { ...m, ...updatedMaterial.material } : m
      ));

      setIsEditModalOpen(false);
      setEditingMaterial(null);
      setEditForm({ title: "", description: "", course: "", topic: "" });
      setEditFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setEditFile(selectedFile);
  };

  const removeEditFile = () => {
    setEditFile(null);
    const fileInput = document.querySelector('input[name="editFile"]');
    if (fileInput) fileInput.value = '';
  };

  const handleDelete = async (materialId) => {
    if (!confirm("Are you sure you want to delete this material?")) {
      return;
    }

    try {
      const response = await fetch(`/api/faculty/materials/${materialId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("Failed to delete material");
      }

      // Remove from local state
      setMaterials(prev => prev.filter(m => m._id !== materialId));
    } catch (error) {
      console.error("Error deleting material:", error);
      setError("Failed to delete material");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-[#1e40af]" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-[#1e40af]" />;
      case "pending":
        return <Clock className="w-4 h-4 text-[#60a5fa]" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-[#f8fafc]/20 text-[#1e40af] border border-[#1e40af]/30";
      case "rejected":
        return "bg-[#f8fafc]/20 text-[#1e40af] border border-[#1e40af]/30";
      case "pending":
        return "bg-[#dbeafe]/20 text-[#60a5fa] border border-[#60a5fa]/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return isRTL ? "موافق عليها" : "Approved";
      case "rejected":
        return isRTL ? "مرفوضة" : "Rejected";
      case "pending":
        return isRTL ? "في الانتظار" : "Pending";
      default:
        return status;
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.topic?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || material.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.submitted_at) - new Date(a.submitted_at);
      case "oldest":
        return new Date(a.submitted_at) - new Date(b.submitted_at);
      case "title":
        return a.title.localeCompare(b.title);
      case "status":
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const MaterialCard = ({ material }) => (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`text-xl font-bold text-[#1e40af] mb-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            {material.title}
          </h3>
          {material.description && (
            <p className={`text-[#1e40af] text-sm mb-3 line-clamp-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {material.description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {getStatusIcon(material.status)}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(material.status)}`}>
            {getStatusText(material.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-[#60a5fa]" />
          <span className={`text-sm text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            <strong>{isRTL ? 'المقرر:' : 'Course:'}</strong> {material.course || '-'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-[#60a5fa]" />
          <span className={`text-sm text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            <strong>{isRTL ? 'الموضوع:' : 'Topic:'}</strong> {material.topic || '-'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-[#60a5fa]" />
          <span className={`text-sm text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            <strong>{isRTL ? 'تاريخ التقديم:' : 'Submitted:'}</strong> {new Date(material.submitted_at).toLocaleDateString()}
          </span>
        </div>
        {material.approved_at && (
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className={`text-sm text-gray-300 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              <strong>{isRTL ? 'تاريخ الموافقة:' : 'Approved:'}</strong> {new Date(material.approved_at).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center space-x-3">
          {material.file_url && (
            <>
              <a
                href={material.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-[#dbeafe]/20 text-[#60a5fa] border border-[#60a5fa]/30 rounded-xl hover:bg-[#dbeafe]/30 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className={`text-sm ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {isRTL ? 'عرض' : 'View'}
                </span>
              </a>
              <a
                href={material.file_url}
                download
                className="flex items-center space-x-2 px-4 py-2 bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30 rounded-xl hover:bg-[#3b82f6]/30 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className={`text-sm ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {isRTL ? 'تحميل' : 'Download'}
                </span>
              </a>
            </>
          )}
          
          {/* Edit and Delete buttons - only show for pending materials */}
          {material.status === "pending" && (
            <>
              <button
                onClick={() => handleEdit(material)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30 rounded-xl hover:bg-[#f59e0b]/30 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span className={`text-sm ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {isRTL ? 'تعديل' : 'Edit'}
                </span>
              </button>
              <button
                onClick={() => handleDelete(material._id)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30 rounded-xl hover:bg-[#ef4444]/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className={`text-sm ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {isRTL ? 'حذف' : 'Delete'}
                </span>
              </button>
            </>
          )}
        </div>
        <div className="text-xs text-[#60a5fa]">
          ID: {material.material_id}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#d7e7fd] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#60a5fa] animate-spin mx-auto mb-4" />
          <p className={`text-[#1e40af] text-lg ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            {isRTL ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d7e7fd] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#f8fafc]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#dbeafe]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold text-[#1e40af] mb-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? 'موادي التعليمية' : 'My Materials'}
              </h1>
              <p className={`text-lg text-[#60a5fa] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? 'إدارة وعرض جميع المواد التعليمية المقدمة' : 'Manage and view all submitted educational materials'}
              </p>
            </div>
            <Link
              href="/faculty/materials/submit"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white rounded-2xl hover:from-[#3b82f6] hover:to-[#60a5fa] transition-all duration-300 transform hover:scale-105 font-bold"
            >
              <PlusCircle className="w-5 h-5" />
              <span className={`${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? 'تقديم مادة جديدة' : 'Submit New Material'}
              </span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm text-[#60a5fa] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {isRTL ? 'إجمالي المواد' : 'Total Materials'}
                </p>
                <p className={`text-2xl font-bold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {materials.length}
                </p>
              </div>
              <BookOpen className="w-6 h-6 text-[#60a5fa]" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm text-[#60a5fa] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {isRTL ? 'في الانتظار' : 'Pending'}
                </p>
                <p className={`text-2xl font-bold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {materials.filter(m => m.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-6 h-6 text-[#60a5fa]" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm text-[#60a5fa] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {isRTL ? 'موافق عليها' : 'Approved'}
                </p>
                <p className={`text-2xl font-bold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {materials.filter(m => m.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-[#1e40af]" />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm text-[#60a5fa] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {isRTL ? 'مرفوضة' : 'Rejected'}
                </p>
                <p className={`text-2xl font-bold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {materials.filter(m => m.status === 'rejected').length}
                </p>
              </div>
              <XCircle className="w-6 h-6 text-[#1e40af]" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#60a5fa] w-4 h-4" />
              <input
                type="text"
                placeholder={isRTL ? "البحث في المواد..." : "Search materials..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-[#1e40af] placeholder-gray-500 focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent ${isRTL ? 'font-arabic' : 'font-latin'}`}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#60a5fa] w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-[#1e40af] focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent appearance-none ${isRTL ? 'font-arabic' : 'font-latin'}`}
              >
                <option value="all" className="bg-[#60a5fa] text-white">
                  {isRTL ? 'جميع الحالات' : 'All Status'}
                </option>
                <option value="pending" className="bg-[#60a5fa] text-white">
                  {isRTL ? 'في الانتظار' : 'Pending'}
                </option>
                <option value="approved" className="bg-[#60a5fa] text-white">
                  {isRTL ? 'موافق عليها' : 'Approved'}
                </option>
                <option value="rejected" className="bg-[#60a5fa] text-white">
                  {isRTL ? 'مرفوضة' : 'Rejected'}
                </option>
              </select>
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-[#1e40af] focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent appearance-none ${isRTL ? 'font-arabic' : 'font-latin'}`}
              >
                <option value="newest" className="bg-[#60a5fa] text-white">
                  {isRTL ? 'الأحدث أولاً' : 'Newest First'}
                </option>
                <option value="oldest" className="bg-[#60a5fa] text-white">
                  {isRTL ? 'الأقدم أولاً' : 'Oldest First'}
                </option>
                <option value="title" className="bg-[#60a5fa] text-white">
                  {isRTL ? 'حسب العنوان' : 'By Title'}
                </option>
                <option value="status" className="bg-[#60a5fa] text-white">
                  {isRTL ? 'حسب الحالة' : 'By Status'}
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-600">
            {error}
          </div>
        )}

        {/* Materials List */}
        {sortedMaterials.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-12 text-center">
            <div className="w-16 h-16 bg-[#dbeafe]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-[#60a5fa]" />
            </div>
            <h3 className={`text-xl font-semibold text-[#1e40af] mb-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {isRTL ? 'لا توجد مواد' : 'No Materials Found'}
            </h3>
            <p className={`text-[#60a5fa] mb-6 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {isRTL ? 'لم يتم العثور على أي مواد تعليمية' : 'No educational materials were found'}
            </p>
            <Link
              href="/faculty/materials/submit"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white rounded-2xl hover:from-[#3b82f6] hover:to-[#60a5fa] transition-all duration-300 font-bold"
            >
              <PlusCircle className="w-5 h-5" />
              <span className={`${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? 'تقديم أول مادة' : 'Submit First Material'}
              </span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedMaterials.map((material) => (
              <MaterialCard key={material._id} material={material} />
            ))}
          </div>
        )}
      </div>

      {/* Edit Material Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[80] p-4">
          <div className="bg-[#f8fafc] rounded-2xl border border-[#dbeafe]/30 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-2xl font-bold text-white ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? 'تعديل المادة' : 'Edit Material'}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {isRTL ? 'قم بتحديث معلومات المادة التعليمية' : 'Update the educational material information'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingMaterial(null);
                    setEditForm({ title: "", description: "", course: "", topic: "" });
                    setEditFile(null);
                  }}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className={`text-lg font-semibold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {isRTL ? 'المعلومات الأساسية' : 'Basic Information'}
                </h4>
                
                <div className="space-y-2">
                  <label className={`block text-sm font-medium text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? 'عنوان المادة' : 'Material Title'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder={isRTL ? 'أدخل عنوان المادة التعليمية' : 'Enter the educational material title'}
                    required
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-[#1e40af] placeholder-gray-500 focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className={`block text-sm font-medium text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? 'وصف المادة' : 'Material Description'}
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={isRTL ? 'أدخل وصفاً مفصلاً للمادة التعليمية' : 'Enter a detailed description of the educational material'}
                    rows="4"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-[#1e40af] placeholder-gray-500 focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Course Information */}
              <div className="space-y-4">
                <h4 className={`text-lg font-semibold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {isRTL ? 'معلومات المقرر' : 'Course Information'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                      {isRTL ? 'اسم المقرر' : 'Course Name'}
                    </label>
                    <input
                      type="text"
                      value={editForm.course}
                      onChange={(e) => setEditForm(prev => ({ ...prev, course: e.target.value }))}
                      placeholder={isRTL ? 'مثال: البرمجة 101' : 'e.g., Programming 101'}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-[#1e40af] placeholder-gray-500 focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                      {isRTL ? 'الموضوع' : 'Topic'}
                    </label>
                    <input
                      type="text"
                      value={editForm.topic}
                      onChange={(e) => setEditForm(prev => ({ ...prev, topic: e.target.value }))}
                      placeholder={isRTL ? 'مثال: أساسيات البرمجة' : 'e.g., Programming Fundamentals'}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-[#1e40af] placeholder-gray-500 focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <h4 className={`text-lg font-semibold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {isRTL ? 'رفع الملف' : 'File Upload'}
                </h4>
                
                <div className="space-y-4">
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".pdf"
                      onChange={handleEditFileChange}
                      name="editFile"
                      className="hidden"
                      id="edit-file-upload"
                    />
                    <label 
                      htmlFor="edit-file-upload" 
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer hover:border-[#60a5fa] hover:bg-white/5 transition-all duration-300"
                    >
                      <Upload className="w-8 h-8 text-[#60a5fa] mb-2" />
                      <p className="text-sm text-[#1e40af]">
                        {isRTL ? 'انقر لرفع ملف PDF جديد' : 'Click to upload new PDF file'}
                      </p>
                      <p className="text-xs text-[#60a5fa]">
                        {isRTL ? 'أو اسحب وأفلت هنا' : 'or drag and drop here'}
                      </p>
                    </label>
                  </div>

                  {/* Current File Info */}
                  {editingMaterial?.file_url && !editFile && (
                    <div className="p-4 bg-[#dbeafe]/20 border border-[#60a5fa]/20 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <File className="w-8 h-8 text-[#60a5fa]" />
                          <div>
                            <p className="font-medium text-[#1e40af]">
                              {isRTL ? 'الملف الحالي:' : 'Current file:'}
                            </p>
                            <p className="text-sm text-[#60a5fa]">
                              {editingMaterial.file_url.split('/').pop()}
                            </p>
                          </div>
                        </div>
                        <a
                          href={editingMaterial.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#60a5fa] hover:text-[#3b82f6] transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* New File Preview */}
                  {editFile && (
                    <div className="p-4 bg-[#dbeafe]/20 border border-[#60a5fa]/20 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <File className="w-8 h-8 text-[#60a5fa]" />
                          <div>
                            <p className="font-medium text-[#1e40af]">
                              {isRTL ? 'ملف جديد:' : 'New file:'}
                            </p>
                            <p className="text-sm text-[#60a5fa]">
                              {editFile.name} ({(editFile.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeEditFile}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingMaterial(null);
                    setEditForm({ title: "", description: "", course: "", topic: "" });
                    setEditFile(null);
                  }}
                  className="px-6 py-3 bg-[#dbeafe]/20 text-[#1e40af] border border-[#dbeafe]/30 rounded-2xl hover:bg-[#dbeafe]/30 transition-colors"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white rounded-2xl hover:from-[#3b82f6] hover:to-[#60a5fa] transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    isRTL ? 'جاري التحديث...' : 'Updating...'
                  ) : (
                    isRTL ? 'تحديث المادة' : 'Update Material'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



