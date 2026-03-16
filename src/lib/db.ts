"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  Announcement,
  Club,
  Doubt,
  PortalProject,
  PortalUser,
  RaggingReport,
  Session,
} from "@/types/portal";
import { communities } from "@/constants/member-colleges";

const DB_DIR = path.join(process.cwd(), "src/data/db");

async function ensureDir() {
  await fs.mkdir(DB_DIR, { recursive: true });
}

async function readJson<T>(file: string, defaultValue: T): Promise<T> {
  await ensureDir();
  const filePath = path.join(DB_DIR, file);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await ensureDir();
  await fs.writeFile(path.join(DB_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

/* ── USERS ─────────────────────────────────────────── */

export async function getUsers(): Promise<PortalUser[]> {
  return readJson<PortalUser[]>("users.json", []);
}
export async function getUserById(id: string): Promise<PortalUser | null> {
  return (await getUsers()).find((u) => u.id === id) ?? null;
}
export async function getUserByEmail(email: string): Promise<PortalUser | null> {
  return (await getUsers()).find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}
export async function createUser(user: PortalUser): Promise<PortalUser> {
  const users = await getUsers();
  users.push(user);
  await writeJson("users.json", users);
  return user;
}

/* ── SESSIONS ─────────────────────────────────────── */

export async function getSessions(): Promise<Session[]> {
  return readJson<Session[]>("sessions.json", []);
}
export async function getSessionByToken(token: string): Promise<Session | null> {
  const s = (await getSessions()).find((s) => s.token === token) ?? null;
  if (!s) return null;
  if (new Date(s.expiresAt) < new Date()) { await deleteSession(token); return null; }
  return s;
}
export async function createSession(session: Session): Promise<Session> {
  const sessions = (await getSessions()).filter((s) => new Date(s.expiresAt) > new Date());
  sessions.push(session);
  await writeJson("sessions.json", sessions);
  return session;
}
export async function deleteSession(token: string): Promise<void> {
  const sessions = await getSessions();
  await writeJson("sessions.json", sessions.filter((s) => s.token !== token));
}

/* ── RAGGING REPORTS ──────────────────────────────── */

export async function getRaggingReports(): Promise<RaggingReport[]> {
  return readJson<RaggingReport[]>("ragging.json", []);
}
export async function getRaggingById(id: string): Promise<RaggingReport | null> {
  return (await getRaggingReports()).find((r) => r.id === id) ?? null;
}
export async function createRaggingReport(report: RaggingReport): Promise<RaggingReport> {
  const reports = await getRaggingReports();
  reports.push(report);
  await writeJson("ragging.json", reports);
  return report;
}
export async function updateRaggingReport(id: string, updates: Partial<RaggingReport>): Promise<RaggingReport | null> {
  const reports = await getRaggingReports();
  const idx = reports.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  reports[idx] = { ...reports[idx], ...updates, updatedAt: new Date().toISOString() };
  await writeJson("ragging.json", reports);
  return reports[idx];
}

/* ── PORTAL PROJECTS ──────────────────────────────── */

export async function getPortalProjects(): Promise<PortalProject[]> {
  return readJson<PortalProject[]>("portal-projects.json", []);
}
export async function getPortalProjectById(id: string): Promise<PortalProject | null> {
  return (await getPortalProjects()).find((p) => p.id === id) ?? null;
}
export async function createPortalProject(project: PortalProject): Promise<PortalProject> {
  const projects = await getPortalProjects();
  projects.push(project);
  await writeJson("portal-projects.json", projects);
  return project;
}
export async function updatePortalProject(id: string, updates: Partial<PortalProject>): Promise<PortalProject | null> {
  const projects = await getPortalProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  projects[idx] = { ...projects[idx], ...updates, updatedAt: new Date().toISOString() };
  await writeJson("portal-projects.json", projects);
  return projects[idx];
}
export async function deletePortalProject(id: string): Promise<boolean> {
  const projects = await getPortalProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;
  await writeJson("portal-projects.json", filtered);
  return true;
}

/* ── ANNOUNCEMENTS ────────────────────────────────── */

export async function getAnnouncements(): Promise<Announcement[]> {
  return readJson<Announcement[]>("announcements.json", []);
}
export async function createAnnouncement(ann: Announcement): Promise<Announcement> {
  const anns = await getAnnouncements();
  anns.unshift(ann);
  await writeJson("announcements.json", anns);
  return ann;
}
export async function deleteAnnouncement(id: string): Promise<boolean> {
  const anns = await getAnnouncements();
  const filtered = anns.filter((a) => a.id !== id);
  if (filtered.length === anns.length) return false;
  await writeJson("announcements.json", filtered);
  return true;
}

/* ── CLUBS ────────────────────────────────────────── */

export async function getClubs(): Promise<Club[]> {
  const clubs = await readJson<Club[]>("clubs.json", []);
  if (clubs.length === 0) {
    const seeded = communities.map((c) => ({
      ...c,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    await writeJson("clubs.json", seeded);
    return seeded;
  }
  return clubs;
}
export async function createClub(club: Club): Promise<Club> {
  const clubs = await getClubs();
  clubs.push(club);
  await writeJson("clubs.json", clubs);
  return club;
}
export async function updateClub(id: string | number, updates: Partial<Club>): Promise<Club | null> {
  const clubs = await getClubs();
  const idx = clubs.findIndex((c) => String(c.id) === String(id));
  if (idx === -1) return null;
  clubs[idx] = { ...clubs[idx], ...updates, updatedAt: new Date().toISOString() };
  await writeJson("clubs.json", clubs);
  return clubs[idx];
}
export async function deleteClub(id: string | number): Promise<boolean> {
  const clubs = await getClubs();
  const filtered = clubs.filter((c) => String(c.id) !== String(id));
  if (filtered.length === clubs.length) return false;
  await writeJson("clubs.json", filtered);
  return true;
}

/* ── DOUBTS ───────────────────────────────────────── */

export async function getDoubts(): Promise<Doubt[]> {
  return readJson<Doubt[]>("doubts.json", []);
}
export async function getDoubtById(id: string): Promise<Doubt | null> {
  return (await getDoubts()).find((d) => d.id === id) ?? null;
}
export async function createDoubt(doubt: Doubt): Promise<Doubt> {
  const doubts = await getDoubts();
  doubts.push(doubt);
  await writeJson("doubts.json", doubts);
  return doubt;
}
export async function updateDoubt(id: string, updates: Partial<Doubt>): Promise<Doubt | null> {
  const doubts = await getDoubts();
  const idx = doubts.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  doubts[idx] = { ...doubts[idx], ...updates, updatedAt: new Date().toISOString() };
  await writeJson("doubts.json", doubts);
  return doubts[idx];
}
