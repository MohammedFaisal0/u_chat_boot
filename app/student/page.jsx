"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2,
  AlertCircle,
  User,
  MessageCircle,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

const StudentDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalChats: 0,
    activeIssues: 0,
    resolvedIssues: 0,
    savedConversations: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { t, isRTL } = useI18n();

  useEffect(() => {
    fetchUserData();
    fetchStats();
  }, []);

  const fetchUserData = async () => {
    try {
      const userResponse = await fetch("/api/user", {
        credentials: 'include'
      });
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const user = await userResponse.json();
      setUserData(user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data");
    }
  };

  const fetchStats = async () => {
    try {
      const [chatsResponse, issuesResponse] = await Promise.all([
        fetch("/api/chats", {
          credentials: 'include'
        }),
        fetch("/api/issues/student", {
          credentials: 'include'
        })
      ]);

      const chats = chatsResponse.ok ? await chatsResponse.json() : [];
      const issues = issuesResponse.ok ? await issuesResponse.json() : [];

      setStats({
        totalChats: chats.length,
        activeIssues: issues.issues ? issues.issues.filter(issue => issue.status === "open" || issue.status === "in_progress").length : 0,
        resolvedIssues: issues.issues ? issues.issues.filter(issue => issue.status === "resolved").length : 0,
        savedConversations: chats.filter(chat => chat.saved).length
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: t('dashboard.stats.total_chats'),
      value: stats.totalChats,
      icon: MessageCircle,
      href: "/student/chats",
      color: "blue"
    },
    {
      title: t('dashboard.stats.active_issues'),
      value: stats.activeIssues,
      icon: AlertTriangle,
      href: "/student/issues",
      color: "yellow"
    },
    {
      title: t('dashboard.stats.resolved_issues'),
      value: stats.resolvedIssues,
      icon: CheckCircle,
      href: "/student/issues",
      color: "green"
    },
    {
      title: t('dashboard.stats.saved_conversations'),
      value: stats.savedConversations,
      icon: Star,
      href: "/student/chats",
      color: "purple"
    }
  ];

  const quickActions = [
    {
      title: t('dashboard.actions.start_chat'),
      description: t('dashboard.actions.start_chat_desc'),
      icon: MessageCircle,
      href: "/student/chats"
    },
    {
      title: t('dashboard.actions.report_issue'),
      description: t('dashboard.actions.report_issue_desc'),
      icon: AlertTriangle,
      href: "/student/issues"
    },
    {
      title: t('dashboard.actions.view_profile'),
      description: t('dashboard.actions.view_profile_desc'),
      icon: User,
      href: "/student/profile"
    },
    {
      title: t('dashboard.actions.help_center'),
      description: t('dashboard.actions.help_center_desc'),
      icon: BookOpen,
      href: "/student/help"
    }
  ];

  if (loading) {
    return (
    <div className="min-h-screen bg-[#d7e7fd] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-[#60a5fa] animate-spin mx-auto mb-4" />
        <p className={`text-[#1e40af] text-lg ${isRTL ? 'font-arabic' : 'font-latin'}`}>
          {t('common.loading')}
        </p>
      </div>
    </div>
    );
  }

  if (error) {
    return (
    <div className="min-h-screen bg-[#d7e7fd] flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className={`text-red-600 text-lg ${isRTL ? 'font-arabic' : 'font-latin'}`}>
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-[#60a5fa] text-white rounded-lg hover:bg-[#3b82f6] transition-colors"
        >
          {t('common.retry')}
        </button>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d7e7fd] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#f8fafc]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#dbeafe]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8 pt-4">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] rounded-xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {t('dashboard.welcome')}, {userData?.name}!
                </h2>
                <p className={`text-[#60a5fa] mt-1 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {t('dashboard.welcome_subtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Link key={index} href={stat.href}>
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 cursor-pointer h-32 flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-medium text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>{stat.title}</p>
                        <p className={`text-3xl font-bold text-[#1e40af] mt-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}>{stat.value}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className={`text-lg font-semibold text-[#1e40af] mb-6 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {t('dashboard.quick_actions')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} href={action.href}>
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 cursor-pointer h-32 flex flex-col justify-center">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>{action.title}</h4>
                          <p className={`text-sm text-[#60a5fa] mt-1 ${isRTL ? 'font-arabic' : 'font-latin'}`}>{action.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;