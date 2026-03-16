import { NextResponse } from "next/server";
import { clearSessionCookie, getTokenFromCookie, logoutUser } from "@/lib/auth";

export async function POST() {
  const token = await getTokenFromCookie();
  if (token) await logoutUser(token);
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
