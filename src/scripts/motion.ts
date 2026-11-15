import { gsap } from "../lib/scroll";

/** Word-by-word bounce for a [data-split] heading. Returns a tween. */
export function animateWords(el: Element | null, opts: gsap.TweenVars = {}) {
  if (!el) return gsap.timeline();
  const words = el.querySelectorAll(".word-in");
  return gsap.fromTo(
    words,
    { yPercent: 110, opacity: 0, rotate: -4 },
    {
      yPercent: 0,
      opacity: 1,
      rotate: 0,
      duration: 0.7,
      ease: "back.out(2.2)",
      stagger: 0.07,
      ...opts,
    },
  );
}

/** Simple IntersectionObserver fades for .reveal elements (also the reduced-motion path). */
export function initReveals(root: ParentNode = document) {
  const els = root.querySelectorAll<HTMLElement>(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((e) => e.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
  );
  els.forEach((e) => io.observe(e));
}

/** Seeded random, so decorative layouts are stable between reloads. */
export function seeded(seed = 7) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
