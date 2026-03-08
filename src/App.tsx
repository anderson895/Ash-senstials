import React, { useState } from "react";

// ─── shadcn/ui imports ────────────────────────────────────────────────────────
import { Button }   from "@/components/ui/button";
import { Input }    from "@/components/ui/input";
import { Label }    from "@/components/ui/label";
import { Badge }    from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea }  from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

// ─── Heroicons imports ────────────────────────────────────────────────────────
import {
  UserIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  HeartIcon,
  HomeIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  ArchiveBoxIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
  TruckIcon,
  CreditCardIcon,
  CubeIcon,
  BellAlertIcon,
  UsersIcon,
  CurrencyDollarIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  PaperAirplaneIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ReceiptPercentIcon,
  BuildingStorefrontIcon,
  ArrowTrendingUpIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "customer" | "admin" | "supplier";

interface User {
  role: Role;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  emoji: string;
  stock: number;
}

interface CartItem extends Product {
  qty: number;
}

interface Receipt {
  items: CartItem[];
  total: number;
  date: string;
}

interface CustomerOrder {
  id: string;
  item: string;
  total: number;
  status: "Ready to Pay" | "Ready to Ship" | "To Receive";
}

interface AdminOrder {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: "pending" | "processing" | "completed";
}

interface Message {
  from: string;
  text: string;
  time: string;
  unread: boolean;
}

interface SupplyOrder {
  id: string;
  product: string;
  qty: number;
  date: string;
  status: "delivered" | "in transit" | "pending";
}

interface SupplyItem {
  name: string;
  supplied: number;
  needed: number;
  emoji: string;
}

interface NavItem {
  key: string;
  icon: React.ReactElement;
  label: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  { id: 1,  name: "Notebook",     price: 20, emoji: "📓", stock: 45  },
  { id: 2,  name: "Pencil",       price: 10, emoji: "✏️",  stock: 120 },
  { id: 3,  name: "Pen",          price: 10, emoji: "🖊️",  stock: 95  },
  { id: 4,  name: "Eraser",       price: 5,  emoji: "🧽",  stock: 80  },
  { id: 5,  name: "Sharpener",    price: 15, emoji: "🔪",  stock: 0   },
  { id: 6,  name: "Ruler",        price: 20, emoji: "📏",  stock: 60  },
  { id: 7,  name: "Highlighters", price: 40, emoji: "🖍️",  stock: 30  },
  { id: 8,  name: "Glue",         price: 30, emoji: "🫙",  stock: 25  },
  { id: 9,  name: "Scissors",     price: 25, emoji: "✂️",  stock: 0   },
  { id: 10, name: "Crayons",      price: 50, emoji: "🎨",  stock: 18  },
];

const ORDERS_ADMIN: AdminOrder[] = [
  { id: "ORD-001", customer: "Maria Santos",    items: "Notebook×2, Pen×1",   total: 50, status: "completed"  },
  { id: "ORD-002", customer: "Jose Reyes",      items: "Crayons×1, Glue×1",   total: 80, status: "processing" },
  { id: "ORD-003", customer: "Ana Cruz",        items: "Highlighters×2",      total: 80, status: "pending"    },
  { id: "ORD-004", customer: "Carlos Bautista", items: "Pencil×5, Eraser×3",  total: 65, status: "processing" },
  { id: "ORD-005", customer: "Lena Villanueva", items: "Ruler×1, Scissors×1", total: 45, status: "pending"    },
];

const MESSAGES: Message[] = [
  { from: "Maria Santos", text: "Hi! My order hasn't arrived yet.",      time: "2h ago", unread: true  },
  { from: "Jose Reyes",   text: "Can I change my delivery address?",     time: "5h ago", unread: true  },
  { from: "Supplier PH",  text: "We have new stock ready for delivery.", time: "1d ago", unread: false },
  { from: "Ana Cruz",     text: "Thank you for the fast delivery!",      time: "2d ago", unread: false },
];

const SUPPLY_ORDERS: SupplyOrder[] = [
  { id: "SUP-001", product: "Notebook",     qty: 200, date: "Mar 1, 2026", status: "delivered"  },
  { id: "SUP-002", product: "Pencil",       qty: 500, date: "Mar 3, 2026", status: "delivered"  },
  { id: "SUP-003", product: "Crayons",      qty: 100, date: "Mar 5, 2026", status: "in transit" },
  { id: "SUP-004", product: "Highlighters", qty: 150, date: "Mar 6, 2026", status: "pending"    },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }): React.ReactElement {
  const colorMap: Record<string, string> = {
    completed:        "bg-emerald-100 text-emerald-800 border-emerald-200",
    delivered:        "bg-emerald-100 text-emerald-800 border-emerald-200",
    available:        "bg-emerald-100 text-emerald-800 border-emerald-200",
    processing:       "bg-amber-100 text-amber-800 border-amber-200",
    "in transit":     "bg-blue-100 text-blue-800 border-blue-200",
    pending:          "bg-rose-100 text-rose-800 border-rose-200",
    "out of stock":   "bg-rose-100 text-rose-800 border-rose-200",
    "ready to pay":   "bg-violet-100 text-violet-800 border-violet-200",
    "ready to ship":  "bg-sky-100 text-sky-800 border-sky-200",
    "to receive":     "bg-teal-100 text-teal-800 border-teal-200",
  };
  const cls = colorMap[status.toLowerCase()] ?? "bg-pink-100 text-pink-800 border-pink-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {status}
    </span>
  );
}

