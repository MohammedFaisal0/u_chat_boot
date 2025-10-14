"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import {
  FormInput,
  FormLabel,
  FormButton,
  FormLayout,
  FormSelect,
} from "@/components/ui/Form";

export default function StudentForm({ studentId }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    address: "",
    phone: "",
    major: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t, isRTL } = useI18n();

  useEffect(() => {
    if (studentId) {
      setIsLoading(true);
      fetch(`/api/students/${studentId}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            name: data.name,
            email: data.email,
            gender: data.gender,
            address: data.address,
            phone: data.phone,
            major: data.major,
            // Don't set password here for security reasons
          });
          setIsLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch student data");
          setIsLoading(false);
        });
    }
  }, [studentId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const url = studentId ? `/api/students/${studentId}` : "/api/students";
      const method = studentId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to ${studentId ? "update" : "add"} student`
        );
      }

      router.push("/admin/students");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#d7e7fd] flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#60a5fa]"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#d7e7fd] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#f8fafc]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#dbeafe]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-2xl">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] p-6">
              <h2 className={`text-2xl font-bold text-center text-white ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {studentId ? (isRTL ? "تحديث بيانات الطالب" : "Update Student") : (isRTL ? "إضافة طالب جديد" : "Add New Student")}
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8">
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-500 px-4 py-3 rounded-2xl mb-6">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className={`block mb-2 text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? "الاسم:" : "Name:"}
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] text-[#1e40af] placeholder-gray-500 ${isRTL ? 'font-arabic' : 'font-latin'}`}
                    placeholder={isRTL ? "اسم الطالب" : "Student name"}
                  />
                </div>
                <div>
                  <label htmlFor="gender" className={`block mb-2 text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? "الجنس:" : "Gender:"}
                  </label>
                  <select
                    name="gender"
                    id="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}
                  >
                    <option value="" className="bg-[#60a5fa] text-white">{isRTL ? "اختر الجنس" : "Select gender"}</option>
                    <option value="male" className="bg-[#60a5fa] text-white">{isRTL ? "ذكر" : "Male"}</option>
                    <option value="female" className="bg-[#60a5fa] text-white">{isRTL ? "أنثى" : "Female"}</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="email" className={`block mb-2 text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? "البريد الإلكتروني:" : "Email:"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] text-[#1e40af] placeholder-gray-500 ${isRTL ? 'font-arabic' : 'font-latin'}`}
                    placeholder={isRTL ? "البريد الإلكتروني" : "Email address"}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className={`block mb-2 text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? "رقم الهاتف:" : "Phone:"}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] text-[#1e40af] placeholder-gray-500 ${isRTL ? 'font-arabic' : 'font-latin'}`}
                    placeholder={isRTL ? "رقم الهاتف" : "Phone number"}
                  />
                </div>
                <div>
                  <label htmlFor="major" className={`block mb-2 text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? "التخصص:" : "Major:"}
                  </label>
                  <input
                    type="text"
                    name="major"
                    id="major"
                    value={formData.major}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] text-[#1e40af] placeholder-gray-500 ${isRTL ? 'font-arabic' : 'font-latin'}`}
                    placeholder={isRTL ? "التخصص" : "Major"}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="address" className={`block mb-2 text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                    {isRTL ? "العنوان:" : "Address:"}
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] text-[#1e40af] placeholder-gray-500 ${isRTL ? 'font-arabic' : 'font-latin'}`}
                    placeholder={isRTL ? "العنوان" : "Address"}
                  />
                </div>
                {!studentId && (
                  <div className="md:col-span-2">
                    <label htmlFor="password" className={`block mb-2 text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                      {isRTL ? "كلمة المرور:" : "Password:"}
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      required={!studentId}
                      className={`w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] text-[#1e40af] placeholder-gray-500 ${isRTL ? 'font-arabic' : 'font-latin'}`}
                      placeholder={isRTL ? "كلمة المرور" : "Password"}
                    />
                  </div>
                )}
          </div>
              
              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white rounded-2xl hover:from-[#3b82f6] hover:to-[#60a5fa] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-bold text-lg"
                >
                  {isLoading
                    ? (isRTL ? "جاري التحميل..." : "Loading...")
                    : studentId
                    ? (isRTL ? "تحديث الطالب" : "Update Student")
                    : (isRTL ? "إضافة طالب" : "Add Student")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
