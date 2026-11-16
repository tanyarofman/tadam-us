/**
 * Scene 5 (WOW #2, scroll-scrubbed): big screen + phone. A finger taps an answer,
 * the bar grows, then the camera pulls back and hundreds of phones light up across the hall.
 */
import { gsap } from "../../lib/scroll";
import { animateWords, isMobile, seeded } from "../motion";

// Crowd lights use the brand tokens (read at runtime, so a theme change in tokens.css carries over)
const TOKENS = ["--white", "--sun-yellow", "--sky-cyan", "--magenta"];
const readColors = () => {
  const cs = getComputedStyle(document.documentElement);
  const norm = document.createElement("canvas").getContext("2d")!;
  return TOKENS.map((t) => {
    // Normalize any CSS color ("#fff", "#ffffff", "rgb(...)") to "#rrggbb" so "88" / "00" alpha suffixes stay valid
    norm.fillStyle = "#ffffff";
    norm.fillStyle = cs.getPropertyValue(t).trim() || "#ffffff";
    const v = String(norm.fillStyle);
    return /^#[0-9a-f]{6}$/i.test(v) ? v : "#ffffff";
  });
};

type Phone = { x: number; y: number; s: number; c: number; t: number };

function makeCrowd(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  const rand = seeded(42);
  let phones: Phone[] = [];
  let w = 0;
  let h = 0;
  let progress = 0;
  const sprites = readColors().map((c) => {
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
        c: Math.floor(rand() * TOKENS.length),
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
  const phone = s.querySelector<HTMLElement>(".phone")!;
  const screen = s.querySelector<HTMLElement>(".bigscreen")!;

  // Final state: results shown, the answer is yellow-then-green. Used for reduced motion.
  const setReveal = (on: boolean) => {
    phone.classList.toggle("is-picked", on);
    phone.classList.toggle("is-revealed", on);
    screen.classList.toggle("is-revealed", on);
  };
  if (reduced) {
    crowd.draw(1);
    canvas.style.opacity = "0.45";
    setReveal(true);
    return;
  }

  const q = <T extends Element = HTMLElement>(sel: string) => s.querySelector<T>(sel)!;
  const split = q(".s5-split");
  const finger = q(".finger");
  const tapRing = q(".tap-ring");
  const title = q(".s5-title");
  const count = q(".bs-count-n");
  const rings = [q(".bs-ring"), q(".phone-ring")];
  const ringNs = rings.map((r) => r.querySelector<HTMLElement>(".ring-n")!);
  q(".s5-pin").classList.add("is-animated");

  const TOTAL = Number(count.textContent) || 0;
  const SECONDS = Number(ringNs[0].textContent) || 15;
  const state = { n: 0, t: SECONDS, crowd: 0 };
  // Like the real game: while guests answer, only the options + a countdown + who is connected.
  // Results (bars, counts, green) exist only after the reveal.
  const render = () => {
    count.textContent = String(Math.round(state.n));
    const secs = Math.max(0, Math.ceil(state.t));
    rings.forEach((r, i) => {
      r.style.setProperty("--ring", String(Math.max(0, state.t / SECONDS)));
      ringNs[i].textContent = String(secs);
    });
    crowd.draw(state.crowd);
  };

  gsap.set(title.querySelectorAll(".word-in"), { opacity: 0, yPercent: 110 });
  render();

  const mm = gsap.matchMedia();
  mm.add({ mobile: "(max-width: 767px)", desktop: "(min-width: 768px)" }, (ctx) => {
    const mobile = !!ctx.conditions?.mobile;
    const pickedPill = q(".phone .pill.is-picked");
    // put the fingertip (≈ 37% across, 4% down the svg) right on the picked answer
    const placeFinger = () => {
      const pr = phone.getBoundingClientRect();
      const r = pickedPill.getBoundingClientRect();
      const fw = finger.getBoundingClientRect().width || 64;
      const fh = fw * (104 / 80);
      const x = r.left - pr.left + r.width * 0.4;
      const y = r.top - pr.top + r.height * 0.55;
      finger.style.left = `${x - fw * 0.375}px`;
      finger.style.top = `${y - fh * 0.04}px`;
      tapRing.style.left = `${x}px`;
      tapRing.style.top = `${y}px`;
    };
    placeFinger();
    window.addEventListener("resize", placeFinger);

    // mobile: the phone plays first; the big screen card is hidden until the reveal
    if (mobile) gsap.set(screen, { autoAlpha: 0, y: 24 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: s,
        start: "top top",
        end: () => "+=" + window.innerHeight * (mobile ? 4.6 : 5),
        pin: s.querySelector(".scene-pin"),
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(split, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 })
      // guests join and the countdown runs (no results)
      .to(state, { n: Math.round(TOTAL * 0.6), t: SECONDS * 0.6, duration: 1.6, onUpdate: render })
      // the finger taps an answer, it turns yellow
      .fromTo(finger, { opacity: 0, x: 40, y: 60 }, { opacity: 1, x: 0, y: 0, duration: 0.4, ease: "power2.out" }, "<1")
      .to(finger, { scale: 0.85, duration: 0.1 })
      .to(pickedPill, { scale: 0.97, duration: 0.1 }, "<")
      .addLabel("tap")
      .fromTo(tapRing, { opacity: 1, scale: 0.3 }, { opacity: 0, scale: 1.6, duration: 0.35, ease: "power2.out", immediateRender: false }, "tap")
      .to(finger, { scale: 1, duration: 0.1 })
      .to(pickedPill, { scale: 1, duration: 0.1 }, "<")
      .to(finger, { opacity: 0, y: 40, duration: 0.25 })
      // the rest of the room answers, countdown ends
      .to(state, { n: TOTAL, t: 0, duration: 1.4, onUpdate: render })
      // reveal: the green bar fills on the phone and on the big screen
      .addLabel("reveal")
      .to({}, { duration: 1.4 });

    if (mobile) {
      // hand over from the phone to the big-screen card
      tl.to(phone, { autoAlpha: 0, scale: 0.94, y: -20, duration: 0.4 })
        .to(screen, { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.1")
        .to({}, { duration: 1.2 });
    } else {
      tl.to({}, { duration: 0.6 });
    }

    tl
      // camera pulls back: the whole hall lights up
      .addLabel("pullback")
      .to(split, { scale: mobile ? 0.5 : 0.42, y: "-12%", opacity: 0, duration: 1, ease: "power2.in" })
      .to(state, { crowd: 1, duration: 1.4, onUpdate: render }, "<0.2")
      // the headline sits where the screen was, so it waits until the screen is gone
      .add(animateWords(title, { duration: 0.35, stagger: 0.05 }), "pullback+=0.95")
      .to({}, { duration: 0.4 });

    // keep class-based states in sync when scrubbing back and forth
    const tapTime = tl.labels.tap;
    const revealTime = tl.labels.reveal;
    tl.eventCallback("onUpdate", () => {
      const t = tl.time();
      phone.classList.toggle("is-picked", t >= tapTime);
      phone.classList.toggle("is-revealed", t >= revealTime);
      screen.classList.toggle("is-revealed", t >= revealTime);
    });

    return () => {
      window.removeEventListener("resize", placeFinger);
      setReveal(false);
      state.n = 0;
      state.t = SECONDS;
      state.crowd = 0;
      render();
    };
  });
}
