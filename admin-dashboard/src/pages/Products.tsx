import { useState } from "react";
import { Link } from "react-router";
import { products as allProducts, deleteProduct, type Product } from "../data";
import { Badge, Btn, Card, EmptyState, Modal, PageHeader, PRODUCT_BADGE } from "../components/Ui";

const CATS = ["All", "Electronics", "Accessories", "Furniture"];

export default function Products() {
  const [list, setList] = useState<Product[]>(() => [...allProducts]);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [delId, setDelId] = useState<string | null>(null);

  const filtered = list.filter(
    (p) =>
      (cat === "All" || p.category === cat) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
       p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  function confirmDelete() {
    if (!delId) return;
    deleteProduct(delId);
    setList([...allProducts]);
    setDelId(null);
  }

  const active = list.filter((p) => p.status === "active").length;
  const draft  = list.filter((p) => p.status === "draft").length;
  const oos    = list.filter((p) => p.stock === 0).length;

  return (
    <div className="p-8">
      <PageHeader
        title="Products"
        subtitle={`${list.length} products · ${active} active`}
        action={
          <Link to="/products/new">
            <Btn variant="primary">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              Add Product
            </Btn>
          </Link>
        }
      />

      {/* Stat pills */}
      <div className="flex gap-2 mb-5">
        <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-[12px] font-semibold ring-1 ring-emerald-200">{active} Active</span>
        <span className="px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 text-[12px] font-semibold ring-1 ring-amber-200">{draft} Draft</span>
        <span className="px-3.5 py-1.5 rounded-full bg-red-50 text-red-700 text-[12px] font-semibold ring-1 ring-red-200">{oos} Out of Stock</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <input
          className="px-3 py-2 rounded-xl bg-white ring-1 ring-[#E5E3DE] text-[13px] text-[#1A1A1A] font-medium placeholder:text-[#7A7772]/40 outline-none focus:ring-[#1A1A1A] transition-all w-60"
          placeholder="Search name or SKU…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-1.5">
          {CATS.map((c) => (
            <button
              key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-150 ${
                cat === c
                  ? "bg-[#1A1A1A] text-[#faf9f6]"
                  : "bg-white text-[#7A7772] ring-1 ring-[#E5E3DE] hover:bg-[#E5E3DE] hover:text-[#1A1A1A]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <span className="ml-auto mono text-[11px] text-[#7A7772]">{filtered.length} results</span>
      </div>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#E5E3DE]">
                {["Product", "SKU", "Category", "Price", "Stock", "Status", "Added", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10.5px] font-bold uppercase tracking-[0.07em] text-[#7A7772] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}><EmptyState icon="📦" title="No products found" desc="Adjust your search or filters" /></td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-[#faf9f6] last:border-0 hover:bg-[#faf9f6] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#faf9f6] ring-1 ring-[#E5E3DE] flex items-center justify-center text-xl shrink-0">{p.image}</div>
                        <div>
                          <div className="font-semibold text-[#1A1A1A]">{p.name}</div>
                          <div className="mono text-[10.5px] text-[#7A7772]">{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="mono text-[#7A7772]">{p.sku}</span></td>
                    <td className="px-4 py-3"><Badge variant="violet">{p.category}</Badge></td>
                    <td className="px-4 py-3"><span className="mono font-bold text-[#1A1A1A]">${p.price}</span></td>
                    <td className="px-4 py-3">
                      <span className={`mono font-semibold ${p.stock === 0 ? "text-red-600" : p.stock < 30 ? "text-amber-700" : "text-emerald-700"}`}>
                        {p.stock === 0 ? "Out of stock" : p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3"><Badge variant={PRODUCT_BADGE[p.status]}>{p.status}</Badge></td>
                    <td className="px-4 py-3 text-[#7A7772]">{p.createdAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link to={`/products/${p.id}/edit`}><Btn size="sm">Edit</Btn></Link>
                        <Btn size="sm" variant="danger" onClick={() => setDelId(p.id)}>Delete</Btn>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={!!delId} onClose={() => setDelId(null)} title="Delete Product" maxW="max-w-sm">
        <div className="bg-red-50 ring-1 ring-red-200 rounded-xl p-3.5 mb-5 text-[13px] text-red-700 font-medium">
          ⚠ This action is permanent and cannot be undone.
        </div>
        <p className="text-[13.5px] text-[#7A7772] leading-relaxed">
          Are you sure you want to delete{" "}
          <strong className="text-[#1A1A1A]">{list.find((p) => p.id === delId)?.name}</strong>?
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <Btn onClick={() => setDelId(null)}>Cancel</Btn>
          <Btn variant="danger" onClick={confirmDelete}>Delete Product</Btn>
        </div>
      </Modal>
    </div>
  );
}