/** Scene 1: the hall. Slow camera push-in toward the DJ, copy bounces in. */
import { gsap } from "../../lib/scroll";
import { animateWords } from "../motion";

export function init({ reduced }: { reduced: boolean }) {
  const s = document.querySelector<HTMLElement>("[data-scene='1']");
  if (!s) return;
  const art = s.querySelector(".s1-art");
  const title = s.querySelector(".s1-title");
  const kids = s.querySelector(".kids");

  if (reduced) return;

  gsap.set(title!.querySelectorAll(".word-in"), { opacity: 0, yPercent: 110 });
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: s,
      start: "top top",
      end: "+=90%",
      pin: s.querySelector(".scene-pin"),
      scrub: 0.6,
    },
  });
  tl.fromTo(art, { scale: 1.12, y: "4%" }, { scale: 1, y: 0, duration: 1, ease: "none" })
    .add(animateWords(title, { duration: 0.4, stagger: 0.05 }), 0.05)
    .fromTo(kids, { opacity: 0.4 }, { opacity: 1, duration: 0.3 }, 0.5);
}
