import React from "react";
import { Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function IssuesSearchField({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFilterChange,
  filterValues = {}
}) {
  const { isRTL } = useI18n();

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className={`absolute top-1/2 transform -translate-y-1/2 text-[#60a5fa] w-5 h-5 ${isRTL ? 'right-3' : 'left-3'}`} />
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={isRTL ? "البحث في البلاغات..." : "Search issues..."}
          className={`w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-[#1e40af] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent transition-all duration-300 ${isRTL ? 'pr-12' : 'pl-12'}`}
        />
      </div>

      {/* Filters */}
      {filters && filters.map((filter) => (
        <select
          key={filter.key}
          value={filterValues?.[filter.key] || ""}
          onChange={(e) => onFilterChange(filter.key, e.target.value)}
          className={`px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}
        >
          <option value="" className="bg-[#60a5fa] text-white">
            {filter.placeholder}
          </option>
          {filter.options.map((option) => (
            <option key={option.value} value={option.value} className="bg-[#60a5fa] text-white">
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
