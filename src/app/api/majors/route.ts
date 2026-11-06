import { NextResponse } from "next/server";
import { getMajors } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const majors = await getMajors();
    return NextResponse.json({ success: true, data: majors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
