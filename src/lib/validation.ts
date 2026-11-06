import { z } from "zod";

/**
 * ฟังก์ชันตรวจสอบความถูกต้องของเลขประจำตัวประชาชน 13 หลัก ตามมาตรฐานกระทรวงมหาดไทย (Checksum Mod 11)
 */
export function validateThaiCitizenId(id: string): boolean {
  if (!id || id.length !== 13 || !/^\d{13}$/.test(id)) {
    return false;
  }

  // ป้องกันเลขตองหรือเลขหลอกเบื้องต้น เช่น 0000000000000, 1111111111111
  if (/^(\d)\1{12}$/.test(id)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(id.charAt(i), 10) * (13 - i);
  }

  const checkDigit = (11 - (sum % 11)) % 10;
  return checkDigit === parseInt(id.charAt(12), 10);
}

/**
 * Zod Schema สำหรับฟอร์มใบสมัคร
 */
export const applicantFormSchema = z.object({
  // ระดับที่สมัคร
  level_type: z.enum(['pvs_direct', 'pvs_cross', 'pvc'], {
    errorMap: () => ({ message: 'กรุณาเลือกระดับชั้นที่ต้องการสมัคร' }),
  }),
  photo_url: z.string().min(1, 'กรุณาอัปโหลดรูปถ่ายหน้าตรงขนาด 1 นิ้ว'),

  // ข้อ ๑ ข้อมูลผู้สมัคร
  title: z.string().min(1, 'กรุณาเลือกคำนำหน้าชื่อ'),
  first_name: z.string().min(1, 'กรุณากรอกชื่อ'),
  last_name: z.string().min(1, 'กรุณากรอกนามสกุล'),
  id_card_number: z.string().refine(validateThaiCitizenId, {
    message: 'เลขประจำตัวประชาชน 13 หลักไม่ถูกต้องตามหลักเกณฑ์',
  }),
  birth_date: z.string().min(1, 'กรุณาระบุวันเดือนปีเกิด'),

  // ข้อ ๒ ข้อมูลบิดา
  father_name: z.string().optional().or(z.literal('')),
  father_age: z.coerce.number().optional().nullable(),
  father_occupation: z.string().optional().or(z.literal('')),

  // ข้อ ๓ ข้อมูลมารดา
  mother_name: z.string().optional().or(z.literal('')),
  mother_age: z.coerce.number().optional().nullable(),
  mother_occupation: z.string().optional().or(z.literal('')),

  // ข้อ ๔ ที่อยู่ปัจจุบัน
  address_no: z.string().min(1, 'กรุณากรอกบ้านเลขที่'),
  address_moo: z.string().optional().or(z.literal('')),
  address_soi: z.string().optional().or(z.literal('')),
  address_road: z.string().optional().or(z.literal('')),
  subdistrict: z.string().min(1, 'กรุณาระบุตำบล/แขวง'),
  district: z.string().min(1, 'กรุณาระบุอำเภอ/เขต'),
  province: z.string().min(1, 'กรุณาระบุจังหวัด'),
  postal_code: z.string().regex(/^\d{5}$/, 'รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก'),
  phone_number: z.string().regex(/^0\d{9}$/, 'หมายเลขโทรศัพท์ต้องขึ้นต้นด้วย 0 และมี 10 หลัก'),

  // ข้อ ๕ สถานศึกษาปัจจุบัน
  current_grade_level: z.string().min(1, 'กรุณาระบุระดับชั้นที่กำลังศึกษา'),
  school_name: z.string().min(1, 'กรุณาระบุชื่อโรงเรียน'),
  school_address: z.string().optional().or(z.literal('')),
  gpax: z.coerce
    .number({ invalid_type_error: 'กรุณากรอกเกรดเฉลี่ยสะสมเป็นตัวเลข' })
    .min(0.00, 'ผลการเรียนเฉลี่ยสะสมต้องไม่ต่ำกว่า 0.00')
    .max(4.00, 'ผลการเรียนเฉลี่ยสะสมต้องไม่เกิน 4.00'),
  previous_major: z.string().optional().or(z.literal('')),

  // ข้อ ๖ สาขาวิชาที่ต้องการสมัคร
  target_major_id: z.string().min(1, 'กรุณาเลือกสาขาวิชาที่ต้องการสมัคร'),
  target_major_second_id: z.string().optional().nullable(),

  // ข้อมูลเพิ่มเติม & PDPA
  referral_source: z.string().optional().or(z.literal('')),
  pdpa_accepted: z.boolean().refine((val) => val === true, {
    message: 'กรุณากดยินยอมการเก็บและใช้ข้อมูลส่วนบุคคลตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)',
  }),
}).refine(
  (data) => {
    // ถ้าสมัคร ปวช. และเลือกอันดับ 2 ต้องไม่ซ้ำกับอันดับ 1
    if (data.level_type === 'pvc' && data.target_major_second_id) {
      return data.target_major_id !== data.target_major_second_id;
    }
    return true;
  },
  {
    message: 'สาขาวิชาลำดับที่ ๑ และลำดับที่ ๒ ต้องไม่ซ้ำกัน',
    path: ['target_major_second_id'],
  }
);

export type ApplicantFormValues = z.infer<typeof applicantFormSchema>;
