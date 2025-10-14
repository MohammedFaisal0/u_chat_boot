// app/admin/users/add/page.jsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UserForm from "@/components/admin/UsersForm";

export default function AddUserPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/users");
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#d7e7fd] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#f8fafc]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#dbeafe]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-4xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-500">
              {error}
            </div>
          )}
          <UserForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
