// Ui.tsx
import React, { type ReactNode, type ButtonHTMLAttributes } from "react";

/**
 * Aqwesitod Admin UI primitives
 * - Responsive by default (sm+ scaling)
 * - Centralized brand tokens (no repeated hexes)
 * - Fixes non-tailwind class (left-5.75) by using translateX
 */

// ────────────────────────────────────────────────────────────────
// Tokens + helpers
// ────────────────────────────────────────────────────────────────

const TOKENS = {
  white: "#faf9f6",
  black: "#1A1A1A",
  gray: "#7A7772",
  lightGray: "#E5E3DE",
} as const;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// ────────────────────────────────────────────────────────────────
// Badge
// ────────────────────────────────────────────────────────────────

const BADGE_VARIANTS = {
  green: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
  teal: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  sky: "bg-stone-100 text-stone-600 ring-1 ring-stone-200",
  amber: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  coral: "bg-red-50 text-red-700 ring-1 ring-red-200",
  violet: `bg-[${TOKENS.lightGray}] text-[${TOKENS.black}] ring-1 ring-stone-300`,
  gray: `bg-[${TOKENS.lightGray}] text-[${TOKENS.gray}] ring-1 ring-stone-200`,
} as const;

export type BadgeVariant = keyof typeof BADGE_VARIANTS;

