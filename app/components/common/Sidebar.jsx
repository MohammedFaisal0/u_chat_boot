"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  BadgeAlert,
  PencilRuler,
  GraduationCap,
  BookOpen,
  CircleUser,
  MessageCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Star,
  AlertTriangle,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

const getAdminNavItems = (t) => [
  { icon: Home, label: t('nav.dashboard'), href: "/admin", color: "text-blue-600" },
  { icon: Users, label: t('nav.users'), href: "/admin/users", color: "text-purple-600" },
  { icon: BadgeAlert, label: t('nav.issues'), href: "/admin/issues", color: "text-orange-600" },
  { icon: Star, label: t('nav.feedback'), href: "/admin/feedback", color: "text-yellow-600" },
  { icon: FileText, label: t('nav.reports'), href: "/admin/reports", color: "text-green-600" },
  {
    icon: PencilRuler,
    label: t('nav.chatbot_instructions'),
    href: "/admin/chatbot-instructions",
    color: "text-pink-600"
  },
  { icon: BookOpen, label: t('nav.faculty_materials'), href: "/admin/faculty-materials", color: "text-teal-600" },
  { icon: GraduationCap, label: t('nav.students'), href: "/admin/students", color: "text-cyan-600" },
];

const getStudentNavItems = (t) => [
  { icon: Home, label: t('nav.dashboard'), href: "/student", color: "text-blue-600" },
  { icon: CircleUser, label: t('nav.profile'), href: "/student/profile", color: "text-purple-600" },
  { icon: BadgeAlert, label: t('nav.issues'), href: "/student/issues", color: "text-orange-600" },
  { icon: MessageCircle, label: t('nav.chats'), href: "/student/chats", color: "text-green-600" },
];

const getFacultyNavItems = (t) => [
  { icon: Home, label: t('nav.dashboard'), href: "/faculty", color: "text-blue-600" },
  { icon: BookOpen, label: t('nav.my_materials'), href: "/faculty/materials", color: "text-teal-600" },
  { icon: PencilRuler, label: t('nav.submit_material'), href: "/faculty/materials/submit", color: "text-pink-600" },
];

export default function Sidebar({ userType = "student", userName = "User" }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t, isRTL } = useI18n();

  const navItems = userType === "admin"
    ? getAdminNavItems(t)
    : userType === "faculty"
    ? getFacultyNavItems(t)
    : getStudentNavItems(t);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };


  return (
    <aside className={`bg-gradient-to-br from-[#3b82f6] via-[#60a5fa] to-[#dbeafe] transition-all duration-300 ease-in-out ${
      isCollapsed ? "w-20" : "w-64"
    } flex flex-col h-full relative overflow-hidden`}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-4 w-16 h-16 bg-[#f8fafc]/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-4 w-20 h-20 bg-[#dbeafe]/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-white/20">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#f8fafc] to-[#dbeafe] rounded-xl flex items-center justify-center">
              <span className="text-[#60a5fa] font-bold text-lg">
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div>
              <h1 className={`text-lg font-bold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {userName || 'User'}
              </h1>
              <p className="text-xs text-[#1e40af] font-medium">
                {userType === "admin" ? (isRTL ? 'مشرف' : 'Admin') :
                 userType === "faculty" ? (isRTL ? 'أستاذ' : 'Faculty') :
                 (isRTL ? 'طالب' : 'Student')}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#f8fafc]/50 transition-all duration-200"
        >
          {isCollapsed ? (
            <ChevronRight size={20} className="text-[#1e40af]" />
          ) : (
            <ChevronLeft size={20} className="text-[#1e40af]" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-grow p-3 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            // تحديد الصفحة النشطة بدقة أكبر
            let isActive = false;
            
            if (item.href === "/admin" || item.href === "/student" || item.href === "/faculty") {
              // للصفحات الرئيسية، يجب أن تكون مطابقة تماماً
              isActive = pathname === item.href;
            } else if (item.href === "/faculty/materials") {
              // لصفحة My Materials، يجب أن تكون مطابقة تماماً أو أن تكون في مجلد materials بدون submit
              isActive = pathname === item.href || (pathname.startsWith("/faculty/materials") && !pathname.includes("/submit"));
            } else if (item.href === "/faculty/materials/submit") {
              // لصفحة Submit Material، يجب أن تكون مطابقة تماماً
              isActive = pathname === item.href;
            } else {
              // للصفحات الأخرى، استخدم البداية
              isActive = pathname.startsWith(item.href);
            }

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <div className={`group flex items-center p-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? "bg-[#f8fafc]/20 text-[#1e40af] shadow-lg border border-[#f8fafc]/30" 
                      : "hover:bg-white/10 text-[#1e40af] hover:text-[#1e40af]"
                  }`}>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? "bg-[#f8fafc] text-[#60a5fa]" 
                        : "bg-white/5 group-hover:bg-[#f8fafc]/20"
                    }`}>
                      <item.icon className={`w-5 h-5 transition-all duration-300 ${
                        isActive ? "text-[#60a5fa]" : "text-[#f8fafc] group-hover:text-[#f8fafc]"
                      }`} />
                    </div>
                    {!isCollapsed && (
                      <span className={`ml-3 font-medium transition-all duration-300 ${
                        isActive ? "text-[#1e40af]" : "text-[#1e40af] group-hover:text-[#1e40af]"
                      } ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                        {item.label}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="relative z-10 p-3 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="w-full group flex items-center p-3 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-all duration-300"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 group-hover:bg-red-500/20 transition-all duration-300">
            <LogOut className="w-5 h-5 text-gray-300 group-hover:text-red-300 transition-all duration-300" />
          </div>
          {!isCollapsed && (
            <span className={`ml-3 font-medium text-[#1e40af] group-hover:text-red-600 transition-all duration-300 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {t('nav.logout')}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}