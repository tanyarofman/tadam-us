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
    return;
  }

  const q = <T extends Element = HTMLElement>(sel: string) => s.querySelector<T>(sel)!;
  const split = q(".s5-split");
  const fills = s.querySelectorAll<HTMLElement>(".bs-fill");
  const pcts = s.querySelectorAll<HTMLElement>(".bs-pct-n");
  const count = q(".bs-count-n");
  const timer = q(".bs-timer-n");
  const finger = q(".finger");
  const picked = q(".phone-btn[data-i='1']");
  const sent = q(".phone-sent");
  const title = q(".s5-title");

  // Percent of the room on each answer at each stage: start, others answer, our tap lands, final.
  // Bars and numbers show these values directly, so they grow together.
  const stages = [
    [0, 0, 0, 0],
    [9, 21, 5, 11],
    [12, 40, 8, 16],
    [14, 58, 9, 19],
  ];
  const state = { a: 0, b: 0, c: 0, d: 0, n: 5, t: 15, crowd: 0 };
  const render = () => {
    [state.a, state.b, state.c, state.d].forEach((v, i) => {
      fills[i].style.width = `${v}%`;
      pcts[i].textContent = String(Math.round(v));
    });
    count.textContent = String(Math.round(state.n));
    timer.textContent = String(Math.max(0, Math.round(state.t)));
    crowd.draw(state.crowd);
  };
  const toStage = (i: number) => ({ a: stages[i][0], b: stages[i][1], c: stages[i][2], d: stages[i][3] });

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
    // live answers start coming in
    .to(state, { ...toStage(1), n: 48, t: 9, duration: 2, onUpdate: render })
    // the finger taps
    .fromTo(finger, { opacity: 0, x: 40, y: 60 }, { opacity: 1, x: 0, y: 0, duration: 0.4, ease: "power2.out" }, "<1.2")
    .to(finger, { scale: 0.85, duration: 0.1 })
    .to(picked, { scale: 0.92, y: 4, duration: 0.1 }, "<")
    .call(() => picked.classList.add("is-picked"))
    .to(finger, { scale: 1, duration: 0.1 })
    .to(picked, { scale: 1, y: 0, duration: 0.1 }, "<")
    .fromTo(sent, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(3)" })
    .to(finger, { opacity: 0, y: 40, duration: 0.25 }, "<")
    // our bar grows
    .to(state, { ...toStage(2), n: 132, t: 4, duration: 1.4, onUpdate: render })
    .to(state, { ...toStage(3), n: 214, t: 0, duration: 1.2, onUpdate: render })
    .to({}, { duration: 0.6 })
    // camera pulls back: the whole hall lights up
    .to(split, { scale: isMobile() ? 0.5 : 0.42, y: "-12%", opacity: 0, duration: 1, ease: "power2.in" })
    .to(state, { crowd: 1, duration: 1.4, onUpdate: render }, "<0.2")
    .add(animateWords(title, { duration: 0.35, stagger: 0.05 }), "<0.5")
    .to({}, { duration: 0.4 });

  // reset the tap if the user scrolls back up
  tl.eventCallback("onUpdate", () => {
    if (tl.progress() < 0.4) picked.classList.remove("is-picked");
  });
}
