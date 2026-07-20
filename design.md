# Design — Rox homepage

A locked design system for this site. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

Derived by `hallmark redesign` (multi-page) on 2026-07-20. The system's origin is
the site's own OG image generator (`src/pages/_api/api/og.tsx`), which already
carried a resolved design language — cream ground, dot grid, solid orange right
edge — that the site body had never adopted. This file promotes that language to
the whole site.

## Genre

**playful** — soft surfaces, low-radius rounding, hover-responsive motion,
friendly-but-restrained voice. Not the catalog `Hum` theme: Rox has one owned
brand accent (`#ff5b11`), so this is a single-accent playful system, not a
multi-accent one.

## Macrostructure family

Pages within a family share the family's shape; they vary only in component
archetypes. Do not introduce a macrostructure outside this table without
amending this file first.

| Family      | Macrostructure                       | Routes                               | May vary                                  |
| ----------- | ------------------------------------ | ------------------------------------ | ----------------------------------------- |
| Marketing   | **15 · Split Studio**                | `(locale)/[lang]/index.tsx`          | hero archetype, diptych direction per row |
| Content     | **02 · Long Document**               | `blog/[slug]`, `docs/[slug]`         | prose measure, sidebar present/absent     |
| Index / Hub | **13 · Index-First**                 | `blog/index`, `docs/index`, `assets` | column count, grouping                    |
| Utility     | _(no family — inherits system only)_ | `contact`, `404`                     | —                                         |

**Why Split Studio for marketing.** The pre-redesign home page ran three
consecutive centered card grids (Stacks 3-col → Features 3-col → Community
2-col) on an identical `container mx-auto py-{12,16}` rhythm. Split Studio
divides every major block into text-half + proof-half and alternates the
direction down the page, which removes the "centered uniform grid" fingerprint
structurally rather than cosmetically. It also fits the existing components:
`Stacks` (name + logo) and `GettingStarted` (prose + code block) are already
text/proof pairs.

## Theme

Anchor hue **40** (the brand orange). Neutrals are warm-tinted toward it —
never Tailwind `slate`, which is cool and fights the accent.

### Light

| Token                | Value                  | Role                                           |
| -------------------- | ---------------------- | ---------------------------------------------- |
| `--color-paper`      | `oklch(96% 0.015 80)`  | page ground (the OG cream, `#fbf3e8`)          |
| `--color-paper-2`    | `oklch(99% 0.006 80)`  | card / raised surface                          |
| `--color-paper-3`    | `oklch(93% 0.018 80)`  | tinted alternating band                        |
| `--color-ink`        | `oklch(25% 0.020 60)`  | primary text                                   |
| `--color-ink-2`      | `oklch(48% 0.018 60)`  | secondary text                                 |
| `--color-rule`       | `oklch(88% 0.015 70)`  | hairlines, borders                             |
| `--color-accent`     | `oklch(68% 0.200 40)`  | `#ff5b11` — unchanged brand                    |
| `--color-accent-ink` | `oklch(99% 0.005 40)`  | text on accent fill                            |
| `--color-focus`      | `oklch(52% 0.180 250)` | focus ring — blue, so it never reads as accent |

### Dark

Hue never changes between modes; only lightness and chroma move.

| Token                | Value                  |
| -------------------- | ---------------------- |
| `--color-paper`      | `oklch(16% 0.012 60)`  |
| `--color-paper-2`    | `oklch(20% 0.012 60)`  |
| `--color-paper-3`    | `oklch(24% 0.012 60)`  |
| `--color-ink`        | `oklch(94% 0.008 80)`  |
| `--color-ink-2`      | `oklch(72% 0.008 70)`  |
| `--color-rule`       | `oklch(32% 0.010 60)`  |
| `--color-accent`     | `oklch(74% 0.170 40)`  |
| `--color-accent-ink` | `oklch(18% 0.015 40)`  |
| `--color-focus`      | `oklch(70% 0.150 250)` |

### Accent discipline

