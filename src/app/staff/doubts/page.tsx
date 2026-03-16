"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Search, MessageSquare, Reply } from "lucide-react";
import { PortalNav } from "@/components/portal/portal-nav";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Doubt } from "@/types/portal";

export default function StaffDoubtsPage() {
  const { authenticated, loading, name, email, logout } = useAuth("staff");
  
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "answered">("open");
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDoubts = useCallback(async () => {
    try {
      const res = await fetch("/api/portal/doubts");
      if (res.ok) setDoubts(await res.json());
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchDoubts();
  }, [authenticated, fetchDoubts]);

  useEffect(() => {
    const id = setInterval(() => { if (authenticated) fetchDoubts(); }, 8000);
    return () => clearInterval(id);
  }, [authenticated, fetchDoubts]);

  if (loading || !authenticated) return null;

  const filteredDoubts = doubts.filter((d) => {
    const matchesSearch = d.question.toLowerCase().includes(search.toLowerCase()) || 
                          d.studentName.toLowerCase().includes(search.toLowerCase()) ||
                          (d.subject && d.subject.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === "all" || d.status === filter;
    return matchesSearch && matchesFilter;
  });

  const openCount = doubts.filter((d) => d.status === "open").length;
  const answeredCount = doubts.filter((d) => d.status === "answered").length;

  async function handleAnswer(id: string) {
    if (!answerText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/portal/doubts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: answerText }),
      });
      if (!res.ok) throw new Error("Failed to submit answer");
      
      toast.success("Answer posted successfully");
      setAnsweringId(null);
      setAnswerText("");
      fetchDoubts();
    } catch (err) {
      toast.error("Error submitting answer");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PortalNav role="staff" name={name} email={email} onLogout={logout} pendingCount={openCount} />

      <main className="flex-1 p-8 overflow-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Doubt Resolution</h1>
              <p className="text-zinc-500 mt-1">Answer questions and help students succeed.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-sm cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors" onClick={() => setFilter("all")}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{doubts.length}</p>
                  <p className="text-xs text-zinc-500 font-medium">Total Doubts</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors" onClick={() => setFilter("open")}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{openCount}</p>
                  <p className="text-xs text-zinc-500 font-medium">Waiting for Reply</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors hidden md:block" onClick={() => setFilter("answered")}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{answeredCount}</p>
                  <p className="text-xs text-zinc-500 font-medium">Resolved</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden border-0 shadow-sm">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant={filter === "all" ? "default" : "secondary"} className="cursor-pointer" onClick={() => setFilter("all")}>All</Badge>
                <Badge variant={filter === "open" ? "default" : "secondary"} className="cursor-pointer bg-amber-100 text-amber-800 hover:bg-amber-200" onClick={() => setFilter("open")}>Open</Badge>
                <Badge variant={filter === "answered" ? "default" : "secondary"} className="cursor-pointer bg-green-100 text-green-800 hover:bg-green-200" onClick={() => setFilter("answered")}>Answered</Badge>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search questions or students..."
                  className="pl-9 h-9 text-sm bg-zinc-50 dark:bg-zinc-800 border-0 focus-visible:ring-1 focus-visible:ring-red-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredDoubts.length === 0 ? (
                <div className="p-12 text-center text-zinc-500 flex flex-col items-center">
                  <MessageSquare className="h-10 w-10 mb-3 text-zinc-300" />
                  <p>No doubts found in this view.</p>
                </div>
              ) : (
                filteredDoubts.map((doubt) => (
                  <div key={doubt.id} className="p-6 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900/80 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-zinc-900 dark:text-white">{doubt.subject}</span>
                          <span className="text-zinc-400">•</span>
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{doubt.studentName}</span>
                        </div>
                        <p className="text-xs text-zinc-500">
                          {new Date(doubt.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={doubt.status === "answered" ? "default" : "secondary"} className={doubt.status === "open" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800 hover:bg-green-200"}>
                        {doubt.status === "answered" ? "Answered" : "Open"}
                      </Badge>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{doubt.question}</p>
                    </div>

                    {doubt.status === "answered" ? (
                      <div className="flex gap-3 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 mt-1">
                          <Reply className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-white mb-1">
                            {doubt.answeredByName} <span className="text-xs text-zinc-400 font-normal ml-2">{doubt.answeredAt && new Date(doubt.answeredAt).toLocaleString()}</span>
                          </p>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">{doubt.answer}</p>
                        </div>
                      </div>
                    ) : answeringId === doubt.id ? (
                      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                        <Label htmlFor={`answer-${doubt.id}`}>Your Answer</Label>
                        <Textarea
                          id={`answer-${doubt.id}`}
                          placeholder="Provide a clear, helpful answer..."
                          className="min-h-[100px]"
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          disabled={isSubmitting}
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setAnsweringId(null)} disabled={isSubmitting}>Cancel</Button>
                          <Button size="sm" className="bg-red-700 hover:bg-red-800 text-white" onClick={() => handleAnswer(doubt.id)} disabled={isSubmitting}>
                            {isSubmitting ? "Posting..." : "Post Answer"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm" onClick={() => { setAnsweringId(doubt.id); setAnswerText(""); }}>
                          <Reply className="h-4 w-4 mr-2" /> Write Answer
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
