import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getSessionFromCookie } from "@/lib/auth";
import { createDoubt, getDoubts } from "@/lib/db";
import type { Doubt } from "@/types/portal";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromCookie();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const allDoubts = await getDoubts();

    // Sort so newest are first
    allDoubts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    if (session.role === "staff") {
      // Staff see all doubts
      return NextResponse.json(allDoubts);
    } else {
      // Students only see their own doubts
      const myDoubts = allDoubts.filter((d) => d.studentId === session.userId);
      return NextResponse.json(myDoubts);
    }
  } catch (error) {
    console.error("Doubts GET error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromCookie();
    if (!session || session.role !== "student") {
      return NextResponse.json(
        { error: "Unauthorized. Only students can post doubts." },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { question, subject } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 },
      );
    }

    const newDoubt: Doubt = {
      id: `doubt-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      studentId: session.userId,
      studentName: session.name,
      question,
      subject: subject || "General",
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await createDoubt(newDoubt);
    return NextResponse.json(newDoubt, { status: 201 });
  } catch (error) {
    console.error("Doubts POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
