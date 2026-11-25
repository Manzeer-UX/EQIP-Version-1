import type { CSSProperties } from "react";
import { capabilities, closing, evidence, experience, field, footer, hero, matters, nav, problem, visible } from "@/lib/content";
import { sceneAttrs } from "@/lib/sceneAttrs";
import { PILLAR_ART } from "./PillarArt";
import { HorizontalTrack, Question, Story, TiltCard, Trail } from "./interactive";
import { Button, Eyebrow, HighlightText, SplitText } from "./ui";

const pad = (n: number) => String(n).padStart(2, "0");

/* ============ Intro curtain ============ */
export function Loader() {
  return (
    <div className="loader" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="loader__logo" src="/assets/eqip-logo.png" alt="" width={560} height={134} />
      <div className="loader__bar">
        <i />
      </div>
    </div>
  );
}

/* ============ Hero ============ */
export function Hero() {
  return (
    <section
      className="hero"
      {...sceneAttrs({ state: 0, x: 0.44, tilt: 0.12, scale: 1, opacity: 1, scan: 1, xMobile: 0, opacityMobile: 0.5 })}
    >
      <div className="container hero__inner">
        <SplitText as="h1" className="display hero__title" text={hero.title} />
        <div className="hero__body">
          <p className="lead" data-reveal="" style={{ "--d": "450ms" } as CSSProperties}>
            {hero.body}
          </p>
          <div className="cta-row" data-reveal="" style={{ "--d": "600ms" } as CSSProperties}>
            <Button href={hero.primary.href} magnetic>
              {hero.primary.label}
            </Button>
            <Button href={hero.secondary.href} variant="ghost">
              {hero.secondary.label}
            </Button>
          </div>
        </div>
      </div>
      <div className="hero__scroll" aria-hidden="true">
        <i />
      </div>
    </section>
  );
}

/* ============ Tagline marquee ============ */
export function Marquee() {
  const half = (
    <>
      {[0, 1, 2].map((i) => (
        <span className="marquee__item" key={i}>
          <span className={i % 2 ? "is-serif" : undefined}>{hero.tagline}</span>
          <b className="qtail" />
        </span>
      ))}
    </>
  );
  return (
    <div className="marquee">
      <p className="sr-only">{hero.tagline}</p>
      <div className="marquee__track" aria-hidden="true">
        {half}
        {half}
      </div>
    </div>
  );
}

/* ============ The problem ============ */
export function Problem() {
  return (
    <>
      <section className="problem" id="problem" {...sceneAttrs({ state: 1, tilt: 0.05, scale: 1.05, opacity: 0.55 })}>
        <div className="container">
          <Eyebrow idx="01">{problem.eyebrow}</Eyebrow>
          <SplitText className="h2 problem__title" text={problem.title} />
          <HighlightText className="highlight-text" text={problem.body} />
          <div className="problem__bridge" data-reveal="">
            <svg className="trace" viewBox="0 0 120 120" aria-hidden="true">
              <path d="M16 6 H50 L90 46 V114" />
              <rect x="4" y="0" width="12" height="12" />
            </svg>
            <p>{problem.bridge}</p>
          </div>
        </div>
      </section>
      <Question
        question={problem.question}
        lead={problem.answerLead}
        answer={problem.answer}
        {...sceneAttrs({ state: 1, scale: 1.3, opacity: 0.32 })}
      />
    </>
  );
}

