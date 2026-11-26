import { gsap } from "../lib/scroll";
import { mobileSceneQuery, sceneScroll } from "./scene-scroll";
import { init as initHold } from "./section-holds";
import { registerSectionReveal } from "./section-navigation";

/** On phones, each review gets the same stage before the next one replaces it. */
export function init({ reduced }: { reduced: boolean }) {
  if (reduced) return;
  const section = document.getElementById("testimonials");
  const pin = section?.querySelector<HTMLElement>(".testimonials-pin");
  const cards = section?.querySelectorAll<HTMLElement>(".testimonial");
  if (!section || !pin || !cards?.length) return;

  const mm = gsap.matchMedia();
  // Direct section links retain the complete reading layout, like How it works.
  registerSectionReveal(section.id, () => mm.revert());
  mm.add({ mobile: mobileSceneQuery, all: "all" }, (context) => {
    if (!context.conditions?.mobile) return initHold(section.id, { reduced });

    section.classList.add("is-replacing");
    gsap.set(cards, { autoAlpha: 0, rotateY: 70, y: 0, scale: 1, transformPerspective: 1400 });
    gsap.set(cards[0], { autoAlpha: 1, rotateY: 0 });

    const timeline = gsap.timeline({
      scrollTrigger: sceneScroll(section, pin, true, 2.6, 0.18),
    });
    cards.forEach((card, index) => {
      if (index > 0) {
        timeline
          .to(cards[index - 1], { autoAlpha: 0, scale: 0.9, y: -20, duration: 0.35, ease: "power1.in" })
          .to(card, { autoAlpha: 1, rotateY: 0, duration: 0.6, ease: "back.out(1.2)" }, "<0.15");
      }
      // A reading pause for every quote, including the last one before release.
      timeline.to({}, { duration: 1.2 });
    });

    return () => {
      section.classList.remove("is-replacing");
      // Leave the CSS reading layout in charge after a resize or section jump.
      cards.forEach((card) => {
        for (const property of ["opacity", "visibility", "transform"]) card.style.removeProperty(property);
      });
    };
  });
}
