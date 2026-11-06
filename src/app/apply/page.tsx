"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  AlertCircle, 
  User, 
  BookOpen, 
  GraduationCap, 
  FileCheck, 
  FileText, 
  Save, 
  Trash2,
  Search,
  Check,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { Major, LevelType } from "@/types";
import { validateThaiCitizenId } from "@/lib/validation";
import { searchAddress, ThaiAddressItem, THAI_PROVINCES } from "@/data/thai-address";
import { LEVEL_MAP } from "@/lib/utils";

const STORAGE_KEY = "thaluang_quota_form_draft";

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form States
  const [levelType, setLevelType] = useState<LevelType>("pvc");
  const [targetMajorId, setTargetMajorId] = useState("");
  const [targetMajorSecondId, setTargetMajorSecondId] = useState("");

  // Photo
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Applicant Info
  const [title, setTitle] = useState("นาย");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idCardNumber, setIdCardNumber] = useState("");
  const [idCardError, setIdCardError] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState("");

  // Parents
  const [fatherName, setFatherName] = useState("");
  const [fatherAge, setFatherAge] = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");
  const [motherName, setMotherName] = useState("");
  const [motherAge, setMotherAge] = useState("");
  const [motherOccupation, setMotherOccupation] = useState("");

  // Address
  const [addressNo, setAddressNo] = useState("");
  const [addressMoo, setAddressMoo] = useState("");
  const [addressSoi, setAddressSoi] = useState("");
  const [addressRoad, setAddressRoad] = useState("");
  const [subdistrict, setSubdistrict] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("สระบุรี");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Address search autocomplete
  const [addressSearchQuery, setAddressSearchQuery] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<ThaiAddressItem[]>([]);

  // Education
  const [currentGradeLevel, setCurrentGradeLevel] = useState("มัธยมศึกษาปีที่ 3");
  const [schoolName, setSchoolName] = useState("");
  const [schoolAddress, setSchoolAddress] = useState("");
  const [gpax, setGpax] = useState("");
  const [previousMajor, setPreviousMajor] = useState("");
  const [referralSource, setReferralSource] = useState("ครูแนะแนว");

  // Documents
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [idCardDocFile, setIdCardDocFile] = useState<File | null>(null);
  const [certFiles, setCertFiles] = useState<File[]>([]);
  const [pdpaAccepted, setPdpaAccepted] = useState(false);

  // Honeypot
  const [honeypot, setHoneypot] = useState("");

  // Load Majors
  useEffect(() => {
    fetch("/api/majors")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setMajors(res.data);
        }
      })
      .catch((err) => console.error("Error loading majors:", err))
      .finally(() => setLoading(false));
  }, []);

  // Restore Draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.levelType) setLevelType(d.levelType);
        if (d.targetMajorId) setTargetMajorId(d.targetMajorId);
        if (d.targetMajorSecondId) setTargetMajorSecondId(d.targetMajorSecondId);
        if (d.title) setTitle(d.title);
        if (d.firstName) setFirstName(d.firstName);
        if (d.lastName) setLastName(d.lastName);
        if (d.idCardNumber) setIdCardNumber(d.idCardNumber);
        if (d.birthDate) setBirthDate(d.birthDate);
        if (d.fatherName) setFatherName(d.fatherName);
        if (d.fatherAge) setFatherAge(d.fatherAge);
        if (d.fatherOccupation) setFatherOccupation(d.fatherOccupation);
        if (d.motherName) setMotherName(d.motherName);
        if (d.motherAge) setMotherAge(d.motherAge);
        if (d.motherOccupation) setMotherOccupation(d.motherOccupation);
        if (d.addressNo) setAddressNo(d.addressNo);
        if (d.addressMoo) setAddressMoo(d.addressMoo);
        if (d.addressSoi) setAddressSoi(d.addressSoi);
        if (d.addressRoad) setAddressRoad(d.addressRoad);
        if (d.subdistrict) setSubdistrict(d.subdistrict);
        if (d.district) setDistrict(d.district);
        if (d.province) setProvince(d.province);
        if (d.postalCode) setPostalCode(d.postalCode);
        if (d.phoneNumber) setPhoneNumber(d.phoneNumber);
        if (d.currentGradeLevel) setCurrentGradeLevel(d.currentGradeLevel);
        if (d.schoolName) setSchoolName(d.schoolName);
        if (d.schoolAddress) setSchoolAddress(d.schoolAddress);
        if (d.gpax) setGpax(d.gpax);
        if (d.previousMajor) setPreviousMajor(d.previousMajor);
        if (d.referralSource) setReferralSource(d.referralSource);
      }
    } catch (e) {
      console.error("Error loading draft:", e);
    }
  }, []);

  // Auto-save Draft
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const draft = {
          levelType,
          targetMajorId,
          targetMajorSecondId,
          title,
          firstName,
          lastName,
          idCardNumber,
          birthDate,
          fatherName,
          fatherAge,
          fatherOccupation,
          motherName,
          motherAge,
          motherOccupation,
          addressNo,
          addressMoo,
          addressSoi,
          addressRoad,
          subdistrict,
          district,
          province,
          postalCode,
          phoneNumber,
          currentGradeLevel,
          schoolName,
          schoolAddress,
          gpax,
          previousMajor,
          referralSource,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      } catch (e) {
        console.error("Error saving draft:", e);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [
    levelType, targetMajorId, targetMajorSecondId, title, firstName, lastName,
    idCardNumber, birthDate, fatherName, fatherAge, fatherOccupation,
    motherName, motherAge, motherOccupation, addressNo, addressMoo,
    addressSoi, addressRoad, subdistrict, district, province, postalCode,
    phoneNumber, currentGradeLevel, schoolName, schoolAddress, gpax,
    previousMajor, referralSource
  ]);

  // Address search query effect
  useEffect(() => {
    if (addressSearchQuery.trim().length >= 2) {
      setAddressSuggestions(searchAddress(addressSearchQuery));
    } else {
      setAddressSuggestions([]);
    }
  }, [addressSearchQuery]);

  const handleSelectAddressSuggestion = (item: ThaiAddressItem) => {
    setSubdistrict(item.subdistrict);
    setDistrict(item.district);
    setProvince(item.province);
    setPostalCode(item.postalCode);
    setAddressSearchQuery("");
    setAddressSuggestions([]);
  };

  // Filtered Majors based on Level
  const availableMajors = majors.filter((m) => {
    if (levelType === "pvc") return m.level === "pvc";
    return m.level === "pvs";
  });

  // Handle Level Change
  const handleLevelChange = (newLevel: LevelType) => {
    setLevelType(newLevel);
    setTargetMajorId("");
    setTargetMajorSecondId("");
    if (newLevel === "pvc") {
      setCurrentGradeLevel("มัธยมศึกษาปีที่ 3");
    } else if (newLevel === "pvs_direct") {
      setCurrentGradeLevel("ปวช.3 (ตรงสาขา)");
    } else {
      setCurrentGradeLevel("มัธยมศึกษาปีที่ 6 / ปวช.3 (ต่างสาขา)");
    }
  };

  // Check ID Card Real-time
  const handleIdCardChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 13);
    setIdCardNumber(raw);
    if (raw.length === 13) {
      if (validateThaiCitizenId(raw)) {
        setIdCardError(null);
      } else {
        setIdCardError("เลขประจำตัวประชาชน 13 หลักไม่ถูกต้องตามหลักเกณฑ์");
      }
    } else if (raw.length > 0) {
      setIdCardError("กรุณากรอกตัวเลขให้ครบ 13 หลัก");
    } else {
      setIdCardError(null);
    }
  };

  // Handle Photo selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("ไฟล์รูปถ่ายต้องมีขนาดไม่เกิน 5 MB");
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Step Validation
  const validateStep = (currentStep: number): boolean => {
    setErrorMsg(null);
    if (currentStep === 1) {
      if (!targetMajorId) {
        setErrorMsg("กรุณาเลือกสาขาวิชาที่ต้องการสมัคร");
        return false;
      }
      if (levelType === "pvc" && targetMajorSecondId && targetMajorSecondId === targetMajorId) {
        setErrorMsg("สาขาวิชาลำดับที่ ๑ และลำดับที่ ๒ ต้องไม่ซ้ำกัน");
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      if (!photoFile && !photoPreview) {
        setErrorMsg("กรุณาอัปโหลดรูปถ่ายหน้าตรงขนาด 1 นิ้ว");
        return false;
      }
      if (!firstName.trim() || !lastName.trim()) {
        setErrorMsg("กรุณากรอกชื่อและนามสกุล");
        return false;
      }
      if (!idCardNumber || idCardNumber.length !== 13 || !validateThaiCitizenId(idCardNumber)) {
        setErrorMsg("เลขประจำตัวประชาชน 13 หลักไม่ถูกต้อง");
        return false;
      }
      if (!birthDate) {
        setErrorMsg("กรุณาระบุวันเดือนปีเกิด");
        return false;
      }
      if (!addressNo.trim() || !subdistrict.trim() || !district.trim() || !province.trim() || !postalCode.trim()) {
        setErrorMsg("กรุณากรอกที่อยู่ให้ครบถ้วน (บ้านเลขที่, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์)");
        return false;
      }
      if (!phoneNumber || !/^0\d{9}$/.test(phoneNumber)) {
        setErrorMsg("หมายเลขโทรศัพท์ต้องเป็นตัวเลข 10 หลักและขึ้นต้นด้วย 0");
        return false;
      }
      return true;
    }

    if (currentStep === 3) {
      if (!schoolName.trim()) {
        setErrorMsg("กรุณาระบุชื่อโรงเรียนเดิม");
        return false;
      }
      const g = parseFloat(gpax);
      if (isNaN(g) || g < 0 || g > 4.0) {
        setErrorMsg("ผลการเรียนเฉลี่ยสะสม (GPAX) ต้องอยู่ระหว่าง 0.00 ถึง 4.00");
        return false;
      }
      return true;
    }

    if (currentStep === 4) {
      if (!transcriptFile) {
        setErrorMsg("กรุณาอัปโหลดเอกสารแสดงผลการเรียน 5 ภาคเรียน");
        return false;
      }
      if (!idCardDocFile) {
        setErrorMsg("กรุณาอัปโหลดสำเนาบัตรประชาชน / สำเนาทะเบียนบ้าน");
        return false;
      }
      if (!pdpaAccepted) {
        setErrorMsg("กรุณากดยินยอมให้เก็บและใช้ข้อมูลส่วนบุคคลตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)");
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clear Form Draft
  const handleClearDraft = () => {
    if (confirm("คุณต้องการล้างข้อมูลแบบร่างทั้งหมดและเริ่มใหม่ใช่หรือไม่?")) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  // Submit Application
  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("nickname_field", honeypot); // Honeypot
      formData.append("level_type", levelType);
      formData.append("target_major_id", targetMajorId);
      if (targetMajorSecondId) formData.append("target_major_second_id", targetMajorSecondId);

      formData.append("title", title);
      formData.append("first_name", firstName.trim());
      formData.append("last_name", lastName.trim());
      formData.append("id_card_number", idCardNumber);
      formData.append("birth_date", birthDate);

      formData.append("father_name", fatherName.trim());
      if (fatherAge) formData.append("father_age", fatherAge);
      formData.append("father_occupation", fatherOccupation.trim());

      formData.append("mother_name", motherName.trim());
      if (motherAge) formData.append("mother_age", motherAge);
      formData.append("mother_occupation", motherOccupation.trim());

      formData.append("address_no", addressNo.trim());
      formData.append("address_moo", addressMoo.trim());
      formData.append("address_soi", addressSoi.trim());
      formData.append("address_road", addressRoad.trim());
      formData.append("subdistrict", subdistrict.trim());
      formData.append("district", district.trim());
      formData.append("province", province.trim());
      formData.append("postal_code", postalCode.trim());
      formData.append("phone_number", phoneNumber.trim());

      formData.append("current_grade_level", currentGradeLevel);
      formData.append("school_name", schoolName.trim());
      formData.append("school_address", schoolAddress.trim());
      formData.append("gpax", gpax);
      formData.append("previous_major", previousMajor.trim());
      formData.append("referral_source", referralSource);
      formData.append("pdpa_accepted", String(pdpaAccepted));

      // Files
      if (photoFile) formData.append("photo_file", photoFile);
      if (transcriptFile) formData.append("file_transcript", transcriptFile);
      if (idCardDocFile) formData.append("file_id_card", idCardDocFile);
      certFiles.forEach((file) => {
        formData.append("file_certificate", file);
      });

      const res = await fetch("/api/apply", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "เกิดข้อผิดพลาดในการยื่นใบสมัคร");
      }

      // Success! Clear draft & Show success screen
      localStorage.removeItem(STORAGE_KEY);
      setSubmitSuccess(data.applicant);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMsg(err.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setSubmitting(false);
    }
  };

  // If successfully submitted, show success page
  if (submitSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-16 w-full">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-full">
                ส่งใบสมัครเข้าระบบสำเร็จแล้ว
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์
              </h1>
              <p className="text-slate-600 text-sm">
                ระบบได้รับข้อมูลการสมัครรอบโควตา ประจำปีการศึกษา ๒๕๗๐ ของท่านเรียบร้อยแล้ว
              </p>
            </div>

            {/* Application Details Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
                <span className="text-xs text-slate-500 font-medium">เลขที่ใบสมัคร (Application No.)</span>
                <span className="text-xl font-bold font-mono text-rose-700 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
                  {submitSuccess.application_no}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-1">
                <div>
                  <span className="text-xs text-slate-500 block">ชื่อ-นามสกุล</span>
                  <span className="font-semibold text-slate-800">{submitSuccess.first_name} {submitSuccess.last_name}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">ระดับที่สมัคร</span>
                  <span className="font-semibold text-slate-800">{LEVEL_MAP[submitSuccess.level_type as LevelType]}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-xs text-slate-500 block">สาขาวิชาที่สมัคร</span>
                  <span className="font-semibold text-rose-800">{submitSuccess.target_major_name}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs leading-relaxed text-left">
              <strong>คำแนะนำ:</strong> กรุณาจดจำเลขที่ใบสมัคร หรือใช้เลขประจำตัวประชาชนและวันเดือนปีเกิด เพื่อตรวจสอบสถานะการพิจารณาและดาวน์โหลดใบสมัคร A4 ได้ที่หน้า <strong>"ตรวจสอบสถานะ"</strong>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href={`/tracking?id=${submitSuccess.id_card_number}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-700 text-white font-semibold hover:bg-rose-800 shadow transition-all"
              >
                <Search className="w-4 h-4" />
                <span>ตรวจสอบสถานะและพิมพ์ใบสมัคร</span>
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-all"
              >
                กลับสู่หน้าหลัก
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
        {/* Header Title */}
        <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 text-xs font-semibold rounded-full mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>รอบโควตา / กรณีพิเศษ ประจำปีการศึกษา ๒๕๗๐</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              ใบสมัครเข้ารับคัดเลือกเพื่อศึกษาต่อ
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearDraft}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-rose-600 bg-white border border-slate-200 hover:border-rose-200 rounded-lg shadow-sm transition-all"
            title="ล้างข้อมูลร่าง"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ล้างข้อมูลร่าง</span>
          </button>
        </div>

        {/* Progress Bar (4 Steps) */}
        <div className="mb-8 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-4 gap-2 relative">
            {[
              { num: 1, label: "สาขาวิชา", icon: BookOpen },
              { num: 2, label: "ข้อมูลผู้สมัคร", icon: User },
              { num: 3, label: "ประวัติการศึกษา", icon: GraduationCap },
              { num: 4, label: "เอกสารหลักฐาน", icon: FileCheck },
            ].map((s) => {
              const Icon = s.icon;
              const isDone = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div key={s.num} className="flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      isDone
                        ? "bg-emerald-600 text-white shadow-sm"
                        : isCurrent
                        ? "bg-rose-700 text-white shadow-md ring-4 ring-rose-100"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      isCurrent ? "text-rose-800 font-bold" : isDone ? "text-slate-700" : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-rose-700 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
            <div>
              <strong className="font-semibold">ข้อผิดพลาด:</strong> {errorMsg}
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {/* Honeypot field for bot prevention */}
          <input
            type="text"
            name="nickname_field"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {/* STEP 1: ระดับและสาขาวิชา */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  ขั้นตอนที่ ๑: เลือกระดับและสาขาวิชาที่ต้องการสมัคร
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  เลือกประเภทหลักสูตรและสาขาวิชาตามความสนใจและคุณสมบัติทางการศึกษา
                </p>
              </div>

              {/* ระดับที่สมัคร (Radio Cards) */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-800 block">
                  ระดับชั้นที่สมัคร <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "pvc", label: "ระดับ ปวช.", desc: "ผู้จบ ม.3 หรือเทียบเท่า" },
                    { id: "pvs_direct", label: "ระดับ ปวส. (สายตรง)", desc: "ผู้จบ ปวช. ตรงสาขาวิชา" },
                    { id: "pvs_cross", label: "ระดับ ปวส. (ม.6/ปวช. ต่างสาขา)", desc: "ผู้จบ ม.6 หรือ ปวช. ต่างสาขา" },
                  ].map((item) => (
                    <label
                      key={item.id}
                      onClick={() => handleLevelChange(item.id as LevelType)}
                      className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col justify-between ${
                        levelType === item.id
                          ? "border-rose-600 bg-rose-50/50 ring-2 ring-rose-600/20"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-slate-900">{item.label}</span>
                        <input
                          type="radio"
                          name="level_type"
                          checked={levelType === item.id}
                          onChange={() => handleLevelChange(item.id as LevelType)}
                          className="text-rose-600 focus:ring-rose-500"
                        />
                      </div>
                      <span className="text-xs text-slate-500">{item.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ข้อ ๖ สาขาวิชา */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-800 block">
                    {levelType === "pvc" ? "สาขาวิชาที่ต้องการสมัคร (ลำดับที่ ๑)" : "สาขาวิชาที่ต้องการสมัคร"} <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={targetMajorId}
                    onChange={(e) => setTargetMajorId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white text-slate-900 text-sm"
                  >
                    <option value="">-- กรุณาเลือกสาขาวิชา --</option>
                    {availableMajors.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} (โควตา {m.quota_limit} ที่นั่ง)
                      </option>
                    ))}
                  </select>
                </div>

                {/* ปวช. สาขาวิชาลำดับที่ ๒ (ไม่บังคับ แต่ห้ามซ้ำ) */}
                {levelType === "pvc" && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-800 block">
                      สาขาวิชาที่ต้องการสมัคร (ลำดับที่ ๒) <span className="text-xs text-slate-400 font-normal">(กรณีไม่ผ่านอันดับ ๑ / ไม่บังคับ)</span>
                    </label>
                    <select
                      value={targetMajorSecondId}
                      onChange={(e) => setTargetMajorSecondId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white text-slate-900 text-sm"
                    >
                      <option value="">-- ไม่เลือกอันดับที่ ๒ --</option>
                      {availableMajors
                        .filter((m) => m.id !== targetMajorId)
                        .map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} (โควตา {m.quota_limit} ที่นั่ง)
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: ข้อมูลผู้สมัคร & ที่อยู่ */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  ขั้นตอนที่ ๒: ข้อมูลผู้สมัครและครอบครัว
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  กรอกข้อมูลส่วนบุคคลและข้อมูลติดต่อให้ถูกต้องตามบัตรประชาชนและทะเบียนบ้าน
                </p>
              </div>

              {/* รูปถ่ายหน้าตรงขนาด 1 นิ้ว */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-28 h-36 bg-slate-200 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0">
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="รูปถ่ายผู้สมัคร"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <User className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                      <span className="text-[10px] text-slate-500 block leading-tight">รูปถ่าย ๑ นิ้ว</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <label className="text-sm font-semibold text-slate-800 block">
                    รูปถ่ายหน้าตรง ขนาด ๑ นิ้ว <span className="text-rose-600">*</span>
                  </label>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    หน้าตรง ไม่สวมหมวกและแว่นตาดำ ถ่ายไว้ไม่เกิน ๖ เดือน (JPG, PNG ขนาดไม่เกิน 5 MB)
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-rose-400 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer shadow-sm">
                    <Upload className="w-4 h-4 text-rose-600" />
                    <span>เลือกไฟล์รูปถ่าย</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* ข้อ ๑ ข้อมูลผู้สมัคร */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-rose-900 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                  ข้อ ๑: ข้อมูลผู้สมัคร
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">คำนำหน้าชื่อ *</label>
                    <select
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="นาย">นาย</option>
                      <option value="นางสาว">นางสาว</option>
                      <option value="เด็กชาย">เด็กชาย</option>
                      <option value="เด็กหญิง">เด็กหญิง</option>
                    </select>
                  </div>
                  <div className="sm:col-span-1">
                    <label className="text-xs font-medium text-slate-700 block mb-1">ชื่อ *</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="เช่น สมชาย"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-slate-700 block mb-1">นามสกุล *</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="เช่น ใจดี"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      เลขประจำตัวประชาชน ๑๓ หลัก *
                    </label>
                    <input
                      type="text"
                      value={idCardNumber}
                      onChange={(e) => handleIdCardChange(e.target.value)}
                      maxLength={13}
                      placeholder="เช่น 1100200345678"
                      className={`w-full px-3 py-2 rounded-lg border text-sm font-mono focus:ring-2 ${
                        idCardError ? "border-rose-500 focus:ring-rose-500" : "border-slate-300 focus:ring-rose-500"
                      }`}
                    />
                    {idCardError && <p className="text-xs text-rose-600 mt-1">{idCardError}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      วันเดือนปีเกิด (ค.ศ. หรือ พ.ศ.) *
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* ข้อ ๒ & ๓ บิดาและมารดา */}
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* บิดา */}
                  <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h4 className="font-semibold text-xs text-slate-800">ข้อ ๒: ข้อมูลบิดา</h4>
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">ชื่อ-สกุลบิดา</label>
                      <input
                        type="text"
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        placeholder="เช่น นายสุรชัย ใจดี"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-slate-600 block mb-1">อายุ (ปี)</label>
                        <input
                          type="number"
                          value={fatherAge}
                          onChange={(e) => setFatherAge(e.target.value)}
                          placeholder="เช่น 45"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-600 block mb-1">อาชีพ</label>
                        <input
                          type="text"
                          value={fatherOccupation}
                          onChange={(e) => setFatherOccupation(e.target.value)}
                          placeholder="เช่น รับจ้าง/เกษตร"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* มารดา */}
                  <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h4 className="font-semibold text-xs text-slate-800">ข้อ ๓: ข้อมูลมารดา</h4>
                    <div>
                      <label className="text-xs text-slate-600 block mb-1">ชื่อ-สกุลมารดา</label>
                      <input
                        type="text"
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
                        placeholder="เช่น นางสมศรี ใจดี"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-slate-600 block mb-1">อายุ (ปี)</label>
                        <input
                          type="number"
                          value={motherAge}
                          onChange={(e) => setMotherAge(e.target.value)}
                          placeholder="เช่น 43"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-600 block mb-1">อาชีพ</label>
                        <input
                          type="text"
                          value={motherOccupation}
                          onChange={(e) => setMotherOccupation(e.target.value)}
                          placeholder="เช่น ค้าขาย"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ข้อ ๔ ที่อยู่ปัจจุบัน */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-rose-900 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                    ข้อ ๔: ที่อยู่ปัจจุบันที่สามารถติดต่อได้
                  </h3>
                </div>

                {/* Auto-complete Search Box */}
                <div className="relative">
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    ค้นหาที่อยู่อัตโนมัติ (พิมพ์รหัสไปรษณีย์ ตำบล หรืออำเภอ เพื่อกรอกรวดเร็ว)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={addressSearchQuery}
                      onChange={(e) => setAddressSearchQuery(e.target.value)}
                      placeholder="เช่น 18130 หรือ บ้านหมอ หรือ ท่าเรือ"
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-rose-200 bg-rose-50/30 text-sm focus:ring-2 focus:ring-rose-500"
                    />
                    <Search className="w-4 h-4 text-rose-500 absolute left-3 top-3" />
                  </div>

                  {addressSuggestions.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto divide-y divide-slate-100 text-xs">
                      {addressSuggestions.map((item, idx) => (
                        <li
                          key={idx}
                          onClick={() => handleSelectAddressSuggestion(item)}
                          className="p-2.5 hover:bg-rose-50 cursor-pointer flex items-center justify-between"
                        >
                          <span>
                            ต.{item.subdistrict} อ.{item.district} จ.{item.province}
                          </span>
                          <span className="font-mono font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                            {item.postalCode}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">บ้านเลขที่ *</label>
                    <input
                      type="text"
                      value={addressNo}
                      onChange={(e) => setAddressNo(e.target.value)}
                      placeholder="เช่น 45/2"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">หมู่ที่</label>
                    <input
                      type="text"
                      value={addressMoo}
                      onChange={(e) => setAddressMoo(e.target.value)}
                      placeholder="เช่น 3"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">ซอย</label>
                    <input
                      type="text"
                      value={addressSoi}
                      onChange={(e) => setAddressSoi(e.target.value)}
                      placeholder="เช่น ซอย 2"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">ถนน</label>
                    <input
                      type="text"
                      value={addressRoad}
                      onChange={(e) => setAddressRoad(e.target.value)}
                      placeholder="เช่น พหลโยธิน"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">ตำบล/แขวง *</label>
                    <input
                      type="text"
                      value={subdistrict}
                      onChange={(e) => setSubdistrict(e.target.value)}
                      placeholder="เช่น ท่าหลวง"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">อำเภอ/เขต *</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="เช่น ท่าเรือ"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">จังหวัด *</label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      {THAI_PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">รหัสไปรษณีย์ *</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value.slice(0, 5))}
                      maxLength={5}
                      placeholder="เช่น 13130"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    หมายเลขโทรศัพท์ (๑๐ หลัก) *
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="เช่น 0812345678"
                    className="w-full sm:w-1/2 px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ประวัติการศึกษาเดิม */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  ขั้นตอนที่ ๓: ข้อมูลสถานศึกษาปัจจุบันและผลการเรียน
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  กรอกข้อมูลโรงเรียนเดิม และผลการเรียนเฉลี่ยสะสม ๕ ภาคเรียน (GPAX)
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-rose-900 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                  ข้อ ๕: สถานศึกษาปัจจุบัน
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      กำลังศึกษาอยู่ในระดับชั้น *
                    </label>
                    <input
                      type="text"
                      value={currentGradeLevel}
                      onChange={(e) => setCurrentGradeLevel(e.target.value)}
                      placeholder="เช่น มัธยมศึกษาปีที่ 3 หรือ ปวช.3"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      ชื่อโรงเรียน / สถานศึกษาเดิม *
                    </label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="เช่น โรงเรียนท่าเรือ 'นิตยานุกูล'"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    ที่ตั้งโรงเรียน (เลขที่ ตำบล อำเภอ จังหวัด)
                  </label>
                  <input
                    type="text"
                    value={schoolAddress}
                    onChange={(e) => setSchoolAddress(e.target.value)}
                    placeholder="เช่น อ.ท่าเรือ จ.พระนครศรีอยุธยา"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      ผลการเรียนเฉลี่ยสะสม (GPAX ๕ ภาคเรียน) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.00"
                      max="4.00"
                      value={gpax}
                      onChange={(e) => setGpax(e.target.value)}
                      placeholder="เช่น 3.45"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-rose-500"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">ตัวเลขทศนิยม ๒ ตำแหน่ง ระหว่าง 0.00 - 4.00</span>
                  </div>

                  {levelType !== "pvc" && (
                    <div>
                      <label className="text-xs font-medium text-slate-700 block mb-1">
                        สาขาวิชาเดิม (กรณีจบ ปวช.)
                      </label>
                      <input
                        type="text"
                        value={previousMajor}
                        onChange={(e) => setPreviousMajor(e.target.value)}
                        placeholder="เช่น ช่างไฟฟ้ากำลัง, ช่างยนต์"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    ช่องทางที่รู้จักวิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์
                  </label>
                  <select
                    value={referralSource}
                    onChange={(e) => setReferralSource(e.target.value)}
                    className="w-full sm:w-1/2 px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="ครูแนะแนว">ครูแนะแนวที่โรงเรียน</option>
                    <option value="ศิษย์เก่า / รุ่นพี่">ศิษย์เก่า / รุ่นพี่แนะนำ</option>
                    <option value="โซเชียลมีเดีย (Facebook / TikTok)">โซเชียลมีเดีย (Facebook / TikTok)</option>
                    <option value="ป้ายประชาสัมพันธ์ / แผ่นพับ">ป้ายประชาสัมพันธ์ / แผ่นพับ</option>
                    <option value="เว็บไซต์วิทยาลัย">เว็บไซต์วิทยาลัย</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: อัปโหลดเอกสาร & PDPA & สรุป */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  ขั้นตอนที่ ๔: อัปโหลดเอกสารหลักฐาน และยืนยันการส่งใบสมัคร
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  แนบไฟล์เอกสารภาพถ่ายหรือ PDF ขนาดไม่เกิน 5 MB ต่อไฟล์
                </p>
              </div>

              {/* รายการเอกสารหลักฐาน */}
              <div className="space-y-4">
                {/* 1. ปพ. 5 เทอม */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      ๑. เอกสารแสดงผลการเรียนเฉลี่ยสะสม ๕ ภาคเรียน (ปพ.๑) <span className="text-rose-600">* (บังคับ)</span>
                    </span>
                    {transcriptFile && <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> แนบแล้ว</span>}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    สำเนาใบ ปพ.๑ หรือหนังสือรับรองผลการเรียนเฉลี่ย ๕ ภาคเรียน (JPG, PNG, PDF)
                  </p>
                  <input
                    type="file"
                    accept=".pdf,image/png,image/jpeg"
                    onChange={(e) => setTranscriptFile(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
                  />
                  {transcriptFile && <p className="text-xs text-slate-600 font-mono">ไฟล์: {transcriptFile.name}</p>}
                </div>

                {/* 2. สำเนาบัตร ปชช / ทะเบียนบ้าน */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      ๒. สำเนาบัตรประชาชน / สำเนาทะเบียนบ้าน <span className="text-rose-600">* (บังคับ)</span>
                    </span>
                    {idCardDocFile && <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> แนบแล้ว</span>}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    สำเนาบัตรประชาชนของผู้สมัคร หรือสำเนาทะเบียนบ้าน (JPG, PNG, PDF)
                  </p>
                  <input
                    type="file"
                    accept=".pdf,image/png,image/jpeg"
                    onChange={(e) => setIdCardDocFile(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
                  />
                  {idCardDocFile && <p className="text-xs text-slate-600 font-mono">ไฟล์: {idCardDocFile.name}</p>}
                </div>

                {/* 3. เกียรติบัตร (ไม่บังคับ) */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      ๓. สำเนาเกียรติบัตร / ใบรับรองความสามารถพิเศษ / ใบประกาศ <span className="text-slate-400 font-normal">(ถ้ามี)</span>
                    </span>
                    {certFiles.length > 0 && <span className="text-xs text-emerald-600 font-semibold">{certFiles.length} ไฟล์</span>}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    ผลงานด้านคุณธรรม จริยธรรม วิชาการ กีฬา หรือทักษะวิชาชีพ สามารถเลือกได้หลายไฟล์
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,image/png,image/jpeg"
                    onChange={(e) => setCertFiles(Array.from(e.target.files || []))}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer"
                  />
                </div>
              </div>

              {/* PDPA Consent Box */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-950 leading-relaxed">
                    <strong>การคุ้มครองข้อมูลส่วนบุคคล (PDPA):</strong> ข้อมูลและเอกสารที่ท่านกรอกจะถูกนำไปใช้เพื่อการพิจารณาคัดเลือกเข้าศึกษาต่อและจัดทำทะเบียนประวัตินักเรียน นักศึกษา ของวิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์เท่านั้น โดยจะได้รับการจัดเก็บอย่างปลอดภัยตามมาตรฐาน
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={pdpaAccepted}
                    onChange={(e) => setPdpaAccepted(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    ข้าพเจ้ายินยอมให้วิทยาลัยฯ เก็บรวบรวมและใช้ข้อมูลส่วนบุคคลตามวัตถุประสงค์ดังกล่าว <span className="text-rose-600">*</span>
                  </span>
                </label>
              </div>

              {/* Summary Box before submit */}
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 space-y-1.5">
                <div className="font-bold text-slate-900 mb-1">สรุปข้อมูลก่อนส่งใบสมัคร:</div>
                <div>• ผู้สมัคร: <strong>{title}{firstName} {lastName}</strong> (เลข ปชช: {idCardNumber})</div>
                <div>• ระดับที่สมัคร: <strong>{LEVEL_MAP[levelType]}</strong></div>
                <div>• สาขาวิชา: <strong>{availableMajors.find(m => m.id === targetMajorId)?.name}</strong></div>
                <div>• โรงเรียนเดิม: {schoolName} (GPAX: {gpax})</div>
                <div>• เบอร์โทรศัพท์: {phoneNumber}</div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>ย้อนกลับ</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-700 text-white hover:bg-rose-800 text-sm font-semibold shadow-sm transition-all"
              >
                <span>ถัดไป</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <span>กำลังบันทึกข้อมูล...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ยืนยันส่งใบสมัคร</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
