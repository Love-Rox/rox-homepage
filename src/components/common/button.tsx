import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

/* CTA voice per design.md: pill radius, one accent fill, outlined secondary.
   Colours reference semantic tokens, never the raw --color-primary-* ramp. */
const variantClasses: Record<Variant, string> = {
  // The single primary action. One per viewport — the accent is a highlighter.
  primary: "bg-accent text-accent-ink hover:bg-accent/90 active:translate-y-px",
  // Outline — same shape, lower weight.
  secondary: "border border-rule text-ink hover:bg-paper-3 active:translate-y-px",
  // Text-only with arrow affordance, for tertiary "learn more" links.
  ghost: "text-ink hover:text-accent",
};

// min-h-11 = 44px, the WCAG AA hit-target floor. Applies at every size.
const sizeClasses: Record<Size, string> = {
  sm: "min-h-11 px-4 text-sm",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-6 text-base",
};

const baseClasses = [
  "inline-flex items-center justify-center gap-2 whitespace-nowrap",
  "rounded-[var(--radius-pill)] font-bold",
  "transition-[background-color,color,border-color,transform] duration-200 ease-[var(--ease-out)]",
  // The ring must appear instantly — never transition outline.
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
  "disabled:pointer-events-none disabled:opacity-50",
].join(" ");

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

interface ButtonAsLinkProps
  extends CommonProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> {
  href: string;
}

interface ButtonAsButtonProps
  extends CommonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  href?: undefined;
}

type ButtonProps = ButtonAsLinkProps | ButtonAsButtonProps;

/**
 * Unified action element for the entire site. Use this instead of inline
 * Tailwind chains so paddings, hover states, and focus rings stay consistent.
 *
 * - `variant="primary"` for the hero CTA, getting-started buttons, etc.
 * - `variant="secondary"` for outlined buttons.
 * - `variant="ghost"` for "Learn More →" tertiary links.
 *
 * Renders as <a> when `href` is supplied; otherwise as <button>.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className = "", children, href, ...rest } = props;
  const cls = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  if (href !== undefined) {
    return (
      <a href={href} className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
