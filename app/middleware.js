// middleware.js
import { NextResponse } from "next/server";
import { verifyAuth } from "./lib/auth";
import dbConnect from "./lib/db";
import Account from "./models/Account";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;

  const verifiedToken =
    token && (await verifyAuth(token).catch((err) => console.log(err)));

  if (request.nextUrl.pathname.startsWith("/admin") && !verifiedToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/student") && !verifiedToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/faculty") && !verifiedToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check account status for authenticated users
  if (verifiedToken && (verifiedToken.accountId || verifiedToken.id)) {
    try {
      await dbConnect();
      const accountId = verifiedToken.accountId || verifiedToken.id;
      const account = await Account.findById(accountId);
      
      if (account && account.status === "suspended") {
        // Redirect suspended users to a suspension page
        return NextResponse.redirect(new URL("/suspended", request.url));
      }
      
      if (account && account.status === "pending") {
        // Redirect pending users to a pending approval page
        return NextResponse.redirect(new URL("/pending", request.url));
      }
      
      if (account && account.status === "rejected") {
        // Redirect rejected users to a rejection page
        return NextResponse.redirect(new URL("/rejected", request.url));
      }
    } catch (error) {
      console.error("Error checking account status:", error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/faculty/:path*"],
};
