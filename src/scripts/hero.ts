/**
 * Scene 0: loading screen + hero.
 * 1. The buzzer sits alone in the middle of the screen and blinks while the site loads.
 * 2. When ready it gets pressed (or the visitor taps it), the rays burst and the stage opens.
 * 3. The buzzer shrinks and flies up into its place on the logo, and the logo assembles around it.
 */
import { gsap, prefersReducedMotion, lockScroll } from "../lib/scroll";
import { animateWords } from "./motion";

function waitForImage(img: HTMLImageElement) {
  if (img.complete && img.naturalWidth) return Promise.resolve();
  return new Promise<void>((res) => {
    img.addEventListener("load", () => res(), { once: true });
    img.addEventListener("error", () => res(), { once: true });
  });
}

export function initHero(onDone?: () => void) {
  const hero = document.querySelector<HTMLElement>("[data-scene='hero']");
  const pre = document.querySelector<HTMLElement>("[data-preloader]");
  if (!hero) return;
  const logo = hero.querySelector<HTMLElement>("[data-logo]")!;
  const target = logo.querySelector<HTMLElement>(".logo-buzzer svg")!; // where the buzzer lands
  const top = logo.querySelector(".piece-top");
  const letters = logo.querySelectorAll(".piece-letter");
  const swoosh = logo.querySelector<HTMLElement>(".piece-swoosh");
  const title = hero.querySelector(".hero-title");
  const fades = hero.querySelectorAll("[data-hero-fade]");
  const burst = hero.querySelector(".hero-burst");

  const finish = () => {
    hero.classList.remove("intro-pending", "intro-playing");
    pre?.remove();
    lockScroll(false);
    onDone?.();
  };

  if (prefersReducedMotion() || !pre) {
    pre?.remove();
    hero.classList.remove("intro-pending");
    gsap.from(hero.querySelectorAll(".logo-full, .hero-title .word-in, [data-hero-fade]"), {
      opacity: 0,
      duration: 0.6,
    });
    onDone?.();
    return;
  }

  lockScroll(true);
  const bg = pre.querySelector(".pre-bg");
  const wrap = pre.querySelector<HTMLElement>("[data-pre-buzzer]")!;
  const buzzer = wrap.querySelector<SVGSVGElement>("svg")!;
  const cap = buzzer.querySelector(".buzzer-cap");
  const rays = buzzer.querySelectorAll(".ray-set");
  const dim = buzzer.querySelector(".buzzer-dim");
  const halo = buzzer.querySelector(".buzzer-glow");
  const shine = buzzer.querySelector(".buzzer-shine");

  gsap.set(rays, { scale: 0, opacity: 0 });
  gsap.set(buzzer, { "--glow": 1 }); // glow is driven per layer below (cheaper than a CSS var per frame)
  gsap.set(dim, { opacity: 0.12 });
  gsap.set(halo, { opacity: 0.2 });
  gsap.set(shine, { opacity: 0.35, transformOrigin: "50% 50%" });
  gsap.set(top, { opacity: 0, scale: 0.9, transformOrigin: "50% 40%" });
  gsap.set(letters, { opacity: 0, yPercent: -40 });
  gsap.set(swoosh, { opacity: 1, clipPath: "inset(80% 0% 0% 100%)" });

  // 1. blink while loading: the white shine on the dome flickers on and off, the dome glows with it
  const blink = gsap
    .timeline({ repeat: -1, repeatDelay: 0.15 })
    .to(shine, { opacity: 1, scale: 1.12, duration: 0.28, ease: "power2.out" })
    .to(dim, { opacity: 0, duration: 0.28, ease: "power2.out" }, "<")
    .to(halo, { opacity: 0.6, duration: 0.28, ease: "power2.out" }, "<")
    .to(shine, { opacity: 0.35, scale: 1, duration: 0.45, ease: "power2.in" })
    .to(dim, { opacity: 0.12, duration: 0.45, ease: "power2.in" }, "<")
    .to(halo, { opacity: 0.2, duration: 0.45, ease: "power2.in" }, "<");

  // ready = logo image + fonts + a short beat (so the blink is seen), capped; a tap skips ahead
  let skip: () => void = () => {};
  const skipped = new Promise<void>((r) => (skip = r));
  wrap.addEventListener("click", () => skip(), { once: true });
  const img = logo.querySelector<HTMLImageElement>(".piece-top")!;
  const ready = Promise.all([
    waitForImage(img),
    document.fonts?.ready ?? Promise.resolve(),
    new Promise((r) => setTimeout(r, 1900)),
  ]);
  const capWait = new Promise((r) => setTimeout(r, 3800));

  Promise.race([ready, capWait, skipped]).then(() => {
    blink.kill();
    hero.classList.add("intro-playing");
    window.scrollTo(0, 0);

    // where to land: the buzzer's spot on the logo
    const from = buzzer.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const s = to.width / from.width;

    const tl = gsap.timeline({ onComplete: finish });
    // 2. the press: a short wind-up, the dome is pushed all the way down and held, then it pops back
    tl.to(shine, { opacity: 0.35, scale: 1, duration: 0.15 })
      .to(dim, { opacity: 0, duration: 0.15 }, "<")
      .to(halo, { opacity: 0.3, duration: 0.15 }, "<")
      .to(wrap, { scale: 1.05, duration: 0.18, ease: "power2.out" }, "<")
      .to(cap, { scaleY: 0.5, y: 14, duration: 0.11, ease: "power3.in" })
      .to(wrap, { scaleX: 1.04, scaleY: 0.95, duration: 0.11, ease: "power3.in" }, "<")
      .to(dim, { opacity: 0.3, duration: 0.11 }, "<")
      .to({}, { duration: 0.18 }) // hold it down, so the press reads
      .to(cap, { scaleY: 1, y: 0, duration: 0.55, ease: "elastic.out(1.2, 0.4)" })
      .to(wrap, { scale: 1, duration: 0.3, ease: "back.out(2)" }, "<")
      .to(dim, { opacity: 0, duration: 0.1 }, "<")
      .to(halo, { opacity: 1, duration: 0.12 }, "<")
      .fromTo(shine, { opacity: 1, scale: 1.3 }, { scale: 1, duration: 0.4, ease: "power2.out" }, "<")
      .to(rays, { scale: 1.15, opacity: 1, duration: 0.4, ease: "back.out(3)", stagger: 0.04 }, "<")
      // the stage opens
      .to(bg, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, "<0.35")
      .to(burst, { opacity: 1, duration: 0.6 }, "<")
      // 3. the buzzer shrinks and flies into the logo
      .to(rays, { opacity: 0, scale: 0.6, duration: 0.3 }, "<0.1")
      .to(wrap, { x: dx, y: dy, scale: s, duration: 0.7, ease: "power3.inOut" }, "<")
      .to(top, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, ">-0.15")
      .to(wrap, { opacity: 0, duration: 0.2 }, "<0.1")
      .set(pre, { pointerEvents: "none" }, "<")
      // the logo assembles around it: letters right to left (ט first), then the swoosh
      .to(letters, { opacity: 1, yPercent: 0, duration: 0.6, ease: "bounce.out", stagger: 0.08 }, "<-0.1")
      .to(swoosh, { clipPath: "inset(80% 0% 0% 0%)", duration: 0.5, ease: "power2.inOut" }, "<0.3")
      .add(animateWords(title), "<0.1")
      .fromTo(fades, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "<0.35");
  });
}
