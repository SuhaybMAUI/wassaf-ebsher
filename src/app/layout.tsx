import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Toaster } from "@/components/ui/sonner";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "وصّاف - نظام وصف الصور للمكفوفين",
  description: "نظام ذكي لوصف الصور للأشخاص المكفوفين وضعاف البصر مع إمكانية تدريب النموذج اللغوي",
  keywords: ["وصف الصور", "المكفوفين", "إمكانية الوصول", "WCAG", "الذكاء الاصطناعي"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans antialiased min-h-screen bg-background`}>
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
