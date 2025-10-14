// app/student/layout.jsx
import { cookies } from "next/headers";
import { verifyAuth, useAuth } from "@/lib/auth";

import { Sidebar, Header, Footer } from "@/components/common";
import AuthProvider from "@/lib/AuthProvider";

export default async function StudentLayout({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return <div>Please log in</div>;
  }

  try {
    const payload = await verifyAuth(token.value);
    const { studentId, accountType } = payload;
    console.log(payload);

    if (accountType !== "student" || !studentId) {
      return <div>Access denied. Student account required.</div>;
    }

    return (
      <AuthProvider accountId={studentId}>
        <div className="min-h-screen bg-[#d7e7fd] relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-[#f8fafc]/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#dbeafe]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative z-10 flex h-screen">
            <Sidebar userType="student" />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-x-hidden overflow-y-auto">
                <div className="h-full p-4 pt-6">{children}</div>
              </main>
            </div>
          </div>
        </div>
      </AuthProvider>
    );
  } catch (error) {
    console.error("Authentication failed:", error);
    return <div>Authentication failed</div>;
  }
}
