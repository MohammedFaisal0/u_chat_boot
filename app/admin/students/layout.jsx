// app/admin/students/layout.jsx
import Link from "next/link";
import { PlusCircle, List, Upload } from "lucide-react";
import PageLayout from "@/components/common/PageLayout";

export const metadata = {
  title: "Student Management | Admin Panel",
  description: "Manage students in the admin panel",
};

export default function StudentsLayout({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}
