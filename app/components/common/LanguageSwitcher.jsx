"use client";

import { useI18n } from "@/lib/i18n";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { lang, changeLanguage, isRTL } = useI18n();

  const toggleLanguage = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 bg-[#f8fafc] hover:bg-[#dbeafe] px-4 py-2 rounded-full border border-white/20 transition duration-300`}
    >
      <Globe className="w-4 h-4 text-[#60a5fa]" />
      <span className={`text-sm font-medium text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
        {lang === 'ar' ? 'English' : 'العربية'}
      </span>
    </button>
  );
}