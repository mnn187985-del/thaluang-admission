import fs from "fs";
import path from "path";
import { 
  Applicant, 
  ApplicantDocument, 
  ApplicantStatus, 
  Major, 
  AcademicYear, 
  StatusHistory, 
  Enrollment, 
  AdminUser,
  LevelType
} from "@/types";
import { isSupabaseConfigured, supabaseAdmin } from "./supabase";

const DATA_FILE = path.join(process.cwd(), ".data", "db.json");

// Default Majors Seed Data
const DEFAULT_MAJORS: Major[] = [
  { id: "maj-pvc-1", code: "PVC-AUTO", name: "สาขาวิชาช่างยนต์", level: "pvc", quota_limit: 60, is_active: true, display_order: 1 },
  { id: "maj-pvc-2", code: "PVC-MACH", name: "สาขาวิชาช่างกลโรงงาน", level: "pvc", quota_limit: 40, is_active: true, display_order: 2 },
  { id: "maj-pvc-3", code: "PVC-WELD", name: "สาขาวิชาช่างเชื่อมโลหะ", level: "pvc", quota_limit: 30, is_active: true, display_order: 3 },
  { id: "maj-pvc-4", code: "PVC-ELEC", name: "สาขาวิชาช่างไฟฟ้ากำลัง", level: "pvc", quota_limit: 60, is_active: true, display_order: 4 },
  { id: "maj-pvc-5", code: "PVC-ELTN", name: "สาขาวิชาช่างอิเล็กทรอนิกส์", level: "pvc", quota_limit: 35, is_active: true, display_order: 5 },
  { id: "maj-pvc-6", code: "PVC-COMP", name: "สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล", level: "pvc", quota_limit: 40, is_active: true, display_order: 6 },
  { id: "maj-pvc-7", code: "PVC-ACCT", name: "สาขาวิชาการบัญชี", level: "pvc", quota_limit: 40, is_active: true, display_order: 7 },
  { id: "maj-pvc-8", code: "PVC-LOGS", name: "สาขาวิชาการจัดการโลจิสติกส์", level: "pvc", quota_limit: 35, is_active: true, display_order: 8 },

  { id: "maj-pvs-1", code: "PVS-MECH", name: "สาขาวิชาเทคนิคเครื่องกล", level: "pvs", track: "both", quota_limit: 40, is_active: true, display_order: 10 },
  { id: "maj-pvs-2", code: "PVS-PROD", name: "สาขาวิชาเทคนิคการผลิต", level: "pvs", track: "both", quota_limit: 30, is_active: true, display_order: 11 },
  { id: "maj-pvs-3", code: "PVS-WELD", name: "สาขาวิชาเทคโนโลยีการเชื่อมโครงสร้าง", level: "pvs", track: "both", quota_limit: 25, is_active: true, display_order: 12 },
  { id: "maj-pvs-4", code: "PVS-POWR", name: "สาขาวิชาไฟฟ้ากำลัง", level: "pvs", track: "both", quota_limit: 40, is_active: true, display_order: 13 },
  { id: "maj-pvs-5", code: "PVS-ELTN", name: "สาขาวิชาอิเล็กทรอนิกส์", level: "pvs", track: "both", quota_limit: 30, is_active: true, display_order: 14 },
  { id: "maj-pvs-6", code: "PVS-DIBZ", name: "สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล", level: "pvs", track: "both", quota_limit: 35, is_active: true, display_order: 15 },
  { id: "maj-pvs-7", code: "PVS-ACCT", name: "สาขาวิชาการบัญชี", level: "pvs", track: "both", quota_limit: 35, is_active: true, display_order: 16 },
  { id: "maj-pvs-8", code: "PVS-LOGS", name: "สาขาวิชาการจัดการโลจิสติกส์และซัพพลายเชน", level: "pvs", track: "both", quota_limit: 30, is_active: true, display_order: 17 },
];

const DEFAULT_ACADEMIC_YEARS: AcademicYear[] = [
  {
    id: "ay-2570",
    year: 2570,
    title: "ประจำปีการศึกษา ๒๕๗๐",
    is_active: true,
    application_start: "2026-11-01T00:00:00.000Z",
    application_end: "2027-02-28T23:59:59.000Z",
  }
];

