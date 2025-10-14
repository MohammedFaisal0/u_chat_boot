// app/admin/dashboard/page.jsx
"use client";

import { useState, useEffect } from "react";
import { ErrorMessage } from "@/components/ui/uis";
import {
  Users,
  AlertCircle,
  BookOpen,
  UserCheck,
  ArrowUp,
  ArrowDown,
  Minus,
  Star,
  TrendingUp,
  Activity,
  MessageSquare,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useI18n } from "@/lib/i18n";

const colors = {
  darkBlue: "#1e40af",
  midBlue: "#3b82f6",
  gold: "#60a5fa",
  tan: "#dbeafe",
  black: "#1e40af",
  lightBlue: "#60a5fa",
  green: "#10b981",
};

const iconMap = {
  Users,
  AlertCircle,
  BookOpen,
  UserCheck,
  Star,
};

function StatCard({ title, value, icon, color, isRTL }) {
  const Icon = iconMap[icon];
  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
      <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4`}>
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#f8fafc]/20 to-[#dbeafe]/20">
          <Icon size={32} className="text-[#60a5fa]" />
        </div>
        <div>
          <h3 className={`text-sm font-medium text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>{title}</h3>
          <p className="text-2xl font-bold text-[#1e40af]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const { t, isRTL } = useI18n();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError("An error occurred while fetching dashboard data.");
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-[#d7e7fd] flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#60a5fa]"></div>
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

        <div className="relative z-10 p-8">
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            {dashboardData.summary.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={Object.values(colors)[index % Object.values(colors).length]}
                isRTL={isRTL}
              />
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Issue Statistics */}
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
              <h2 className={`text-xl font-semibold mb-4 text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? 'إحصائيات المشاكل' : 'Issue Statistics'}
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.issueStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#60a5fa" opacity={0.3} />
                  <XAxis dataKey="_id" stroke="#1e40af" />
                  <YAxis stroke="#1e40af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f8fafc', 
                      border: '1px solid #60a5fa',
                      borderRadius: '8px',
                      color: '#1e40af'
                    }} 
                  />
                  <Bar dataKey="count" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Registration Trend */}
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
              <h2 className={`text-xl font-semibold mb-4 text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? 'اتجاه تسجيل الطلاب' : 'Student Registration Trend'}
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.registrationTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#60a5fa" opacity={0.3} />
                  <XAxis dataKey="_id" stroke="#1e40af" />
                  <YAxis stroke="#1e40af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f8fafc', 
                      border: '1px solid #60a5fa',
                      borderRadius: '8px',
                      color: '#1e40af'
                    }} 
                  />
                  <Line type="monotone" dataKey="count" stroke="#60a5fa" strokeWidth={3} dot={{ fill: '#60a5fa', strokeWidth: 2, r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Material Statistics */}
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
              <h2 className={`text-xl font-semibold mb-4 text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? 'توزيع حالة المواد' : 'Material Status Distribution'}
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.materialStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#60a5fa" opacity={0.3} />
                  <XAxis dataKey="_id" stroke="#1e40af" />
                  <YAxis stroke="#1e40af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f8fafc', 
                      border: '1px solid #60a5fa',
                      borderRadius: '8px',
                      color: '#1e40af'
                    }} 
                  />
                  <Bar dataKey="count" fill="#dbeafe" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Issues */}
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
              <h2 className={`text-xl font-semibold mb-4 text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? 'المشاكل الحديثة' : 'Recent Issues'}
              </h2>
              <ul className="space-y-4">
                {dashboardData.recentIssues.map((issue) => (
                  <li key={issue.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className={`font-semibold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>{issue.title}</p>
                    <div className={`flex justify-between items-center mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-sm text-[#1e40af]">
                        {new Date(issue.timestamp).toLocaleString()}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          issue.status === "Open"
                            ? "bg-[#dbeafe]/20 text-[#60a5fa] border border-[#60a5fa]/30"
                            : issue.status === "In Progress"
                            ? "bg-[#f8fafc]/20 text-[#1e40af] border border-[#1e40af]/30"
                            : "bg-[#f8fafc]/20 text-[#1e40af] border border-[#1e40af]/30"
                        }`}
                      >
                        {issue.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Active Students */}
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
              <h2 className={`text-xl font-semibold mb-4 text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? 'أكثر الطلاب نشاطاً' : 'Top Active Students'}
              </h2>
              <ul className="space-y-4">
                {dashboardData.topActiveStudents.map((student, index) => (
                  <li
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4`}>
                      <span className="text-lg font-semibold text-[#60a5fa] w-8 h-8 bg-[#f8fafc]/20 rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className={`text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>{student.name}</span>
                    </div>
                    <span className="font-semibold text-[#60a5fa]">
                      {student.chatCount} {isRTL ? 'محادثة' : 'chats'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Materials Linked to Bot */}
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 shadow-xl">
              <h2 className={`text-xl font-semibold mb-4 text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? 'المواد المرتبطة بالبوت' : 'Materials Linked to Bot'}
              </h2>
              <ul className="space-y-4">
                {dashboardData.materialsLinkedToBotDetails?.map((instruction, index) => (
                  <li
                    key={instruction.id}
                    className="p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-semibold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>{instruction.materialTitle}</p>
                        <p className={`text-sm text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>{instruction.course} - {instruction.topic}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#dbeafe]/20 text-[#60a5fa] border border-[#60a5fa]/30">
                        {isRTL ? 'مرتبط' : 'Linked'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
}
