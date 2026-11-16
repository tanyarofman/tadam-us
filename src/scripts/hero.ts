/**
 * Scene 0: loading screen + hero.
 * 1. The logo sits alone in the middle of the screen and pulses while the site loads.
 * 2. When ready (or the visitor taps it) the stage opens and the logo flies up into its place in the hero.
 * 3. The headline and the rest of the hero come in.
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
  const name = pre.querySelector<HTMLElement>("[data-pre-logo]")!;
  const pieces = logo.querySelectorAll<HTMLElement>(".logo-piece");

  // the hero logo stays hidden until the loading-screen logo has landed on it
  gsap.set(pieces, { opacity: 0 });

  // 1. while loading: the logo pulses softly in the middle of the screen
  const pulse = gsap
    .timeline({ repeat: -1, yoyo: true })
    .fromTo(name, { opacity: 0.7, scale: 0.97 }, { opacity: 1, scale: 1.03, duration: 0.8, ease: "sine.inOut" });

  // ready = logo image + fonts + a short beat (so the logo is seen), capped; a tap skips ahead
  let skip: () => void = () => {};
  const skipped = new Promise<void>((r) => (skip = r));
  name.addEventListener("click", () => skip(), { once: true });
  const img = logo.querySelector<HTMLImageElement>(".piece-top")!;
  const ready = Promise.all([
    waitForImage(img),
    document.fonts?.ready ?? Promise.resolve(),
    new Promise((r) => setTimeout(r, 1600)),
  ]);
  const capWait = new Promise((r) => setTimeout(r, 3800));

  Promise.race([ready, capWait, skipped]).then(() => {
    pulse.kill();
    hero.classList.add("intro-playing");
    window.scrollTo(0, 0);
    gsap.set(name, { scale: 1, opacity: 1 });

    // where to land: the logo's spot in the hero
    const from = name.getBoundingClientRect();
    const to = logo.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const s = to.width / from.width;

    const tl = gsap.timeline({ onComplete: finish });
    // 2. the stage opens and the logo flies into place
    tl.to(bg, { opacity: 0, duration: 0.6, ease: "power2.inOut" })
      .to(burst, { opacity: 1, duration: 0.6 }, "<")
      .to(name, { x: dx, y: dy, scale: s, duration: 0.8, ease: "power3.inOut" }, "<0.1")
      .set(pieces, { opacity: 1 })
      .set(name, { opacity: 0 })
      .set(pre, { pointerEvents: "none" })
      // 3. the headline and the rest come in
      .add(animateWords(title), "<")
      .fromTo(fades, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "<0.2");
  });
}
