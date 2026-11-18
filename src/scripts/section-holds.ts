import { refreshScrollSoon } from "../lib/scroll";

/** Native sticky pauses keep interactive content in the DOM while its height changes. */
export function init(id: string, { reduced }: { reduced: boolean }) {
  if (reduced) return;
  const section = document.getElementById(id);
  const pin = section?.querySelector<HTMLElement>("[data-scroll-pause]");
  const content = pin?.firstElementChild;
  if (!section || !pin || !content) return;

  section.dataset.scrollHold = "";

  // CSS handles the hold's natural height, without rebuilding a JS pin or
  // restarting answer animations. Update downstream triggers and page progress.
  let height = Math.round(content.getBoundingClientRect().height);
  new ResizeObserver(([entry]) => {
    const next = Math.round(entry.contentRect.height);
    if (next === height) return;
    height = next;
    refreshScrollSoon();
  }).observe(content);
}
