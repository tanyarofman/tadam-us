/**
 * Scene 3 (WOW #1, scroll-scrubbed): lights down, the screen flickers on,
 * the buzzer gets pressed by the scroll, "טדאם!" bursts, then the host slot lights up
 * and generic silhouettes cycle through it by type.
 */
import { gsap } from "../../lib/scroll";
import { isMobile } from "../motion";

export function init({ reduced }: { reduced: boolean }) {
  const s = document.querySelector<HTMLElement>("[data-scene='3']");
  if (!s) return;
  if (reduced) return;

  document.documentElement.classList.add("s3-animated");
  const q = <T extends Element = HTMLElement>(sel: string) => s.querySelector<T>(sel)!;
  const qa = (sel: string) => s.querySelectorAll(sel);

  const slot = q(".host-slot");
  slot.classList.add("anim");

  const dark = q(".s3-dark");
  const screen = q(".s3-screen");
  const burst = q(".s3-burst");
  const rays = q(".s3-rays");
  const buzzerWrap = q(".s3-buzzer");
  const cap = q(".s3-buzzer .buzzer-cap");
  const buzzerRays = qa(".s3-buzzer .ray-set");
  const tadam = q(".s3-tadam");
  const host = q(".s3-host");
  const spot = q(".host-spot");
  const mic = q(".host-mic");
  const line1 = q(".s3-line-1");
  const line2 = q(".s3-line-2");
  const hostQ = q(".host-q");
  const silQ = q(".sil-q");
  const types = ["singer", "athlete", "character", "influencer"];

  gsap.set(dark, { opacity: 0.15 });
  gsap.set(screen, { filter: "brightness(0.15) saturate(0)" });
  gsap.set(burst, { opacity: 0 });
  gsap.set(buzzerWrap, { scale: 0, opacity: 0 });
  gsap.set(buzzerRays, { scale: 0, opacity: 0 });
  gsap.set(tadam, { scale: 0.2, opacity: 0, rotate: -8 });
  gsap.set(rays, { scale: 0.4, opacity: 0 });
  gsap.set(host, { opacity: 0 });
  gsap.set([spot, mic], { opacity: 0 });
  gsap.set(line1, { opacity: 0, y: 20 });
  gsap.set(line2, { opacity: 0, y: 20 });
  gsap.set(hostQ, { x: 0, y: 0, xPercent: -50, yPercent: -62 });

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: s,
      start: "top top",
      end: () => "+=" + window.innerHeight * (isMobile() ? 3.6 : 4),
      pin: s.querySelector(".scene-pin"),
      scrub: 0.7,
      invalidateOnRefresh: true,
    },
  });

  // 1. lights go down
  tl.to(dark, { opacity: 0.85, duration: 0.8 })
    .to(line1, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.2)
    // 2. the screen flickers on
    .to(screen, { filter: "brightness(0.7) saturate(0.6)", duration: 0.08 }, 0.8)
    .to(screen, { filter: "brightness(0.2) saturate(0)", duration: 0.06 })
    .to(screen, { filter: "brightness(1) saturate(1)", duration: 0.08 })
    .to(screen, { filter: "brightness(0.4) saturate(0.5)", duration: 0.05 })
    .to(screen, { filter: "brightness(1) saturate(1)", duration: 0.12 })
    // 3. buzzer appears
    .to(burst, { opacity: 1, duration: 0.2 }, "<")
    .to(buzzerWrap, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" })
    // 4. pressed by the scroll
    .to(cap, { scaleY: 0.7, y: 6, duration: 0.25, ease: "power2.in" })
    .to(cap, { scaleY: 1, y: 0, duration: 0.2, ease: "back.out(3)" })
    .to(buzzerRays, { scale: 1.2, opacity: 1, duration: 0.3, ease: "back.out(3)", stagger: 0.04 }, "<")
    .to(rays, { scale: 1.2, opacity: 0.5, rotate: 30, duration: 0.6 }, "<")
    .to(tadam, { scale: 1, opacity: 1, rotate: -3, duration: 0.35, ease: "back.out(2.5)" }, "<0.05")
    .to(buzzerWrap, { y: "-30%", scale: 0.8, duration: 0.35 }, "<")
    .to({}, { duration: 0.5 })
    // 5. clear for the host
    .to(burst, { opacity: 0, scale: 1.2, duration: 0.35 })
    .to(line1, { opacity: 0, y: -20, duration: 0.3 }, "<")
    .to(host, { opacity: 1, duration: 0.1 }, "<0.15")
    .to(spot, { opacity: 1, duration: 0.3 })
    .from(spot, { scaleX: 0.2, transformOrigin: "50% 0%", duration: 0.3 }, "<")
    .to(mic, { opacity: 1, duration: 0.25 }, "<0.1")
    .to(line2, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, "<");

  // 6. silhouettes cycle through the slot, each with its type label
  types.forEach((t, i) => {
    const sil = q(`.sil[data-type='${t}']`);
    const label = q(`.host-label[data-type='${t}']`);
    const at = i === 0 ? ">0.1" : ">-0.1";
    tl.fromTo(sil, { opacity: 0, y: 30, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out", transformOrigin: "50% 100%" }, at)
      .fromTo(label, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.2 }, "<");
    if (i === 0) tl.to(mic, { opacity: 0, duration: 0.15 }, "<");
    tl.to({}, { duration: 0.35 })
      .to(sil, { opacity: 0, y: -10, duration: 0.2 })
      .to(label, { opacity: 0, duration: 0.15 }, "<");
  });

  // 7. the mystery: who will it be?
  tl.to(silQ, { opacity: 1, duration: 0.25 })
    .fromTo(hostQ, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(3)" }, "<")
    .to({}, { duration: 0.4 });
}
