import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function IssuesPagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) {
  const { isRTL } = useI18n();

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center mt-8">
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-colors ${
            currentPage === 1
              ? "bg-white/5 text-[#1e40af]/30 cursor-not-allowed"
              : "bg-white/10 text-[#1e40af] hover:bg-[#60a5fa]/20 hover:text-[#60a5fa]"
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-lg transition-colors ${
              page === currentPage
                ? "bg-[#60a5fa] text-white font-semibold"
                : "bg-white/10 text-[#1e40af] hover:bg-white/20"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-colors ${
            currentPage === totalPages
              ? "bg-white/5 text-[#1e40af]/30 cursor-not-allowed"
              : "bg-white/10 text-[#1e40af] hover:bg-[#60a5fa]/20 hover:text-[#60a5fa]"
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