const DEFAULT_ADMINS: AdminUser[] = [
  { id: "adm-1", email: "admin@thaluang.ac.th", full_name: "ผู้ดูแลระบบสูงสุด (Super Admin)", role: "super_admin", is_active: true, created_at: new Date().toISOString() },
  { id: "adm-2", email: "registrar@thaluang.ac.th", full_name: "เจ้าหน้าที่งานทะเบียน", role: "registrar", is_active: true, created_at: new Date().toISOString() },
  { id: "adm-3", email: "viewer@thaluang.ac.th", full_name: "ผู้อำนวยการ/ผู้บริหาร (ดูผลอย่างเดียว)", role: "viewer", is_active: true, created_at: new Date().toISOString() }
];

interface DatabaseData {
  academic_years: AcademicYear[];
  majors: Major[];
  applicants: Applicant[];
  documents: ApplicantDocument[];
  history: StatusHistory[];
  enrollments: Enrollment[];
  admins: AdminUser[];
  settings: Record<string, any>;
}

// Function to read or initialize local DB
function getLocalData(): DatabaseData {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    // Generate realistic initial applicants seed
    const initialApplicants: Applicant[] = [
      {
        id: "app-1",
        academic_year_id: "ay-2570",
        application_no: "Q70-0001",
        level_type: "pvc",
        photo_url: "/images/logo.png",
        title: "นาย",
        first_name: "สมชาย",
        last_name: "ใจดี",
        id_card_number: "1100200345678",
        birth_date: "2010-05-15",
        father_name: "นายสุรชัย ใจดี",
        father_age: 45,
        father_occupation: "เกษตรกรรม",
        mother_name: "นางสมศรี ใจดี",
        mother_age: 43,
        mother_occupation: "ค้าขาย",
        address_no: "45/2",
        address_moo: "3",
        address_soi: "-",
        address_road: "สายเอเชีย",
        subdistrict: "ท่าหลวง",
        district: "ท่าเรือ",
        province: "พระนครศรีอยุธยา",
        postal_code: "13130",
        phone_number: "0812345678",
        current_grade_level: "มัธยมศึกษาปีที่ 3",
        school_name: "โรงเรียนท่าเรือ 'นิตยานุกูล'",
        school_address: "อ.ท่าเรือ จ.พระนครศรีอยุธยา",
        gpax: 3.45,
        target_major_id: "maj-pvc-1",
        target_major_name: "สาขาวิชาช่างยนต์",
        target_major_second_id: "maj-pvc-4",
        target_major_second_name: "สาขาวิชาช่างไฟฟ้ากำลัง",
        referral_source: "ครูแนะแนว",
        pdpa_accepted: true,
        status: "pending",
        admin_remark: "เอกสารครบถ้วน รอการสัมภาษณ์รอบโควตา",
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: "app-2",
        academic_year_id: "ay-2570",
        application_no: "Q70-0002",
        level_type: "pvs_direct",
        photo_url: "/images/logo.png",
        title: "นางสาว",
        first_name: "กัญญาภัทร",
        last_name: "มั่นคง",
        id_card_number: "1100400567890",
        birth_date: "2007-08-20",
        father_name: "นายพงษ์ มั่นคง",
        father_age: 48,
        father_occupation: "รับจ้างทั่วไป",
        mother_name: "นางกาญจนา มั่นคง",
        mother_age: 46,
        mother_occupation: "พนักงานบริษัท",
        address_no: "128",
        address_moo: "5",
        address_soi: "เทศบาล 2",
        address_road: "-",
        subdistrict: "บ้านหมอ",
        district: "บ้านหมอ",
        province: "สระบุรี",
        postal_code: "18130",
        phone_number: "0898765432",
        current_grade_level: "ปวช.3",
        school_name: "วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์",
        school_address: "อ.บ้านหมอ จ.สระบุรี",
        gpax: 3.82,
        previous_major: "ช่างไฟฟ้ากำลัง",
        target_major_id: "maj-pvs-4",
        target_major_name: "สาขาวิชาไฟฟ้ากำลัง",
        referral_source: "ศิษย์เก่า / ศึกษาต่อสถาบันเดิม",
        pdpa_accepted: true,
        status: "passed",
        admin_remark: "ผ่านการคัดเลือกโควตาผลการเรียนดีเด่น",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: "app-3",
        academic_year_id: "ay-2570",
        application_no: "Q70-0003",
        level_type: "pvc",
        photo_url: "/images/logo.png",
        title: "นาย",
        first_name: "ธีรภัทร",
        last_name: "เจริญสุข",
        id_card_number: "1100500789012",
        birth_date: "2010-12-05",
        father_name: "นายภัทรดนัย เจริญสุข",
        father_age: 42,
        father_occupation: "ธุรกิจส่วนตัว",
        mother_name: "นางสุดา เจริญสุข",
        mother_age: 40,
        mother_occupation: "ค้าขาย",
        address_no: "99/1",
        address_moo: "1",
        address_soi: "-",
        address_road: "พหลโยธิน",
        subdistrict: "พระพุทธบาท",
        district: "พระพุทธบาท",
        province: "สระบุรี",
        postal_code: "18120",
        phone_number: "0865544332",
        current_grade_level: "มัธยมศึกษาปีที่ 3",
        school_name: "โรงเรียนพระพุทธบาท 'พลานุกูลวิทยา'",
        school_address: "อ.พระพุทธบาท จ.สระบุรี",
        gpax: 2.95,
        target_major_id: "maj-pvc-6",
        target_major_name: "สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล",
        target_major_second_id: "maj-pvc-7",
        target_major_second_name: "สาขาวิชาการบัญชี",
        referral_source: "โซเชียลมีเดีย (Facebook / TikTok)",
        pdpa_accepted: true,
        status: "incomplete",
        admin_remark: "เอกสารแสดงผลการเรียน (ปพ.1) ภาพไม่ชัดเจน กรุณาถ่ายหรือสแกนใหม่อีกครั้ง",
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ];

    const initialDocuments: ApplicantDocument[] = [
      {
        id: "doc-1",
        applicant_id: "app-1",
        document_type: "transcript",
        file_name: "ปพ1_สมชาย_ใจดี.pdf",
        file_path: "/uploads/sample_transcript.pdf",
        file_size: 1024 * 450,
        mime_type: "application/pdf",
        verification_status: "valid",
        uploaded_at: new Date().toISOString()
      },
      {
        id: "doc-2",
        applicant_id: "app-1",
        document_type: "id_card_house_reg",
        file_name: "สำเนาบัตรประชาชน_สมชาย.jpg",
        file_path: "/uploads/sample_id_card.jpg",
        file_size: 1024 * 320,
        mime_type: "image/jpeg",
        verification_status: "valid",
        uploaded_at: new Date().toISOString()
      },
      {
        id: "doc-3",
        applicant_id: "app-3",
        document_type: "transcript",
        file_name: "เกรด_5_ภาคเรียน.jpg",
        file_path: "/uploads/sample_transcript_blur.jpg",
        file_size: 1024 * 180,
        mime_type: "image/jpeg",
        verification_status: "invalid",
        reject_reason: "เอกสารไม่ชัดเจน ตัวหนังสือเบลอ ไม่เห็นเกรดสะสม",
        uploaded_at: new Date().toISOString()
      }
    ];

    const initialHistory: StatusHistory[] = [
      {
        id: "his-1",
        applicant_id: "app-1",
        from_status: null,
        to_status: "pending",
        reason: "ผู้สมัครยื่นใบสมัครออนไลน์เรียบร้อยแล้ว",
        changed_by_name: "ระบบรับสมัคร",
        created_at: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: "his-2",
        applicant_id: "app-2",
        from_status: "pending",
        to_status: "passed",
        reason: "ผ่านการคัดเลือกโควตากรณีพิเศษ ผลการเรียนดีเด่น (GPAX 3.82)",
        changed_by_name: "เจ้าหน้าที่งานทะเบียน",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: "his-3",
        applicant_id: "app-3",
        from_status: "pending",
        to_status: "incomplete",
        reason: "เอกสารใบ ปพ.1 ไม่ชัดเจน ขอให้ส่งใหม่",
        changed_by_name: "เจ้าหน้าที่งานทะเบียน",
        created_at: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ];

    const initialData: DatabaseData = {
      academic_years: DEFAULT_ACADEMIC_YEARS,
      majors: DEFAULT_MAJORS,
      applicants: initialApplicants,
      documents: initialDocuments,
      history: initialHistory,
      enrollments: [],
      admins: DEFAULT_ADMINS,
      settings: {
        admission_status: { is_open: true, note: "เปิดรับสมัครรอบโควตาและกรณีพิเศษ ๒๕๗๐" },
        max_upload_size_mb: 5,
        id_pattern: { pvc_prefix: "70201", pvs_prefix: "70301" },
        notification_config: { line_enabled: false, email_enabled: false }
      }
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading local db file, returning defaults:", e);
    return {
      academic_years: DEFAULT_ACADEMIC_YEARS,
      majors: DEFAULT_MAJORS,
      applicants: [],
      documents: [],
      history: [],
      enrollments: [],
      admins: DEFAULT_ADMINS,
      settings: {}
    };
  }
}

function saveLocalData(data: DatabaseData) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing local db file:", e);
  }
}

