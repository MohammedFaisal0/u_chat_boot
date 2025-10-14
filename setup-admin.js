// setup-admin.js - إضافة حساب الإدمن الافتراضي
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Account from "./app/models/Account.js";
import Admin from "./app/models/Admin.js";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

async function setupAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin account already exists
    const adminAccountId = "66cb8c34cea2ce63afcbebc7";
    const account = await Account.findById(adminAccountId);
    if (account) {
      console.log("Admin account already exists, skipping setup.");
      return;
    }

    console.log("Setting up admin account...");
    
    // Create Admin Account
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin", salt);
    const savedAccount = new Account({
      _id: adminAccountId,
      accountNo: 1111111,
      accountType: "admin",
      userName: "admin",
      password: hashedPassword,
    });
    await savedAccount.save();
    
    const admin = new Admin({
      account: savedAccount._id,
      name: "Administrator",
      id: adminAccountId,
    });
    await admin.save();
    
    console.log("Admin account setup completed successfully");
    console.log("Username: admin");
    console.log("Password: admin");
  } catch (error) {
    console.error("Setup failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

setupAdmin();
