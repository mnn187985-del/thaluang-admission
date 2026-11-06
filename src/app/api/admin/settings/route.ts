import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const settings = await getSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "เฉพาะ Super Admin เท่านั้นที่สามารถตั้งค่าระบบได้" }, { status: 403 });
    }

    const { key, value } = await req.json();
    if (!key) {
      return NextResponse.json({ success: false, message: "Key is required" }, { status: 400 });
    }

    const updated = await updateSettings(key, value);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
