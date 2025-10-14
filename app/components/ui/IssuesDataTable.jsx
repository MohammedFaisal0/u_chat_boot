import React from "react";
import { Settings, UserPlus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function IssuesDataTable({ data, isLoading, columns, onRowAction }) {
  const { isRTL } = useI18n();

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-latin'}`}
                  >
                    {column.label}
                  </th>
                ))}
                <th className={`px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {isRTL ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {Array(5).fill().map((_, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      <div className="animate-pulse">
                        <div className="h-4 bg-white/20 rounded w-3/4"></div>
                      </div>
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-white/20 rounded w-16"></div>
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

  if (!data || data.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8 text-center">
        <div className="text-[#1e40af] text-lg">
          {isRTL ? "لا توجد بلاغات" : "No issues found"}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-latin'}`}
                >
                  {column.label}
                </th>
              ))}
              <th className={`px-6 py-4 text-left text-xs font-medium text-[#1e40af] uppercase tracking-wider ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? 'الإجراءات' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.map((item, index) => (
              <tr key={item._id || index} className="hover:bg-white/5 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4">
                    {column.render ? column.render(item) : (item && item[column.key]) || '-'}
                  </td>
                ))}
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    {onRowAction.map((action, actionIndex) => {
                      const Icon = action.icon?.type || action.icon;
                      return (
                        <button
                          key={actionIndex}
                          onClick={() => action.onClick && action.onClick(item)}
                          title={action.label}
                          className={`p-2 rounded-lg transition-colors ${
                            action.color === "yellow"
                              ? "bg-[#60a5fa]/20 text-[#60a5fa] hover:bg-[#60a5fa]/30"
                              : action.color === "blue"
                              ? "bg-[#60a5fa]/20 text-[#60a5fa] hover:bg-[#60a5fa]/30"
                              : action.color === "red"
                              ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                              : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
                          }`}
                        >
                          {Icon ? <Icon size={16} /> : action.label}
                        </button>
                      );
                    })}
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

