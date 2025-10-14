// app/admin/students/layout.jsx
import Link from "next/link";
import { PlusCircle, List, Upload } from "lucide-react";
import PageLayout from "@/components/common/PageLayout";

export const metadata = {
  title: "Users Management | Admin Panel",
  description: "Manage Users in the admin panel",
};

export default function UsersLayout({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}
