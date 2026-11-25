import { ScrollTrigger, scrollToTarget } from "../lib/scroll";

const sectionIds = new Set(["scene-4", "hosts", "pricing", "faq", "demos", "testimonials"]);
const revealers = new Map<string, () => void>();

/** Scenes can settle their complete reading layout before an anchor jump. */
export function registerSectionReveal(id: string, reveal: () => void) {
  revealers.set(id, reveal);
}

export function initSectionNavigation(ready: Promise<void>) {
  let request = 0;
  const navigate = async (hash: string, updateHistory: boolean) => {
    const id = hash.slice(1);
    if (!sectionIds.has(id)) return;
    const current = ++request;
    await ready;
    if (current !== request) return;
    const section = document.getElementById(id);
    if (!section) return;
    revealers.get(id)?.();
    section.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    // Suppress reveal transitions on explicit navigation: the content is ready on arrival.
    section.classList.add("section-revealed");
    ScrollTrigger.refresh();
    if (updateHistory && location.hash !== hash) history.pushState(null, "", hash);
    // A section link is a jump, not a replay of the intervening scroll scenes.
    // Instant arrival also avoids an FAQ resize refresh interrupting a smooth scroll.
    scrollToTarget(section, 0, true);
    const heading = section.querySelector<HTMLElement>("h2");
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
  };

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !sectionIds.has(url.hash.slice(1))) return;
    event.preventDefault();
    void navigate(url.hash, true);
  });
  window.addEventListener("hashchange", () => void navigate(location.hash, false));
  // Cross-page header/footer links must wait for fonts, the intro and pin measurements.
  if (location.hash) void navigate(location.hash, false);
}
