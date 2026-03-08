import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  HomeIcon, ArchiveBoxIcon, ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon, CubeIcon, CurrencyDollarIcon,
  CheckCircleIcon, ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { TopBar, SideNav, StatusBadge } from "../components/shared";
import { MESSAGES, SUPPLY_ORDERS } from "../data";
import type { User, Message, SupplyOrder, SupplyItem, NavItem } from "../types";

interface SupplierPortalProps {
  user: User;
  onLogout: () => void;
}

export default function SupplierPortal({ user, onLogout }: SupplierPortalProps): React.ReactElement {
  const [tab, setTab]  = useState<string>("dashboard");
  const [supplyOrders] = useState<SupplyOrder[]>(SUPPLY_ORDERS);
  const [messages]     = useState<Message[]>(MESSAGES.filter(m => !m.unread));

  const navItems: NavItem[] = [
    { key: "dashboard", icon: <HomeIcon />,                label: "Dashboard"    },
    { key: "inventory", icon: <ArchiveBoxIcon />,          label: "Inventory"    },
    { key: "sales",     icon: <ArrowTrendingUpIcon />,     label: "Sales Report" },
    { key: "messages",  icon: <ChatBubbleLeftRightIcon />, label: "Messages"     },
  ];

  const supplyItems: SupplyItem[] = [
    { name: "Notebook",     supplied: 200, needed: 50,  image: "/assets/notebook.webp"     },
    { name: "Pencil",       supplied: 500, needed: 0,   image: "/assets/pencil.webp"       },
    { name: "Crayons",      supplied: 100, needed: 80,  image: "/assets/crayons.webp"      },
    { name: "Highlighters", supplied: 150, needed: 120, image: "/assets/highlighters.webp" },
    { name: "Sharpener",    supplied: 0,   needed: 200, image: "/assets/sharpener.webp"    },
  ];

  const totalRevenue    = 18450;
  const completedOrders = supplyOrders.filter(o => o.status === "delivered").length;

  const statCards = [
    { label: "Total Revenue",     value: `₱${totalRevenue.toLocaleString()}`, icon: <CurrencyDollarIcon className="w-6 h-6" />, color: "from-pink-500 to-rose-500",    bg: "bg-pink-50",   text: "text-pink-600"   },
    { label: "Products Supplied", value: supplyItems.length,                  icon: <CubeIcon           className="w-6 h-6" />, color: "from-violet-500 to-purple-500", bg: "bg-violet-50", text: "text-violet-600" },
    { label: "Completed Orders",  value: completedOrders,                     icon: <CheckCircleIcon    className="w-6 h-6" />, color: "from-teal-500 to-cyan-500",    bg: "bg-teal-50",   text: "text-teal-600"   },
  ];

  const supplierMessages: Message[] = [
    { from: "School Ashentials Admin", text: "Please send 200 more notebooks ASAP!", time: "3h ago", unread: true  },
    { from: "School Ashentials Admin", text: "Invoice #SUP-003 has been received.",  time: "1d ago", unread: false },
    ...messages,
  ];

  return (
    <div className="min-h-screen bg-pink-50/30" style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>
      <TopBar user={user} onLogout={onLogout} />
      <div className="flex">
        <SideNav items={navItems} active={tab} onSelect={setTab} />
        <main className="flex-1 p-8 overflow-y-auto">

          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <div className="space-y-6">
              <h1 className="flex items-center gap-2 text-2xl font-bold text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <HomeIcon className="w-7 h-7 text-pink-500" /> Supplier Dashboard
              </h1>
              <div className="grid grid-cols-3 gap-4">
                {statCards.map(s => (
                  <Card key={s.label} className="border-0 shadow-sm overflow-hidden">
                    <CardContent className={`pt-5 pb-4 ${s.bg}`}>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-3 shadow-sm`}>
                        {s.icon}
                      </div>
                      <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
                      <p className="text-xs text-gray-500 font-semibold mt-1">{s.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-pink-100">
                  <CardHeader>
                    <CardTitle className="text-pink-700 text-base flex items-center gap-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      <ClipboardDocumentListIcon className="w-5 h-5 text-pink-400" /> Recent Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {supplyOrders.map(o => (
                        <div key={o.id} className="flex justify-between items-center py-2 border-b border-pink-50 last:border-0">
                          <div>
                            <p className="font-semibold text-sm">{o.product}</p>
                            <p className="text-xs text-gray-400">Qty: {o.qty} · {o.date}</p>
                          </div>
                          <StatusBadge status={o.status} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-pink-100">
                  <CardHeader>
                    <CardTitle className="text-pink-700 text-base flex items-center gap-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      <ArchiveBoxIcon className="w-5 h-5 text-pink-400" /> Products Supplied
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {supplyItems.map(i => (
                      <div key={i.name} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-pink-50 shrink-0">
                          <img src={i.image} alt={i.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-700 mb-1">{i.name}</p>
                          <div className="h-2 bg-pink-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
                              style={{ width: `${Math.min(100, (i.supplied / (i.supplied + i.needed + 1)) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-bold text-pink-600 shrink-0">{i.supplied}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* INVENTORY */}
          {tab === "inventory" && (
            <div className="space-y-6">
              <h1 className="flex items-center gap-2 text-2xl font-bold text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <ArchiveBoxIcon className="w-7 h-7 text-pink-500" /> Inventory to Supply
              </h1>
              <Card className="border-pink-100">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-pink-50/50">
                      {["Product", "Supplied", "Still Needed", "Status"].map(h => (
                        <TableHead key={h} className="text-pink-600 font-bold">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplyItems.map(i => (
                      <TableRow key={i.name} className="hover:bg-pink-50/30">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-pink-50 shrink-0">
                              <img src={i.image} alt={i.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-semibold">{i.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-teal-600">{i.supplied} units</TableCell>
                        <TableCell className={`font-bold ${i.needed > 0 ? "text-pink-600" : "text-gray-400"}`}>
                          {i.needed > 0 ? `${i.needed} units` : "—"}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={i.needed === 0 ? "available" : i.supplied === 0 ? "out of stock" : "in transit"} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* SALES REPORT */}
          {tab === "sales" && (
            <div className="space-y-6">
              <h1 className="flex items-center gap-2 text-2xl font-bold text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <ArrowTrendingUpIcon className="w-7 h-7 text-pink-500" /> Sales Report
              </h1>
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-pink-100">
                  <CardHeader>
                    <CardTitle className="text-pink-700 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      <ArrowTrendingUpIcon className="w-5 h-5 text-pink-400" /> Monthly Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[{ month: "January", rev: 5200 }, { month: "February", rev: 7800 }, { month: "March", rev: 5450 }].map(r => (
                      <div key={r.month}>
                        <div className="flex justify-between text-sm font-semibold mb-1.5">
                          <span className="text-gray-600">{r.month} 2026</span>
                          <span className="text-pink-600">₱{r.rev.toLocaleString()}</span>
                        </div>
                        <div className="h-3 bg-pink-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-700"
                            style={{ width: `${(r.rev / 9000) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="mt-2 p-3 bg-pink-50 rounded-xl flex items-center justify-between">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <CurrencyDollarIcon className="w-4 h-4 text-pink-400" /> Total Q1 Revenue:
                      </span>
                      <span className="text-lg font-black text-pink-600">₱18,450</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-pink-100">
                  <CardHeader>
                    <CardTitle className="text-pink-700 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      <ClipboardDocumentListIcon className="w-5 h-5 text-pink-400" /> Order Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {supplyOrders.map(o => (
                        <div key={o.id} className="flex justify-between items-start py-2 border-b border-pink-50 last:border-0">
                          <div>
                            <p className="font-bold text-sm">{o.id} – {o.product}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Qty: {o.qty} units · {o.date}</p>
                          </div>
                          <StatusBadge status={o.status} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {tab === "messages" && (
            <div className="space-y-6">
              <h1 className="flex items-center gap-2 text-2xl font-bold text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <ChatBubbleLeftRightIcon className="w-7 h-7 text-pink-500" /> Messages
              </h1>
              <div className="space-y-3">
                {supplierMessages.map((m, i) => (
                  <Card key={i} className={`border-pink-100 ${m.unread ? "ring-1 ring-pink-300 shadow-sm shadow-pink-100" : ""}`}>
                    <CardContent className="py-4 flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-pink-400 to-rose-500 text-white font-bold">
                          {m.from[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-gray-800 text-sm">{m.from}</span>
                          <span className="text-xs text-gray-400">{m.time}</span>
                        </div>
                        <p className="text-gray-500 text-sm truncate">{m.text}</p>
                      </div>
                      {m.unread && <div className="w-2.5 h-2.5 bg-pink-500 rounded-full shrink-0" />}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
