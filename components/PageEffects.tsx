"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { clamp, scrollToHash, setLenis } from "@/lib/scroll";

/**
 * Page-wide behaviour that is easier to express against the DOM:
 * smooth scrolling, intro curtain, reveal-on-scroll, scroll-lit text and magnetic buttons.
 */
export function PageEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    /* Smooth scroll */
    if (!reduced) {
      const lenis = new Lenis({ autoRaf: true, lerp: 0.095, smoothWheel: true });
      setLenis(lenis);
      cleanups.push(() => {
        lenis.destroy();
        setLenis(null);
      });
    }

    /* Intro curtain: lift once fonts are ready (or after a short cap) */
    let t = 0;
    const fontsReady = (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve();
    Promise.race([fontsReady, new Promise((r) => setTimeout(r, 2200))]).then(() => {
      t = window.setTimeout(() => root.classList.add("is-loaded"), reduced ? 0 : 650);
    });
    cleanups.push(() => clearTimeout(t));

    /* In-page anchors go through the smooth scroller */
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute("href") ?? "#";
      e.preventDefault();
      if (hash.length > 1) scrollToHash(hash);
    };
    document.addEventListener("click", onClick);
    cleanups.push(() => document.removeEventListener("click", onClick));

    /* Reveal on scroll */
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    document.querySelectorAll("[data-reveal],[data-split]").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    /* Scroll-lit paragraphs */
    const lit = Array.from(document.querySelectorAll<HTMLElement>("[data-highlight]")).map((el) => ({
      el,
      words: Array.from(el.querySelectorAll<HTMLElement>(".hw")),
      n: -1,
    }));
    let raf = 0;
    const paint = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const h of lit) {
        const r = h.el.getBoundingClientRect();
        const p = reduced ? 1 : clamp((vh * 0.86 - r.top) / (r.height + vh * 0.34));
        const n = Math.round(p * h.words.length);
        if (n !== h.n) {
          h.words.forEach((w, i) => w.classList.toggle("on", i < n));
          h.n = n;
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    });

    /* Magnetic primary buttons (mouse only) */
    if (matchMedia("(pointer: fine)").matches && !reduced) {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          el.style.setProperty("--mx", `${dx * 0.22}px`);
          el.style.setProperty("--my", `${dy * 0.3}px`);
        };
        const leave = () => {
          el.style.setProperty("--mx", "0px");
          el.style.setProperty("--my", "0px");
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
