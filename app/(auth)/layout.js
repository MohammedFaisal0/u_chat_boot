import React from "react";
import { Footer, Header } from "@/components/landing";

export default function LandingLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