// ==============================================================================
// EXPORTED DB FUNCTIONS
// ==============================================================================

export async function getMajors(): Promise<Major[]> {
  const data = getLocalData();
  return data.majors.filter(m => m.is_active).sort((a, b) => a.display_order - b.display_order);
}

export async function getAcademicYears(): Promise<AcademicYear[]> {
  const data = getLocalData();
  return data.academic_years;
}

export async function getActiveAcademicYear(): Promise<AcademicYear> {
  const data = getLocalData();
  const active = data.academic_years.find(y => y.is_active);
  return active || DEFAULT_ACADEMIC_YEARS[0];
}

export async function createApplicant(
  applicantData: Omit<Applicant, 'id' | 'application_no' | 'created_at' | 'updated_at' | 'status'>,
  documents: Array<{
    document_type: ApplicantDocument['document_type'];
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
  }>
): Promise<Applicant> {
  const data = getLocalData();
  
  // ตรวจสอบว่าเคยสมัครไปแล้วหรือไม่ด้วยเลขบัตรประชาชน
  const existing = data.applicants.find(a => 
    a.academic_year_id === applicantData.academic_year_id && 
    a.id_card_number === applicantData.id_card_number
  );
  if (existing) {
    throw new Error(`เลขประจำตัวประชาชนนี้ได้ลงทะเบียนสมัครไว้แล้ว (เลขที่ใบสมัคร ${existing.application_no})`);
  }

  // Generate next application number e.g. Q70-0004
  const count = data.applicants.length + 1;
  const application_no = `Q70-${String(count).padStart(4, '0')}`;
  const now = new Date().toISOString();
  const applicantId = `app-${Date.now()}`;

  // Find Major Names
  const major1 = data.majors.find(m => m.id === applicantData.target_major_id);
  const major2 = applicantData.target_major_second_id 
    ? data.majors.find(m => m.id === applicantData.target_major_second_id) 
    : undefined;

  const newApplicant: Applicant = {
    ...applicantData,
    id: applicantId,
    application_no,
    status: 'pending',
    target_major_name: major1?.name,
    target_major_second_name: major2?.name,
    created_at: now,
    updated_at: now,
  };

  data.applicants.push(newApplicant);

  // Add documents
  const newDocs: ApplicantDocument[] = documents.map((doc, idx) => ({
    id: `doc-${Date.now()}-${idx}`,
    applicant_id: applicantId,
    document_type: doc.document_type,
    file_name: doc.file_name,
    file_path: doc.file_path,
    file_size: doc.file_size,
    mime_type: doc.mime_type,
    verification_status: 'pending',
    uploaded_at: now
  }));
  data.documents.push(...newDocs);

  // Add initial audit log
  data.history.push({
    id: `his-${Date.now()}`,
    applicant_id: applicantId,
    from_status: null,
    to_status: 'pending',
    reason: 'ยื่นใบสมัครออนไลน์ผ่านระบบรับสมัคร',
    changed_by_name: 'ผู้สมัคร (ระบบอัตโนมัติ)',
    created_at: now
  });

  saveLocalData(data);
  return { ...newApplicant, documents: newDocs };
}

