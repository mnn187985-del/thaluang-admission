"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@thaluang.ac.th");
  const [password, setPassword] = useState("admin1234");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "เข้าสู่ระบบไม่สำเร็จ");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRole = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("admin1234");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="relative w-20 h-20 mx-auto mb-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
          <Image
            src="/images/logo.png"
            alt="วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          ระบบจัดการรับสมัครเรียน (Admin Portal)
        </h2>
        <p className="mt-1 text-xs text-rose-300 font-medium">
          วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์ ๒๕๗๐
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-700/30 space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                อีเมลเจ้าหน้าที่
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@thaluang.ac.th"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white bg-rose-700 hover:bg-rose-800 font-semibold text-sm shadow-md transition-all disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบจัดการ"}</span>
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="pt-4 border-t border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block mb-2 text-center">
              บัญชีทดสอบเริ่มต้น (คลิกเพื่อเลือกทันที):
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <button
                type="button"
                onClick={() => handleSelectRole("admin@thaluang.ac.th")}
                className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-[11px] font-medium border border-slate-200 transition-colors"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleSelectRole("registrar@thaluang.ac.th")}
                className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-[11px] font-medium border border-slate-200 transition-colors"
              >
                งานทะเบียน
              </button>
              <button
                type="button"
                onClick={() => handleSelectRole("viewer@thaluang.ac.th")}
                className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-[11px] font-medium border border-slate-200 transition-colors"
              >
                ผู้บริหาร
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2 font-mono">
              รหัสผ่านเริ่มต้น: admin1234
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
