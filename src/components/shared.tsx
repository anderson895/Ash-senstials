import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import type { User, NavItem } from "../types";

// ─── StatusBadge ──────────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }): React.ReactElement {
  const colorMap: Record<string, string> = {
    completed:       "bg-emerald-100 text-emerald-800 border-emerald-200",
    delivered:       "bg-emerald-100 text-emerald-800 border-emerald-200",
    available:       "bg-emerald-100 text-emerald-800 border-emerald-200",
    processing:      "bg-amber-100 text-amber-800 border-amber-200",
    "in transit":    "bg-blue-100 text-blue-800 border-blue-200",
    pending:         "bg-rose-100 text-rose-800 border-rose-200",
    "out of stock":  "bg-rose-100 text-rose-800 border-rose-200",
    "ready to pay":  "bg-violet-100 text-violet-800 border-violet-200",
    "ready to ship": "bg-sky-100 text-sky-800 border-sky-200",
    "to receive":    "bg-teal-100 text-teal-800 border-teal-200",
  };
  const cls = colorMap[status.toLowerCase()] ?? "bg-pink-100 text-pink-800 border-pink-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {status}
    </span>
  );
}

// ─── TopBar ───────────────────────────────────────────────────────────────────
export function TopBar({ user, onLogout }: { user: User; onLogout: () => void }): React.ReactElement {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-pink-600 to-rose-400 shadow-lg shadow-pink-200">
      <div className="flex items-center justify-between px-8 py-3">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-xl p-2">
            <BuildingStorefrontIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-lg leading-none" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              School Ashentials
            </p>
            <p className="text-pink-100 text-xs mt-0.5">Ash-sentials that make school extra special!</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
            <UserIcon className="w-4 h-4 text-pink-100" />
            <span className="text-white text-sm font-medium">{user.name}</span>
            <span className="text-pink-200 text-xs capitalize">({user.role})</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-white hover:bg-white/20 gap-1.5"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            Log Out
          </Button>
        </div>
      </div>
    </header>
  );
}

// ─── SideNav ──────────────────────────────────────────────────────────────────
export function SideNav({ items, active, onSelect }: {
  items: NavItem[];
  active: string;
  onSelect: (key: string) => void;
}): React.ReactElement {
  return (
    <aside className="w-56 shrink-0 bg-pink-50/60 border-r border-pink-100 min-h-[calc(100vh-60px)] py-6 flex flex-col gap-1">
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => onSelect(it.key)}
          className={`flex items-center gap-3 mx-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150
            ${active === it.key
              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200"
              : "text-gray-500 hover:bg-pink-100 hover:text-pink-700"
            }`}
        >
          <span className={`w-5 h-5 ${active === it.key ? "text-white" : "text-pink-400"}`}>
            {it.icon}
          </span>
          {it.label}
        </button>
      ))}
    </aside>
  );
}
