"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  Eye, 
  Printer, 
  CheckSquare, 
  Square, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { Applicant, ApplicantStatus, Major } from "@/types";
import { STATUS_MAP, LEVEL_MAP, formatThaiDate, maskCitizenId } from "@/lib/utils";
import { THAI_PROVINCES } from "@/data/thai-address";

export default function AdminApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [total, setTotal] = useState(0);
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");
  const [majorId, setMajorId] = useState("all");
  const [status, setStatus] = useState("all");
  const [province, setProvince] = useState("all");
  const [page, setPage] = useState(1);

  // Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<ApplicantStatus>("passed");
  const [bulkReason, setBulkReason] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);

  // Load Majors for filter
  useEffect(() => {
    fetch("/api/majors")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) setMajors(res.data);
      });
  }, []);

  // Fetch applicants
  const fetchApplicants = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (level !== "all") params.set("level", level);
    if (majorId !== "all") params.set("major_id", majorId);
    if (status !== "all") params.set("status", status);
    if (province !== "all") params.set("province", province);
    params.set("page", String(page));
    params.set("limit", "25");

    fetch(`/api/admin/applicants?${params.toString()}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setApplicants(res.applicants);
          setTotal(res.total);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplicants();
  }, [search, level, majorId, status, province, page]);

  // Bulk select handlers
  const handleSelectAll = () => {
    if (selectedIds.length === applicants.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applicants.map((a) => a.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Submit Bulk Update
  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;

    setBulkLoading(true);
    try {
      const res = await fetch("/api/admin/applicants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantIds: selectedIds,
          status: bulkStatus,
          reason: bulkReason || `เปลี่ยนสถานะเป็นกลุ่ม (${bulkStatus})`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "เกิดข้อผิดพลาด");
      }

      setBulkModalOpen(false);
      setSelectedIds([]);
      setBulkReason("");
      fetchApplicants();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            จัดการรายชื่อผู้สมัคร
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ค้นหา ตรวจสอบเอกสาร แก้ไขข้อมูล และเปลี่ยนสถานะผู้สมัคร
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={() => setBulkModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-700 text-white text-xs font-bold shadow hover:bg-rose-800 transition-all"
            >
              <CheckSquare className="w-4 h-4" />
              <span>จัดการกลุ่ม ({selectedIds.length} คน)</span>
            </button>
          )}

          <a
            href="/api/admin/export?format=xlsx"
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </a>

          <a
            href="/api/admin/export?format=csv"
            download
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>CSV (BOM)</span>
          </a>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search box */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="ค้นหาชื่อ, เลขใบสมัคร, เลข ปชช..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Level Filter */}
          <div>
            <select
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800"
            >
              <option value="all">ทุกระดับชั้น</option>
              <option value="pvc">ระดับ ปวช.</option>
              <option value="pvs_direct">ระดับ ปวส. (สายตรง)</option>
              <option value="pvs_cross">ระดับ ปวส. (ม.6/ต่างสาขา)</option>
            </select>
          </div>

          {/* Major Filter */}
          <div>
            <select
              value={majorId}
              onChange={(e) => {
                setMajorId(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 truncate"
            >
              <option value="all">ทุกสาขาวิชา</option>
              {majors.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.level === "pvc" ? "ปวช." : "ปวส."})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="pending">รอตรวจสอบ</option>
              <option value="incomplete">เอกสารไม่ครบ</option>
              <option value="passed">ผ่านการคัดเลือก</option>
              <option value="rejected">ไม่ผ่านการคัดเลือก</option>
              <option value="enrolled">มอบตัวแล้ว</option>
            </select>
          </div>

          {/* Province Filter */}
          <div>
            <select
              value={province}
              onChange={(e) => {
                setProvince(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800"
            >
              <option value="all">ทุกจังหวัด</option>
              {THAI_PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status count indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>พบข้อมูลผู้สมัครทั้งหมด <strong>{total}</strong> รายการ</span>
          {(search || level !== "all" || majorId !== "all" || status !== "all" || province !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setLevel("all");
                setMajorId("all");
                setStatus("all");
                setProvince("all");
                setPage(1);
              }}
              className="text-rose-600 hover:underline text-[11px]"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      </div>

      {/* Applicant Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={applicants.length > 0 && selectedIds.length === applicants.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-rose-600 rounded border-slate-300"
                  />
                </th>
                <th className="py-3 px-3">เลขที่ใบสมัคร</th>
                <th className="py-3 px-3">ชื่อ-นามสกุล</th>
                <th className="py-3 px-3">ระดับ</th>
                <th className="py-3 px-3">สาขาวิชา</th>
                <th className="py-3 px-3">โรงเรียนเดิม</th>
                <th className="py-3 px-3 text-center">GPAX</th>
                <th className="py-3 px-3">สถานะ</th>
                <th className="py-3 px-3 text-center">เอกสาร</th>
                <th className="py-3 px-3 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-400">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : applicants.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-400">
                    ไม่พบข้อมูลผู้สมัครที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              ) : (
                applicants.map((a) => {
                  const st = STATUS_MAP[a.status];
                  const isSelected = selectedIds.includes(a.id);
                  return (
                    <tr
                      key={a.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isSelected ? "bg-rose-50/40" : ""
                      }`}
                    >
                      <td className="py-3.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(a.id)}
                          className="w-4 h-4 text-rose-600 rounded border-slate-300"
                        />
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                        {a.application_no}
                      </td>
                      <td className="py-3.5 px-3 font-medium text-slate-900">
                        <div>{a.title} {a.first_name} {a.last_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {maskCitizenId(a.id_card_number)}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-medium text-slate-700">
                          {LEVEL_MAP[a.level_type]}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-800">
                        {a.target_major_name}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 truncate max-w-[150px]" title={a.school_name}>
                        {a.school_name}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-900">
                        {a.gpax}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${st.bg} ${st.text} ${st.border}`}
                        >
                          {st.label}
                        </span>
                        {a.enrollment && (
                          <span className="block text-[10px] text-blue-600 font-mono mt-0.5">
                            ID: {a.enrollment.student_id}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                          {a.documents?.length || 0} ฉบับ
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                        <Link
                          href={`/admin/applicants/${a.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-[11px] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>ตรวจ</span>
                        </Link>
                        <Link
                          href={`/print/${a.id}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-[11px] transition-colors"
                          title="พิมพ์ใบสมัคร A4"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Action Modal */}
      {bulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                เปลี่ยนสถานะผู้สมัครเป็นกลุ่ม ({selectedIds.length} รายการ)
              </h3>
              <button
                onClick={() => setBulkModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBulkSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  เลือกสถานะใหม่ที่ต้องการเปลี่ยน *
                </label>
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value as ApplicantStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="passed">ผ่านการคัดเลือก (โควตา)</option>
                  <option value="pending">รอการตรวจสอบ</option>
                  <option value="incomplete">เอกสารไม่สมบูรณ์ (ขอเอกสารเพิ่ม)</option>
                  <option value="rejected">ไม่ผ่านการคัดเลือก</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  หมายเหตุ / เหตุผล (จะบันทึกลง Audit Log)
                </label>
                <textarea
                  value={bulkReason}
                  onChange={(e) => setBulkReason(e.target.value)}
                  placeholder="เช่น ผ่านการพิจารณาคุณสมบัติรอบแรก หรือ เอกสารไม่ชัดเจน"
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setBulkModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={bulkLoading}
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-rose-700 hover:bg-rose-800 text-white shadow"
                >
                  {bulkLoading ? "กำลังดำเนินการ..." : "ยืนยันการเปลี่ยนสถานะ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
