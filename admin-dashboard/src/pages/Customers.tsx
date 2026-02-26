import { useState } from "react";
import { customers, type Customer } from "../data";
import { Avatar, Badge, Btn, Card, Modal, PageHeader } from "../components/Ui";

export default function Customers() {
  const [search, setSearch]   = useState("");
  const [status, setStatus]   = useState<"all" | "active" | "inactive">("all");
  const [sel, setSel]         = useState<Customer | null>(null);

  const filtered = customers.filter(
    (c) =>
      (status === "all" || c.status === status) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const totalSpend  = customers.reduce((s, c) => s + c.spent, 0);
  const activeCount = customers.filter((c) => c.status === "active").length;

  return (
    <div className="p-8">
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} registered · $${totalSpend.toLocaleString()} total GMV`}
        action={<Btn variant="primary">+ Invite Customer</Btn>}
      />

      {/* Top stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Customers", val: customers.length },
          { label: "Active",          val: activeCount },
          { label: "Avg. Spent",      val: `$${Math.round(totalSpend / customers.length).toLocaleString()}` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl ring-1 ring-[#E5E3DE] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <div className="text-[11px] font-bold uppercase tracking-[0.07em] text-[#7A7772] mb-3">{s.label}</div>
            <div className="text-[28px] font-bold tracking-[-0.04em] text-[#1A1A1A]">{s.val}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <input
          className="px-3 py-2 rounded-xl bg-white ring-1 ring-[#E5E3DE] text-[13px] font-medium placeholder:text-[#7A7772]/40 outline-none focus:ring-[#1A1A1A] transition-all w-64"
          placeholder="Search by name or email…"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-1.5">
          {(["all", "active", "inactive"] as const).map((s) => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold capitalize transition-all ${
                status === s ? "bg-[#1A1A1A] text-[#faf9f6]" : "bg-white text-[#7A7772] ring-1 ring-[#E5E3DE] hover:bg-[#E5E3DE]"
              }`}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#E5E3DE]">
                {["Customer", "Status", "Orders", "Total Spent", "Joined", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10.5px] font-bold uppercase tracking-[0.07em] text-[#7A7772] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-[#faf9f6] last:border-0 hover:bg-[#faf9f6] transition-colors cursor-pointer" onClick={() => setSel(c)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar initials={c.initials} colorIdx={c.colorIdx} />
                      <div>
                        <div className="font-semibold text-[#1A1A1A]">{c.name}</div>
                        <div className="text-[11px] text-[#7A7772]">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant={c.status === "active" ? "teal" : "gray"}>{c.status}</Badge></td>
                  <td className="px-4 py-3 text-[#7A7772]">{c.orders}</td>
                  <td className="px-4 py-3"><span className="mono font-bold text-[#1A1A1A]">${c.spent.toLocaleString()}</span></td>
                  <td className="px-4 py-3 text-[#7A7772]">{c.joinedAt}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <Btn size="sm" onClick={() => setSel(c)}>View</Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={!!sel} onClose={() => setSel(null)} title="Customer Profile">
        {sel && (
          <>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#faf9f6] ring-1 ring-[#E5E3DE] mb-5">
              <Avatar initials={sel.initials} colorIdx={sel.colorIdx} size="lg" />
              <div className="flex-1">
                <div className="text-[17px] font-bold text-[#1A1A1A]">{sel.name}</div>
                <div className="text-[13px] text-[#7A7772] mt-0.5">{sel.email}</div>
              </div>
              <Badge variant={sel.status === "active" ? "teal" : "gray"}>{sel.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "Total Orders", val: sel.orders },
                { label: "Total Spent",  val: `$${sel.spent.toLocaleString()}` },
                { label: "Avg. Order",   val: `$${Math.round(sel.spent / sel.orders)}` },
                { label: "Member Since", val: sel.joinedAt },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl bg-[#faf9f6] ring-1 ring-[#E5E3DE]">
                  <div className="text-[10px] font-bold uppercase tracking-[0.07em] text-[#7A7772] mb-2">{item.label}</div>
                  <div className="text-[20px] font-bold tracking-tight text-[#1A1A1A]">{item.val}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Btn onClick={() => setSel(null)}>Close</Btn>
              <Btn variant="primary">Send Email</Btn>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}