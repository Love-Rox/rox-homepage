interface Step {
  number: string;
  title: string;
  code: string;
}

interface GettingStartedProps {
  title: string;
  subtitle: string;
  steps: Step[];
  note: string;
}

/**
 * Split Studio row 4 — proof-left / text-right, built as an F4 step sequence
 * with a continuous rail connector.
 *
 * Was: centered heading over full-width cards separated by six independently
 * bouncing chevrons. The chevrons carried sequence information; the *bounce*
 * carried none, and six simultaneous bounces read as noise. The rail states
 * the same continuity without motion.
 *
 * The step numbers come from getting-started.json (`number`), so this is
 * genuinely ordinal content — the one place numbered labels are warranted.
 */
export const GettingStarted = ({ title, subtitle, steps, note }: GettingStartedProps) => {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-x-12 gap-y-10 px-4 py-24 sm:px-6 lg:grid-cols-[7fr_5fr] lg:px-8">
      {/* Proof half — the rail. */}
      <ol className="border-rule order-2 ml-4 min-w-0 border-l lg:order-1">
        {steps.map((step) => (
          <li key={step.number} className="relative min-w-0 pb-10 pl-6 last:pb-0 sm:pl-8">
            {/* Number sits on the rail, centred over the 1px border. */}
            <span
              aria-hidden="true"
              className="bg-accent text-accent-ink font-display absolute top-0 -left-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
            >
              {step.number}
            </span>
            <h3 className="text-ink font-display pt-1 text-base font-bold">{step.title}</h3>
            <pre className="bg-code-bg text-code-fg mt-3 overflow-x-auto rounded-[var(--radius-input)] p-4 font-mono text-[13px] leading-relaxed">
              <code>{step.code}</code>
            </pre>
          </li>
        ))}
      </ol>

      {/* Text half. */}
      <div className="order-1 min-w-0 lg:order-2 lg:sticky lg:top-28 lg:pt-4">
        <h2 className="hallmark-display text-ink text-[length:var(--text-display-s)]">{title}</h2>
        <p className="text-ink-2 mt-4 max-w-[40ch] text-lg leading-relaxed">{subtitle}</p>
        <p className="text-ink-2 border-rule mt-8 max-w-[40ch] border-t pt-6 text-sm leading-relaxed">
          {note}
        </p>
      </div>
    </section>
  );
};
