"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  BookOpen,
  GraduationCap,
} from "lucide-react";
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

export default function StudentLogin() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  // Register form
  const [regData, setRegData] = useState({
    name: "",
    email: "",
    password: "",
    enrollmentNo: "",
    department: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Login failed");
      return;
    }
    if (data.role === "staff") router.push("/staff/dashboard");
    else router.push("/student/dashboard");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(regData),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Registration failed");
      return;
    }
    router.push("/student/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-zinc-900 to-amber-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <GraduationCap className="h-8 w-8 text-amber-400" />
            <span className="text-2xl font-black text-white">CU-UP</span>
          </div>
          <p className="text-zinc-400 text-sm">Student Portal</p>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shadow-2xl">
          {/* Tab switcher */}
          <div className="flex border-b border-zinc-800">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTab(t);
                  setError("");
                }}
                className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
                  tab === t
                    ? "text-amber-400 border-b-2 border-amber-400"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg">
              {tab === "login" ? "Welcome back" : "Create your account"}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {tab === "login"
                ? "Sign in to your student account"
                : "Register with your CU enrollment number"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-900/30 border border-red-800/50 rounded-lg px-3 py-2 mb-4 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            {tab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-zinc-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
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
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className="pl-9 pr-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
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
                  {loading ? "Signing in…" : "Sign In"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-zinc-300">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      placeholder="Your full name"
                      required
                      value={regData.name}
                      onChange={(e) =>
                        setRegData({ ...regData, name: e.target.value })
                      }
                      className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-zinc-300">Enrollment Number</Label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      placeholder="e.g. 22BCE1234"
                      required
                      value={regData.enrollmentNo}
                      onChange={(e) =>
                        setRegData({ ...regData, enrollmentNo: e.target.value })
                      }
                      className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-zinc-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      required
                      value={regData.email}
                      onChange={(e) =>
                        setRegData({ ...regData, email: e.target.value })
                      }
                      className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-zinc-300">Department (optional)</Label>
                  <Input
                    placeholder="e.g. Computer Science & Engineering"
                    value={regData.department}
                    onChange={(e) =>
                      setRegData({ ...regData, department: e.target.value })
                    }
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-zinc-300">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      type={showPass ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      required
                      value={regData.password}
                      onChange={(e) =>
                        setRegData({ ...regData, password: e.target.value })
                      }
                      className="pl-9 pr-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
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
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  {loading ? "Creating account…" : "Create Account"}
                </Button>
              </form>
            )}

            <p className="text-center text-xs text-zinc-500 mt-4">
              Staff?{" "}
              <Link
                href="/staff/login"
                className="text-amber-400 hover:underline"
              >
                Staff Portal →
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
