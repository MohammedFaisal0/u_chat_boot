"use client";
import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { Brain, Target, Users, Lightbulb } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const About = () => {
  const { t, isRTL } = useI18n();
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    arrows: false,
    rtl: isRTL,
  };

  const images = [
    "/ai1.jpeg",
    "/ai2.jpeg",
    "/ai3.jpeg",
    "/ai4.png",
    "/ai5.png",
    "/ai6.jpeg",
  ];


  return (
    <section id="about" className="py-20 bg-gradient-to-br from-[#3b82f6] via-[#60a5fa] to-[#dbeafe] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#f8fafc]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#dbeafe]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#f8fafc]/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#f8fafc]/20 border border-[#f8fafc]/30 rounded-full px-6 py-3 mb-6">
            <Brain className="w-5 h-5 text-[#f8fafc] mr-2" />
            <span className="text-[#f8fafc] font-medium">
              {isRTL ? 'منصة ذكية' : 'Smart Platform'}
            </span>
          </div>
          
          <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1e40af] mb-6 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            {t('landing.about.title')}
          </h2>
          
          <p className="text-xl text-[#1e40af] max-w-3xl mx-auto leading-relaxed">
            {isRTL 
              ? 'اكتشف قصة إنشاء هذه المنصة المبتكرة وكيفية مساعدتها لطلاب جامعة الإمام محمد بن سعود الإسلامية'
              : 'Discover the story behind creating this innovative platform and how it helps Imam Mohammad ibn Saud Islamic University students'
            }
          </p>
        </div>

        <div className={`flex flex-col lg:flex-row items-center justify-between gap-12 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          {/* Content */}
          <div className="lg:w-1/2 space-y-8">
            <div className="space-y-6">
              <p className="text-lg text-[#f8fafc] leading-relaxed">
                {t('landing.about.description1')}
              </p>
              
              <p className="text-lg text-[#1e40af] leading-relaxed">
                {t('landing.about.description2')}
              </p>
              
              <p className="text-lg text-[#1e40af] leading-relaxed">
                {t('landing.about.description3')}
              </p>
              
              <p className="text-lg text-[#f8fafc] leading-relaxed font-medium">
                {t('landing.about.description4')}
              </p>
            </div>

          </div>
          
          {/* Image Slider */}
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#f8fafc] to-[#dbeafe] rounded-3xl blur-2xl opacity-20 scale-110"></div>
              <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
                <Slider {...settings}>
                  {images.map((src, index) => (
                    <div key={index} className="outline-none">
                      <div className="relative overflow-hidden rounded-2xl">
                        <Image
                          src={src}
                          alt={`AI Image ${index + 1}`}
                          width={500}
                          height={400}
                          className="w-full h-auto object-cover mx-auto"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-[#1e40af]">
                          <p className="text-sm font-medium">
                            {isRTL ? `صورة ${index + 1}` : `Image ${index + 1}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
