import { Button } from "@/components/common/button";
import { VersionBadge } from "./version-badge";

interface HeroProps {
  aboveLink: string;
  link: string;
  linkUrl: string;
  heading: string;
  description: string;
  getStarted: string;
  getStartedUrl: string;
  learnMore: string;
  learnMoreUrl: string;
  stableLabel?: string;
  prereleaseLabel?: string;
  /** First real commands from getting-started.json — the proof half. */
  quickStart?: { title: string; code: string }[];
}

/**
 * Hallmark H2 Split Diptych (7/5), inside the Split Studio macrostructure.
 *
 * Was: the Tailwind UI "announcement pill + centered 7xl headline + centered
 * dual CTA" hero — the single most on-distribution shape there is, on a flat
 * background with no proof of any kind.
 *
 * Now: claim on the left, evidence on the right. The evidence is the actual
 * first two commands from getting-started.json, so the fold answers "how do I
 * start?" rather than restating the tagline. No fake terminal chrome — a plain
 * <pre> with a hairline border; the reader's own terminal is the real chrome.
 */
export const Hero = ({
  aboveLink,
  link,
  linkUrl,
  heading,
  description,
  getStarted,
  getStartedUrl,
  learnMore,
  learnMoreUrl,
  stableLabel = "Stable",
  prereleaseLabel = "Prerelease",
  quickStart = [],
}: HeroProps) => {
  return (
    <section className="hallmark-dotgrid">
      {/* `items-start`, not `items-center`: the proof column is shorter than
          the claim column, and centring it left a dead band under the code
          panel that read as a layout bug. Top-aligned, the two halves start
          together and the section closes tighter. */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-x-12 gap-y-12 px-4 pt-32 pb-16 sm:px-6 lg:grid-cols-[7fr_5fr] lg:px-8 lg:pt-40 lg:pb-20">
        {/* — Claim half — */}
        <div className="min-w-0">
          <a
            href={linkUrl}
            className="border-rule bg-paper-2 text-ink-2 hover:border-accent inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-pill)] border px-4 text-sm transition-colors"
          >
            <span>{aboveLink}</span>
            <span className="text-accent font-bold whitespace-nowrap">
              {link} <span aria-hidden="true">→</span>
            </span>
          </a>

          <h1 className="hallmark-display text-ink mt-8 text-[length:var(--text-display)]">
            {heading}
          </h1>

          <p className="text-ink-2 mt-6 max-w-[46ch] text-lg leading-relaxed">{description}</p>

          <div className="mt-8">
            <VersionBadge stableLabel={stableLabel} prereleaseLabel={prereleaseLabel} />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href={getStartedUrl} variant="primary" size="md">
              {getStarted}
            </Button>
            <Button href={learnMoreUrl} variant="ghost" size="md">
              {learnMore} <span aria-hidden="true">→</span>
            </Button>
          </div>
        </div>

        {/* — Proof half. Real commands, hairline frame, no drawn chrome. — */}
        {quickStart.length > 0 && (
          <div className="border-rule bg-paper-2 hallmark-edgebar min-w-0 rounded-[var(--radius-card)] border p-6 sm:p-8">
            <ol className="flex flex-col gap-5">
              {quickStart.map((step, i) => (
                <li key={step.title} className="min-w-0">
                  <div className="text-ink-2 flex items-baseline gap-2 text-xs">
                    <span className="text-accent font-display font-bold">{i + 1}</span>
                    <span>{step.title}</span>
                  </div>
                  <pre className="bg-code-bg text-code-fg mt-2 overflow-x-auto rounded-[var(--radius-input)] p-4 font-mono text-[13px] leading-relaxed">
                    <code>{step.code}</code>
                  </pre>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
};
