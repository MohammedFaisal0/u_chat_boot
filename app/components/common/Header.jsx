"use client";

import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { usePathname } from "next/navigation";

export default function Header({ userType = "", userName = "" }) {
  const { t, isRTL } = useI18n();
  const pathname = usePathname();

  // Function to get page title and description based on current path
  const getPageInfo = () => {
    // Handle dynamic routes
    if (pathname.includes('/admin/users/') && pathname.includes('/edit')) {
      return {
        title: isRTL ? 'تحديث المستخدم' : 'Update User',
        description: isRTL ? 'تحديث معلومات المستخدم' : 'Update user information'
      };
    }
    if (pathname.includes('/admin/students/') && pathname.includes('/edit')) {
      return {
        title: isRTL ? 'تحديث الطالب' : 'Update Student',
        description: isRTL ? 'تحديث معلومات الطالب' : 'Update student information'
      };
    }
    
    switch (pathname) {
      case '/admin':
        return {
          title: isRTL ? 'لوحة التحكم' : 'Dashboard',
          description: isRTL ? 'لوحة التحكم الرئيسية' : 'Main Dashboard'
        };
      case '/admin/users':
        return {
          title: isRTL ? 'إدارة المستخدمين' : 'User Management',
          description: isRTL ? 'إدارة حسابات المستخدمين في النظام' : 'Manage user accounts in the system'
        };
      case '/admin/issues':
        return {
          title: isRTL ? 'إدارة المشاكل' : 'Issues Management',
          description: isRTL ? 'إدارة مشاكل الطلاب والتقارير' : 'Manage student issues and reports'
        };
      case '/admin/escalations':
        return {
          title: isRTL ? 'إدارة التصعيدات' : 'Escalations Management',
          description: isRTL ? 'إدارة تصعيدات الطلاب للدعم البشري' : 'Manage student escalations to human support'
        };
      case '/admin/feedback':
        return {
          title: isRTL ? 'إدارة التقييمات' : 'Feedback Management',
          description: isRTL ? 'عرض وتحليل تقييمات الطلاب' : 'View and analyze student feedback'
        };
      case '/admin/reports':
        return {
          title: isRTL ? 'التقارير' : 'Reports',
          description: isRTL ? 'إنشاء وعرض التقارير الإحصائية' : 'Generate and view statistical reports'
        };
      case '/admin/chatbot-instructions':
        return {
          title: isRTL ? 'تعليمات البوت' : 'Chatbot Instructions',
          description: isRTL ? 'إدارة تعليمات البوت الذكي' : 'Manage chatbot instructions'
        };
      case '/admin/faculty-materials':
        return {
          title: isRTL ? 'مواد الكلية' : 'Faculty Materials',
          description: isRTL ? 'إدارة مواد الكلية والموارد' : 'Manage faculty materials and resources'
        };
      case '/admin/students':
        return {
          title: isRTL ? 'إدارة الطلاب' : 'Students Management',
          description: isRTL ? 'إدارة حسابات الطلاب' : 'Manage student accounts'
        };
      case '/admin/students/add':
        return {
          title: isRTL ? 'إضافة طالب جديد' : 'Add New Student',
          description: isRTL ? 'إنشاء حساب طالب جديد' : 'Create a new student account'
        };
      case '/admin/users/add':
        return {
          title: isRTL ? 'إنشاء حساب جديد' : 'Create New Account',
          description: isRTL ? 'إنشاء حساب مستخدم جديد' : 'Create a new user account'
        };
      case '/student':
        return {
          title: isRTL ? 'لوحة التحكم' : 'Dashboard',
          description: isRTL ? 'لوحة تحكم الطالب' : 'Student Dashboard'
        };
      case '/student/chats':
        return {
          title: isRTL ? 'المحادثات' : 'Chats',
          description: isRTL ? 'إدارة المحادثات مع البوت' : 'Manage conversations with the bot'
        };
      case '/student/issues':
        return {
          title: isRTL ? 'المشاكل' : 'Issues',
          description: isRTL ? 'إدارة المشاكل والتقارير' : 'Manage issues and reports'
        };
      case '/student/profile':
        return {
          title: isRTL ? 'الملف الشخصي' : 'Profile',
          description: isRTL ? 'إدارة الملف الشخصي' : 'Manage your profile'
        };
      case '/faculty':
        return {
          title: isRTL ? 'لوحة التحكم' : 'Dashboard',
          description: isRTL ? 'لوحة تحكم عضو هيئة التدريس' : 'Faculty Dashboard'
        };
      case '/faculty/materials':
        return {
          title: isRTL ? 'موادي التعليمية' : 'My Materials',
          description: isRTL ? 'إدارة المواد التعليمية المقدمة' : 'Manage submitted educational materials'
        };
      case '/faculty/materials/submit':
        return {
          title: isRTL ? 'تقديم مادة جديدة' : 'Submit New Material',
          description: isRTL ? 'تقديم مادة تعليمية جديدة للمراجعة' : 'Submit a new educational material for review'
        };
      default:
        return {
          title: isRTL ? 'لوحة التحكم' : 'Dashboard',
          description: isRTL ? 'لوحة التحكم الرئيسية' : 'Main Dashboard'
        };
    }
  };

  const pageInfo = getPageInfo();


  return (
    <header className="bg-gradient-to-r from-[#3b82f6] via-[#60a5fa] to-[#dbeafe] sticky top-0 z-[60] border-b border-white/20 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-2 left-4 w-8 h-8 bg-[#f8fafc]/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-2 right-4 w-6 h-6 bg-[#dbeafe]/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          </div>
          {/* Page Title */}
          <div className="relative z-10 flex items-center space-x-4">
            <div className="hidden sm:block">
              <h1 className={`text-xl font-bold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {pageInfo.title}
              </h1>
              <p className="text-xs text-[#1e40af] font-medium">
                {pageInfo.description}
              </p>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="relative z-10 flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}