export async function findApplicantByIdCardAndBirthDate(
  idCardNumber: string,
  birthDate: string
): Promise<Applicant | null> {
  const data = getLocalData();
  const applicant = data.applicants.find(a => 
    a.id_card_number.replace(/\D/g, '') === idCardNumber.replace(/\D/g, '') &&
    a.birth_date === birthDate
  );

  if (!applicant) return null;

  // Attach documents, history, and enrollment
  const documents = data.documents.filter(d => d.applicant_id === applicant.id);
  const history = data.history.filter(h => h.applicant_id === applicant.id).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const enrollment = data.enrollments.find(e => e.applicant_id === applicant.id) || null;

  return {
    ...applicant,
    documents,
    history,
    enrollment
  };
}

export async function getApplicantById(id: string): Promise<Applicant | null> {
  const data = getLocalData();
  const applicant = data.applicants.find(a => a.id === id);
  if (!applicant) return null;

  const documents = data.documents.filter(d => d.applicant_id === applicant.id);
  const history = data.history.filter(h => h.applicant_id === applicant.id).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const enrollment = data.enrollments.find(e => e.applicant_id === applicant.id) || null;

  return {
    ...applicant,
    documents,
    history,
    enrollment
  };
}

export async function listApplicants(filters?: {
  search?: string;
  level?: string;
  major_id?: string;
  status?: string;
  province?: string;
  page?: number;
  limit?: number;
}): Promise<{ applicants: Applicant[]; total: number }> {
  const data = getLocalData();
  let list = [...data.applicants];

  if (filters?.search) {
    const s = filters.search.trim().toLowerCase();
    list = list.filter(a => 
      a.first_name.toLowerCase().includes(s) ||
      a.last_name.toLowerCase().includes(s) ||
      a.application_no.toLowerCase().includes(s) ||
      a.id_card_number.includes(s) ||
      a.school_name.toLowerCase().includes(s)
    );
  }

  if (filters?.level && filters.level !== 'all') {
    list = list.filter(a => a.level_type === filters.level);
  }

  if (filters?.major_id && filters.major_id !== 'all') {
    list = list.filter(a => a.target_major_id === filters.major_id || a.target_major_second_id === filters.major_id);
  }

  if (filters?.status && filters.status !== 'all') {
    list = list.filter(a => a.status === filters.status);
  }

  if (filters?.province && filters.province !== 'all') {
    list = list.filter(a => a.province === filters.province);
  }

  // Sort by created_at desc
  list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const total = list.length;
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const paginated = list.slice((page - 1) * limit, page * limit);

  // Attach docs count
  const withRelations = paginated.map(app => {
    const documents = data.documents.filter(d => d.applicant_id === app.id);
    const enrollment = data.enrollments.find(e => e.applicant_id === app.id) || null;
    return { ...app, documents, enrollment };
  });

  return { applicants: withRelations, total };
}

