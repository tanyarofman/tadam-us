/** Blog pages: the only script is click tracking on elements with data-track (same contract as main.ts). */
import { track, type TrackEvent } from "../lib/analytics";

document.addEventListener("click", (e) => {
  const t = (e.target as HTMLElement).closest<HTMLElement>("[data-track]");
  if (!t) return;
  track(t.dataset.track as TrackEvent, { source: t.dataset.source, page: location.pathname });
});
