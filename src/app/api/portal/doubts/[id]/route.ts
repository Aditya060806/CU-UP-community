import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/lib/auth";
import { getDoubtById, updateDoubt } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSessionFromCookie();
    if (!session || session.role !== "staff") {
      return NextResponse.json(
        { error: "Unauthorized. Only staff can answer doubts." },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { answer } = body;

    if (!answer || typeof answer !== "string") {
      return NextResponse.json(
        { error: "Answer is required" },
        { status: 400 },
      );
    }

    const doubt = await getDoubtById(id);
    if (!doubt) {
      return NextResponse.json({ error: "Doubt not found" }, { status: 404 });
    }

    const updated = await updateDoubt(id, {
      status: "answered",
      answer,
      answeredBy: session.userId,
      answeredByName: session.name,
      answeredAt: new Date().toISOString(),
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Doubt PATCH error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
