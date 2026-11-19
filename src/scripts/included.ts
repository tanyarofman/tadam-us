import { gsap } from "../lib/scroll";
import { init as initHold } from "./section-holds";
import { mobileSceneQuery, sceneScroll } from "./scene-scroll";

/** On phones, read two benefits at a time; scrolling backwards restores the previous pair. */
export function init({ reduced }: { reduced: boolean }) {
  const section = document.getElementById("pricing");
  const cards = section ? Array.from(section.querySelectorAll<HTMLElement>(".inc")) : [];
  if (!section || cards.length !== 6 || reduced) {
    initHold("pricing", { reduced });
    return;
  }
  gsap.matchMedia().add({ mobile: mobileSceneQuery, desktop: "(min-width: 768px) and (min-height: 501px)" }, (ctx) => {
    if (!ctx.conditions?.mobile) {
      return initHold("pricing", { reduced });
    }
    const inner = section.querySelector<HTMLElement>(".pricing-inner")!;
    const reveals = Array.from(inner.querySelectorAll<HTMLElement>(".reveal"));
    reveals.forEach((el) => el.classList.remove("reveal"));
    gsap.set(inner, { autoAlpha: 0 });
    gsap.set(cards, { autoAlpha: 0, y: 24 });
    const pairs = [cards.slice(0, 2), cards.slice(2, 4), cards.slice(4, 6)];
    const tl = gsap.timeline({
      scrollTrigger: sceneScroll(section, section.querySelector<HTMLElement>(".pricing-pin")!, true, 1.8, 0.18),
    });
    tl.to(inner, { autoAlpha: 1, duration: 0.2 })
      .to(pairs[0], { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.06 }, "<")
      .to({}, { duration: 0.7 });
    pairs.slice(1).forEach((pair, i) => {
      tl.to(pairs[i], { autoAlpha: 0, y: -24, duration: 0.25 })
        .to(pair, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.06 })
        .to({}, { duration: 0.7 });
    });
    return () => reveals.forEach((el) => el.classList.add("reveal", "is-visible"));
  });
}
