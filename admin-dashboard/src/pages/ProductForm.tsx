import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  Btn,
  Input,
  Textarea,
  Select,
  Section,
  Toggle,
  RemovableItem,
} from "../components/Ui";

import { uploadToCloudinary } from "../utils/cloudinary";
import {
  useCreateProduct,
  useGetProductById,
  useUpdateProduct,
} from "../hooks/useProducts.hook";
import { useGetCategories } from "../hooks/useCategory.hook";
import type { Category } from "../types/CategoryTypes";
import type { ProductDetails } from "../types/productTypes";

// ─── Types matching Prisma schema ─────────────────────────────────────────────

type ProductColor = {
  id: string;
  name: string;
  hex: string;
  sortOrder: number;
};
type ProductSize = { id: string; size: string; sortOrder: number };
type ProductImage = { id: string; url: string; alt: string; sortOrder: number };
type ProductDetail = { id: string; value: string; sortOrder: number };
type ProductCare = { id: string; value: string; sortOrder: number };
type ProductVariant = {
  id: string;
  size: string;
  colorName: string;
  sku: string;
  priceCents: number;
  discountedPriceCents?: number;
  stockQuantity: number;
  isActive: boolean;
};

type FormState = {
  name: string;
  description: string;
  fabric: string;
  inStock: boolean;
  priceCents: string;
  discountedPriceCents: string;
  primaryImageUrl: string;
  categoryId: string;
  stock: string;
  colors: ProductColor[];
  sizes: ProductSize[];
  images: ProductImage[];
  details: ProductDetail[];
  care: ProductCare[];
  variants: ProductVariant[];
};

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  fabric: "",
  inStock: true,
  priceCents: "",
  discountedPriceCents: "",
  primaryImageUrl: "",
  categoryId: "",
  stock: "",
  colors: [],
  sizes: [],
  images: [],
  details: [],
  care: [],
  variants: [],
};

const COMMON_SIZES = [
  "XS", "S", "M", "L", "XL", "XXL",
  "28", "30", "32", "34", "36", "38",
  "ONE SIZE",
];