/* ============ What EQIP makes visible ============ */
export function WhatWeSee() {
  return (
    <section
      className="see"
      id="what-we-see"
      {...sceneAttrs({ state: 2, x: 0.5, tilt: 0.5, scale: 0.95, opacity: 1, scan: 0.4, xMobile: 0, opacityMobile: 0.45 })}
    >
      <div className="container">
        <div className="see__head">
          <Eyebrow idx="02">{visible.eyebrow}</Eyebrow>
          <SplitText className="h2" text={visible.title} />
          <div className="see__copy">
            <p className="lead" data-reveal="">
              {visible.body}
            </p>
            <p className="body-muted" data-reveal="">
              {visible.body2}
            </p>
          </div>
        </div>

        <div className="pillars">
          {visible.pillars.map((p, i) => {
            const Art = PILLAR_ART[i];
            return (
              <TiltCard key={p.title} delay={i * 110}>
                <Art />
                <span className="pillar__idx">{pad(i + 1)}</span>
                <h3 className="pillar__title">{p.title}</h3>
                <p className="pillar__text">{p.text}</p>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============ The capabilities behind EQIP ============ */
export function Capabilities() {
  let n = 0;
  return (
    <section
      className="caps"
      id="capabilities"
      {...sceneAttrs({ state: 2, x: -0.5, tilt: 0.65, scale: 1.05, opacity: 0.4, xMobile: 0, opacityMobile: 0.25 })}
    >
      <div className="container">
        <div className="caps__head">
          <Eyebrow idx="03">{capabilities.eyebrow}</Eyebrow>
          <SplitText className="h2" text={capabilities.title} />
          <p className="lead" data-reveal="">
            {capabilities.body}
          </p>
        </div>

        <div className="caps__groups">
          {capabilities.groups.map((g, gi) => (
            <div className="caps__group" key={g.label}>
              <h3 className="caps__label" data-reveal="">
                <span className="caps__label-idx">{pad(gi + 1)}</span>
                {g.label}
              </h3>
              <ul className="caps__list">
                {g.items.map((c, ci) => (
                  <li
                    className="cap"
                    key={c.title}
                    data-reveal=""
                    style={{ "--d": `${ci * 90}ms` } as CSSProperties}
                  >
                    <span className="cap__num" aria-hidden="true">
                      {pad(++n)}
                    </span>
                    <h4 className="cap__title">{c.title}</h4>
                    <p className="cap__text">{c.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Where confidence matters most ============ */
export function WhereItMatters() {
  return (
    <HorizontalTrack
      className="where"
      id="where-it-matters"
      {...sceneAttrs({ state: 2, tilt: 0.85, scale: 1.25, opacity: 0.55 })}
      head={
        <div className="container where__head">
          <Eyebrow idx="04">{matters.eyebrow}</Eyebrow>
          <SplitText className="h2" text={matters.title} />
        </div>
      }
    >
      {matters.cases.map((c, i) => (
        <article className="usecase" key={c.title}>
          <div className="usecase__top" aria-hidden="true">
            <b className="qtail" />
            <span className="usecase__trace" />
          </div>
          <div className="usecase__num" aria-hidden="true">
            {pad(i + 1)}
          </div>
          <div className="usecase__body">
            <h3 className="usecase__title">{c.title}</h3>
            <p className="usecase__text">{c.text}</p>
          </div>
        </article>
      ))}
    </HorizontalTrack>
  );
}

/* ============ Evidence, not assurance theatre ============ */
export function Evidence() {
  return (
    <section className="evidence" id="evidence" {...sceneAttrs({ state: 2, tilt: 0.5, opacity: 0 })}>
      <div className="container evidence__grid">
        <div className="evidence__intro">
          <Eyebrow idx="05" dark>
            {evidence.eyebrow}
          </Eyebrow>
          <SplitText className="h2" text={evidence.title} />
          <p className="evidence__copy" data-reveal="">
            {evidence.body}
          </p>
          <p className="evidence__kicker" data-reveal="">
            {evidence.kicker}
          </p>
        </div>
        <Trail points={evidence.points} />
      </div>
    </section>
  );
}

/* ============ Built on experience ============ */
export function About() {
  return (
    <section
      className="about"
      id="about"
      {...sceneAttrs({ state: 0, x: -0.55, tilt: 0.2, scale: 0.8, opacity: 0.5, scan: 0.3, xMobile: 0, opacityMobile: 0.3 })}
    >
      <div className="container">
        <div className="about__grid">
          <div className="about__copy">
            <Eyebrow idx="06">{experience.eyebrow}</Eyebrow>
            <SplitText className="h2" text={experience.title} />
            <p className="lead" data-reveal="">
              {experience.body}
            </p>
          </div>

          <div className="strata" data-reveal="" aria-hidden="true">
            {experience.strata.map((s, k) => (
              <div className="stratum" key={s} style={{ "--k": k } as CSSProperties}>
                <div className="stratum__plate">
                  <i />
                </div>
                <span className="stratum__label">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="about__foot">
          <HighlightText className="about__statement" text={experience.statement} />
          <p className="proof-slot" data-reveal="">
            {experience.proof}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============ Evidence from the field ============ */
export function Field() {
  return (
    <section className="field" id="field" {...sceneAttrs({ state: 2, tilt: 1.1, scale: 1.5, opacity: 0.35 })}>
      <div className="container">
        <div className="field__head">
          <Eyebrow idx="07">{field.eyebrow}</Eyebrow>
          <SplitText className="h2" text={field.title} />
        </div>
        <div className="stories">
          {field.stories.map((s, i) => (
            <Story key={s.title} title={s.title} steps={s.steps} href={s.href} linkLabel={field.linkLabel} delay={i * 140} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Closing ============ */
export function Closing() {
  return (
    <section
      className="closing"
      id="contact"
      {...sceneAttrs({ state: 3, tilt: 0.42, scale: 1.35, opacity: 0.9, opacityMobile: 0.5 })}
    >
      <div className="container closing__inner">
        <SplitText className="closing__title" text={closing.title} />
        <p className="lead closing__lead" data-reveal="">
          {closing.body}
        </p>
        <div className="cta-row cta-row--center" data-reveal="">
          <Button href={closing.primary.href} size="lg" magnetic>
            {closing.primary.label}
          </Button>
          <Button href={closing.secondary.href} size="lg" variant="ghost">
            {closing.secondary.label}
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ============ Footer ============ */
export function Footer() {
  return (
    <footer className="footer" {...sceneAttrs({ state: 3, tilt: 1.25, scale: 1.8, opacity: 0.3 })}>
      <div className="container footer__grid">
        <a className="footer__logo" href="#top" aria-label="EQIP — back to top">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/eqip-logo.png" alt="EQIP — Intelligent QA" width={560} height={134} loading="lazy" />
        </a>
        <p className="footer__line">{footer.line}</p>
        <nav className="footer__nav" aria-label="Footer">
          {[...nav.links, nav.cta].map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
