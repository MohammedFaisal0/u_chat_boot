// app/api/accounts/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import bcrypt from "bcryptjs";
import Account from "@/models/Account";
import Admin from "@/models/Admin";
import Student from "@/models/Student";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;
    
    let query = {};
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: "i" } },
        { accountType: { $regex: search, $options: "i" } },
      ];
    }
    if (status) {
      query.status = status;
    }

    const [accounts, total] = await Promise.all([
      Account.find(query)
        .select("-password -__v")
        .populate('approved_by', 'name')
        .skip(skip)
        .limit(limit)
        .lean(),
      Account.countDocuments(query),
    ]);

    return NextResponse.json({
      accounts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAccounts: total,
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // Create base account
    const savedAccount = await new Account({
      accountNo: await generateUniqueAccountNo(),
      accountType: body.accountType,
      userName: body.userName,
      password: hashedPassword,
    }).save();

    // If admin, create Admin profile
    if (body.accountType === "admin" && body.adminData?.name) {
      const newAdminId = await generateUniqueAdminNo();
      await new Admin({
        account: savedAccount._id,
        name: body.adminData.name,
        id: newAdminId,
        email: body.adminData.email || undefined,
      }).save();
    }

    // If student, create Student profile
    if (body.accountType === "student" && body.studentData) {
      const academicId = await generateUniqueAcademicId();
      await new Student({
        academic_id: academicId,
        name: body.studentData.name,
        gender: body.studentData.gender,
        address: body.studentData.address,
        phone: body.studentData.phone,
        email: body.studentData.email,
        major: body.studentData.major,
        account: savedAccount._id,
      }).save();
    }

    // Faculty: no extra profile needed right now (accountType = 'faculty')

    const accountToReturn = savedAccount.toObject();
    delete accountToReturn.password;
    return NextResponse.json(accountToReturn, { status: 201 });
  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -__v");

    if (!updatedAccount) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function generateUniqueAdminNo() {
  const lastAdmin = await Admin.findOne().sort("-id");
  if (!lastAdmin) return 1000;
  const lastNum = parseInt(String(lastAdmin.id).replace(/\D/g, "")) || 1000;
  return lastNum + 1;
}
async function generateUniqueAccountNo() {
  const lastAccount = await Account.findOne().sort("-accountNo");
  return lastAccount ? lastAccount.accountNo + 1 : 1000; // Start from 1000 if no accounts exist
}
async function generateUniqueAcademicId() {
  const lastStudent = await Student.findOne().sort("-academic_id");
  const lastId = lastStudent ? parseInt(String(lastStudent.academic_id).slice(3)) : 0;
  return `STU${(lastId + 1).toString().padStart(5, "0")}`;
}
