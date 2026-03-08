export type Role = "customer" | "admin" | "supplier";

export interface User {
  role: Role;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export interface CartItem extends Product {
  qty: number;
}

export interface Receipt {
  items: CartItem[];
  total: number;
  date: string;
}

export interface CustomerOrder {
  id: string;
  item: string;
  total: number;
  status: "Ready to Pay" | "Ready to Ship" | "To Receive";
}

export interface AdminOrder {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: "pending" | "processing" | "completed";
}

export interface Message {
  from: string;
  text: string;
  time: string;
  unread: boolean;
}

export interface SupplyOrder {
  id: string;
  product: string;
  qty: number;
  date: string;
  status: "delivered" | "in transit" | "pending";
}

export interface SupplyItem {
  name: string;
  supplied: number;
  needed: number;
  image: string;
}

export interface NavItem {
  key: string;
  icon: React.ReactElement;
  label: string;
}
