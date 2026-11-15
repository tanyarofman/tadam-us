/**
 * Scene 5 (WOW #2, scroll-scrubbed): big screen + phone. A finger taps an answer,
 * the bar grows, then the camera pulls back and hundreds of phones light up across the hall.
 */
import { gsap } from "../../lib/scroll";
import { animateWords, isMobile, seeded } from "../motion";

const COLORS = ["#E74138", "#F7D94A", "#64D8F7", "#E836A1"];

type Phone = { x: number; y: number; s: number; c: number; t: number };

function makeCrowd(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  const rand = seeded(42);
  let phones: Phone[] = [];
  let w = 0;
  let h = 0;
  let progress = 0;
  const sprites = COLORS.map((c) => {
    const sp = document.createElement("canvas");
    sp.width = sp.height = 64;
    const g = sp.getContext("2d")!;
    const grd = g.createRadialGradient(32, 32, 2, 32, 32, 30);
    grd.addColorStop(0, c);
    grd.addColorStop(0.35, c + "88");
    grd.addColorStop(1, c + "00");
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    g.fillStyle = "#fff";
    g.globalAlpha = 0.9;
    g.beginPath();
    g.roundRect(26, 22, 12, 20, 3);
    g.fill();
    return sp;
  });

  function layout() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = isMobile() ? 170 : 340;
    phones = [];
    for (let i = 0; i < n; i++) {
      const depth = Math.pow(rand(), 0.8); // 0 = far (top), 1 = near (bottom)
      phones.push({
        x: rand() * w,
        y: h * (0.3 + depth * 0.72),
        s: 10 + depth * 30,
        c: Math.floor(rand() * 4),
        t: rand() * 0.85,
      });
    }
    phones.sort((a, b) => a.y - b.y);
    draw(progress);
  }

  function draw(p: number) {
    progress = p;
    ctx.clearRect(0, 0, w, h);
    if (p <= 0) return;
    for (const ph of phones) {
      const a = Math.min(1, Math.max(0, (p - ph.t) * 6));
      if (!a) continue;
      ctx.globalAlpha = a;
      const size = ph.s * 2.2;
      ctx.drawImage(sprites[ph.c], ph.x - size / 2, ph.y - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
  }

  layout();
  let raf = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(layout);
  });
  return { draw };
}

export function init({ reduced }: { reduced: boolean }) {
  const s = document.querySelector<HTMLElement>("[data-scene='5']");
  if (!s) return;
  const canvas = s.querySelector<HTMLCanvasElement>(".s5-crowd")!;
  const crowd = makeCrowd(canvas);

  if (reduced) {
    crowd.draw(1);
    canvas.style.opacity = "0.45";
    s.querySelector(".bigscreen")?.classList.add("is-revealed");
    return;
  }

  const q = <T extends Element = HTMLElement>(sel: string) => s.querySelector<T>(sel)!;
  const split = q(".s5-split");
  const screen = q(".bigscreen");
  const answered = q(".bs-answered-n");
  const timer = q(".bs-timer-n");
  const finger = q(".finger");
  const picked = q(".phone-btn[data-i='1']");
  const sent = q(".phone-sent");
  const result = q(".phone-result");
  const title = q(".s5-title");
  q(".s5-pin").classList.add("is-animated");

  // Like the real game: while guests answer, the big screen shows only the options,
  // a countdown and how many have answered. Nothing is revealed until the answer is in.
  const TOTAL = 214;
  const state = { n: 0, t: 15, crowd: 0 };
  const render = () => {
    answered.textContent = String(Math.round(state.n));
    timer.textContent = String(Math.max(0, Math.round(state.t)));
    crowd.draw(state.crowd);
  };
  const setRevealed = (on: boolean) => screen.classList.toggle("is-revealed", on);

  gsap.set(title.querySelectorAll(".word-in"), { opacity: 0, yPercent: 110 });
  render();

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: s,
      start: "top top",
      end: () => "+=" + window.innerHeight * (isMobile() ? 4.4 : 5),
      pin: s.querySelector(".scene-pin"),
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  tl.fromTo(split, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 })
    // answers start coming in (count only)
    .to(state, { n: 61, t: 10, duration: 1.6, onUpdate: render })
    // the finger taps
    .fromTo(finger, { opacity: 0, x: 40, y: 60 }, { opacity: 1, x: 0, y: 0, duration: 0.4, ease: "power2.out" }, "<1")
    .to(finger, { scale: 0.85, duration: 0.1 })
    .to(picked, { scale: 0.92, y: 4, duration: 0.1 }, "<")
    .addLabel("tap")
    .to(finger, { scale: 1, duration: 0.1 })
    .to(picked, { scale: 1, y: 0, duration: 0.1 }, "<")
    .fromTo(sent, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(3)" })
    .to(finger, { opacity: 0, y: 40, duration: 0.25 }, "<")
    // the rest of the room answers
    .to(state, { n: TOTAL, t: 0, duration: 1.6, onUpdate: render })
    // reveal: the right answer lights up on the screen, the phone says if you got it
    .addLabel("reveal")
    .fromTo(q(".bs-a.is-correct"), { scale: 1 }, { scale: 1.05, duration: 0.15, yoyo: true, repeat: 1 })
    .to(sent, { opacity: 0, duration: 0.15 }, "<")
    .fromTo(result, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(3)" }, "<")
    .to({}, { duration: 0.8 })
    // camera pulls back: the whole hall lights up
    .addLabel("pullback")
    .to(split, { scale: isMobile() ? 0.5 : 0.42, y: "-12%", opacity: 0, duration: 1, ease: "power2.in" })
    .to(state, { crowd: 1, duration: 1.4, onUpdate: render }, "<0.2")
    // the headline sits where the screen was, so it waits until the screen is gone
    .add(animateWords(title, { duration: 0.35, stagger: 0.05 }), "pullback+=0.95")
    .to({}, { duration: 0.4 });

  // reset the tap if the user scrolls back up
  // keep the class-based states in sync when scrubbing back and forth
  const tapTime = tl.labels.tap;
  const revealTime = tl.labels.reveal;
  tl.eventCallback("onUpdate", () => {
    const t = tl.time();
    picked.classList.toggle("is-picked", t >= tapTime);
    setRevealed(t >= revealTime);
  });
}