export async function updateApplicantStatus(
  applicantId: string,
  newStatus: ApplicantStatus,
  reason: string,
  adminName: string
): Promise<Applicant> {
  const data = getLocalData();
  const applicantIndex = data.applicants.findIndex(a => a.id === applicantId);
  if (applicantIndex === -1) throw new Error("ไม่พบข้อมูลผู้สมัคร");

  const prevStatus = data.applicants[applicantIndex].status;
  data.applicants[applicantIndex].status = newStatus;
  data.applicants[applicantIndex].admin_remark = reason;
  data.applicants[applicantIndex].updated_at = new Date().toISOString();

  // Add history
  data.history.push({
    id: `his-${Date.now()}`,
    applicant_id: applicantId,
    from_status: prevStatus,
    to_status: newStatus,
    reason: reason || "เปลี่ยนสถานะโดยเจ้าหน้าที่",
    changed_by_name: adminName || "เจ้าหน้าที่",
    created_at: new Date().toISOString()
  });

  saveLocalData(data);
  return data.applicants[applicantIndex];
}

export async function updateApplicantDocuments(
  applicantId: string,
  newDocuments: Array<{
    document_type: ApplicantDocument['document_type'];
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
  }>
): Promise<ApplicantDocument[]> {
  const data = getLocalData();
  const applicant = data.applicants.find(a => a.id === applicantId);
  if (!applicant) throw new Error("ไม่พบข้อมูลผู้สมัคร");

  // Replaced / added docs
  const addedDocs: ApplicantDocument[] = newDocuments.map((doc, idx) => ({
    id: `doc-${Date.now()}-${idx}`,
    applicant_id: applicantId,
    document_type: doc.document_type,
    file_name: doc.file_name,
    file_path: doc.file_path,
    file_size: doc.file_size,
    mime_type: doc.mime_type,
    verification_status: 'pending',
    uploaded_at: new Date().toISOString()
  }));

  data.documents.push(...addedDocs);

  // If status was incomplete, update it back to pending for review
  if (applicant.status === 'incomplete') {
    applicant.status = 'pending';
    applicant.admin_remark = 'ผู้สมัครส่งเอกสารเพิ่มเติม/แก้ไขแล้ว รอเจ้าหน้าที่ตรวจซ้ำ';
    applicant.updated_at = new Date().toISOString();

    data.history.push({
      id: `his-${Date.now()}`,
      applicant_id: applicantId,
      from_status: 'incomplete',
      to_status: 'pending',
      reason: 'ผู้สมัครอัปโหลดเอกสารแก้ไขเรียบร้อยแล้ว',
      changed_by_name: 'ผู้สมัคร (ส่งเอกสารแก้)',
      created_at: new Date().toISOString()
    });
  }

  saveLocalData(data);
  return addedDocs;
}

