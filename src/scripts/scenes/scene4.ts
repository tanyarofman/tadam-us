/** Scene 4: three "making-of" cards flip in, each with its own little animation. */
import { gsap, ScrollTrigger } from "../../lib/scroll";
import { animateWords } from "../motion";

export function init({ reduced }: { reduced: boolean }) {
  const s = document.querySelector<HTMLElement>("[data-scene='4']");
  if (!s) return;
  const cards = s.querySelectorAll<HTMLElement>(".step-card");
  const title = s.querySelector(".s4-title");
  const rows = s.querySelectorAll<HTMLElement>(".approve-row");
  const tiles = s.querySelectorAll<HTMLElement>(".board-tile");
  const pings = s.querySelectorAll<HTMLElement>(".ping");
  const bubble = s.querySelector<HTMLElement>(".chat-bubble");

  const finalStates = () => {
    rows[0]?.classList.add("is-yes");
    rows[1]?.classList.add("is-yes");
  };

  if (reduced) {
    cards.forEach((c) => c.classList.add("reveal"));
    finalStates();
    return;
  }

  gsap.set(title!.querySelectorAll(".word-in"), { opacity: 0, yPercent: 110 });
  ScrollTrigger.create({ trigger: title, start: "top 85%", once: true, onEnter: () => animateWords(title) });

  gsap.set(cards, { rotateY: -80, opacity: 0, transformPerspective: 1400 });
  gsap.set(tiles, { opacity: 0 });
  gsap.set(bubble, { opacity: 0, y: 20, scale: 0.9 });
  gsap.set(pings, { scale: 0 });

  ScrollTrigger.batch(cards, {
    start: "top 82%",
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, {
        rotateY: 0,
        opacity: 1,
        duration: 1,
        ease: "back.out(1.4)",
        stagger: 0.18,
        onComplete: undefined,
      });
      batch.forEach((card, i) => playCard(card as HTMLElement, 0.5 + i * 0.18));
    },
  });

  function playCard(card: HTMLElement, delay: number) {
    const step = card.dataset.step;
    if (step === "1") {
      gsap.timeline({ delay })
        .to(bubble, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(2)" })
        .to(pings, { scale: 1, duration: 0.4, ease: "back.out(3)", stagger: 0.2 })
        .to(pings, { scale: 1.25, yoyo: true, repeat: 3, duration: 0.3 });
    }
    if (step === "2") {
      const tl = gsap.timeline({ delay: delay + 0.3 });
      tl.call(() => rows[0]?.classList.add("is-yes"))
        .call(() => rows[1]?.classList.add("is-yes"), [], "+=0.6")
        .call(() => rows[2]?.classList.add("is-yes"), [], "+=0.6");
    }
    if (step === "3") {
      tiles.forEach((t, i) => {
        const fromX = (i % 2 ? -1 : 1) * (120 + i * 20);
        gsap.fromTo(
          t,
          { opacity: 0, x: fromX, y: -160, rotate: (i % 2 ? -1 : 1) * 40, scale: 0.6 },
          { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, duration: 0.7, ease: "back.out(1.6)", delay: delay + 0.3 + i * 0.12 },
        );
      });
    }
  }
}
