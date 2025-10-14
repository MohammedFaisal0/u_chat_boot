// app/components/student/AddIssueModal.jsx

import { useState } from "react";
import { X, Flag, Bug, MessageSquare, HelpCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function AddIssueModal({ isOpen, onClose, onSubmit, conversationId, messageId }) {
  const [details, setDetails] = useState("");
  const [type, setType] = useState("technical");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { t, isRTL } = useI18n();

  const issueTypes = [
    { value: 'technical', label: t('issue.technical'), icon: Bug },
    { value: 'incorrect_response', label: t('issue.incorrect_response'), icon: MessageSquare },
    { value: 'complex_question', label: t('issue.complex_question'), icon: HelpCircle },
    { value: 'other', label: t('issue.other'), icon: Flag }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!details.trim()) return;
    
    setLoading(true);
    try {
      await onSubmit({ 
        details, 
        type,
        conversationId,
        messageId 
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setDetails("");
        setType("technical");
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting issue:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Success screen
  if (success) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[80] p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className={`text-xl font-bold text-gray-900 mb-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {isRTL ? 'تم إرسال البلاغ بنجاح!' : 'Issue Reported Successfully!'}
            </h3>
            <p className={`text-gray-600 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {isRTL ? 'سيتم مراجعة بلاغك من قبل فريق الدعم قريباً' : 'Your report will be reviewed by our support team soon'}
            </p>
          </div>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#60a5fa] mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[80] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
              <div className="p-2 bg-white/20 rounded-xl">
                <Flag size={24} className="text-white" />
              </div>
              <h2 className={`text-xl font-bold text-white ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {t('issue.report_issue')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <p className={`text-white/80 text-sm mt-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            {isRTL ? 'أخبرنا عن المشكلة التي تواجهها وسنقوم بمراجعتها' : 'Tell us about the issue you\'re facing and we\'ll review it'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Type Selection */}
            <div>
              <label className={`block text-sm font-semibold text-gray-800 mb-3 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {t('issue.issue_type')}
              </label>
              <div className="grid grid-cols-1 gap-3">
                {issueTypes.map((issueType) => {
                  const Icon = issueType.icon;
                  const isSelected = type === issueType.value;
                  return (
                    <label 
                      key={issueType.value} 
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-[#60a5fa] bg-[#60a5fa]/5 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={issueType.value}
                        checked={isSelected}
                        onChange={(e) => setType(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-2 rounded-lg ${isRTL ? 'ml-3' : 'mr-3'} ${isSelected ? 'bg-[#60a5fa] text-white' : 'bg-gray-100 text-gray-600'}`}>
                        <Icon size={20} />
                      </div>
                      <span className={`font-medium ${isSelected ? 'text-[#60a5fa]' : 'text-gray-700'} ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                        {issueType.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Issue Details */}
            <div>
              <label className={`block text-sm font-semibold text-gray-800 mb-3 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {t('issue.details')}
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={t('issue.details_placeholder')}
                className={`w-full p-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent transition-all duration-200 resize-none ${isRTL ? 'font-arabic' : 'font-latin'}`}
                rows={4}
                required
              />
              <p className={`text-xs text-gray-500 mt-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? 'يرجى وصف المشكلة بالتفصيل لمساعدتنا في فهمها وحلها' : 'Please describe the issue in detail to help us understand and resolve it'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className={`flex gap-4 pt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading || !details.trim()}
                className={`flex-1 px-6 py-3 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white rounded-xl hover:from-[#3b82f6] hover:to-[#60a5fa] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl ${isRTL ? 'font-arabic' : 'font-latin'}`}
              >
                {loading ? (
                  <div className={`flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className={isRTL ? 'mr-2' : 'ml-2'}>{t('common.loading')}</span>
                  </div>
                ) : (
                  <div className={`flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Flag size={16} />
                    <span className={isRTL ? 'mr-2' : 'ml-2'}>{t('issue.submit')}</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
