// app/components/admin/UserManagement.jsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import {
  Skeleton,
  ErrorMessage,
  ConfirmationModal,
  Tooltip,
} from "@/components/ui/uis";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function UserManagement() {
  const [accounts, setaccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [accountToSuspend, setAccountToSuspend] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState("");
  const router = useRouter();
  const { t, isRTL } = useI18n();

  useEffect(() => {
    fetchaccounts();
  }, [currentPage, search]);

  const fetchaccounts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/accounts?page=${currentPage}&search=${search}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }
      const data = await response.json();
      setaccounts(data.accounts);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(error.message);
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

  const handleDeleteClick = (user) => {
    console.log(user);
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/accounts/${userToDelete._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // After successful delete, refetch accounts
      await fetchaccounts();
    } catch (error) {
      console.error("Error deleting user:", error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
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

        {/* Search Bar and Add Button */}
        <div className="mb-6 flex gap-4 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={isRTL ? 'البحث في الحسابات...' : 'Search accounts...'}
              value={search}
              onChange={handleSearchChange}
              className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent text-[#1e40af] placeholder-gray-500 backdrop-blur-lg`}
            />
            <Search
              className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-[#60a5fa]`}
              size={20}
            />
          </div>
          <button
            onClick={() => router.push('/admin/users/add')}
            className="bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white px-6 py-3 rounded-2xl hover:from-[#3b82f6] hover:to-[#60a5fa] transition-all duration-300 transform hover:scale-105 font-bold flex items-center"
          >
            <PlusCircle size={20} className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'إضافة مستخدم' : 'Add User'}
          </button>
        </div>

        {/* Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/20">
                <tr>
                  <th className={`px-6 py-4 text-left font-semibold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? 'رقم الحساب' : 'Account Number'}
                  </th>
                  <th className={`px-6 py-4 text-left font-semibold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? 'اسم المستخدم' : 'User Name'}
                  </th>
                  <th className={`px-6 py-4 text-left font-semibold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? 'الدور' : 'Role'}
                  </th>
                  <th className={`px-6 py-4 text-left font-semibold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? 'الإجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {isLoading
                  ? Array(10)
                      .fill()
                      .map((_, index) => (
                        <tr key={index} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-white/20 rounded animate-pulse w-1/4"></div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-4 bg-white/20 rounded animate-pulse w-1/2"></div>
                          </td>
                        </tr>
                      ))
                  : accounts.map((user) => (
                      <tr key={user._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-[#1e40af] font-medium">
                          {user.accountNo}
                        </td>
                        <td className="px-6 py-4 text-[#1e40af]">
                          {user.userName}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.accountType === "admin"
                                ? "bg-[#f8fafc]/20 text-[#1e40af] border border-[#1e40af]/30"
                                : user.accountType === "faculty"
                                ? "bg-[#dbeafe]/20 text-[#60a5fa] border border-[#60a5fa]/30"
                                : "bg-[#dbeafe]/20 text-[#60a5fa] border border-[#60a5fa]/30"
                            }`}
                          >
                            {user.accountType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`flex ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
                            <button
                              title={isRTL ? 'تعديل المستخدم' : 'Edit User'}
                              onClick={() =>
                                router.push(`/admin/users/${user._id}/edit`)
                              }
                              className="p-2 bg-[#60a5fa]/20 text-[#60a5fa] rounded-lg hover:bg-[#60a5fa]/30 transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              title={isRTL ? 'حذف المستخدم' : 'Delete User'}
                              onClick={() => handleDeleteClick(user)}
                              className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                            >
                              <Trash2 size={18} />
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
        <div className="mt-8 flex justify-center">
          <nav
            className="relative z-0 inline-flex rounded-2xl shadow-lg bg-white/10 backdrop-blur-lg border border-white/20"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 rounded-l-2xl text-sm font-medium text-[#1e40af] hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="sr-only">{isRTL ? 'السابق' : 'Previous'}</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-[#60a5fa] text-white font-bold"
                    : "text-[#1e40af] hover:bg-white/10"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 rounded-r-2xl text-sm font-medium text-[#1e40af] hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="sr-only">{isRTL ? 'التالي' : 'Next'}</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title={isRTL ? 'تأكيد الحذف' : 'Confirm Delete'}
          message={isRTL 
            ? `هل أنت متأكد من حذف المستخدم ${userToDelete?.userName}؟`
            : `Are you sure you want to delete the user ${userToDelete?.userName}?`
          }
        />
      </div>
    </div>
  );
}
