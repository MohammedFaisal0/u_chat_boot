"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";

export default function UserForm({ user, onSubmit }) {
  const [formData, setFormData] = useState({
    userName: "",
    accountType: "student",
    password: "",
    name: "",
    email: "",
    gender: "",
    address: "",
    phone: "",
    major: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t, isRTL } = useI18n();

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        accountType: user.accountType || "student",
        // Don't set password for existing users
        name: user.studentData?.name || user.adminData?.name || "",
        email: user.studentData?.email || "",
        gender: user.studentData?.gender || "",
        address: user.studentData?.address || "",
        phone: user.studentData?.phone || "",
        major: user.studentData?.major || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const dataToSubmit = {
        userName: formData.userName,
        accountType: formData.accountType,
      };

      if (!user) {
        // Creating new user
        dataToSubmit.password = formData.password;
        if (formData.accountType === "student") {
          dataToSubmit.studentData = {
            name: formData.name,
            email: formData.email,
            gender: formData.gender,
            address: formData.address,
            phone: formData.phone,
            major: formData.major,
          };
        } else if (formData.accountType === "admin") {
          dataToSubmit.adminData = {
            name: formData.name,
          };
        }
      } else {
        // Updating existing user
        if (formData.accountType === "student") {
          dataToSubmit.name = formData.name;
          dataToSubmit.email = formData.email;
          dataToSubmit.gender = formData.gender;
          dataToSubmit.address = formData.address;
          dataToSubmit.phone = formData.phone;
          dataToSubmit.major = formData.major;
        } else if (formData.accountType === "admin") {
          dataToSubmit.name = formData.name;
        }
      }

      await onSubmit(dataToSubmit);
    } catch (err) {
      setError(err.message || "An error occurred while submitting the form.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#d7e7fd] flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#60a5fa]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] p-6">
        <h2 className={`text-2xl font-bold text-center text-white ${isRTL ? 'font-arabic' : 'font-latin'}`}>
          {user ? (isRTL ? "تحديث الحساب" : "Update Account") : (isRTL ? "إنشاء حساب جديد" : "Create New Account")}
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
            <label htmlFor="userName" className={`block mb-2 text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {isRTL ? "اسم المستخدم:" : "Username:"}
            </label>
            <input
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] text-[#1e40af] placeholder-gray-500 ${isRTL ? 'font-arabic' : 'font-latin'}`}
              placeholder={isRTL ? "اسم المستخدم" : "Username"}
            />
          </div>
          <div>
            <label htmlFor="accountType" className={`block mb-2 text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {isRTL ? "نوع الحساب:" : "Account Type:"}
            </label>
            <select
              id="accountType"
              name="accountType"
              disabled={!!user}
              value={formData.accountType}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}
            >
              <option value="student" className="bg-[#60a5fa] text-white">{isRTL ? "طالب" : "Student"}</option>
              <option value="admin" className="bg-[#60a5fa] text-white">{isRTL ? "مشرف" : "Admin"}</option>
              <option value="faculty" className="bg-[#60a5fa] text-white">{isRTL ? "أستاذ" : "Faculty"}</option>
            </select>
          </div>
          {!user && (
            <div className="md:col-span-2">
              <label htmlFor="password" className={`block mb-2 text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? "كلمة المرور:" : "Password:"}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] text-[#1e40af] placeholder-gray-500 ${isRTL ? 'font-arabic' : 'font-latin'}`}
                placeholder={isRTL ? "كلمة المرور" : "Password"}
              />
            </div>
          )}
          </div>

        {!user && formData.accountType === "student" && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className={`block mb-2 text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? "الاسم:" : "Name:"}
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] text-[#1e40af] placeholder-gray-500 ${isRTL ? 'font-arabic' : 'font-latin'}`}
                placeholder={isRTL ? "الاسم الكامل" : "Full name"}
              />
            </div>
            <div>
              <label htmlFor="gender" className={`block mb-2 text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                {isRTL ? "الجنس:" : "Gender:"}
              </label>
              <select
                id="gender"
                name="gender"
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
                id="email"
                name="email"
                type="email"
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
                id="phone"
                name="phone"
                type="tel"
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
                id="major"
                name="major"
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
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] text-[#1e40af] placeholder-gray-500 ${isRTL ? 'font-arabic' : 'font-latin'}`}
                placeholder={isRTL ? "العنوان" : "Address"}
              />
            </div>
            </div>
          )}

        {!user && formData.accountType === "admin" && (
          <div className="mt-8">
            <label htmlFor="name" className={`block mb-2 text-[#1e40af] font-medium ${isRTL ? 'font-arabic' : 'font-latin'}`}>
              {isRTL ? "الاسم:" : "Name:"}
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] text-[#1e40af] placeholder-gray-500 ${isRTL ? 'font-arabic' : 'font-latin'}`}
              placeholder={isRTL ? "الاسم الكامل" : "Full name"}
            />
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white rounded-2xl hover:from-[#3b82f6] hover:to-[#60a5fa] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-bold text-lg"
          >
            {isLoading
              ? (isRTL ? "جاري التحميل..." : "Loading...")
              : user
              ? (isRTL ? "تحديث الحساب" : "Update Account")
              : (isRTL ? "إنشاء الحساب" : "Create Account")}
          </button>
        </div>
      </form>
    </div>
  );
}
