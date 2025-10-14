// components/ui/Search.jsx
import { Search } from "lucide-react";

export default function SearchField({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
}) {
  return (
    <div className="flex items-center justify-center grow">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={onSearchChange}
        className="flex-grow pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
      />
      <div>
        <Search
          className="relative left-2 transform -translate-1/2 text-gray-400"
          size={20}
        />
      </div>
      {filters.map((filter) => (
        <select
          key={filter.key}
          value={filter.value}
          onChange={(e) => onFilterChange(filter.key, e.target.value)}
          className="ml-4 px-4 py-2 text-gray-900 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">{filter.placeholder}</option>
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}
