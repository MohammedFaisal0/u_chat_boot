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
  RefreshCw
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function FacultyMaterialsList() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
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
    </div>
  );
}



