"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, MessageSquare, Send } from "lucide-react";
import { PortalNav } from "@/components/portal/portal-nav";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Doubt } from "@/types/portal";

export default function StudentDoubtsPage() {
  const { authenticated, loading, name, email, logout } = useAuth("student");

  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ subject: "", question: "" });

  const fetchDoubts = useCallback(async () => {
    try {
      const res = await fetch("/api/portal/doubts");
      if (res.ok) {
        setDoubts(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch doubts", err);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchDoubts();
  }, [authenticated, fetchDoubts]);

  // Poll for answers
  useEffect(() => {
    const id = setInterval(() => {
      if (authenticated) fetchDoubts();
    }, 8000);
    return () => clearInterval(id);
  }, [authenticated, fetchDoubts]);

  if (loading) return null;
  if (!authenticated) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.question.trim() || !formData.subject.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/portal/doubts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit doubt");

      setFormData({ subject: "", question: "" });
      toast.success("Doubt submitted successfully!");
      fetchDoubts();
    } catch (err) {
      toast.error("Failed to submit doubt. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PortalNav role="student" name={name} email={email} onLogout={logout} />

      <main className="flex-1 p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Doubts & Q&A
            </h1>
            <p className="text-zinc-500 mt-1">
              Ask questions and get answers directly from the faculty.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Ask a Question Form */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-red-600" />
                    Ask a Question
                  </CardTitle>
                  <CardDescription>Submit your doubt below</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject / Topic</Label>
                      <Input
                        id="subject"
                        placeholder="e.g. Data Structures, React..."
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="question">Your Doubt</Label>
                      <Textarea
                        id="question"
                        placeholder="Describe your question in detail..."
                        className="min-h-[120px] resize-none"
                        value={formData.question}
                        onChange={(e) =>
                          setFormData({ ...formData, question: e.target.value })
                        }
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-red-700 hover:bg-red-800 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Submitting..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" /> Submit Doubt
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* My Doubts List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                My Questions
              </h2>

              {doubts.length === 0 ? (
                <Card className="border-dashed bg-transparent shadow-none">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-zinc-500">
                    <MessageSquare className="h-12 w-12 mb-4 text-zinc-300 dark:text-zinc-700" />
                    <p>You haven't asked any questions yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {doubts.map((doubt) => (
                    <Card key={doubt.id} className="overflow-hidden">
                      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-white">
                            {doubt.subject}
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            Asked on{" "}
                            {new Date(doubt.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            doubt.status === "answered"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {doubt.status === "answered"
                            ? "Answered"
                            : "Waiting for Answer"}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                          {doubt.question}
                        </p>
                      </div>

                      {doubt.status === "answered" && doubt.answer && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/10 border-t border-red-100 dark:border-red-900/30">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                              {doubt.answeredByName?.charAt(0) || "F"}
                            </div>
                            <p className="text-xs font-semibold text-red-900 dark:text-red-300">
                              Answered by {doubt.answeredByName}
                            </p>
                          </div>
                          <p className="text-sm text-red-800 dark:text-red-200 whitespace-pre-wrap pl-8">
                            {doubt.answer}
                          </p>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
