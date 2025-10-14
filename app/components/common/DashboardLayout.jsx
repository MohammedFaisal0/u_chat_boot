"use client";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useI18n } from "@/lib/i18n";

export default function DashboardLayout({ 
  children, 
  userType = "student", 
  userName = "",
  title = "",
  description = ""
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t, isRTL } = useI18n();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
        <Sidebar userType={userType} userName={userName} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header userType={userType} userName={userName} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {title && (
            <div className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-6">
                  <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                  {description && (
                    <p className="mt-1 text-sm text-gray-600">{description}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="fade-in">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

