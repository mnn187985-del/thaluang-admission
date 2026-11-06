"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserCheck, FileText, Search, ShieldCheck, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "หน้าแรก", icon: null },
    { href: "/apply", label: "กรอกใบสมัครโควตา", icon: FileText },
    { href: "/tracking", label: "ตรวจสอบสถานะ", icon: Search },
    { href: "/admin", label: "สำหรับเจ้าหน้าที่", icon: ShieldCheck },
  ];

  const isAdminArea = pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & College Name */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์"
                fill
                sizes="56px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-sm sm:text-base leading-tight group-hover:text-rose-700 transition-colors">
                วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์
              </span>
              <span className="text-xs text-rose-700 font-medium">
                ระบบรับสมัครนักเรียน นักศึกษา รอบโควตา ๒๕๗๐
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href) && !isAdminArea);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-rose-50 text-rose-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/apply"
              className="ml-2 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-sm hover:shadow transition-all"
            >
              สมัครเรียนทันที
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-rose-50 text-rose-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-rose-600" />}
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