export function Badge({
  variant,
  children,
  className = "",
}: {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold tracking-wide whitespace-nowrap",
        "text-[11px] sm:text-[12px]",
        BADGE_VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export const ORDER_BADGE: Record<string, BadgeVariant> = {
  delivered: "green",
  shipped: "sky",
  processing: "amber",
  pending: "gray",
  cancelled: "coral",
};

export const PRODUCT_BADGE: Record<string, BadgeVariant> = {
  active: "teal",
  draft: "amber",
  archived: "gray",
};

// ────────────────────────────────────────────────────────────────
// Button
// ────────────────────────────────────────────────────────────────

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger" | "secondary";
  size?: "sm" | "md";
  children: ReactNode;
};

export function Btn({
  variant = "ghost",
  size = "md",
  className = "",
  children,
  ...props
}: BtnProps) {
  const base =
    "inline-flex items-center justify-center gap-1.5 font-semibold rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-40 select-none whitespace-nowrap";
  const sizes = {
    sm: "px-3 py-2 text-[12px]",
    md: "px-4 py-2.5 text-[13px] sm:text-[14px]",
  };
  const variants = {
    primary: `bg-[${TOKENS.black}] text-[${TOKENS.white}] hover:bg-[#2d2d2d] active:scale-[0.98] shadow-sm`,
    secondary: `bg-[${TOKENS.lightGray}] text-[${TOKENS.black}] hover:bg-[#d5d2cc] active:scale-[0.98]`,
    ghost: `bg-white text-[${TOKENS.gray}] ring-1 ring-[${TOKENS.lightGray}] hover:bg-[${TOKENS.white}] hover:text-[${TOKENS.black}]`,
    danger: "bg-red-50 text-red-700 ring-1 ring-red-200 hover:bg-red-100",
  };

  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

// ────────────────────────────────────────────────────────────────
// Modal
// ────────────────────────────────────────────────────────────────

export function Modal({
  open,
  onClose,
  title,
  children,
  maxW = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxW?: string;
}) {
  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-10 z-50 flex justify-center",
        "items-start sm:items-center",
        "p-3 sm:p-6",
        `bg-[${TOKENS.black}]/50 backdrop-blur-sm`,
        "animate-[fadeIn_140ms_ease]"
      )}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={cn(
          `bg-[${TOKENS.white}] rounded-2xl shadow-2xl w-full ${maxW}`,
          "max-h-[90dvh] overflow-auto",
          "p-4 sm:p-7",
          `ring-1 ring-[${TOKENS.lightGray}]`,
          "animate-[popIn_150ms_ease]"
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h2
            className={cn(
              "font-bold tracking-tight",
              "text-[16px] sm:text-[17px]",
              `text-[${TOKENS.black}]`
            )}
          >
            {title}
          </h2>
          <Btn size="sm" onClick={onClose} className="w-full sm:w-auto">
            ✕
          </Btn>
        </div>
        {children}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Input
// ────────────────────────────────────────────────────────────────

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: string;
};

export function Input({
  label,
  error,
  hint,
  prefix,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          className={cn(
            "font-semibold uppercase tracking-[0.04em]",
            "text-[11px] sm:text-[12px]",
            `text-[${TOKENS.gray}]`
          )}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {prefix && (
          <span
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none",
              "text-[13px] font-medium",
              `text-[${TOKENS.gray}]`
            )}
          >
            {prefix}
          </span>
        )}

        <input
          className={cn(
            "w-full rounded-xl bg-white ring-1 outline-none transition-all duration-150",
            prefix ? "pl-9 pr-3" : "px-3",
            "py-2.5 sm:py-3",
            "text-[13px] sm:text-[14px] font-medium",
            `text-[${TOKENS.black}] placeholder:text-[${TOKENS.gray}]/40`,
            error
              ? "ring-red-300 focus:ring-red-400"
              : `ring-[${TOKENS.lightGray}] focus:ring-[${TOKENS.black}]`,
            className
          )}
          {...props}
        />
      </div>

      {error && <p className="text-[11px] text-red-600 font-medium">{error}</p>}
      {hint && !error && (
        <p className={cn("text-[11px]", `text-[${TOKENS.gray}]`)}>{hint}</p>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Textarea
// ────────────────────────────────────────────────────────────────

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export function Textarea({
  label,
  error,
  hint,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          className={cn(
            "font-semibold uppercase tracking-[0.04em]",
            "text-[11px] sm:text-[12px]",
            `text-[${TOKENS.gray}]`
          )}
        >
          {label}
        </label>
      )}

      <textarea
        className={cn(
          "w-full px-3 py-2.5 sm:py-3 rounded-xl bg-white ring-1 outline-none transition-all duration-150 resize-none",
          "text-[13px] sm:text-[14px] font-medium",
          `text-[${TOKENS.black}] placeholder:text-[${TOKENS.gray}]/40`,
          error
            ? "ring-red-300 focus:ring-red-400"
            : `ring-[${TOKENS.lightGray}] focus:ring-[${TOKENS.black}]`,
          className
        )}
        {...props}
      />

      {error && <p className="text-[11px] text-red-600 font-medium">{error}</p>}
      {hint && !error && (
        <p className={cn("text-[11px]", `text-[${TOKENS.gray}]`)}>{hint}</p>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Select
// ────────────────────────────────────────────────────────────────

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
};

export function Select({
  label,
  error,
  options,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          className={cn(
            "font-semibold uppercase tracking-[0.04em]",
            "text-[11px] sm:text-[12px]",
            `text-[${TOKENS.gray}]`
          )}
        >
          {label}
        </label>
      )}

      <select
        className={cn(
          "w-full px-3 py-2.5 sm:py-3 pr-9 rounded-xl bg-white ring-1 outline-none transition-all duration-150 appearance-none cursor-pointer",
          "text-[13px] sm:text-[14px] font-medium",
          `text-[${TOKENS.black}]`,
          error
            ? "ring-red-300"
            : `ring-[${TOKENS.lightGray}] focus:ring-[${TOKENS.black}]`,
          // caret icon
          `bg-[url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%237A7772' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")] bg-no-repeat bg-position-[right_13px_center]`,
          className
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {error && <p className="text-[11px] text-red-600 font-medium">{error}</p>}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Toggle (responsive + reliable)
// ────────────────────────────────────────────────────────────────

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!on)}
        aria-pressed={on}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0",
          on ? `bg-[${TOKENS.black}]` : `bg-[${TOKENS.lightGray}]`
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200",
            on ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
      {label && (
        <span
          className={cn(
            "font-medium",
            "text-[13px] sm:text-[14px]",
            `text-[${TOKENS.black}]`
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Avatar
// ────────────────────────────────────────────────────────────────

const AVATAR_PALETTE = [
  "bg-stone-200 text-stone-700",
  `bg-[${TOKENS.lightGray}] text-[${TOKENS.black}]`,
  "bg-amber-100 text-amber-800",
  "bg-red-100 text-red-700",
  "bg-emerald-100 text-emerald-800",
  "bg-sky-100 text-sky-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
];

export function Avatar({
  initials,
  colorIdx,
  size = "md",
}: {
  initials: string;
  colorIdx: number;
  size?: "sm" | "md" | "lg";
}) {
  const pal = AVATAR_PALETTE[colorIdx % AVATAR_PALETTE.length];
  const sizes = {
    sm: "w-8 h-8 text-[11px] rounded-lg",
    md: "w-9 h-9 text-[12px] rounded-[10px]",
    lg: "w-14 h-14 text-[16px] rounded-[14px]",
  };

  return (
    <div
      className={cn(
        sizes[size],
        pal,
        "ring-1 ring-black/8 flex items-center justify-center font-bold shrink-0"
      )}
    >
      {initials}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Card
// ────────────────────────────────────────────────────────────────

export function Card({
  children,
  className = "",
  padding = true,
}: {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl",
        `ring-1 ring-[${TOKENS.lightGray}]`,
        "shadow-[0_1px_4px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)]",
        padding ? "p-4 sm:p-5" : "",
        className
      )}
    >
      {children}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Section (form section card)
// ────────────────────────────────────────────────────────────────

export function Section({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Card className="p-4 sm:p-6">
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3",
          "mb-5 pb-4",
          `border-b border-[${TOKENS.lightGray}]`
        )}
      >
        <div>
          <div
            className={cn(
              "text-[13px] sm:text-[14px] font-bold tracking-tight",
              `text-[${TOKENS.black}]`
            )}
          >
            {title}
          </div>
          {subtitle && (
            <div className={cn("text-[12px]", `text-[${TOKENS.gray}]`, "mt-0.5")}>
              {subtitle}
            </div>
          )}
        </div>

        {action && <div className="w-full sm:w-auto">{action}</div>}
      </div>

      {children}
    </Card>
  );
}

// ────────────────────────────────────────────────────────────────
// Empty state
// ────────────────────────────────────────────────────────────────

export function EmptyState({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 sm:py-16", `text-[${TOKENS.gray}]`)}>
      <div className="text-4xl mb-3 opacity-50">{icon}</div>
      <div className={cn("font-semibold text-[14px]", `text-[${TOKENS.black}]`)}>
        {title}
      </div>
      {desc && <div className={cn("text-[12px] mt-1", `text-[${TOKENS.gray}]`)}>{desc}</div>}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Page header
// ────────────────────────────────────────────────────────────────

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 sm:mb-7">
      <div>
        <h1
          className={cn(
            "font-bold tracking-[-0.035em]",
            "text-[22px] sm:text-[26px]",
            `text-[${TOKENS.black}]`
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p className={cn("text-[12px] sm:text-[13px] mt-1 font-medium", `text-[${TOKENS.gray}]`)}>
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="w-full sm:w-auto">{action}</div>}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Removable list item
// ────────────────────────────────────────────────────────────────

export function RemovableItem({
  children,
  onRemove,
}: {
  children: ReactNode;
  onRemove: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-start sm:items-center gap-2 py-2 px-3 rounded-xl group",
        `bg-[${TOKENS.white}] ring-1 ring-[${TOKENS.lightGray}]`
      )}
    >
      <span className={cn("text-[16px] cursor-grab select-none leading-none", `text-[${TOKENS.gray}]/40`)}>
        ⠿
      </span>

      <div
        className={cn(
          "flex-1 min-w-0 font-medium",
          "text-[13px] sm:text-[14px]",
          `text-[${TOKENS.black}]`,
          "wrap-break-word"
        )}
      >
        {children}
      </div>

      <button
        type="button"
        onClick={onRemove}
        className={cn(
          "w-6 h-6 rounded-lg flex items-center justify-center text-[16px] leading-none shrink-0",
          `text-[${TOKENS.gray}]`,
          "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all",
          "hover:bg-red-50 hover:text-red-600"
        )}
        aria-label="Remove item"
      >
        ×
      </button>
    </div>
  );
}