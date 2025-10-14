// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Account from "@/models/Account";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
// import SecurityLogger from "@/lib/securityLogger"; // Removed - Security feature deleted

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();
    
    // Get client IP and user agent (removed security logging)
    const headers = request.headers;

    const account = await Account.findOne({ userName: email });
    console.log("Login attempt for:", email);
    console.log("Account found:", account ? "Yes" : "No");
    if (account) {
      console.log("Account type:", account.accountType);
      console.log("Account ID:", account._id);
    }
    if (!account) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Fetch the student record associated with this account
    const student = await Student.findOne({ account: account._id });
    if (!student && account.accountType === "student") {
      return NextResponse.json(
        { error: "Student record not found" },
        { status: 500 }
      );
    }

    const token = await signToken({
      id: account._id,
      accountType: account.accountType,
      studentId: student ? student._id : null,
      accountId: account._id,
      userName: account.userName,
    });
    console.log(token);

    // Login successful (removed security logging)

    const response = NextResponse.json({
      success: true,
      accountType: account.accountType,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    console.log("Login successful for:", email);
    console.log("Account type:", account.accountType);
    console.log("Token set in cookie");

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
