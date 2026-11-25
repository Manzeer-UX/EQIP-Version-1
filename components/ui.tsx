import type { CSSProperties, ElementType, ReactNode } from "react";
import { Fragment } from "react";

/* ---------- Arrow ---------- */
export function Arrow({ className = "btn__arrow" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

/* ---------- Button ---------- */
type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "signal" | "ghost";
  size?: "sm" | "md" | "lg";
  magnetic?: boolean;
  className?: string;
};

export function Button({ href, children, variant = "signal", size = "md", magnetic, className = "" }: ButtonProps) {
  const cls = ["btn", `btn--${variant}`, size !== "md" ? `btn--${size}` : "", className].filter(Boolean).join(" ");
  return (
    <a className={cls} href={href} data-magnetic={magnetic ? "" : undefined}>
      <span>{children}</span>
      <Arrow />
    </a>
  );
}

/* ---------- Eyebrow ---------- */
export function Eyebrow({ idx, children, dark }: { idx: string; children: ReactNode; dark?: boolean }) {
  return (
    <p className={`eyebrow${dark ? " eyebrow--dark" : ""}`} data-reveal="">
      <span className="eyebrow__idx">{idx}</span>
      <b className="qtail" aria-hidden="true" />
      {children}
    </p>
  );
}

/* ---------- SplitText: word-by-word rise-in headline ---------- */
type SplitProps = { text: string; as?: ElementType; className?: string; delay?: number };

export function SplitText({ text, as: Tag = "h2", className, delay = 0 }: SplitProps) {
  let i = 0;
  // Odd segments (between *asterisks*) are emphasised.
  const segments = text.split("*");
  const words = (seg: string) =>
    seg
      .split(/( +)/) // split on normal spaces only, so non-breaking spaces stay inside a word
      .filter((p) => p.length > 0)
      .map((p, k) =>
        /^ +$/.test(p) ? (
          " "
        ) : (
          <span className="w" key={k}>
            <span className="wi" style={{ "--i": i++ } as CSSProperties}>
              {p}
            </span>
          </span>
        ),
      );

  return (
    <Tag className={className} data-split="" style={delay ? ({ "--d": `${delay}ms` } as CSSProperties) : undefined}>
      {segments.map((seg, s) => (s % 2 ? <em key={s}>{words(seg)}</em> : <Fragment key={s}>{words(seg)}</Fragment>))}
    </Tag>
  );
}

/* ---------- HighlightText: words light up as you scroll ---------- */
export function HighlightText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(" ");
  return (
    <p className={className} data-highlight="">
      {parts.map((w, k) => (
        <span className="hw" key={k}>
          {w}
          {k < parts.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
