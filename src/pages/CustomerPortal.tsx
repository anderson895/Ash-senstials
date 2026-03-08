import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  UserIcon, ShoppingBagIcon, ShoppingCartIcon, HeartIcon,
  ClipboardDocumentListIcon, ArchiveBoxIcon, ChatBubbleLeftRightIcon,
  TruckIcon, CreditCardIcon, TrashIcon, PaperAirplaneIcon,
  MapPinIcon, PhoneIcon, EnvelopeIcon, CheckCircleIcon,
  ReceiptPercentIcon, GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { TopBar, SideNav, StatusBadge } from "../components/shared";
import { PRODUCTS } from "../data";
import type { User, Product, CartItem, Receipt, CustomerOrder, NavItem } from "../types";

export default function CustomerPortal({ user, onLogout }: { user: User; onLogout: () => void }): React.ReactElement {
  const [tab, setTab]           = useState<string>("profile");
  const [cart, setCart]         = useState<CartItem[]>([]);
  const [receipt, setReceipt]   = useState<Receipt | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [fbSent, setFbSent]     = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [orders] = useState<CustomerOrder[]>([
    { id: "ORD-C01", item: "Notebook×2, Pen×1", total: 50, status: "To Receive"    },
    { id: "ORD-C02", item: "Crayons×1",          total: 50, status: "Ready to Ship" },
    { id: "ORD-C03", item: "Glue×2",             total: 60, status: "Ready to Pay"  },
  ]);

  const addToCart = (p: Product): void =>
    setCart((c) => {
      const ex = c.find((x) => x.id === p.id);
      return ex ? c.map((x) => x.id === p.id ? { ...x, qty: x.qty + 1 } : x) : [...c, { ...p, qty: 1 }];
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
    <div className="min-h-screen bg-pink-50/30 pb-16 lg:pb-0" style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>
      <TopBar user={user} onLogout={onLogout} onMenuToggle={() => setMenuOpen(true)} />
      <div className="flex">
        <SideNav items={navItems} active={tab} onSelect={setTab} open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">

          {/* PROFILE */}
          {tab === "profile" && (
            <div className="space-y-5 sm:space-y-6">
              <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-pink-700"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <UserIcon className="w-6 h-6 sm:w-7 sm:h-7 text-pink-500" /> My Profile
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="border-pink-100">
                  <CardContent className="pt-5 sm:pt-6">
                    <Avatar className="w-12 h-12 sm:w-14 sm:h-14 mb-3 sm:mb-4">
                      <AvatarFallback className="bg-pink-100 text-pink-600 text-lg sm:text-xl font-bold">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-bold text-lg sm:text-xl text-gray-800">{user.name}</p>
                    <div className="mt-3 space-y-1.5 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4 text-pink-400 shrink-0" /> customer@ashentials.com</div>
                      <div className="flex items-center gap-2"><PhoneIcon    className="w-4 h-4 text-pink-400 shrink-0" /> 09124154218</div>
                      <div className="flex items-center gap-2"><MapPinIcon   className="w-4 h-4 text-pink-400 shrink-0" /> Bacuag, Surigao del Norte</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-pink-500 to-rose-500 border-0 text-white">
                  <CardContent className="pt-5 sm:pt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <StarSolid className="w-5 h-5 text-yellow-300" />
                      <span className="font-semibold text-pink-100 text-sm">Reward Points</span>
                    </div>
                    <p className="text-5xl sm:text-6xl font-black">320</p>
                    <p className="text-pink-200 text-sm mt-2 flex items-center gap-1">
                      <StarSolid className="w-3.5 h-3.5 text-yellow-300" />
                      Keep shopping to earn more!
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold text-pink-700 mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  <ClipboardDocumentListIcon className="w-5 h-5 text-pink-400" /> Order Status
                </h2>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {[
                    { label: "Ready to Pay",  icon: <CreditCardIcon className="w-6 h-6 sm:w-7 sm:h-7" />, count: orders.filter(o => o.status === "Ready to Pay").length,  color: "text-violet-500" },
                    { label: "Ready to Ship", icon: <ArchiveBoxIcon  className="w-6 h-6 sm:w-7 sm:h-7" />, count: orders.filter(o => o.status === "Ready to Ship").length, color: "text-sky-500"    },
                    { label: "To Receive",    icon: <TruckIcon       className="w-6 h-6 sm:w-7 sm:h-7" />, count: orders.filter(o => o.status === "To Receive").length,    color: "text-teal-500"  },
                  ].map((s) => (
                    <Card key={s.label} className="border-pink-100 text-center">
                      <CardContent className="pt-4 sm:pt-6 px-2 sm:px-4">
                        <div className={`mx-auto mb-1 sm:mb-2 ${s.color}`}>{s.icon}</div>
                        <p className="text-2xl sm:text-3xl font-black text-pink-600">{s.count}</p>
                        <p className="text-[10px] sm:text-xs font-semibold text-gray-500 mt-1">{s.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold text-pink-700 mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  <ShoppingBagIcon className="w-5 h-5 text-pink-400" /> Products Bought
                </h2>
                <Card className="border-pink-100 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-pink-50/50">
                        {["Order ID", "Items", "Total", "Status"].map(h => (
                          <TableHead key={h} className="text-pink-600 font-bold text-xs sm:text-sm whitespace-nowrap">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map(o => (
                        <TableRow key={o.id} className="hover:bg-pink-50/30">
                          <TableCell className="font-semibold text-xs sm:text-sm whitespace-nowrap">{o.id}</TableCell>
                          <TableCell className="text-gray-500 text-xs sm:text-sm">{o.item}</TableCell>
                          <TableCell className="font-bold text-pink-600 text-xs sm:text-sm whitespace-nowrap">₱{o.total}</TableCell>
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
            <div className="space-y-5 sm:space-y-6">
              <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-pink-700"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <ShoppingBagIcon className="w-6 h-6 sm:w-7 sm:h-7 text-pink-500" /> Our Products
              </h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {PRODUCTS.map(p => (
                  <Card key={p.id} className={`border-pink-100 hover:shadow-md hover:shadow-pink-100 transition-shadow relative overflow-hidden ${p.stock === 0 ? "opacity-70" : ""}`}>
                    {p.stock === 0 && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="destructive" className="text-[10px] sm:text-xs">Out of Stock</Badge>
                      </div>
                    )}
                    <CardContent className="pt-3 sm:pt-4 px-2 sm:px-4 text-center">
                      <div className="w-full h-24 sm:h-32 mb-2 sm:mb-3 rounded-lg overflow-hidden bg-pink-50">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&h=300&fit=crop"; }} />
                      </div>
                      <p className="font-bold text-gray-800 text-xs sm:text-sm">{p.name}</p>
                      <p className="text-pink-600 font-black text-lg sm:text-xl mt-1">₱{p.price}</p>
                      <Button size="sm" disabled={p.stock === 0} onClick={() => p.stock > 0 && addToCart(p)}
                        className={`w-full mt-2 sm:mt-3 text-xs font-bold h-8 sm:h-9 ${p.stock > 0 ? "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white" : ""}`}
                        variant={p.stock === 0 ? "outline" : "default"}>
                        <ShoppingCartIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                        {p.stock === 0 ? "Unavailable" : "Add"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* CART */}
          {tab === "cart" && (
            <div className="space-y-5 sm:space-y-6">
              <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-pink-700"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <ShoppingCartIcon className="w-6 h-6 sm:w-7 sm:h-7 text-pink-500" /> My Cart
              </h1>

              {receipt ? (
                <Card className="max-w-md w-full mx-auto border-pink-100 shadow-lg shadow-pink-100">
                  <CardHeader className="text-center px-4 sm:px-6">
                    <ReceiptPercentIcon className="w-10 h-10 sm:w-12 sm:h-12 text-pink-400 mx-auto mb-2" />
                    <CardTitle className="text-pink-700" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Receipt</CardTitle>
                    <p className="text-gray-400 text-xs">{receipt.date}</p>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <Separator className="mb-4 border-dashed border-pink-200" />
                    <div className="space-y-2">
                      {receipt.items.map(i => (
                        <div key={i.id} className="flex justify-between text-xs sm:text-sm items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded overflow-hidden bg-pink-50 shrink-0">
                              <img src={i.image} alt={i.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-gray-600">{i.name} ×{i.qty}</span>
                          </div>
                          <span className="font-bold text-pink-600">₱{i.price * i.qty}</span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4 border-dashed border-pink-200" />
                    <div className="flex justify-between font-black text-base sm:text-lg">
                      <span>TOTAL</span>
                      <span className="text-pink-600">₱{receipt.total}</span>
                    </div>
                    <p className="text-center text-pink-500 font-semibold text-xs sm:text-sm mt-4 flex items-center justify-center gap-1">
                      <HeartIcon className="w-4 h-4" /> Thank you for shopping with us!
                    </p>
                    <Button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                      onClick={() => setReceipt(null)}>Continue Shopping</Button>
                  </CardContent>
                </Card>
              ) : cart.length === 0 ? (
                <Card className="border-pink-100 text-center py-12 sm:py-16">
                  <CardContent>
                    <ShoppingCartIcon className="w-12 h-12 sm:w-16 sm:h-16 text-pink-200 mx-auto mb-4" />
                    <p className="text-gray-400 text-base sm:text-lg">Your cart is empty!</p>
                    <Button className="mt-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                      onClick={() => setTab("products")}>
                      <ShoppingBagIcon className="w-4 h-4 mr-2" /> Shop Now
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px] gap-4 sm:gap-6">
                  <Card className="border-pink-100 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-pink-50/50">
                          {["Product", "Price", "Qty", "Subtotal", ""].map(h => (
                            <TableHead key={h} className="text-pink-600 font-bold text-xs sm:text-sm whitespace-nowrap">{h}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cart.map(i => (
                          <TableRow key={i.id} className="hover:bg-pink-50/30">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-pink-50 shrink-0">
                                  <img src={i.image} alt={i.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="font-semibold text-xs sm:text-sm">{i.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">₱{i.price}</TableCell>
                            <TableCell className="font-bold text-xs sm:text-sm">×{i.qty}</TableCell>
                            <TableCell className="font-black text-pink-600 text-xs sm:text-sm whitespace-nowrap">₱{i.price * i.qty}</TableCell>
                            <TableCell>
                              <Button size="icon" variant="ghost" onClick={() => removeFromCart(i.id)}
                                className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400 hover:text-rose-600 hover:bg-rose-50">
                                <TrashIcon className="w-3.5 h-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                  <Card className="border-pink-100 self-start">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-pink-700 text-base sm:text-lg flex items-center gap-2"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        <ReceiptPercentIcon className="w-5 h-5 text-pink-400" /> Order Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-500 text-sm">{cart.length} item{cart.length > 1 ? "s" : ""} in cart</p>
                      <Separator className="border-dashed border-pink-200" />
                      <div className="flex justify-between font-black text-lg sm:text-xl">
                        <span>Total</span>
                        <span className="text-pink-600">₱{cartTotal}</span>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold shadow-md shadow-pink-200 h-10 sm:h-11"
                        onClick={checkout}>
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
            <div className="space-y-5 sm:space-y-6">
              <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-pink-700"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                <HeartIcon className="w-6 h-6 sm:w-7 sm:h-7 text-pink-500" /> About Us
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="border-pink-100">
                  <CardContent className="pt-5 sm:pt-6 space-y-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                      <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <p className="font-bold text-lg sm:text-xl text-pink-700"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>School Ashentials</p>
                    <div className="space-y-2 text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center gap-2"><EnvelopeIcon className="w-4 h-4 text-pink-400 shrink-0" /> schoolashentials@gmail.com</div>
                      <div className="flex items-center gap-2"><PhoneIcon    className="w-4 h-4 text-pink-400 shrink-0" /> 09124154218</div>
                      <div className="flex items-start gap-2">
                        <MapPinIcon className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                        Ranario Street, Poblacion, Bacuag, Surigao del Norte
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {["Facebook", "Instagram", "TikTok"].map(s => (
                        <Badge key={s} variant="outline" className="text-pink-600 border-pink-200 bg-pink-50 flex items-center gap-1 text-xs">
                          <GlobeAltIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {s}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">@schoolashentials on all platforms</p>
                  </CardContent>
                </Card>
                <Card className="border-pink-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-pink-700 text-base sm:text-lg flex items-center gap-2"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      <ChatBubbleLeftRightIcon className="w-5 h-5 text-pink-400" /> Send Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {fbSent ? (
                      <div className="text-center py-6 sm:py-8">
                        <CheckCircleIcon className="w-10 h-10 sm:w-12 sm:h-12 text-pink-400 mx-auto mb-3" />
                        <p className="font-bold text-pink-600 text-sm sm:text-base">Thank you for your feedback!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Share your thoughts with us..."
                          className="border-pink-200 focus-visible:ring-pink-300 resize-none h-24 sm:h-28 text-sm" />
                        <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold"
                          onClick={() => { if (feedback) setFbSent(true); }}>
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