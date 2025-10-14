import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Account from "@/models/Account";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";

export async function PATCH(request, { params }) {
  await dbConnect();
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifyAuth(token.value);
    
    if (payload.accountType !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();
    const { status, suspension_reason } = body;

    if (!["pending", "approved", "suspended", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updateData = { 
      status,
      updated_at: new Date()
    };

    // Set specific timestamps and admin based on status
    if (status === "approved") {
      updateData.approved_at = new Date();
      updateData.approved_by = payload.id;
    } else if (status === "suspended") {
      updateData.suspended_at = new Date();
      if (suspension_reason) {
        updateData.suspension_reason = suspension_reason;
      }
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate('approved_by', 'name');

    if (!updatedAccount) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Remove password from response
    const accountToReturn = updatedAccount.toObject();
    delete accountToReturn.password;

    return NextResponse.json(accountToReturn);
  } catch (error) {
    console.error("Error updating account status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

