"use client";
import { useI18n } from "@/lib/i18n";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";

export default function Contact() {
  const { t, isRTL } = useI18n();

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: t('landing.contact.email'),
      value: t('landing.contact.email_value'),
      link: `mailto:${t('landing.contact.email_value')}`
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: t('landing.contact.phone'),
      value: t('landing.contact.phone_value'),
      link: `tel:${t('landing.contact.phone_value')}`
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t('landing.contact.address'),
      value: t('landing.contact.address_value'),
      link: "#"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-[#3b82f6] via-[#60a5fa] to-[#dbeafe] text-[#1e40af] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#f8fafc]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/10 border border-white/20 rounded-full px-6 py-3 mb-6">
            <MessageCircle className="w-5 h-5 text-[#f8fafc] mr-2" />
            <span className="text-[#f8fafc] font-medium">
              {isRTL ? 'تواصل معنا' : 'Get in Touch'}
            </span>
          </div>
          
          <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1e40af] mb-6 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            {t('landing.contact.title')}
          </h2>
          
              <p className="text-xl text-[#1e40af] max-w-3xl mx-auto leading-relaxed">
            {isRTL 
              ? 'نحن هنا لمساعدتك! تواصل معنا للحصول على الدعم أو الإجابة على أي استفسارات حول منصتنا الذكية'
              : 'We\'re here to help! Contact us for support or to answer any questions about our smart platform'
            }
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactInfo.map((contact, index) => (
            <a
              key={index}
              href={contact.link}
              className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 border border-white/20"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#f8fafc] to-[#dbeafe] rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="text-[#1e40af]">{contact.icon}</div>
              </div>
              <h3 className="text-xl font-bold text-[#1e40af] mb-3">{contact.title}</h3>
              <p className="text-[#1e40af] text-lg">{contact.value}</p>
            </a>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/20">
            <div className="text-center mb-8">
              <h3 className={`text-3xl font-bold text-[#1e40af] mb-4 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? 'أرسل لنا رسالة' : 'Send us a Message'}
              </h3>
              <p className="text-[#1e40af] text-lg">
                {isRTL 
                  ? 'هل لديك سؤال أو اقتراح؟ نحب أن نسمع منك!'
                  : 'Have a question or suggestion? We\'d love to hear from you!'
                }
              </p>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#1e40af] font-medium mb-2">
                    {isRTL ? 'الاسم' : 'Name'}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-[#1e40af] placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#f8fafc] focus:border-transparent"
                    placeholder={isRTL ? 'أدخل اسمك' : 'Enter your name'}
                  />
                </div>
                <div>
                  <label className="block text-[#1e40af] font-medium mb-2">
                    {isRTL ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-[#1e40af] placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#f8fafc] focus:border-transparent"
                    placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[#1e40af] font-medium mb-2">
                  {isRTL ? 'الموضوع' : 'Subject'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-[#1e40af] placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#f8fafc] focus:border-transparent"
                  placeholder={isRTL ? 'أدخل موضوع الرسالة' : 'Enter message subject'}
                />
              </div>
              
              <div>
                <label className="block text-[#1e40af] font-medium mb-2">
                  {isRTL ? 'الرسالة' : 'Message'}
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-[#1e40af] placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#f8fafc] focus:border-transparent resize-none"
                  placeholder={isRTL ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                ></textarea>
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#f8fafc] to-[#dbeafe] text-[#60a5fa] font-bold rounded-full text-lg hover:shadow-2xl hover:shadow-[#f8fafc]/25 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Send className={`w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform ${isRTL ? 'mr-0 ml-2 group-hover:-translate-x-1' : ''}`} />
                  <span>{isRTL ? 'إرسال الرسالة' : 'Send Message'}</span>
                </button>
          </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
