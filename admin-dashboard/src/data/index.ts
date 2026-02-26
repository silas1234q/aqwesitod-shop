export type Product = {
  id: string; name: string; category: string; price: number; stock: number;
  status: "active" | "draft" | "archived"; sku: string; image: string; createdAt: string;
};
export type Order = {
  id: string; customer: string; email: string; total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"; items: number; date: string;
};
export type Customer = {
  id: string; name: string; email: string; orders: number; spent: number;
  status: "active" | "inactive"; joinedAt: string; initials: string; colorIdx: number;
};

export let products: Product[] = [
  { id: "p1",  name: "Relaxed Linen Shirt",      category: "Tops",      price: 89,  stock: 142, status: "active",   sku: "TOP-001", image: "👕", createdAt: "2024-10-12" },
  { id: "p2",  name: "Wide-Leg Trousers",         category: "Bottoms",   price: 129, stock: 87,  status: "active",   sku: "BOT-002", image: "👖", createdAt: "2024-11-03" },
  { id: "p3",  name: "Midi Slip Dress",           category: "Dresses",   price: 149, stock: 54,  status: "active",   sku: "DRS-003", image: "👗", createdAt: "2024-09-28" },
  { id: "p4",  name: "Oversized Wool Coat",       category: "Outerwear", price: 349, stock: 0,   status: "archived", sku: "OUT-004", image: "🧥", createdAt: "2024-08-15" },
  { id: "p5",  name: "Cotton Knit Cardigan",      category: "Tops",      price: 119, stock: 23,  status: "active",   sku: "TOP-005", image: "🧶", createdAt: "2024-12-01" },
  { id: "p6",  name: "Leather Belt",              category: "Accessories", price: 59, stock: 88, status: "draft",    sku: "ACC-006", image: "👜", createdAt: "2025-01-08" },
  { id: "p7",  name: "Straight-Cut Denim",        category: "Bottoms",   price: 159, stock: 67,  status: "active",   sku: "BOT-007", image: "👖", createdAt: "2025-01-15" },
  { id: "p8",  name: "Silk Wrap Blouse",          category: "Tops",      price: 109, stock: 120, status: "active",   sku: "TOP-008", image: "👚", createdAt: "2025-02-01" },
];

export let orders: Order[] = [
  { id: "ORD-1042", customer: "Amara Johnson",  email: "amara@example.com",  total: 528, status: "delivered",  items: 3, date: "2025-02-20" },
  { id: "ORD-1041", customer: "Felix Wagner",   email: "felix@example.com",  total: 189, status: "shipped",    items: 1, date: "2025-02-21" },
  { id: "ORD-1040", customer: "Priya Sharma",   email: "priya@example.com",  total: 717, status: "processing", items: 4, date: "2025-02-22" },
  { id: "ORD-1039", customer: "Carlos Ruiz",    email: "carlos@example.com", total: 59,  status: "pending",    items: 1, date: "2025-02-23" },
  { id: "ORD-1038", customer: "Mei Lin",        email: "mei@example.com",    total: 338, status: "delivered",  items: 2, date: "2025-02-18" },
  { id: "ORD-1037", customer: "Kofi Asante",    email: "kofi@example.com",   total: 449, status: "cancelled",  items: 1, date: "2025-02-17" },
  { id: "ORD-1036", customer: "Sara Eriksson",  email: "sara@example.com",   total: 268, status: "shipped",    items: 2, date: "2025-02-24" },
  { id: "ORD-1035", customer: "Javi Torres",    email: "javi@example.com",   total: 79,  status: "delivered",  items: 1, date: "2025-02-16" },
];

export let customers: Customer[] = [
  { id: "c1", name: "Amara Johnson",  email: "amara@example.com",  orders: 8,  spent: 2340, status: "active",   joinedAt: "2024-03-12", initials: "AJ", colorIdx: 0 },
  { id: "c2", name: "Felix Wagner",   email: "felix@example.com",  orders: 3,  spent: 567,  status: "active",   joinedAt: "2024-07-01", initials: "FW", colorIdx: 1 },
  { id: "c3", name: "Priya Sharma",   email: "priya@example.com",  orders: 12, spent: 4102, status: "active",   joinedAt: "2023-11-22", initials: "PS", colorIdx: 2 },
  { id: "c4", name: "Carlos Ruiz",    email: "carlos@example.com", orders: 1,  spent: 59,   status: "inactive", joinedAt: "2025-01-15", initials: "CR", colorIdx: 3 },
  { id: "c5", name: "Mei Lin",        email: "mei@example.com",    orders: 6,  spent: 1890, status: "active",   joinedAt: "2024-05-08", initials: "ML", colorIdx: 4 },
  { id: "c6", name: "Kofi Asante",    email: "kofi@example.com",   orders: 4,  spent: 1230, status: "inactive", joinedAt: "2024-09-30", initials: "KA", colorIdx: 5 },
  { id: "c7", name: "Sara Eriksson",  email: "sara@example.com",   orders: 9,  spent: 3015, status: "active",   joinedAt: "2024-01-05", initials: "SE", colorIdx: 6 },
];

export const analytics = {
  revenue: [
    { month: "Sep", value: 18400 }, { month: "Oct", value: 24100 },
    { month: "Nov", value: 31500 }, { month: "Dec", value: 41200 },
    { month: "Jan", value: 28900 }, { month: "Feb", value: 35600 },
  ],
  stats: {
    totalRevenue: 179700, revenueChange: +12.4,
    totalOrders: 1042,    ordersChange:  +8.1,
    totalCustomers: 847,  customersChange: +5.3,
    avgOrderValue: 172,   aovChange: +3.8,
  },
  topProducts: [
    { name: "Midi Slip Dress",       sales: 312, revenue: 46488 },
    { name: "Wide-Leg Trousers",     sales: 198, revenue: 25542 },
    { name: "Cotton Knit Cardigan",  sales: 187, revenue: 22253 },
    { name: "Relaxed Linen Shirt",   sales: 243, revenue: 21627 },
    { name: "Straight-Cut Denim",    sales: 134, revenue: 21306 },
  ],
  ordersByStatus: [
    { status: "delivered",  count: 621, color: "bg-emerald-500" },
    { status: "shipped",    count: 184, color: "bg-stone-400" },
    { status: "processing", count: 142, color: "bg-amber-400" },
    { status: "pending",    count: 67,  color: "bg-stone-300" },
    { status: "cancelled",  count: 28,  color: "bg-red-400" },
  ],
};

export function getProduct(id: string) { return products.find((p) => p.id === id); }
export function createProduct(data: Omit<Product, "id" | "createdAt">) {
  const p: Product = { ...data, id: `p${Date.now()}`, createdAt: new Date().toISOString().split("T")[0] };
  products = [p, ...products];
  return p;
}
export function updateProduct(id: string, data: Partial<Omit<Product, "id" | "createdAt">>) {
  products = products.map((p) => (p.id === id ? { ...p, ...data } : p));
}
export function deleteProduct(id: string) {
  products = products.filter((p) => p.id !== id);
}