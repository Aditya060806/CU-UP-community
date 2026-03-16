"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, ChevronDown, ChevronUp, MessageSquare, Shield } from "lucide-react";
import { PortalNav } from "@/components/portal/portal-nav";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { RaggingReport, RaggingStatus } from "@/types/portal";

const STATUS_COLORS: Record<RaggingStatus, string> = {
  pending: "destructive",
  investigating: "secondary",
  resolved: "default",
  dismissed: "outline",
};

export default function StaffRagging() {
  const { authenticated, loading, name, email, logout } = useAuth("staff");
  const [reports, setReports] = useState<RaggingReport[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchReports = useCallback(async () => {
    const res = await fetch("/api/ragging");
    if (res.ok) setReports(await res.json());
  }, []);

  useEffect(() => { if (authenticated) fetchReports(); }, [authenticated, fetchReports]);
  useEffect(() => {
    const id = setInterval(() => { if (authenticated) fetchReports(); }, 8000);
    return () => clearInterval(id);
  }, [authenticated, fetchReports]);

  const updateStatus = async (id: string, status: RaggingStatus) => {
    setSaving(id);
    const res = await fetch(`/api/ragging/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, staffNotes: notes[id] ?? "" }),
    });
    if (res.ok) {
      const updated = await res.json();
      setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
    }
    setSaving(null);
  };

  if (loading) return null;
  if (!authenticated) return null;

  const filtered = filterStatus === "all" ? reports : reports.filter((r) => r.status === filterStatus);
  const pendingCount = reports.filter((r) => r.status === "pending").length;

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PortalNav role="staff" name={name} email={email} onLogout={logout} pendingCount={pendingCount} />

      <main className="flex-1 p-8 overflow-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Ragging Reports</h1>
                <p className="text-sm text-zinc-500">{pendingCount} pending · {reports.length} total</p>
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="py-12 text-center text-zinc-400">
                <CheckCircle className="h-10 w-10 mx-auto mb-3 opacity-40" />
                No reports {filterStatus !== "all" ? `with status "${filterStatus}"` : "submitted yet"}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filtered.map((report) => (
                <Card key={report.id} className="border-0 shadow-sm overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={STATUS_COLORS[report.status] as "default" | "destructive" | "secondary" | "outline"} className="capitalize text-xs">
                            {report.status}
                          </Badge>
                          {report.anonymous && (
                            <Badge variant="outline" className="text-xs border-amber-400 text-amber-600">Anonymous</Badge>
                          )}
                        </div>
                        <CardTitle className="text-base">{report.anonymous ? "Anonymous Report" : report.studentName}</CardTitle>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {report.location} · {report.incidentDate} {report.incidentTime} · Filed {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpanded(expanded === report.id ? null : report.id)}
                        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"
                      >
                        {expanded === report.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </CardHeader>

                  {expanded === report.id && (
                    <CardContent className="pt-0 space-y-4">
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Description</p>
                          <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">{report.description}</p>
                        </div>
                        {report.witnesses && (
                          <div>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Witnesses</p>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">{report.witnesses}</p>
                          </div>
                        )}
                        {report.evidenceText && (
                          <div>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Evidence</p>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">{report.evidenceText}</p>
                          </div>
                        )}
                        {report.contactPhone && (
                          <div>
                            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Contact</p>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">{report.contactPhone}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" /> Staff Notes
                        </p>
                        <Textarea
                          placeholder="Add investigation notes, follow-up actions, resolution details..."
                          value={notes[report.id] ?? report.staffNotes ?? ""}
                          onChange={(e) => setNotes((prev) => ({ ...prev, [report.id]: e.target.value }))}
                          rows={3} className="resize-none text-sm"
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(["pending", "investigating", "resolved", "dismissed"] as RaggingStatus[]).map((s) => (
                          <Button
                            key={s} size="sm" variant={report.status === s ? "default" : "outline"}
                            disabled={saving === report.id}
                            onClick={() => updateStatus(report.id, s)}
                            className={`capitalize text-xs ${report.status === s ? "bg-red-700 text-white hover:bg-red-800" : ""}`}
                          >
                            {saving === report.id && report.status !== s ? "…" : s}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
