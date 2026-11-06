import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import AdminNavClient from "./AdminNavClient";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // If in admin area but not logged in (and not on login page)
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <AdminNavClient session={session} />
      <main className="flex-1 overflow-y-auto min-h-screen p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
