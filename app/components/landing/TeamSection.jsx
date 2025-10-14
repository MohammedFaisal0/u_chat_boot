"use client";
import React from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { Users, Award, Code, Heart } from "lucide-react";

const TeamMember = ({ id, name, number, avatarUrl, delay = 0 }) => {
  const { isRTL } = useI18n();
  
  return (
    <div 
      className="group bg-white rounded-3xl shadow-xl p-8 transition-all duration-500 ease-in-out transform hover:-translate-y-3 hover:shadow-2xl flex flex-col items-center text-center border border-gray-100"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] to-[#dbeafe] rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#60a5fa] group-hover:border-[#f8fafc] transition-colors duration-300">
          <Image
            src={avatarUrl}
            alt={`Avatar of ${name}`}
            width={128}
            height={128}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#f8fafc] to-[#dbeafe] rounded-full flex items-center justify-center">
          <Award className="w-4 h-4 text-white" />
        </div>
      </div>
      
      <div className="space-y-3">
        <p className="text-[#60a5fa] font-bold text-lg bg-[#f8fafc]/20 px-4 py-2 rounded-full">
          {id}
        </p>
        <h3 className={`text-[#60a5fa] font-bold text-2xl ${isRTL ? 'font-arabic' : 'font-latin'}`}>
          {name}
        </h3>
        <p className="text-[#60a5fa] text-lg font-medium">
          {isRTL ? `عضو الفريق ${number}` : `Team Member ${number}`}
        </p>
      </div>
      
      <div className="mt-6 flex space-x-2">
        <div className="w-2 h-2 bg-[#f8fafc] rounded-full"></div>
        <div className="w-2 h-2 bg-[#dbeafe] rounded-full"></div>
        <div className="w-2 h-2 bg-[#60a5fa] rounded-full"></div>
      </div>
    </div>
  );
};

const TeamSection = () => {
  const { t, isRTL } = useI18n();
  
  const teamMembers = [
    {
      id: "443016792",
      name: "Maen Mohammed Alharbi",
      number: "1",
      avatarUrl: "/student1.png",
      delay: 0
    },
    {
      id: "443016529",
      name: "Turki Meteb Almaslooki",
      number: "2",
      avatarUrl: "/student2.png",
      delay: 200
    },
  ];

  return (
    <section id="team" className="py-20 bg-gradient-to-br from-[#dbeafe] via-[#f8fafc] to-[#dbeafe] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/20 border border-white/30 rounded-full px-6 py-3 mb-6">
            <Users className="w-5 h-5 text-[#60a5fa] mr-2" />
            <span className="text-[#60a5fa] font-medium">
              {isRTL ? 'فريق التطوير' : 'Development Team'}
            </span>
          </div>
          
          <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-[#60a5fa] mb-6 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            {t('landing.team.title')}
          </h2>
          
          <p className="text-xl text-[#1e40af] max-w-3xl mx-auto leading-relaxed">
            {isRTL 
              ? 'تعرف على الفريق المبدع الذي عمل بجد لإنشاء هذه المنصة الذكية لطلاب جامعة الإمام محمد بن سعود الإسلامية'
              : 'Meet the creative team who worked hard to build this smart platform for Imam Mohammad ibn Saud Islamic University students'
            }
          </p>
        </div>

        {/* Team Members */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl">
            {teamMembers.map((member, index) => (
              <TeamMember key={index} {...member} />
            ))}
          </div>
        </div>

        {/* Team Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
              <Code className="w-8 h-8 text-[#60a5fa]" />
            </div>
            <h3 className="text-3xl font-bold text-[#60a5fa] mb-2">2</h3>
            <p className="text-[#1e40af] font-medium">
              {isRTL ? 'مطورين' : 'Developers'}
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
              <Heart className="w-8 h-8 text-[#60a5fa]" />
            </div>
            <h3 className="text-3xl font-bold text-[#60a5fa] mb-2">100%</h3>
            <p className="text-[#1e40af] font-medium">
              {isRTL ? 'شغف بالتعلم' : 'Passion for Learning'}
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
              <Award className="w-8 h-8 text-[#60a5fa]" />
            </div>
            <h3 className="text-3xl font-bold text-[#60a5fa] mb-2">∞</h3>
            <p className="text-[#1e40af] font-medium">
              {isRTL ? 'إبداع' : 'Creativity'}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TeamSection;
