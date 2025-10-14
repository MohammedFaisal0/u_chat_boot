// app/admin/users/[id]/edit/page.jsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserForm from "@/components/admin/UsersForm";

export default function EditUserPage({ params }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/accounts/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setError("Failed to fetch user data");
        }
      } catch (error) {
        setError("An error occurred. Please try again.");
      }
    };

    fetchUser();
  }, [params.id]);

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch(`/api/accounts/${params.id}`, {
        method: "PUT",
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

  if (!user) {
    return (
      <div className="min-h-screen bg-[#d7e7fd] flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#60a5fa]"></div>
      </div>
    );
  }

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
          <UserForm user={user} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
