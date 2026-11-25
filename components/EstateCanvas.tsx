"use client";

import { useEffect, useRef } from "react";
import type { SceneTarget } from "@/lib/estateScene";

type Section = { el: HTMLElement; desktop: SceneTarget; mobile: SceneTarget };

const KEYS = ["state", "x", "tilt", "scale", "opacity", "scan"] as const;

function readSection(el: HTMLElement): Section {
  const d = el.dataset;
  const desktop: SceneTarget = {
    state: parseFloat(d.scene ?? "0"),
    x: parseFloat(d.x ?? "0"),
    tilt: parseFloat(d.tilt ?? "0"),
    scale: parseFloat(d.scale ?? "1"),
    opacity: parseFloat(d.opacity ?? "1"),
    scan: parseFloat(d.scan ?? "0"),
  };
  const mobile: SceneTarget = {
    ...desktop,
    x: d.xMobile !== undefined ? parseFloat(d.xMobile) : desktop.x * 0.3,
    opacity: d.opacityMobile !== undefined ? parseFloat(d.opacityMobile) : desktop.opacity * 0.7,
  };
  return { el, desktop, mobile };
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Fixed full-screen WebGL layer. Each [data-scene] section steers it as you scroll. */
export function EstateCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let disposed = false;
    let scene: { dispose(): void } | null = null;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]")).map(readSection);
    if (!sections.length) return;

    const out: SceneTarget = { ...sections[0].desktop };

    // Blend between neighbouring sections around each boundary, measured at the viewport centre.
    const getTarget = (): SceneTarget => {
      const mobile = window.innerWidth < 900;
      const vh = window.innerHeight;
      const y = vh * 0.5;
      const zone = vh * 0.42;
      const pick = (s: Section) => (mobile ? s.mobile : s.desktop);
      Object.assign(out, pick(sections[0]));
      let prevBottom = sections[0].el.getBoundingClientRect().bottom;
      for (let k = 1; k < sections.length; k++) {
        const r = sections[k].el.getBoundingClientRect();
        const boundary = (prevBottom + r.top) / 2;
        const w = smoothstep(boundary - zone, boundary + zone, y);
        if (w <= 0) break;
        const p = pick(sections[k]);
        for (const key of KEYS) out[key] += (p[key] - out[key]) * w;
        prevBottom = r.bottom;
      }
      return out;
    };

    import("@/lib/estateScene")
      .then(({ EstateScene }) => {
        if (disposed || !ref.current) return;
        try {
          scene = new EstateScene(ref.current, getTarget);
        } catch {
          document.documentElement.classList.add("no-webgl");
        }
      })
      .catch(() => document.documentElement.classList.add("no-webgl"));

    return () => {
      disposed = true;
      scene?.dispose();
    };
  }, []);

  return <canvas id="gl" ref={ref} aria-hidden="true" />;
}
