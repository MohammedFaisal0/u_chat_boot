// app/global-error.js
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
} from "@/components/ui/uis";

export default function GlobalError({ error, reset }) {
  const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error:", error);
  }, [error]);

  let errorMessage = "An unexpected error occurred.";
  let action = (
    <Button onClick={reset} variant="outline">
      Try again
    </Button>
  );

  // Handle specific error types
  switch (error.message) {
    case "please log in":
      errorMessage = "Please log in to access this area.";
      action = (
        <Link href="/login">
          <Button variant="outline">Go to Login</Button>
        </Link>
      );
      break;
    case "access denied":
      errorMessage = "You don't have permission to access this area.";
      action = (
        <>
          <Button
            variant="outline"
            onClick={() => {
              router.back();
            }}
          >
            Go Back
          </Button>
          Or
          <Link href="/login">
            <Button variant="outline">Go to Login</Button>
          </Link>
        </>
      );
      break;
    // Add more specific error cases as needed
  }

  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="max-w-md w-full space-y-8">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
            <div className="flex justify-center">{action}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
