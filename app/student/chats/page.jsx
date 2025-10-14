"use client";

import { useState, useEffect } from "react";
import ChatInterface from "@/components/student/ChatInterface";
import { useI18n } from "@/lib/i18n";

export default function StudentChatsPage() {
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user", {
        credentials: 'include'
      });
      if (response.ok) {
        const userData = await response.json();
        setStudentId(userData.studentId); // Use studentId from the response
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#d7e7fd] relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#f8fafc]/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#dbeafe]/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-[#f8fafc]/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#60a5fa] mx-auto mb-4"></div>
            <p className="text-[#1e40af] text-lg">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!studentId) {
    return (
      <div className="h-screen bg-[#d7e7fd] relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#f8fafc]/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#dbeafe]/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-[#f8fafc]/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg">{t('common.error')}</p>
          </div>
        </div>
      </div>
    );
  }

  return <ChatInterface studentId={studentId} />;
}