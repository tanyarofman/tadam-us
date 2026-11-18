/** One playback group. Returns the release callback for the end of the hero intro. */
export function initSyncedPreview(preview: HTMLElement) {
  const screen = preview.querySelector<HTMLVideoElement>("[data-preview-screen]")!;
  const phone = preview.querySelector<HTMLVideoElement>("[data-preview-phone]")!;
  const videos = [screen, phone];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let inView = true;
  let starting = false;
  let resetting = false;
  let blocked = false;
  let failed = false;
  let generation = 0;
  let introDone = false;
  const ready = () => videos.every((v) => v.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA && !v.seeking);
  const allowed = () => introDone && inView && !document.hidden && !reduced.matches && !failed && !blocked;
  const pause = () => {
    generation++;
    videos.forEach((v) => v.pause());
    preview.dataset.playback = "paused";
  };
  const start = async () => {
    if (starting || resetting || !allowed() || !ready() || videos.every((v) => !v.paused)) return;
    starting = true;
    const attempt = generation;
    const results = await Promise.allSettled(videos.map((v) => v.play()));
    starting = false;
    if (results.some((r) => r.status === "rejected" && r.reason?.name === "NotAllowedError")) blocked = true;
    if (results.some((r) => r.status === "rejected" && !["AbortError", "NotAllowedError"].includes(r.reason?.name))) failed = true;
    if (attempt !== generation || !allowed() || results.some((r) => r.status === "rejected")) {
      pause();
      if (!blocked && ready() && allowed()) void start();
      return;
    }
    preview.dataset.playback = "playing";
  };
  const restart = () => {
    if (resetting) return;
    resetting = true;
    pause();
    videos.forEach((v) => { v.currentTime = 0; });
    resetting = false;
    void start();
  };
  for (const video of videos) {
    video.muted = true;
    video.defaultMuted = true;
    // The clips differ slightly in duration. Restart the pair at the first end.
    video.loop = false;
    video.addEventListener("canplay", () => void start());
    video.addEventListener("seeked", () => void start());
    video.addEventListener("waiting", () => { if (!resetting) pause(); });
    video.addEventListener("ended", restart);
    video.addEventListener("error", () => { failed = true; pause(); });
  }
  screen.addEventListener("timeupdate", () => {
    if (resetting || screen.paused || phone.paused || phone.seeking) return;
    if (Math.abs(phone.currentTime - screen.currentTime) > 0.1) phone.currentTime = screen.currentTime;
  });
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) void start();
    else pause();
  }).observe(preview);
  document.addEventListener("visibilitychange", () => document.hidden ? pause() : void start());
  reduced.addEventListener("change", () => reduced.matches ? pause() : void start());
  return () => {
    introDone = true;
    void start();
  };
}
