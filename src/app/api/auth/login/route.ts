import { NextResponse } from "next/server";
import { loginUser, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password)
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });

    const result = await loginUser(email.trim(), password);
    if (!result.success)
      return NextResponse.json({ error: result.error }, { status: 401 });

    await setSessionCookie(result.token);
    return NextResponse.json({ role: result.role, name: result.name });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
