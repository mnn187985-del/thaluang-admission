import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { applicantFormSchema } from "@/lib/validation";
import { createApplicant, getActiveAcademicYear } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // 1. Anti-Bot Honeypot Check
    const honeypot = formData.get("nickname_field") as string;
    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json({ success: false, message: "Spam detected" }, { status: 400 });
    }

    // 2. Extract Fields for Validation
    const rawData = {
      level_type: formData.get("level_type"),
      photo_url: formData.get("photo_url") || "pending",
      title: formData.get("title"),
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      id_card_number: (formData.get("id_card_number") as string)?.replace(/\D/g, ""),
      birth_date: formData.get("birth_date"),
      father_name: formData.get("father_name") || "",
      father_age: formData.get("father_age") ? Number(formData.get("father_age")) : null,
      father_occupation: formData.get("father_occupation") || "",
      mother_name: formData.get("mother_name") || "",
      mother_age: formData.get("mother_age") ? Number(formData.get("mother_age")) : null,
      mother_occupation: formData.get("mother_occupation") || "",
      address_no: formData.get("address_no"),
      address_moo: formData.get("address_moo") || "",
      address_soi: formData.get("address_soi") || "",
      address_road: formData.get("address_road") || "",
      subdistrict: formData.get("subdistrict"),
      district: formData.get("district"),
      province: formData.get("province"),
      postal_code: formData.get("postal_code"),
      phone_number: (formData.get("phone_number") as string)?.replace(/\D/g, ""),
      current_grade_level: formData.get("current_grade_level"),
      school_name: formData.get("school_name"),
      school_address: formData.get("school_address") || "",
      gpax: Number(formData.get("gpax")),
      previous_major: formData.get("previous_major") || "",
      target_major_id: formData.get("target_major_id"),
      target_major_second_id: formData.get("target_major_second_id") || null,
      referral_source: formData.get("referral_source") || "",
      pdpa_accepted: formData.get("pdpa_accepted") === "true",
    };

    // 3. Zod Server Validation
    const parsed = applicantFormSchema.safeParse(rawData);
    if (!parsed.success) {
      const errorMsg = parsed.error.errors.map(e => e.message).join(", ");
      return NextResponse.json({ success: false, message: errorMsg, errors: parsed.error.errors }, { status: 400 });
    }

    // 4. File uploads handling
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Handle 1-inch Photo
    const photoFile = formData.get("photo_file") as File | null;
    let finalPhotoUrl = "/images/logo.png";
    if (photoFile && photoFile.size > 0) {
      const ext = path.extname(photoFile.name) || ".jpg";
      const photoName = `photo_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
      const photoPath = path.join(uploadsDir, photoName);
      const buffer = Buffer.from(await photoFile.arrayBuffer());
      fs.writeFileSync(photoPath, buffer);
      finalPhotoUrl = `/uploads/${photoName}`;
    }

    // Handle Documents (Transcript, ID card copy, Certificates)
    const documentsToCreate: Array<{
      document_type: 'transcript' | 'id_card_house_reg' | 'certificate';
      file_name: string;
      file_path: string;
      file_size: number;
      mime_type: string;
    }> = [];

    // 1) Transcript
    const transcriptFile = formData.get("file_transcript") as File | null;
    if (transcriptFile && transcriptFile.size > 0) {
      const ext = path.extname(transcriptFile.name) || ".pdf";
      const fileName = `transcript_${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(await transcriptFile.arrayBuffer()));
      documentsToCreate.push({
        document_type: "transcript",
        file_name: transcriptFile.name,
        file_path: `/uploads/${fileName}`,
        file_size: transcriptFile.size,
        mime_type: transcriptFile.type || "application/octet-stream",
      });
    }

    // 2) ID Card & House Registration
    const idCardFile = formData.get("file_id_card") as File | null;
    if (idCardFile && idCardFile.size > 0) {
      const ext = path.extname(idCardFile.name) || ".jpg";
      const fileName = `idcard_${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(await idCardFile.arrayBuffer()));
      documentsToCreate.push({
        document_type: "id_card_house_reg",
        file_name: idCardFile.name,
        file_path: `/uploads/${fileName}`,
        file_size: idCardFile.size,
        mime_type: idCardFile.type || "application/octet-stream",
      });
    }

    // 3) Additional certificates (if any)
    const certFiles = formData.getAll("file_certificate") as File[];
    for (const cert of certFiles) {
      if (cert && cert.size > 0) {
        const ext = path.extname(cert.name) || ".pdf";
        const fileName = `cert_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, Buffer.from(await cert.arrayBuffer()));
        documentsToCreate.push({
          document_type: "certificate",
          file_name: cert.name,
          file_path: `/uploads/${fileName}`,
          file_size: cert.size,
          mime_type: cert.type || "application/octet-stream",
        });
      }
    }

    // 5. Active Academic Year
    const activeYear = await getActiveAcademicYear();

    // 6. Save applicant to DB
    const newApplicant = await createApplicant(
      {
        ...parsed.data,
        academic_year_id: activeYear.id,
        photo_url: finalPhotoUrl,
      },
      documentsToCreate
    );

    return NextResponse.json({
      success: true,
      message: "ยื่นใบสมัครสำเร็จ",
      applicant: {
        id: newApplicant.id,
        application_no: newApplicant.application_no,
        first_name: newApplicant.first_name,
        last_name: newApplicant.last_name,
        id_card_number: newApplicant.id_card_number,
        level_type: newApplicant.level_type,
        target_major_name: newApplicant.target_major_name,
        status: newApplicant.status,
      },
    });
  } catch (error: any) {
    console.error("Apply error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล" },
      { status: 400 }
    );
  }
}
