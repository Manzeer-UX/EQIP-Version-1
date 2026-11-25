import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;

export function scrollToHash(hash: string) {
  const target = hash === "#top" ? 0 : document.querySelector<HTMLElement>(hash);
  if (target === null) return;
  if (instance) {
    instance.scrollTo(target, { duration: 1.6, force: true });
  } else if (typeof target === "number") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
  history.replaceState(null, "", hash);
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
