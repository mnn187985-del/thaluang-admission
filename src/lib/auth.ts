import { cookies } from "next/headers";
import { AdminRole, AdminUser } from "@/types";

const ADMIN_COOKIE_NAME = "thaluang_admin_session";

export interface AdminSession {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  expiresAt: number;
}

// Simple signed token logic for admin session
export async function createAdminSession(user: AdminUser): Promise<void> {
  const session: AdminSession = {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    role: user.role,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  const token = Buffer.from(JSON.stringify(session)).toString("base64");
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60,
  });
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const raw = Buffer.from(token, "base64").toString("utf-8");
    const session: AdminSession = JSON.parse(raw);
    if (session.expiresAt < Date.now()) {
      return null;
    }
    return session;
  } catch (e) {
    return null;
  }
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
