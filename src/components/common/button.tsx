import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  // Solid orange — the dominant action shape used by hero, stack cards, CTAs.
  primary:
    "bg-primary-600 dark:bg-primary-400 text-white dark:text-slate-800 hover:bg-primary-500 dark:hover:bg-primary-300 shadow-xs",
  // Outline — same colour register, lower visual weight. For secondary CTAs.
  secondary:
    "border border-primary-600 dark:border-primary-400 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30",
  // Text-only with arrow affordance — for tertiary "learn more" links.
  ghost: "text-slate-800 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-400",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:focus-visible:outline-primary-400";

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
