import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { updateApplicantDocuments, getApplicantById } from "@/lib/db";
import { DocumentType } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const applicantId = formData.get("applicant_id") as string;
    const documentType = formData.get("document_type") as DocumentType;
    const file = formData.get("file") as File | null;

    if (!applicantId || !documentType || !file) {
      return NextResponse.json({ success: false, message: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    const applicant = await getApplicantById(applicantId);
    if (!applicant) {
      return NextResponse.json({ success: false, message: "ไม่พบข้อมูลผู้สมัคร" }, { status: 404 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(file.name) || ".pdf";
    const fileName = `reupload_${documentType}_${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));

    const addedDocs = await updateApplicantDocuments(applicantId, [
      {
        document_type: documentType,
        file_name: file.name,
        file_path: `/uploads/${fileName}`,
        file_size: file.size,
        mime_type: file.type || "application/octet-stream",
      },
    ]);

    return NextResponse.json({
      success: true,
      message: "อัปโหลดเอกสารใหม่เรียบร้อยแล้ว สถานะจะถูกส่งให้เจ้าหน้าที่ตรวจสอบอีกครั้ง",
      document: addedDocs[0],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
