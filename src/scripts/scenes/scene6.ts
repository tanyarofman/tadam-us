/**
 * Scene 6: leaderboard climbs, drumroll pause, the winner is... סבתא. Confetti.
 */
import { gsap } from "../../lib/scroll";
import { confettiBurst } from "../../lib/confetti";
import { animateWords, isMobile } from "../motion";

// Player index order (rank 1..5) and scores at each step. Index 0 = סבתא (see copy.he.ts)
const ORDERS = [
  [1, 2, 3, 4, 0],
  [1, 2, 0, 3, 4],
  [1, 0, 2, 3, 4],
  [0, 1, 2, 3, 4],
];
const SCORES = [
  [520, 980, 900, 760, 700],
  [1450, 1720, 1500, 1200, 1100],
  [2290, 2340, 2050, 1800, 1640],
  [2840, 2710, 2390, 2150, 1980],
];

export function init({ reduced }: { reduced: boolean }) {
  const s = document.querySelector<HTMLElement>("[data-scene='6']");
  if (!s) return;
  const q = <T extends Element = HTMLElement>(sel: string) => s.querySelector<T>(sel)!;
  const rows = Array.from(s.querySelectorAll<HTMLElement>(".lb-row"));
  const ranks = rows.map((r) => r.querySelector<HTMLElement>(".lb-rank")!);
  const scoreEls = rows.map((r) => r.querySelector<HTMLElement>(".lb-score")!);
  const winner = rows[0];
  const crown = q(".lb-crown");
  const tag = q(".winner-tag");
  const drum = q(".drumroll");
  const kid = q(".kid-wrap");
  const title = q(".s6-title");
  const keepsake = q(".s6-keepsake");
  const canvas = q<HTMLCanvasElement>(".confetti");

  // the living photo only animates while it is on screen
  new IntersectionObserver(([e]) => kid.classList.toggle("is-offscreen", !e.isIntersecting)).observe(kid);

  if (reduced) {
    kid.classList.add("is-laughing");
    return;
  }

  const fmt = new Intl.NumberFormat("he-IL");
  const pitch = () => rows[1].offsetTop - rows[0].offsetTop;
  const scores = { p0: 0, p1: 0, p2: 0, p3: 0, p4: 0 };
  const renderScores = () =>
    scoreEls.forEach((el, i) => (el.textContent = fmt.format(Math.round(scores[`p${i}` as keyof typeof scores]))));
  const yFor = (step: number, i: number) => (ORDERS[step].indexOf(i) - i) * pitch();
  const setRanks = (step: number) =>
    ORDERS[step].forEach((playerIdx, rank) => (ranks[playerIdx].textContent = String(rank + 1)));
  const scoreVars = (step: number) =>
    Object.fromEntries(SCORES[step].map((v, i) => [`p${i}`, v])) as Record<string, number>;

  // initial state
  winner.classList.remove("is-winner");
  gsap.set(crown, { scale: 0, opacity: 0 });
  gsap.set([tag, keepsake], { opacity: 0, y: 16 });
  gsap.set(title.querySelectorAll(".word-in"), { opacity: 0, yPercent: 110 });
  gsap.set(kid, { opacity: 0.35, scale: 0.9 });
  Object.assign(scores, scoreVars(0));
  renderScores();
  setRanks(0);
  rows.forEach((r, i) => gsap.set(r, { y: yFor(0, i) }));

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: s,
      start: "top top",
      end: () => "+=" + window.innerHeight * (isMobile() ? 2.8 : 3),
      pin: s.querySelector(".scene-pin"),
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  for (let step = 1; step <= 2; step++) {
    tl.to(scores, { ...scoreVars(step), duration: 0.6, onUpdate: renderScores })
      .call(() => setRanks(tl.scrollTrigger?.direction === -1 ? step - 1 : step))
      .add(gsap.to(rows, { y: (i: number) => yFor(step, i), duration: 0.5, ease: "power2.inOut" }), "<")
      .to({}, { duration: 0.2 });
  }
  // drumroll
  tl.to(drum, { opacity: 1, duration: 0.15 })
    .to(rows.slice(0, 2), { x: 4, duration: 0.05, yoyo: true, repeat: 7 }, "<")
    .to({}, { duration: 0.4 })
    .to(drum, { opacity: 0, duration: 0.1 })
    // the reveal
    .to(scores, { ...scoreVars(3), duration: 0.4, onUpdate: renderScores })
    .add(gsap.to(rows, { y: (i: number) => yFor(3, i), duration: 0.5, ease: "back.out(1.6)" }), "<")
    .call(() => {
      const fwd = tl.scrollTrigger?.direction !== -1;
      setRanks(fwd ? 3 : 2);
      winner.classList.toggle("is-winner", fwd);
      kid.classList.toggle("is-laughing", fwd);
      if (fwd) confettiBurst(canvas);
    })
    .to(crown, { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(3)" })
    .to(kid, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, "<")
    .to(tag, { opacity: 1, y: 0, duration: 0.25 }, "<")
    .add(animateWords(title, { duration: 0.35, stagger: 0.05 }))
    .to(keepsake, { opacity: 1, y: 0, duration: 0.3 })
    .to({}, { duration: 0.5 });
}
