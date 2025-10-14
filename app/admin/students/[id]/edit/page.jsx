import StudentForm from "@/components/admin/StudentForm";
import React from "react";

export default function page({ params }) {
  const studentId = params.id;
  return (
    <>
      <StudentForm studentId={studentId} />
    </>
  );
}
