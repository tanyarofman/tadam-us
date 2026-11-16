/**
 * Smooth scroll (Lenis) wired into GSAP ScrollTrigger.
 * With prefers-reduced-motion, Lenis is skipped and native scrolling is used.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

// ScrollTrigger's own resize refresh re-inserts pinned elements into their spacers. Entering fullscreen
// resizes the viewport, so that refresh detached the fullscreen element and the browser instantly
// exited fullscreen. Own the resize refresh instead: skip it while fullscreen, run it once on exit.
ScrollTrigger.config({ autoRefreshEvents: "visibilitychange,DOMContentLoaded,load" });
let refreshTimer = 0;
const refreshSoon = () => {
  clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => {
    if (!document.fullscreenElement) ScrollTrigger.refresh();
  }, 250);
};
window.addEventListener("resize", refreshSoon);
document.addEventListener("fullscreenchange", refreshSoon);

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis: Lenis | null = null;

export function initScroll() {
  if (prefersReducedMotion()) return null;
  lenis = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.2 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  if (import.meta.env.DEV) (window as any).__lenis = lenis;
  return lenis;
}

export function scrollToTarget(target: string | HTMLElement) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

export function lockScroll(locked: boolean) {
  if (lenis) locked ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export { gsap, ScrollTrigger };
