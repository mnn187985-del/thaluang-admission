"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  BarChart3, 
  Settings, 
  LogOut, 
  Shield, 
  FileText,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { AdminSession } from "@/lib/auth";

interface Props {
  session: AdminSession | null;
}

export default function AdminNavClient({ session }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, don't render sidebar
  if (pathname === "/admin/login") {
    return null;
  }

  // If not logged in, redirect to login
  useEffect(() => {
    if (!session) {
      router.push("/admin/login");
    }
  }, [session, router]);

  if (!session) return null;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { href: "/admin", label: "ภาพรวมระบบ (Dashboard)", icon: LayoutDashboard },
    { href: "/admin/applicants", label: "จัดการผู้สมัคร", icon: Users },
    { href: "/admin/enrollment", label: "ระบบมอบตัวนักศึกษา", icon: UserCheck },
    { href: "/admin/analytics", label: "สถิติและรายงาน", icon: BarChart3 },
    { href: "/admin/settings", label: "ตั้งค่าระบบ", icon: Settings },
  ];

  const roleLabels: Record<string, string> = {
    super_admin: "Super Admin",
    registrar: "เจ้าหน้าที่งานทะเบียน",
    viewer: "ผู้บริหาร (ดูผลอย่างเดียว)",
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative">
            <Image
              src="/images/logo.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-sm">วิทยาลัยเทคนิคท่าหลวงฯ</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col justify-between border-r border-slate-800 z-30`}
      >
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-sm leading-tight">
                  ระบบรับสมัคร ๒๕๗๐
                </span>
                <span className="text-[11px] text-rose-400 font-medium">
                  วท.ท่าหลวงซิเมนต์ไทยฯ
                </span>
              </div>
            </div>
          </div>

          {/* User Profile Badge */}
          <div className="p-4 mx-3 my-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-xs font-semibold text-white truncate">
                {session.fullName}
              </span>
            </div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-rose-950/80 text-rose-300 border border-rose-800/50">
              {roleLabels[session.role] || session.role}
            </span>
          </div>

          {/* Nav Items */}
          <nav className="px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-rose-700 text-white shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>ดูหน้าเว็บผู้สมัคร</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>
    </>
  );
}
