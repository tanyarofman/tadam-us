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
ScrollTrigger.config({ autoRefreshEvents: "visibilitychange,DOMContentLoaded,load", ignoreMobileResize: true });
let refreshTimer = 0;
export const refreshScrollSoon = () => {
  clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => {
    if (!document.fullscreenElement) ScrollTrigger.refresh();
  }, 250);
};
let viewportWidth = window.innerWidth;
window.addEventListener("resize", () => {
  // Mobile browser chrome and the keyboard resize height while a gesture is in progress.
  // Stable lvh scene panels need no refresh; orientation/width changes still do.
  const mobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
  if (!mobile || window.innerWidth !== viewportWidth) refreshScrollSoon();
  viewportWidth = window.innerWidth;
});
document.addEventListener("fullscreenchange", refreshScrollSoon);

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis: Lenis | null = null;

export function initScroll() {
  if (prefersReducedMotion() || window.matchMedia("(max-width: 767px), (pointer: coarse)").matches) return null;
  lenis = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.2, syncTouch: false });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  if (import.meta.env.DEV) (window as any).__lenis = lenis;
  return lenis;
}

/** `offset` in px past the target's top (e.g. deep into a pinned scene). */
export function scrollToTarget(target: string | HTMLElement, offset = 0) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6, offset });
  else if (offset) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

export function lockScroll(locked: boolean) {
  if (lenis) locked ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export { gsap, ScrollTrigger };
