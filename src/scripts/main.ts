/**
 * Page bootstrap. Scenes are initialised in page order so ScrollTrigger pins stack correctly.
 */
import { initScroll, scrollToTarget, ScrollTrigger, gsap, prefersReducedMotion } from "../lib/scroll";
import { track, type TrackEvent } from "../lib/analytics";
import { initReveals } from "./motion";
import { initHero } from "./hero";
import { initDemoModal } from "./demo-modal";
import { initSyncedPreview } from "./synced-preview";
import { initMobilePreview } from "./mobile-preview";

function initScrollProgress() {
  const bar = document.querySelector<HTMLElement>(".scroll-progress__bar");
  if (!bar) return;
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
  });
}

function initLinks() {
  document.addEventListener("click", (e) => {
    const a = (e.target as HTMLElement).closest<HTMLElement>("[data-scroll-to]");
    if (a) {
      e.preventDefault();
      // data-scroll-offset: extra screens to scroll past the target (lands inside a pinned scene)
      const screens = prefersReducedMotion() ? 0 : Number(a.dataset.scrollOffset) || 0;
      const target = document.querySelector<HTMLElement>(a.dataset.scrollTo!);
      const demoScene = target?.classList.contains("mobile-sticky-scene") && screens && target.dataset.demoScroll;
      const offset = demoScene
        ? (target!.offsetHeight - (target!.firstElementChild as HTMLElement).offsetHeight) * Math.min(1, Number(demoScene) + 0.12)
        : screens * window.innerHeight;
      scrollToTarget(a.dataset.scrollTo!, offset);
    }
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-track]");
    if (t) track(t.dataset.track as TrackEvent, { source: t.dataset.source });
  });
}

const yieldToMain = () => new Promise<void>((r) => setTimeout(r, 0));

async function initScenes(loading: Promise<Array<{ init: (o: { reduced: boolean }) => void }>>) {
  const mods = await loading;
  const reduced = prefersReducedMotion();
  // One scene per task, in page order, so pins stack correctly and no single task blocks for long.
  for (const m of mods) {
    await yieldToMain();
    m.init({ reduced });
  }
  initReveals();
  ScrollTrigger.refresh();
}

function boot() {
  initScroll();
  initLinks();
  initDemoModal();
  initScrollProgress();
  const preview = document.querySelector<HTMLElement>("[data-synced-preview]");
  const initPreview = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches ? initMobilePreview : initSyncedPreview;
  const startPreview = preview ? initPreview(preview) : () => {};

  // Below-the-fold scene code downloads in parallel with the intro,
  // and is initialised once the hero intro is done (keeps the intro smooth and LCP early).
  const holds = import("./section-holds");
  const pause = (id: string) => holds.then((m) => ({
    init: (options: { reduced: boolean }) => m.init(id, options),
  }));
  const loading = Promise.all([
    import("./scenes/scene3"),
    import("./scenes/scene4"),
    import("./scenes/scene6"),
    pause("hosts"),
    import("./included"),
    pause("scene-7"),
    import("./scenes/scene7"),
    pause("faq"),
  ]);
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    initScenes(loading);
  };
  initHero(() => {
    startPreview();
    start();
  });
  // Safety net: if the visitor scrolls before the intro ends, set the scenes up right away.
  window.addEventListener("scroll", start, { once: true, passive: true });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
