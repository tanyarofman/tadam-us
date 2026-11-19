/**
 * Scene 4: the "making-of". Pinned and scroll-driven so there is time to read:
 * the cards arrive one at a time (desktop: they build up in a row; phones: each takes the stage),
 * each plays its little animation.
 */
import { gsap } from "../../lib/scroll";
import { animateWords } from "../motion";
import { mobileSceneQuery, sceneScroll } from "../scene-scroll";

export function init({ reduced }: { reduced: boolean }) {
  const s = document.querySelector<HTMLElement>("[data-scene='4']");
  if (!s) return;
  const cards = Array.from(s.querySelectorAll<HTMLElement>(".step-card"));
  const title = s.querySelector(".s4-title");
  const choices = s.querySelectorAll<HTMLElement>(".host-option, .atmosphere-swatch");
  const tiles = s.querySelectorAll<HTMLElement>(".board-tile");
  const bubbles = s.querySelectorAll<HTMLElement>(".chat-bubble");

  if (reduced) {
    cards.forEach((c) => c.classList.add("reveal"));
    return;
  }

  s.classList.add("is-pinned");

  const mm = gsap.matchMedia();
  mm.add({ mobile: mobileSceneQuery, phone: "(max-width: 899px), (orientation: landscape) and (max-height: 500px)", wide: "(min-width: 900px) and (min-height: 501px)" }, (ctx) => {
    const phone = !!ctx.conditions?.phone;
    const mobile = !!ctx.conditions?.mobile;

    gsap.set(title!.querySelectorAll(".word-in"), { opacity: 0, yPercent: 110 });
    gsap.set(cards, { rotateY: -80, opacity: 0, transformPerspective: 1400 });
    gsap.set(bubbles, { opacity: 0, y: 20, scale: 0.9 });
    gsap.set(tiles, { opacity: 0 });
    gsap.set(choices, { y: 16, scale: 0.85, autoAlpha: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: sceneScroll(s, s.querySelector<HTMLElement>(".s4-pin")!, mobile, mobile ? 2.6 : phone ? 3.6 : 3, mobile ? 0.18 : 0.6),
    });

    if (mobile) {
      animateWords(title, { duration: 0.4, stagger: 0.05, scrollTrigger: { trigger: s, start: "top 70%", end: "top 20%", scrub: 0.18 } });
    } else tl.add(animateWords(title, { duration: 0.4, stagger: 0.05 }));

    cards.forEach((card, i) => {
      // on phones, the previous card steps back as the next one arrives
      if (phone && i > 0) {
        tl.to(cards[i - 1], { opacity: 0, scale: 0.9, y: -20, duration: 0.35, ease: "power1.in" });
      }
      tl.to(card, { rotateY: 0, opacity: 1, duration: 0.6, ease: "back.out(1.2)" }, phone && i > 0 ? "<0.15" : ">");

      const step = card.dataset.step;
      if (step === "1") {
        tl.to(bubbles, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(2)", stagger: 0.3 });
      }
      if (step === "2") {
        tl.to(choices, { y: 0, scale: 1, autoAlpha: 1, duration: 0.35, stagger: 0.12, ease: "back.out(1.5)" });
      }
      if (step === "3") {
        tiles.forEach((t, j) => {
          const fromX = (j % 2 ? -1 : 1) * (120 + j * 20);
          tl.fromTo(
            t,
            { opacity: 0, x: fromX, y: -160, rotate: (j % 2 ? -1 : 1) * 40, scale: 0.6 },
            { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, duration: 0.4, ease: "back.out(1.6)" },
            j === 0 ? ">" : "<0.1",
          );
        });
      }
      // time to read
      tl.to({}, { duration: 0.6 });
    });

  });
}
