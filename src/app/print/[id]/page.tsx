import { notFound } from "next/navigation";
import Image from "next/image";
import QRCode from "qrcode";
import { getApplicantById } from "@/lib/db";
import { formatThaiDate, toThaiDigits } from "@/lib/utils";
import PrintPageClient from "./PrintPageClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PrintApplicationPage({ params }: Props) {
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
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  return (
    <PrintPageClient applicant={applicant} qrCodeDataUrl={qrCodeDataUrl} />
  );
}
