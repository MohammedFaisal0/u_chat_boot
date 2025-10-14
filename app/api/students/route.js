// app/api/students/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import Account from "@/models/Account";
import bcrypt from "bcryptjs";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const [students, total] = await Promise.all([
      Student.find(query)
        .select("-__v")
        .populate("account", "accountNo accountType userName")
        .skip(skip)
        .limit(limit)
        .lean(),
      Student.countDocuments(query),
    ]);

    return NextResponse.json({
      students,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalStudents: total,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
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

    // Create a new account
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      body.password || "defaultPassword",
      salt
    );

    const newAccount = new Account({
      accountNo: await generateUniqueAccountNo(),
      accountType: "student",
      userName: body.email,
      password: hashedPassword,
    });

    const savedAccount = await newAccount.save();

    // Create a new student with a reference to the account
    const newStudent = new Student({
      academic_id: await generateUniqueAcademicId(),
      name: body.name,
      gender: body.gender,
      address: body.address,
      phone: body.phone,
      email: body.email,
      major: body.major,
      account: savedAccount._id,
    });

    const savedStudent = await newStudent.save();

    return NextResponse.json(savedStudent, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

async function generateUniqueAccountNo() {
  const lastAccount = await Account.findOne().sort("-accountNo");
  return lastAccount ? lastAccount.accountNo + 1 : 1000; // Start from 1000 if no accounts exist
}

async function generateUniqueAcademicId() {
  const lastStudent = await Student.findOne().sort("-academic_id");
  const lastId = lastStudent ? parseInt(lastStudent.academic_id.slice(3)) : 0;
  return `STU${(lastId + 1).toString().padStart(5, "0")}`;
}
