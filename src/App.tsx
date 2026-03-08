import React, { useState, useEffect } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { loadSession, saveSession, clearSession } from "./lib/session";
import LoginPage      from "./pages/LoginPage";
import CustomerPortal from "./pages/CustomerPortal";
import AdminPortal    from "./pages/AdminPortal";
import SupplierPortal from "./pages/SupplierPortal";
import type { User } from "./types";

export default function App(): React.ReactElement {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // On first mount, restore session from localStorage
  useEffect(() => {
    const saved = loadSession();
    if (saved) setUser(saved);
    setLoading(false);
  }, []);

  const handleLogin = (u: User): void => {
    saveSession(u);
    setUser(u);
  };

  const handleLogout = (): void => {
    clearSession();
    setUser(null);
  };

  // Show blank screen briefly while restoring session (avoids login flash)
  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center animate-pulse">
            <HeartIcon className="w-6 h-6 text-white" />
          </div>
          <p className="text-pink-400 text-sm font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user)                    return <LoginPage    onLogin={handleLogin} />;
  if (user.role === "customer") return <CustomerPortal user={user} onLogout={handleLogout} />;
  if (user.role === "admin")    return <AdminPortal    user={user} onLogout={handleLogout} />;
  if (user.role === "supplier") return <SupplierPortal user={user} onLogout={handleLogout} />;

  return <LoginPage onLogin={handleLogin} />;
}