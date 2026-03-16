"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Github, Loader2, Search, Star, Tag, AlertTriangle } from "lucide-react";
import { PortalNav } from "@/components/portal/portal-nav";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GithubRepoInfo } from "@/types/portal";

const CATEGORIES = ["Web", "AI/ML", "Mobile", "DevOps", "IoT", "Tool", "Bot", "Security", "Other"];

export default function StudentProjects() {
  const { authenticated, loading, name, email, logout } = useAuth("student");
  const [url, setUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [repoInfo, setRepoInfo] = useState<GithubRepoInfo | null>(null);
  const [liveUrl, setLiveUrl] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fetchRepo = useCallback(async () => {
    if (!url.trim()) return;
    setFetching(true); setFetchError(""); setRepoInfo(null);
    try {
      const res = await fetch(`/api/github/repo?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();
      if (!res.ok) { setFetchError(data.error ?? "Failed to fetch repo"); setFetching(false); return; }
      setRepoInfo(data);
      setDescription(data.description ?? "");
      const auto = CATEGORIES.filter((c) =>
        data.topics?.some((t: string) => t.toLowerCase().includes(c.toLowerCase()))
      );
      setSelectedCategories(auto.length > 0 ? auto : ["Web"]);
    } catch { setFetchError("Network error — please try again"); }
    setFetching(false);
  }, [url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoInfo) return;
    setSubmitting(true); setSubmitError("");
    const res = await fetch("/api/portal/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        githubUrl: repoInfo.htmlUrl,
        name: repoInfo.name,
        description,
        language: repoInfo.language,
        stars: repoInfo.stars,
        forks: repoInfo.forks,
        topics: repoInfo.topics,
        liveUrl,
        categories: selectedCategories,
      }),
    });
    setSubmitting(false);
    if (!res.ok) { const d = await res.json(); setSubmitError(d.error ?? "Submission failed"); return; }
    setSubmitted(true);
  };

  const toggleCategory = (cat: string) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  if (loading) return null;
  if (!authenticated) return null;

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PortalNav role="student" name={name} email={email} onLogout={logout} />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <Github className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Submit a GitHub Project</h1>
              <p className="text-sm text-zinc-500">Get your open-source work featured on the CU-UP website</p>
            </div>
          </div>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-14 w-14 text-green-600 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Project Submitted!</h2>
                  <p className="text-green-700 dark:text-green-400">
                    <strong>{repoInfo?.name}</strong> is now pending staff review. Once approved, it will appear on the public projects page.
                  </p>
                  <Button onClick={() => { setSubmitted(false); setUrl(""); setRepoInfo(null); }} className="mt-6" variant="outline">
                    Submit Another Project
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Step 1: URL input */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">1. Enter GitHub Repository URL</CardTitle>
                  <CardDescription>Paste the public GitHub repo URL and we'll auto-fetch the details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        placeholder="https://github.com/username/repo-name"
                        value={url} onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && fetchRepo()}
                        className="pl-9"
                      />
                    </div>
                    <Button onClick={fetchRepo} disabled={!url.trim() || fetching} className="bg-zinc-900 hover:bg-zinc-700 text-white gap-1.5">
                      {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      {fetching ? "Fetching…" : "Fetch"}
                    </Button>
                  </div>
                  {fetchError && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> {fetchError}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Step 2: Repo preview + edit */}
              {repoInfo && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">2. Review & Customize</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Repo preview card */}
                      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 mb-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-white">{repoInfo.fullName}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                              {repoInfo.language && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />{repoInfo.language}</span>}
                              <span className="flex items-center gap-1"><Star className="h-3 w-3" />{repoInfo.stars}</span>
                            </div>
                            {repoInfo.topics.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {repoInfo.topics.slice(0, 6).map((t) => (
                                  <Badge key={t} variant="secondary" className="text-xs px-1.5 py-0">{t}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                          <Label>Description <span className="text-zinc-400 font-normal">(edit to improve)</span></Label>
                          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="resize-none" placeholder="Describe what this project does and why it's valuable..." />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Live URL <span className="text-zinc-400 font-normal">(optional)</span></Label>
                          <Input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://your-project.vercel.app" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> Categories</Label>
                          <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat) => (
                              <button
                                key={cat} type="button" onClick={() => toggleCategory(cat)}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                                  selectedCategories.includes(cat)
                                    ? "bg-red-700 text-white border-red-700"
                                    : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-red-400"
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>
                        {submitError && <p className="text-red-500 text-sm flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> {submitError}</p>}
                        <Button type="submit" disabled={submitting || selectedCategories.length === 0} className="w-full bg-red-700 hover:bg-red-800 text-white font-bold">
                          {submitting ? "Submitting…" : "Submit for Review"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
