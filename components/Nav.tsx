"use client";

import { useEffect, useState } from "react";
import { nav } from "@/lib/content";
import { getLenis } from "@/lib/scroll";
import { Arrow, Button } from "./ui";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Glass bar after the hero; hide while scrolling down, reveal on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      if (y > last + 4 && y > 520) setHidden(true);
      else if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in the middle of the screen.
  useEffect(() => {
    const ids = nav.links.map((l) => l.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const id = e.target.id;
          if (e.isIntersecting) setActive(id);
          else setActive((cur) => (cur === id ? null : cur));
        });
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open]);

  const cls = ["nav", scrolled && "is-scrolled", hidden && !open && "is-hidden"].filter(Boolean).join(" ");

  return (
    <>
      <header className={cls}>
        <div className="nav__inner">
          <a className="nav__logo" href="#top" aria-label="EQIP — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/eqip-logo.png" alt={`${nav.brand} — Intelligent QA`} width={560} height={134} />
          </a>
          <nav className="nav__links" aria-label="Primary">
            {nav.links.map((l) => (
              <a key={l.href} href={l.href} className={active === l.href.slice(1) ? "is-active" : undefined}>
                {l.label}
              </a>
            ))}
          </nav>
          <Button href={nav.cta.href} size="sm" magnetic className="nav__cta">
            {nav.cta.label}
          </Button>
          <button
            className="nav__toggle"
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className="mobile-menu" id="mobile-menu" aria-hidden={!open}>
        <div className="mobile-menu__glow" aria-hidden="true" />
        <p className="mobile-menu__eyebrow" style={{ transitionDelay: open ? "120ms" : "0ms" }}>
          <b className="qtail" aria-hidden="true" />
          Navigate
        </p>
        <nav className="mobile-menu__links" aria-label="Mobile">
          {nav.links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className={active === l.href.slice(1) ? "is-active" : undefined}
              style={{ transitionDelay: open ? `${180 + i * 55}ms` : "0ms" }}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              <span className="mobile-menu__idx">{String(i + 1).padStart(2, "0")}</span>
              <span className="mobile-menu__label">{l.label}</span>
              <Arrow className="mobile-menu__arrow" />
            </a>
          ))}
        </nav>
        <div className="mobile-menu__foot" style={{ transitionDelay: open ? `${200 + nav.links.length * 55}ms` : "0ms" }}>
          <a className="btn btn--signal btn--lg mobile-menu__cta" href={nav.cta.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
            <span>{nav.cta.label}</span>
            <Arrow />
          </a>
          <p className="mobile-menu__note">Software intelligence · Intelligent QA</p>
        </div>
      </div>
    </>
  );
}
