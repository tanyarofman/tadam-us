/**
 * Scene 0: loading screen + hero.
 * 1. The name "טדאם" sits alone in the middle of the screen and pulses while the site loads.
 * 2. When ready (or the visitor taps it) it fades out and the stage opens.
 * 3. The logo assembles in the hero: top, letters, swoosh.
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
  const name = pre.querySelector<HTMLElement>("[data-pre-name]")!;

  gsap.set(top, { opacity: 0, scale: 0.9, transformOrigin: "50% 40%" });
  gsap.set(letters, { opacity: 0, yPercent: -40 });
  gsap.set(swoosh, { opacity: 1, clipPath: "inset(80% 0% 0% 100%)" });

  // 1. while loading: the name pulses softly in the middle of the screen
  const pulse = gsap
    .timeline({ repeat: -1, yoyo: true })
    .fromTo(name, { opacity: 0.55, scale: 0.97 }, { opacity: 1, scale: 1.03, duration: 0.8, ease: "sine.inOut" });

  // ready = logo image + fonts + a short beat (so the name is seen), capped; a tap skips ahead
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

    const tl = gsap.timeline({ onComplete: finish });
    // 2. the name lifts away and the stage opens
    tl.to(name, { opacity: 0, scale: 1.12, duration: 0.35, ease: "power2.in" })
      .to(bg, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, "<0.15")
      .to(burst, { opacity: 1, duration: 0.6 }, "<")
      .set(pre, { pointerEvents: "none" }, "<")
      // 3. the logo assembles: the top, letters right to left (ט first), then the swoosh
      .to(top, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, "<0.1")
      .to(letters, { opacity: 1, yPercent: 0, duration: 0.6, ease: "bounce.out", stagger: 0.08 }, "<0.1")
      .to(swoosh, { clipPath: "inset(80% 0% 0% 0%)", duration: 0.5, ease: "power2.inOut" }, "<0.3")
      .add(animateWords(title), "<0.1")
      .fromTo(fades, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, "<0.35");
  });
}
