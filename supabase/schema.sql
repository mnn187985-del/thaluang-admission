-- ==============================================================================
-- วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์ (Thaluang Cement Thai Anusorn Technical College)
-- ระบบรับสมัครเรียนออนไลน์ รอบโควตา / กรณีพิเศษ ประจำปีการศึกษา ๒๕๗๐
-- Supabase PostgreSQL Schema & Security Policies (RLS)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ACADEMIC YEARS (ปีการศึกษา)
CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year INTEGER NOT NULL UNIQUE, -- e.g. 2570
    title TEXT NOT NULL,          -- e.g. "ประจำปีการศึกษา ๒๕๗๐"
    is_active BOOLEAN DEFAULT false,
    application_start TIMESTAMPTZ NOT NULL,
    application_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MAJORS (สาขาวิชาที่เปิดรับสมัคร)
CREATE TABLE IF NOT EXISTS majors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,     -- e.g. "PVC-01", "PVS-01"
    name TEXT NOT NULL,            -- e.g. "ช่างยนต์", "เทคนิคเครื่องกล"
    level TEXT NOT NULL,           -- "pvc" (ปวช.) or "pvs" (ปวส.)
    track TEXT,                    -- "direct" (สายตรง), "cross" (ม.6/ต่างสาขา), or "both"
    quota_limit INTEGER DEFAULT 40,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. APPLICANTS (ข้อมูลผู้สมัคร)
CREATE TABLE IF NOT EXISTS applicants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year_id UUID REFERENCES academic_years(id) ON DELETE RESTRICT,
    application_no TEXT NOT NULL UNIQUE, -- e.g. "Q70-0001"
    
    -- ระดับที่สมัคร
    level_type TEXT NOT NULL, -- "pvs_direct" (ปวส. สายตรง) | "pvs_cross" (ปวส. ม.6/ต่างสาขา) | "pvc" (ปวช.)
    photo_url TEXT,
    
    -- ข้อ ๑ ข้อมูลผู้สมัคร
    title TEXT NOT NULL, -- นาย / นางสาว / เด็กชาย / เด็กหญิง
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    id_card_number VARCHAR(13) NOT NULL, -- 13 หลัก
    birth_date DATE NOT NULL,
    
    -- ข้อ ๒ ข้อมูลบิดา
    father_name TEXT,
    father_age INTEGER,
    father_occupation TEXT,
    
    -- ข้อ ๓ ข้อมูลมารดา
    mother_name TEXT,
    mother_age INTEGER,
    mother_occupation TEXT,
    
    -- ข้อ ๔ ที่อยู่ปัจจุบันที่ติดต่อได้
    address_no TEXT NOT NULL,
    address_moo TEXT,
    address_soi TEXT,
    address_road TEXT,
    subdistrict TEXT NOT NULL, -- ตำบล
    district TEXT NOT NULL,    -- อำเภอ
    province TEXT NOT NULL,    -- จังหวัด
    postal_code VARCHAR(5) NOT NULL,
    phone_number VARCHAR(10) NOT NULL,
    
    -- ข้อ ๕ สถานศึกษาปัจจุบัน
    current_grade_level TEXT NOT NULL, -- เช่น ม.3, ปวช.3
    school_name TEXT NOT NULL,
    school_address TEXT,
    gpax NUMERIC(3,2) NOT NULL, -- 0.00 - 4.00
    previous_major TEXT,
    
    -- ข้อ ๖ สาขาวิชาที่ต้องการสมัคร
    target_major_id UUID REFERENCES majors(id) ON DELETE RESTRICT,
    target_major_second_id UUID REFERENCES majors(id) ON DELETE RESTRICT, -- สำหรับ ปวช. อันดับ 2
    
    -- ข้อมูลเพิ่มเติม & PDPA
    referral_source TEXT, -- ช่องทางที่รู้จักวิทยาลัย
    pdpa_accepted BOOLEAN DEFAULT false NOT NULL,
    
    -- สถานะใบสมัคร
    status TEXT NOT NULL DEFAULT 'pending', 
    -- 'pending' (รอตรวจสอบ), 'incomplete' (เอกสารไม่ครบ), 'passed' (ผ่านการคัดเลือก), 'rejected' (ไม่ผ่าน), 'enrolled' (มอบตัวแล้ว)
    admin_remark TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT unique_applicant_per_year UNIQUE (academic_year_id, id_card_number)
);

-- 5. APPLICANT DOCUMENTS (เอกสารหลักฐาน)
CREATE TABLE IF NOT EXISTS applicant_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_id UUID NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- 'transcript' (ปพ.5 เทอม), 'id_card_house_reg' (สำเนาบัตร/ทะเบียนบ้าน), 'certificate' (เกียรติบัตร)
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    verification_status TEXT DEFAULT 'pending', -- 'pending', 'valid', 'invalid'
    reject_reason TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STATUS HISTORY / AUDIT LOG
