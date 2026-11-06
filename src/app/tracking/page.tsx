"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Search, 
  FileText, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  XCircle, 
  Upload, 
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Calendar,
  UserCheck
} from "lucide-react";
import { Applicant, ApplicantStatus, DocumentType } from "@/types";
import { STATUS_MAP, LEVEL_MAP, formatThaiDate, maskCitizenId, DOCUMENT_TYPE_MAP } from "@/lib/utils";

function TrackingContent() {
  const searchParams = useSearchParams();
  const defaultId = searchParams.get("id") || "";

  const [idCardNumber, setIdCardNumber] = useState(defaultId);
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Re-upload state
  const [reuploadDocType, setReuploadDocType] = useState<DocumentType>("transcript");
  const [reuploadFile, setReuploadFile] = useState<File | null>(null);
  const [reuploading, setReuploading] = useState(false);
  const [reuploadSuccess, setReuploadSuccess] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!idCardNumber || !birthDate) {
      setErrorMsg("กรุณากรอกเลขประจำตัวประชาชน 13 หลัก และเลือกวันเกิด");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setReuploadSuccess(null);

    try {
      const res = await fetch("/api/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idCardNumber: idCardNumber.replace(/\D/g, ""),
          birthDate,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "ไม่พบข้อมูลการสมัคร");
      }

      setApplicant(data.applicant);
    } catch (err: any) {
      setApplicant(null);
      setErrorMsg(err.message || "เกิดข้อผิดพลาดในการค้นหา");
    } finally {
      setLoading(false);
    }
  };

  // Handle re-uploading incomplete document
  const handleReupload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicant || !reuploadFile) return;

    setReuploading(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("applicant_id", applicant.id);
      formData.append("document_type", reuploadDocType);
      formData.append("file", reuploadFile);

      const res = await fetch("/api/tracking/reupload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "อัปโหลดเอกสารไม่สำเร็จ");
      }

      setReuploadSuccess("อัปโหลดเอกสารใหม่เรียบร้อยแล้ว เจ้าหน้าที่จะทำการตรวจสอบข้อมูลอีกครั้ง");
      setReuploadFile(null);
      
      // Refresh applicant data
      handleSearch();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setReuploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                เลขประจำตัวประชาชน ๑๓ หลัก *
              </label>
              <input
                type="text"
                value={idCardNumber}
                onChange={(e) => setIdCardNumber(e.target.value)}
                placeholder="เช่น 1100200345678"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                วันเดือนปีเกิด (ตามที่ระบุในใบสมัคร) *
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              * ข้อมูลปลอดภัยตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)
            </span>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-700 text-white font-semibold text-sm hover:bg-rose-800 shadow transition-all disabled:opacity-50"
            >
              {loading ? <Clock className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>ค้นหาข้อมูล</span>
            </button>
          </div>
        </form>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
          <div>
            <strong className="font-semibold">ผลการค้นหา:</strong> {errorMsg}
          </div>
        </div>
      )}

      {/* Applicant Result Card */}
      {applicant && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Status Header */}
            {(() => {
              const st = STATUS_MAP[applicant.status];
              return (
                <div className={`p-6 border-b ${st.border} ${st.bg} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block mb-1">สถานะใบสมัคร</span>
                    <div className="flex items-center gap-2">
                      {applicant.status === "passed" && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                      {applicant.status === "pending" && <Clock className="w-6 h-6 text-amber-600" />}
                      {applicant.status === "incomplete" && <AlertCircle className="w-6 h-6 text-rose-600" />}
                      {applicant.status === "rejected" && <XCircle className="w-6 h-6 text-slate-500" />}
                      {applicant.status === "enrolled" && <UserCheck className="w-6 h-6 text-blue-600" />}
                      <span className={`text-xl font-bold ${st.text}`}>{st.label}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 block">เลขที่ใบสมัคร</span>
                      <span className="font-mono font-bold text-lg text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">
                        {applicant.application_no}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Remarks if any */}
            {applicant.admin_remark && (
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs sm:text-sm text-slate-700">
                <strong className="text-slate-900">หมายเหตุจากเจ้าหน้าที่:</strong> {applicant.admin_remark}
              </div>
            )}

            {/* Applicant Info Summary */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">ชื่อ-นามสกุล</span>
                  <span className="font-semibold text-slate-800">
                    {applicant.title} {applicant.first_name} {applicant.last_name}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block">เลขประจำตัวประชาชน</span>
                  <span className="font-mono text-slate-800">
                    {maskCitizenId(applicant.id_card_number)}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block">ระดับที่สมัคร</span>
                  <span className="font-semibold text-slate-800">
                    {LEVEL_MAP[applicant.level_type]}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block">สาขาวิชาที่สมัคร</span>
                  <span className="font-semibold text-rose-800">
                    {applicant.target_major_name}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block">โรงเรียนเดิม</span>
                  <span className="text-slate-700">{applicant.school_name}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-400 block">ผลการเรียนเฉลี่ยสะสม (GPAX)</span>
                  <span className="font-semibold text-slate-900 font-mono">{applicant.gpax}</span>
                </div>
              </div>

              {/* Enrollment Badge if Enrolled */}
              {applicant.enrollment && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">ข้อมูลการมอบตัวและเลขประจำตัวนักเรียน</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-200 text-blue-900">
                      มอบตัวแล้ว
                    </span>
                  </div>
                  <div className="text-xs pt-1">
                    รหัสนักเรียน/นักศึกษา: <span className="font-mono font-bold text-base text-blue-950">{applicant.enrollment.student_id}</span>
                  </div>
                  <div className="text-xs text-blue-700">
                    วันที่มอบตัว: {formatThaiDate(applicant.enrollment.enrollment_date)} | ผู้ปกครอง: {applicant.enrollment.guardian_name}
                  </div>
                </div>
              )}

              {/* Action Buttons: Print PDF */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                <Link
                  href={`/print/${applicant.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-700 text-white hover:bg-rose-800 text-sm font-semibold shadow-sm transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>พิมพ์ / ดาวน์โหลดใบสมัคร (A4 PDF)</span>
                </Link>

                {(applicant.status === "passed" || applicant.status === "enrolled") && (
                  <Link
                    href={`/print/enrollment/${applicant.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 text-white hover:bg-blue-800 text-sm font-semibold shadow-sm transition-all"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>พิมพ์ใบรายงานตัว / มอบตัว (PDF)</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Incomplete Document Re-upload Section */}
          {applicant.status === "incomplete" && (
            <div className="bg-white rounded-2xl border-2 border-rose-200 shadow-sm p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-rose-800">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-base">ส่งเอกสารเพิ่มเติม / แก้ไขเอกสาร</h3>
              </div>
              <p className="text-xs text-slate-600">
                เนื่องจากเจ้าหน้าที่แจ้งว่าเอกสารของท่านไม่ครบถ้วนหรือไม่ชัดเจน กรุณาแนบไฟล์เอกสารที่ถูกต้องด้านล่างนี้
              </p>

              {reuploadSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{reuploadSuccess}</span>
                </div>
              )}

              <form onSubmit={handleReupload} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      เลือกประเภทเอกสารที่จะแก้ไข *
                    </label>
                    <select
                      value={reuploadDocType}
                      onChange={(e) => setReuploadDocType(e.target.value as DocumentType)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                    >
                      <option value="transcript">เอกสารแสดงผลการเรียน ๕ ภาคเรียน (ปพ.๑)</option>
                      <option value="id_card_house_reg">สำเนาบัตรประชาชน / สำเนาทะเบียนบ้าน</option>
                      <option value="certificate">สำเนาเกียรติบัตร / ผลงาน</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      เลือกไฟล์เอกสารใหม่ (JPG, PNG, PDF ขนาดไม่เกิน 5MB) *
                    </label>
                    <input
                      type="file"
                      accept=".pdf,image/png,image/jpeg"
                      onChange={(e) => setReuploadFile(e.target.files?.[0] || null)}
                      required
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={reuploading || !reuploadFile}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition-all disabled:opacity-50"
                >
                  {reuploading ? <Clock className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>อัปโหลดเอกสารแก้ไข</span>
                </button>
              </form>
            </div>
          )}

          {/* Audit History Timeline */}
          {applicant.history && applicant.history.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                ประวัติการดำเนินการ (Timeline)
              </h3>
              <div className="space-y-4">
                {applicant.history.map((h, idx) => (
                  <div key={h.id || idx} className="flex items-start gap-3 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-600 mt-1 flex-shrink-0 ring-4 ring-rose-100" />
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">
                          {STATUS_MAP[h.to_status]?.label || h.to_status}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {new Date(h.created_at).toLocaleDateString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {h.reason && <p className="text-slate-600">{h.reason}</p>}
                      <span className="text-[10px] text-slate-400">โดย: {h.changed_by_name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold mb-2">
            <Search className="w-3.5 h-3.5" />
            <span>ระบบตรวจสอบผลการสมัครและดาวน์โหลดเอกสาร</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            ตรวจสอบสถานะการสมัครเรียน
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์ ประจำปีการศึกษา ๒๕๗๐
          </p>
        </div>

        <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">กำลังโหลดระบบ...</div>}>
          <TrackingContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
