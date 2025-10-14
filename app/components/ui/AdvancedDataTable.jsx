import React, { useState, useEffect } from "react";
import { Edit, Trash2, Search } from "lucide-react";

export function DataTable({ 
  fetchData, 
  columns, 
  refreshTrigger, 
  onEdit, 
  onDelete, 
  searchPlaceholder = "Search..." 
}) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  const loadData = async (page = 1, search = "") => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchData(page, search);
      setData(result.items || []);
      setTotalPages(result.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentPage, searchTerm);
  }, [refreshTrigger, currentPage, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadData(1, searchTerm);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      loadData(newPage, searchTerm);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await onDelete(item._id);
        loadData(currentPage, searchTerm);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-400 mb-4">Error: {error}</div>
        <button 
          onClick={() => loadData(currentPage, searchTerm)}
          className="px-4 py-2 bg-[#60a5fa] text-white rounded-lg hover:bg-[#3b82f6] transition-colors font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#60a5fa] w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-[#1e40af] placeholder-gray-500 focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent"
          />
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/5 divide-y divide-white/10">
            {isLoading ? (
              Array(5).fill().map((_, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <div className="h-4 bg-white/20 rounded animate-pulse w-16"></div>
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-[#1e40af]">
                  No data found
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item._id || index} className="hover:bg-white/10 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 text-sm text-[#1e40af]">
                      {column.render ? column.render(item) : (item && item[column.key]) || '-'}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="text-[#60a5fa] hover:text-[#3b82f6] p-2 rounded-lg hover:bg-white/10 transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-[#1e40af]">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-[#60a5fa] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#60a5fa]/20 text-[#1e40af]"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-[#60a5fa] rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#60a5fa]/20 text-[#1e40af]"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
