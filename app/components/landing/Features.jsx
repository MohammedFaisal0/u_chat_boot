"use client";
import { Book, Users, Shield, MessageCircle, Zap, Globe, Lock } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  const { isRTL } = useI18n();
  
  return (
    <div 
      className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc]/20 to-[#dbeafe]/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
            <div className="text-white">{icon}</div>
          </div>
          <h3 className={`text-[#60a5fa] text-2xl font-bold mb-4 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            {title}
          </h3>
          <p className="text-[#1e40af] leading-relaxed text-lg">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function Features() {
  const { t, isRTL } = useI18n();

  const features = [
    {
      icon: <MessageCircle size={32} />,
      title: t('landing.features.chat.title'),
      description: t('landing.features.chat.description'),
      delay: 0
    },
    {
      icon: <Users size={32} />,
      title: t('landing.features.community.title'),
      description: t('landing.features.community.description'),
      delay: 200
    },
    {
      icon: <Shield size={32} />,
      title: t('landing.features.security.title'),
      description: t('landing.features.security.description'),
      delay: 400
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#f8fafc]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#dbeafe]/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#f8fafc]/20 border border-[#f8fafc]/30 rounded-full px-6 py-3 mb-6">
            <Zap className="w-5 h-5 text-[#60a5fa] mr-2" />
            <span className="text-[#60a5fa] font-medium">
              {isRTL ? 'مميزات متقدمة' : 'Advanced Features'}
            </span>
          </div>
          
          <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-[#60a5fa] mb-6 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            {t('landing.features.title')}
          </h2>
          
          <p className="text-xl text-[#1e40af] max-w-3xl mx-auto leading-relaxed">
            {isRTL 
              ? 'اكتشف كيف يمكن لـ Naseeh أن يحسن تجربتك الجامعية ويجعل التعلم أكثر فعالية ومتعة'
              : 'Discover how Naseeh can enhance your university experience and make learning more effective and enjoyable'
            }
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] rounded-3xl p-8 lg:p-12 text-white">
            <div className="max-w-4xl mx-auto">
              <h3 className={`text-3xl lg:text-4xl font-bold mb-6 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? 'مصمم خصيصاً لطلاب جامعة الإمام محمد بن سعود الإسلامية' : 'Designed Specifically for Imam Mohammad ibn Saud Islamic University Students'}
              </h3>
              <p className="text-xl text-gray-200 leading-relaxed mb-8">
                {isRTL 
                  ? 'نحن نفهم احتياجاتك الأكاديمية ونقدم حلولاً ذكية لمساعدتك في رحلتك التعليمية'
                  : 'We understand your academic needs and provide smart solutions to support your educational journey'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center justify-center space-x-2">
                  <Globe className="w-5 h-5 text-[#f8fafc]" />
                  <span className="text-[#f8fafc] font-medium">
                    {isRTL ? 'دعم متعدد اللغات' : 'Multi-language Support'}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Lock className="w-5 h-5 text-[#f8fafc]" />
                  <span className="text-[#f8fafc] font-medium">
                    {isRTL ? 'أمان متقدم' : 'Advanced Security'}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="w-5 h-5 text-[#f8fafc]" />
                  <span className="text-[#f8fafc] font-medium">
                    {isRTL ? 'استجابة سريعة' : 'Fast Response'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
