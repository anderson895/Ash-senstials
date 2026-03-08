import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Alert, AlertDescription,
} from "@/components/ui/alert";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ChartBarIcon, ClipboardDocumentListIcon, ArchiveBoxIcon,
  ChatBubbleLeftRightIcon, CubeIcon, BellAlertIcon, UsersIcon,
  CurrencyDollarIcon, PlusIcon, MinusIcon,
  ExclamationCircleIcon, CheckCircleIcon, XCircleIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { TopBar, SideNav, StatusBadge } from "../components/shared";
import { PRODUCTS, ORDERS_ADMIN, MESSAGES } from "../data";
import type { User, Product, AdminOrder, Message, NavItem } from "../types";

interface AdminPortalProps {
  user: User;
  onLogout: () => void;
}

export default function AdminPortal({ user, onLogout }: AdminPortalProps): React.ReactElement {
  const [tab, setTab]             = useState<string>("dashboard");
  const [inventory, setInventory] = useState<Product[]>(PRODUCTS.map(p => ({ ...p })));
  const [orders, setOrders]       = useState<AdminOrder[]>(ORDERS_ADMIN);
  const [messages]                = useState<Message[]>(MESSAGES);

  const navItems: NavItem[] = [
    { key: "dashboard", icon: <ChartBarIcon />,              label: "Dashboard" },
    { key: "orders",    icon: <ClipboardDocumentListIcon />, label: "Orders"    },
    { key: "inventory", icon: <ArchiveBoxIcon />,            label: "Inventory" },
    { key: "messages",  icon: <ChatBubbleLeftRightIcon />,   label: "Messages"  },
  ];

  const updateStatus = (id: string, status: AdminOrder["status"]): void =>
    setOrders(o => o.map(x => x.id === id ? { ...x, status } : x));

  const updateStock = (id: number, delta: number): void =>
    setInventory(inv => inv.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));

  const totalSales   = orders.filter(o => o.status === "completed").reduce((a, b) => a + b.total, 0);
  const pendingCount = orders.filter(o => o.status === "pending").length;

  const statCards = [
    { label: "Total Products",  value: PRODUCTS.length,   icon: <CubeIcon className="w-6 h-6" />,                 color: "from-pink-500 to-rose-500",    bg: "bg-pink-50",   text: "text-pink-600"   },
    { label: "Total Orders",    value: orders.length,     icon: <ClipboardDocumentListIcon className="w-6 h-6" />, color: "from-violet-500 to-purple-500", bg: "bg-violet-50", text: "text-violet-600" },
    { label: "Total Customers", value: 24,                icon: <UsersIcon className="w-6 h-6" />,                 color: "from-teal-500 to-cyan-500",    bg: "bg-teal-50",   text: "text-teal-600"   },
    { label: "Total Sales",     value: `₱${totalSales}`, icon: <CurrencyDollarIcon className="w-6 h-6" />,        color: "from-amber-500 to-orange-500", bg: "bg-amber-50",  text: "text-amber-600"  },
  ];

  const alertItems = [
    { msg: `${pendingCount} pending orders`, icon: <ExclamationCircleIcon className="w-4 h-4 text-amber-500" /> },
    { msg: "Sharpener out of stock",         icon: <XCircleIcon           className="w-4 h-4 text-rose-500"  /> },
    { msg: "Scissors out of stock",          icon: <XCircleIcon           className="w-4 h-4 text-rose-500"  /> },
    { msg: "5 suppliers active",             icon: <CheckCircleIcon       className="w-4 h-4 text-emerald-500" /> },
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
                <ChartBarIcon className="w-7 h-7 text-pink-500" /> Dashboard
              </h1>
              <div className="grid grid-cols-4 gap-4">
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
              <div className="grid grid-cols-[2fr_1fr] gap-4">
                <Card className="border-pink-100">
                  <CardHeader>
                    <CardTitle className="text-pink-700 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      <ArrowTrendingUpIcon className="w-5 h-5 text-pink-400" /> Sales Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[{ month: "Jan", sales: 1200 }, { month: "Feb", sales: 1850 }, { month: "Mar", sales: 980 }].map(r => (
                      <div key={r.month}>
                        <div className="flex justify-between text-sm font-semibold mb-1.5">
                          <span className="text-gray-600">{r.month} 2026</span>
                          <span className="text-pink-600">₱{r.sales}</span>
                        </div>
                        <div className="h-2.5 bg-pink-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-700"
                            style={{ width: `${(r.sales / 2000) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="border-pink-100">
                  <CardHeader>
                    <CardTitle className="text-pink-700 flex items-center gap-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      <BellAlertIcon className="w-5 h-5 text-pink-400" /> Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {alertItems.map((a, i) => (
                      <Alert key={i} className="py-2.5 border-pink-100 bg-pink-50/50">
                        <AlertDescription className="flex items-center gap-2 text-sm">
                          {a.icon} {a.msg}
                        </AlertDescription>
                      </Alert>
                    ))}
                    <p className="text-xs text-gray-400 pt-1 flex items-center gap-1">
                      <UsersIcon className="w-3.5 h-3.5" /> Number of suppliers: <strong className="text-pink-600 ml-1">5</strong>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {tab === "orders" && (
            <div className="space-y-6">
              <h1 className="flex items-center gap-2 text-2xl font-bold text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <ClipboardDocumentListIcon className="w-7 h-7 text-pink-500" /> Orders
              </h1>
              <Card className="border-pink-100">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-pink-50/50">
                      {["Order ID", "Customer", "Items", "Total", "Status", "Actions"].map(h => (
                        <TableHead key={h} className="text-pink-600 font-bold">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map(o => (
                      <TableRow key={o.id} className="hover:bg-pink-50/30">
                        <TableCell className="font-bold text-gray-800">{o.id}</TableCell>
                        <TableCell>{o.customer}</TableCell>
                        <TableCell className="text-gray-500 text-sm">{o.items}</TableCell>
                        <TableCell className="font-bold text-pink-600">₱{o.total}</TableCell>
                        <TableCell><StatusBadge status={o.status} /></TableCell>
                        <TableCell>
                          <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as AdminOrder["status"])}>
                            <SelectTrigger className="w-32 h-8 text-xs border-pink-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(["pending", "processing", "completed"] as AdminOrder["status"][]).map(s => (
                                <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* INVENTORY */}
          {tab === "inventory" && (
            <div className="space-y-6">
              <h1 className="flex items-center gap-2 text-2xl font-bold text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <ArchiveBoxIcon className="w-7 h-7 text-pink-500" /> Inventory
              </h1>
              <Card className="border-pink-100">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-pink-50/50">
                      {["Product", "Price", "Stock", "Status", "Adjust"].map(h => (
                        <TableHead key={h} className="text-pink-600 font-bold">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map(p => (
                      <TableRow key={p.id} className="hover:bg-pink-50/30">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-pink-50 shrink-0">
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-semibold">{p.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-pink-600">₱{p.price}</TableCell>
                        <TableCell className="font-bold">{p.stock}</TableCell>
                        <TableCell><StatusBadge status={p.stock === 0 ? "out of stock" : "available"} /></TableCell>
                        <TableCell>
                          <div className="flex gap-1.5">
                            <Button size="icon" variant="outline" onClick={() => updateStock(p.id, -1)}
                              className="w-7 h-7 border-rose-200 text-rose-500 hover:bg-rose-50">
                              <MinusIcon className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="icon" variant="outline" onClick={() => updateStock(p.id, +1)}
                              className="w-7 h-7 border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                              <PlusIcon className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* MESSAGES */}
          {tab === "messages" && (
            <div className="space-y-6">
              <h1 className="flex items-center gap-2 text-2xl font-bold text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <ChatBubbleLeftRightIcon className="w-7 h-7 text-pink-500" /> Messages
              </h1>
              <div className="space-y-3">
                {messages.map((m, i) => (
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
