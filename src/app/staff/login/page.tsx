"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

export default function StaffLogin() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "staff@cuup.in", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Login failed");
      return;
    }
    if (data.role !== "staff") {
      setError("Access denied. Staff accounts only.");
      return;
    }
    router.push("/staff/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-red-950 to-zinc-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-700/20 border border-red-700/30 mb-3">
            <Shield className="h-7 w-7 text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-white">Staff Portal</h1>
          <p className="text-zinc-400 text-sm mt-1">
            CU-UP — Authorized Staff Only
          </p>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/90 backdrop-blur-sm shadow-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Sign In</CardTitle>
            <CardDescription className="text-zinc-400">
              Default:{" "}
              <code className="text-amber-400 text-xs">staff@cuup.in</code> /{" "}
              <code className="text-amber-400 text-xs">Staff@2024</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-900/30 border border-red-800/50 rounded-lg px-3 py-2 mb-4 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-zinc-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="pl-9 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-zinc-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="pl-9 pr-9 bg-zinc-800 border-zinc-700 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPass ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-700 hover:bg-red-800 text-white font-bold"
              >
                {loading ? "Signing in…" : "Sign In as Staff"}
              </Button>
            </form>
            <p className="text-center text-xs text-zinc-500 mt-4">
              Student?{" "}
              <Link
                href="/student/login"
                className="text-amber-400 hover:underline"
              >
                Student Portal →
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
