// ─── Orders ───────────────────────────────────────────────────────────────────

import { useState } from "react";
import { orders } from "../data";
import { Badge, Btn, Card, EmptyState, ORDER_BADGE, PageHeader } from "../components/Ui";

const STATUS_KEYS = ["delivered", "shipped", "processing", "pending", "cancelled"] as const;

export function Orders() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = orders.filter(
    (o) =>
      (filter === "All" || o.status === filter) &&
      (o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()))
  );

  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  return (
    <div className="p-8">
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} orders · $${revenue.toLocaleString()} revenue`}
        action={
          <Btn variant="secondary">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            Export CSV
          </Btn>
        }
      />

      {/* Status summary */}
      <div className="grid md:grid-cols-5 gap-3 mb-6 grid-cols-2">
        {STATUS_KEYS.map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          const isActive = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(isActive ? "All" : s)}
              className={`rounded-2xl p-4 text-left ring-1 transition-all duration-150 hover:ring-[#7A7772] ${
                isActive ? "bg-[#1A1A1A] ring-[#1A1A1A]" : "bg-white ring-[#E5E3DE] shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
              }`}
            >
              <div className={`text-[10px] font-bold  tracking-[0.07em] mb-2 capitalize ${isActive ? "text-[#faf9f6]/60" : "text-[#7A7772]"}`}>{s}</div>
              <div className={`text-[26px] font-bold tracking-[-0.04em] ${isActive ? "text-[#faf9f6]" : "text-[#1A1A1A]"}`}>{count}</div>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <input
          className="px-3 py-2 rounded-xl bg-white ring-1 ring-[#E5E3DE] text-[13px] font-medium placeholder:text-[#7A7772]/40 outline-none focus:ring-[#1A1A1A] transition-all w-64"
          placeholder="Search by order ID or customer…"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-1.5 flex-wrap">
          {["All", ...STATUS_KEYS].map((s) => (
            <button
              key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold capitalize transition-all duration-150 ${
                filter === s
                  ? "bg-[#1A1A1A] text-[#faf9f6]"
                  : "bg-white text-[#7A7772] ring-1 ring-[#E5E3DE] hover:bg-[#E5E3DE]"
              }`}
            >{s}</button>
          ))}
        </div>
        <span className="ml-auto mono text-[11px] text-[#7A7772]">{filtered.length} orders</span>
      </div>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#E5E3DE]">
                {["Order ID", "Customer", "Status", "Items", "Total", "Date", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10.5px] font-bold uppercase tracking-[0.07em] text-[#7A7772] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}><EmptyState icon="📋" title="No orders match" desc="Try a different filter" /></td></tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="border-b border-[#faf9f6] last:border-0 hover:bg-[#faf9f6] transition-colors">
                    <td className="px-4 py-3"><span className="mono text-[#7A7772]">{o.id}</span></td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#1A1A1A]">{o.customer}</div>
                      <div className="text-[11px] text-[#7A7772]">{o.email}</div>
                    </td>
                    <td className="px-4 py-3"><Badge variant={ORDER_BADGE[o.status]}>{o.status}</Badge></td>
                    <td className="px-4 py-3 text-[#7A7772]">{o.items} {o.items === 1 ? "item" : "items"}</td>
                    <td className="px-4 py-3"><span className="mono font-bold text-[#1A1A1A]">${o.total}</span></td>
                    <td className="px-4 py-3 text-[#7A7772]">{o.date}</td>
                    <td className="px-4 py-3"><Btn size="sm">View</Btn></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Orders;