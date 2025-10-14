// app/api/users/[id]/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Account from "@/models/Account";
import Admin from "@/models/Admin";
import Student from "@/models/Student";
import Issue from "@/models/Issue";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const account = await Account.findById(id).select("-password");
    if (!account) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let userData = account.toObject();

    if (account.accountType === "admin") {
      const adminData = await Admin.findOne({ account: id }).lean();
      if (adminData) {
        userData = { ...userData, adminData };
      }
    } else if (account.accountType === "student") {
      const studentData = await Student.findOne({ account: id }).lean();
      if (studentData) {
        const issues = await Issue.find({ student: studentData._id }).lean();

        userData = {
          ...userData,
          studentData: {
            ...studentData,
            issues,
          },
        };
      }
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ... (keep the existing PUT and DELETE methods as they are)

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id } = params;

    // Update the Account
    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { $set: { userName: body.userName, accountType: body.accountType } },
      { new: true }
    ).select("-password");

    if (!updatedAccount) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the corresponding Admin or Student document
    if (updatedAccount.accountType === "admin") {
      await Admin.findOneAndUpdate(
        { account: id },
        { $set: { name: body.name } },
        { upsert: true }
      );
    } else if (updatedAccount.accountType === "student") {
      await Student.findOneAndUpdate(
        { account: id },
        {
          $set: {
            name: body.name,
            email: body.email,
            gender: body.gender,
            address: body.address,
            phone: body.phone,
            major: body.major,
          },
        },
        { upsert: true }
      );
    }

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const deletedAccount = await Account.findByIdAndDelete(id);
    if (!deletedAccount) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete the corresponding Admin or Student document
    if (deletedAccount.accountType === "admin") {
      await Admin.findOneAndDelete({ account: id });
    } else if (deletedAccount.accountType === "student") {
      await Admin.findOneAndDelete({ account: id });
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
