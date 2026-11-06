import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Globe, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: College Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-white text-base leading-snug">
                วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              สำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.) กระทรวงศึกษาธิการ
              มุ่งมั่นพัฒนาวิชาชีพ ก้าวล้ำนวัตกรรม สู่มาตรฐานสากล
            </p>
            <div className="flex items-center gap-2 text-xs text-rose-400">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span>การคุ้มครองข้อมูลส่วนบุคคลตามพระราชบัญญัติ PDPA พ.ศ. 2562</span>
            </div>
          </div>

          {/* Col 2: Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">
              ติดต่อสอบถามงานรับสมัคร
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>งานทะเบียนและวัดผล วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์ อ.บ้านหมอ จ.สระบุรี</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>โทรศัพท์: 036-201-444, 036-201-445</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>อีเมล: admission@thaluang.ac.th</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>เว็บไซต์หลัก: www.thaluang.ac.th</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">
              ลิงก์ด่วน
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/apply" className="hover:text-white transition-colors">
                  • กรอกใบสมัครรอบโควตา / กรณีพิเศษ
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-white transition-colors">
                  • ตรวจสอบผลการสมัครและดาวน์โหลดเอกสาร
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  • เข้าสู่ระบบจัดการสำหรับเจ้าหน้าที่
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © ๒๕๗๐ วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์. All Rights Reserved. ระบบรับสมัครเรียนออนไลน์
        </div>
      </div>
    </footer>
  );
}
