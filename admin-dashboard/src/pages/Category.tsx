import { useState } from "react";
import { uploadToCloudinary } from "../utils/cloudinary";
import {
  useGetCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../hooks/useCategory.hook";
import type { Category } from "../types/CategoryTypes";
import {
  Btn, EmptyState, Input, Modal, PageHeader, Textarea,
} from "../components/Ui";

// ─── Types ────────────────────────────────────────────────────────────────────

type CategoryForm = {
  name:        string;
  description: string;
  image:       string;
};

const EMPTY: CategoryForm = { name: "", description: "", image: "" };

// ─── Component ────────────────────────────────────────────────────────────────

export default function Categories() {
  const { data: res, isLoading, isError } = useGetCategories();
  const { mutateAsync: createCategory } = useCreateCategory();
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const { mutateAsync: deleteCategory } = useDeleteCategory();

  // unwrap whatever shape the hook returns
  const categories: Category[] = res?.categories ?? res?.data ?? res ?? [];

  // ── UI state ───────────────────────────────────────────────────────────────
  const [search,     setSearch]     = useState("");
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [delTarget,  setDelTarget]  = useState<Category | null>(null);
  const [form,       setForm]       = useState<CategoryForm>(EMPTY);
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [uploadErr,  setUploadErr]  = useState<string | null>(null);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  // ── Form helpers ───────────────────────────────────────────────────────────
  function setField<K extends keyof CategoryForm>(k: K, v: CategoryForm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim())            e.name = "Name is required";
    else if (form.name.trim().length < 2) e.name = "Must be at least 2 characters";
    setErrors(e);
    return !Object.keys(e).length;
  }

  // ── Modal open/close ───────────────────────────────────────────────────────
  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY);
    setErrors({});
    setUploadErr(null);
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setEditTarget(cat);
    setForm({ name: cat.name ?? "", description: cat.description ?? "", image: cat.image ?? "" });
    setErrors({});
    setUploadErr(null);
    setModalOpen(true);
  }

  function closeModal() {
    if (saving || uploading) return;
    setModalOpen(false);
    setTimeout(() => { setEditTarget(null); setForm(EMPTY); setErrors({}); setUploadErr(null); }, 150);
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        name:        form.name.trim(),
        description: form.description.trim() || null,
        imageUrl:       form.image.trim()       || null,
      };
      if (editTarget) {
        await updateCategory({ categoryId: editTarget.id, categoryData: payload });
      } else {
        await createCategory(payload);
      }
      closeModal();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "Something went wrong";
      console.log("Error details:", err);
      setErrors({ name: msg });
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function confirmDelete() {
    if (!delTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(delTarget.id);
      setDelTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  // ── Loading / error ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="flex items-center gap-3 text-[#7A7772]">
          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <span className="text-[14px] font-medium">Loading categories…</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-64 gap-2">
        <div className="text-[14px] font-semibold text-[#1A1A1A]">Failed to load categories</div>
        <div className="text-[12px] text-[#7A7772]">Check your connection and try again</div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-8">
      <PageHeader
        title="Categories"
        subtitle={`${categories.length} categor${categories.length === 1 ? "y" : "ies"} · organise your product catalogue`}
        action={
          <Btn variant="primary" onClick={openCreate}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Category
          </Btn>
        }
      />

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A7772] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="pl-9 pr-3 py-2 rounded-xl bg-white ring-1 ring-[#E5E3DE] text-[13px] font-medium text-[#1A1A1A] placeholder:text-[#7A7772]/40 outline-none focus:ring-[#1A1A1A] transition-all w-60"
            placeholder="Search categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="mono text-[11px] text-[#7A7772] ml-auto">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Grid ────────────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="🗂"
          title={search ? "No categories match" : "No categories yet"}
          desc={search ? "Try a different search term" : "Create your first category to start organising products"}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onEdit={()   => openEdit(cat)}
              onDelete={() => setDelTarget(cat)}
            />
          ))}
        </div>
      )}

      {/* ── Create / Edit Modal ──────────────────────────────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editTarget ? `Edit "${editTarget.name}"` : "New Category"}
        maxW="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name *"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="e.g. Tops, Dresses, Outerwear"
            error={errors.name}
            autoFocus
          />

          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Optional — shown on the category page"
            rows={3}
            hint="Briefly describe what's in this category"
          />

          {/* Image upload */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-semibold text-[#7A7772] uppercase tracking-[0.04em]">
              Category Image
            </label>

            {form.image ? (
              <div className="relative h-36 rounded-xl overflow-hidden ring-1 ring-[#E5E3DE] bg-[#faf9f6]">
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                {/* Clear button */}
                <button
                  type="button"
                  onClick={() => setField("image", "")}
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-white/90 ring-1 ring-[#E5E3DE] text-[#7A7772] hover:text-red-600 hover:bg-red-50 flex items-center justify-center text-[16px] leading-none shadow-sm transition-all"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="h-36 rounded-xl ring-1 ring-dashed ring-[#E5E3DE] bg-[#faf9f6] flex flex-col items-center justify-center gap-2 text-[#7A7772]">
                <svg className="w-8 h-8 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="m21 15-5-5L5 21"/>
                </svg>
                <span className="text-[11px] font-medium">No image selected</span>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="block w-full text-[13px] text-[#1A1A1A]
                file:mr-3 file:px-3.5 file:py-2 file:rounded-xl
                file:border-0 file:bg-[#E5E3DE] file:text-[#1A1A1A]
                file:text-[12px] file:font-semibold hover:file:bg-[#d5d2cc]
                cursor-pointer transition-all"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploadErr(null);
                try {
                  setUploading(true);
                  const url = await uploadToCloudinary(file);
                  setField("image", url);
                } catch (err: any) {
                  setUploadErr(err?.message ?? "Upload failed");
                } finally {
                  setUploading(false);
                  e.target.value = "";
                }
              }}
            />

            {uploading  && <p className="text-[11px] text-[#7A7772] font-medium flex items-center gap-1.5"><svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Uploading…</p>}
            {uploadErr  && <p className="text-[11px] text-red-600 font-medium">{uploadErr}</p>}
            {!form.image && !uploading && <p className="text-[11px] text-[#7A7772]">JPG, PNG or WebP · recommended 800 × 600 px</p>}
          </div>

          {/* Footer actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E3DE]">
            <Btn type="button" variant="ghost" onClick={closeModal} disabled={saving || uploading}>
              Cancel
            </Btn>
            <Btn variant="primary" type="submit" disabled={saving || uploading}>
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  Saving…
                </span>
              ) : editTarget ? "Save Changes" : "Create Category"}
            </Btn>
          </div>
        </form>
      </Modal>

      {/* ── Delete confirm ───────────────────────────────────────────────────── */}
      <Modal
        open={!!delTarget}
        onClose={() => !deleting && setDelTarget(null)}
        title="Delete Category"
        maxW="max-w-sm"
      >
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 ring-1 ring-red-200 mb-5">
          <span className="text-red-500 text-[18px] leading-none mt-0.5 shrink-0">⚠</span>
          <p className="text-[13px] text-red-700 font-medium leading-relaxed">
            This is permanent. Products in this category won't be deleted — they'll just become uncategorised.
          </p>
        </div>

        <p className="text-[13.5px] text-[#7A7772] leading-relaxed">
          Delete <strong className="text-[#1A1A1A]">"{delTarget?.name}"</strong>?
        </p>

        <div className="flex justify-end gap-2 mt-6">
          <Btn onClick={() => setDelTarget(null)} disabled={deleting}>Cancel</Btn>
          <Btn variant="danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                Deleting…
              </span>
            ) : "Delete Category"}
          </Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── Category Card ─────────────────────────────────────────────────────────────

function CategoryCard({
  category, onEdit, onDelete,
}: {
  category: Category;
  onEdit:   () => void;
  onDelete: () => void;
}) {
  // _count.products is included when your API returns it; fall back gracefully
  const count = (category as any)?._count?.products ?? (category as any)?.products?.length ?? null;

  return (
    <div className="bg-white rounded-2xl ring-1 ring-[#E5E3DE] shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden group hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200">

      {/* Image area */}
      <div className="relative h-36 bg-[#faf9f6] overflow-hidden">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-[#E5E3DE]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
          </div>
        )}

        {/* Product count badge */}
        {count !== null && (
          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm ring-1 ring-black/8 text-[11px] font-bold text-[#1A1A1A] shadow-sm">
            {count} product{count !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="font-bold text-[14px] text-[#1A1A1A] tracking-tight truncate mb-1">
          {category.name}
        </div>

        {category.description ? (
          <p className="text-[12px] text-[#7A7772] line-clamp-2 leading-relaxed">{category.description}</p>
        ) : (
          <p className="text-[12px] text-[#7A7772]/40 italic">No description</p>
        )}

        {/* Footer row */}
        <div className="mt-3 pt-3 border-t border-[#E5E3DE] flex items-center justify-between gap-2">
          <span className="mono text-[10px] text-[#7A7772]/50 truncate">{category.id.slice(0, 8)}…</span>
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={onEdit}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-[#7A7772] bg-[#faf9f6] ring-1 ring-[#E5E3DE] hover:bg-[#E5E3DE] hover:text-[#1A1A1A] transition-all"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-red-600 bg-red-50 ring-1 ring-red-200 hover:bg-red-100 transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}