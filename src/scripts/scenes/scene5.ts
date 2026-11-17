/**
 * Scene 5 (WOW #2, scroll-scrubbed): the room lights up. Phones come on from the back rows to the front,
 * then the headline lands.
 * Quality notes: sprites are drawn at 256px (sharp on retina), far phones are small and crisp,
 * near phones are big soft bokeh, and while the scene is on screen the phones sway and twinkle a little.
 */
import { gsap } from "../../lib/scroll";
import { animateWords, isMobile, seeded } from "../motion";

// Crowd lights use the brand tokens (read at runtime, so a theme change in tokens.css carries over)
const TOKENS = ["--white", "--sky-cyan", "--white", "--sun-yellow", "--magenta"];
const readColors = () => {
  const cs = getComputedStyle(document.documentElement);
  const norm = document.createElement("canvas").getContext("2d")!;
  return TOKENS.map((t) => {
    // Normalize any CSS color ("#fff", "#ffffff", "rgb(...)") to "#rrggbb" so alpha suffixes stay valid
    norm.fillStyle = "#ffffff";
    norm.fillStyle = cs.getPropertyValue(t).trim() || "#ffffff";
    const v = String(norm.fillStyle);
    return /^#[0-9a-f]{6}$/i.test(v) ? v : "#ffffff";
  });
};

const SPRITE = 256;

/** A phone held up: a halo, then the lit screen with a bright core. `soft` = out of focus (near rows). */
function makeSprite(color: string, soft: boolean) {
  const sp = document.createElement("canvas");
  sp.width = sp.height = SPRITE;
  const g = sp.getContext("2d")!;
  const c = SPRITE / 2;
  const halo = g.createRadialGradient(c, c, 0, c, c, c);
  halo.addColorStop(0, color + "aa");
  halo.addColorStop(0.18, color + "55");
  halo.addColorStop(0.5, color + "14");
  halo.addColorStop(1, color + "00");
  g.fillStyle = halo;
  g.fillRect(0, 0, SPRITE, SPRITE);

  if (soft) g.filter = "blur(7px)";
  const pw = SPRITE * 0.14;
  const ph = SPRITE * 0.25;
  const screen = g.createLinearGradient(0, c - ph / 2, 0, c + ph / 2);
  screen.addColorStop(0, "#ffffff");
  screen.addColorStop(1, color);
  g.fillStyle = screen;
  g.shadowColor = color;
  g.shadowBlur = soft ? 0 : 18;
  g.beginPath();
  g.roundRect(c - pw / 2, c - ph / 2, pw, ph, pw * 0.22);
  g.fill();
  g.filter = "none";
  return sp;
}

type Phone = { x: number; y: number; s: number; c: number; t: number; soft: boolean; ph: number; sw: number };

function makeCrowd(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  const colors = readColors();
  const sharp = colors.map((c) => makeSprite(c, false));
  const soft = colors.map((c) => makeSprite(c, true));
  let phones: Phone[] = [];
  let w = 0;
  let h = 0;
  let progress = 0;
  let clock = 0;

  function layout() {
    const rand = seeded(42);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const n = isMobile() ? 170 : 360;
    phones = [];
    for (let i = 0; i < n; i++) {
      const depth = Math.pow(rand(), 1.15); // 0 = far (back rows, up), 1 = near (front, down)
      phones.push({
        x: rand() * w,
        y: h * (0.26 + depth * 0.74) + (rand() - 0.5) * 24,
        s: 6 + depth * depth * 46,
        c: Math.floor(rand() * colors.length),
        t: (1 - depth) * 0.55 + rand() * 0.3, // back rows light up first
        soft: depth > 0.72,
        ph: rand() * Math.PI * 2,
        sw: 0.6 + rand() * 0.8,
      });
    }
    phones.sort((a, b) => a.s - b.s);

    draw(progress);
  }

  function draw(p: number) {
    progress = p;
    ctx.clearRect(0, 0, w, h);
    if (p <= 0) return;
    ctx.globalCompositeOperation = "lighter";
    for (const ph of phones) {
      const a = Math.min(1, Math.max(0, (p - ph.t) * 5));
      if (!a) continue;
      const tw = 0.82 + 0.18 * Math.sin(clock * 2.2 * ph.sw + ph.ph);
      const sway = Math.sin(clock * ph.sw + ph.ph) * ph.s * 0.18;
      ctx.globalAlpha = a * tw * (ph.soft ? 0.75 : 1);
      const size = ph.s * 3.2;
      ctx.drawImage((ph.soft ? soft : sharp)[ph.c], ph.x + sway - size / 2, ph.y - size / 2, size, size);
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }

  // Gentle life while on screen (sway + twinkle). Stops when the scene is off screen.
  let raf = 0;
  let running = false;
  let last = 0;
  const tick = (now: number) => {
    if (!running) return;
    clock += Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    draw(progress);
    raf = requestAnimationFrame(tick);
  };
  const setRunning = (on: boolean) => {
    if (on === running) return;
    running = on;
    if (on) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    } else cancelAnimationFrame(raf);
  };

  layout();
  let rafResize = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(rafResize);
    rafResize = requestAnimationFrame(layout);
  });
  return { draw, setRunning };
}

export function init({ reduced }: { reduced: boolean }) {
  const s = document.querySelector<HTMLElement>("[data-scene='5']");
  if (!s) return;
  const canvas = s.querySelector<HTMLCanvasElement>(".s5-crowd")!;
  const crowd = makeCrowd(canvas);
  if (reduced) {
    crowd.draw(1);
    return;
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => crowd.setRunning(entries.some((e) => e.isIntersecting))).observe(s);
  }

  const title = s.querySelector<HTMLElement>(".s5-title")!;
  const state = { crowd: 0 };
  const render = () => crowd.draw(state.crowd);
  gsap.set(title.querySelectorAll(".word-in"), { opacity: 0, yPercent: 110 });

  const mobile = isMobile();
  gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: s,
        start: "top top",
        end: () => "+=" + window.innerHeight * (mobile ? 1.4 : 1.6),
        pin: s.querySelector(".scene-pin"),
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    })
    .to(state, { crowd: 1, duration: 1.6, onUpdate: render })
    .add(animateWords(title, { duration: 0.35, stagger: 0.05 }), 0.7)
    .to({}, { duration: 0.5 });
}
