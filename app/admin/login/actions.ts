"use server";

import { redirect } from "next/navigation";
import { loginAdmin } from "@/lib/auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/admin");

  const ok = await loginAdmin(password);
  if (!ok) {
    return { error: "Invalid password" };
  }

  redirect(nextPath.startsWith("/admin") ? nextPath : "/admin");
}
