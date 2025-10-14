"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  Loader2,
  Pencil,
  Save,
  X,
  User,
  Book,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { useI18n } from "@/lib/i18n";

export default function StudentProfile() {
  const { accountId } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const { t, isRTL } = useI18n();

  useEffect(() => {
    fetchStudentData();
  }, [accountId]);

  const fetchStudentData = async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/students/${accountId}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error("Failed to fetch student data");
      const data = await response.json();
      setStudent(data);
      setFormData(data);
    } catch (err) {
      setError("An error occurred while fetching your data.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/students/${accountId}`, {
        method: "PUT",
        credentials: 'include',
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      const updatedStudent = await response.json();
      setStudent(updatedStudent);
      setFormData(updatedStudent);
      setIsEditing(false);
    } catch (err) {
      setError("An error occurred while updating your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(student);
  };

  if (loading) {
    return (
    <div className="min-h-screen bg-[#d7e7fd] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-[#60a5fa] animate-spin mx-auto mb-4" />
        <p className={`text-[#1e40af] text-lg ${isRTL ? 'font-arabic' : 'font-latin'}`}>
          {t('common.loading')}
        </p>
      </div>
    </div>
    );
  }

  if (error) {
    return (
    <div className="min-h-screen bg-[#d7e7fd] flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className={`text-red-600 text-lg ${isRTL ? 'font-arabic' : 'font-latin'}`}>
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-[#60a5fa] text-white rounded-lg hover:bg-[#3b82f6] transition-colors"
        >
          {t('common.retry')}
        </button>
      </div>
    </div>
    );
  }

  if (!student) return null;

  const fields = [
    { label: t('student.name'), name: "name", icon: User, required: true },
    { label: t('student.academic_id'), name: "academic_id", disabled: true, icon: Book },
    { label: t('student.email'), name: "email", type: "email", icon: Mail, required: true },
    { label: t('student.major'), name: "major", icon: GraduationCap, required: true },
    { label: t('student.phone'), name: "phone", type: "tel", icon: Phone, required: true },
    { label: t('student.address'), name: "address", icon: MapPin, required: true },
  ];

  return (
    <div className="min-h-screen bg-[#d7e7fd] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#f8fafc]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#dbeafe]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8 pt-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] rounded-xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {t('student.profile')}
                </h1>
                <p className={`text-[#60a5fa] mt-1 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                  {t('student.profile_desc')}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.map((field) => {
                    const Icon = field.icon;
                    return (
                      <div key={field.name} className="space-y-2">
                        <label className={`block text-sm font-medium text-[#1e40af] ${isRTL ? 'font-arabic' : 'font-latin'}`}>
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon className="h-5 w-5 text-[#60a5fa]" />
                          </div>
                          <input
                            type={field.type || "text"}
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleInputChange}
                            disabled={field.disabled || !isEditing}
                            required={field.required && isEditing}
                            className={`w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa] text-[#1e40af] placeholder-gray-500 transition-all duration-300 ${
                              isEditing && !field.disabled
                                ? "hover:bg-white/15"
                                : "bg-white/5 cursor-not-allowed"
                            } ${isRTL ? 'font-arabic' : 'font-latin'}`}
                            placeholder={field.label}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-white/20">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={saving}
                        className="px-6 py-3 bg-[#60a5fa]/20 text-[#60a5fa] border border-[#60a5fa]/30 rounded-2xl hover:bg-[#60a5fa]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center space-x-2">
                          <X className="w-4 h-4" />
                          <span className={isRTL ? 'font-arabic' : 'font-latin'}>{t('common.cancel')}</span>
                        </div>
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white rounded-2xl hover:from-[#3b82f6] hover:to-[#60a5fa] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-bold"
                      >
                        <div className="flex items-center space-x-2">
                          {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          <span className={isRTL ? 'font-arabic' : 'font-latin'}>
                            {saving ? t('common.saving') : t('common.save')}
                          </span>
                        </div>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="px-6 py-3 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white rounded-2xl hover:from-[#3b82f6] hover:to-[#60a5fa] transition-all duration-300 transform hover:scale-105 font-bold"
                    >
                      <div className="flex items-center space-x-2">
                        <Pencil className="w-4 h-4" />
                        <span className={isRTL ? 'font-arabic' : 'font-latin'}>{t('common.edit')}</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}