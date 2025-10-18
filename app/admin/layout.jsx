import { Header, Sidebar, Footer } from "@/components/common";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";
import AuthProvider from "@/lib/AuthProvider";
import { redirect } from "next/navigation";

export default async function adminlayout({ children }) {
  const cookiestore = cookies();
  const token = cookiestore.get("token");
 // console.log("Token from cookies:", token);

  if (!token) {
   // console.log("No token found, redirecting to login");
    redirect("/login");
  }

  try {
   // console.log("Verifying token:", token.value);
    const payload = await verifyAuth(token.value);
   // console.log("Token verified successfully. Payload:", payload);
    
    const { accountType, accountId } = payload;
   // console.log("AccountType:", accountType, "AccountId:", accountId);

    if (!accountId) {
     // console.log("Access denied - no accountId in payload");
      redirect("/login");
    }

    if (accountType !== "admin") {
     //  console.log("Access denied - not admin, accountType is:", accountType);
      redirect("/login");
    }

   // console.log("Admin access granted, rendering dashboard");

    return (
      <AuthProvider accountId={accountId}>
        <div className="flex h-screen bg-gray-100">
          <Sidebar userType="admin" userName={payload.userName || "Admin"} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header userType="admin" userName={payload.userName || "Admin"} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
              <div className="container mx-auto px-2">{children}</div>
            </main>
            <Footer />
          </div>
        </div>
      </AuthProvider>
    );
  } catch (error) {
    console.error("Auth error:", error);
    redirect("/login");
  }
}
