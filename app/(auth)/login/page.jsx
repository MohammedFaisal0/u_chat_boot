"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t, isRTL } = useI18n();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (data.accountType === "admin") {
          router.push("/admin");
        } else if (data.accountType === "student") {
          router.push("/student");
        } else if (data.accountType === "faculty") {
          router.push("/faculty");
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#60a5fa] to-[#3b82f6] flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#f8fafc]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#dbeafe]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#f8fafc]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Centered Login Form */}
      <div className="w-full max-w-md p-8 relative z-10 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className={`text-4xl font-bold text-white mb-4 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
            {t('auth.welcome_back')}
          </h2>
          <p className="text-[#1e40af] text-lg">
            {t('auth.login_subtitle')}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-6">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-600 text-sm">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[#1e40af]">
                {t('auth.username')}
              </label>
              <div className="relative">
                <Mail className={`absolute top-1/2 transform -translate-y-1/2 text-[#1e40af] w-5 h-5 ${isRTL ? 'right-3' : 'left-3'}`} />
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-[#1e40af] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent transition-all duration-300 ${isRTL ? 'pr-12' : 'pl-12'}`}
                  placeholder={t('auth.username_placeholder')}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[#1e40af]">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className={`absolute top-1/2 transform -translate-y-1/2 text-[#1e40af] w-5 h-5 ${isRTL ? 'right-3' : 'left-3'}`} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-[#1e40af] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-transparent transition-all duration-300 ${isRTL ? 'pr-12 pl-12' : 'pl-12 pr-12'}`}
                  placeholder={t('auth.password_placeholder')}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 transform -translate-y-1/2 text-[#1e40af] hover:text-[#60a5fa] transition-colors ${isRTL ? 'left-3' : 'right-3'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#f8fafc] focus:ring-[#f8fafc] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className={`block text-sm text-[#1e40af] ${isRTL ? 'mr-2' : 'ml-2'}`}>
                  {t('auth.remember_me')}
                </label>
              </div>

              <Link
                href="#"
                className="text-sm text-[#f8fafc] hover:text-[#dbeafe] font-medium transition-colors"
              >
                {t('auth.forgot_password')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#f8fafc] to-[#dbeafe] text-[#60a5fa] font-bold py-3 px-6 rounded-2xl hover:from-[#dbeafe] hover:to-[#f8fafc] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#60a5fa] mr-2"></div>
                  {t('auth.logging_in')}
                </>
              ) : (
                <>
                  {t('auth.login')}
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[#1e40af]">
            {t('auth.no_account')}{" "}
            <Link
              href="/register"
              className="text-[#60a5fa] hover:text-[#3b82f6] font-medium transition-colors"
            >
              {t('auth.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}