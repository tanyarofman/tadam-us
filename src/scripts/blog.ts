/** Blog pages: click tracking on elements with data-track (same contract as main.ts),
 * and sources cited inside an article open in a new tab. */
import { track, type TrackEvent } from "../lib/analytics";

document.addEventListener("click", (e) => {
  const t = (e.target as HTMLElement).closest<HTMLElement>("[data-track]");
  if (!t) return;
  track(t.dataset.track as TrackEvent, { source: t.dataset.source, page: location.pathname });
});

document.querySelectorAll<HTMLAnchorElement>(".prose a[href^='http']").forEach((a) => {
  a.target = "_blank";
  a.rel = "noopener";
});