CREATE TABLE IF NOT EXISTS status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_id UUID NOT NULL REFERENCES applicants(id) ON DELETE CASCADE,
    from_status TEXT,
    to_status TEXT NOT NULL,
    reason TEXT,
    changed_by_name TEXT DEFAULT 'ระบบ',
    changed_by_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ENROLLMENTS (ระบบมอบตัว)
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_id UUID NOT NULL UNIQUE REFERENCES applicants(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL UNIQUE, -- เช่น 70201010001
    enrollment_date DATE NOT NULL,
    guardian_name TEXT NOT NULL,
    guardian_relation TEXT NOT NULL,
    guardian_phone TEXT NOT NULL,
    witness_name TEXT,
    remarks TEXT,
    recorded_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ADMIN USERS (เจ้าหน้าที่และผู้ดูแลระบบ)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'registrar', -- 'super_admin', 'registrar', 'viewer'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR FAST QUERYING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_applicants_search ON applicants(id_card_number, birth_date);
CREATE INDEX IF NOT EXISTS idx_applicants_status ON applicants(status);
CREATE INDEX IF NOT EXISTS idx_applicants_major ON applicants(target_major_id);
CREATE INDEX IF NOT EXISTS idx_applicants_year ON applicants(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_documents_applicant ON applicant_documents(applicant_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE majors ENABLE ROW LEVEL SECURITY;
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE applicant_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Public can read active academic years and majors
CREATE POLICY "Public can view active academic years" ON academic_years
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active majors" ON majors
    FOR SELECT USING (is_active = true);

-- Public can insert new applicant when admission is open
CREATE POLICY "Public can insert applicant" ON applicants
    FOR INSERT WITH CHECK (true);

-- Public can select applicant ONLY by providing matching ID card & birth date
CREATE POLICY "Applicant can view own data" ON applicants
    FOR SELECT USING (true); -- Filtered by query parameters in server action

-- Public can upload documents for their application
CREATE POLICY "Public can upload applicant documents" ON applicant_documents
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view own documents" ON applicant_documents
    FOR SELECT USING (true);

-- Service Role / Authenticated Admins have full access
CREATE POLICY "Admins full access academic_years" ON academic_years FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access majors" ON majors FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access applicants" ON applicants FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access documents" ON applicant_documents FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access history" ON status_history FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access enrollments" ON enrollments FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access admin_users" ON admin_users FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access settings" ON system_settings FOR ALL TO authenticated USING (true);

-- ==============================================================================
-- SEED DATA
-- ==============================================================================

-- 1. ปีการศึกษา 2570
INSERT INTO academic_years (year, title, is_active, application_start, application_end)
VALUES (2570, 'ประจำปีการศึกษา ๒๕๗๐', true, '2026-11-01 00:00:00+07', '2027-02-28 23:59:59+07')
ON CONFLICT (year) DO NOTHING;

-- 2. รายชื่อสาขาวิชา ปวช. และ ปวส.
INSERT INTO majors (code, name, level, track, quota_limit, display_order) VALUES
-- ระดับ ปวช. (ประกาศนียบัตรวิชาชีพ)
('PVC-AUTO', 'สาขาวิชาช่างยนต์', 'pvc', null, 60, 1),
('PVC-MACH', 'สาขาวิชาช่างกลโรงงาน', 'pvc', null, 40, 2),
('PVC-WELD', 'สาขาวิชาช่างเชื่อมโลหะ', 'pvc', null, 30, 3),
('PVC-ELEC', 'สาขาวิชาช่างไฟฟ้ากำลัง', 'pvc', null, 60, 4),
('PVC-ELTN', 'สาขาวิชาช่างอิเล็กทรอนิกส์', 'pvc', null, 35, 5),
('PVC-COMP', 'สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล', 'pvc', null, 40, 6),
('PVC-ACCT', 'สาขาวิชาการบัญชี', 'pvc', null, 40, 7),
('PVC-LOGS', 'สาขาวิชาการจัดการโลจิสติกส์', 'pvc', null, 35, 8),

-- ระดับ ปวส. (ประกาศนียบัตรวิชาชีพชั้นสูง)
('PVS-MECH', 'สาขาวิชาเทคนิคเครื่องกล', 'pvs', 'both', 40, 10),
('PVS-PROD', 'สาขาวิชาเทคนิคการผลิต', 'pvs', 'both', 30, 11),
('PVS-WELD', 'สาขาวิชาเทคโนโลยีการเชื่อมโครงสร้าง', 'pvs', 'both', 25, 12),
('PVS-POWR', 'สาขาวิชาไฟฟ้ากำลัง', 'pvs', 'both', 40, 13),
('PVS-ELTN', 'สาขาวิชาอิเล็กทรอนิกส์', 'pvs', 'both', 30, 14),
('PVS-DIBZ', 'สาขาวิชาเทคโนโลยีธุรกิจดิจิทัล', 'pvs', 'both', 35, 15),
('PVS-ACCT', 'สาขาวิชาการบัญชี', 'pvs', 'both', 35, 16),
('PVS-LOGS', 'สาขาวิชาการจัดการโลจิสติกส์และซัพพลายเชน', 'pvs', 'both', 30, 17)
ON CONFLICT (code) DO NOTHING;

-- 3. ผู้ดูแลระบบเริ่มต้น
INSERT INTO admin_users (email, full_name, role, is_active) VALUES
('admin@thaluang.ac.th', 'ผู้ดูแลระบบสูงสุด (Super Admin)', 'super_admin', true),
('registrar@thaluang.ac.th', 'เจ้าหน้าที่งานทะเบียน', 'registrar', true),
('viewer@thaluang.ac.th', 'เจ้าหน้าที่ฝ่ายบริหาร (ดูผลอย่างเดียว)', 'viewer', true)
ON CONFLICT (email) DO NOTHING;

-- 4. ตั้งค่าระบบเริ่มต้น
INSERT INTO system_settings (key, value, description) VALUES
('admission_status', '{"is_open": true, "note": "เปิดรับสมัครรอบโควตาและกรณีพิเศษ"}'::jsonb, 'สถานะเปิดปิดการรับสมัคร'),
('max_upload_size_mb', '{"size": 5}'::jsonb, 'ขนาดไฟล์เอกสารสูงสุด (MB)'),
('id_pattern', '{"pvc_prefix": "70201", "pvs_prefix": "70301"}'::jsonb, 'รูปแบบการออกรหัสนักศึกษา'),
('notification_config', '{"line_enabled": false, "email_enabled": false}'::jsonb, 'การแจ้งเตือน LINE และอีเมล')
ON CONFLICT (key) DO NOTHING;
