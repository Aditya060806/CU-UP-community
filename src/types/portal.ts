export type UserRole = "student" | "staff";

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  password: string; // hashed
  salt: string;
  role: UserRole;
  enrollmentNo?: string; // students only
  staffId?: string; // staff only
  department?: string;
  createdAt: string;
}

export interface Session {
  token: string;
  userId: string;
  role: UserRole;
  name: string;
  email: string;
  createdAt: string;
  expiresAt: string;
}

export type RaggingStatus = "pending" | "investigating" | "resolved" | "dismissed";

export interface RaggingReport {
  id: string;
  studentId: string;
  studentName: string;
  anonymous: boolean;
  incidentDate: string;
  incidentTime: string;
  location: string;
  description: string;
  witnesses?: string;
  evidenceText?: string;
  contactPhone?: string;
  status: RaggingStatus;
  staffNotes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = "pending" | "approved" | "rejected" | "featured";

export interface PortalProject {
  id: string;
  githubUrl: string;
  name: string;
  description: string;
  language?: string;
  stars?: number;
  forks?: number;
  topics?: string[];
  image?: string;
  liveUrl?: string;
  submittedBy: string;
  submittedByName: string;
  department?: string;
  status: ProjectStatus;
  staffNotes?: string;
  categories: string[];
  createdAt: string;
  updatedAt: string;
}

export type AnnouncementTarget = "all" | "students" | "staff";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "normal" | "urgent";
  target: AnnouncementTarget;
  postedBy: string;
  postedByName: string;
  createdAt: string;
  expiresAt?: string;
}

export interface Club {
  id: string | number;
  name: string;
  college: string;
  description?: string;
  logo?: string;
  website?: string;
  memberCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GithubRepoInfo {
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  defaultBranch: string;
  htmlUrl: string;
  homepage: string | null;
  openIssues: number;
  updatedAt: string;
  avatarUrl?: string;
}

export type DoubtStatus = "open" | "answered";

export interface Doubt {
  id: string;
  studentId: string;
  studentName: string;
  question: string;
  subject?: string;
  status: DoubtStatus;
  answer?: string;
  answeredBy?: string;
  answeredByName?: string;
  createdAt: string;
  updatedAt: string;
  answeredAt?: string;
}
