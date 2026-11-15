/** Scene 7: final CTA. The big buzzer idles, the headline bounces in. */
import { gsap, ScrollTrigger } from "../../lib/scroll";
import { animateWords } from "../motion";

export function init({ reduced }: { reduced: boolean }) {
  const s = document.querySelector<HTMLElement>("[data-scene='7']");
  if (!s) return;
  const title = s.querySelector(".s7-title");
  const buzzer = s.querySelector(".big-buzzer");
  const rays = s.querySelectorAll(".big-buzzer .ray-set");
  if (reduced) return;

  gsap.set(title!.querySelectorAll(".word-in"), { opacity: 0, yPercent: 110 });
  gsap.set(buzzer, { scale: 0.6, opacity: 0 });
  gsap.set(rays, { scale: 0 });

  ScrollTrigger.create({
    trigger: s,
    start: "top 65%",
    once: true,
    onEnter: () => {
      gsap.timeline()
        .to(buzzer, { scale: 1, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" })
        .to(rays, { scale: 1, duration: 0.5, ease: "back.out(3)", stagger: 0.06 }, "<0.2")
        .add(animateWords(title), "<0.1")
        .to(rays, { scale: 1.12, duration: 0.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
    },
  });
}
