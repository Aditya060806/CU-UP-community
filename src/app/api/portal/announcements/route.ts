import { NextResponse } from "next/server";
import { createAnnouncement, deleteAnnouncement, getAnnouncements } from "@/lib/db";
import { getSessionFromCookie } from "@/lib/auth";
import crypto from "node:crypto";

export async function GET() {
  const anns = await getAnnouncements();
  // Filter expired
  const now = new Date();
  const active = anns.filter((a) => !a.expiresAt || new Date(a.expiresAt) > now);
  return NextResponse.json(active);
}

export async function POST(request: Request) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== "staff")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { title, content, priority, target, expiresAt } = body;
  if (!title || !content)
    return NextResponse.json({ error: "Title and content required" }, { status: 400 });

  const ann = await createAnnouncement({
    id: `ann-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
    title, content,
    priority: priority ?? "normal",
    target: target ?? "all",
    postedBy: session.userId,
    postedByName: session.name,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt ?? undefined,
  });
  return NextResponse.json(ann, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== "staff")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  const ok = await deleteAnnouncement(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
