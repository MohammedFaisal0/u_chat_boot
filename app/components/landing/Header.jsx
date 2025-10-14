"use client";
import Link from "next/link";
import React from "react";
import { useI18n } from "@/lib/i18n";
import { Globe, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { t, language, changeLanguage, isRTL } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = () => {
    changeLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white p-4 fixed w-full z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/univ-chat-bot-logo.png"
            alt="Naseeh Logo"
            className={`${isRTL ? 'ml-2' : 'mr-2'} w-14 h-14 object-contain`}
          />
          <span className="text-xl font-bold">Naseeh</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className={`flex ${isRTL ? 'space-x-reverse' : ''} space-x-6`}>
            <Link
              href="/#features"
              className="hover:text-[#dbeafe] transition duration-300 font-medium"
            >
              {t('landing.nav.features')}
            </Link>
            <Link
              href="/#about"
              className="hover:text-[#dbeafe] transition duration-300 font-medium"
            >
              {t('landing.nav.about')}
            </Link>
            <Link
              href="/#team"
              className="hover:text-[#dbeafe] transition duration-300 font-medium"
            >
              {t('landing.nav.team')}
            </Link>
            <Link
              href="/#contact"
              className="hover:text-[#dbeafe] transition duration-300 font-medium"
            >
              {t('landing.nav.contact')}
            </Link>
          </ul>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition duration-300"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">
              {language === 'ar' ? 'English' : 'العربية'}
            </span>
          </button>

          {/* Auth Buttons */}
          <div className={`flex ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
            <Link
              href="/login"
              className="bg-[#f8fafc] text-[#1e40af] px-6 py-2 rounded-full hover:bg-[#dbeafe] transition duration-300 font-medium"
            >
              {t('landing.auth.signin')}
            </Link>
            <Link
              href="/register"
              className="bg-[#dbeafe] text-[#1e40af] px-6 py-2 rounded-full hover:bg-[#f8fafc] transition duration-300 font-medium"
            >
              {t('landing.auth.signup')}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition duration-300"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] border-t border-white/20">
          <div className="container mx-auto px-4 py-4">
            <nav className="space-y-4">
              <Link
                href="/#features"
                className="block hover:text-[#dbeafe] transition duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('landing.nav.features')}
              </Link>
              <Link
                href="/#about"
                className="block hover:text-[#dbeafe] transition duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('landing.nav.about')}
              </Link>
              <Link
                href="/#team"
                className="block hover:text-[#dbeafe] transition duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('landing.nav.team')}
              </Link>
              <Link
                href="/#contact"
                className="block hover:text-[#dbeafe] transition duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('landing.nav.contact')}
              </Link>
            </nav>
            
            <div className="mt-6 pt-4 border-t border-white/20">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition duration-300 mb-4"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {language === 'ar' ? 'English' : 'العربية'}
                </span>
              </button>

              {/* Auth Buttons */}
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block bg-[#f8fafc] text-[#1e40af] px-6 py-2 rounded-full hover:bg-[#dbeafe] transition duration-300 font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('landing.auth.signin')}
                </Link>
                <Link
                  href="/register"
                  className="block bg-[#dbeafe] text-[#1e40af] px-6 py-2 rounded-full hover:bg-[#f8fafc] transition duration-300 font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('landing.auth.signup')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
