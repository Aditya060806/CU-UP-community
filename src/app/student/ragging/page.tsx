"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, ChevronRight, Shield } from "lucide-react";
import { PortalNav } from "@/components/portal/portal-nav";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const steps = ["Anonymity", "Incident Details", "Contact & Evidence", "Review & Submit"];

export default function StudentRagging() {
  const { authenticated, loading, name, email, logout } = useAuth("student");
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    anonymous: false,
    incidentDate: "",
    incidentTime: "",
    location: "",
    description: "",
    witnesses: "",
    evidenceText: "",
    contactPhone: "",
  });

  const update = (key: string, val: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const canNext = () => {
    if (step === 0) return true;
    if (step === 1) return form.incidentDate.trim() && form.location.trim() && form.description.trim().length >= 20;
    if (step === 2) return true;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true); setError("");
    const res = await fetch("/api/ragging", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Submission failed"); return; }
    setSubmitted(true);
  };

  if (loading) return null;
  if (!authenticated) return null;

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PortalNav role="student" name={name} email={email} onLogout={logout} />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Anti-Ragging Complaint</h1>
              <p className="text-sm text-zinc-500">Your report is confidential and protected by law</p>
            </div>
          </div>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-14 w-14 text-green-600 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Report Submitted Successfully</h2>
                  <p className="text-green-700 dark:text-green-400 mb-2">
                    Your complaint has been received and assigned to the Anti-Ragging Cell.
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-500">
                    Reference: CU-UP-RAG-{Date.now().toString().slice(-6)}
                  </p>
                  <p className="text-xs text-green-500 mt-4">
                    You will be notified of status updates through your student portal.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="flex items-center gap-2 mb-8">
                {steps.map((s, i) => (
                  <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 transition-colors ${
                      i < step ? "bg-green-500 text-white" : i === step ? "bg-red-600 text-white" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"
                    }`}>
                      {i < step ? "✓" : i + 1}
                    </div>
                    <span className={`text-xs hidden sm:block ${i === step ? "text-red-600 font-semibold" : "text-zinc-400"}`}>{s}</span>
                    {i < steps.length - 1 && <div className={`h-px flex-1 mx-1 ${i < step ? "bg-green-400" : "bg-zinc-200 dark:bg-zinc-700"}`} />}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                  {step === 0 && (
                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle>Identity Preference</CardTitle>
                        <CardDescription>You can report anonymously. Your identity will not appear in the report.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-amber-50 dark:bg-amber-900/10">
                          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                          <div className="flex-1">
                            <p className="font-semibold text-zinc-900 dark:text-white text-sm">Submit Anonymously</p>
                            <p className="text-xs text-zinc-500 mt-0.5">Your name will not appear in the report submitted to staff</p>
                          </div>
                          <Switch checked={form.anonymous} onCheckedChange={(v) => update("anonymous", v)} />
                        </div>
                        {!form.anonymous && (
                          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              Reporting as: <strong>{name}</strong> ({email})
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {step === 1 && (
                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle>Incident Details</CardTitle>
                        <CardDescription>Describe the incident as accurately as possible</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label>Date of Incident *</Label>
                            <Input type="date" value={form.incidentDate} onChange={(e) => update("incidentDate", e.target.value)} max={new Date().toISOString().split("T")[0]} />
                          </div>
                          <div className="space-y-1.5">
                            <Label>Time (approximate)</Label>
                            <Input type="time" value={form.incidentTime} onChange={(e) => update("incidentTime", e.target.value)} />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label>Location *</Label>
                          <Input placeholder="e.g. Hostel Block C, Room 204 or Main Canteen" value={form.location} onChange={(e) => update("location", e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Description * <span className="text-xs text-zinc-400">(min 20 characters)</span></Label>
                          <Textarea
                            placeholder="Describe what happened in detail. Who was involved? What was said or done? How did it affect you?"
                            value={form.description} onChange={(e) => update("description", e.target.value)}
                            rows={6} className="resize-none"
                          />
                          <p className="text-xs text-zinc-400 text-right">{form.description.length} chars</p>
                        </div>
                        <div className="space-y-1.5">
                          <Label>Witnesses (if any)</Label>
                          <Input placeholder="Names of anyone who witnessed the incident" value={form.witnesses} onChange={(e) => update("witnesses", e.target.value)} />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {step === 2 && (
                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle>Contact & Evidence</CardTitle>
                        <CardDescription>Optional — helps investigators follow up</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                          <Label>Contact Phone (optional)</Label>
                          <Input type="tel" placeholder="Your phone number for follow-up" value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Evidence / Additional Information</Label>
                          <Textarea
                            placeholder="Describe any screenshots, photos, messages, or other evidence you have. Physical evidence can be submitted to the Anti-Ragging Cell in person."
                            value={form.evidenceText} onChange={(e) => update("evidenceText", e.target.value)}
                            rows={5} className="resize-none"
                          />
                        </div>
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300">
                          Physical evidence can be submitted to the Anti-Ragging Cell, Admin Block, Ground Floor, Monday–Friday 9am–5pm.
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {step === 3 && (
                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle>Review Your Report</CardTitle>
                        <CardDescription>Please review before submitting</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          ["Identity", form.anonymous ? "Anonymous" : name],
                          ["Date", form.incidentDate],
                          ["Time", form.incidentTime || "Not specified"],
                          ["Location", form.location],
                          ["Description", form.description.slice(0, 120) + (form.description.length > 120 ? "…" : "")],
                          ["Witnesses", form.witnesses || "None"],
                          ["Evidence", form.evidenceText ? "Provided" : "None"],
                          ["Contact", form.contactPhone || "Not provided"],
                        ].map(([label, value]) => (
                          <div key={label} className="flex gap-3 py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                            <span className="text-xs text-zinc-500 w-24 shrink-0 pt-0.5">{label}</span>
                            <span className="text-sm text-zinc-900 dark:text-zinc-100">{value}</span>
                          </div>
                        ))}
                        {error && (
                          <div className="text-red-600 text-sm flex items-center gap-2 mt-2">
                            <AlertTriangle className="h-4 w-4" /> {error}
                          </div>
                        )}
                        <div className="pt-2 text-xs text-zinc-400">
                          By submitting this report you confirm that the information provided is accurate to the best of your knowledge. False reports are a violation of university policy.
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}>← Back</Button>
                {step < steps.length - 1 ? (
                  <Button onClick={() => setStep(step + 1)} disabled={!canNext()} className="bg-red-700 hover:bg-red-800 text-white gap-1">
                    Continue <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={submitting} className="bg-red-700 hover:bg-red-800 text-white">
                    {submitting ? "Submitting…" : "Submit Report"}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
