import { NextResponse } from "next/server";
import { getApplicantById, updateApplicantStatus } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { ApplicantStatus } from "@/types";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: Props) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const applicant = await getApplicantById(id);
    if (!applicant) {
      return NextResponse.json({ success: false, message: "ไม่พบข้อมูลผู้สมัคร" }, { status: 404 });
    }

    return NextResponse.json({ success: true, applicant });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Props) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "viewer") {
      return NextResponse.json({ success: false, message: "ไม่มีสิทธิ์แก้ไขข้อมูล" }, { status: 403 });
    }

    const { id } = await params;
    const { status, reason } = await req.json();

    const updated = await updateApplicantStatus(
      id,
      status as ApplicantStatus,
      reason,
      session.fullName
    );

    return NextResponse.json({ success: true, applicant: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