The accent is a highlighter, not a colour block. It occupies **≤ 3 % of any
viewport**. Permitted uses: the single primary CTA fill, the active nav item,
link underline on hover, the OG-derived right-edge bar, a small square beside a
section heading. Banned: full-width accent section backgrounds, accent
gradients, accent as a card fill.

**Note on the pre-redesign cream.** The old hero used `--color-primary-100`
(`oklch(95% 0.04 40)` — orange-tinted) while the OG image used `#fbf3e8`
(yellow-tinted, hue ~80). The site now standardises on the OG value. The
`--color-primary-*` ramp stays in `styles.css` for backward compatibility and
for the existing components that reference it, but new work uses the semantic
tokens above.

## Typography

Three families — display + body + outlier. This is the 2+1 ceiling; do not add
a fourth.

| Role           | Family                         | Weight    | Notes                                                                        |
| -------------- | ------------------------------ | --------- | ---------------------------------------------------------------------------- |
| Display        | **M PLUS Rounded 1c**          | 700 / 800 | brand voice; already used by the OG generator at 700                         |
| Body           | **Noto Sans JP**               | 400       | already in `package.json` via `@fontsource/noto-sans-jp`, previously unwired |
| Outlier (mono) | explicit stack, no new webfont | 400       | code blocks + footer colophon only — exactly 2 slots                         |

- Display tracking: `-0.02em`. Body tracking: `0`.
- Weight contrast is 400 → 800 (400 units), above the 300-unit minimum.
- Type scale ratio: **1.25** (major third).
- `--text-display` caps at `5.25rem`. Both locales' hero headline
  (「愛がロックする。Rox。」 / "The Love Rocks. Rox.") is ≤ 20 chars, so it may
  use the full display size.
- Body measure `max-width: 65ch`. Line-height 1.5–1.65 body, 1.1–1.3 display.

**Why the pairing matters.** Pre-redesign, one family (M PLUS Rounded 1c) was
applied once on the body wrapper in `_layout.tsx` and inherited by headings,
prose, nav, and footer alike — hierarchy was carried by size and weight only.
Rounded gothic is a display voice; at body size in long-form Japanese it costs
legibility. Splitting display/body restores contrast at zero bundle cost, since
the Noto dependency was already installed.

**Font loading.** M PLUS Rounded 1c continues to load via the Google Fonts
`@import` at the top of `src/styles.css` — that `@import` must stay the first
rule in the file (CSS requires `@import` before all other rules; moving it
breaks the load). Noto Sans JP loads self-hosted via `@fontsource`. Mono
resolves to a system stack — no third webfont download.

## Spacing

4-point named scale. Values live in `src/styles.css` `@theme`. Pages use named
tokens, never raw values.

```
--space-3xs 0.25rem   --space-2xs 0.5rem   --space-xs  0.75rem
--space-sm  1rem      --space-md  1.5rem   --space-lg  2rem
--space-xl  3rem      --space-2xl 4.5rem   --space-3xl 7rem
```

Minimum `--space-3xl` between major sections. Do not subdivide a section into
sub-rows with their own rules — the section break _is_ the rhythm.

## Motion

This is a **motion-cut** project — no `framer-motion`, `gsap`, or `motion`
dependency, and none should be added. All motion is hand-written CSS.

**Preserved from the pre-redesign site** (these are genuine craft, not slop):

- the `AdditionalStacks` infinite marquee with edge mask
- the header logo `♥` pulse (6 s loop, already reduced-motion aware)

**Dropped during implementation:** the `GettingStarted` bouncing chevron
connectors. The chevrons carried sequence information; the _bounce_ carried
none, and six simultaneous bounces read as noise in a half-width column. The
sequence is now stated by a continuous rail plus the step numbers — same
information, no motion. (This overrides the original "preserve the chevrons"
call; recorded here so the reversal is visible rather than silent.)

**Added:** exactly one new primitive — card hover-lift
(`translateY(-2px)` + shadow expansion).

