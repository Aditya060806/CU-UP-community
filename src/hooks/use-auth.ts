"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/types/portal";

interface AuthState {
  authenticated: boolean;
  role: UserRole | null;
  name: string;
  email: string;
  userId: string;
  loading: boolean;
}

export function useAuth(requiredRole?: UserRole) {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthState>({
    authenticated: false,
    role: null,
    name: "",
    email: "",
    userId: "",
    loading: true,
  });

  const check = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) {
        setAuth({
          authenticated: false,
          role: null,
          name: "",
          email: "",
          userId: "",
          loading: false,
        });
        if (requiredRole)
          router.push(
            requiredRole === "staff" ? "/staff/login" : "/student/login",
          );
        return;
      }

      const data = await res.json();
      if (!data.authenticated) {
        setAuth({
          authenticated: false,
          role: null,
          name: "",
          email: "",
          userId: "",
          loading: false,
        });
        if (requiredRole)
          router.push(
            requiredRole === "staff" ? "/staff/login" : "/student/login",
          );
        return;
      }

      setAuth({
        authenticated: true,
        role: data.role,
        name: data.name,
        email: data.email,
        userId: data.userId,
        loading: false,
      });
      if (requiredRole && data.role !== requiredRole) {
        router.push(
          data.role === "staff" ? "/staff/dashboard" : "/student/dashboard",
        );
      }
    } catch {
      setAuth({
        authenticated: false,
        role: null,
        name: "",
        email: "",
        userId: "",
        loading: false,
      });
    }
  }, [router, requiredRole]);

  useEffect(() => {
    check();
  }, [check]);

  // Poll every 10s for live sync
  useEffect(() => {
    if (!auth.authenticated) return;
    const id = setInterval(check, 10000);
    return () => clearInterval(id);
  }, [check, auth.authenticated]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return { ...auth, logout, refresh: check };
}
