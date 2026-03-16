import { redirect } from "next/navigation";
import { getSessionFromCookie } from "@/lib/auth";

export default async function StudentIndex() {
  const session = await getSessionFromCookie();
  if (!session) redirect("/student/login");
  if (session.role !== "student") redirect("/staff/dashboard");
  redirect("/student/dashboard");
}
