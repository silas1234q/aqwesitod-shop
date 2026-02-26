import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { deleteProduct } from "../data";
import {
  Badge,
  Btn,
  Card,
  EmptyState,
  Modal,
  PageHeader,
  PRODUCT_BADGE,
} from "../components/Ui";
import { useGetProductsByCategory } from "../hooks/useProducts.hook";
import type { ProductDetails } from "../types/productTypes";
import { useGetCategories } from "../hooks/useCategory.hook";

type CatOption = { value: string; label: string };

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function Products() {
  const { data: categoryData, isFetching: isCategoryLoading } = useGetCategories();
  const categories = categoryData?.categories ?? [];

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [limit, setLimit] = useState(4);

  const [delId, setDelId] = useState<string | null>(null);
  const [removedIds, setRemovedIds] = useState<Set<string>>(() => new Set());

  // IMPORTANT: if "all", pass null/undefined to your hook/API

  const { data: productData, isFetching: isProductsLoading } =
    useGetProductsByCategory(selectedCategory, limit);

  const allProducts: ProductDetails[] = productData?.productsByCategory ?? [];

  // Reset local hidden items when switching category (recommended UX)
  useEffect(() => {
    setRemovedIds(new Set());
    setLimit(4);
    setSearch("");
  }, [selectedCategory]);

  const catOptions: CatOption[] = useMemo(() => {
    const base: CatOption[] = [{ value: "all", label: "All" }];
    const fromApi = categories.map((c: any) => ({
      value: c.id, // change to c.slug if your API expects slug
      label: c.name,
    }));
    return [...base, ...fromApi];
  }, [categories]);

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    return allProducts
      .filter((p) => !removedIds.has(p.id))
      .filter((p) => {
        if (!q) return true;
        const sku = (p.sku ?? "").toLowerCase();
        const name = (p.name ?? "").toLowerCase();
        const description = (p.description ?? "").toLowerCase();
        const categoryName = (p.category?.name ?? "").toLowerCase();
        return (
          name.includes(q) ||
          sku.includes(q) ||
          description.includes(q) ||
          categoryName.includes(q)
        );
      });
  }, [allProducts, removedIds, search]);

  const stats = useMemo(() => {
    const active = visibleProducts.filter((p) => p.status === "active").length;
    const draft = visibleProducts.filter((p) => p.status === "draft").length;
    const outOfStock = visibleProducts.filter(
      (p) => p.inStock === false || p.stock === 0
    ).length;
    return { active, draft, outOfStock };
  }, [visibleProducts]);

  const productToDelete = useMemo(() => {
    if (!delId) return undefined;
    return (
      visibleProducts.find((p) => p.id === delId) ??
      allProducts.find((p) => p.id === delId)
    );
  }, [delId, visibleProducts, allProducts]);

  function confirmDelete() {
    if (!delId) return;

    // Optimistic hide
    setRemovedIds((prev) => {
      const next = new Set(prev);
      next.add(delId);
      return next;
    });

    deleteProduct(delId);
    setDelId(null);
  }

  // Load more: DO NOT refetch manually — the hook will rerun when limit changes
  const loadMore = () => setLimit((prev) => prev + 4);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Products"
        subtitle={`${visibleProducts.length} products · ${stats.active} active`}
        action={
          <Link to="/products/new" className="w-full sm:w-auto">
            <Btn variant="primary" className="w-full sm:w-auto">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Product
            </Btn>
          </Link>
        }
      />

      {/* Stat pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-[12px] font-semibold ring-1 ring-emerald-200">
          {stats.active} Active
        </span>
        <span className="px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 text-[12px] font-semibold ring-1 ring-amber-200">
          {stats.draft} Draft
        </span>
        <span className="px-3.5 py-1.5 rounded-full bg-red-50 text-red-700 text-[12px] font-semibold ring-1 ring-red-200">
          {stats.outOfStock} Out of Stock
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-5">
        <input
          className="w-full sm:w-72 px-3 py-2 rounded-xl bg-white ring-1 ring-[#E5E3DE] text-[13px] text-[#1A1A1A] font-medium placeholder:text-[#7A7772]/40 outline-none focus:ring-[#1A1A1A] transition-all"
          placeholder="Search name, SKU, category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category chips */}
        <div className="flex flex-wrap gap-1.5">
          {catOptions.map((c) => {
            const active = selectedCategory === c.value;
            return (
              <button
                key={c.value}
                onClick={() => setSelectedCategory(c.value)}
                disabled={isCategoryLoading}
                className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-150 ${
                  active
                    ? "bg-[#1A1A1A] text-[#faf9f6]"
                    : "bg-white text-[#7A7772] ring-1 ring-[#E5E3DE] hover:bg-[#E5E3DE] hover:text-[#1A1A1A]"
                } ${isCategoryLoading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-3 lg:ml-auto">
          <span className="mono text-[11px] text-[#7A7772]">
            {isProductsLoading ? "Loading…" : `${visibleProducts.length} results`}
          </span>

          <Btn
            size="sm"
            variant="secondary"
            type="button"
            onClick={loadMore}
            disabled={isProductsLoading}
          >
            Load more
          </Btn>
        </div>
      </div>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] min-w-230">
            <thead>
              <tr className="border-b border-[#E5E3DE]">
                {["Product", "SKU", "Category", "Price", "Stock", "Status", "Added", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[10.5px] font-bold uppercase tracking-[0.07em] text-[#7A7772] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {visibleProducts.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      icon="📦"
                      title={isProductsLoading ? "Loading products…" : "No products found"}
                      desc={isProductsLoading ? "Please wait" : "Adjust your search or filters"}
                    />
                  </td>
                </tr>
              ) : (
                visibleProducts.map((p) => {
                  const img = p.images?.[0]?.url || "";
                  const isOOS = p.inStock === false || p.stock === 0;

                  return (
                    <tr
                      key={p.id}
                      className="border-b border-[#faf9f6] last:border-0 hover:bg-[#faf9f6] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#faf9f6] ring-1 ring-[#E5E3DE] overflow-hidden shrink-0">
                            {img ? (
                              <img src={img} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[12px] text-[#7A7772]">
                                —
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="font-semibold text-[#1A1A1A] truncate max-w-65">
                              {p.name}
                            </div>
                            <div className="mono text-[10.5px] text-[#7A7772] truncate max-w-65">
                              {p.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="mono text-[#7A7772]">{p.sku || "—"}</span>
                      </td>

                      <td className="px-4 py-3">
                        <Badge variant="violet">{p.category?.name ?? "—"}</Badge>
                      </td>

                      <td className="px-4 py-3">
                        <span className="mono font-bold text-[#1A1A1A]">
                          {formatMoney(p.priceCents)}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`mono font-semibold ${
                            isOOS ? "text-red-600" : p.stock < 30 ? "text-amber-700" : "text-emerald-700"
                          }`}
                        >
                          {p.stock === 0 ? "Out of stock" : p.stock}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <Badge variant={PRODUCT_BADGE[p.status]}>{p.status}</Badge>
                      </td>

                      <td className="px-4 py-3 text-[#7A7772] whitespace-nowrap">
                        {p.createdAt}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <Link to={`/products/${p.id}/edit`}>
                            <Btn size="sm">Edit</Btn>
                          </Link>
                          <Btn size="sm" variant="danger" onClick={() => setDelId(p.id)}>
                            Delete
                          </Btn>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
          <strong className="text-[#1A1A1A]">{productToDelete?.name ?? "this product"}</strong>?
        </p>

        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
          <Btn onClick={() => setDelId(null)} className="w-full sm:w-auto">
            Cancel
          </Btn>
          <Btn variant="danger" onClick={confirmDelete} className="w-full sm:w-auto">
            Delete Product
          </Btn>
        </div>
      </Modal>
    </div>
  );
}