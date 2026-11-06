import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMajors } from "@/lib/db";
import { 
  FileCheck2, 
  Search, 
  GraduationCap, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Download, 
  Award,
  Sparkles,
  BookOpen
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const majors = await getMajors();
  const pvcMajors = majors.filter(m => m.level === "pvc");
  const pvsMajors = majors.filter(m => m.level === "pvs");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-900 via-rose-950 to-slate-900 text-white py-16 sm:py-24">
        {/* Background glow & subtle pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-800/60 border border-rose-600/40 text-rose-200 text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>เปิดรับสมัครรอบโควตาและกรณีพิเศษ ประจำปีการศึกษา ๒๕๗๐</span>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
              <Image
                src="/images/logo.png"
                alt="วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์"
                fill
                sizes="112px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-rose-100 font-light mb-8">
            ระบบรับสมัครเรียนออนไลน์ แทนที่ใบสมัครกระดาษ สะดวก รวดเร็ว 
            บันทึกร่างอัตโนมัติ พร้อมตรวจสอบสถานะและพิมพ์ใบสมัครได้ทันที
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              href="/apply"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base text-rose-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all transform hover:-translate-y-0.5"
            >
              <FileCheck2 className="w-5 h-5 text-rose-900" />
              <span>กรอกใบสมัครโควตา</span>
              <ArrowRight className="w-4 h-4 text-rose-900" />
            </Link>
            <Link
              href="/tracking"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-medium text-base text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all"
            >
              <Search className="w-5 h-5 text-rose-300" />
              <span>ตรวจสอบผลการสมัคร</span>
            </Link>
          </div>

          {/* Quick Stats or Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-14 pt-10 border-t border-rose-800/40 text-left">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-amber-400 font-bold text-xl sm:text-2xl">ปวช.</div>
              <div className="text-xs text-rose-200 mt-1">รับผู้จบ ม.3 หรือเทียบเท่า (เลือกได้ 2 อันดับ)</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-amber-400 font-bold text-xl sm:text-2xl">ปวส. (สายตรง)</div>
              <div className="text-xs text-rose-200 mt-1">รับผู้จบ ปวช. ตรงสาขาวิชา</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-amber-400 font-bold text-xl sm:text-2xl">ปวส. (ม.6/ต่างสาขา)</div>
              <div className="text-xs text-rose-200 mt-1">รับผู้จบ ม.6 หรือ ปวช. ต่างสาขา</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-amber-400 font-bold text-xl sm:text-2xl">เอกสาร A4 PDF</div>
              <div className="text-xs text-rose-200 mt-1">ดาวน์โหลดใบสมัครและใบมอบตัวพร้อม QR Code</div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Guide */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              ขั้นตอนการสมัครเรียนออนไลน์ (โควตา ๒๕๗๐)
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              ขั้นตอนง่ายๆ ทำได้บนสมาร์ตโฟนหรือคอมพิวเตอร์ ข้อมูลไม่สูญหายด้วยระบบบันทึกร่างอัตโนมัติ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-rose-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-2">เลือกสาขาและกรอกข้อมูล</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                เลือกระดับชั้น ปวช./ปวส. สาขาวิชาที่ต้องการ และกรอกข้อมูลผู้สมัคร ครอบครัว และที่อยู่
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-rose-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-2">อัปโหลดเอกสารหลักฐาน</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                แนบผลการเรียน 5 ภาคเรียน สำเนาบัตรประชาชน และรูปถ่าย 1 นิ้ว (ระบบย่อขนาดไฟล์ให้อัตโนมัติ)
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-rose-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-2">รอเจ้าหน้าที่ตรวจสอบ</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                ตรวจสอบสถานะได้ตลอดเวลา หากเอกสารไม่ชัดเจนสามารถอัปโหลดแก้ไขได้ทันที
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-rose-300 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-lg mb-4">
                4
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-2">พิมพ์ใบสมัครและมอบตัว</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                ดาวน์โหลด PDF ใบสมัคร A4 ที่มี QR Code และพิมพ์ใบมอบตัวเมื่อผ่านการคัดเลือก
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Majors Listing */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-rose-700 font-semibold text-sm mb-2">
              <BookOpen className="w-4 h-4" />
              <span>หลักสูตรและสาขาวิชาที่เปิดรับ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              สาขาวิชาที่เปิดรับสมัคร รอบโควตา ๒๕๗๐
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PVC Majors */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">ระดับ ปวช.</h3>
                  <p className="text-xs text-slate-500">หลักสูตรประกาศนียบัตรวิชาชีพ (เลือกได้ ๒ ลำดับ)</p>
                </div>
                <span className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-semibold rounded-full border border-rose-200">
                  {pvcMajors.length} สาขาวิชา
                </span>
              </div>
              <ul className="space-y-3">
                {pvcMajors.map((m, idx) => (
                  <li key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-rose-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-slate-800">{m.name}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      โควตา {m.quota_limit} คน
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* PVS Majors */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">ระดับ ปวส.</h3>
                  <p className="text-xs text-slate-500">หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง (สายตรง & ม.6/ต่างสาขา)</p>
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-full border border-amber-200">
                  {pvsMajors.length} สาขาวิชา
                </span>
              </div>
              <ul className="space-y-3">
                {pvsMajors.map((m, idx) => (
                  <li key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-slate-800">{m.name}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      โควตา {m.quota_limit} คน
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-rose-900 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            พร้อมสมัครศึกษาต่อรอบโควตากับเราแล้วหรือยัง?
          </h2>
          <p className="text-sm sm:text-base text-rose-200 mb-6 max-w-2xl mx-auto">
            เตรียมรูปถ่ายหน้าตรง 1 นิ้ว และเอกสารแสดงผลการเรียน 5 ภาคเรียน แล้วคลิกเริ่มสมัครได้ทันที
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-rose-900 hover:bg-rose-50 rounded-xl font-semibold shadow-lg transition-all"
          >
            <span>เข้าสู่หน้ากรอกใบสมัคร</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
