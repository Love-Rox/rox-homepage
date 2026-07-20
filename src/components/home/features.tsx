interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesProps {
  title: string;
  features: Feature[];
}

/**
 * Split Studio row 3 — text-left / proof-right, built as an F3 tabular spec
 * sheet rather than a card grid.
 *
 * Was: a centered h2 over a 3-column grid of icon+title+blurb cards, each with
 * a `text-5xl` emoji that scaled on hover. That shape is the most-recognised
 * AI feature section there is, and the playful genre explicitly bans emoji as
 * visual ornament standing in for iconography.
 *
 * Now: hairline-ruled rows. The emoji survives at inline size inside the
 * heading — emoji in copy is fine; emoji as a 48px illustration is not. The
 * data in features.json is untouched.
 */
export const Features = ({ title, features }: FeaturesProps) => {
  return (
    <section className="bg-paper-3">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-x-12 gap-y-10 px-4 py-24 sm:px-6 lg:grid-cols-[5fr_7fr] lg:px-8">
        <div className="min-w-0 lg:pt-4">
          <h2 className="hallmark-display text-ink text-[length:var(--text-display-s)]">{title}</h2>
        </div>

        <dl className="divide-rule border-rule min-w-0 divide-y border-y">
          {features.map((feature) => (
            <div key={feature.title} className="py-6">
              <dt className="text-ink font-display flex items-baseline gap-2 text-lg font-bold">
                <span aria-hidden="true" className="text-base">
                  {feature.icon}
                </span>
                <span className="min-w-0">{feature.title}</span>
              </dt>
              <dd className="text-ink-2 mt-2 max-w-[62ch] leading-relaxed">
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
