"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { clamp } from "@/lib/scroll";
import { Arrow } from "./ui";

const prefersReduced = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ======================= TiltCard ======================= */
export function TiltCard({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  const onMove = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(px - 0.5) * 12}deg`);
    el.style.setProperty("--rx", `${(0.5 - py) * 12}deg`);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };
  return (
    <div className="pillar-wrap" data-reveal="" style={{ "--d": `${delay}ms` } as CSSProperties}>
      <article ref={ref} className="pillar" onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className="pillar__glow" aria-hidden="true" />
        {children}
      </article>
    </div>
  );
}

/* ======================= Question (pinned) ======================= */
const GLYPHS = "abcdefghijklmnopqrstuvwxyz";

export function Question({
  question,
  lead,
  answer,
  ...attrs
}: { question: string; lead: string; answer: string } & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  const ansRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const ans = ansRef.current;
    if (!el || !ans) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>(".qw"));

    if (prefersReduced()) {
      words.forEach((w) => w.style.setProperty("--t", "1"));
      el.classList.add("is-answered", "is-static");
      return;
    }

    let answered = false;
    let scrambleRaf = 0;
    const scramble = () => {
      cancelAnimationFrame(scrambleRaf);
      const start = performance.now();
      const dur = 1300;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        const fixed = Math.floor(p * answer.length);
        let s = "";
        for (let i = 0; i < answer.length; i++) {
          const ch = answer[i];
          s += i < fixed || ch === " " || ch === "." ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        ans.textContent = s;
        if (p < 1) scrambleRaf = requestAnimationFrame(tick);
      };
      scrambleRaf = requestAnimationFrame(tick);
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const total = Math.max(1, r.height - vh);
      const p = clamp(-r.top / total);
      el.style.setProperty("--p", p.toFixed(4));
      // Words start focusing as the section rises into view, before it pins.
      const reveal = clamp((vh * 0.55 - r.top) / (vh * 1.1));
      words.forEach((w, i) => {
        const start = i * 0.13;
        w.style.setProperty("--t", clamp((reveal - start) / 0.4).toFixed(3));
      });
      if (p > 0.52 && !answered) {
        answered = true;
        el.classList.add("is-answered");
        scramble();
      } else if (p < 0.4 && answered) {
        answered = false;
        el.classList.remove("is-answered");
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scrambleRaf);
    };
  }, [answer]);

  return (
    <section ref={ref} className="question" id="question" {...attrs}>
      <div className="question__sticky">
        <div className="container question__inner">
          <h3 className="question__q" aria-label={question}>
            {question.split(" ").map((w, i) => (
              <span key={i}>
                <span className="qw" aria-hidden="true">{w}</span>{" "}
              </span>
            ))}
          </h3>
          <p className="question__a">
            <span className="question__lead">{lead}</span>
            <span className="sr-only">{answer}</span>
            <span className="question__answer" ref={ansRef} aria-hidden="true">
              {answer}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ======================= Horizontal use-case track ======================= */
export function HorizontalTrack({
  head,
  children,
  className,
  ...attrs
}: { head: ReactNode; children: ReactNode; className?: string } & Record<string, unknown>) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    if (!section || !track || !bar) return;
    const mq = matchMedia("(min-width: 900px)");
    const cards = Array.from(track.querySelectorAll<HTMLElement>(".usecase"));
    let overflow = 0;
    let raf = 0;

    const update = () => {
      raf = 0;
      if (!overflow) return;
      const r = section.getBoundingClientRect();
      const p = clamp(-r.top / overflow);
      track.style.transform = `translate3d(${-p * overflow}px,0,0)`;
      bar.style.transform = `scaleX(${p})`;
      const mid = window.innerWidth * 0.55;
      cards.forEach((c) => {
        const cr = c.getBoundingClientRect();
        c.classList.toggle("is-active", cr.left < mid && cr.right > mid * 0.6);
      });
    };
    const measure = () => {
      if (!mq.matches || prefersReduced()) {
        overflow = 0;
        section.style.height = "";
        track.style.transform = "";
        return;
      }
      overflow = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = `${window.innerHeight + overflow}px`;
      update();
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className={className} {...attrs}>
      <div className="where__sticky">
        {head}
        <div className="where__track" ref={trackRef}>
          {children}
        </div>
        <div className="container where__progress" aria-hidden="true">
          <i ref={barRef} />
        </div>
      </div>
    </section>
  );
}

/* ======================= Evidence trail ======================= */
export function Trail({ points }: { points: string[] }) {
  const ref = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>(".trail__item"));
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.62;
      const r = list.getBoundingClientRect();
      const first = items[0].getBoundingClientRect();
      const last = items[items.length - 1].getBoundingClientRect();
      const top = first.top + first.height / 2;
      const bottom = last.top + last.height / 2;
      list.style.setProperty("--fill", clamp((line - top) / (bottom - top)).toFixed(4));
      list.style.setProperty("--line-top", `${top - r.top}px`);
      list.style.setProperty("--line-bottom", `${r.bottom - bottom}px`);
      items.forEach((it) => {
        const ir = it.getBoundingClientRect();
        it.classList.toggle("is-on", ir.top + ir.height / 2 < line);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <ol className="trail" ref={ref}>
      {points.map((p) => (
        <li className="trail__item" key={p}>
          <span className="trail__node" aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <path d="M4 8.5l2.6 2.5L12 5.5" />
            </svg>
          </span>
          <span className="trail__text">{p}</span>
        </li>
      ))}
    </ol>
  );
}

/* ======================= Case-study story ======================= */
type Step = { label: string; text: string };

export function Story({ title, steps, href, linkLabel, delay = 0 }: { title: string; steps: Step[]; href: string; linkLabel: string; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (prefersReduced()) setAuto(false);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const playing = auto && visible && !hover;

  return (
    <article
      ref={ref}
      className={`story${auto ? "" : " is-manual"}`}
      data-reveal=""
      style={{ "--play": playing ? "running" : "paused", "--d": `${delay}ms` } as CSSProperties}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h3 className="story__title">{title}</h3>
      <div className="story__steps" role="tablist" aria-label={title}>
        {steps.map((s, i) => (
          <button
            key={s.label}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`story__step${i === active ? " is-active" : ""}${i < active ? " is-done" : ""}`}
            onClick={() => setActive(i)}
          >
            <span>{s.label}</span>
            <b>
              <i
                key={i === active ? `on-${active}` : `off-${i}`}
                onAnimationEnd={i === active && auto ? () => setActive((a) => (a + 1) % steps.length) : undefined}
              />
            </b>
          </button>
        ))}
      </div>
      <div className="story__panels">
        {steps.map((s, i) => (
          <p key={s.label} role="tabpanel" className={`story__panel${i === active ? " is-active" : ""}`} aria-hidden={i !== active}>
            {s.text}
          </p>
        ))}
      </div>
      <a className="link-arrow" href={href}>
        <span>{linkLabel}</span>
        <Arrow className="" />
      </a>
    </article>
  );
}