const COMMON_CARE = [
  "Machine wash cold",
  "Hand wash only",
  "Dry clean only",
  "Do not bleach",
  "Tumble dry low",
  "Do not tumble dry",
  "Iron on low heat",
  "Do not iron",
  "Hang to dry",
  "Lay flat to dry",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function displayToCents(val: string): number {
  const n = parseFloat(val.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : Math.round(n * 100);
}

/** Convert a stored integer cents value → display string e.g. 4999 → "49.99" */
function centsToString(cents: number | null | undefined): string {
  if (cents == null) return "";
  return (cents / 100).toFixed(2);
}

function uid() {
  return `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ─── Step tabs ────────────────────────────────────────────────────────────────

const STEPS = [
  { id: "basics",   label: "Basics"   },
  { id: "media",    label: "Media"    },
  { id: "options",  label: "Options"  },
  { id: "variants", label: "Variants" },
  { id: "details",  label: "Details"  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductForm() {
  const { mutateAsync: createProduct } = useCreateProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { data: categoriesData } = useGetCategories();
  const categories = categoriesData?.categories ?? [];

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  // ── Fetch existing product when editing ────────────────────────────────────
  // enabled: false when there's no id so we never fire a pointless request
  const {
    data: productData,
    isLoading: productLoading,
    isError: productError,
  } = useGetProductById(id!,{enabled :!!isEdit});

  const [step, setStep] = useState("basics");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [formReady, setFormReady] = useState(!isEdit); // false until hydrated on edit

  const [primaryUploading, setPrimaryUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  // ── Hydrate form once product data arrives ─────────────────────────────────
  useEffect(() => {
    if (!productData) return;

    const p :ProductDetails = productData.product ?? productData; // handle { data: product } or bare product
    console.log( p.variants);

    setForm({
      name:                 p.name            ?? "",
      description:          p.description     ?? "",
      fabric:               p.fabric          ?? "",
      inStock:              p.inStock         ?? true,
      priceCents:           centsToString(p.priceCents),
      discountedPriceCents: centsToString(p.discountedPriceCents),
      primaryImageUrl:      p.primaryImageUrl ?? "",
      categoryId:           p.categoryId      ?? "",
      stock:                p.stock != null ? String(p.stock) : "",

      // Relations — attach a client-side `id` so the existing list UI works.
      // sortOrder is preserved from the API so ordering stays intact.
      colors: (p.colors ?? []).map((c: any) => ({
        id:        c.id        ?? uid(),
        name:      c.name,
        hex:       c.hex,
        sortOrder: c.sortOrder ?? 0,
      })),

      sizes: (p.sizes ?? []).map((s: any) => ({
        id:        s.id        ?? uid(),
        size:      s.size,
        sortOrder: s.sortOrder ?? 0,
      })),

      images: (p.images ?? []).map((i: any) => ({
        id:        i.id        ?? uid(),
        url:       i.url,
        alt:       i.alt       ?? "",
        sortOrder: i.sortOrder ?? 0,
      })),

      details: (p.details ?? []).map((d: any) => ({
        id:        d.id        ?? uid(),
        value:     d.value,
        sortOrder: d.sortOrder ?? 0,
      })),

      care: (p.care ?? []).map((c: any) => ({
        id:        c.id        ?? uid(),
        value:     c.value,
        sortOrder: c.sortOrder ?? 0,
      })),

      variants: (p.variants ?? []).map((v: any) => ({
        id:                   v.id          ?? uid(),
        size:                 v.size,
        colorName:            v.colorName,
        sku:                  v.sku         ?? "",
        priceCents:           v.priceCents,
        discountedPriceCents: v.discountedPriceCents ?? undefined,
        stockQuantity:        v.stockQuantity,
        isActive:             v.isActive,
      })),
    });

    setFormReady(true);
  }, [productData]);

  // ── Field helper ───────────────────────────────────────────────────────────
  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => {
      const n = { ...e };
      delete n[key];
      return n;
    });
  }

  // ── Colors ─────────────────────────────────────────────────────────────────
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");

  function addColor() {
    if (!newColorName.trim()) return;
    if (form.colors.some((c) => c.name.toLowerCase() === newColorName.trim().toLowerCase())) return;
    set("colors", [
      ...form.colors,
      { id: uid(), name: newColorName.trim(), hex: newColorHex, sortOrder: form.colors.length },
    ]);
    setNewColorName("");
    setNewColorHex("#000000");
  }

  // ── Sizes ──────────────────────────────────────────────────────────────────
  const [newSize, setNewSize] = useState("");

  function addSize(s?: string) {
    const val = (s ?? newSize).trim().toUpperCase();
    if (!val || form.sizes.some((x) => x.size === val)) return;
    set("sizes", [...form.sizes, { id: uid(), size: val, sortOrder: form.sizes.length }]);
    setNewSize("");
  }

  // ── Details ────────────────────────────────────────────────────────────────
  const [newDetail, setNewDetail] = useState("");
  function addDetail() {
    if (!newDetail.trim()) return;
    set("details", [...form.details, { id: uid(), value: newDetail.trim(), sortOrder: form.details.length }]);
    setNewDetail("");
  }

  // ── Care ───────────────────────────────────────────────────────────────────
  const [newCare, setNewCare] = useState("");
  function addCare(v?: string) {
    const val = v ?? newCare.trim();
    if (!val || form.care.some((c) => c.value === val)) return;
    set("care", [...form.care, { id: uid(), value: val, sortOrder: form.care.length }]);
    setNewCare("");
  }

  // ── Variants ───────────────────────────────────────────────────────────────
  function generateVariants() {
    if (!form.colors.length || !form.sizes.length) return;
    const existing = new Set(form.variants.map((v) => `${v.size}::${v.colorName}`));
    const basePrice = displayToCents(form.priceCents);
    const newVars: ProductVariant[] = [];
    for (const size of form.sizes) {
      for (const color of form.colors) {
        const key = `${size.size}::${color.name}`;
        if (!existing.has(key)) {
          newVars.push({
            id: uid(), size: size.size, colorName: color.name,
            sku: "", priceCents: basePrice,
            discountedPriceCents: undefined, stockQuantity: 0, isActive: true,
          });
        }
      }
    }
    set("variants", [...form.variants, ...newVars]);
  }

  function updateVariant(variantId: string, key: keyof ProductVariant, val: unknown) {
    set("variants", form.variants.map((v) => (v.id === variantId ? { ...v, [key]: val } : v)));
  }

  // ── Validation ─────────────────────────────────────────────────────────────
  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim())           e.name            = "Product name is required";
    if (!form.description.trim())    e.description     = "Description is required";
    if (!form.priceCents)            e.priceCents      = "Price is required";
    else if (isNaN(parseFloat(form.priceCents))) e.priceCents = "Must be a valid number";
    if (!form.primaryImageUrl.trim()) e.primaryImageUrl = "Primary image is required";
    setErrors(e);
    if (Object.keys(e).length) { setStep("basics"); return false; }
    return true;
  }



  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    const payload = {
      name:                 form.name,
      description:          form.description,
      fabric:               form.fabric,
      inStock:              form.inStock,
      priceCents:           displayToCents(form.priceCents),
      discountedPriceCents: form.discountedPriceCents ? displayToCents(form.discountedPriceCents) : null,
      primaryImageUrl:      form.primaryImageUrl,
      categoryId:           form.categoryId || null,
      stock:                form.stock ? parseInt(form.stock) : null,
      colors:   form.colors.map(  ({ name, hex, sortOrder }) => ({ name, hex, sortOrder })),
      sizes:    form.sizes.map(   ({ size, sortOrder }) => ({ size, sortOrder })),
      images:   form.images.map(  ({ url, alt, sortOrder }) => ({ url, alt, sortOrder })),
      details:  form.details.map( ({ value, sortOrder }) => ({ value, sortOrder })),
      care:     form.care.map(    ({ value, sortOrder }) => ({ value, sortOrder })),
      variants: form.variants.map(({ size, colorName, sku, priceCents, discountedPriceCents, stockQuantity, isActive }) => ({
        size, colorName,
        sku:                  sku || null,
        priceCents:           typeof priceCents === "string" ? displayToCents(priceCents) : priceCents,
        discountedPriceCents: discountedPriceCents || null,
        stockQuantity,
        isActive,
      })),
    };

    try {
      if (isEdit) {
        await updateProduct({ productId: id, productData: payload });
      } else {
        await createProduct(payload);
      }
      navigate("/products");
    } finally {
      setSaving(false);
    }
  }

  const stepIdx = STEPS.findIndex((s) => s.id === step);
  const hasErrors = Object.keys(errors).length > 0;

  // ── Loading / error states ─────────────────────────────────────────────────
  if (isEdit && productLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="flex items-center gap-3 text-[#7A7772]">
          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <span className="text-[14px] font-medium">Loading product…</span>
        </div>
      </div>
    );
  }

  if (isEdit && productError) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-64 gap-4">
        <div className="text-[14px] font-semibold text-[#1A1A1A]">Failed to load product</div>
        <Link to="/products"><Btn>← Back to Products</Btn></Link>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-8 pb-16 max-w-205">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-[22px] sm:text-[24px] lg:text-[26px] font-bold tracking-[-0.035em] text-[#1A1A1A]">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-[12px] sm:text-[13px] text-[#7A7772] mt-1 font-medium">
            {isEdit ? `Editing product · ID: ${id}` : "Fill in the details to list a new product"}
          </p>
        </div>
        <Link to="/products" className="w-full sm:w-auto">
          <Btn className="w-full sm:w-auto">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </Btn>
        </Link>
      </div>

      {/* Step tabs */}
      <div className="mb-6 sm:mb-7">
        <div className="bg-white rounded-2xl p-1.5 ring-1 ring-[#E5E3DE] w-full sm:w-fit overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(s.id)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-[12px] sm:text-[13px] font-semibold transition-all duration-150 whitespace-nowrap ${
                  step === s.id
                    ? "bg-[#1A1A1A] text-[#faf9f6] shadow-sm"
                    : "text-[#7A7772] hover:text-[#1A1A1A] hover:bg-[#faf9f6]"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0 ${
                    step === s.id ? "bg-white/20 text-white" : "bg-[#E5E3DE] text-[#7A7772]"
                  }`}>
                    {i + 1}
                  </span>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ─── STEP 1: Basics ─────────────────────────────────────────────── */}
        {step === "basics" && (
          <div className="space-y-5 animate-[rise_180ms_ease_both]">
            <Section title="Product Information" subtitle="Core product details that appear in your store listing">
              <div className="space-y-4">
                <Input
                  label="Product Name *"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Relaxed Linen Shirt"
                  error={errors.name}
                />
                <Textarea
                  label="Description *"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe the product — cut, fit, feel, styling suggestions…"
                  rows={5}
                  error={errors.description}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Fabric / Material"
                    value={form.fabric}
                    onChange={(e) => set("fabric", e.target.value)}
                    placeholder="e.g. 100% Belgian Linen"
                    hint="Shown on product page under fabric section"
                  />
                  <Select
                    label="Category"
                    value={form.categoryId}
                    onChange={(e) => set("categoryId", e.target.value)}
                    options={categories.map((cat: Category) => ({
                      value: cat.id,
                      label: cat.name,
                    }))}
                  />
                </div>
              </div>
            </Section>

            <Section title="Pricing" subtitle="All prices are stored in cents internally">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
                  label="Price *"
                  prefix="$"
                  value={form.priceCents}
                  onChange={(e) => set("priceCents", e.target.value)}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  error={errors.priceCents}
                  hint={form.priceCents ? `Stored as ${displayToCents(form.priceCents)} cents` : undefined}
                  className="pl-6"
                />
                <Input
                  label="Sale Price"
                  prefix="$"
                  value={form.discountedPriceCents}
                  onChange={(e) => set("discountedPriceCents", e.target.value)}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  hint={form.discountedPriceCents ? `Stored as ${displayToCents(form.discountedPriceCents)} cents` : "Leave empty if no sale"}
                  className="pl-6"
                />
              </div>
              {form.priceCents && form.discountedPriceCents &&
                parseFloat(form.discountedPriceCents) < parseFloat(form.priceCents) && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 ring-1 ring-emerald-200 text-emerald-800 text-[13px] font-semibold">
                    <span>🏷</span>
                    {Math.round((1 - parseFloat(form.discountedPriceCents) / parseFloat(form.priceCents)) * 100)}% discount will be shown
                  </div>
                )}
            </Section>

            <Section title="Inventory">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
                  label="Total Stock"
                  value={form.stock}
                  onChange={(e) => set("stock", e.target.value)}
                  type="number"
                  min="0"
                  placeholder="0"
                  hint="Overall stock count (variants track their own quantities)"
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[#7A7772] uppercase tracking-[0.04em]">
                    Availability
                  </label>
                  <div className="flex items-center gap-4 py-2.5">
                    <Toggle
                      on={form.inStock}
                      onChange={(v) => set("inStock", v)}
                      label={form.inStock ? "In Stock — visible to customers" : "Out of Stock — hidden from customers"}
                    />
                  </div>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* ─── STEP 2: Media ──────────────────────────────────────────────── */}
        {step === "media" && (
          <div className="space-y-5 animate-[rise_180ms_ease_both]">
            <Section title="Primary Image" subtitle="Upload the main image shown in product listings and search results">
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-[13px] text-[#1A1A1A]
                    file:mr-3 file:px-4 file:py-2.5 file:rounded-xl
                    file:border-0 file:bg-[#E5E3DE] file:text-[#1A1A1A]
                    file:font-semibold hover:file:bg-[#d5d2cc] cursor-pointer"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      setPrimaryUploading(true);
                      const uploaded = await uploadToCloudinary(file);
                      set("primaryImageUrl", uploaded);
                      setErrors((prev) => { const next = { ...prev }; delete next.primaryImageUrl; return next; });
                    } catch (err: any) {
                      setErrors((prev) => ({ ...prev, primaryImageUrl: err?.message ?? "Upload failed" }));
                    } finally {
                      setPrimaryUploading(false);
                      e.target.value = "";
                    }
                  }}
                />
                {primaryUploading && <div className="text-[12px] text-[#7A7772] font-medium">Uploading…</div>}
                {errors.primaryImageUrl && <div className="text-[12px] text-red-600 font-medium">{errors.primaryImageUrl}</div>}
                {form.primaryImageUrl && (
                  <div className="rounded-xl overflow-hidden ring-1 ring-[#E5E3DE] bg-[#faf9f6] h-48">
                    <img src={form.primaryImageUrl} alt="Primary preview" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            </Section>

            <Section
              title="Additional Images"
              subtitle="Upload extra product photos — gallery, details, alternate angles"
              action={<span className="text-[12px] text-[#7A7772] font-medium">{form.images.length} added</span>}
            >
              <div className="space-y-3 mb-4">
                {form.images.length === 0 && (
                  <div className="text-[13px] text-[#7A7772] py-2 text-center">No additional images yet</div>
                )}
                {form.images.map((img) => (
                  <RemovableItem key={img.id} onRemove={() => set("images", form.images.filter((x) => x.id !== img.id))}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#E5E3DE] shrink-0 overflow-hidden ring-1 ring-black/5">
                        <img src={img.url} alt={img.alt || "Gallery"} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12px] text-[#7A7772]">{img.url}</div>
                        <input
                          value={img.alt}
                          onChange={(e) => set("images", form.images.map((x) => x.id === img.id ? { ...x, alt: e.target.value } : x))}
                          placeholder="Alt text (optional)"
                          className="mt-2 w-full px-3 py-2 rounded-xl bg-white ring-1 ring-[#E5E3DE] focus:ring-[#1A1A1A] text-[13px] text-[#1A1A1A] font-medium placeholder:text-[#7A7772]/40 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </RemovableItem>
                ))}
              </div>

              <div className="border-t border-[#E5E3DE] pt-4">
                <div className="text-[12px] font-semibold text-[#7A7772] uppercase tracking-[0.04em] mb-3">Upload Images</div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="block w-full text-[13px] text-[#1A1A1A]
                    file:mr-3 file:px-4 file:py-2.5 file:rounded-xl
                    file:border-0 file:bg-[#E5E3DE] file:text-[#1A1A1A]
                    file:font-semibold hover:file:bg-[#d5d2cc] cursor-pointer"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files ?? []);
                    if (!files.length) return;
                    setGalleryError(null);
                    try {
                      setGalleryUploading(true);
                      const uploads = await Promise.all(files.map((file) => uploadToCloudinary(file)));
                      set("images", [
                        ...form.images,
                        ...uploads.map((u, idx) => ({
                          id: uid(), url: u, alt: "", sortOrder: form.images.length + idx,
                        })),
                      ]);
                    } catch (err: any) {
                      setGalleryError(err?.message ?? "Upload failed");
                    } finally {
                      setGalleryUploading(false);
                      e.target.value = "";
                    }
                  }}
                />
                {galleryUploading && <div className="mt-2 text-[12px] text-[#7A7772] font-medium">Uploading…</div>}
                {galleryError   && <div className="mt-2 text-[12px] text-red-600 font-medium">{galleryError}</div>}
              </div>
            </Section>
          </div>
        )}

        {/* ─── STEP 3: Options ────────────────────────────────────────────── */}
        {step === "options" && (
          <div className="space-y-5 animate-[rise_180ms_ease_both]">
            <Section
              title="Colors"
              subtitle="Available color options for this product"
              action={<span className="text-[12px] text-[#7A7772] font-medium">{form.colors.length} colors</span>}
            >
              {form.colors.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {form.colors.map((c) => (
                    <div key={c.id} className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full bg-[#faf9f6] ring-1 ring-[#E5E3DE] group">
                      <div className="w-5 h-5 rounded-full ring-1 ring-black/10 shrink-0" style={{ background: c.hex }} />
                      <span className="text-[12px] font-semibold text-[#1A1A1A]">{c.name}</span>
                      <span className="mono text-[10px] text-[#7A7772]">{c.hex}</span>
                      <button
                        type="button"
                        onClick={() => set("colors", form.colors.filter((x) => x.id !== c.id))}
                        className="ml-1 w-4 h-4 rounded-full bg-transparent hover:bg-red-100 text-[#7A7772] hover:text-red-600 flex items-center justify-center text-[12px] leading-none opacity-0 group-hover:opacity-100 transition-all"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-[#E5E3DE] pt-4">
                <div className="text-[12px] font-semibold text-[#7A7772] uppercase tracking-[0.04em] mb-3">Add Color</div>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="text-[11px] text-[#7A7772] font-semibold mb-1.5 block">Color Name</label>
                    <input
                      className="w-full px-3 py-2.5 rounded-xl bg-white ring-1 ring-[#E5E3DE] focus:ring-[#1A1A1A] text-[13px] text-[#1A1A1A] font-medium placeholder:text-[#7A7772]/40 outline-none transition-all"
                      placeholder="e.g. Sage Green"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addColor(); } }}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-[#7A7772] font-semibold">Hex</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="w-10 h-10 rounded-xl cursor-pointer border-none bg-transparent p-0.5 ring-1 ring-[#E5E3DE]"
                      />
                      <input
                        className="w-24 px-3 py-2.5 rounded-xl bg-white ring-1 ring-[#E5E3DE] focus:ring-[#1A1A1A] text-[13px] mono text-[#1A1A1A] outline-none"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  <Btn type="button" variant="secondary" onClick={addColor}>Add Color</Btn>
                </div>
              </div>
            </Section>

            <Section
              title="Sizes"
              subtitle="Available sizes for this product"
              action={<span className="text-[12px] text-[#7A7772] font-medium">{form.sizes.length} sizes</span>}
            >
              <div className="mb-4">
                <div className="text-[11px] font-semibold text-[#7A7772] uppercase tracking-[0.04em] mb-2">Quick Add</div>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SIZES.map((s) => {
                    const has = form.sizes.some((x) => x.size === s);
                    return (
                      <button
                        key={s} type="button"
                        onClick={() => has ? set("sizes", form.sizes.filter((x) => x.size !== s)) : addSize(s)}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150 ${
                          has ? "bg-[#1A1A1A] text-[#faf9f6]" : "bg-white text-[#7A7772] ring-1 ring-[#E5E3DE] hover:bg-[#E5E3DE] hover:text-[#1A1A1A]"
                        }`}
                      >{s}</button>
                    );
                  })}
                </div>
              </div>

              {form.sizes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 p-3 rounded-xl bg-[#faf9f6] ring-1 ring-[#E5E3DE]">
                  {form.sizes.map((s) => (
                    <div key={s.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A1A] text-[#faf9f6] text-[12px] font-semibold group">
                      {s.size}
                      <button
                        type="button"
                        onClick={() => set("sizes", form.sizes.filter((x) => x.id !== s.id))}
                        className="w-3.5 h-3.5 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-[10px] leading-none transition-colors"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-[#E5E3DE] pt-4">
                <div className="text-[12px] font-semibold text-[#7A7772] uppercase tracking-[0.04em] mb-2">Custom Size</div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 max-w-45 px-3 py-2.5 rounded-xl bg-white ring-1 ring-[#E5E3DE] focus:ring-[#1A1A1A] text-[13px] text-[#1A1A1A] font-medium placeholder:text-[#7A7772]/40 outline-none transition-all"
                    placeholder="e.g. 40 / Petite"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSize(); } }}
                  />
                  <Btn type="button" variant="secondary" onClick={() => addSize()}>Add</Btn>
                </div>
              </div>
            </Section>
          </div>
        )}

        {/* ─── STEP 4: Variants ───────────────────────────────────────────── */}
        {step === "variants" && (
          <div className="animate-[rise_180ms_ease_both]">
            <Section
              title="Product Variants"
              subtitle="Each combination of size + color is a variant with its own SKU, price, and stock"
              action={
                <Btn type="button" variant="secondary" size="sm" onClick={generateVariants} disabled={!form.colors.length || !form.sizes.length}>
                  ⚡ Auto-generate
                </Btn>
              }
            >
              {!form.colors.length || !form.sizes.length ? (
                <div className="text-center py-10">
                  <div className="text-3xl mb-3 opacity-40">🔲</div>
                  <div className="text-[14px] font-semibold text-[#1A1A1A]">Add colors and sizes first</div>
                  <div className="text-[12px] text-[#7A7772] mt-1">Go to the Options step to define colors & sizes, then come back to generate variants.</div>
                  <button type="button" onClick={() => setStep("options")} className="mt-4 text-[13px] font-semibold text-[#1A1A1A] underline underline-offset-2">
                    Go to Options →
                  </button>
                </div>
              ) : form.variants.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-3xl mb-3 opacity-40">⚡</div>
                  <div className="text-[14px] font-semibold text-[#1A1A1A]">No variants yet</div>
                  <div className="text-[12px] text-[#7A7772] mt-1">
                    You have {form.sizes.length} size{form.sizes.length !== 1 ? "s" : ""} × {form.colors.length} color{form.colors.length !== 1 ? "s" : ""} — {form.sizes.length * form.colors.length} possible combinations
                  </div>
                  <Btn type="button" variant="primary" className="mt-4" onClick={generateVariants}>
                    ⚡ Generate {form.sizes.length * form.colors.length} Variants
                  </Btn>
                </div>
              ) : (
                <div>
                  <div className="text-[12px] text-[#7A7772] mb-4 font-medium">{form.variants.length} variant{form.variants.length !== 1 ? "s" : ""}</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr className="border-b border-[#E5E3DE]">
                          {["Size", "Color", "SKU", "Price", "Sale Price", "Stock", "Active", ""].map((h) => (
                            <th key={h} className="text-left py-2 px-3 text-[10px] font-bold uppercase tracking-[0.07em] text-[#7A7772] whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {form.variants.map((v) => {
                          const color = form.colors.find((c) => c.name === v.colorName);
                          return (
                            <tr key={v.id} className="border-b border-[#faf9f6] hover:bg-[#faf9f6] transition-colors">
                              <td className="px-3 py-2">
                                <span className="px-2 py-1 rounded-lg bg-[#E5E3DE] text-[#1A1A1A] text-[11px] font-bold">{v.size}</span>
                              </td>
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                  {color && <div className="w-4 h-4 rounded-full ring-1 ring-black/10 shrink-0" style={{ background: color.hex }} />}
                                  <span className="font-medium text-[#1A1A1A]">{v.colorName}</span>
                                </div>
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  className="w-28 px-2 py-1.5 rounded-lg bg-white ring-1 ring-[#E5E3DE] focus:ring-[#1A1A1A] text-[12px] mono text-[#1A1A1A] outline-none"
                                  value={v.sku}
                                  onChange={(e) => updateVariant(v.id, "sku", e.target.value)}
                                  placeholder="SKU-001"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <div className="relative w-24">
                                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#7A7772] text-[11px]">$</span>
                                  <input
                                    type="number" min="0" step="0.01"
                                    className="w-full pl-5 pr-2 py-1.5 rounded-lg bg-white ring-1 ring-[#E5E3DE] focus:ring-[#1A1A1A] text-[12px] mono text-[#1A1A1A] outline-none"
                                    value={v.priceCents ? (v.priceCents / 100).toFixed(2) : ""}
                                    onChange={(e) => updateVariant(v.id, "priceCents", Math.round(parseFloat(e.target.value || "0") * 100))}
                                  />
                                </div>
                              </td>
                              <td className="px-3 py-2">
                                <div className="relative w-24">
                                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#7A7772] text-[11px]">$</span>
                                  <input
                                    type="number" min="0" step="0.01"
                                    className="w-full pl-5 pr-2 py-1.5 rounded-lg bg-white ring-1 ring-[#E5E3DE] focus:ring-[#1A1A1A] text-[12px] mono text-[#1A1A1A] outline-none"
                                    value={v.discountedPriceCents ? (v.discountedPriceCents / 100).toFixed(2) : ""}
                                    onChange={(e) => updateVariant(v.id, "discountedPriceCents", e.target.value ? Math.round(parseFloat(e.target.value) * 100) : undefined)}
                                    placeholder="—"
                                  />
                                </div>
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="number" min="0"
                                  className="w-20 px-2 py-1.5 rounded-lg bg-white ring-1 ring-[#E5E3DE] focus:ring-[#1A1A1A] text-[12px] mono text-[#1A1A1A] outline-none"
                                  value={v.stockQuantity}
                                  onChange={(e) => updateVariant(v.id, "stockQuantity", parseInt(e.target.value || "0"))}
                                />
                              </td>
                              <td className="px-3 py-2">
                                <Toggle on={v.isActive} onChange={(val) => updateVariant(v.id, "isActive", val)} />
                              </td>
                              <td className="px-3 py-2">
                                <button
                                  type="button"
                                  onClick={() => set("variants", form.variants.filter((x) => x.id !== v.id))}
                                  className="w-6 h-6 rounded-lg hover:bg-red-50 text-[#7A7772] hover:text-red-600 flex items-center justify-center text-[16px] leading-none transition-colors"
                                >×</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Section>
          </div>
        )}

        {/* ─── STEP 5: Details + Care ──────────────────────────────────────── */}
        {step === "details" && (
          <div className="space-y-5 animate-[rise_180ms_ease_both]">
            <Section
              title="Product Details"
              subtitle="Bullet points shown in the product details section"
              action={<span className="text-[12px] text-[#7A7772] font-medium">{form.details.length} items</span>}
            >
              <div className="space-y-2 mb-4">
                {form.details.map((d) => (
                  <RemovableItem key={d.id} onRemove={() => set("details", form.details.filter((x) => x.id !== d.id))}>
                    {d.value}
                  </RemovableItem>
                ))}
              </div>
              <div className="flex gap-2 border-t border-[#E5E3DE] pt-4">
                <input
                  className="flex-1 px-3 py-2.5 rounded-xl bg-white ring-1 ring-[#E5E3DE] focus:ring-[#1A1A1A] text-[13px] text-[#1A1A1A] font-medium placeholder:text-[#7A7772]/40 outline-none transition-all"
                  placeholder="e.g. Relaxed, straight-leg silhouette"
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addDetail(); } }}
                />
                <Btn type="button" variant="secondary" onClick={addDetail}>Add</Btn>
              </div>
            </Section>

            <Section
              title="Care Instructions"
              subtitle="Washing and care guidance shown on the product page"
              action={<span className="text-[12px] text-[#7A7772] font-medium">{form.care.length} instructions</span>}
            >
              <div className="mb-4">
                <div className="text-[11px] font-semibold text-[#7A7772] uppercase tracking-[0.04em] mb-2">Common Instructions</div>
                <div className="flex flex-wrap gap-2">
                  {COMMON_CARE.map((c) => {
                    const has = form.care.some((x) => x.value === c);
                    return (
                      <button
                        key={c} type="button"
                        onClick={() => has ? set("care", form.care.filter((x) => x.value !== c)) : addCare(c)}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150 ${
                          has ? "bg-[#1A1A1A] text-[#faf9f6]" : "bg-white text-[#7A7772] ring-1 ring-[#E5E3DE] hover:bg-[#E5E3DE] hover:text-[#1A1A1A]"
                        }`}
                      >{c}</button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {form.care.map((c) => (
                  <RemovableItem key={c.id} onRemove={() => set("care", form.care.filter((x) => x.id !== c.id))}>
                    {c.value}
                  </RemovableItem>
                ))}
              </div>
              <div className="flex gap-2 border-t border-[#E5E3DE] pt-4">
                <input
                  className="flex-1 px-3 py-2.5 rounded-xl bg-white ring-1 ring-[#E5E3DE] focus:ring-[#1A1A1A] text-[13px] text-[#1A1A1A] font-medium placeholder:text-[#7A7772]/40 outline-none transition-all"
                  placeholder="Custom care instruction…"
                  value={newCare}
                  onChange={(e) => setNewCare(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCare(); } }}
                />
                <Btn type="button" variant="secondary" onClick={() => addCare()}>Add</Btn>
              </div>
            </Section>
          </div>
        )}

        {/* ─── Footer ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {hasErrors && (
            <div className="flex items-center gap-2 text-[13px] text-red-600 font-semibold">
              <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-[11px]">!</span>
              Fix errors before saving
            </div>
          )}
          <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-[#7A7772]">
            {form.name            && <span className="px-2 py-0.5 rounded-full bg-[#E5E3DE] text-[#1A1A1A] font-semibold text-[11px]">✓ Name</span>}
            {form.primaryImageUrl && <span className="px-2 py-0.5 rounded-full bg-[#E5E3DE] text-[#1A1A1A] font-semibold text-[11px]">✓ Image</span>}
            {form.colors.length   > 0 && <span className="px-2 py-0.5 rounded-full bg-[#E5E3DE] text-[#1A1A1A] font-semibold text-[11px]">✓ {form.colors.length} Colors</span>}
            {form.sizes.length    > 0 && <span className="px-2 py-0.5 rounded-full bg-[#E5E3DE] text-[#1A1A1A] font-semibold text-[11px]">✓ {form.sizes.length} Sizes</span>}
            {form.variants.length > 0 && <span className="px-2 py-0.5 rounded-full bg-[#E5E3DE] text-[#1A1A1A] font-semibold text-[11px]">✓ {form.variants.length} Variants</span>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {stepIdx > 0 && (
            <Btn type="button" variant="ghost" onClick={() => setStep(STEPS[stepIdx - 1].id)} className="w-full sm:w-auto">
              ← Previous
            </Btn>
          )}
          {stepIdx < STEPS.length - 1 && (
            <Btn type="button" variant="secondary" onClick={() => setStep(STEPS[stepIdx + 1].id)} className="w-full sm:w-auto">
              Next →
            </Btn>
          )}
          <Btn
            variant="primary"
            type="submit"
            disabled={saving || !formReady}
            className="w-full sm:w-auto sm:min-w-35 justify-center"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Saving…
              </span>
            ) : isEdit ? "Save Changes" : "Publish Product"}
          </Btn>
        </div>
      </form>
    </div>
  );
}