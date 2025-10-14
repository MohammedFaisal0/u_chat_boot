"use client";
import { useI18n } from "@/lib/i18n";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const { t, isRTL } = useI18n();

  const quickLinks = [
    { name: isRTL ? 'المميزات' : 'Features', href: '/#features' },
    { name: isRTL ? 'حولنا' : 'About', href: '/#about' },
    { name: isRTL ? 'فريقنا' : 'Team', href: '/#team' },
    { name: isRTL ? 'اتصل بنا' : 'Contact', href: '/#contact' }
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', name: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', name: 'Twitter' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', name: 'Instagram' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#', name: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gradient-to-br from-[#3b82f6] via-[#60a5fa] to-[#dbeafe] text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="absolute top-10 right-10 w-20 h-20 bg-[#f8fafc]/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-[#dbeafe]/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <img
                src="/univ-chat-bot-logo.png"
                alt="Naseeh Logo"
                className={`${isRTL ? 'ml-3' : 'mr-3'} w-16 h-16 object-contain`}
              />
              <div>
                <h3 className="text-2xl font-bold text-white">Naseeh</h3>
                <p className="text-[#f8fafc] text-sm font-medium">
                  {isRTL ? 'منصة ذكية للطلاب' : 'Smart Platform for Students'}
                </p>
              </div>
            </div>
            <p className="text-[#1e40af] leading-relaxed mb-6 max-w-md">
              {isRTL 
                ? 'منصة ذكية مدعومة بالذكاء الاصطناعي مصممة خصيصاً لطلاب جامعة الإمام محمد بن سعود الإسلامية لتحسين تجربتهم التعليمية.'
                : 'An AI-powered smart platform designed specifically for Imam Mohammad ibn Saud Islamic University students to enhance their educational experience.'
              }
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 hover:bg-[#f8fafc] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">
              {isRTL ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-[#1e40af] hover:text-[#dbeafe] transition duration-300 flex items-center"
                  >
                    <span className="w-2 h-2 bg-[#f8fafc] rounded-full mr-3 opacity-0 hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">
              {isRTL ? 'معلومات التواصل' : 'Contact Info'}
            </h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-[#f8fafc] mr-3" />
                <span className="text-[#1e40af] text-sm">info@unichatai.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-[#f8fafc] mr-3" />
                <span className="text-[#1e40af] text-sm">+966 (123) 567-890</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-[#f8fafc] mr-3" />
                <span className="text-[#1e40af] text-sm">
                  {isRTL ? 'جامعة الإمام محمد بن سعود الإسلامية' : 'IMSI University'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-[#1e40af] text-sm mb-4 md:mb-0">
              <span>
                {isRTL ? '© 2025 Naseeh. جميع الحقوق محفوظة.' : '© 2025 Naseeh. All rights reserved.'}
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="text-[#1e40af] hover:text-[#dbeafe] transition duration-300 text-sm"
              >
                {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </a>
              <a
                href="#"
                className="text-[#1e40af] hover:text-[#dbeafe] transition duration-300 text-sm"
              >
                {isRTL ? 'شروط الاستخدام' : 'Terms of Service'}
              </a>
            </div>
          </div>
          
          {/* Made with Love */}
          <div className="text-center mt-6">
            <p className="text-[#1e40af] text-sm flex items-center justify-center">
              {isRTL ? 'صُنع بـ' : 'Made with'}
              <Heart className="w-4 h-4 text-red-500 mx-2 fill-current" />
              {isRTL ? 'لطلاب جامعة الإمام محمد بن سعود الإسلامية' : 'for Imam Mohammad ibn Saud Islamic University Students'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
