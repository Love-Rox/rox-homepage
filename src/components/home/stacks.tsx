interface StackItem {
  name: string;
  src: string;
  href: string;
  description: string;
}

interface StacksProps {
  title: string;
  tech: StackItem[];
}

/**
 * Split Studio row 2 — proof-left / text-right (alternates against the hero).
 *
 * Was: a 3-column grid of centered cards, each with a centered name, centered
 * logo, centered hairline, centered paragraph and a filled "Learn X more →"
 * button. Three primary-filled buttons in one section blew the accent budget
 * on its own.
 *
 * Now: the heading anchors one half; the stack list occupies the other as
 * hairline-ruled rows. The per-card buttons drop to typographic links — the
 * accent stays a highlighter.
 */
export const Stacks = ({ title, tech }: StacksProps) => {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-x-12 gap-y-10 px-4 py-24 sm:px-6 lg:grid-cols-[5fr_7fr] lg:px-8">
      {/* Proof half — sits left on desktop, below the heading on mobile. */}
      <ul className="divide-rule border-rule order-2 min-w-0 divide-y border-y lg:order-1">
        {tech.map((stack) => (
          <li key={stack.name}>
            <a
              href={stack.href}
              className="group hover:bg-paper-3 -mx-4 flex min-w-0 items-center gap-5 rounded-[var(--radius-card)] px-4 py-6 transition-colors"
            >
              <img
                src={stack.src}
                alt=""
                aria-hidden="true"
                className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
              />
              <div className="min-w-0">
                <p className="text-ink group-hover:text-accent font-display text-lg font-bold transition-colors">
                  {stack.name}
                  <span
                    aria-hidden="true"
                    className="ml-2 inline-block transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </p>
                <p className="text-ink-2 mt-1 text-sm leading-relaxed">{stack.description}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>

      {/* Text half. */}
      <div className="order-1 min-w-0 lg:order-2 lg:pt-4">
        <h2 className="hallmark-display text-ink text-[length:var(--text-display-s)]">{title}</h2>
      </div>
    </section>
  );
};
