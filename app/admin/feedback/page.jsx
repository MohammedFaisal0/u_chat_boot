"use client";
import { useState, useEffect } from "react";
import StarRating from "@/components/ui/StarRating";
import { format } from "date-fns";
import { useI18n } from "@/lib/i18n";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { t, isRTL } = useI18n();

  useEffect(() => {
    fetchFeedbacks();
    fetchStats();
  }, [currentPage]);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`/api/feedback?page=${currentPage}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error("Failed to fetch feedbacks");
      const data = await response.json();
      setFeedbacks(data.feedbacks);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/feedback/stats", {
        credentials: 'include'
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#d7e7fd] flex justify-center items-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#60a5fa]"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-[#d7e7fd] flex justify-center items-center">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 text-center">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button 
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchFeedbacks();
            fetchStats();
          }}
          className="bg-[#60a5fa] text-white px-6 py-2 rounded-lg hover:bg-[#3b82f6] transition-colors"
        >
          {isRTL ? 'إعادة المحاولة' : 'Retry'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#d7e7fd] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#f8fafc]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#dbeafe]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
            <div className={`text-sm text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {isRTL ? 'إجمالي التقييمات' : 'Total Feedbacks'}
            </div>
            <div className="text-3xl font-bold text-[#1e40af] mt-2">{stats.totalFeedbacks || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
            <div className={`text-sm text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {isRTL ? 'متوسط التقييم' : 'Average Rating'}
            </div>
            <div className="text-3xl font-bold text-[#1e40af] mt-2">
              {stats.averageRating ? stats.averageRating.toFixed(1) : "0.0"}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
            <div className={`text-sm text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {isRTL ? 'تقييمات 5 نجوم' : '5-Star Ratings'}
            </div>
            <div className="text-3xl font-bold text-[#1e40af] mt-2">{stats.ratingDistribution?.[5] || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
            <div className={`text-sm text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {isRTL ? 'تقييمات نجمة واحدة' : '1-Star Ratings'}
            </div>
            <div className="text-3xl font-bold text-[#1e40af] mt-2">{stats.ratingDistribution?.[1] || 0}</div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl mb-8">
          <h3 className={`text-xl font-semibold text-[#1e40af] mb-6 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            {isRTL ? 'توزيع التقييمات' : 'Rating Distribution'}
          </h3>
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4`}>
                <span className={`text-sm text-[#1e40af] w-8 font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {rating}★
                </span>
                <div className="flex-1 bg-white/10 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.totalFeedbacks > 0 ? ((stats.ratingDistribution?.[rating] || 0) / stats.totalFeedbacks) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className={`text-sm text-[#1e40af] w-8 font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {stats.ratingDistribution?.[rating] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Feedbacks */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h3 className={`text-xl font-semibold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {isRTL ? 'التقييمات الحديثة' : 'Recent Feedbacks'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/20">
                <tr>
                  <th className={`px-6 py-4 text-left font-semibold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? 'الطالب' : 'Student'}
                  </th>
                  <th className={`px-6 py-4 text-left font-semibold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? 'التقييم' : 'Rating'}
                  </th>
                  <th className={`px-6 py-4 text-left font-semibold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? 'التعليق' : 'Comment'}
                  </th>
                  <th className={`px-6 py-4 text-left font-semibold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? 'المحادثة' : 'Chat'}
                  </th>
                  <th className={`px-6 py-4 text-left font-semibold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? 'التاريخ' : 'Date'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {feedbacks.length > 0 ? (
                  feedbacks.map((feedback) => (
                    <tr key={feedback._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className={`font-medium text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                            {feedback.student?.name || (isRTL ? "غير معروف" : "Unknown")}
                          </div>
                          <div className={`text-sm text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                            {feedback.student?.academic_id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StarRating rating={feedback.rating} interactive={false} size="sm" />
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="truncate text-[#1e40af]" title={feedback.comment}>
                          {feedback.comment || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#1e40af]">
                        {feedback.conversation?.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-[#1e40af]">
                        {format(new Date(feedback.submitted_at), "MMM d, yyyy HH:mm")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-[#1e40af] text-lg">
                        {isRTL ? 'لا توجد تقييمات متاحة' : 'No feedback available'}
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
            <nav
              className="relative z-0 inline-flex rounded-2xl shadow-lg bg-white/10 backdrop-blur-lg border border-white/20"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 rounded-l-2xl text-sm font-medium text-[#1e40af] hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="sr-only">{isRTL ? 'السابق' : 'Previous'}</span>
                {isRTL ? 'السابق' : 'Previous'}
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
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
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 rounded-r-2xl text-sm font-medium text-[#1e40af] hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="sr-only">{isRTL ? 'التالي' : 'Next'}</span>
                {isRTL ? 'التالي' : 'Next'}
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
