"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  BookOpen,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";
import { PortalNav } from "@/components/portal/portal-nav";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type {
  Announcement,
  PortalProject,
  RaggingReport,
} from "@/types/portal";

export default function StaffDashboard() {
  const { authenticated, loading, name, email, logout } = useAuth("staff");
  const [reports, setReports] = useState<RaggingReport[]>([]);
  const [projects, setProjects] = useState<PortalProject[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const fetchData = useCallback(async () => {
    const [rRes, pRes, aRes] = await Promise.all([
      fetch("/api/ragging"),
      fetch("/api/portal/projects"),
      fetch("/api/portal/announcements"),
    ]);
    if (rRes.ok) setReports(await rRes.json());
    if (pRes.ok) setProjects(await pRes.json());
    if (aRes.ok) setAnnouncements(await aRes.json());
  }, []);

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated, fetchData]);
  useEffect(() => {
    const id = setInterval(() => {
      if (authenticated) fetchData();
    }, 8000);
    return () => clearInterval(id);
  }, [authenticated, fetchData]);

  if (loading) return <Loading />;
  if (!authenticated) return null;

  const pendingRagging = reports.filter((r) => r.status === "pending").length;
  const pendingProjects = projects.filter((p) => p.status === "pending").length;
  const pendingTotal = pendingRagging + pendingProjects;

  const stats = [
    {
      label: "Pending Reports",
      value: pendingRagging,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-900/20",
      href: "/staff/ragging",
    },
    {
      label: "Pending Projects",
      value: pendingProjects,
      icon: <BookOpen className="h-5 w-5" />,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      href: "/staff/projects",
    },
    {
      label: "Total Reports",
      value: reports.length,
      icon: <Clock className="h-5 w-5" />,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      href: "/staff/ragging",
    },
    {
      label: "Approved Projects",
      value: projects.filter(
        (p) => p.status === "approved" || p.status === "featured",
      ).length,
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-900/20",
      href: "/staff/projects",
    },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PortalNav
        role="staff"
        name={name}
        email={email}
        onLogout={logout}
        pendingCount={pendingTotal}
      />

      <main className="flex-1 p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                Staff Dashboard
              </h1>
              <p className="text-zinc-500 mt-1">
                CU-UP Administration · Welcome, {name}
              </p>
            </div>
            {pendingTotal > 0 && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-2 rounded-xl text-sm font-medium">
                <AlertTriangle className="h-4 w-4" />
                {pendingTotal} item{pendingTotal !== 1 ? "s" : ""} need
                attention
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Link key={stat.label} href={stat.href}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-xs text-zinc-500">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Ragging Reports */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3 flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" /> Recent
                  Reports
                </CardTitle>
                <Button asChild variant="ghost" size="sm" className="text-xs">
                  <Link href="/staff/ragging">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <p className="text-zinc-400 text-sm text-center py-4">
                    No ragging reports yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {reports.slice(0, 4).map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50"
                      >
                        <div>
                          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                            {r.anonymous ? "Anonymous" : r.studentName}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {r.location} ·{" "}
                            {new Date(r.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            r.status === "resolved"
                              ? "default"
                              : r.status === "investigating"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs capitalize"
                        >
                          {r.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Project Submissions */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3 flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" /> Project
                  Submissions
                </CardTitle>
                <Button asChild variant="ghost" size="sm" className="text-xs">
                  <Link href="/staff/projects">Manage</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <p className="text-zinc-400 text-sm text-center py-4">
                    No project submissions yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {projects.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50"
                      >
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-zinc-500 truncate">
                            by {p.submittedByName}
                          </p>
                        </div>
                        <Badge
                          variant={
                            p.status === "approved" || p.status === "featured"
                              ? "default"
                              : p.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                          className="text-xs capitalize ml-2 shrink-0"
                        >
                          {p.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card className="border-0 shadow-sm lg:col-span-2">
              <CardHeader className="pb-3 flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-4 w-4 text-amber-500" /> Active
                  Announcements
                </CardTitle>
                <Button asChild variant="ghost" size="sm" className="text-xs">
                  <Link href="/staff/announcements">Post New</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {announcements.length === 0 ? (
                  <p className="text-zinc-400 text-sm text-center py-4">
                    No active announcements.{" "}
                    <Link
                      href="/staff/announcements"
                      className="text-red-500 hover:underline"
                    >
                      Post one →
                    </Link>
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {announcements.slice(0, 4).map((a) => (
                      <div
                        key={a.id}
                        className={`p-3 rounded-lg border text-sm ${a.priority === "urgent" ? "border-red-200 bg-red-50 dark:bg-red-900/10" : "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50"}`}
                      >
                        <p className="font-semibold text-zinc-900 dark:text-white">
                          {a.title}
                        </p>
                        <p className="text-zinc-500 text-xs mt-0.5 line-clamp-2">
                          {a.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-zinc-500 text-sm">Loading staff portal…</p>
      </div>
    </div>
  );
}