// ─── TopBar ───────────────────────────────────────────────────────────────────

function TopBar({ user, onLogout }: { user: User; onLogout: () => void }): React.ReactElement {
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

function SideNav({ items, active, onSelect }: {
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

// ════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ════════════════════════════════════════════════════════════════════════════

function LoginPage({ onLogin }: { onLogin: (u: User) => void }): React.ReactElement {
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
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-300">
            <HeartIcon className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            School Ashentials
          </CardTitle>
          <p className="text-gray-400 text-sm mt-1">Ash-sentials that make school extra special!</p>
        </CardHeader>

        <CardContent className="pt-4 space-y-5">
          <div className="grid grid-cols-3 gap-2 bg-pink-50 p-1.5 rounded-xl">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold capitalize transition-all duration-150
                  ${role === r
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                    : "text-gray-400 hover:text-pink-500"
                  }`}
              >
                {roleIcons[r]}
                {r}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-gray-600 text-xs font-semibold uppercase tracking-wide">Email</Label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-pink-200 focus:border-pink-400 focus-visible:ring-pink-300"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-600 text-xs font-semibold uppercase tracking-wide">Password</Label>
              <div className="relative">
                <StarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
                <Input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="pl-10 border-pink-200 focus:border-pink-400 focus-visible:ring-pink-300"
                  placeholder="••••••••"
                  onKeyDown={(e) => e.key === "Enter" && handle()}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handle}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold shadow-lg shadow-pink-200 h-11"
          >
            <HeartIcon className="w-4 h-4 mr-2" />
            Log In as {role.charAt(0).toUpperCase() + role.slice(1)}
          </Button>

          <p className="text-center text-xs text-gray-400">✨ Demo hints shown on wrong login</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CUSTOMER PORTAL
// ════════════════════════════════════════════════════════════════════════════

function CustomerPortal({ user, onLogout }: { user: User; onLogout: () => void }): React.ReactElement {
  const [tab, setTab]           = useState<string>("profile");
  const [cart, setCart]         = useState<CartItem[]>([]);
  const [receipt, setReceipt]   = useState<Receipt | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [fbSent, setFbSent]     = useState<boolean>(false);

  const [orders] = useState<CustomerOrder[]>([
    { id: "ORD-C01", item: "Notebook×2, Pen×1", total: 50, status: "To Receive"    },
    { id: "ORD-C02", item: "Crayons×1",          total: 50, status: "Ready to Ship" },
    { id: "ORD-C03", item: "Glue×2",             total: 60, status: "Ready to Pay"  },
  ]);

  const addToCart = (p: Product): void =>
    setCart((c) => {
      const ex = c.find((x) => x.id === p.id);
      return ex
        ? c.map((x) => x.id === p.id ? { ...x, qty: x.qty + 1 } : x)
        : [...c, { ...p, qty: 1 }];
    });

  const removeFromCart = (id: number): void => setCart((c) => c.filter((x) => x.id !== id));
  const cartTotal = cart.reduce((a, b) => a + b.price * b.qty, 0);

  const checkout = (): void => {
    if (!cart.length) return;
    setReceipt({ items: [...cart], total: cartTotal, date: new Date().toLocaleString() });
    setCart([]);
  };

  const navItems: NavItem[] = [
    { key: "profile",  icon: <UserIcon />,        label: "My Profile"            },
    { key: "products", icon: <ShoppingBagIcon />,  label: "Products"              },
    { key: "cart",     icon: <ShoppingCartIcon />, label: `Cart (${cart.length})` },
    { key: "about",    icon: <HeartIcon />,        label: "About Us"              },
  ];

  return (
    <div className="min-h-screen bg-pink-50/30" style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>
      <TopBar user={user} onLogout={onLogout} />
      <div className="flex">
        <SideNav items={navItems} active={tab} onSelect={setTab} />
        <main className="flex-1 p-8 overflow-y-auto">

          {/* PROFILE */}
          {tab === "profile" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                My Profile 💗
              </h1>
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-pink-100">
                  <CardContent className="pt-6">
                    <Avatar className="w-14 h-14 mb-4">
                      <AvatarFallback className="bg-pink-100 text-pink-600 text-xl font-bold">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-bold text-xl text-gray-800">{user.name}</p>
                    <div className="mt-3 space-y-1.5 text-sm text-gray-500">
                      <div className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4 text-pink-400" /> customer@ashentials.com</div>
                      <div className="flex items-center gap-2"><PhoneIcon    className="w-4 h-4 text-pink-400" /> 09124154218</div>
                      <div className="flex items-center gap-2"><MapPinIcon   className="w-4 h-4 text-pink-400" /> Bacuag, Surigao del Norte</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-pink-500 to-rose-500 border-0 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <StarSolid className="w-5 h-5 text-yellow-300" />
                      <span className="font-semibold text-pink-100 text-sm">Reward Points</span>
                    </div>
                    <p className="text-6xl font-black">320</p>
                    <p className="text-pink-200 text-sm mt-2">Keep shopping to earn more! 🎀</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-lg font-bold text-pink-700 mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Order Status</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Ready to Pay",  icon: <CreditCardIcon className="w-7 h-7" />, count: orders.filter(o => o.status === "Ready to Pay").length,  color: "text-violet-500" },
                    { label: "Ready to Ship", icon: <ArchiveBoxIcon  className="w-7 h-7" />, count: orders.filter(o => o.status === "Ready to Ship").length, color: "text-sky-500"    },
                    { label: "To Receive",    icon: <TruckIcon       className="w-7 h-7" />, count: orders.filter(o => o.status === "To Receive").length,    color: "text-teal-500"  },
                  ].map((s) => (
                    <Card key={s.label} className="border-pink-100 text-center">
                      <CardContent className="pt-6">
                        <div className={`mx-auto mb-2 ${s.color}`}>{s.icon}</div>
                        <p className="text-3xl font-black text-pink-600">{s.count}</p>
                        <p className="text-xs font-semibold text-gray-500 mt-1">{s.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-pink-700 mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Products Bought</h2>
                <Card className="border-pink-100">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-pink-50/50">
                        {["Order ID", "Items", "Total", "Status"].map(h => (
                          <TableHead key={h} className="text-pink-600 font-bold">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map(o => (
                        <TableRow key={o.id} className="hover:bg-pink-50/30">
                          <TableCell className="font-semibold">{o.id}</TableCell>
                          <TableCell className="text-gray-500 text-sm">{o.item}</TableCell>
                          <TableCell className="font-bold text-pink-600">₱{o.total}</TableCell>
                          <TableCell><StatusBadge status={o.status.toLowerCase()} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {tab === "products" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Our Products 🛍️
              </h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {PRODUCTS.map(p => (
                  <Card key={p.id} className={`border-pink-100 hover:shadow-md hover:shadow-pink-100 transition-shadow relative overflow-hidden ${p.stock === 0 ? "opacity-70" : ""}`}>
                    {p.stock === 0 && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                      </div>
                    )}
                    <CardContent className="pt-6 text-center">
                      <div className="text-4xl mb-3">{p.emoji}</div>
                      <p className="font-bold text-gray-800 text-sm">{p.name}</p>
                      <p className="text-pink-600 font-black text-xl mt-1">₱{p.price}</p>
                      <Button
                        size="sm"
                        disabled={p.stock === 0}
                        onClick={() => p.stock > 0 && addToCart(p)}
                        className={`w-full mt-3 text-xs font-bold ${p.stock > 0 ? "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white" : ""}`}
                        variant={p.stock === 0 ? "outline" : "default"}
                      >
                        <ShoppingCartIcon className="w-3.5 h-3.5 mr-1" />
                        {p.stock === 0 ? "Unavailable" : "Add to Cart"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* CART */}
          {tab === "cart" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                My Cart 🛒
              </h1>

              {receipt ? (
                <Card className="max-w-md border-pink-100 shadow-lg shadow-pink-100">
                  <CardHeader className="text-center">
                    <ReceiptPercentIcon className="w-12 h-12 text-pink-400 mx-auto mb-2" />
                    <CardTitle className="text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Receipt</CardTitle>
                    <p className="text-gray-400 text-xs">{receipt.date}</p>
                  </CardHeader>
                  <CardContent>
                    <Separator className="mb-4 border-dashed border-pink-200" />
                    <div className="space-y-2">
                      {receipt.items.map(i => (
                        <div key={i.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">{i.emoji} {i.name} ×{i.qty}</span>
                          <span className="font-bold text-pink-600">₱{i.price * i.qty}</span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4 border-dashed border-pink-200" />
                    <div className="flex justify-between font-black text-lg">
                      <span>TOTAL</span>
                      <span className="text-pink-600">₱{receipt.total}</span>
                    </div>
                    <p className="text-center text-pink-500 font-semibold text-sm mt-4">🎀 Thank you for shopping with us!</p>
                    <Button
                      className="w-full mt-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                      onClick={() => setReceipt(null)}
                    >
                      Continue Shopping
                    </Button>
                  </CardContent>
                </Card>
              ) : cart.length === 0 ? (
                <Card className="border-pink-100 text-center py-16">
                  <CardContent>
                    <ShoppingCartIcon className="w-16 h-16 text-pink-200 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Your cart is empty!</p>
                    <Button className="mt-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white" onClick={() => setTab("products")}>
                      <ShoppingBagIcon className="w-4 h-4 mr-2" /> Shop Now
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-[1fr_300px] gap-6">
                  <Card className="border-pink-100">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-pink-50/50">
                          {["Product", "Price", "Qty", "Subtotal", ""].map(h => (
                            <TableHead key={h} className="text-pink-600 font-bold">{h}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cart.map(i => (
                          <TableRow key={i.id} className="hover:bg-pink-50/30">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{i.emoji}</span>
                                <span className="font-semibold text-sm">{i.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-500 text-sm">₱{i.price}</TableCell>
                            <TableCell className="font-bold">×{i.qty}</TableCell>
                            <TableCell className="font-black text-pink-600">₱{i.price * i.qty}</TableCell>
                            <TableCell>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => removeFromCart(i.id)}
                                className="w-7 h-7 text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>

                  <Card className="border-pink-100 self-start">
                    <CardHeader>
                      <CardTitle className="text-pink-700 text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-500 text-sm">{cart.length} item{cart.length > 1 ? "s" : ""} in cart</p>
                      <Separator className="border-dashed border-pink-200" />
                      <div className="flex justify-between font-black text-xl">
                        <span>Total</span>
                        <span className="text-pink-600">₱{cartTotal}</span>
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold shadow-md shadow-pink-200 h-11"
                        onClick={checkout}
                      >
                        <CreditCardIcon className="w-4 h-4 mr-2" /> Checkout
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* ABOUT */}
          {tab === "about" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                About Us 💌
              </h1>
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-pink-100">
                  <CardContent className="pt-6 space-y-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                      <HeartIcon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-bold text-xl text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>School Ashentials</p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4 text-pink-400" /> schoolashentials@gmail.com</div>
                      <div className="flex items-center gap-2"><PhoneIcon    className="w-4 h-4 text-pink-400" /> 09124154218</div>
                      <div className="flex items-start gap-2">
                        <MapPinIcon className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                        Ranario Street, Poblacion, Bacuag, Surigao del Norte
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {["📘 Facebook", "📸 Instagram", "🎵 TikTok"].map(s => (
                        <Badge key={s} variant="outline" className="text-pink-600 border-pink-200 bg-pink-50">{s}</Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">@schoolashentials on all platforms</p>
                  </CardContent>
                </Card>

                <Card className="border-pink-100">
                  <CardHeader>
                    <CardTitle className="text-pink-700 text-lg flex items-center gap-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      <ChatBubbleLeftRightIcon className="w-5 h-5 text-pink-400" /> Send Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {fbSent ? (
                      <div className="text-center py-8">
                        <CheckCircleIcon className="w-12 h-12 text-pink-400 mx-auto mb-3" />
                        <p className="font-bold text-pink-600">Thank you for your feedback!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Share your thoughts with us... ✨"
                          className="border-pink-200 focus-visible:ring-pink-300 resize-none h-28"
                        />
                        <Button
                          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold"
                          onClick={() => { if (feedback) setFbSent(true); }}
                        >
                          <PaperAirplaneIcon className="w-4 h-4 mr-2" /> Send Feedback
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ADMIN PORTAL
// ════════════════════════════════════════════════════════════════════════════

function AdminPortal({ user, onLogout }: { user: User; onLogout: () => void }): React.ReactElement {
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
    { label: "Total Products",  value: PRODUCTS.length,   icon: <CubeIcon className="w-6 h-6" />,                color: "from-pink-500 to-rose-500",    bg: "bg-pink-50",   text: "text-pink-600"   },
    { label: "Total Orders",    value: orders.length,     icon: <ClipboardDocumentListIcon className="w-6 h-6" />, color: "from-violet-500 to-purple-500", bg: "bg-violet-50", text: "text-violet-600" },
    { label: "Total Customers", value: 24,                icon: <UsersIcon className="w-6 h-6" />,                color: "from-teal-500 to-cyan-500",    bg: "bg-teal-50",   text: "text-teal-600"   },
    { label: "Total Sales",     value: `₱${totalSales}`, icon: <CurrencyDollarIcon className="w-6 h-6" />,       color: "from-amber-500 to-orange-500", bg: "bg-amber-50",  text: "text-amber-600"  },
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
              <h1 className="text-2xl font-bold text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Dashboard 📊</h1>

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
              <h1 className="text-2xl font-bold text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Orders 📋</h1>
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
                          <Select
                            value={o.status}
                            onValueChange={(v) => updateStatus(o.id, v as AdminOrder["status"])}
                          >
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
              <h1 className="text-2xl font-bold text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Inventory 📦</h1>
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
                            <span className="text-xl">{p.emoji}</span>
                            <span className="font-semibold">{p.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-pink-600">₱{p.price}</TableCell>
                        <TableCell className="font-bold">{p.stock}</TableCell>
                        <TableCell>
                          <StatusBadge status={p.stock === 0 ? "out of stock" : "available"} />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1.5">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateStock(p.id, -1)}
                              className="w-7 h-7 border-rose-200 text-rose-500 hover:bg-rose-50"
                            >
                              <MinusIcon className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateStock(p.id, +1)}
                              className="w-7 h-7 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            >
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
              <h1 className="text-2xl font-bold text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Messages 💬</h1>
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

// ════════════════════════════════════════════════════════════════════════════
// SUPPLIER PORTAL
// ════════════════════════════════════════════════════════════════════════════

function SupplierPortal({ user, onLogout }: { user: User; onLogout: () => void }): React.ReactElement {
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
    { name: "Notebook",     supplied: 200, needed: 50,  emoji: "📓" },
    { name: "Pencil",       supplied: 500, needed: 0,   emoji: "✏️" },
    { name: "Crayons",      supplied: 100, needed: 80,  emoji: "🎨" },
    { name: "Highlighters", supplied: 150, needed: 120, emoji: "🖍️" },
    { name: "Sharpener",    supplied: 0,   needed: 200, emoji: "🔪" },
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
              <h1 className="text-2xl font-bold text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Supplier Dashboard 📊</h1>

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
                        <span className="text-xl shrink-0">{i.emoji}</span>
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
              <h1 className="text-2xl font-bold text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Inventory to Supply 📦</h1>
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
                            <span className="text-xl">{i.emoji}</span>
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
              <h1 className="text-2xl font-bold text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Sales Report 📈</h1>
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
                      <span className="text-sm text-gray-500">Total Q1 Revenue:</span>
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
              <h1 className="text-2xl font-bold text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Messages 💬</h1>
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

// ════════════════════════════════════════════════════════════════════════════
// ROOT
// ════════════════════════════════════════════════════════════════════════════

export default function App(): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);

  if (!user)                    return <LoginPage    onLogin={setUser} />;
  if (user.role === "customer") return <CustomerPortal user={user} onLogout={() => setUser(null)} />;
  if (user.role === "admin")    return <AdminPortal    user={user} onLogout={() => setUser(null)} />;
  if (user.role === "supplier") return <SupplierPortal user={user} onLogout={() => setUser(null)} />;

  return <LoginPage onLogin={setUser} />;
}