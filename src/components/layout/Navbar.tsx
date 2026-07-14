"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import type { User } from "@/types";

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const cookie = document.cookie
        .split("; ")
        .find((c) => c.startsWith("access_token="));
      if (cookie) {
        const token = cookie.split("=")[1];
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          id: payload.userId,
          role: payload.role,
          name: "",
          email: "",
        });
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/refresh", { method: "POST" })
      .then((res) => (res.ok ? res.json() : null))
      .then(() => fetchCurrentUser())
      .catch(() => setLoading(false));
  }, [fetchCurrentUser]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="bg-amber-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tight">
              Beer Drop
            </span>
            <span className="text-amber-300 text-sm hidden sm:inline">
              Craft Beer
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="hover:text-amber-300 transition-colors text-sm"
                    >
                      Mis Pedidos
                    </Link>
                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin/orders"
                        className="hover:text-amber-300 transition-colors text-sm"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="bg-amber-700 hover:bg-amber-600 px-3 py-1.5 rounded text-sm transition-colors"
                    >
                      Salir
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="hover:text-amber-300 transition-colors text-sm"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      href="/register"
                      className="bg-amber-600 hover:bg-amber-500 px-3 py-1.5 rounded text-sm transition-colors"
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
