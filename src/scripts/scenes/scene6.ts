/**
 * Scenes 5 + 6 in one: "Scan, play, and everyone answers together" over the static site background,
 * then the scores change on the big screen, drumroll, the winner is... Grandma. A little confetti,
 * and the headline turns into the payoff. Kept calm on purpose: soft moves, no shaking.
 */
import { gsap } from "../../lib/scroll";
import { confettiBurst } from "../../lib/confetti";
import { animateWords } from "../motion";
import { mobileSceneQuery, sceneScroll } from "../scene-scroll";

// Player index order (rank 1..5) and scores at each step. Index 0 = Grandma (scene6.players in copy.en.ts)
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
  const drum = q(".drumroll");
  const titleA = q(".s6-title-a");
  const title = q(".s6-title-b");
  const canvas = q<HTMLCanvasElement>(".confetti");

  if (reduced) {
    gsap.set(titleA, { opacity: 0 });
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

  gsap.matchMedia().add({ mobile: mobileSceneQuery, desktop: "(min-width: 768px) and (min-height: 501px)" }, (ctx) => {
    const mobile = !!ctx.conditions?.mobile;
    // initial state
    winner.classList.remove("is-winner");
    gsap.set(crown, { scale: 0, opacity: 0 });
    gsap.set([...titleA.querySelectorAll(".word-in"), ...title.querySelectorAll(".word-in")], { opacity: 0, yPercent: 110 });
    Object.assign(scores, scoreVars(0));
    renderScores();
    setRanks(0);
    rows.forEach((r, i) => gsap.set(r, { y: yFor(0, i) }));

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: sceneScroll(s, q(".scene-pin"), mobile, mobile ? 1.8 : 2.7, mobile ? 0.18 : 0.8),
    });

    // 1. everyone answers together
    tl.add(animateWords(titleA, { duration: 0.35, stagger: 0.05 }), 0.1).to({}, { duration: 0.4 });

    // 2. the leaderboard climbs
    for (let step = 1; step <= 2; step++) {
      tl.to(scores, { ...scoreVars(step), duration: 0.6, onUpdate: renderScores })
        .call(() => setRanks(tl.scrollTrigger?.direction === -1 ? step - 1 : step))
        .add(gsap.to(rows, { y: (i: number) => yFor(step, i), duration: 0.6, ease: "power1.inOut" }), "<")
        .to({}, { duration: 0.25 });
    }
    // drumroll
    tl.to(drum, { opacity: 1, duration: 0.2 })
      .to({}, { duration: 0.4 })
      .to(drum, { opacity: 0, duration: 0.1 })
      // the reveal
      .to(scores, { ...scoreVars(3), duration: 0.4, onUpdate: renderScores })
      .add(gsap.to(rows, { y: (i: number) => yFor(3, i), duration: 0.6, ease: "power2.out" }), "<")
      .call(() => {
        const fwd = tl.scrollTrigger?.direction !== -1;
        setRanks(fwd ? 3 : 2);
        winner.classList.toggle("is-winner", fwd);
        if (fwd) confettiBurst(canvas, 70, 2600);
      })
      .to(crown, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" })
      // 3. the headline turns into the payoff
      .to(titleA, { opacity: 0, y: -16, duration: 0.25 })
      .add(animateWords(title, { duration: 0.35, stagger: 0.05 }))
      .to({}, { duration: 0.5 });
  });
}
