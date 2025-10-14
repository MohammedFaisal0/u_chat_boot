// app/faculty/page.jsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Clock, CheckCircle, FileText, PlusCircle, TrendingUp, Users, Award } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function FacultyDashboard() {
  const [stats, setStats] = useState({ 
    total: 0, 
    pending: 0, 
    approved: 0, 
    rejected: 0,
    loading: true 
  });
  const [recentMaterials, setRecentMaterials] = useState([]);
  const { t, isRTL } = useI18n();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
      try {
      setStats(prev => ({ ...prev, loading: true }));
        const res = await fetch("/api/faculty/materials");
      if (!res.ok) throw new Error("Failed to fetch materials");
      
        const data = await res.json();
      const materials = data.materials || [];
      
      const total = materials.length;
      const pending = materials.filter((m) => m.status === "pending").length;
      const approved = materials.filter((m) => m.status === "approved").length;
      const rejected = materials.filter((m) => m.status === "rejected").length;
      
      setStats({ total, pending, approved, rejected, loading: false });
      
      // Get recent materials (last 5)
      setRecentMaterials(materials.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, bgColor, isLoading }) => (
    <div className={`${bgColor} p-6 rounded-2xl border border-white/20 shadow-xl backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium text-[#60a5fa] mb-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            {label}
          </p>
          <p className={`text-3xl font-bold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            {isLoading ? "..." : value}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${bgColor.replace('bg-', 'bg-').replace('/20', '/30')}`}>
          <Icon className={`w-6 h-6 text-[#60a5fa]`} />
      </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ icon: Icon, title, description, href, color, bgColor }) => (
    <Link href={href} className="group">
      <div className={`${bgColor} p-6 rounded-2xl border border-white/20 shadow-xl backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer`}>
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-xl ${bgColor.replace('bg-', 'bg-').replace('/20', '/30')}`}>
            <Icon className={`w-6 h-6 text-[#60a5fa] group-hover:scale-110 transition-transform`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold text-[#1e40af] mb-1 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {title}
            </h3>
            <p className={`text-sm text-[#60a5fa] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#d7e7fd] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#f8fafc]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#dbeafe]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-[#f8fafc]/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold text-[#1e40af] mb-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            {isRTL ? 'لوحة تحكم عضو هيئة التدريس' : 'Faculty Dashboard'}
          </h1>
          <p className={`text-lg text-[#60a5fa] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            {isRTL ? 'مرحباً بك في لوحة التحكم الخاصة بك' : 'Welcome to your faculty dashboard'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            label={isRTL ? 'إجمالي المواد' : 'Total Materials'}
            value={stats.total}
            color="text-blue-400"
            bgColor="bg-blue-500/20"
            isLoading={stats.loading}
          />
          <StatCard
            icon={Clock}
            label={isRTL ? 'في الانتظار' : 'Pending Review'}
            value={stats.pending}
            color="text-yellow-400"
            bgColor="bg-yellow-500/20"
            isLoading={stats.loading}
          />
          <StatCard
            icon={CheckCircle}
            label={isRTL ? 'موافق عليها' : 'Approved'}
            value={stats.approved}
            color="text-green-400"
            bgColor="bg-green-500/20"
            isLoading={stats.loading}
          />
          <StatCard
            icon={TrendingUp}
            label={isRTL ? 'معدل الموافقة' : 'Approval Rate'}
            value={stats.total > 0 ? `${Math.round((stats.approved / stats.total) * 100)}%` : "0%"}
            color="text-purple-400"
            bgColor="bg-purple-500/20"
            isLoading={stats.loading}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold text-[#1e40af] mb-6 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            {isRTL ? 'الإجراءات السريعة' : 'Quick Actions'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickActionCard
              icon={FileText}
              title={isRTL ? 'موادي التعليمية' : 'My Materials'}
              description={isRTL ? 'عرض وإدارة جميع المواد المقدمة' : 'View and manage all submitted materials'}
              href="/faculty/materials"
              color="text-blue-400"
              bgColor="bg-blue-500/20"
            />
            <QuickActionCard
              icon={PlusCircle}
              title={isRTL ? 'تقديم مادة جديدة' : 'Submit New Material'}
              description={isRTL ? 'تقديم مادة تعليمية جديدة للمراجعة' : 'Submit a new educational material for review'}
              href="/faculty/materials/submit"
              color="text-green-400"
              bgColor="bg-green-500/20"
            />
          </div>
        </div>

        {/* Recent Materials */}
        {recentMaterials.length > 0 && (
          <div className="mb-8">
            <h2 className={`text-2xl font-bold text-[#1e40af] mb-6 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {isRTL ? 'المواد الحديثة' : 'Recent Materials'}
            </h2>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
              <div className="p-6">
                <div className="space-y-4">
                  {recentMaterials.map((material, index) => (
                    <div key={material._id || index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold text-[#1e40af] mb-1 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                          {material.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-[#60a5fa]">
                          <span>{material.course || '-'}</span>
                          <span>•</span>
                          <span>{new Date(material.submitted_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          material.status === "pending" ? "bg-[#dbeafe]/20 text-[#60a5fa] border border-[#60a5fa]/30" :
                          material.status === "approved" ? "bg-[#f8fafc]/20 text-[#1e40af] border border-[#1e40af]/30" :
                          "bg-[#f8fafc]/20 text-[#1e40af] border border-[#1e40af]/30"
                        }`}>
                          {material.status}
                        </span>
                        {material.file_url && (
                          <a
                            href={material.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#60a5fa] hover:text-[#3b82f6] transition-colors"
                          >
                            <FileText size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link
                    href="/faculty/materials"
                    className={`inline-flex items-center px-6 py-3 bg-[#dbeafe]/20 text-[#60a5fa] border border-[#60a5fa]/30 rounded-xl hover:bg-[#dbeafe]/30 transition-colors ${isRTL ? 'font-arabic' : 'font-latin'}`}
                  >
                    {isRTL ? 'عرض جميع المواد' : 'View All Materials'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6">
          <h3 className={`text-xl font-bold text-[#1e40af] mb-4 flex items-center ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            <Award className="w-5 h-5 mr-2 text-[#60a5fa]" />
            {isRTL ? 'نصائح لتحسين المواد التعليمية' : 'Tips for Better Materials'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-[#dbeafe] rounded-full mt-2 flex-shrink-0"></div>
              <p className={`text-[#1e40af] text-sm ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? 'تأكد من وضوح العنوان والوصف' : 'Ensure clear titles and descriptions'}
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-[#dbeafe] rounded-full mt-2 flex-shrink-0"></div>
              <p className={`text-[#1e40af] text-sm ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? 'استخدم ملفات PDF عالية الجودة' : 'Use high-quality PDF files'}
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-[#dbeafe] rounded-full mt-2 flex-shrink-0"></div>
              <p className={`text-[#1e40af] text-sm ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? 'حدد المقرر والموضوع بوضوح' : 'Clearly specify course and topic'}
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-[#dbeafe] rounded-full mt-2 flex-shrink-0"></div>
              <p className={`text-[#1e40af] text-sm ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? 'راجع المواد قبل التقديم' : 'Review materials before submission'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



