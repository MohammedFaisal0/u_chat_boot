"use client";

import ManageIssues from "@/components/student/ManageIssues";
import { useAuth } from "@/lib/AuthProvider";

export default function IssuesPage() {
  const { accountId } = useAuth();
  
  return <ManageIssues accountId={accountId} />;
}