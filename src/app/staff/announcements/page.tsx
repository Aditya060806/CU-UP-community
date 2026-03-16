"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Plus, Trash2, Zap } from "lucide-react";
import { PortalNav } from "@/components/portal/portal-nav";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Announcement } from "@/types/portal";

export default function StaffAnnouncements() {
  const { authenticated, loading, name, email, logout } = useAuth("staff");
  const [anns, setAnns] = useState<Announcement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    priority: "normal",
    target: "all",
    expiresAt: "",
  });

  const fetchAnns = useCallback(async () => {
    const res = await fetch("/api/portal/announcements");
    if (res.ok) setAnns(await res.json());
  }, []);

  useEffect(() => {
    if (authenticated) fetchAnns();
  }, [authenticated, fetchAnns]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    const res = await fetch("/api/portal/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        expiresAt: form.expiresAt
          ? new Date(form.expiresAt).toISOString()
          : undefined,
      }),
    });
    if (res.ok) {
      const created = await res.json();
      setAnns((prev) => [created, ...prev]);
      setForm({
        title: "",
        content: "",
        priority: "normal",
        target: "all",
        expiresAt: "",
      });
      setShowForm(false);
    }
    setPosting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    setDeleting(id);
    const res = await fetch("/api/portal/announcements", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setAnns((prev) => prev.filter((a) => a.id !== id));
    setDeleting(null);
  };

  if (loading) return null;
  if (!authenticated) return null;

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PortalNav role="staff" name={name} email={email} onLogout={logout} />

      <main className="flex-1 p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                <Bell className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  Announcements
                </h1>
                <p className="text-sm text-zinc-500">
                  Post notices visible on the student portal dashboard
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-red-700 hover:bg-red-800 text-white gap-2"
            >
              <Plus className="h-4 w-4" /> New Announcement
            </Button>
          </div>

          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="border-amber-200 dark:border-amber-800 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" /> Post New
                    Announcement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePost} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Title *</Label>
                      <Input
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                        placeholder="Announcement title..."
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Content *</Label>
                      <Textarea
                        value={form.content}
                        onChange={(e) =>
                          setForm({ ...form, content: e.target.value })
                        }
                        placeholder="What do you want students to know?"
                        rows={4}
                        className="resize-none"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label>Priority</Label>
                        <Select
                          value={form.priority}
                          onValueChange={(v) =>
                            setForm({ ...form, priority: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="urgent">🚨 Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Target</Label>
                        <Select
                          value={form.target}
                          onValueChange={(v) => setForm({ ...form, target: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Everyone</SelectItem>
                            <SelectItem value="students">Students</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Expires On</Label>
                        <Input
                          type="date"
                          value={form.expiresAt}
                          onChange={(e) =>
                            setForm({ ...form, expiresAt: e.target.value })
                          }
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={posting || !form.title || !form.content}
                        className="bg-red-700 hover:bg-red-800 text-white"
                      >
                        {posting ? "Posting…" : "Post Announcement"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="space-y-4">
            {anns.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="py-12 text-center text-zinc-400">
                  <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  No announcements yet. Post one to notify all students.
                </CardContent>
              </Card>
            ) : (
              anns.map((ann) => (
                <Card
                  key={ann.id}
                  className={`border-0 shadow-sm ${ann.priority === "urgent" ? "ring-1 ring-red-300 dark:ring-red-800" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{ann.title}</CardTitle>
                        {ann.priority === "urgent" && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs capitalize">
                          {ann.target}
                        </Badge>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(ann.id)}
                        disabled={deleting === ann.id}
                        className="text-zinc-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-zinc-500">
                      by {ann.postedByName} ·{" "}
                      {new Date(ann.createdAt).toLocaleDateString()}
                      {ann.expiresAt
                        ? ` · expires ${new Date(ann.expiresAt).toLocaleDateString()}`
                        : ""}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {ann.content}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
