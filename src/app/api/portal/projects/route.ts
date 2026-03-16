import { NextResponse } from "next/server";
import { createPortalProject, getPortalProjects } from "@/lib/db";
import { getSessionFromCookie } from "@/lib/auth";
import crypto from "node:crypto";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");
  const session = await getSessionFromCookie();

  let projects = await getPortalProjects();

  // Public: only show approved/featured
  // Staff: see everything  // Student: see own + approved/featured
  if (!session) {
    projects = projects.filter(
      (p) => p.status === "approved" || p.status === "featured",
    );
  } else if (session.role === "student") {
    projects = projects.filter(
      (p) =>
        p.submittedBy === session.userId ||
        p.status === "approved" ||
        p.status === "featured",
    );
  }
  // staff: no filter (all)

  if (statusFilter) {
    projects = projects.filter((p) => p.status === statusFilter);
  }

  return NextResponse.json(
    projects.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );
}

export async function POST(request: Request) {
  const session = await getSessionFromCookie();
  if (!session)
    return NextResponse.json({ error: "Login required" }, { status: 401 });

  try {
    const body = await request.json();
    const {
      githubUrl,
      name,
      description,
      language,
      stars,
      forks,
      topics,
      liveUrl,
      categories,
      department,
    } = body;
    if (!githubUrl || !name)
      return NextResponse.json(
        { error: "GitHub URL and name are required" },
        { status: 400 },
      );

    const project = await createPortalProject({
      id: `proj-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      githubUrl,
      name,
      description: description ?? "",
      language,
      stars: stars ?? 0,
      forks: forks ?? 0,
      topics: topics ?? [],
      liveUrl: liveUrl ?? "",
      submittedBy: session.userId,
      submittedByName: session.name,
      department: department ?? "",
      status: session.role === "staff" ? "approved" : "pending",
      categories: categories ?? ["Web"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json(project, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
