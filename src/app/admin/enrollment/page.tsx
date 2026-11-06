import Link from "next/link";
import { UserCheck, CheckCircle2, Clock, Printer, ArrowRight } from "lucide-react";
import { listApplicants } from "@/lib/db";
import { LEVEL_MAP, formatThaiDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminEnrollmentPage() {
  const { applicants: passedApplicants } = await listApplicants({ status: "passed", limit: 100 });
  const { applicants: enrolledApplicants } = await listApplicants({ status: "enrolled", limit: 100 });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          ระบบบันทึกการมอบตัวและออกรหัสนักศึกษา
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          จัดการบันทึกผู้ปกครอง พยาน และออกรหัสประจำตัวนักเรียน นักศึกษาใหม่ ประจำปีการศึกษา ๒๕๗๐
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Box 1: ผ่านการคัดเลือก (รอรายงานตัว/มอบตัว) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
            <div>
              <h2 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ผู้ผ่านการคัดเลือก (รอรายงานตัว/มอบตัว)</span>
              </h2>
              <span className="text-xs text-emerald-700">มีสิทธิ์มอบตัว {passedApplicants.length} คน</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[500px]">
            {passedApplicants.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                ไม่มีผู้สมัครที่รอรายงานตัวมอบตัวในขณะนี้
              </div>
            ) : (
              passedApplicants.map((a) => (
                <div key={a.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-900 block">{a.application_no}</span>
                    <span className="font-semibold text-slate-800">{a.title} {a.first_name} {a.last_name}</span>
                    <span className="text-[11px] text-slate-500 block">
                      {LEVEL_MAP[a.level_type]} • {a.target_major_name}
                    </span>
                  </div>

                  <Link
                    href={`/admin/applicants/${a.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-700 text-white font-semibold text-xs hover:bg-blue-800 shadow-sm"
                  >
                    <span>บันทึกมอบตัว</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Box 2: มอบตัวแล้ว (มีรหัสนักเรียนแล้ว) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
            <div>
              <h2 className="text-sm font-bold text-blue-950 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>รายงานตัวและมอบตัวแล้ว ({enrolledApplicants.length} คน)</span>
              </h2>
              <span className="text-xs text-blue-700">ออกรหัสนักเรียน/นักศึกษาเรียบร้อยแล้ว</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[500px]">
            {enrolledApplicants.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                ยังไม่มีผู้สมัครที่มอบตัวเรียบร้อยแล้ว
              </div>
            ) : (
              enrolledApplicants.map((a) => (
                <div key={a.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-sm text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                        {a.enrollment?.student_id}
                      </span>
                      <span className="font-semibold text-slate-900">{a.title} {a.first_name} {a.last_name}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      {a.target_major_name} • ผู้ปกครอง: {a.enrollment?.guardian_name || "-"}
                    </span>
                  </div>

                  <Link
                    href={`/print/enrollment/${a.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>พิมพ์ใบมอบตัว</span>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
