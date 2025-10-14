// app/components/admin/ManageIssues.jsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { Trash2, Settings } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import IssuesDataTable from "@/components/ui/IssuesDataTable";
import IssuesSearchField from "@/components/ui/IssuesSearchField";
import IssuesPagination from "@/components/ui/IssuesPagination";

export default function ManageIssues() {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [issueToUpdateStatus, setIssueToUpdateStatus] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Data management states
  const [issues, setIssues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { t, isRTL } = useI18n();

  useEffect(() => {
    fetchIssues();
  }, [currentPage, searchTerm, filterValues, refreshTrigger]);

  const fetchIssues = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        search: searchTerm || "",
        status: filterValues.status || "",
        type: filterValues.type || "",
      });
      const response = await fetch(`/api/issues?${params}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch issues");
      }
      
      const data = await response.json();
      setIssues(data.issues || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching issues:", err);
      setError(err.message || "An error occurred while fetching issues.");
      setIssues([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, filterValues]);

  const deleteIssue = async (id) => {
    const response = await fetch(`/api/issues/${id}`, {
      method: "DELETE",
      credentials: 'include'
    });
    if (!response.ok) throw new Error("Failed to delete issue");
    setRefreshTrigger((prev) => prev + 1);
  };

  const updateIssue = async (id, updatedData) => {
    const response = await fetch(`/api/issues/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error("Failed to update issue");
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleStatusClick = (issue) => {
    setIssueToUpdateStatus(issue);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!issueToUpdateStatus) return;
    try {
      await updateIssue(issueToUpdateStatus._id, { status: newStatus });
      setIsStatusModalOpen(false);
      setIssueToUpdateStatus(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("An error occurred while updating the issue status:", err);
    }
  };




  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const columns = [
    { 
      key: "issue_id", 
      label: isRTL ? "رقم المشكلة" : "Issue ID",
      render: (issue) => {
        if (!issue) return <div className="text-gray-400">-</div>;
        return <div className="font-mono text-sm text-[#1e40af]">{issue.issue_id || issue._id}</div>;
      }
    },
    { 
      key: "student", 
      label: isRTL ? "الطالب" : "Student", 
      render: (issue) => {
        if (!issue) return <div className="text-gray-400">-</div>;
        return <div className="text-[#1e40af]">{issue.student?.name || "-"}</div>;
      }
    },
    { 
      key: "type", 
      label: isRTL ? "النوع" : "Type", 
      render: (issue) => {
        if (!issue) return <div className="text-gray-400">-</div>;
        return <div className="text-[#1e40af]">{issue.type || "other"}</div>;
      }
    },
    { 
      key: "details", 
      label: isRTL ? "التفاصيل" : "Details",
      render: (issue) => {
        if (!issue) return <div className="text-gray-400">-</div>;
        const details = issue.details || "";
        const truncatedDetails = details.length > 50 
          ? details.substring(0, 50) + "..." 
          : details;
        return (
          <div className="max-w-xs">
            <div className="text-sm text-[#1e40af]">
              {truncatedDetails}
            </div>
          </div>
        );
      }
    },
    { 
      key: "conversation", 
      label: isRTL ? "المحادثة" : "Chat", 
      render: (issue) => {
        if (!issue) return <div className="text-gray-400">-</div>;
        return <div className="text-[#1e40af]">{issue.conversation?.name || "-"}</div>;
      }
    },
    {
      key: "status",
      label: isRTL ? "الحالة" : "Status",
      render: (issue) => {
        if (!issue) return <div className="text-gray-400">-</div>;
        const status = issue.status;
        return (
          <span
            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
              status === "open"
                ? "bg-[#dbeafe]/20 text-[#60a5fa] border border-[#60a5fa]/30"
                : status === "in_progress"
                ? "bg-[#f8fafc]/20 text-[#1e40af] border border-[#1e40af]/30"
                : status === "resolved"
                ? "bg-[#f8fafc]/20 text-[#1e40af] border border-[#1e40af]/30"
                : "bg-[#f8fafc]/20 text-[#1e40af] border border-[#1e40af]/30"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    { 
      key: "admin", 
      label: isRTL ? "مُعيّن لـ" : "Assigned To", 
      render: (issue) => {
        if (!issue) return <div className="text-gray-400">-</div>;
        return <div className="text-[#1e40af]">{issue.admin?.name || (isRTL ? "غير مُعيّن" : "Unassigned")}</div>;
      }
    },
    {
      key: "time_sent",
      label: isRTL ? "وقت الإرسال" : "Time Sent",
      render: (issue) => {
        if (!issue) return <div className="text-gray-400">-</div>;
        return <div className="text-sm text-[#1e40af]">{new Date(issue.time_sent).toLocaleString()}</div>;
      },
    },
  ];

  const filters = [
    {
      key: "status",
      placeholder: isRTL ? "جميع الحالات" : "All Statuses",
      options: [
        { value: "", label: isRTL ? "جميع الحالات" : "All Statuses" },
        { value: "open", label: isRTL ? "مفتوح" : "Open" },
        { value: "in_progress", label: isRTL ? "قيد التنفيذ" : "In Progress" },
        { value: "resolved", label: isRTL ? "محلول" : "Resolved" },
        { value: "closed", label: isRTL ? "مغلق" : "Closed" },
      ],
    },
    {
      key: "type",
      placeholder: isRTL ? "جميع الأنواع" : "All Types",
      options: [
        { value: "", label: isRTL ? "جميع الأنواع" : "All Types" },
        { value: "technical", label: isRTL ? "تقني" : "Technical" },
        { value: "incorrect_response", label: isRTL ? "استجابة خاطئة" : "Incorrect Response" },
        { value: "other", label: isRTL ? "أخرى" : "Other" },
      ],
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
        <h1 className={`text-3xl font-bold text-[#1e40af] mb-8 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
          {isRTL ? "إدارة البلاغات" : "Manage Issues"}
        </h1>

        {/* Search and Filters */}
        <IssuesSearchField
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          filterValues={filterValues}
        />

        {/* Error Message */}
        {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-2xl p-4">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
                <span className="text-red-500 text-sm">{error}</span>
                      </div>
            </div>
        )}

        {/* Data Table */}
        {!isLoading && issues.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-[#60a5fa]/20 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-[#60a5fa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className={`text-2xl font-bold text-[#1e40af] mb-4 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? "لا توجد بلاغات" : "No Issues Found"}
              </h3>
              <p className={`text-[#1e40af] text-lg mb-6 max-w-md ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? "لم يتم الإبلاغ عن أي مشاكل بعد. ستظهر البلاغات هنا عندما يرسلها الطلاب." : "No issues have been reported yet. Issues will appear here when students submit them."}
              </p>
              <div className="flex items-center space-x-2 text-[#60a5fa]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={`text-sm ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {isRTL ? "البيانات ستظهر تلقائياً عند وجودها" : "Data will appear automatically when available"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <IssuesDataTable
            data={issues}
            isLoading={isLoading}
            columns={columns}
            onRowAction={[
              {
                key: "status",
                label: isRTL ? "تحديث الحالة" : "Update Status",
                color: "yellow",
                icon: Settings,
                onClick: handleStatusClick,
              },
              {
                key: "delete",
                label: isRTL ? "حذف" : "Delete",
                color: "red",
                icon: Trash2,
                onClick: (item) => {
                  if (confirm(isRTL ? "هل أنت متأكد من حذف هذا البلاغ؟" : "Are you sure you want to delete this issue?")) {
                    deleteIssue(item._id);
                  }
                },
              }
            ]}
          />
        )}

        {/* Pagination */}
        <IssuesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Custom Status Update Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold text-white ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {isRTL ? "تحديث حالة المشكلة" : "Update Issue Status"}
                </h3>
                <button
                  onClick={() => {
          setIsStatusModalOpen(false);
          setIssueToUpdateStatus(null);
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
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className={`text-sm text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? "رقم المشكلة:" : "Issue ID:"}
                  </p>
                  <p className={`text-[#1e40af] font-mono ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    #{issueToUpdateStatus?.issue_id || issueToUpdateStatus?._id}
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <p className={`text-sm text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? "الحالة الحالية:" : "Current Status:"}
                  </p>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    issueToUpdateStatus?.status === "open"
                      ? "bg-[#dbeafe]/20 text-[#60a5fa] border border-[#60a5fa]/30"
                      : issueToUpdateStatus?.status === "in_progress"
                      ? "bg-[#f8fafc]/20 text-[#1e40af] border border-[#1e40af]/30"
                      : issueToUpdateStatus?.status === "resolved"
                      ? "bg-[#f8fafc]/20 text-[#1e40af] border border-[#1e40af]/30"
                      : "bg-[#f8fafc]/20 text-[#1e40af] border border-[#1e40af]/30"
                  }`}>
                    {issueToUpdateStatus?.status === "open" ? (isRTL ? "مفتوح" : "Open") :
                     issueToUpdateStatus?.status === "in_progress" ? (isRTL ? "قيد التنفيذ" : "In Progress") :
                     issueToUpdateStatus?.status === "resolved" ? (isRTL ? "محلول" : "Resolved") :
                     (isRTL ? "مغلق" : "Closed")}
                  </span>
                </div>

          <div>
                  <p className={`text-sm text-[#1e40af] font-medium mb-3 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? "اختر الحالة الجديدة:" : "Select new status:"}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleStatusUpdate("open")}
                      className="px-4 py-3 bg-[#dbeafe]/20 text-[#60a5fa] border border-[#60a5fa]/30 rounded-xl hover:bg-[#60a5fa]/30 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className={`font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                          {isRTL ? "مفتوح" : "Open"}
                        </span>
                      </div>
              </button>
              <button
                onClick={() => handleStatusUpdate("in_progress")}
                      className="px-4 py-3 bg-[#f8fafc]/20 text-[#1e40af] border border-[#1e40af]/30 rounded-xl hover:bg-[#1e40af]/30 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-[#1e40af] rounded-full"></div>
                        <span className={`font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                          {isRTL ? "قيد التنفيذ" : "In Progress"}
                        </span>
                      </div>
              </button>
              <button
                onClick={() => handleStatusUpdate("resolved")}
                      className="px-4 py-3 bg-[#f8fafc]/20 text-[#1e40af] border border-[#1e40af]/30 rounded-xl hover:bg-[#1e40af]/30 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-[#1e40af] rounded-full"></div>
                        <span className={`font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                          {isRTL ? "محلول" : "Resolved"}
                        </span>
                      </div>
              </button>
              <button
                onClick={() => handleStatusUpdate("closed")}
                      className="px-4 py-3 bg-[#f8fafc]/20 text-[#1e40af] border border-[#1e40af]/30 rounded-xl hover:bg-[#1e40af]/30 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-[#1e40af] rounded-full"></div>
                        <span className={`font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                          {isRTL ? "مغلق" : "Closed"}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end mt-6 pt-4 border-t border-white/20">
                <button
                  onClick={() => {
                    setIsStatusModalOpen(false);
                    setIssueToUpdateStatus(null);
                  }}
                  className="px-6 py-3 bg-[#60a5fa]/20 text-[#60a5fa] border border-[#60a5fa]/30 rounded-2xl hover:bg-[#60a5fa]/30 transition-colors"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
              </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
