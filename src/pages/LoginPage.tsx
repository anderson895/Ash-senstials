import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnvelopeIcon, HeartIcon, StarIcon } from "@heroicons/react/24/outline";
import { ShoppingBagIcon, ChartBarIcon, CubeIcon } from "@heroicons/react/24/outline";
import type { Role, User } from "../types";

export default function LoginPage({ onLogin }: { onLogin: (u: User) => void }): React.ReactElement {
  const [role, setRole]   = useState<Role>("customer");
  const [email, setEmail] = useState<string>("");
  const [pass, setPass]   = useState<string>("");

  const CREDS: Record<Role, { email: string; password: string; name: string }> = {
    customer: { email: "customer@ashentials.com", password: "customer123", name: "Maria Santos" },
    admin:    { email: "admin@ashentials.com",    password: "admin123",    name: "Admin User"   },
    supplier: { email: "supplier@ashentials.com", password: "supplier123", name: "Supplier PH"  },
  };

  const handle = (): void => {
    const c = CREDS[role];
    if (email === c.email && pass === c.password) {
      onLogin({ role, name: c.name });
    } else {
      alert(`Wrong credentials!\n\nHint – email: ${c.email}\npassword: ${c.password}`);
    }
  };

  const roles: Role[] = ["customer", "admin", "supplier"];
  const roleIcons: Record<Role, React.ReactElement> = {
    customer: <ShoppingBagIcon className="w-4 h-4" />,
    admin:    <ChartBarIcon    className="w-4 h-4" />,
    supplier: <CubeIcon        className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center p-4">
      <div className="fixed top-0 left-0 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
      <Card className="w-full max-w-md shadow-2xl shadow-pink-200/50 border-pink-100 relative z-10">
        <CardHeader className="text-center pb-2 px-4 sm:px-6">
          <div className="mx-auto mb-4 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-300">
            <HeartIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl text-pink-700"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            School Ashentials
          </CardTitle>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Ash-sentials that make school extra special!</p>
        </CardHeader>
        <CardContent className="pt-4 space-y-5 px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-2 bg-pink-50 p-1.5 rounded-xl">
            {roles.map((r) => (
              <button key={r} onClick={() => setRole(r)}
                className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 rounded-lg text-xs font-bold capitalize transition-all duration-150
                  ${role === r
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                    : "text-gray-400 hover:text-pink-500"}`}>
                {roleIcons[r]}
                <span className="hidden xs:inline">{r}</span>
                <span className="xs:hidden">{r.charAt(0).toUpperCase()}</span>
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-gray-600 text-xs font-semibold uppercase tracking-wide">Email</Label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-pink-200 focus:border-pink-400 focus-visible:ring-pink-300 text-sm"
                  placeholder="your@email.com" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-600 text-xs font-semibold uppercase tracking-wide">Password</Label>
              <div className="relative">
                <StarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
                <Input type="password" value={pass} onChange={(e) => setPass(e.target.value)}
                  className="pl-10 border-pink-200 focus:border-pink-400 focus-visible:ring-pink-300 text-sm"
                  placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && handle()} />
              </div>
            </div>
          </div>
          <Button onClick={handle}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold shadow-lg shadow-pink-200 h-11">
            <HeartIcon className="w-4 h-4 mr-2" />
            Log In as {role.charAt(0).toUpperCase() + role.slice(1)}
          </Button>
          <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
            <StarIcon className="w-3.5 h-3.5 text-pink-300" />
            Demo hints shown on wrong login
          </p>
        </CardContent>
      </Card>
    </div>
  );
}