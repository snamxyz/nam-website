import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type AdminSession = {
  isLoggedIn: boolean;
};

const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? "fallback-session-secret-min-32-chars",
  cookieName: "nam_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};

export async function getAdminSession() {
  const cookieStore = await cookies();
  return getIronSession<AdminSession>(cookieStore, sessionOptions);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session.isLoggedIn === true;
}

export async function loginAdmin(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || password !== adminPassword) {
    return false;
  }

  const session = await getAdminSession();
  session.isLoggedIn = true;
  await session.save();
  return true;
}

export async function logoutAdmin() {
  const session = await getAdminSession();
  session.destroy();
}
