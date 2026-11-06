import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ApplicantStatus, DocumentType, LevelType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * แปลงเลขอารบิกเป็นเลขไทย
 */
export function toThaiDigits(str: string | number): string {
  if (str === null || str === undefined) return '';
  const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
  return str.toString().replace(/[0-9]/g, (digit) => thaiDigits[parseInt(digit, 10)]);
}

/**
 * ซ่อนเลขบัตรประชาชน (Data Masking สำหรับ PDPA)
 * เช่น 1100200345678 -> 1-1002-xxxxx-78-x หรือ 1-xxxx-xxxxx-67-8
 */
export function maskCitizenId(id: string): string {
  if (!id || id.length !== 13) return id || '';
  return `${id.slice(0, 1)}-${id.slice(1, 2)}xxx-xxxxx-${id.slice(10, 12)}-${id.slice(12)}`;
}

/**
 * จัดรูปแบบเลขบัตรประชาชนให้อ่านง่าย
 * เช่น 1100200345678 -> 1-1002-00345-67-8
 */
export function formatCitizenId(id: string): string {
  if (!id || id.length !== 13) return id || '';
  return `${id.slice(0, 1)}-${id.slice(1, 5)}-${id.slice(5, 10)}-${id.slice(10, 12)}-${id.slice(12)}`;
}

/**
 * แปลงวันที่เป็นวันที่แบบไทย (พ.ศ.)
 * รูปแบบ "15 มกราคม 2570" หรือแบบเลขไทย "๑๕ มกราคม ๒๕๗๐"
 */
export const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

export const THAI_MONTHS_SHORT = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
];

export function formatThaiDate(dateInput: string | Date, options?: { useThaiDigits?: boolean; shortMonth?: boolean }): string {
  if (!dateInput) return '-';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  const day = d.getDate();
  const month = options?.shortMonth ? THAI_MONTHS_SHORT[d.getMonth()] : THAI_MONTHS[d.getMonth()];
  const year = d.getFullYear() + 543;

  const result = `${day} ${month} ${year}`;
  return options?.useThaiDigits ? toThaiDigits(result) : result;
}

/**
 * แปลงข้อความสถานะเป็นภาษาไทยและสีสัญลักษณ์
 */
export const STATUS_MAP: Record<ApplicantStatus, { label: string; bg: string; text: string; border: string }> = {
  pending: {
    label: "รอการตรวจสอบ",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200"
  },
  incomplete: {
    label: "เอกสารไม่สมบูรณ์ / ต้องแก้ไข",
    bg: "bg-rose-50",
    text: "text-rose-800",
    border: "border-rose-200"
  },
  passed: {
    label: "ผ่านการคัดเลือก (โควตา)",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200"
  },
  rejected: {
    label: "ไม่ผ่านการคัดเลือก",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-300"
  },
  enrolled: {
    label: "รายงานตัวและมอบตัวแล้ว",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200"
  }
};

/**
 * ข้อความระดับชั้น
 */
export const LEVEL_MAP: Record<LevelType, string> = {
  pvc: "ระดับ ปวช.",
  pvs_direct: "ระดับ ปวส. (สายตรง)",
  pvs_cross: "ระดับ ปวส. (ม.6/ปวช. ต่างสาขา)"
};

/**
 * ชื่อประเภทเอกสาร
 */
export const DOCUMENT_TYPE_MAP: Record<DocumentType, string> = {
  transcript: "เอกสารแสดงผลการเรียนเฉลี่ยสะสม ๕ ภาคเรียน (ปพ.๑)",
  id_card_house_reg: "สำเนาบัตรประชาชน / สำเนาทะเบียนบ้าน",
  certificate: "สำเนาเกียรติบัตร / ใบรับรองความสามารถพิเศษ / ใบประกาศ"
};

/**
 * แปลงขนาดไฟล์ Byte เป็นข้อความที่อ่านง่าย
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
