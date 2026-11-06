import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import { getApplicantById } from "@/lib/db";
import { formatThaiDate, LEVEL_MAP, maskCitizenId } from "@/lib/utils";
import PrintEnrollmentClient from "./PrintEnrollmentClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PrintEnrollmentPage({ params }: Props) {
  const { id } = await params;
  const applicant = await getApplicantById(id);

  if (!applicant) {
    notFound();
  }

  // Generate QR Code data URL
  const qrUrl = `https://admission.thaluang.ac.th/tracking?id=${applicant.id_card_number}`;
  const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
    margin: 1,
    width: 100,
  });

  return (
    <PrintEnrollmentClient applicant={applicant} qrCodeDataUrl={qrCodeDataUrl} />
  );
}
