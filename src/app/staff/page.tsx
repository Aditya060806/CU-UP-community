import { redirect } from "next/navigation";
import { getSessionFromCookie } from "@/lib/auth";

export default async function StaffIndex() {
  const session = await getSessionFromCookie();
  if (!session) redirect("/staff/login");
  if (session.role !== "staff") redirect("/student/dashboard");
  redirect("/staff/dashboard");
}
