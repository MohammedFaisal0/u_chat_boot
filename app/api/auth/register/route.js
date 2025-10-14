// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Account from "@/models/Account";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Check if user already exists
    const existingAccount = await Account.findOne({ userName: body.email });
    if (existingAccount) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Create a new account
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const newAccount = new Account({
      accountNo: await generateUniqueAccountNo(),
      accountType: "student",
      userName: body.email,
      password: hashedPassword,
    });

    const savedAccount = await newAccount.save();

    // Create a new student
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

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}

async function generateUniqueAccountNo() {
  const lastAccount = await Account.findOne().sort("-accountNo");
  return lastAccount ? lastAccount.accountNo + 1 : 1000;
}

async function generateUniqueAcademicId() {
  const lastStudent = await Student.findOne().sort("-academic_id");
  const lastId = lastStudent ? parseInt(lastStudent.academic_id.slice(3)) : 0;
  return `STU${(lastId + 1).toString().padStart(5, "0")}`;
}
