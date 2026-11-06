import { NextResponse } from "next/server";
import { enrollApplicant } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "viewer") {
      return NextResponse.json({ success: false, message: "ไม่มีสิทธิ์บันทึกการมอบตัว" }, { status: 403 });
    }

    const {
      applicant_id,
      student_id,
      guardian_name,
      guardian_relation,
      guardian_phone,
      witness_name,
      remarks,
    } = await req.json();

    if (!applicant_id || !guardian_name || !guardian_relation || !guardian_phone) {
      return NextResponse.json({ success: false, message: "กรุณากรอกข้อมูลผู้ปกครองให้ครบถ้วน" }, { status: 400 });
    }

    const enrollment = await enrollApplicant(applicant_id, {
      student_id,
      guardian_name,
      guardian_relation,
      guardian_phone,
      witness_name,
      remarks,
      recorded_by: session.fullName,
    });

    return NextResponse.json({
      success: true,
      message: `บันทึกการมอบตัวสำเร็จ ได้รับรหัสนักเรียน/นักศึกษา: ${enrollment.student_id}`,
      enrollment,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
