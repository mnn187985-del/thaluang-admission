import { NextResponse } from "next/server";
import { findApplicantByIdCardAndBirthDate } from "@/lib/db";

export const dynamic = "force-dynamic";

// Simple in-memory rate limiter: max 10 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= 15) {
    return false;
  }
  entry.count += 1;
  return true;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: "คำขอค้นหามากเกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง" },
        { status: 429 }
      );
    }

    const { idCardNumber, birthDate } = await req.json();

    if (!idCardNumber || !birthDate) {
      return NextResponse.json(
        { success: false, message: "กรุณาระบุเลขประจำตัวประชาชน 13 หลักและวันเกิด" },
        { status: 400 }
      );
    }

    const cleanId = idCardNumber.replace(/\D/g, "");
    const applicant = await findApplicantByIdCardAndBirthDate(cleanId, birthDate);

    if (!applicant) {
      return NextResponse.json(
        { success: false, message: "ไม่พบข้อมูลการสมัครที่ตรงกับเลขบัตรประชาชนและวันเกิดที่ระบุ" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      applicant,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
