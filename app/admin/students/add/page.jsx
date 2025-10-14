// app/admin/students/add/page.jsx
import StudentForm from "@/components/admin/StudentForm";

export const metadata = {
  title: "Add Student | Admin Panel",
  description: "Add a new student to the system",
};

export default function AddStudentPage() {
  return (
    <div className="px-4 py-5 sm:p-6">
      
      <StudentForm />
    </div>
  );
}
