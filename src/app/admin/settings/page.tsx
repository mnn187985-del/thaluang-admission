"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  Save, 
  Bell, 
  Database, 
  Calendar, 
  FileUp, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  Sliders
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Form states
  const [isOpen, setIsOpen] = useState(true);
  const [openNote, setOpenNote] = useState("เปิดรับสมัครรอบโควตาและกรณีพิเศษ ๒๕๗๐");
  const [maxFileSize, setMaxFileSize] = useState(5);
  const [pvcPrefix, setPvcPrefix] = useState("70201");
  const [pvsPrefix, setPvsPrefix] = useState("70301");
  const [lineEnabled, setLineEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.settings) {
          setSettings(res.settings);
          if (res.settings.admission_status) {
            setIsOpen(res.settings.admission_status.is_open);
            setOpenNote(res.settings.admission_status.note || "");
          }
          if (res.settings.max_upload_size_mb) {
            setMaxFileSize(res.settings.max_upload_size_mb.size || 5);
          }
          if (res.settings.id_pattern) {
            setPvcPrefix(res.settings.id_pattern.pvc_prefix || "70201");
            setPvsPrefix(res.settings.id_pattern.pvs_prefix || "70301");
          }
          if (res.settings.notification_config) {
            setLineEnabled(res.settings.notification_config.line_enabled || false);
            setEmailEnabled(res.settings.notification_config.email_enabled || false);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "admission_status",
          value: { is_open: isOpen, note: openNote },
        }),
      });

      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "max_upload_size_mb",
          value: { size: Number(maxFileSize) },
        }),
      });

      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "id_pattern",
          value: { pvc_prefix: pvcPrefix, pvs_prefix: pvsPrefix },
        }),
      });

      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "notification_config",
          value: { line_enabled: lineEnabled, email_enabled: emailEnabled },
        }),
      });

      setMessage("บันทึกการตั้งค่าระบบเรียบร้อยแล้ว");
    } catch (err: any) {
      alert("เกิดข้อผิดพลาดในการบันทึกการตั้งค่า");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">กำลังโหลดการตั้งค่า...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          การตั้งค่าระบบ (System Settings)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          กำหนดสถานะการเปิดรับสมัคร ขนาดไฟล์เอกสาร รูปแบบรหัสนักศึกษา และการแจ้งเตือน
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Box 1: Admission Open/Close */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calendar className="w-4 h-4 text-rose-700" />
            <h2 className="text-sm font-bold text-slate-900">
              สถานะการเปิด-ปิดระบบรับสมัคร (รอบโควตา ๒๕๗๐)
            </h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isOpen}
                onChange={(e) => setIsOpen(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
              />
              <span className="text-xs font-semibold text-slate-800">
                เปิดให้ผู้สมัครทั่วไปสามารถกรอกใบสมัครออนไลน์ได้
              </span>
            </label>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                ข้อความประกาศบนหน้าเว็บ
              </label>
              <input
                type="text"
                value={openNote}
                onChange={(e) => setOpenNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Box 2: Student ID Format */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Hash className="w-4 h-4 text-blue-700" />
            <h2 className="text-sm font-bold text-slate-900">
              รูปแบบการออกรหัสนักเรียน/นักศึกษาอัตโนมัติ (วันมอบตัว)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                คำนำหน้ารหัส ระดับ ปวช. (Prefix)
              </label>
              <input
                type="text"
                value={pvcPrefix}
                onChange={(e) => setPvcPrefix(e.target.value)}
                placeholder="70201"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">ตัวอย่าง: {pvcPrefix}00001</span>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                คำนำหน้ารหัส ระดับ ปวส. (Prefix)
              </label>
              <input
                type="text"
                value={pvsPrefix}
                onChange={(e) => setPvsPrefix(e.target.value)}
                placeholder="70301"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">ตัวอย่าง: {pvsPrefix}00001</span>
            </div>
          </div>
        </div>

        {/* Box 3: File Upload Limits */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900">
              ข้อจำกัดไฟล์เอกสารแนบ
            </h2>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              ขนาดไฟล์สูงสุดต่อเอกสาร (MB)
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={maxFileSize}
              onChange={(e) => setMaxFileSize(Number(e.target.value))}
              className="w-32 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">รองรับไฟล์ JPG, PNG และ PDF</span>
          </div>
        </div>

        {/* Box 4: Notification Toggles */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">
              โมดูลการแจ้งเตือน (Notifications Module)
            </h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={lineEnabled}
                onChange={(e) => setLineEnabled(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  แจ้งเตือนเจ้าหน้าที่ผ่าน LINE Messaging API / LINE Notify เมื่อมีใบสมัครใหม่
                </span>
                <span className="text-[11px] text-slate-500">
                  (กำหนด LINE Token ได้ในไฟล์ .env)
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={emailEnabled}
                onChange={(e) => setEmailEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  ส่งอีเมลแจ้งผู้สมัครอัตโนมัติเมื่อเจ้าหน้าที่มีการเปลี่ยนสถานะใบสมัคร
                </span>
                <span className="text-[11px] text-slate-500">
                  (กำหนด Resend API Key หรือ SMTP ในไฟล์ .env)
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่าทั้งหมด"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
