import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { listApplicants } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { LEVEL_MAP, STATUS_MAP, formatThaiDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "xlsx"; // "xlsx" or "csv"

    const { applicants } = await listApplicants({ limit: 5000 });

    // Format rows for registration department export
    const rows = applicants.map((a, idx) => ({
      "ลำดับ": idx + 1,
      "เลขที่ใบสมัคร": a.application_no,
      "สถานะ": STATUS_MAP[a.status]?.label || a.status,
      "รหัสนักศึกษา (ถ้ามอบตัวแล้ว)": a.enrollment?.student_id || "-",
      "ระดับชั้นที่สมัคร": LEVEL_MAP[a.level_type],
      "สาขาวิชาที่สมัคร (อันดับ 1)": a.target_major_name,
      "สาขาวิชาอันดับ 2 (ปวช.)": a.target_major_second_name || "-",
      "คำนำหน้า": a.title,
      "ชื่อ": a.first_name,
      "นามสกุล": a.last_name,
      "เลขประจำตัวประชาชน": `'${a.id_card_number}`,
      "วันเกิด": a.birth_date,
      "เบอร์โทรศัพท์": `'${a.phone_number}`,
      "ที่อยู่": `${a.address_no} ม.${a.address_moo || "-"} ซ.${a.address_soi || "-"} ถ.${a.address_road || "-"} ต.${a.subdistrict} อ.${a.district} จ.${a.province} ${a.postal_code}`,
      "โรงเรียนเดิม": a.school_name,
      "GPAX": a.gpax,
      "สาขาเดิม": a.previous_major || "-",
      "ชื่อบิดา": a.father_name || "-",
      "อาชีพบิดา": a.father_occupation || "-",
      "ชื่อมารดา": a.mother_name || "-",
      "อาชีพมารดา": a.mother_occupation || "-",
      "ช่องทางที่รู้จัก": a.referral_source || "-",
      "วันที่สมัคร": formatThaiDate(a.created_at),
      "หมายเหตุ": a.admin_remark || "-",
    }));

    if (format === "csv") {
      // Create CSV with UTF-8 BOM
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const csvContent = XLSX.utils.sheet_to_csv(worksheet);
      const bomCsv = "\uFEFF" + csvContent;

      return new NextResponse(bomCsv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="thaluang_applicants_2570_${Date.now()}.csv"`,
        },
      });
    }

    // Default Excel .xlsx
    const worksheet = XLSX.utils.json_to_sheet(rows);
    // Auto-fit column widths
    const colWidths = Object.keys(rows[0] || {}).map((key) => ({
      wch: Math.max(key.length * 2, 15),
    }));
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ผู้สมัครโควตา 2570");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="thaluang_applicants_2570_${Date.now()}.xlsx"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
