import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminCookieName, getAdminSecrets, verifySessionToken } from "./auth";

export async function hasAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value;
  const { sessionSecret } = getAdminSecrets();

  return verifySessionToken(token, sessionSecret);
}

export async function requireAdminPage() {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }
}
