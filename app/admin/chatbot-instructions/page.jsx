// app/admin/chatbot-instructions/page.js
import React from "react";
import InstructionManagementClient from "@/components/admin/ManageInstructions";

export const metadata = {
  title: "Chatbot Instruction Management | Naseeh Admin",
  description:
    "Manage and update chatbot instructions for the Naseeh platform",
};

export default async function InstructionManagementPage() {
  return <InstructionManagementClient />;
}
