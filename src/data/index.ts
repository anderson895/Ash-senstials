import type { Product, AdminOrder, Message, SupplyOrder } from "../types";

export const PRODUCTS: Product[] = [
  { id: 1,  name: "Notebook",     price: 20, image: "/assets/notebook.webp",     stock: 45  },
  { id: 2,  name: "Pencil",       price: 10, image: "/assets/pencil.webp",       stock: 120 },
  { id: 3,  name: "Pen",          price: 10, image: "/assets/pen.webp",          stock: 95  },
  { id: 4,  name: "Eraser",       price: 5,  image: "/assets/eraser.webp",       stock: 80  },
  { id: 5,  name: "Sharpener",    price: 15, image: "/assets/sharpener.webp",    stock: 0   },
  { id: 6,  name: "Ruler",        price: 20, image: "/assets/ruler.webp",        stock: 60  },
  { id: 7,  name: "Highlighters", price: 40, image: "/assets/highlighters.webp", stock: 30  },
  { id: 8,  name: "Glue",         price: 30, image: "/assets/glue.webp",         stock: 25  },
  { id: 9,  name: "Scissors",     price: 25, image: "/assets/scissors.webp",     stock: 0   },
  { id: 10, name: "Crayons",      price: 50, image: "/assets/crayons.webp",      stock: 18  },
];

export const ORDERS_ADMIN: AdminOrder[] = [
  { id: "ORD-001", customer: "Maria Santos",    items: "Notebook×2, Pen×1",   total: 50, status: "completed"  },
  { id: "ORD-002", customer: "Jose Reyes",      items: "Crayons×1, Glue×1",   total: 80, status: "processing" },
  { id: "ORD-003", customer: "Ana Cruz",        items: "Highlighters×2",      total: 80, status: "pending"    },
  { id: "ORD-004", customer: "Carlos Bautista", items: "Pencil×5, Eraser×3",  total: 65, status: "processing" },
  { id: "ORD-005", customer: "Lena Villanueva", items: "Ruler×1, Scissors×1", total: 45, status: "pending"    },
];

export const MESSAGES: Message[] = [
  { from: "Maria Santos", text: "Hi! My order hasn't arrived yet.",      time: "2h ago", unread: true  },
  { from: "Jose Reyes",   text: "Can I change my delivery address?",     time: "5h ago", unread: true  },
  { from: "Supplier PH",  text: "We have new stock ready for delivery.", time: "1d ago", unread: false },
  { from: "Ana Cruz",     text: "Thank you for the fast delivery!",      time: "2d ago", unread: false },
];

export const SUPPLY_ORDERS: SupplyOrder[] = [
  { id: "SUP-001", product: "Notebook",     qty: 200, date: "Mar 1, 2026", status: "delivered"  },
  { id: "SUP-002", product: "Pencil",       qty: 500, date: "Mar 3, 2026", status: "delivered"  },
  { id: "SUP-003", product: "Crayons",      qty: 100, date: "Mar 5, 2026", status: "in transit" },
  { id: "SUP-004", product: "Highlighters", qty: 150, date: "Mar 6, 2026", status: "pending"    },
];
