import Link from "next/link";
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Download, 
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  GraduationCap
} from "lucide-react";
import { getDashboardStats, listApplicants } from "@/lib/db";
import { STATUS_MAP, LEVEL_MAP, formatThaiDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const { applicants: recentApplicants } = await listApplicants({ limit: 5 });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            แดชบอร์ดภาพรวมระบบรับสมัคร
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์ ประจำปีการศึกษา ๒๕๗๐ (รอบโควตา / กรณีพิเศษ)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/admin/export?format=xlsx"
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>ดาวน์โหลด Excel</span>
          </a>
          <a
            href="/api/admin/export?format=csv"
            download
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>CSV (BOM)</span>
          </a>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">ผู้สมัครทั้งหมด</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-slate-900">{stats.statusCounts.total}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">คนในระบบ</div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-600">รอตรวจสอบ</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-amber-600">{stats.statusCounts.pending}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">รอเจ้าหน้าที่ตรวจ</div>
          </div>
        </div>

        {/* Incomplete */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-600">เอกสารไม่ครบ</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-rose-600">{stats.statusCounts.incomplete}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">แจ้งผู้สมัครแก้ไข</div>
          </div>
        </div>

        {/* Passed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-600">ผ่านการคัดเลือก</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-emerald-600">{stats.statusCounts.passed}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">มีสิทธิ์มอบตัว</div>
          </div>
        </div>

        {/* Enrolled */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-600">มอบตัวแล้ว</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-blue-600">{stats.statusCounts.enrolled}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">ออกรหัส นศ. แล้ว</div>
          </div>
        </div>
      </div>

      {/* Level Breakdown & Quota Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Breakdown by Level */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-rose-700" />
            <span>สัดส่วนตามระดับการศึกษา</span>
          </h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>ระดับ ปวช.</span>
                <span className="font-bold">{stats.levelCounts.pvc} คน</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-rose-600 h-2 rounded-full"
                  style={{ width: `${stats.statusCounts.total ? (stats.levelCounts.pvc / stats.statusCounts.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>ระดับ ปวส. (สายตรง)</span>
                <span className="font-bold">{stats.levelCounts.pvs_direct} คน</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full"
                  style={{ width: `${stats.statusCounts.total ? (stats.levelCounts.pvs_direct / stats.statusCounts.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>ระดับ ปวส. (ม.6/ต่างสาขา)</span>
                <span className="font-bold">{stats.levelCounts.pvs_cross} คน</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${stats.statusCounts.total ? (stats.levelCounts.pvs_cross / stats.statusCounts.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/analytics"
              className="text-xs text-rose-700 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>ดูกราฟและสถิติเชิงลึก</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quota Fill Summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>ยอดผู้สมัครรายสาขาวิชา (ตัวอย่างยอดนิยม)</span>
            </h2>
            <Link
              href="/admin/applicants"
              className="text-xs text-rose-700 font-medium hover:underline"
            >
              ดูทั้งหมด
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stats.majorStats.slice(0, 6).map((m) => (
              <div key={m.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex justify-between items-start text-xs font-medium text-slate-800 mb-1">
                  <span className="truncate pr-2">{m.name}</span>
                  <span className="font-mono font-bold text-rose-700">{m.applicant_count}/{m.quota_limit}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full"
                    style={{ width: `${Math.min(m.percentage, 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                  <span>{m.level === "pvc" ? "ปวช." : "ปวส."}</span>
                  <span>{m.percentage}% ของโควตา</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Applicants Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">ผู้สมัครล่าสุด</h2>
            <p className="text-xs text-slate-500">รายชื่อผู้ยื่นใบสมัครออนไลน์ล่าสุดในระบบ</p>
          </div>
          <Link
            href="/admin/applicants"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800"
          >
            <span>ดูรายชื่อผู้สมัครทั้งหมด</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">เลขที่ใบสมัคร</th>
                <th className="py-3 px-4">ชื่อ-นามสกุล</th>
                <th className="py-3 px-4">ระดับ</th>
                <th className="py-3 px-4">สาขาวิชา</th>
                <th className="py-3 px-4">GPAX</th>
                <th className="py-3 px-4">สถานะ</th>
                <th className="py-3 px-4">วันที่สมัคร</th>
                <th className="py-3 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentApplicants.map((a) => {
                const st = STATUS_MAP[a.status];
                return (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {a.application_no}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {a.title} {a.first_name} {a.last_name}
                    </td>
                    <td className="py-3.5 px-4">
                      {LEVEL_MAP[a.level_type]}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {a.target_major_name}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      {a.gpax}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${st.bg} ${st.text} ${st.border}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {formatThaiDate(a.created_at, { shortMonth: true })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/applicants/${a.id}`}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-[11px] transition-colors"
                      >
                        ตรวจข้อมูล
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
