import { NextResponse } from "next/server";
import { createClub, deleteClub, getClubs, updateClub } from "@/lib/db";
import { getSessionFromCookie } from "@/lib/auth";
import crypto from "node:crypto";

// Public GET — everyone can read clubs (drives /communities page)
export async function GET() {
  const clubs = await getClubs();
  return NextResponse.json(clubs);
}

export async function POST(request: Request) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== "staff")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, college, description, logo, website } = body;
  if (!name || !college)
    return NextResponse.json({ error: "Name and college are required" }, { status: 400 });

  const club = await createClub({
    id: `club-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
    name, college, description: description ?? "", logo: logo ?? "/placeholder.svg",
    website: website ?? "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return NextResponse.json(club, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== "staff")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const updated = await updateClub(id, updates);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== "staff")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const ok = await deleteClub(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
