/**
 * One shared scene: the event photo dims, the logo bursts in the center, then the demo video starts.
 *
 * Video: muted autoplay only while the screen is on and in view, pauses out of view,
 * never autoplays with sound, no autoplay at all with prefers-reduced-motion (poster + play button).
 * The mp4 is only requested once the scene is near the viewport (preload stays "none" until then).
 */
import { gsap } from "../../lib/scroll";
import { animateWords } from "../motion";
import { mobileSceneQuery, sceneScroll } from "../scene-scroll";

type FsVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };
type FsEl = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };

function initVideo(s: HTMLElement, reduced: boolean) {
  const box = s.querySelector<HTMLElement>(".s3-video")!;
  // Button labels in the page's language (written by Scene3Reveal.astro)
  const d: Record<"play" | "pause" | "replay" | "mute" | "unmute", string> = JSON.parse(box.dataset.labels!);
  const screen = s.querySelector<FsEl>(".s3-screen")!;
  const video = box.querySelector<FsVideo>("video")!;
  const sound = box.querySelector<HTMLButtonElement>(".s3-sound")!;
  const toggles = box.querySelectorAll<HTMLButtonElement>("[data-act='toggle']");
  const fs = box.querySelector<HTMLButtonElement>(".s3-fs")!;

  document.documentElement.classList.add("s3-js");
  video.controls = false;
  video.muted = true;
  video.defaultMuted = true;

  let screenOn = reduced; // with the animation the video only counts once the screen has turned on
  let inView = false;
  let userPaused = false;
  let state: "idle" | "playing" | "paused" | "ended" = "idle";

  const setState = (v: typeof state) => {
    state = v;
    box.dataset.state = v;
    toggles.forEach((b) => b.setAttribute("aria-label", v === "playing" ? d.pause : v === "ended" ? d.replay : d.play));
  };
  const syncSound = () => {
    const on = !video.muted;
    sound.setAttribute("aria-pressed", String(on));
    sound.setAttribute("aria-label", on ? d.mute : d.unmute);
  };
  syncSound();

  // Lazy load: nothing is fetched until the scene is within ~1.5 screens
  let loaded = false;
  const load = () => {
    if (loaded) return;
    loaded = true;
    video.preload = "metadata";
    video.load();
  };
  new IntersectionObserver(
    (e) => {
      if (e.some((x) => x.isIntersecting)) {
        load();
      }
    },
    { rootMargin: "150% 0px" },
  ).observe(s);

  const tryPlay = () => {
    if (reduced || userPaused || !screenOn || !inView || state === "ended") return;
    load();
    video.play().catch(() => setState("paused")); // autoplay blocked (data saver etc.): poster + play button
  };
  const stop = () => {
    if (!video.paused) video.pause();
  };

  video.addEventListener("play", () => setState("playing"));
  video.addEventListener("pause", () => {
    if (!video.ended) setState("paused");
  });
  video.addEventListener("ended", () => setState("ended"));
  video.addEventListener("volumechange", syncSound);

  new IntersectionObserver(
    ([e]) => {
      inView = e.isIntersecting;
      if (inView) tryPlay();
      else stop();
    },
    { threshold: 0.4 },
  ).observe(screen);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else tryPlay();
  });

  toggles.forEach((b) =>
    b.addEventListener("click", () => {
      if (state === "playing") {
        userPaused = true;
        video.pause();
      } else {
        userPaused = false;
        if (state === "ended") video.currentTime = 0;
        load();
        video.play().catch(() => {});
      }
    }),
  );
  video.addEventListener("click", () => toggles[0].click());

  sound.addEventListener("click", () => {
    video.muted = !video.muted;
    if (!video.muted && video.paused && !userPaused) video.play().catch(() => {});
  });

  fs.addEventListener("click", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (screen.requestFullscreen) {
      screen.requestFullscreen().catch(() => {});
    } else if (screen.webkitRequestFullscreen) {
      screen.webkitRequestFullscreen();
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen(); // iPhone Safari
    }
  });

  if (reduced) setState("paused");
  return {
    screenOn(on: boolean) {
      if (on === screenOn) return;
      screenOn = on;
      if (on) tryPlay();
      else stop();
    },
  };
}

