"use client";

import { useState, useEffect } from "react";
import { 
  PlusCircle, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle,
  Calendar,
  MessageCircle,
  User,
  Loader2,
  AlertCircle
} from "lucide-react";
import AddIssueModal from "./AddIssueModal";
import { useI18n } from "@/lib/i18n";

export default function ManageIssues({ accountId }) {
  const [issues, setIssues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t, isRTL } = useI18n();

  useEffect(() => {
    fetchIssues();
  }, [accountId, currentPage, search]);

  const fetchIssues = async () => {
    if (!accountId) {
      console.error("No accountId provided");
      setError("No account ID found. Please log in again.");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      // Use credentials: 'include' to send cookies automatically
      const response = await fetch(
        `/api/issues/student?page=${currentPage}&search=${search}`,
        {
          credentials: 'include', // This sends cookies automatically
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Response status:", response.status);
      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        throw new Error("Failed to fetch issues");
      }
      const data = await response.json();
      console.log("API response:", data);
      setIssues(data.issues || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error("Error fetching issues:", err);
      setError("An error occurred while fetching issues.");
      setIssues([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIssue = async (newIssue) => {
    if (!accountId) {
      console.error("No accountId provided");
      setError("No account ID found. Please log in again.");
      return;
    }
    
    try {
      // Use credentials: 'include' to send cookies automatically
      const response = await fetch(`/api/issues/student`, {
        method: "POST",
        credentials: 'include', // This sends cookies automatically
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newIssue),
      });
      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        throw new Error("Failed to add issue");
      }
      await fetchIssues();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error adding issue:", err);
      setError("An error occurred while adding the issue.");
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "in_progress":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "resolved":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "closed":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "open":
        return isRTL ? "مفتوح" : "Open";
      case "in_progress":
        return isRTL ? "قيد التنفيذ" : "In Progress";
      case "resolved":
        return isRTL ? "محلول" : "Resolved";
      case "closed":
        return isRTL ? "مغلق" : "Closed";
      default:
        return status;
    }
  };

  if (error) {
    return (
    <div className="min-h-screen bg-[#d7e7fd] flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className={`text-red-600 text-lg ${isRTL ? 'font-arabic' : 'font-latin'}`}>
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-[#60a5fa] text-white rounded-lg hover:bg-[#3b82f6] transition-colors"
        >
          {t('common.retry')}
        </button>
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

      <div className="relative z-10 p-8 pt-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className={`text-2xl font-bold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {t('student.my_issues')}
                  </h1>
                  <p className={`text-[#60a5fa] mt-1 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {t('issues.manage_your_issues')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white rounded-2xl hover:from-[#3b82f6] hover:to-[#60a5fa] transition-all duration-300 transform hover:scale-105 font-bold"
              >
                <div className="flex items-center space-x-2">
                  <PlusCircle className="w-5 h-5" />
                  <span className={isRTL ? 'font-arabic' : 'font-latin'}>
                    {t('issues.add_new_issue')}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6 mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#60a5fa]" />
              </div>
              <input
                type="text"
                placeholder={isRTL ? "البحث في المشاكل..." : "Search issues..."}
                value={search}
                onChange={handleSearchChange}
                className={`w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] text-[#1e40af] placeholder-gray-500 ${isRTL ? 'font-arabic' : 'font-latin'}`}
              />
            </div>
          </div>

          {/* Issues Table */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/20">
                <thead className="bg-white/5">
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                      {t('issues.id')}
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                      {t('issues.type')}
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                      {t('issues.details')}
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                      {t('issues.chat')}
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                      {t('issues.status')}
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                      {t('issues.date')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/5 divide-y divide-white/20">
                  {isLoading ? (
                    Array(5).fill().map((_, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-white/20 rounded animate-pulse w-16"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-white/20 rounded animate-pulse w-24"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-white/20 rounded animate-pulse w-20"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-white/20 rounded animate-pulse w-32"></div>
                        </td>
                      </tr>
                    ))
                  ) : issues.length > 0 ? (
                    issues.map((issue) => (
                      <tr key={issue._id} className="hover:bg-white/10 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-[#1e40af] font-mono">
                          #{issue.issue_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-[#dbeafe]/20 text-[#60a5fa] border border-[#60a5fa]/30 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                            {issue.type || "other"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#1e40af] max-w-xs truncate">
                          <span className={isRTL ? 'font-arabic' : 'font-latin'}>
                            {issue.details}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[#1e40af]">
                          <div className="flex items-center space-x-2">
                            <MessageCircle className="w-4 h-4 text-[#60a5fa]" />
                            <span className={isRTL ? 'font-arabic' : 'font-latin'}>
                              {issue.conversation?.name || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(issue.status)} ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                            {getStatusText(issue.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[#1e40af]">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-[#60a5fa]" />
                            <span className={isRTL ? 'font-arabic' : 'font-latin'}>
                              {new Date(issue.time_sent).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <AlertTriangle className="w-12 h-12 text-[#60a5fa]" />
                          <p className={`text-[#1e40af] text-lg ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                            {t('issues.no_issues_found')}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-4">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white/10 text-[#1e40af] hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-[#60a5fa] text-white"
                          : "bg-white/10 text-[#1e40af] hover:bg-white/20"
                      } ${isRTL ? 'font-arabic' : 'font-latin'}`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white/10 text-[#1e40af] hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </nav>
              </div>
            </div>
          )}

          <AddIssueModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddIssue}
          />
        </div>
      </div>
    </div>
  );
}