- Easings: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`,
  `--ease-in: cubic-bezier(0.7, 0, 0.84, 0)`,
  `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`. Never the browser default
  `ease`.
- **No bounce, no spring overshoot** on UI state. (The `Hum` exception that
  permits spring easings does not apply — this is not a `Hum` build.)
- Animate `transform` and `opacity` only. Never layout properties.
- `prefers-reduced-motion: reduce` collapses spatial motion to a ≤ 150 ms
  opacity crossfade, and stops the marquee.

## Microinteractions stance

- **Silent success** over celebratory toasts.
- Hover tooltips delay 800 ms; focus tooltips delay 0 ms.
- `:focus-visible` ring at ≥ 3:1 contrast, using `--color-focus`. **Never
  animate the ring's appearance** — it must show instantly.
- Every interactive element ships all eight states: default · hover ·
  focus-visible · active · disabled · loading · error · success.

## CTA voice

- **Primary** — filled `--color-accent`, `--radius-pill`, `--color-accent-ink`
  text. **One per viewport.** Copy comes from `hero.json` `getStarted`
  (「さぁ始めよう」 / "Get Started"); destination is
  `/[lang]/docs/getting-started`.
- **Secondary** — outlined, `--color-rule` border, ink text, same radius.
- Radius: cards `12px` (playful upper bound), inputs `8px`, pills `999px`.

## Nav and footer

- **Nav: N1b · Canonical SaaS three-section.** Wordmark left · link cluster
  centre · language + theme + primary CTA right. Frosts on scroll.
  Replaces the pre-redesign transparent non-sticky overlay bar, which had no
  CTA and scrolled away. The header CTA is the site's single primary action.
- **Footer: Ft5 · Statement.** One large display sentence — the existing
  `footer.json` `branding.tagline`
  (「愛がロックする。Rox。」 / "The Love Rocks. Rox.") — over a compact link
  row and the existing monospace colophon. Replaces the 5-column grid whose
  "Project" column held a heading and one line of text with no links.

**Ft8 (marquee scroll) is the playful genre default and is deliberately not
used**: `AdditionalStacks` already uses a marquee. Reusing the same device
twice on one page turns a design language into a tic.

## Per-page allowances

- Marketing pages MAY use enrichment, **Tier A (pure CSS) only** — the
  OG-derived dot grid and right-edge accent bar. No raster assets, no
  illustration library, no Lottie.
- Content pages: typography only.
- Index/hub pages: typography + hairline rules. No enrichment.
- Utility pages: typography only.

## What pages MUST share

- The wordmark and the `♥` mark.
- `--color-accent` and its ≤ 3 % placement budget.
- The display + body + mono families.
- The CTA voice (shape, radius, padding rhythm, copy source).
- Section heading rhythm.
- The focus ring treatment.

## What pages MAY differ on

- Macrostructure — but only within the family this file assigns to the page type.
- Hero archetype, within the family's allowance.
- Enrichment — marketing pages only, Tier A only.

## Section tags / eyebrows — OFF

Do not emit `01 · FEATURES`, `02 / DOCS`, or any uppercase mono section
number or kicker on page sections. The pre-redesign site correctly had none;
keep it that way. The `eyebrow` parameter in the OG image generator is for the
_generated image only_ and does not imply an on-page eyebrow.

The tag-left / heading-right two-column pattern (hanging header) is banned
outright.

## Typography purity

Headings and display type are always roman (`font-style: normal`). No
italicised emphasis word inside a heading. Carry emphasis with weight, accent
colour, or a drawn underline. Italic survives only as body-copy emphasis inside
running paragraphs.

## Mobile floor

Every page verified at **320 / 375 / 414 / 768 px**.

- No horizontal scroll; `overflow-x: clip` on both `html` and `body` (never
  `hidden`).
- No two-line clickable text on buttons, nav links, footer links, breadcrumbs,
  or CTAs.
- Image-bearing grid tracks use `minmax(0, 1fr)`, never bare `1fr`.
- Display headings wrap inside long words: `overflow-wrap: anywhere;
min-width: 0`.
- Section heads collapse to one column.
- All hit targets ≥ 44 × 44 px below 40 rem.

## Honest copy

No invented metrics, testimonials, user counts, logos, or case studies. All
page copy originates in `private/lang/`, and all product claims defer to the
upstream `Love-Rox/rox` repository. If a number is not already in the repo, it
does not go on the page.

## Exports

Drop-in formats for re-using this design system.

### tokens.css

```css
:root {
  --color-paper: oklch(96% 0.015 80);
  --color-paper-2: oklch(99% 0.006 80);
  --color-paper-3: oklch(93% 0.018 80);
  --color-ink: oklch(25% 0.02 60);
  --color-ink-2: oklch(48% 0.018 60);
  --color-rule: oklch(88% 0.015 70);
  --color-accent: oklch(68% 0.2 40);
  --color-accent-ink: oklch(99% 0.005 40);
  --color-focus: oklch(52% 0.18 250);

  --font-display: "M PLUS Rounded 1c", sans-serif;
  --font-body: "Noto Sans JP", sans-serif;
  --font-mono: ui-monospace, "SFMono-Regular", "JetBrains Mono", Menlo, monospace;

  --space-3xs: 0.25rem;
  --space-2xs: 0.5rem;
  --space-xs: 0.75rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  --space-2xl: 4.5rem;
  --space-3xl: 7rem;

  --text-xs: 0.64rem;
  --text-sm: 0.8rem;
  --text-base: 1rem;
  --text-md: 1.25rem;
  --text-lg: 1.5625rem;
  --text-xl: 1.9531rem;
  --text-2xl: 2.4414rem;
  --text-3xl: 3.0518rem;
  --text-4xl: 3.8147rem;
  --text-display: clamp(2.75rem, 5vw + 1rem, 5.25rem);
  --text-display-s: clamp(2.25rem, 3.5vw + 1rem, 3.8147rem);

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-short: 220ms;
  --dur-medium: 320ms;

  --radius-card: 12px;
  --radius-input: 8px;
  --radius-pill: 999px;
  --rule-hair: 1px;
}
```

### Tailwind v4 `@theme`

```css
@theme {
  --color-paper: oklch(96% 0.015 80);
  --color-paper-2: oklch(99% 0.006 80);
  --color-paper-3: oklch(93% 0.018 80);
  --color-ink: oklch(25% 0.02 60);
  --color-ink-2: oklch(48% 0.018 60);
  --color-rule: oklch(88% 0.015 70);
  --color-accent: oklch(68% 0.2 40);
  --color-accent-ink: oklch(99% 0.005 40);
  --color-focus: oklch(52% 0.18 250);

  --font-display: "M PLUS Rounded 1c", sans-serif;
  --font-body: "Noto Sans JP", sans-serif;

  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  --spacing-2xl: 4.5rem;
  --spacing-3xl: 7rem;

  --text-display: clamp(2.75rem, 5vw + 1rem, 5.25rem);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --radius-card: 12px;
}
```

### DTCG `tokens.json`

```json
{
  "color": {
    "paper": { "$value": "oklch(96% 0.015 80)", "$type": "color" },
    "ink": { "$value": "oklch(25% 0.020 60)", "$type": "color" },
    "accent": { "$value": "oklch(68% 0.200 40)", "$type": "color" },
    "focus": { "$value": "oklch(52% 0.180 250)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "M PLUS Rounded 1c", "$type": "fontFamily" },
    "body": { "$value": "Noto Sans JP", "$type": "fontFamily" }
  },
  "space": {
    "md": { "$value": "1.5rem", "$type": "dimension" },
    "3xl": { "$value": "7rem", "$type": "dimension" }
  }
}
```

### shadcn/ui CSS variables

```css
:root {
  --background: 96% 0.015 80;
  --foreground: 25% 0.02 60;
  --primary: 68% 0.2 40;
  --primary-foreground: 99% 0.005 40;
  --muted: 93% 0.018 80;
  --muted-foreground: 48% 0.018 60;
  --border: 88% 0.015 70;
  --input: 88% 0.015 70;
  --ring: 52% 0.18 250;
  --radius: 12px;
}
```
