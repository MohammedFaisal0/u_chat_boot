import React from "react";
import { Skeleton, Tooltip } from "@/components/ui/uis";

export default function DataTable({ data, isLoading, columns, onRowAction }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto max-h-[70vh]">
        <table className="w-full table-auto text-sm">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-2 text-left font-medium tracking-wider whitespace-nowrap text-gray-900"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-4 py-2 text-left font-medium tracking-wider w-24 text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading
              ? Array(5)
                  .fill()
                  .map((_, index) => (
                    <tr key={index}>
                      {columns.map((column) => (
                        <td key={column.key} className="px-4 py-3">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                      <td className="px-4 py-3 w-24">
                        <Skeleton className="h-4 w-16" />
                      </td>
                    </tr>
                  ))
              : data.map((item, index) => (
                  <tr
                    key={item.id || item._id || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-2 text-gray-800">
                        {column.render
                          ? column.render(item)
                          : (item && item[column.key]) || '-'}
                      </td>
                    ))}
                    <td className="px-4 py-2 text-gray-800 w-24">
                      <div className="flex justify-end space-x-2">
                        {onRowAction.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            title={action.label}
                            onClick={() => action.onClick && action.onClick(item)}
                            className={`p-1 rounded-full transition-colors ${
                              action.color === "red"
                                ? "text-red-600 hover:bg-red-100"
                                : "text-blue-600 hover:bg-blue-100"
                            }`}
                          >
                            {action.icon || action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
