import React, { useState } from "react";
import type { CSSProperties } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

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
  icon: string;
  label: string;
}

interface MonthRevenue {
  month: string;
  rev: number;
}

// ── Palette & shared styles ──────────────────────────────────────────────────

const P = {
  pink:      "#FF6B9D",
  pinkLight: "#FFB3CF",
  pinkPale:  "#FFF0F5",
  pinkDark:  "#D63384",
  cream:     "#FFF8FB",
  purple:    "#C084FC",
  purpleL:   "#EDE9FE",
  teal:      "#2DD4BF",
  white:     "#FFFFFF",
  gray:      "#6B7280",
  grayL:     "#F9FAFB",
  dark:      "#1F2937",
} as const;

const FONT_DISPLAY = "'Playfair Display', Georgia, serif";
const FONT_BODY    = "'Nunito', 'Segoe UI', sans-serif";

const btn = (bg: string = P.pink, color: string = P.white): CSSProperties => ({
  background: bg,
  color,
  border: "none",
  borderRadius: 50,
  padding: "10px 26px",
  fontFamily: FONT_BODY,
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
  transition: "all .2s",
  boxShadow: `0 4px 14px ${bg}55`,
});

const card = (extra: CSSProperties = {}): CSSProperties => ({
  background: P.white,
  borderRadius: 20,
  boxShadow: "0 4px 24px rgba(255,107,157,.13)",
  padding: 24,
  ...extra,
});

// ── Product catalogue ────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  { id: 1,  name: "Notebook",     price: 20, emoji: "📓", stock: 45  },
  { id: 2,  name: "Pencil",       price: 10, emoji: "✏️",  stock: 120 },
  { id: 3,  name: "Pen",          price: 10, emoji: "🖊️",  stock: 95  },
  { id: 4,  name: "Eraser",       price: 5,  emoji: "🧽",  stock: 80  },
  { id: 5,  name: "Sharpener",    price: 15, emoji: "✂️",  stock: 0   },
  { id: 6,  name: "Ruler",        price: 20, emoji: "📏",  stock: 60  },
  { id: 7,  name: "Highlighters", price: 40, emoji: "🖍️",  stock: 30  },
  { id: 8,  name: "Glue",         price: 30, emoji: "🪣",  stock: 25  },
  { id: 9,  name: "Scissors",     price: 25, emoji: "✂️",  stock: 0   },
  { id: 10, name: "Crayons",      price: 50, emoji: "🎨",  stock: 18  },
];

// ── Dummy data ───────────────────────────────────────────────────────────────

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

// ── Shared UI helpers ────────────────────────────────────────────────────────

interface BadgeProps {
  status: string;
}

