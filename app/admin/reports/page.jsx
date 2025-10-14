"use client";
import { useState } from "react";
import { FileText, Download, Calendar, BarChart3, Users, MessageSquare, AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const { t, isRTL } = useI18n();

  const reportTypes = [
    {
      id: "user_activity",
      name: t('reports.user_activity'),
      description: t('reports.user_activity_desc'),
      icon: Users
    },
    {
      id: "chatbot_performance",
      name: t('reports.chatbot_performance'),
      description: t('reports.chatbot_performance_desc'),
      icon: MessageSquare
    },
    {
      id: "issue_analysis",
      name: t('reports.issue_analysis'),
      description: t('reports.issue_analysis_desc'),
      icon: AlertTriangle
    },
    {
      id: "system_overview",
      name: t('reports.system_overview'),
      description: t('reports.system_overview_desc'),
      icon: BarChart3
    }
  ];

  const generateReport = async () => {
    if (!reportType || !startDate || !endDate) {
      setError(t('reports.fill_all_fields'));
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportType,
          startDate,
          endDate,
          format: "json"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate report");
      }

      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderReportData = () => {
    if (!reportData) return null;

    const { data } = reportData;

    return (
      <div className="mt-6 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('reports.report_generated')}
            </h3>
            <button
              onClick={downloadReport}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('reports.download')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Object.entries(data.summary || {}).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
              </div>
            ))}
          </div>

          {data.trends && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                {t('reports.trends')}
              </h4>
              <div className="bg-gray-50 p-4 rounded">
                <pre className="text-sm text-gray-700 overflow-auto">
                  {JSON.stringify(data.trends, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {data.analysis && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                {t('reports.analysis')}
              </h4>
              <div className="bg-gray-50 p-4 rounded">
                <pre className="text-sm text-gray-700 overflow-auto">
                  {JSON.stringify(data.analysis, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {data.criticalEvents && data.criticalEvents.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                {t('reports.critical_events')}
              </h4>
              <div className="bg-red-50 p-4 rounded">
                <pre className="text-sm text-gray-700 overflow-auto">
                  {JSON.stringify(data.criticalEvents, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#d7e7fd] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#f8fafc]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#dbeafe]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8 space-y-6">
        {/* Report Configuration */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6">
          <h3 className={`text-xl font-semibold text-[#1e40af] mb-6 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            {t('reports.generate_report')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium text-[#1e40af] mb-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {t('reports.report_type')}
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className={`w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-3 text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}
              >
                <option value="" className="bg-[#60a5fa] text-white">{t('reports.select_report_type')}</option>
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <option key={type.id} value={type.id} className="bg-[#60a5fa] text-white">
                      {type.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium text-[#1e40af] mb-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {t('reports.date_range')}
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`flex-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-3 text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`flex-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-3 text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}
                />
              </div>
            </div>
          </div>

          {reportType && (
            <div className="mt-6 p-4 bg-[#60a5fa]/10 border border-[#60a5fa]/20 rounded-2xl">
              <div className="flex items-start">
                {(() => {
                  const selectedType = reportTypes.find(t => t.id === reportType);
                  const Icon = selectedType?.icon;
                  return Icon ? <Icon className={`w-5 h-5 text-[#60a5fa] mt-0.5 ${isRTL ? 'ml-3' : 'mr-3'}`} /> : null;
                })()}
                <div>
                  <h4 className={`font-medium text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {reportTypes.find(t => t.id === reportType)?.name}
                  </h4>
                  <p className={`text-sm text-[#1e40af] mt-1 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {reportTypes.find(t => t.id === reportType)?.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={generateReport}
              disabled={isGenerating || !reportType || !startDate || !endDate}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white rounded-2xl hover:from-[#3b82f6] hover:to-[#60a5fa] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-bold"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('reports.generating')}
                </>
              ) : (
                <>
                  <FileText className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('reports.generate')}
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl">
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </div>

        {/* Report Types Information */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6">
          <h3 className={`text-xl font-semibold text-[#1e40af] mb-6 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            {t('reports.available_reports')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center mb-2">
                    <Icon className={`w-5 h-5 text-[#60a5fa] ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <h4 className={`font-medium text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>{type.name}</h4>
                  </div>
                  <p className={`text-sm text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>{type.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Generated Report */}
        {renderReportData()}
      </div>
    </div>
  );
}

