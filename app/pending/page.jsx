"use client";
import { useI18n } from "@/lib/i18n";
import { Clock, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PendingPage() {
  const { t, isRTL } = useI18n();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <Clock className="mx-auto h-16 w-16 text-yellow-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {t('account.pending.title')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('account.pending.message')}
            </p>
            <div className="mt-6">
              <button
                onClick={handleLogout}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

