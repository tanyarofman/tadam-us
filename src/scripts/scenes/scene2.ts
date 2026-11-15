/** Scene 2: camera floats over the guests, memories pop up above them. */
import { gsap } from "../../lib/scroll";
import { animateWords } from "../motion";

export function init({ reduced }: { reduced: boolean }) {
  const s = document.querySelector<HTMLElement>("[data-scene='2']");
  if (!s) return;
  const track = s.querySelector<HTMLElement>(".s2-track")!;
  const bubbles = s.querySelectorAll(".bubble");
  const figures = s.querySelectorAll(".s2-figure");
  const title = s.querySelector(".s2-title");

  if (reduced) {
    bubbles.forEach((b) => b.classList.add("reveal"));
    return;
  }

  // RTL: the row overflows to the left, so the camera travels left by moving the row right.
  const overflow = () => Math.max(0, track.scrollWidth - window.innerWidth);

  gsap.set(title!.querySelectorAll(".word-in"), { opacity: 0, yPercent: 110 });
  gsap.set(bubbles, { scale: 0, opacity: 0, rotate: -6 });

  const PAN_START = 0.4;
  const PAN_DUR = 1.6;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: s,
      start: "top top",
      end: () => "+=" + Math.max(window.innerHeight * 1.6, overflow() * 1.4),
      pin: s.querySelector(".scene-pin"),
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });
  tl.add(animateWords(title, { duration: 0.3, stagger: 0.04 }), 0)
    .fromTo(figures, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.3 }, 0)
    .fromTo(track, { x: 0 }, { x: () => overflow(), ease: "none", duration: PAN_DUR }, PAN_START);

  // When the row is wider than the screen (mobile), pop each bubble when the camera has brought its
  // guest on screen, instead of on a fixed beat (which showed bubbles while their guest was still off-edge).
  const ov = overflow();
  bubbles.forEach((b, i) => {
    let at = 0.45 + i * 0.45;
    if (ov > 0) {
      const guest = b.closest<HTMLElement>(".s2-guest")!;
      const r = guest.getBoundingClientRect();
      const neededX = Math.min(ov, Math.max(0, window.innerWidth / 2 - (r.left + r.width / 2)));
      at = Math.max(0.1, PAN_START + (PAN_DUR * neededX) / ov - 0.15);
    }
    tl.to(b, { scale: 1, opacity: 1, rotate: 0, duration: 0.25, ease: "back.out(2.5)" }, at);
  });
}
