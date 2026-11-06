import { NextResponse } from "next/server";
import { listApplicants, updateApplicantStatus } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { ApplicantStatus } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const level = searchParams.get("level") || undefined;
    const major_id = searchParams.get("major_id") || undefined;
    const status = searchParams.get("status") || undefined;
    const province = searchParams.get("province") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const result = await listApplicants({
      search,
      level,
      major_id,
      status,
      province,
      page,
      limit,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Bulk update status
export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "viewer") {
      return NextResponse.json({ success: false, message: "ไม่มีสิทธิ์แก้ไขข้อมูล (Viewer only)" }, { status: 403 });
    }

    const { applicantIds, status, reason } = await req.json();

    if (!Array.isArray(applicantIds) || !status) {
      return NextResponse.json({ success: false, message: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    const updated = [];
    for (const id of applicantIds) {
      const app = await updateApplicantStatus(
        id,
        status as ApplicantStatus,
        reason || `เปลี่ยนสถานะเป็นกลุ่ม (${status})`,
        session.fullName
      );
      updated.push(app);
    }

    return NextResponse.json({
      success: true,
      message: `อัปเดตสถานะสำเร็จ ${updated.length} รายการ`,
      count: updated.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
