/** Mobile Safari may preload only metadata until play() is requested. */
export function initMobilePreview(preview: HTMLElement) {
  const videos = Array.from(preview.querySelectorAll<HTMLVideoElement>("video"));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let introDone = false;
  let inView = false;
  let starting = false;
  let blocked = false;
  let failed = false;
  let generation = 0;
  let prepared = false;
  const allowed = () => introDone && inView && !document.hidden && !reduced.matches && !failed;
  const pause = () => {
    generation++;
    videos.forEach((video) => video.pause());
    preview.dataset.playback = "paused";
  };
  const seek = (video: HTMLVideoElement, time: number) => new Promise<void>((resolve) => {
    if (Math.abs(video.currentTime - time) < 0.02 && !video.seeking) return resolve();
    const done = () => { video.removeEventListener("seeked", done); video.removeEventListener("error", done); resolve(); };
    video.addEventListener("seeked", done, { once: true });
    video.addEventListener("error", done, { once: true });
    video.currentTime = time;
  });
  const start = async () => {
    if (starting || blocked || !allowed() || videos.every((v) => !v.paused)) return;
    starting = true;
    const attempt = generation;
    preview.dataset.playback = "loading";
    try {
      // Request both synchronously, including on the user-gesture retry. Waiting for
      // canplay here deadlocks on iPhones that deliberately defer media preloading.
      await Promise.all(videos.map((video) => video.play()));
      if (attempt !== generation || !allowed()) return;
      if (!prepared) {
        // Both decoders are now ready. Start the visible pair at the same frame.
        videos.forEach((video) => video.pause());
        await Promise.all(videos.map((video) => seek(video, 0)));
        if (attempt !== generation || !allowed()) return;
        await Promise.all(videos.map((video) => video.play()));
        prepared = true;
      }
      if (attempt === generation && allowed()) preview.dataset.playback = "playing";
    } catch (error) {
      blocked = (error as DOMException).name === "NotAllowedError";
      if (!["NotAllowedError", "AbortError"].includes((error as DOMException).name)) failed = true;
      pause();
    } finally {
      starting = false;
      if (!allowed()) pause();
      else if (attempt !== generation && !blocked && !failed) void start();
    }
  };
  videos.forEach((video) => {
    video.muted = video.defaultMuted = true;
    video.playsInline = true;
    video.loop = false;
    video.addEventListener("loadedmetadata", () => void start());
    video.addEventListener("canplay", () => void start());
    video.addEventListener("ended", () => {
      pause();
      prepared = false;
      void start();
    });
    video.addEventListener("waiting", () => {
      if (starting || preview.dataset.playback !== "playing") return;
      pause();
      void start();
    });
    video.addEventListener("error", () => { failed = true; pause(); });
  });
  videos[0].addEventListener("timeupdate", () => {
    const [screen, phone] = videos;
    if (starting || screen.paused || phone.paused || phone.seeking) return;
    if (Math.abs(screen.currentTime - phone.currentTime) > 0.18) phone.currentTime = screen.currentTime;
  });
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) void start();
    else pause();
  }, { threshold: 0.05 }).observe(preview);
  document.addEventListener("visibilitychange", () => document.hidden ? pause() : void start());
  reduced.addEventListener("change", () => reduced.matches ? pause() : void start());
  // Low-power/autoplay restrictions must remain respected. A normal tap/swipe
  // can unlock muted playback without adding controls over the device mockups.
  const retry = () => { if (allowed()) { blocked = false; void start(); } };
  document.addEventListener("touchend", retry, { passive: true });
  document.addEventListener("pointerup", retry, { passive: true });
  return () => { introDone = true; void start(); };
}
