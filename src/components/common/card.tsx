import type { HTMLAttributes, ReactNode } from "react";

type Variant = "default" | "interactive" | "muted";

const variantClasses: Record<Variant, string> = {
  // Plain content surface (Features grid, Blog cards, generic info blocks).
  default:
    "bg-surface-card dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg",
  // Hover-reactive variant (clickable Features / Community cards). Adds the
  // standard "border tints to primary, shadow lifts" reaction so we stop
  // re-implementing it per section.
  interactive:
    "bg-surface-card dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl hover:border-primary-500 dark:hover:border-primary-400 transition-shadow transition-colors group",
  // Muted background (Stacks individual items, secondary surfaces).
  muted: "bg-surface-muted dark:bg-slate-200/15",
};

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "className" | "children"> {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

/**
 * Shared content surface used across the landing sections. Centralises the
 * background / border / shadow trio that was being re-spelled in every view
 * with subtle variations (some had hover, some didn't, some used primary-500
 * borders, some primary-400). Pick the variant that matches the intent
 * instead of stringing together utilities.
 */
export function Card({ variant = "default", className = "", children, ...rest }: CardProps) {
  const cls = `rounded-xl ${variantClasses[variant]} ${className}`.trim();
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}
