export type LevelType = 'pvs_direct' | 'pvs_cross' | 'pvc';

export type ApplicantStatus = 
  | 'pending'     // รอตรวจสอบ
  | 'incomplete'  // เอกสารไม่ครบ
  | 'passed'      // ผ่านการคัดเลือก
  | 'rejected'    // ไม่ผ่านการคัดเลือก
  | 'enrolled';   // มอบตัวแล้ว

export type DocumentType = 
  | 'transcript'          // เอกสารแสดงผลการเรียน 5 ภาคเรียน
  | 'id_card_house_reg'   // สำเนาบัตรประชาชน / สำเนาทะเบียนบ้าน
  | 'certificate';        // สำเนาเกียรติบัตร / ใบรับรอง

export type AdminRole = 'super_admin' | 'registrar' | 'viewer';

export interface Major {
  id: string;
  code: string;
  name: string;
  level: 'pvc' | 'pvs';
  track?: 'direct' | 'cross' | 'both' | null;
  quota_limit: number;
  is_active: boolean;
  display_order: number;
}

export interface AcademicYear {
  id: string;
  year: number;
  title: string;
  is_active: boolean;
  application_start: string;
  application_end: string;
}

export interface ApplicantDocument {
  id: string;
  applicant_id: string;
  document_type: DocumentType;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  verification_status: 'pending' | 'valid' | 'invalid';
  reject_reason?: string | null;
  uploaded_at: string;
}

export interface StatusHistory {
  id: string;
  applicant_id: string;
  from_status?: ApplicantStatus | null;
  to_status: ApplicantStatus;
  reason?: string | null;
  changed_by_name: string;
  changed_by_id?: string | null;
  created_at: string;
}

export interface Enrollment {
  id: string;
  applicant_id: string;
  student_id: string;
  enrollment_date: string;
  guardian_name: string;
  guardian_relation: string;
  guardian_phone: string;
  witness_name?: string | null;
  remarks?: string | null;
  recorded_by: string;
  created_at: string;
}

export interface Applicant {
  id: string;
  academic_year_id: string;
  application_no: string; // e.g. "Q70-0001"
  level_type: LevelType;
  photo_url?: string | null;
  
  // ข้อ ๑ ข้อมูลผู้สมัคร
  title: string;
  first_name: string;
  last_name: string;
  id_card_number: string;
  birth_date: string; // YYYY-MM-DD
  
  // ข้อ ๒ ข้อมูลบิดา
  father_name?: string | null;
  father_age?: number | null;
  father_occupation?: string | null;
  
  // ข้อ ๓ ข้อมูลมารดา
  mother_name?: string | null;
  mother_age?: number | null;
  mother_occupation?: string | null;
  
  // ข้อ ๔ ที่อยู่ปัจจุบัน
  address_no: string;
  address_moo?: string | null;
  address_soi?: string | null;
  address_road?: string | null;
  subdistrict: string;
  district: string;
  province: string;
  postal_code: string;
  phone_number: string;
  
  // ข้อ ๕ สถานศึกษาปัจจุบัน
  current_grade_level: string;
  school_name: string;
  school_address?: string | null;
  gpax: number;
  previous_major?: string | null;
  
  // ข้อ ๖ สาขาวิชาที่ต้องการสมัคร
  target_major_id: string;
  target_major_name?: string;
  target_major_second_id?: string | null;
  target_major_second_name?: string | null;
  
  // เพิ่มเติม & PDPA
  referral_source?: string | null;
  pdpa_accepted: boolean;
  
  // สถานะ
  status: ApplicantStatus;
  admin_remark?: string | null;
  
  created_at: string;
  updated_at: string;
  
  // Relations (optional loaded)
  documents?: ApplicantDocument[];
  enrollment?: Enrollment | null;
  history?: StatusHistory[];
}

export interface AdminUser {
  id: string;
  auth_user_id?: string | null;
  email: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
}
