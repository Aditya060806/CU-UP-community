import { NextResponse } from "next/server";
import { createRaggingReport, getRaggingReports } from "@/lib/db";
import { getSessionFromCookie } from "@/lib/auth";
import crypto from "node:crypto";

export async function GET() {
  const session = await getSessionFromCookie();
  if (!session || session.role !== "staff")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reports = await getRaggingReports();
  return NextResponse.json(reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
}

export async function POST(request: Request) {
  const session = await getSessionFromCookie();
  if (!session)
    return NextResponse.json({ error: "Login required to submit a report" }, { status: 401 });

  try {
    const body = await request.json();
    const { anonymous, incidentDate, incidentTime, location, description, witnesses, evidenceText, contactPhone } = body;
    if (!incidentDate || !location || !description)
      return NextResponse.json({ error: "Date, location, and description are required" }, { status: 400 });

    const report = await createRaggingReport({
      id: `ragging-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      studentId: session.userId,
      studentName: anonymous ? "Anonymous" : session.name,
      anonymous: !!anonymous,
      incidentDate, incidentTime: incidentTime ?? "",
      location, description,
      witnesses: witnesses ?? "",
      evidenceText: evidenceText ?? "",
      contactPhone: contactPhone ?? "",
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json(report, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
