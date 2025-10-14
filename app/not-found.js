// app/not-found.js
"use client";
import Link from "next/link";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
} from "@/components/ui/uis";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full space-y-8">
        <Alert variant="warning">
          <AlertTitle>Page Not Found</AlertTitle>
          <AlertDescription>
            Oops! The page you're looking for doesn't exist.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center space-x-4">
          <Link href="/">
            <Button variant="outline">Go to Homepage</Button>
          </Link>
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
