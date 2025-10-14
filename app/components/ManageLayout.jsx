// components/ManageLayout.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { ErrorMessage, ConfirmationModal } from "@/components/ui/uis";
import SearchField from "@/components/ui/SearchField";
import DataTable from "@/components/ui/DataTable";
import Pagination from "@/components/Pagination";
import { Trash2 } from "lucide-react";

export default function ManageLayout({
  fetchData,
  deleteItem,
  updateItem,
  columns,
  filters,
  itemName,
  additionalActions = [],
  customAddAction,
}) {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchData(currentPage, searchTerm, filterValues);
      setItems(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(`Error fetching ${itemName}s:`, err);
      setError(`An error occurred while fetching ${itemName}s.`);
      setItems([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, filterValues, fetchData, itemName]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems, refreshTrigger]);

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

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await deleteItem(itemToDelete._id);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setError(`Failed to delete ${itemName}`);
    }
  };

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const allActions = [
    ...additionalActions,
    {
      key: "delete",
      label: `Delete ${itemName}`,
      color: "red",
      icon: <Trash2 size={18} />,
      onClick: handleDeleteClick,
    },
  ];

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <SearchField
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        {customAddAction}
      </div>

      <DataTable
        data={items}
        isLoading={isLoading}
        columns={columns}
        onRowAction={allActions}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={`Confirm Delete ${itemName}`}
        message={`Are you sure you want to delete this ${itemName}?`}
      />
    </div>
  );
}
