import { refreshScrollSoon } from "../lib/scroll";

/** Native sticky pauses keep interactive content in the DOM while its height changes. */
export function init(id: string, { reduced }: { reduced: boolean }) {
  if (reduced) return;
  const section = document.getElementById(id);
  const pin = section?.querySelector<HTMLElement>("[data-scroll-pause]");
  const content = pin?.firstElementChild;
  if (!section || !pin || !content) return;

  section.dataset.scrollHold = "";

  const fitMobileHold = () => {
    const mobile = window.matchMedia("(max-width: 767px), (orientation: landscape) and (max-height: 500px)").matches;
    // A tall form/expanded FAQ must be scrollable to its bottom before it pauses.
    pin.style.setProperty("--hold-top", `${mobile ? Math.min(0, window.innerHeight - pin.offsetHeight) : 0}px`);
  };
  fitMobileHold();
  let width = window.innerWidth;
  const onResize = () => {
    if (width === window.innerWidth) return;
    width = window.innerWidth;
    fitMobileHold();
  };
  window.addEventListener("resize", onResize);

  // CSS handles the hold's natural height, without rebuilding a JS pin or
  // restarting answer animations. Update downstream triggers and page progress.
  let height = Math.round(content.getBoundingClientRect().height);
  const observer = new ResizeObserver(([entry]) => {
    const next = Math.round(entry.contentRect.height);
    if (next === height) return;
    height = next;
    fitMobileHold();
    refreshScrollSoon();
  });
  observer.observe(content);
  return () => {
    observer.disconnect();
    window.removeEventListener("resize", onResize);
    delete section.dataset.scrollHold;
    pin.style.removeProperty("--hold-top");
  };
}