export function init({ reduced }: { reduced: boolean }) {
  const s = document.querySelector<HTMLElement>("[data-scene='3']");
  if (!s) return;

  const vid = initVideo(s, reduced);
  if (reduced) return;

  document.documentElement.classList.add("s3-animated");
  const q = <T extends Element = HTMLElement>(sel: string) => s.querySelector<T>(sel)!;

  const dark = q(".s3-dark");
  const screen = q(".s3-screen");
  const burst = q(".s3-burst");
  const rays = q(".s3-rays");
  const tadam = q(".s3-tadam");
  const video = q(".s3-video");
  const line1 = q(".s3-title");
  const opening = q(".s3-opening");
  const openingTitle = q(".s3-opening-title");
  const photo = q(".s3-opening .person-img");

  gsap.matchMedia().add({ mobile: mobileSceneQuery, desktop: "(min-width: 768px) and (min-height: 501px)" }, (ctx) => {
    const mobile = !!ctx.conditions?.mobile;
    gsap.set(dark, { opacity: 0 });
    gsap.set(screen, { filter: "brightness(1) saturate(1)" });
    gsap.set(opening, { autoAlpha: 1 });
    gsap.set(openingTitle, { autoAlpha: 1 });
    gsap.set(openingTitle.querySelectorAll(".word-in"), { opacity: 0, yPercent: 110 });
    gsap.set(photo, { scale: 1.05 });
    gsap.set(burst, { opacity: 0 });
    gsap.set(tadam, { scale: 0.2, opacity: 0, rotate: -8 });
    gsap.set(rays, { scale: 0.4, opacity: 0 });
    gsap.set(video, { autoAlpha: 0 });
    gsap.set(line1, { autoAlpha: 0, y: 12 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: sceneScroll(s, q(".scene-pin"), mobile, mobile ? 2.7 : 3.8, mobile ? 0.18 : 0.7),
      onUpdate() {
        vid.screenOn(tl.time() >= tl.labels.video);
      },
    });

    // 1. The photo and first heading hold in the same frame as the coming show.
    tl.to(photo, { scale: 1, duration: 1 })
      .add(animateWords(openingTitle, { duration: 0.4, stagger: 0.05 }), 0.05)
      .to({}, { duration: 0.35 })
      .addLabel("reveal")
      .to(openingTitle, { autoAlpha: 0, y: -12, duration: 0.35 }, "reveal")
      .to(opening, { autoAlpha: 0, duration: 0.55 }, "reveal")
      .to(dark, { opacity: 0.85, duration: 0.7 }, "reveal")
      .to(screen, { filter: "brightness(0.15) saturate(0)", duration: 0.65 }, "reveal")
      .to(line1, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, "reveal+=0.35")
      // 2. the screen flickers on
      .to(screen, { filter: "brightness(0.7) saturate(0.6)", duration: 0.08 })
      .to(screen, { filter: "brightness(0.2) saturate(0)", duration: 0.06 })
      .to(screen, { filter: "brightness(1) saturate(1)", duration: 0.08 })
      .to(screen, { filter: "brightness(0.4) saturate(0.5)", duration: 0.05 })
      .to(screen, { filter: "brightness(1) saturate(1)", duration: 0.12 })
      // 3. "טדאם!" bursts in the middle of the screen
      .to(burst, { opacity: 1, duration: 0.2 }, "<")
      .to(rays, { scale: 1.2, opacity: 0.5, rotate: 30, duration: mobile ? 0.45 : 0.9 })
      .to(tadam, { scale: 1, opacity: 1, rotate: -3, duration: 0.5, ease: "back.out(2.5)" }, "<0.1")
      .to({}, { duration: mobile ? 0.35 : 0.8 })
      // 4. the burst clears and the big screen wakes up with the demo
      .addLabel("video")
      .to(burst, { opacity: 0, scale: 1.2, duration: 0.35 })
      .fromTo(
        video,
        { autoAlpha: 0, scaleY: 0.02, filter: "brightness(3)" },
        { autoAlpha: 1, scaleY: 1, filter: "brightness(1)", duration: 0.4, ease: "power3.out" },
        "<0.1",
      )
      // Spend the extra mobile scroll distance on the fully revealed video.
      // This preserves the quick photo/logo entrance while giving playback room to hold.
      .to({}, { duration: mobile ? 1.8 : 0.6 });
    // The hero's demo link follows the timeline label instead of a desktop-only offset.
    s.dataset.demoScroll = String(tl.labels.video / tl.duration());
  });
}
