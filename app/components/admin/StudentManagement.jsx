"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Skeleton,
  ErrorMessage,
  ConfirmationModal,
  Tooltip,
} from "@/components/ui/uis";
import { useI18n } from "@/lib/i18n";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const router = useRouter();
  const { t, isRTL } = useI18n();

  useEffect(() => {
    fetchStudents();
  }, [currentPage, search]);

  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/students?page=${currentPage}&search=${search}`
      );
      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data.students);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError("An error occurred while fetching students.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;

    try {
      const response = await fetch(`/api/students/${studentToDelete._id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete student");
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
      await fetchStudents();
    } catch (err) {
      setError("An error occurred while deleting the student.");
    }
  };

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen bg-[#d7e7fd] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#f8fafc]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#dbeafe]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Search Bar */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder={isRTL ? "البحث عن الطلاب..." : "Search students..."}
            value={search}
            onChange={handleSearchChange}
            className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] text-[#1e40af] placeholder-gray-500 ${isRTL ? 'font-arabic' : 'font-latin'}`}
          />
          <Search
            className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-[#60a5fa]`}
            size={20}
          />
        </div>

        {/* Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  {[
                    isRTL ? "الرقم الأكاديمي" : "Academic ID",
                    isRTL ? "الاسم" : "Name", 
                    isRTL ? "البريد الإلكتروني" : "Email",
                    isRTL ? "التخصص" : "Major",
                    isRTL ? "الإجراءات" : "Actions"
                  ].map((header) => (
                    <th
                      key={header}
                      className={`px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-latin'}`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {isLoading
                  ? Array(10)
                      .fill()
                      .map((_, index) => (
                        <tr key={index}>
                          {Array(5)
                            .fill()
                            .map((_, cellIndex) => (
                              <td key={cellIndex} className="px-6 py-4">
                                <Skeleton className="h-4 w-full bg-white/20" />
                              </td>
                            ))}
                        </tr>
                      ))
                  : students.map((student) => (
                      <tr
                        key={student._id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4 text-[#1e40af] font-mono text-sm">
                          {student.academic_id}
                        </td>
                        <td className="px-6 py-4 text-[#1e40af]">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 text-[#1e40af]">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 text-[#1e40af]">
                          {student.major}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              title={isRTL ? "تعديل الطالب" : "Edit Student"}
                              onClick={() =>
                                router.push(`/admin/students/${student._id}/edit`)
                              }
                              className="p-2 bg-[#60a5fa]/20 text-[#60a5fa] rounded-lg hover:bg-[#60a5fa]/30 transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              title={isRTL ? "حذف الطالب" : "Delete Student"}
                              onClick={() => handleDeleteClick(student)}
                              className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <nav
            className="relative z-0 inline-flex rounded-2xl shadow-lg bg-white/10 backdrop-blur-lg border border-white/20 -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 rounded-l-2xl border-r border-white/20 bg-white/10 text-sm font-medium text-[#1e40af] hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="sr-only">{isRTL ? "السابق" : "Previous"}</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border-r border-white/20 text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "z-10 bg-[#60a5fa] text-white font-bold"
                    : "bg-white/10 text-[#1e40af] hover:bg-white/20"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 rounded-r-2xl bg-white/10 text-sm font-medium text-[#1e40af] hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="sr-only">{isRTL ? "التالي" : "Next"}</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={isRTL ? "تأكيد الحذف" : "Confirm Delete"}
        message={isRTL ? `هل أنت متأكد من حذف الطالب ${studentToDelete?.name}؟` : `Are you sure you want to delete the student ${studentToDelete?.name}?`}
      />
    </div>
  );
}
