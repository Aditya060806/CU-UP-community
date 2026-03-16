"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  ExternalLink,
  Github,
  Star,
  Trash2,
  XCircle,
  Zap,
} from "lucide-react";
import { PortalNav } from "@/components/portal/portal-nav";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PortalProject } from "@/types/portal";

export default function StaffProjects() {
  const { authenticated, loading, name, email, logout } = useAuth("staff");
  const [projects, setProjects] = useState<PortalProject[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [filter, setFilter] = useState("pending");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    const res = await fetch("/api/portal/projects");
    if (res.ok) setProjects(await res.json());
  }, []);

  useEffect(() => {
    if (authenticated) fetchProjects();
  }, [authenticated, fetchProjects]);
  useEffect(() => {
    const id = setInterval(() => {
      if (authenticated) fetchProjects();
    }, 8000);
    return () => clearInterval(id);
  }, [authenticated, fetchProjects]);

  const updateStatus = async (id: string, status: string) => {
    setSaving(id);
    const res = await fetch(`/api/portal/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, staffNotes: notes[id] ?? "" }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    }
    setSaving(null);
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project submission?")) return;
    setDeleting(id);
    const res = await fetch(`/api/portal/projects/${id}`, { method: "DELETE" });
    if (res.ok) setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  };

  if (loading) return null;
  if (!authenticated) return null;

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.status === filter);
  const pendingCount = projects.filter((p) => p.status === "pending").length;

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PortalNav
        role="staff"
        name={name}
        email={email}
        onLogout={logout}
        pendingCount={pendingCount}
      />

      <main className="flex-1 p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  Project Approvals
                </h1>
                <p className="text-sm text-zinc-500">
                  {pendingCount} pending · {projects.length} total
                </p>
              </div>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="py-12 text-center text-zinc-400">
                <CheckCircle className="h-10 w-10 mx-auto mb-3 opacity-40" />
                No projects with status "{filter}"
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map((project) => (
                <Card
                  key={project.id}
                  className="border-0 shadow-sm overflow-hidden"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={
                              project.status === "approved"
                                ? "default"
                                : project.status === "featured"
                                  ? "default"
                                  : project.status === "rejected"
                                    ? "destructive"
                                    : "secondary"
                            }
                            className={`text-xs capitalize ${project.status === "featured" ? "bg-amber-500" : ""}`}
                          >
                            {project.status === "featured"
                              ? "⭐ Featured"
                              : project.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-base truncate">
                          {project.name}
                        </CardTitle>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          by {project.submittedByName} ·{" "}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      {project.language && (
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                          {project.language}
                        </span>
                      )}
                      {project.stars != null && (
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {project.stars}
                        </span>
                      )}
                      {project.categories.map((c) => (
                        <Badge
                          key={c}
                          variant="outline"
                          className="text-xs px-1.5 py-0"
                        >
                          {c}
                        </Badge>
                      ))}
                    </div>

                    <Textarea
                      placeholder="Add review notes..."
                      value={notes[project.id] ?? project.staffNotes ?? ""}
                      onChange={(e) =>
                        setNotes((prev) => ({
                          ...prev,
                          [project.id]: e.target.value,
                        }))
                      }
                      rows={2}
                      className="resize-none text-xs"
                    />

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        onClick={() => updateStatus(project.id, "approved")}
                        disabled={
                          saving === project.id || project.status === "approved"
                        }
                        className="bg-green-700 hover:bg-green-800 text-white gap-1 text-xs flex-1"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(project.id, "featured")}
                        disabled={
                          saving === project.id || project.status === "featured"
                        }
                        className="bg-amber-500 hover:bg-amber-600 text-white gap-1 text-xs flex-1"
                      >
                        <Zap className="h-3.5 w-3.5" /> Feature
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateStatus(project.id, "rejected")}
                        disabled={
                          saving === project.id || project.status === "rejected"
                        }
                        className="gap-1 text-xs"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteProject(project.id)}
                        disabled={deleting === project.id}
                        className="text-zinc-400 hover:text-red-600 text-xs"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
