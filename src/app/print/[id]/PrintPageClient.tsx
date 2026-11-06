"use client";

import { useState } from "react";
import Image from "next/image";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Applicant } from "@/types";
import { toThaiDigits, formatThaiDate } from "@/lib/utils";

interface Props {
  applicant: Applicant;
  qrCodeDataUrl: string;
}

export default function PrintPageClient({ applicant, qrCodeDataUrl }: Props) {
  const [useThaiDigits, setUseThaiDigits] = useState(false);

  const num = (val: string | number | undefined | null) => {
    if (val === undefined || val === null || val === "") return "";
    return useThaiDigits ? toThaiDigits(val) : String(val);
  };

  const handlePrint = () => {
    window.print();
  };

  // Parse birth date parts
  const birth = new Date(applicant.birth_date);
  const birthDay = isNaN(birth.getTime()) ? "" : birth.getDate();
  const birthMonth = isNaN(birth.getTime()) ? "" : birth.toLocaleDateString("th-TH", { month: "long" });
  const birthYear = isNaN(birth.getTime()) ? "" : birth.getFullYear() + 543;

  // Format today's date for signature
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.toLocaleDateString("th-TH", { month: "long" });
  const todayYear = today.getFullYear() + 543;

  return (
    <div className="min-h-screen bg-slate-200 py-6 print:py-0 print:bg-white text-black font-sarabun">
      {/* Top Floating Control Bar (Hidden when printing) */}
      <div className="no-print max-w-4xl mx-auto mb-6 px-4">
        <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-300 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/tracking"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้าตรวจสอบสถานะ</span>
          </Link>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={useThaiDigits}
                onChange={(e) => setUseThaiDigits(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded border-slate-300"
              />
              <span>แสดงตัวเลขไทย (เช่น ๑, ๒, ๓)</span>
            </label>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>สั่งพิมพ์ / บันทึกเป็น PDF (A4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* A4 Sheet Container */}
      <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white p-[15mm] shadow-2xl print:shadow-none print:p-0 text-slate-900 leading-normal text-[15px]">
        {/* Top Header: Seals, Title, Photo Box */}
        <div className="flex items-start justify-between mb-2">
          {/* Top Left Seal */}
          <div className="w-20 h-20 relative flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="ตราวิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Center Titles */}
          <div className="text-center flex-1 px-4 pt-1">
            <h1 className="font-bold text-[18px] text-slate-950">
              ใบสมัครเข้ารับคัดเลือกเพื่อศึกษาต่อเป็นกรณีพิเศษ (โควตา)
            </h1>
            <h2 className="font-bold text-[17px] text-slate-950 mt-0.5">
              วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์ ประจำปีการศึกษา {num(2570)}
            </h2>
          </div>

          {/* Top Right Photo 1 Inch Box */}
          <div className="w-[30mm] h-[38mm] border border-slate-800 flex flex-col items-center justify-center text-center p-1 relative flex-shrink-0 bg-slate-50">
            {applicant.photo_url && applicant.photo_url !== "/images/logo.png" ? (
              <Image
                src={applicant.photo_url}
                alt="รูปถ่ายผู้สมัคร"
                fill
                className="object-cover"
              />
            ) : (
              <div className="text-[12px] text-slate-700 leading-tight">
                รูปถ่าย<br />ขนาด ๑ นิ้ว
              </div>
            )}
          </div>
        </div>

        {/* Level Radios */}
        <div className="mt-4 mb-3 space-y-1 pl-12 text-[15px]">
          <div className="flex items-center gap-2.5">
            <span className="w-4 h-4 border border-black inline-flex items-center justify-center text-xs font-bold">
              {applicant.level_type === "pvs_direct" ? "✓" : ""}
            </span>
            <span>ระดับ ปวส. ( สายตรง )</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-4 h-4 border border-black inline-flex items-center justify-center text-xs font-bold">
              {applicant.level_type === "pvs_cross" ? "✓" : ""}
            </span>
            <span>ระดับ ปวส. ( ม.6/ปวช. ต่างสาขา )</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-4 h-4 border border-black inline-flex items-center justify-center text-xs font-bold">
              {applicant.level_type === "pvc" ? "✓" : ""}
            </span>
            <span>ระดับ ปวช.</span>
          </div>
        </div>

        {/* Form Body Items 1-6 */}
        <div className="space-y-2 mt-4 text-[15px] leading-relaxed">
          {/* ๑. ชื่อ-นามสกุล */}
          <div className="flex flex-wrap items-baseline">
            <span className="font-medium mr-1.5">{num("๑")}. ชื่อ-นามสกุล</span>
            <span className="border-b border-dotted border-black flex-1 font-semibold px-2 min-w-[200px]">
              {applicant.title} {applicant.first_name} {applicant.last_name}
            </span>
            <span className="ml-2 mr-1">เกิดวันที่</span>
            <span className="border-b border-dotted border-black px-2 min-w-[40px] text-center">
              {num(birthDay)}
            </span>
            <span className="mx-1">เดือน</span>
            <span className="border-b border-dotted border-black px-2 min-w-[80px] text-center">
              {birthMonth}
            </span>
            <span className="mx-1">พ.ศ.</span>
            <span className="border-b border-dotted border-black px-2 min-w-[60px] text-center">
              {num(birthYear)}
            </span>
          </div>

          {/* ๒. ชื่อ-สกุลบิดา */}
          <div className="flex flex-wrap items-baseline">
            <span className="font-medium mr-1.5">{num("๒")}. ชื่อ-สกุลบิดา</span>
            <span className="border-b border-dotted border-black flex-1 px-2 min-w-[200px]">
              {applicant.father_name || "-"}
            </span>
            <span className="ml-2 mr-1">อายุ</span>
            <span className="border-b border-dotted border-black px-2 min-w-[45px] text-center">
              {num(applicant.father_age) || "-"}
            </span>
            <span className="mx-1">ปี</span>
            <span className="mx-1">อาชีพ</span>
            <span className="border-b border-dotted border-black px-2 flex-1 min-w-[120px]">
              {applicant.father_occupation || "-"}
            </span>
          </div>

          {/* ๓. ชื่อ-สกุลมารดา */}
          <div className="flex flex-wrap items-baseline">
            <span className="font-medium mr-1.5">{num("๓")}. ชื่อ-สกุลมารดา</span>
            <span className="border-b border-dotted border-black flex-1 px-2 min-w-[200px]">
              {applicant.mother_name || "-"}
            </span>
            <span className="ml-2 mr-1">อายุ</span>
            <span className="border-b border-dotted border-black px-2 min-w-[45px] text-center">
              {num(applicant.mother_age) || "-"}
            </span>
            <span className="mx-1">ปี</span>
            <span className="mx-1">อาชีพ</span>
            <span className="border-b border-dotted border-black px-2 flex-1 min-w-[120px]">
              {applicant.mother_occupation || "-"}
            </span>
          </div>

          {/* ๔. ที่อยู่ปัจจุบัน */}
          <div>
            <div className="flex flex-wrap items-baseline">
              <span className="font-medium mr-1.5">{num("๔")}. ที่อยู่ปัจจุบันที่สามารถติดต่อได้</span>
              <span className="mr-1">บ้านเลขที่</span>
              <span className="border-b border-dotted border-black px-2 min-w-[60px] text-center">
                {num(applicant.address_no)}
              </span>
              <span className="mx-1">หมู่</span>
              <span className="border-b border-dotted border-black px-2 min-w-[40px] text-center">
                {num(applicant.address_moo) || "-"}
              </span>
              <span className="mx-1">ซอย</span>
              <span className="border-b border-dotted border-black px-2 flex-1 min-w-[100px]">
                {applicant.address_soi || "-"}
              </span>
              <span className="mx-1">ถนน</span>
              <span className="border-b border-dotted border-black px-2 flex-1 min-w-[100px]">
                {applicant.address_road || "-"}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline mt-1.5 pl-5">
              <span className="mr-1">ตำบล</span>
              <span className="border-b border-dotted border-black px-2 flex-1 min-w-[100px]">
                {applicant.subdistrict}
              </span>
              <span className="mx-1">อำเภอ</span>
              <span className="border-b border-dotted border-black px-2 flex-1 min-w-[100px]">
                {applicant.district}
              </span>
              <span className="mx-1">จังหวัด</span>
              <span className="border-b border-dotted border-black px-2 flex-1 min-w-[100px]">
                {applicant.province}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline mt-1.5 pl-5">
              <span className="mr-1">รหัสไปรษณีย์</span>
              <span className="border-b border-dotted border-black px-2 min-w-[80px] text-center">
                {num(applicant.postal_code)}
              </span>
              <span className="mx-2">หมายเลขโทรศัพท์</span>
              <span className="border-b border-dotted border-black px-2 flex-1 min-w-[160px] font-mono">
                {num(applicant.phone_number)}
              </span>
            </div>
          </div>

          {/* ๕. สถานศึกษาปัจจุบัน */}
          <div>
            <div className="flex flex-wrap items-baseline">
              <span className="font-medium mr-1.5">{num("๕")}. กำลังศึกษาอยู่ในระดับชั้น</span>
              <span className="border-b border-dotted border-black px-2 min-w-[120px] text-center">
                {applicant.current_grade_level}
              </span>
              <span className="mx-1">โรงเรียน</span>
              <span className="border-b border-dotted border-black px-2 flex-1 min-w-[200px]">
                {applicant.school_name}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline mt-1.5 pl-5">
              <span className="mr-1">ตั้งอยู่เลขที่</span>
              <span className="border-b border-dotted border-black px-2 min-w-[80px] text-center">
                {num(applicant.school_address?.split(" ")[0]) || "-"}
              </span>
              <span className="mx-1">ตำบล/อำเภอ/จังหวัด</span>
              <span className="border-b border-dotted border-black px-2 flex-1 min-w-[200px]">
                {applicant.school_address || "-"}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline mt-1.5 pl-5">
              <span className="mr-1">ผลการเรียนเฉลี่ยสะสม</span>
              <span className="border-b border-dotted border-black px-3 min-w-[80px] text-center font-bold font-mono">
                {num(applicant.gpax)}
              </span>
              <span className="mx-2">สาขาวิชาเดิม (ถ้ามี)</span>
              <span className="border-b border-dotted border-black px-2 flex-1 min-w-[160px]">
                {applicant.previous_major || "-"}
              </span>
            </div>
          </div>

          {/* ๖. ต้องการสมัครเข้าเรียน */}
          <div>
            <div className="flex flex-wrap items-baseline">
              <span className="font-medium mr-1.5">{num("๖")}. ต้องการสมัครเข้าเรียน</span>
              <span className="mr-1">ระดับ ปวส. สาขาวิชา</span>
              <span className="border-b border-dotted border-black px-2 flex-1 min-w-[250px] font-semibold">
                {applicant.level_type !== "pvc" ? applicant.target_major_name : "-"}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline mt-1.5 pl-14">
              <span className="mr-1">ระดับ ปวช. สาขาวิชาลำดับที่ {num("๑")}.</span>
              <span className="border-b border-dotted border-black px-2 flex-1 min-w-[250px] font-semibold">
                {applicant.level_type === "pvc" ? applicant.target_major_name : "-"}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline mt-1.5 pl-24">
              <span className="mr-1">สาขาวิชาลำดับที่ {num("๒")}.</span>
              <span className="border-b border-dotted border-black px-2 flex-1 min-w-[250px]">
                {applicant.level_type === "pvc" && applicant.target_major_second_name ? applicant.target_major_second_name : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* หลักฐานประกอบการสมัคร */}
        <div className="mt-5 pt-3 border-t border-slate-300 text-[14px] leading-relaxed">
          <div className="font-bold mb-1">หลักฐานประกอบการสมัคร</div>
          <div className="pl-4 space-y-0.5">
            <div>{num("๑")}. เอกสารแสดงผลการเรียนเฉลี่ยสะสม {num("๕")} ภาคเรียน จำนวน {num("๑")} ฉบับ</div>
            <div>{num("๒")}. สำเนาบัตรประชาชน / สำเนาทะเบียนบ้าน จำนวน {num("๑")} ฉบับ</div>
            <div>{num("๓")}. สำเนาเกียรติบัตร/ใบรับรองความสามารถพิเศษ/ใบประกาศ (ถ้ามี)</div>
          </div>
        </div>

        {/* Signatures & Footer with QR Code */}
        <div className="mt-8 pt-4 flex items-end justify-between text-[14px]">
          {/* QR Code and Application No. */}
          <div className="flex items-center gap-3">
            <div className="border border-slate-400 p-1 bg-white">
              <img
                src={qrCodeDataUrl}
                alt="QR Code"
                className="w-20 h-20"
              />
            </div>
            <div className="text-[12px] text-slate-600">
              <span className="block font-mono font-bold text-slate-900 text-sm">
                {applicant.application_no}
              </span>
              <span className="block text-[11px] text-slate-500">สแกนตรวจสอบข้อมูล</span>
              <span className="block text-[10px] text-slate-400">ระบบรับสมัครออนไลน์</span>
            </div>
          </div>

          {/* Signature Box */}
          <div className="text-center space-y-2 pr-6">
            <div className="flex items-baseline justify-center">
              <span className="mr-1">ลงชื่อ</span>
              <span className="border-b border-dotted border-black w-48 inline-block"></span>
              <span className="ml-1">ผู้สมัคร</span>
            </div>
            <div className="text-slate-600 text-xs">
              ({applicant.title}{applicant.first_name} {applicant.last_name})
            </div>
            <div className="flex items-baseline justify-center text-xs text-slate-700">
              <span className="mr-1">วันที่</span>
              <span className="border-b border-dotted border-black w-10 inline-block text-center">{num(todayDay)}</span>
              <span className="mx-1">เดือน</span>
              <span className="border-b border-dotted border-black w-24 inline-block text-center">{todayMonth}</span>
              <span className="mx-1">พ.ศ.</span>
              <span className="border-b border-dotted border-black w-14 inline-block text-center">{num(todayYear)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
