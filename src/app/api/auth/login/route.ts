import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/auth";
import { AdminUser } from "@/types";

const VALID_ADMINS: Record<string, { full_name: string; role: AdminUser["role"] }> = {
  "admin@thaluang.ac.th": { full_name: "ผู้ดูแลระบบสูงสุด (Super Admin)", role: "super_admin" },
  "registrar@thaluang.ac.th": { full_name: "เจ้าหน้าที่งานทะเบียน", role: "registrar" },
  "viewer@thaluang.ac.th": { full_name: "เจ้าหน้าที่ฝ่ายบริหาร (ดูผลอย่างเดียว)", role: "viewer" },
};

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "admin1234";

    const normalizedEmail = email?.trim().toLowerCase();
    const adminConfig = VALID_ADMINS[normalizedEmail];

    if (!adminConfig || password !== defaultPassword) {
      return NextResponse.json(
        { success: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    const adminUser: AdminUser = {
      id: `adm-${normalizedEmail.split('@')[0]}`,
      email: normalizedEmail,
      full_name: adminConfig.full_name,
      role: adminConfig.role,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    await createAdminSession(adminUser);

    return NextResponse.json({
      success: true,
      user: {
        email: adminUser.email,
        full_name: adminUser.full_name,
        role: adminUser.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
