import { notFound } from "next/navigation";
import { getApplicantById } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import ApplicantDetailClient from "./ApplicantDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ApplicantDetailPage({ params }: Props) {
  const { id } = await params;
  const applicant = await getApplicantById(id);
  const session = await getAdminSession();

  if (!applicant) {
    notFound();
  }

  return (
    <ApplicantDetailClient
      applicant={applicant}
      currentUserRole={session?.role || "viewer"}
      currentUserName={session?.fullName || "เจ้าหน้าที่"}
    />
  );
}
