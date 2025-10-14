import React from "react";
import { Inter } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Naseeh - جامعة الإمام محمد بن سعود الإسلامية",
  description: "منصة بوت ذكي مدعوم بالذكاء الاصطناعي لطلاب الجامعة",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
