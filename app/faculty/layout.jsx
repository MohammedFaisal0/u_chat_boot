// app/faculty/layout.jsx
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";
import { Sidebar, Header, Footer } from "@/components/common";
import AuthProvider from "@/lib/AuthProvider";

export default async function FacultyLayout({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  if (!token) return <div>Please log in</div>;
  try {
    const payload = await verifyAuth(token.value);
    if (payload.accountType !== "faculty") return <div>Access denied.</div>;
    return (
      <AuthProvider accountId={payload.id}>
        <div className="flex h-screen bg-gray-100">
          <Sidebar userType="faculty" />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header userType="faculty" />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
              <div className="container mx-auto px-2">{children}</div>
            </main>
            <Footer />
          </div>
        </div>
      </AuthProvider>
    );
  } catch (e) {
    return <div>Authentication failed</div>;
  }
}