function Badge({ status }: BadgeProps): React.ReactElement {
  const map: Record<string, { bg: string; color: string }> = {
    completed:      { bg: "#D1FAE5", color: "#065F46" },
    processing:     { bg: "#FEF3C7", color: "#92400E" },
    pending:        { bg: "#FEE2E2", color: "#991B1B" },
    "in transit":   { bg: "#DBEAFE", color: "#1E40AF" },
    delivered:      { bg: "#D1FAE5", color: "#065F46" },
    available:      { bg: "#D1FAE5", color: "#065F46" },
    "out of stock": { bg: "#FEE2E2", color: "#991B1B" },
  };
  const s = map[status] ?? { bg: P.pinkPale, color: P.pinkDark };
  return (
    <span style={{ ...s, borderRadius: 50, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>
      {status}
    </span>
  );
}

interface TopBarProps {
  user: User;
  onLogout: () => void;
}

function TopBar({ user, onLogout }: TopBarProps): React.ReactElement {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${P.pinkDark}, ${P.pink})`,
      padding: "14px 32px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 12px rgba(255,107,157,.3)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 26 }}>🎀</span>
        <div>
          <div style={{ fontFamily: FONT_DISPLAY, color: P.white, fontSize: 20, fontWeight: 700 }}>
            School Ashentials
          </div>
          <div style={{ color: P.pinkLight, fontSize: 11 }}>
            Ash-sentials that make school extra special!
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ color: P.white, fontFamily: FONT_BODY, fontSize: 14 }}>
          👤 {user.name} <span style={{ opacity: 0.7 }}>({user.role})</span>
        </span>
        <button style={btn("#ffffff33", P.white)} onClick={onLogout}>Log Out</button>
      </div>
    </div>
  );
}

interface SideNavProps {
  items: NavItem[];
  active: string;
  onSelect: (key: string) => void;
}

function SideNav({ items, active, onSelect }: SideNavProps): React.ReactElement {
  return (
    <div style={{
      width: 220,
      background: P.cream,
      borderRight: `1px solid ${P.pinkLight}`,
      display: "flex",
      flexDirection: "column",
      padding: "24px 0",
      minHeight: "calc(100vh - 56px)",
    }}>
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => onSelect(it.key)}
          style={{
            background: active === it.key
              ? `linear-gradient(90deg,${P.pink},${P.pinkDark})`
              : "transparent",
            color: active === it.key ? P.white : P.gray,
            border: "none",
            textAlign: "left",
            padding: "13px 28px",
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            borderRadius: active === it.key ? "0 30px 30px 0" : 0,
            marginRight: 16,
            marginBottom: 4,
            transition: "all .2s",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span>{it.icon}</span> {it.label}
        </button>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ════════════════════════════════════════════════════════════════════════════

interface LoginPageProps {
  onLogin: (user: User) => void;
}

interface Credential {
  email: string;
  password: string;
  name: string;
}

interface BlobConfig {
  top?: number | string;
  left?: number | string;
  bottom?: number | string;
  right?: number | string;
  size: number;
  color: string;
}

interface FormField {
  label: string;
  val: string;
  set: (v: string) => void;
  type: string;
}

function LoginPage({ onLogin }: LoginPageProps): React.ReactElement {
  const [role, setRole]   = useState<Role>("customer");
  const [email, setEmail] = useState<string>("");
  const [pass, setPass]   = useState<string>("");

  const CREDS: Record<Role, Credential> = {
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

  const blobs: BlobConfig[] = [
    { top: -80,   left: -80,  size: 260, color: `${P.pinkLight}80` },
    { bottom: -60, right: -60, size: 200, color: `${P.purple}55`   },
    { top: "40%", right: "-5%", size: 140, color: `${P.pink}40`    },
  ];

  const fields: FormField[] = [
    { label: "Email",    val: email, set: setEmail, type: "email"    },
    { label: "Password", val: pass,  set: setPass,  type: "password" },
  ];

  const roles: Role[] = ["customer", "admin", "supplier"];

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg,${P.pinkPale} 0%,${P.purpleL} 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT_BODY,
    }}>
      {blobs.map((b, i) => (
        <div key={i} style={{
          position: "fixed",
          top: b.top as CSSProperties["top"],
          left: b.left as CSSProperties["left"],
          bottom: b.bottom as CSSProperties["bottom"],
          right: b.right as CSSProperties["right"],
          width: b.size,
          height: b.size,
          borderRadius: "50%",
          background: b.color,
          pointerEvents: "none",
        }} />
      ))}

      <div style={{ ...card(), width: 400, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎀</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: P.pinkDark, fontWeight: 700 }}>
            School Ashentials
          </div>
          <div style={{ color: P.gray, fontSize: 13, marginTop: 4 }}>
            Ash-sentials that make school extra special!
          </div>
        </div>

        <div style={{
          display: "flex", gap: 8, marginBottom: 22,
          background: P.pinkPale, borderRadius: 50, padding: 5,
        }}>
          {roles.map((r) => (
            <button key={r} onClick={() => setRole(r)} style={{
              flex: 1,
              padding: "9px 0",
              borderRadius: 50,
              border: "none",
              background: role === r
                ? `linear-gradient(135deg,${P.pink},${P.pinkDark})`
                : "transparent",
              color: role === r ? P.white : P.gray,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              transition: "all .2s",
              fontFamily: FONT_BODY,
              textTransform: "capitalize",
            }}>
              {r}
            </button>
          ))}
        </div>

        {fields.map((f) => (
          <div key={f.label} style={{ marginBottom: 16 }}>
            <label style={{
              fontSize: 13, fontWeight: 700, color: P.dark,
              display: "block", marginBottom: 6,
            }}>
              {f.label}
            </label>
            <input
              type={f.type}
              value={f.val}
              onChange={(e) => f.set(e.target.value)}
              style={{
                width: "100%", padding: "12px 16px",
                border: `2px solid ${P.pinkLight}`, borderRadius: 12,
                fontFamily: FONT_BODY, fontSize: 14, outline: "none",
                boxSizing: "border-box", transition: "border .2s",
              }}
              onFocus={(e) => { e.target.style.borderColor = P.pink; }}
              onBlur={(e)  => { e.target.style.borderColor = P.pinkLight; }}
            />
          </div>
        ))}

        <button
          style={{ ...btn(), width: "100%", padding: "13px 0", fontSize: 15, marginTop: 6 }}
          onClick={handle}
        >
          Log In as {role.charAt(0).toUpperCase() + role.slice(1)} 🎀
        </button>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: P.gray }}>
          Demo hints are shown on wrong login ✨
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CUSTOMER PORTAL
// ════════════════════════════════════════════════════════════════════════════

interface CustomerPortalProps {
  user: User;
  onLogout: () => void;
}

function CustomerPortal({ user, onLogout }: CustomerPortalProps): React.ReactElement {
  const [tab, setTab]         = useState<string>("profile");
  const [cart, setCart]       = useState<CartItem[]>([]);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [fbSent, setFbSent]   = useState<boolean>(false);

  const [orders] = useState<CustomerOrder[]>([
    { id: "ORD-C01", item: "Notebook×2, Pen×1", total: 50, status: "To Receive"    },
    { id: "ORD-C02", item: "Crayons×1",          total: 50, status: "Ready to Ship" },
    { id: "ORD-C03", item: "Glue×2",             total: 60, status: "Ready to Pay"  },
  ]);

  const addToCart = (p: Product): void => {
    setCart((c) => {
      const ex = c.find((x) => x.id === p.id);
      return ex
        ? c.map((x) => x.id === p.id ? { ...x, qty: x.qty + 1 } : x)
        : [...c, { ...p, qty: 1 }];
    });
  };

  const removeFromCart = (id: number): void =>
    setCart((c) => c.filter((x) => x.id !== id));

  const cartTotal = cart.reduce((a, b) => a + b.price * b.qty, 0);

  const checkout = (): void => {
    if (!cart.length) return;
    setReceipt({ items: [...cart], total: cartTotal, date: new Date().toLocaleString() });
    setCart([]);
  };

  const navItems: NavItem[] = [
    { key: "profile",  icon: "👤", label: "My Profile"           },
    { key: "products", icon: "🛍️", label: "Products"             },
    { key: "cart",     icon: "🛒", label: `Cart (${cart.length})` },
    { key: "about",    icon: "💌", label: "About Us"             },
  ];

  interface OrderStatusCard { label: string; icon: string; count: number; }
  const statusCards: OrderStatusCard[] = [
    { label: "Ready to Pay",  icon: "💳", count: orders.filter((o) => o.status === "Ready to Pay").length  },
    { label: "Ready to Ship", icon: "📦", count: orders.filter((o) => o.status === "Ready to Ship").length },
    { label: "To Receive",    icon: "🚚", count: orders.filter((o) => o.status === "To Receive").length    },
  ];

  return (
    <div style={{ fontFamily: FONT_BODY, minHeight: "100vh", background: P.cream }}>
      <TopBar user={user} onLogout={onLogout} />
      <div style={{ display: "flex" }}>
        <SideNav items={navItems} active={tab} onSelect={setTab} />
        <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>

          {/* PROFILE */}
          {tab === "profile" && (
            <div>
              <h2 style={{ fontFamily: FONT_DISPLAY, color: P.pinkDark, marginBottom: 24 }}>My Profile 💗</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={card()}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
                  <div style={{ fontWeight: 800, fontSize: 20, color: P.dark }}>{user.name}</div>
                  <div style={{ color: P.gray, marginTop: 8, lineHeight: 1.8, fontSize: 14 }}>
                    📧 customer@ashentials.com<br />
                    📞 09124154218<br />
                    📍 Bacuag, Surigao del Norte
                  </div>
                </div>
                <div style={card({ background: `linear-gradient(135deg,${P.pink},${P.pinkDark})` })}>
                  <div style={{ color: P.white, fontSize: 14, fontWeight: 600, marginBottom: 8 }}>⭐ Reward Points</div>
                  <div style={{ color: P.white, fontSize: 48, fontWeight: 800 }}>320</div>
                  <div style={{ color: P.pinkLight, fontSize: 13 }}>Keep shopping to earn more! 🎀</div>
                </div>
              </div>

              <h3 style={{ color: P.pinkDark, margin: "28px 0 14px", fontFamily: FONT_DISPLAY }}>Order Status</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {statusCards.map((s) => (
                  <div key={s.label} style={card({ textAlign: "center" })}>
                    <div style={{ fontSize: 32 }}>{s.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 28, color: P.pinkDark }}>{s.count}</div>
                    <div style={{ color: P.gray, fontSize: 13, fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <h3 style={{ color: P.pinkDark, margin: "28px 0 14px", fontFamily: FONT_DISPLAY }}>Products Bought</h3>
              <div style={card()}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${P.pinkLight}` }}>
                      {["Order ID", "Items", "Total", "Status"].map((h) => (
                        <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: P.pinkDark, fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} style={{ borderBottom: `1px solid ${P.pinkPale}` }}>
                        <td style={{ padding: "10px 12px", fontWeight: 600 }}>{o.id}</td>
                        <td style={{ padding: "10px 12px", color: P.gray }}>{o.item}</td>
                        <td style={{ padding: "10px 12px", color: P.pinkDark, fontWeight: 700 }}>₱{o.total}</td>
                        <td style={{ padding: "10px 12px" }}><Badge status={o.status.toLowerCase()} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {tab === "products" && (
            <div>
              <h2 style={{ fontFamily: FONT_DISPLAY, color: P.pinkDark, marginBottom: 24 }}>Our Products 🛍️</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 18 }}>
                {PRODUCTS.map((p) => (
                  <div key={p.id} style={{ ...card(), textAlign: "center", position: "relative" }}>
                    {p.stock === 0 && (
                      <div style={{
                        position: "absolute", top: 12, right: 12,
                        background: "#FEE2E2", color: "#991B1B",
                        fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 50,
                      }}>OUT OF STOCK</div>
                    )}
                    <div style={{ fontSize: 52, marginBottom: 8 }}>{p.emoji}</div>
                    <div style={{ fontWeight: 700, color: P.dark, fontSize: 15 }}>{p.name}</div>
                    <div style={{ color: P.pinkDark, fontWeight: 800, fontSize: 20, margin: "8px 0" }}>₱{p.price}</div>
                    <button
                      onClick={() => p.stock > 0 && addToCart(p)}
                      style={{
                        ...btn(p.stock === 0 ? "#E5E7EB" : P.pink, p.stock === 0 ? P.gray : P.white),
                        width: "100%", padding: "9px 0", fontSize: 13,
                        cursor: p.stock === 0 ? "not-allowed" : "pointer",
                      }}
                    >
                      {p.stock === 0 ? "Unavailable" : "Add to Cart 🛒"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CART */}
          {tab === "cart" && (
            <div>
              <h2 style={{ fontFamily: FONT_DISPLAY, color: P.pinkDark, marginBottom: 24 }}>My Cart 🛒</h2>

              {receipt ? (
                <div style={card({ maxWidth: 500 })}>
                  <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <div style={{ fontSize: 48 }}>🧾</div>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: P.pinkDark, fontWeight: 700 }}>Receipt</div>
                    <div style={{ color: P.gray, fontSize: 13 }}>{receipt.date}</div>
                  </div>
                  <div style={{ borderTop: `2px dashed ${P.pinkLight}`, paddingTop: 16 }}>
                    {receipt.items.map((i) => (
                      <div key={i.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 }}>
                        <span>{i.emoji} {i.name} ×{i.qty}</span>
                        <span style={{ fontWeight: 700, color: P.pinkDark }}>₱{i.price * i.qty}</span>
                      </div>
                    ))}
                    <div style={{
                      borderTop: `2px dashed ${P.pinkLight}`, marginTop: 12, paddingTop: 12,
                      display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 18,
                    }}>
                      <span>TOTAL</span>
                      <span style={{ color: P.pinkDark }}>₱{receipt.total}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "center", marginTop: 16, color: P.pink, fontWeight: 700 }}>
                    🎀 Thank you for shopping with us!
                  </div>
                  <button style={{ ...btn(), width: "100%", marginTop: 16 }} onClick={() => setReceipt(null)}>
                    Continue Shopping
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div style={{ ...card(), textAlign: "center", padding: 48 }}>
                  <div style={{ fontSize: 64 }}>🛒</div>
                  <div style={{ color: P.gray, fontSize: 16, marginTop: 12 }}>Your cart is empty!</div>
                  <button style={{ ...btn(), marginTop: 20 }} onClick={() => setTab("products")}>
                    Shop Now 🛍️
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
                  <div style={card()}>
                    {cart.map((i) => (
                      <div key={i.id} style={{
                        display: "flex", alignItems: "center", gap: 16,
                        padding: "14px 0", borderBottom: `1px solid ${P.pinkPale}`,
                      }}>
                        <span style={{ fontSize: 36 }}>{i.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700 }}>{i.name}</div>
                          <div style={{ color: P.gray, fontSize: 13 }}>₱{i.price} each</div>
                        </div>
                        <div style={{ fontWeight: 800, color: P.pinkDark, fontSize: 16 }}>×{i.qty}</div>
                        <div style={{ fontWeight: 800, color: P.pinkDark }}>₱{i.price * i.qty}</div>
                        <button
                          onClick={() => removeFromCart(i.id)}
                          style={{
                            background: "#FEE2E2", border: "none", borderRadius: 50,
                            width: 30, height: 30, cursor: "pointer", color: "#991B1B", fontWeight: 700,
                          }}
                        >×</button>
                      </div>
                    ))}
                  </div>
                  <div style={card({ alignSelf: "start" })}>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: P.pinkDark, marginBottom: 16 }}>Order Summary</div>
                    <div style={{ color: P.gray, fontSize: 14, marginBottom: 8 }}>
                      {cart.length} item{cart.length > 1 ? "s" : ""} in cart
                    </div>
                    <div style={{
                      borderTop: `2px dashed ${P.pinkLight}`, paddingTop: 14,
                      display: "flex", justifyContent: "space-between",
                      fontWeight: 800, fontSize: 20, marginBottom: 18,
                    }}>
                      <span>Total</span>
                      <span style={{ color: P.pinkDark }}>₱{cartTotal}</span>
                    </div>
                    <button style={{ ...btn(), width: "100%", padding: "13px 0", fontSize: 15 }} onClick={checkout}>
                      Checkout 💳
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ABOUT */}
          {tab === "about" && (
            <div>
              <h2 style={{ fontFamily: FONT_DISPLAY, color: P.pinkDark, marginBottom: 24 }}>About Us 💌</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={card()}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🎀</div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: P.pinkDark, fontWeight: 700, marginBottom: 12 }}>
                    School Ashentials
                  </div>
                  <div style={{ color: P.gray, lineHeight: 1.8, fontSize: 14 }}>
                    📧 schoolashentials@gmail.com<br />
                    📞 09124154218<br />
                    📍 Ranario Street, Poblacion, Bacuag, Surigao del Norte
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                    {["📘 Facebook", "📸 Instagram", "🎵 TikTok"].map((s) => (
                      <span key={s} style={{
                        background: P.pinkPale, color: P.pinkDark,
                        padding: "5px 12px", borderRadius: 50, fontSize: 13, fontWeight: 600,
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <div style={{ color: P.gray, fontSize: 12, marginTop: 8 }}>@schoolashentials on all platforms</div>
                </div>
                <div style={card()}>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: P.pinkDark, marginBottom: 16 }}>💬 Send Feedback</div>
                  {fbSent ? (
                    <div style={{ textAlign: "center", padding: 20, color: P.pink, fontWeight: 700 }}>
                      <div style={{ fontSize: 40 }}>💌</div>
                      Thank you for your feedback!
                    </div>
                  ) : (
                    <>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Share your thoughts with us... ✨"
                        style={{
                          width: "100%", height: 120,
                          border: `2px solid ${P.pinkLight}`, borderRadius: 12,
                          padding: 12, fontFamily: FONT_BODY, fontSize: 14,
                          resize: "none", outline: "none", boxSizing: "border-box",
                        }}
                      />
                      <button
                        style={{ ...btn(), width: "100%", marginTop: 12 }}
                        onClick={() => { if (feedback) setFbSent(true); }}
                      >
                        Send Feedback 💌
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ADMIN PORTAL
// ════════════════════════════════════════════════════════════════════════════

interface AdminPortalProps {
  user: User;
  onLogout: () => void;
}

function AdminPortal({ user, onLogout }: AdminPortalProps): React.ReactElement {
  const [tab, setTab]               = useState<string>("dashboard");
  const [inventory, setInventory]   = useState<Product[]>(PRODUCTS.map((p) => ({ ...p })));
  const [orders, setOrders]         = useState<AdminOrder[]>(ORDERS_ADMIN);
  const [messages]                  = useState<Message[]>(MESSAGES);

  const navItems: NavItem[] = [
    { key: "dashboard", icon: "📊", label: "Dashboard" },
    { key: "orders",    icon: "📋", label: "Orders"    },
    { key: "inventory", icon: "📦", label: "Inventory" },
    { key: "messages",  icon: "💬", label: "Messages"  },
  ];

  const updateStatus = (id: string, status: AdminOrder["status"]): void =>
    setOrders((o) => o.map((x) => x.id === id ? { ...x, status } : x));

  const updateStock = (id: number, delta: number): void =>
    setInventory((inv) => inv.map((p) => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));

  const totalSales   = orders.filter((o) => o.status === "completed").reduce((a, b) => a + b.total, 0);
  const totalOrders  = orders.length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  interface StatCard { label: string; value: string | number; icon: string; color: string; }
  const statCards: StatCard[] = [
    { label: "Total Products",  value: PRODUCTS.length, icon: "📦", color: P.pink     },
    { label: "Total Orders",    value: totalOrders,     icon: "📋", color: P.purple   },
    { label: "Total Customers", value: 24,              icon: "👥", color: P.teal     },
    { label: "Total Sales",     value: `₱${totalSales}`,icon: "💰", color: P.pinkDark },
  ];

  interface SalesMonth { month: string; sales: number; }
  const salesMonths: SalesMonth[] = [
    { month: "Jan", sales: 1200 },
    { month: "Feb", sales: 1850 },
    { month: "Mar", sales: 980  },
  ];

  interface Alert { msg: string; type: "err" | "warn" | "ok"; }
  const alerts: Alert[] = [
    { msg: `${pendingCount} pending orders`, type: "warn" },
    { msg: "Sharpener out of stock",         type: "err"  },
    { msg: "Scissors out of stock",          type: "err"  },
    { msg: "5 suppliers active",             type: "ok"   },
  ];

  return (
    <div style={{ fontFamily: FONT_BODY, minHeight: "100vh", background: P.cream }}>
      <TopBar user={user} onLogout={onLogout} />
      <div style={{ display: "flex" }}>
        <SideNav items={navItems} active={tab} onSelect={setTab} />
        <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>

          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <div>
              <h2 style={{ fontFamily: FONT_DISPLAY, color: P.pinkDark, marginBottom: 24 }}>Dashboard 📊</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                {statCards.map((s) => (
                  <div key={s.label} style={{ ...card(), borderTop: `4px solid ${s.color}` }}>
                    <div style={{ fontSize: 28 }}>{s.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 26, color: s.color, margin: "6px 0" }}>{s.value}</div>
                    <div style={{ color: P.gray, fontSize: 13 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
                <div style={card()}>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: P.pinkDark, marginBottom: 16 }}>📈 Sales Summary</div>
                  {salesMonths.map((r) => (
                    <div key={r.month} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4, fontWeight: 600 }}>
                        <span>{r.month} 2026</span>
                        <span style={{ color: P.pinkDark }}>₱{r.sales}</span>
                      </div>
                      <div style={{ background: P.pinkPale, borderRadius: 50, height: 10 }}>
                        <div style={{
                          background: `linear-gradient(90deg,${P.pink},${P.pinkDark})`,
                          borderRadius: 50, height: 10, width: `${(r.sales / 2000) * 100}%`,
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={card()}>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: P.pinkDark, marginBottom: 16 }}>🔔 Alerts</div>
                  {alerts.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10, fontSize: 13 }}>
                      <span>{a.type === "err" ? "🔴" : a.type === "warn" ? "🟡" : "🟢"}</span>
                      <span style={{ color: P.dark }}>{a.msg}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 12, color: P.gray, fontSize: 12 }}>
                    👥 Number of suppliers: <strong style={{ color: P.pinkDark }}>5</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {tab === "orders" && (
            <div>
              <h2 style={{ fontFamily: FONT_DISPLAY, color: P.pinkDark, marginBottom: 24 }}>Orders 📋</h2>
              <div style={card()}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${P.pinkLight}` }}>
                      {["Order ID", "Customer", "Items", "Total", "Status", "Actions"].map((h) => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: P.pinkDark, fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} style={{ borderBottom: `1px solid ${P.pinkPale}` }}>
                        <td style={{ padding: "11px 12px", fontWeight: 700, color: P.dark }}>{o.id}</td>
                        <td style={{ padding: "11px 12px" }}>{o.customer}</td>
                        <td style={{ padding: "11px 12px", color: P.gray, fontSize: 13 }}>{o.items}</td>
                        <td style={{ padding: "11px 12px", fontWeight: 700, color: P.pinkDark }}>₱{o.total}</td>
                        <td style={{ padding: "11px 12px" }}><Badge status={o.status} /></td>
                        <td style={{ padding: "11px 12px" }}>
                          <select
                            value={o.status}
                            onChange={(e) => updateStatus(o.id, e.target.value as AdminOrder["status"])}
                            style={{
                              border: `1px solid ${P.pinkLight}`, borderRadius: 8,
                              padding: "5px 8px", fontFamily: FONT_BODY, fontSize: 12, cursor: "pointer",
                            }}
                          >
                            {(["pending", "processing", "completed"] as AdminOrder["status"][]).map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INVENTORY */}
          {tab === "inventory" && (
            <div>
              <h2 style={{ fontFamily: FONT_DISPLAY, color: P.pinkDark, marginBottom: 24 }}>Inventory 📦</h2>
              <div style={card()}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${P.pinkLight}` }}>
                      {["Product", "Price", "Stock", "Status", "Adjust"].map((h) => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: P.pinkDark, fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((p) => (
                      <tr key={p.id} style={{ borderBottom: `1px solid ${P.pinkPale}` }}>
                        <td style={{ padding: "11px 12px" }}><span style={{ marginRight: 8 }}>{p.emoji}</span>{p.name}</td>
                        <td style={{ padding: "11px 12px", color: P.pinkDark, fontWeight: 700 }}>₱{p.price}</td>
                        <td style={{ padding: "11px 12px", fontWeight: 700 }}>{p.stock}</td>
                        <td style={{ padding: "11px 12px" }}>
                          <Badge status={p.stock === 0 ? "out of stock" : "available"} />
                        </td>
                        <td style={{ padding: "11px 12px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              onClick={() => updateStock(p.id, -1)}
                              style={{ ...btn("#FEE2E2", "#991B1B"), padding: "4px 12px", fontSize: 16, boxShadow: "none" }}
                            >−</button>
                            <button
                              onClick={() => updateStock(p.id, +1)}
                              style={{ ...btn("#D1FAE5", "#065F46"), padding: "4px 12px", fontSize: 16, boxShadow: "none" }}
                            >+</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {tab === "messages" && (
            <div>
              <h2 style={{ fontFamily: FONT_DISPLAY, color: P.pinkDark, marginBottom: 24 }}>Messages 💬</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{
                    ...card({ display: "flex", alignItems: "center", gap: 16, padding: 18 }),
                    border: m.unread ? `2px solid ${P.pinkLight}` : "2px solid transparent",
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: `linear-gradient(135deg,${P.pink},${P.pinkDark})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: P.white, fontWeight: 800, fontSize: 18, flexShrink: 0,
                    }}>
                      {m.from[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, color: P.dark }}>{m.from}</span>
                        <span style={{ fontSize: 12, color: P.gray }}>{m.time}</span>
                      </div>
                      <div style={{ color: P.gray, fontSize: 14 }}>{m.text}</div>
                    </div>
                    {m.unread && <div style={{ width: 10, height: 10, borderRadius: "50%", background: P.pink, flexShrink: 0 }} />}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SUPPLIER PORTAL
// ════════════════════════════════════════════════════════════════════════════

interface SupplierPortalProps {
  user: User;
  onLogout: () => void;
}

function SupplierPortal({ user, onLogout }: SupplierPortalProps): React.ReactElement {
  const [tab, setTab]      = useState<string>("dashboard");
  const [supplyOrders]     = useState<SupplyOrder[]>(SUPPLY_ORDERS);
  const [messages]         = useState<Message[]>(MESSAGES.filter((m) => !m.unread));

  const navItems: NavItem[] = [
    { key: "dashboard", icon: "📊", label: "Dashboard"    },
    { key: "inventory", icon: "📦", label: "Inventory"    },
    { key: "sales",     icon: "📈", label: "Sales Report" },
    { key: "messages",  icon: "💬", label: "Messages"     },
  ];

  const supplyItems: SupplyItem[] = [
    { name: "Notebook",     supplied: 200, needed: 50,  emoji: "📓" },
    { name: "Pencil",       supplied: 500, needed: 0,   emoji: "✏️" },
    { name: "Crayons",      supplied: 100, needed: 80,  emoji: "🎨" },
    { name: "Highlighters", supplied: 150, needed: 120, emoji: "🖍️" },
    { name: "Sharpener",    supplied: 0,   needed: 200, emoji: "✂️" },
  ];

  const totalRevenue     = 18450;
  const completedOrders  = supplyOrders.filter((o) => o.status === "delivered").length;

  interface SupplierStatCard { label: string; value: string | number; icon: string; color: string; }
  const statCards: SupplierStatCard[] = [
    { label: "Total Revenue",     value: `₱${totalRevenue.toLocaleString()}`, icon: "💰", color: P.pinkDark },
    { label: "Products Supplied", value: supplyItems.length,                  icon: "📦", color: P.purple   },
    { label: "Completed Orders",  value: completedOrders,                     icon: "✅", color: P.teal     },
  ];

  const salesMonths: MonthRevenue[] = [
    { month: "January",  rev: 5200 },
    { month: "February", rev: 7800 },
    { month: "March",    rev: 5450 },
  ];

  const supplierMessages: Message[] = [
    { from: "School Ashentials Admin", text: "Please send 200 more notebooks ASAP!", time: "3h ago", unread: true  },
    { from: "School Ashentials Admin", text: "Invoice #SUP-003 has been received.",  time: "1d ago", unread: false },
    ...messages,
  ];

  return (
    <div style={{ fontFamily: FONT_BODY, minHeight: "100vh", background: P.cream }}>
      <TopBar user={user} onLogout={onLogout} />
      <div style={{ display: "flex" }}>
        <SideNav items={navItems} active={tab} onSelect={setTab} />
        <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>

          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <div>
              <h2 style={{ fontFamily: FONT_DISPLAY, color: P.pinkDark, marginBottom: 24 }}>Supplier Dashboard 📊</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
                {statCards.map((s) => (
                  <div key={s.label} style={{ ...card(), borderTop: `4px solid ${s.color}` }}>
                    <div style={{ fontSize: 28 }}>{s.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 26, color: s.color, margin: "6px 0" }}>{s.value}</div>
                    <div style={{ color: P.gray, fontSize: 13 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={card()}>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: P.pinkDark, marginBottom: 16 }}>
                    📋 Recent Orders from School Ashentials
                  </div>
                  {supplyOrders.map((o) => (
                    <div key={o.id} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "10px 0", borderBottom: `1px solid ${P.pinkPale}`, fontSize: 14,
                    }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{o.product}</div>
                        <div style={{ color: P.gray, fontSize: 12 }}>Qty: {o.qty} · {o.date}</div>
                      </div>
                      <Badge status={o.status} />
                    </div>
                  ))}
                </div>
                <div style={card()}>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: P.pinkDark, marginBottom: 16 }}>
                    📦 Products Supplied
                  </div>
                  {supplyItems.map((i) => (
                    <div key={i.name} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, fontSize: 14 }}>
                      <span style={{ fontSize: 22 }}>{i.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{i.name}</div>
                        <div style={{ background: P.pinkPale, borderRadius: 50, height: 7, marginTop: 3 }}>
                          <div style={{
                            background: `linear-gradient(90deg,${P.pink},${P.pinkDark})`,
                            borderRadius: 50, height: 7,
                            width: `${Math.min(100, (i.supplied / (i.supplied + i.needed + 1)) * 100)}%`,
                          }} />
                        </div>
                      </div>
                      <span style={{ color: P.pinkDark, fontWeight: 700, fontSize: 12 }}>{i.supplied} units</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* INVENTORY */}
          {tab === "inventory" && (
            <div>
              <h2 style={{ fontFamily: FONT_DISPLAY, color: P.pinkDark, marginBottom: 24 }}>Inventory to Supply 📦</h2>
              <div style={card()}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${P.pinkLight}` }}>
                      {["Product", "Supplied", "Still Needed", "Status"].map((h) => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: P.pinkDark, fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {supplyItems.map((i) => (
                      <tr key={i.name} style={{ borderBottom: `1px solid ${P.pinkPale}` }}>
                        <td style={{ padding: "12px 12px" }}><span style={{ marginRight: 8 }}>{i.emoji}</span>{i.name}</td>
                        <td style={{ padding: "12px 12px", fontWeight: 700, color: P.teal }}>{i.supplied} units</td>
                        <td style={{ padding: "12px 12px", fontWeight: 700, color: i.needed > 0 ? P.pinkDark : P.gray }}>
                          {i.needed > 0 ? `${i.needed} units` : "—"}
                        </td>
                        <td style={{ padding: "12px 12px" }}>
                          <Badge status={i.needed === 0 ? "available" : i.supplied === 0 ? "out of stock" : "in transit"} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SALES REPORT */}
          {tab === "sales" && (
            <div>
              <h2 style={{ fontFamily: FONT_DISPLAY, color: P.pinkDark, marginBottom: 24 }}>Sales Report 📈</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={card()}>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: P.pinkDark, marginBottom: 16 }}>Monthly Revenue</div>
                  {salesMonths.map((r) => (
                    <div key={r.month} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5, fontWeight: 600 }}>
                        <span>{r.month} 2026</span>
                        <span style={{ color: P.pinkDark }}>₱{r.rev.toLocaleString()}</span>
                      </div>
                      <div style={{ background: P.pinkPale, borderRadius: 50, height: 12 }}>
                        <div style={{
                          background: `linear-gradient(90deg,${P.pink},${P.pinkDark})`,
                          borderRadius: 50, height: 12,
                          width: `${(r.rev / 9000) * 100}%`,
                          transition: "width .5s",
                        }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 16, padding: "12px 16px", background: P.pinkPale, borderRadius: 12 }}>
                    <span style={{ color: P.gray, fontSize: 13 }}>Total Revenue 2026 (Q1):</span>
                    <span style={{ color: P.pinkDark, fontWeight: 800, fontSize: 18, marginLeft: 10 }}>₱18,450</span>
                  </div>
                </div>
                <div style={card()}>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: P.pinkDark, marginBottom: 16 }}>Order Breakdown</div>
                  {supplyOrders.map((o) => (
                    <div key={o.id} style={{ padding: "11px 0", borderBottom: `1px solid ${P.pinkPale}`, fontSize: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontWeight: 700 }}>{o.id} – {o.product}</span>
                        <Badge status={o.status} />
                      </div>
                      <div style={{ color: P.gray, fontSize: 12 }}>Qty: {o.qty} units · {o.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {tab === "messages" && (
            <div>
              <h2 style={{ fontFamily: FONT_DISPLAY, color: P.pinkDark, marginBottom: 24 }}>Messages 💬</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {supplierMessages.map((m, i) => (
                  <div key={i} style={{
                    ...card({ display: "flex", alignItems: "center", gap: 16, padding: 18 }),
                    border: m.unread ? `2px solid ${P.pinkLight}` : "2px solid transparent",
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: `linear-gradient(135deg,${P.pink},${P.pinkDark})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: P.white, fontWeight: 800, fontSize: 18, flexShrink: 0,
                    }}>
                      {m.from[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, color: P.dark }}>{m.from}</span>
                        <span style={{ fontSize: 12, color: P.gray }}>{m.time}</span>
                      </div>
                      <div style={{ color: P.gray, fontSize: 14 }}>{m.text}</div>
                    </div>
                    {m.unread && <div style={{ width: 10, height: 10, borderRadius: "50%", background: P.pink, flexShrink: 0 }} />}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ROOT
// ════════════════════════════════════════════════════════════════════════════

export default function App(): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);

  if (!user)                    return <LoginPage onLogin={setUser} />;
  if (user.role === "customer") return <CustomerPortal user={user} onLogout={() => setUser(null)} />;
  if (user.role === "admin")    return <AdminPortal    user={user} onLogout={() => setUser(null)} />;
  if (user.role === "supplier") return <SupplierPortal user={user} onLogout={() => setUser(null)} />;

  return <LoginPage onLogin={setUser} />;
}