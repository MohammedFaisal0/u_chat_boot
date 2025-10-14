"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  const { t, isRTL } = useI18n();

  return (
    <div className="bg-gradient-to-br from-[#dbeafe] via-[#60a5fa] to-[#3b82f6] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#f8fafc] rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-[#dbeafe] rounded-full opacity-30 animate-pulse delay-1000"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className={`flex flex-col lg:flex-row items-center justify-between gap-12 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          {/* Content */}
          <div className="lg:w-2/3 text-center lg:text-left">
            <div className="mb-6">
              <div className="inline-flex items-center bg-[#f8fafc]/20 border border-[#f8fafc]/30 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-[#f8fafc] mr-2" />
                <span className="text-[#1e40af] text-sm font-medium">
                  {isRTL ? 'منصة ذكية للطلاب' : 'Smart Platform for Students'}
                </span>
              </div>
              
              <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                <span className="block text-[#1e40af]">
                  {isRTL ? 'مرحباً بك في' : 'Welcome to'}
                </span>
                <span className="block bg-gradient-to-r from-[#f8fafc] to-[#dbeafe] bg-clip-text text-transparent">
                  Naseeh
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl lg:text-3xl mb-4 text-[#1e40af] font-medium">
                {t('landing.hero.subtitle')}
              </p>
              
              <p className="text-lg sm:text-xl text-[#1e40af] mb-8 max-w-2xl leading-relaxed">
                {t('landing.hero.description')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#f8fafc] to-[#dbeafe] text-[#60a5fa] font-bold rounded-full text-lg hover:shadow-2xl hover:shadow-[#f8fafc]/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                <span>{t('landing.hero.get_started')}</span>
                <ArrowRight className={`w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform ${isRTL ? 'ml-0 mr-2 group-hover:-translate-x-1' : ''}`} />
              </Link>
              
              <Link
                href="/#features"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#1e40af]/30 text-[#1e40af] font-medium rounded-full text-lg hover:bg-[#1e40af]/10 hover:border-[#1e40af]/50 transition-all duration-300"
              >
                {isRTL ? 'اكتشف المميزات' : 'Explore Features'}
              </Link>
            </div>
          </div>
          
          {/* Image */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#f8fafc] to-[#dbeafe] rounded-3xl blur-3xl opacity-20 scale-110"></div>
              <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <Image
                  src="/ai+.png"
                  alt="Naseeh Chatbot"
                  width={600}
                  height={600}
                  className="w-full h-auto max-w-md mx-auto drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 fill-white">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
