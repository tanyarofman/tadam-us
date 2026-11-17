/**
 * Scene 4: the "making-of". Pinned and scroll-driven so there is time to read:
 * the cards arrive one at a time (desktop: they build up in a row; phones: each takes the stage),
 * each plays its little animation, then the privacy sentence slides in on one line.
 */
import { gsap } from "../../lib/scroll";
import { animateWords } from "../motion";

export function init({ reduced }: { reduced: boolean }) {
  const s = document.querySelector<HTMLElement>("[data-scene='4']");
  if (!s) return;
  const cards = Array.from(s.querySelectorAll<HTMLElement>(".step-card"));
  const title = s.querySelector(".s4-title");
  const rows = Array.from(s.querySelectorAll<HTMLElement>(".approve-row"));
  const tiles = s.querySelectorAll<HTMLElement>(".board-tile");
  const bubbles = s.querySelectorAll<HTMLElement>(".chat-bubble");
  const privacy = s.querySelector<HTMLElement>(".privacy-strip")!;

  if (reduced) {
    cards.forEach((c) => c.classList.add("reveal"));
    rows.forEach((r) => r.classList.add("is-yes"));
    return;
  }

  privacy.classList.remove("reveal");
  s.classList.add("is-pinned");

  const mm = gsap.matchMedia();
  mm.add({ phone: "(max-width: 899px)", wide: "(min-width: 900px)" }, (ctx) => {
    const phone = !!ctx.conditions?.phone;

    gsap.set(title!.querySelectorAll(".word-in"), { opacity: 0, yPercent: 110 });
    gsap.set(cards, { rotateY: -80, opacity: 0, transformPerspective: 1400 });
    gsap.set(bubbles, { opacity: 0, y: 20, scale: 0.9 });
    gsap.set(tiles, { opacity: 0 });
    gsap.set(privacy, { clipPath: "inset(0% 0% 0% 100%)", opacity: 0 });
    rows.forEach((r) => r.classList.remove("is-yes"));

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: s,
        start: "top top",
        end: () => "+=" + window.innerHeight * (phone ? 4.2 : 3.6),
        pin: s.querySelector(".s4-pin"),
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
    const fwd = () => tl.scrollTrigger?.direction !== -1;

    tl.add(animateWords(title, { duration: 0.4, stagger: 0.05 }));

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
        rows.forEach((r) => {
          tl.call(() => r.classList.toggle("is-yes", fwd()));
          tl.to({}, { duration: 0.3 });
        });
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

    // the privacy promise: one sentence, sliding in along its line (right to left)
    tl.to(privacy, { opacity: 1, duration: 0.15 })
      .to(privacy, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "power1.inOut" }, "<")
      .to({}, { duration: 0.8 });

    return () => rows.forEach((r) => r.classList.remove("is-yes"));
  });
}
