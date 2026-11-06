import type { Metadata } from "next";
import { Sarabun, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-sarabun",
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  weight: ["400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-noto-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ระบบรับสมัครเรียนออนไลน์ (โควตา ๒๕๗๐) | วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์",
  description: "ระบบรับสมัครนักเรียน นักศึกษาใหม่ รอบโควตาและกรณีพิเศษ ประจำปีการศึกษา ๒๕๗๐ วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${sarabun.variable} ${notoSansThai.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 antialiased selection:bg-rose-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
