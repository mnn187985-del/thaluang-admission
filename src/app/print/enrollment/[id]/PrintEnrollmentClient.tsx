"use client";

import Image from "next/image";
import Link from "next/link";
import { Printer, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Applicant } from "@/types";
import { LEVEL_MAP, formatThaiDate } from "@/lib/utils";

interface Props {
  applicant: Applicant;
  qrCodeDataUrl: string;
}

export default function PrintEnrollmentClient({ applicant, qrCodeDataUrl }: Props) {
  const handlePrint = () => {
    window.print();
  };

  const today = new Date();
  const todayStr = formatThaiDate(today);

  return (
    <div className="min-h-screen bg-slate-200 py-6 print:py-0 print:bg-white text-black font-sarabun">
      {/* Floating Control Bar */}
      <div className="no-print max-w-4xl mx-auto mb-6 px-4">
        <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-300 flex items-center justify-between gap-4">
          <Link
            href="/tracking"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้าตรวจสอบสถานะ</span>
          </Link>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์ใบมอบตัว / บันทึกเป็น PDF (A4)</span>
          </button>
        </div>
      </div>

      {/* A4 Sheet Container */}
      <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[18mm] shadow-2xl print:shadow-none print:p-0 text-slate-900 leading-normal text-[15px] border-8 border-double border-slate-800">
        <div className="text-center mb-6">
          <div className="w-20 h-20 relative mx-auto mb-2">
            <Image
              src="/images/logo.png"
              alt="ตราวิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="font-bold text-[20px] text-slate-950">
            เอกสารรายงานตัวและมอบตัวเข้าเป็นนักเรียน นักศึกษา
          </h1>
          <h2 className="font-semibold text-[17px] text-slate-900 mt-1">
            วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์ ประจำปีการศึกษา ๒๕๗๐
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            รอบคัดเลือกเป็นกรณีพิเศษ (โควตา)
          </p>
        </div>

        {/* Student Badge Box */}
        <div className="my-6 p-4 rounded-xl border-2 border-slate-700 bg-slate-50 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">เลขที่ใบสมัคร</span>
            <span className="font-mono font-bold text-lg text-slate-900">{applicant.application_no}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">รหัสนักเรียน/นักศึกษา</span>
            <span className="font-mono font-extrabold text-xl text-blue-900">
              {applicant.enrollment?.student_id || "กำลังดำเนินการออกรหัส"}
            </span>
          </div>
        </div>

        {/* Information Table */}
        <div className="space-y-3 text-[15px] leading-relaxed">
          <div className="flex border-b border-dotted border-slate-400 pb-1">
            <span className="w-48 font-semibold">ชื่อ-นามสกุล ผู้ผ่านการคัดเลือก:</span>
            <span className="flex-1 font-bold">{applicant.title} {applicant.first_name} {applicant.last_name}</span>
          </div>

          <div className="flex border-b border-dotted border-slate-400 pb-1">
            <span className="w-48 font-semibold">เลขประจำตัวประชาชน:</span>
            <span className="flex-1 font-mono">{applicant.id_card_number}</span>
          </div>

          <div className="flex border-b border-dotted border-slate-400 pb-1">
            <span className="w-48 font-semibold">ระดับการศึกษา:</span>
            <span className="flex-1">{LEVEL_MAP[applicant.level_type]}</span>
          </div>

          <div className="flex border-b border-dotted border-slate-400 pb-1">
            <span className="w-48 font-semibold">สาขาวิชาที่ได้รับการคัดเลือก:</span>
            <span className="flex-1 font-bold text-blue-900">{applicant.target_major_name}</span>
          </div>

          <div className="flex border-b border-dotted border-slate-400 pb-1">
            <span className="w-48 font-semibold">สถานศึกษาเดิม:</span>
            <span className="flex-1">{applicant.school_name} (เกรดเฉลี่ยสะสม: {applicant.gpax})</span>
          </div>

          {applicant.enrollment && (
            <>
              <div className="flex border-b border-dotted border-slate-400 pb-1">
                <span className="w-48 font-semibold">ชื่อ-สกุล ผู้ปกครอง:</span>
                <span className="flex-1">{applicant.enrollment.guardian_name} ({applicant.enrollment.guardian_relation})</span>
              </div>
              <div className="flex border-b border-dotted border-slate-400 pb-1">
                <span className="w-48 font-semibold">เบอร์โทรศัพท์ผู้ปกครอง:</span>
                <span className="flex-1 font-mono">{applicant.enrollment.guardian_phone}</span>
              </div>
            </>
          )}
        </div>

        {/* Rules & Requirements Box */}
        <div className="mt-8 p-4 bg-slate-50 border border-slate-300 rounded-lg text-xs space-y-1.5 leading-relaxed">
          <div className="font-bold text-slate-900">หลักฐานที่ต้องนำมาในวันมอบตัว:</div>
          <div>๑. ใบสมัครเข้ารับการคัดเลือก (ฉบับจริงพร้อมติดรูปถ่าย) และใบมอบตัวฉบับนี้</div>
          <div>๒. ระเบียนแสดงผลการเรียน (ปพ.๑) ฉบับจริง พร้อมสำเนา ๒ ฉบับ</div>
          <div>๓. สำเนาทะเบียนบ้านและสำเนาบัตรประชาชนของผู้สมัคร บิดา และมารดา อย่างละ ๑ ฉบับ</div>
          <div>๔. ผู้ปกครองต้องมาลงนามในสัญญาการเป็นนักเรียน/นักศึกษาด้วยตนเอง</div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 mt-14 pt-4 text-center text-xs">
          <div className="space-y-2">
            <div>ลงชื่อ ........................................................... ผู้มอบตัว</div>
            <div>({applicant.title}{applicant.first_name} {applicant.last_name})</div>
            <div>นักเรียน / นักศึกษา</div>
          </div>

          <div className="space-y-2">
            <div>ลงชื่อ ........................................................... ผู้ปกครอง</div>
            <div>({applicant.enrollment?.guardian_name || "..........................................................."})</div>
            <div>วันที่ .......... เดือน .......................... พ.ศ. ...........</div>
          </div>
        </div>

        {/* College Seal & Registrar */}
        <div className="mt-14 flex items-end justify-between pt-6 border-t border-slate-300">
          <div className="flex items-center gap-3">
            <img src={qrCodeDataUrl} alt="QR Code" className="w-16 h-16" />
            <div className="text-[11px] text-slate-500">
              <span className="font-mono block text-slate-800 font-bold">{applicant.application_no}</span>
              <span>ตรวจสอบข้อมูลการมอบตัว</span>
            </div>
          </div>

          <div className="text-center text-xs space-y-1.5">
            <div>ลงชื่อ ........................................................... นายทะเบียน</div>
            <div>(งานทะเบียนและวัดผล)</div>
            <div>วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์</div>
          </div>
        </div>
      </div>
    </div>
  );
}
