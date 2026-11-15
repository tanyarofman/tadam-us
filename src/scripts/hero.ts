/**
 * Scene 0: preloader + hero.
 * The buzzer lights up with real loading progress (logo image + fonts),
 * then presses itself, the rays burst, and the logo assembles around it.
 */
import { gsap, prefersReducedMotion } from "../lib/scroll";
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
  if (!hero) return;
  const logo = hero.querySelector<HTMLElement>("[data-logo]")!;
  const buzzerWrap = logo.querySelector<HTMLElement>(".logo-buzzer")!;
  const buzzer = buzzerWrap.querySelector<SVGSVGElement>("svg")!;
  const cap = buzzer.querySelector(".buzzer-cap");
  const rays = buzzer.querySelectorAll(".ray-set");
  const top = logo.querySelector(".piece-top");
  const letters = logo.querySelectorAll(".piece-letter");
  const swoosh = logo.querySelector<HTMLElement>(".piece-swoosh");
  const title = hero.querySelector(".hero-title");
  const fades = hero.querySelectorAll("[data-hero-fade]");
  const burst = hero.querySelector(".hero-burst");

  const finish = () => {
    hero.classList.remove("intro-pending", "intro-playing");
    gsap.set(buzzerWrap, { opacity: 0 });
    onDone?.();
  };

  if (prefersReducedMotion()) {
    gsap.set(buzzerWrap, { opacity: 0 });
    hero.classList.remove("intro-pending");
    gsap.from(hero.querySelectorAll(".logo-full, .hero-title .word-in, [data-hero-fade]"), {
      opacity: 0,
      duration: 0.6,
    });
    onDone?.();
    return;
  }

  // ---- Preloader: buzzer glows with progress ----
  gsap.set(rays, { scale: 0, opacity: 0 });
  gsap.set(buzzer, { "--glow": 0 });
  gsap.set(buzzerWrap, { scale: 1.6, transformOrigin: "50% 60%" });
  gsap.set(top, { opacity: 0, scale: 0.85, transformOrigin: "50% 40%" });
  gsap.set(letters, { opacity: 0, yPercent: -40 });
  gsap.set(swoosh, { opacity: 1, clipPath: "inset(80% 0% 0% 100%)" });

  const progress = { v: 0 };
  const setGlow = () => gsap.set(buzzer, { "--glow": progress.v });
  const glowTo = (v: number, d = 0.5) =>
    gsap.to(progress, { v, duration: d, ease: "power1.out", onUpdate: setGlow });

  // Breathing while loading
  const breathe = gsap.to(buzzerWrap, { scale: 1.52, yoyo: true, repeat: -1, duration: 0.7, ease: "sine.inOut" });

  const img = logo.querySelector<HTMLImageElement>(".piece-top")!;
  const tasks = [
    waitForImage(img).then(() => glowTo(Math.max(progress.v, 0.55))),
    (document.fonts?.ready ?? Promise.resolve()).then(() => glowTo(Math.max(progress.v, 0.8))),
    new Promise((r) => setTimeout(r, 400)),
  ];
  const timeout = new Promise((r) => setTimeout(r, 2500));
  glowTo(0.3, 0.6);

  Promise.race([Promise.all(tasks), timeout]).then(() => {
    breathe.kill();
    hero.classList.add("intro-playing");
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(progress, { v: 1, duration: 0.25, onUpdate: setGlow })
      .to(buzzerWrap, { scale: 1.6, duration: 0.2, ease: "power2.out" }, "<")
      // the press
      .to(cap, { scaleY: 0.72, y: 6, duration: 0.09, ease: "power2.in" })
      .to(cap, { scaleY: 1, y: 0, duration: 0.45, ease: "elastic.out(1.2, 0.4)" })
      .to(rays, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(3)", stagger: 0.05 }, "<")
      .to(burst, { opacity: 1, duration: 0.6 }, "<")
      // buzzer settles into its place on the logo
      .to(buzzerWrap, { scale: 1, duration: 0.55, ease: "back.out(1.6)" }, "<0.1")
      .to(top, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, "<0.25")
      .to(buzzerWrap, { opacity: 0, duration: 0.3 }, "<0.15")
      // letters drop in, right to left (ט first)
      .to(
        letters,
        { opacity: 1, yPercent: 0, duration: 0.6, ease: "bounce.out", stagger: 0.09 },
        "<-0.05",
      )
      // swoosh draws in, right to left
      .to(swoosh, { clipPath: "inset(80% 0% 0% 0%)", duration: 0.55, ease: "power2.inOut" }, "<0.3")
      .add(animateWords(title), "<0.15")
      .fromTo(
        fades,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "<0.35",
      );
  });
}
