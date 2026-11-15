/** Tiny canvas confetti in the logo colors. No dependency. */
const COLORS = ["#E74138", "#F7D94A", "#64D8F7", "#E836A1", "#FFFFFF"];

export function confettiBurst(canvas: HTMLCanvasElement, count = 160, duration = 3200) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const parts = Array.from({ length: count }, (_, i) => {
    const fromLeft = i % 2 === 0;
    return {
      x: fromLeft ? w * 0.1 : w * 0.9,
      y: h * 0.75,
      vx: (fromLeft ? 1 : -1) * (3 + Math.random() * 9),
      vy: -(9 + Math.random() * 12),
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      w: 6 + Math.random() * 8,
      h: 4 + Math.random() * 6,
      c: COLORS[i % COLORS.length],
      round: Math.random() < 0.3,
    };
  });

  const start = performance.now();
  const tick = (now: number) => {
    const t = now - start;
    ctx.clearRect(0, 0, w, h);
    const fade = Math.max(0, 1 - Math.max(0, t - duration * 0.6) / (duration * 0.4));
    ctx.globalAlpha = fade;
    for (const p of parts) {
      p.vy += 0.32;
      p.vx *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      if (p.round) {
        ctx.beginPath();
        ctx.arc(0, 0, p.h / 1.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)) + 1);
      }
      ctx.restore();
    }
    if (t < duration) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, w, h);
  };
  requestAnimationFrame(tick);
}
