import { NextResponse } from "next/server";
import { getRaggingById, updateRaggingReport } from "@/lib/db";
import { getSessionFromCookie } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const report = await getRaggingById(id);
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // Students can only see their own report
  if (session.role !== "staff" && report.studentId !== session.userId)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(report);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== "staff")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { status, staffNotes, assignedTo } = body;
  const updated = await updateRaggingReport(id, { status, staffNotes, assignedTo });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}
