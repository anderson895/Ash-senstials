import React from "react";
import { Button } from "@/components/ui/button";
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  BuildingStorefrontIcon,
  Bars3Icon,
  XMarkIcon,
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
export function TopBar({
  user,
  onLogout,
  onMenuToggle,
}: {
  user: User;
  onLogout: () => void;
  onMenuToggle?: () => void;
}): React.ReactElement {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-pink-600 to-rose-400 shadow-lg shadow-pink-200">
      <div className="flex items-center justify-between px-4 sm:px-8 py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
          )}
          <div className="bg-white/20 rounded-xl p-1.5 sm:p-2 hidden xs:flex">
            <BuildingStorefrontIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-base sm:text-lg leading-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              School Ashentials
            </p>
            <p className="text-pink-100 text-xs mt-0.5 hidden sm:block">
              Ash-sentials that make school extra special!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-full px-3 sm:px-4 py-1.5">
            <UserIcon className="w-4 h-4 text-pink-100" />
            <span className="text-white text-sm font-medium truncate max-w-[120px]">{user.name}</span>
            <span className="text-pink-200 text-xs capitalize hidden md:inline">({user.role})</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout}
            className="text-white hover:bg-white/20 gap-1 px-2 sm:px-3">
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Log Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

// ─── SideNav ──────────────────────────────────────────────────────────────────
export function SideNav({
  items, active, onSelect, open, onClose,
}: {
  items: NavItem[];
  active: string;
  onSelect: (key: string) => void;
  open?: boolean;
  onClose?: () => void;
}): React.ReactElement {
  const handleSelect = (key: string) => {
    onSelect(key);
    onClose?.();
  };

  const navContent = (
    <nav className="py-4 flex flex-col gap-1">
      {items.map((it) => (
        <button key={it.key} onClick={() => handleSelect(it.key)}
          className={`flex items-center gap-3 mx-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150
            ${active === it.key
              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200"
              : "text-gray-500 hover:bg-pink-100 hover:text-pink-700"}`}>
          <span className={`w-5 h-5 shrink-0 ${active === it.key ? "text-white" : "text-pink-400"}`}>
            {it.icon}
          </span>
          {it.label}
        </button>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 bg-pink-50/60 border-r border-pink-100 min-h-[calc(100vh-60px)] flex-col">
        {navContent}
      </aside>

      {/* Mobile bottom nav — show nav items as tabs on small screens */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-pink-100 shadow-lg">
        <div className="flex">
          {items.map((it) => (
            <button key={it.key} onClick={() => handleSelect(it.key)}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-semibold transition-colors
                ${active === it.key ? "text-pink-600 bg-pink-50" : "text-gray-400 hover:text-pink-500"}`}>
              <span className="w-5 h-5">{it.icon}</span>
              <span className="truncate max-w-[60px] text-[10px]">{it.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile drawer (lg+ only hides) — optional for overflow */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <aside className="relative z-50 w-64 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-pink-100 bg-gradient-to-r from-pink-600 to-rose-400">
              <span className="font-bold text-white text-base"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Menu</span>
              <button onClick={onClose} className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}