export async function enrollApplicant(
  applicantId: string,
  dataInput: {
    student_id?: string;
    guardian_name: string;
    guardian_relation: string;
    guardian_phone: string;
    witness_name?: string;
    remarks?: string;
    recorded_by: string;
  }
): Promise<Enrollment> {
  const data = getLocalData();
  const applicant = data.applicants.find(a => a.id === applicantId);
  if (!applicant) throw new Error("ไม่พบข้อมูลผู้สมัคร");

  // Generate student id if not provided
  let student_id = dataInput.student_id;
  if (!student_id) {
    const isPVC = applicant.level_type === 'pvc';
    const prefix = isPVC ? "70201" : "70301";
    const existingCount = data.enrollments.length + 1;
    student_id = `${prefix}${String(existingCount).padStart(5, '0')}`;
  }

  const enrollment: Enrollment = {
    id: `enr-${Date.now()}`,
    applicant_id: applicantId,
    student_id,
    enrollment_date: new Date().toISOString().split('T')[0],
    guardian_name: dataInput.guardian_name,
    guardian_relation: dataInput.guardian_relation,
    guardian_phone: dataInput.guardian_phone,
    witness_name: dataInput.witness_name,
    remarks: dataInput.remarks,
    recorded_by: dataInput.recorded_by,
    created_at: new Date().toISOString()
  };

  data.enrollments.push(enrollment);
  applicant.status = 'enrolled';
  applicant.updated_at = new Date().toISOString();

  data.history.push({
    id: `his-${Date.now()}`,
    applicant_id: applicantId,
    from_status: 'passed',
    to_status: 'enrolled',
    reason: `รายงานตัวและมอบตัวสำเร็จ ได้รับรหัสนักเรียน/นักศึกษา: ${student_id}`,
    changed_by_name: dataInput.recorded_by,
    created_at: new Date().toISOString()
  });

  saveLocalData(data);
  return enrollment;
}

export async function getDashboardStats() {
  const data = getLocalData();
  const applicants = data.applicants;
  const majors = data.majors;

  // Counts by status
  const statusCounts = {
    total: applicants.length,
    pending: applicants.filter(a => a.status === 'pending').length,
    incomplete: applicants.filter(a => a.status === 'incomplete').length,
    passed: applicants.filter(a => a.status === 'passed').length,
    rejected: applicants.filter(a => a.status === 'rejected').length,
    enrolled: applicants.filter(a => a.status === 'enrolled').length,
  };

  // Counts by Level
  const levelCounts = {
    pvc: applicants.filter(a => a.level_type === 'pvc').length,
    pvs_direct: applicants.filter(a => a.level_type === 'pvs_direct').length,
    pvs_cross: applicants.filter(a => a.level_type === 'pvs_cross').length,
  };

  // Counts by Major
  const majorStats = majors.map(m => {
    const count = applicants.filter(a => a.target_major_id === m.id).length;
    return {
      id: m.id,
      code: m.code,
      name: m.name,
      level: m.level,
      quota_limit: m.quota_limit,
      applicant_count: count,
      percentage: m.quota_limit > 0 ? Math.round((count / m.quota_limit) * 100) : 0
    };
  });

  // Top feeder schools
  const schoolMap: Record<string, number> = {};
  applicants.forEach(a => {
    if (a.school_name) {
      schoolMap[a.school_name] = (schoolMap[a.school_name] || 0) + 1;
    }
  });
  const topSchools = Object.entries(schoolMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top provinces
  const provinceMap: Record<string, number> = {};
  applicants.forEach(a => {
    if (a.province) {
      provinceMap[a.province] = (provinceMap[a.province] || 0) + 1;
    }
  });
  const topProvinces = Object.entries(provinceMap)
    .map(([province, count]) => ({ province, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Referral sources breakdown
  const referralMap: Record<string, number> = {};
  applicants.forEach(a => {
    const src = a.referral_source || "อื่นๆ";
    referralMap[src] = (referralMap[src] || 0) + 1;
  });
  const referralSources = Object.entries(referralMap)
    .map(([name, count]) => ({ name, count }));

  return {
    statusCounts,
    levelCounts,
    majorStats,
    topSchools,
    topProvinces,
    referralSources
  };
}

export async function getSettings() {
  const data = getLocalData();
  return data.settings;
}

export async function updateSettings(key: string, value: any) {
  const data = getLocalData();
  data.settings[key] = value;
  saveLocalData(data);
  return data.settings;
}
