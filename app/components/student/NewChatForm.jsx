// app/components/student/NewChatForm.jsx
"use client";
import React, { useState } from "react";
import { XCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const NewChatForm = ({ onSubmit, onCancel }) => {
  const [chatName, setChatName] = useState("");
  const { t, isRTL } = useI18n();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (chatName.trim()) {
      onSubmit(chatName);
    }
  };

  return (
    <div className="p-6 bg-[#f8fafc] rounded-xl shadow-lg border border-[#dbeafe]/30">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
          {t('chat.start_new_chat')}
        </h2>
        <button
          onClick={onCancel}
          className="text-[#60a5fa] hover:text-[#3b82f6] transition-colors duration-200"
        >
          <XCircle size={24} />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="chatName"
            className={`block text-sm font-medium text-[#1e40af] mb-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}
          >
            {t('chat.chat_name')}
          </label>
          <input
            type="text"
            id="chatName"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            className={`w-full px-4 py-3 bg-white border border-[#dbeafe]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent text-[#1e40af] placeholder-gray-500 ${isRTL ? 'font-arabic' : 'font-latin'}`}
            placeholder={t('chat.enter_chat_name')}
            required
            autoFocus
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-3 bg-[#dbeafe]/20 text-[#1e40af] rounded-lg font-semibold hover:bg-[#dbeafe]/30 transition-all duration-200 ${isRTL ? 'font-arabic' : 'font-latin'}`}
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            className={`px-6 py-3 bg-[#60a5fa] text-white rounded-lg font-semibold hover:bg-[#3b82f6] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-2 ${isRTL ? 'font-arabic' : 'font-latin'}`}
          >
            {t('chat.create_chat')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewChatForm;
