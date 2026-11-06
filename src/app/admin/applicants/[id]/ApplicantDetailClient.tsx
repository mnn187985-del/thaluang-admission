"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  XCircle, 
  FileText, 
  Download, 
  Save, 
  UserCheck,
  ExternalLink,
  ShieldAlert,
  GraduationCap
} from "lucide-react";
import { Applicant, ApplicantStatus, DocumentType } from "@/types";
import { STATUS_MAP, LEVEL_MAP, formatThaiDate, DOCUMENT_TYPE_MAP, formatBytes } from "@/lib/utils";

interface Props {
  applicant: Applicant;
  currentUserRole: string;
  currentUserName: string;
}

export default function ApplicantDetailClient({
  applicant: initialApplicant,
  currentUserRole,
  currentUserName,
}: Props) {
  const router = useRouter();
  const [applicant, setApplicant] = useState<Applicant>(initialApplicant);
  const [newStatus, setNewStatus] = useState<ApplicantStatus>(initialApplicant.status);
  const [reason, setReason] = useState(initialApplicant.admin_remark || "");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Enrollment Modal state
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [guardianName, setGuardianName] = useState(applicant.father_name || applicant.mother_name || "");
  const [guardianRelation, setGuardianRelation] = useState("บิดา/มารดา");
  const [guardianPhone, setGuardianPhone] = useState(applicant.phone_number || "");
  const [witnessName, setWitnessName] = useState("นางสาวพรทิพย์ มงคล (เจ้าหน้าที่งานทะเบียน)");
  const [enrollLoading, setEnrollLoading] = useState(false);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/admin/applicants/${applicant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "เกิดข้อผิดพลาดในการบันทึก");
      }

      setApplicant(data.applicant);
      setSuccessMsg("บันทึกการเปลี่ยนสถานะและประวัติเรียบร้อยแล้ว");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollLoading(true);

    try {
      const res = await fetch("/api/admin/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicant_id: applicant.id,
          guardian_name: guardianName,
          guardian_relation: guardianRelation,
          guardian_phone: guardianPhone,
          witness_name: witnessName,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "บันทึกการมอบตัวไม่สำเร็จ");
      }

      setEnrollModalOpen(false);
      setApplicant((prev) => ({
        ...prev,
        status: "enrolled",
        enrollment: data.enrollment,
      }));
      setNewStatus("enrolled");
      setSuccessMsg(`มอบตัวสำเร็จ ออกรหัสนักศึกษา: ${data.enrollment.student_id}`);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setEnrollLoading(false);
    }
  };

  const st = STATUS_MAP[applicant.status];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/applicants"
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-lg text-slate-900">
                {applicant.application_no}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${st.bg} ${st.text} ${st.border}`}>
                {st.label}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              ยื่นเมื่อ: {formatThaiDate(applicant.created_at)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {applicant.status === "passed" && (
            <button
              onClick={() => setEnrollModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 text-xs font-bold shadow transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>บันทึกการมอบตัว / ออกรหัสนักเรียน</span>
            </button>
          )}

          <Link
            href={`/print/${applicant.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>พิมพ์ใบสมัคร (A4)</span>
          </Link>

          {(applicant.status === "passed" || applicant.status === "enrolled") && (
            <Link
              href={`/print/enrollment/${applicant.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-sm transition-all"
            >
              <FileText className="w-4 h-4 text-rose-400" />
              <span>พิมพ์ใบมอบตัว (PDF)</span>
            </Link>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid: Details + Status Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Applicant Data (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Info with Photo */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>ข้อมูลผู้สมัครและสาขาที่เลือก</span>
              <span className="text-xs font-normal text-rose-700 font-semibold">{LEVEL_MAP[applicant.level_type]}</span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-28 h-36 border border-slate-300 rounded-xl relative overflow-hidden bg-slate-100 flex-shrink-0">
                <Image
                  src={applicant.photo_url || "/images/logo.png"}
                  alt="รูปถ่าย"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs flex-1">
                <div>
                  <span className="text-slate-400 block">ชื่อ-นามสกุล</span>
                  <span className="font-semibold text-sm text-slate-900">
                    {applicant.title} {applicant.first_name} {applicant.last_name}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block">เลขประจำตัวประชาชน (๑๓ หลัก)</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {applicant.id_card_number}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block">วันเดือนปีเกิด</span>
                  <span className="text-slate-800">
                    {formatThaiDate(applicant.birth_date)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block">หมายเลขโทรศัพท์</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {applicant.phone_number}
                  </span>
                </div>

                <div className="sm:col-span-2 bg-rose-50/60 p-3 rounded-xl border border-rose-100">
                  <span className="text-rose-800 font-medium block">สาขาวิชาที่ต้องการสมัคร:</span>
                  <span className="text-sm font-bold text-rose-950">
                    {applicant.target_major_name}
                  </span>
                  {applicant.target_major_second_name && (
                    <span className="text-xs text-rose-700 block mt-0.5">
                      (สำรองอันดับ ๒: {applicant.target_major_second_name})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Parents & Address */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              ข้อมูลบิดา มารดา และที่อยู่ปัจจุบัน
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-semibold text-slate-800 block">ข้อมูลบิดา</span>
                <div>ชื่อ-สกุล: {applicant.father_name || "-"}</div>
                <div>อายุ: {applicant.father_age ? `${applicant.father_age} ปี` : "-"}</div>
                <div>อาชีพ: {applicant.father_occupation || "-"}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="font-semibold text-slate-800 block">ข้อมูลมารดา</span>
                <div>ชื่อ-สกุล: {applicant.mother_name || "-"}</div>
                <div>อายุ: {applicant.mother_age ? `${applicant.mother_age} ปี` : "-"}</div>
                <div>อาชีพ: {applicant.mother_occupation || "-"}</div>
              </div>
            </div>

            <div className="text-xs pt-2">
              <span className="text-slate-400 block">ที่อยู่ปัจจุบันที่สามารถติดต่อได้</span>
              <span className="text-slate-800 font-medium leading-relaxed">
                บ้านเลขที่ {applicant.address_no} หมู่ {applicant.address_moo || "-"} ซอย {applicant.address_soi || "-"} ถนน {applicant.address_road || "-"} ตำบล{applicant.subdistrict} อำเภอ{applicant.district} จังหวัด{applicant.province} {applicant.postal_code}
              </span>
            </div>
          </div>

          {/* Section 3: Education */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              ข้อมูลสถานศึกษาเดิมและผลการเรียน
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">ระดับชั้นที่กำลังศึกษา</span>
                <span className="font-semibold text-slate-800">{applicant.current_grade_level}</span>
              </div>
              <div>
                <span className="text-slate-400 block">ชื่อโรงเรียนเดิม</span>
                <span className="font-semibold text-slate-800">{applicant.school_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">ที่ตั้งโรงเรียน</span>
                <span className="text-slate-700">{applicant.school_address || "-"}</span>
              </div>
              <div>
                <span className="text-slate-400 block">ผลการเรียนเฉลี่ยสะสม (GPAX ๕ ภาคเรียน)</span>
                <span className="font-mono font-bold text-base text-rose-700">{applicant.gpax}</span>
              </div>
              <div>
                <span className="text-slate-400 block">สาขาวิชาเดิม (กรณีจบ ปวช.)</span>
                <span className="text-slate-700">{applicant.previous_major || "-"}</span>
              </div>
              <div>
                <span className="text-slate-400 block">ช่องทางที่รู้จักวิทยาลัย</span>
                <span className="text-slate-700">{applicant.referral_source || "-"}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Uploaded Documents */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>เอกสารหลักฐานประกอบการสมัคร ({applicant.documents?.length || 0} รายการ)</span>
            </h2>

            {applicant.documents && applicant.documents.length > 0 ? (
              <div className="space-y-3">
                {applicant.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block">
                          {DOCUMENT_TYPE_MAP[doc.document_type] || doc.document_type}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {doc.file_name} ({formatBytes(doc.file_size)})
                        </span>
                      </div>
                    </div>

                    <a
                      href={doc.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700 text-xs shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>เปิดดู / โหลด</span>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">ไม่มีไฟล์เอกสารแนบ</p>
            )}
          </div>
        </div>

        {/* Right Column: Status Change & Audit Log */}
        <div className="space-y-6">
          {/* Status Change Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              ปรับปรุงสถานะใบสมัคร
            </h2>

            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  สถานะการพิจารณา *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ApplicantStatus)}
                  disabled={currentUserRole === "viewer"}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-rose-500"
                >
                  <option value="pending">รอการตรวจสอบ (Pending)</option>
                  <option value="incomplete">เอกสารไม่ครบ / ต้องแก้ไข (Incomplete)</option>
                  <option value="passed">ผ่านการคัดเลือก (Passed)</option>
                  <option value="rejected">ไม่ผ่านการคัดเลือก (Rejected)</option>
                  <option value="enrolled">มอบตัวแล้ว (Enrolled)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  หมายเหตุ / เหตุผล (ผู้สมัครและเจ้าหน้าที่จะเห็นข้อความนี้)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={currentUserRole === "viewer"}
                  rows={4}
                  placeholder="เช่น เอกสารใบ ปพ.1 ไม่ชัดเจน ขอให้ถ่ายใหม่ หรือ ผ่านการคัดเลือกรอบโควตา"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {currentUserRole !== "viewer" ? (
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนสถานะ"}</span>
                </button>
              ) : (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg">
                  * ท่านมีสิทธิ์ในบทบาท Viewer (ดูผลอย่างเดียว) ไม่สามารถแก้ไขสถานะได้
                </p>
              )}
            </form>
          </div>

          {/* Audit Log Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              ประวัติการเปลี่ยนแปลง (Audit Log)
            </h2>

            <div className="space-y-4">
              {applicant.history && applicant.history.length > 0 ? (
                applicant.history.map((h, idx) => (
                  <div key={h.id || idx} className="flex items-start gap-3 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-600 mt-1 flex-shrink-0 ring-4 ring-rose-100" />
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">
                          {STATUS_MAP[h.to_status]?.label || h.to_status}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">
                          {new Date(h.created_at).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {h.reason && <p className="text-slate-600">{h.reason}</p>}
                      <span className="text-[10px] text-slate-400 block">โดย: {h.changed_by_name}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">ยังไม่มีประวัติการบันทึก</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {enrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  บันทึกการมอบตัวนักเรียน/นักศึกษา
                </h3>
                <p className="text-xs text-slate-500">
                  {applicant.title} {applicant.first_name} {applicant.last_name} ({applicant.target_major_name})
                </p>
              </div>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  ชื่อ-สกุล ผู้ปกครองที่มามอบตัว *
                </label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    ความสัมพันธ์กับผู้สมัคร *
                  </label>
                  <input
                    type="text"
                    value={guardianRelation}
                    onChange={(e) => setGuardianRelation(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    เบอร์โทรศัพท์ผู้ปกครอง *
                  </label>
                  <input
                    type="tel"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  ชื่อเจ้าหน้าที่ / พยาน
                </label>
                <input
                  type="text"
                  value={witnessName}
                  onChange={(e) => setWitnessName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                <span className="font-bold block mb-0.5">การออกรหัสนักศึกษา:</span>
                ระบบจะสร้างรหัสนักเรียน/นักศึกษาให้อัตโนมัติ (เช่น {applicant.level_type === "pvc" ? "70201xxxxx" : "70301xxxxx"}) และเปลี่ยนสถานะเป็น "มอบตัวแล้ว"
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEnrollModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={enrollLoading}
                  className="px-6 py-2 rounded-xl font-bold bg-blue-700 hover:bg-blue-800 text-white shadow"
                >
                  {enrollLoading ? "กำลังบันทึก..." : "ยืนยันการมอบตัว"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
