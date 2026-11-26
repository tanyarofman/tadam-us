/**
 * Demo modal: the full recording of a real game, with sound, plus a "Create yours" CTA.
 * Opening is a click, so the video may start with sound; closing pauses it (it continues from there next time).
 */
import { track } from "../lib/analytics";
import { lockScroll } from "../lib/scroll";

export function initDemoModal() {
  const dialog = document.querySelector<HTMLDialogElement>("#demo-modal");
  if (!dialog) return;
  const video = dialog.querySelector<HTMLVideoElement>("[data-demo-video]")!;
  let lastFocus: HTMLElement | null = null;
  let scrollPosition = { left: 0, top: 0 };
  let playbackAttempt = 0;

  const open = (source?: string, trigger?: HTMLElement) => {
    if (dialog.open) return;
    // Safari does not necessarily focus a link when it is tapped.
    lastFocus = trigger ?? document.activeElement as HTMLElement;
    scrollPosition = { left: window.scrollX, top: window.scrollY };
    lockScroll(true, "demo");
    dialog.showModal();
    track("demo_modal_open", { source });
    dialog.querySelector<HTMLElement>("#demo-title")?.focus({ preventScroll: true });
    if (video.ended) video.currentTime = 0;
    video.muted = false;
    const attempt = ++playbackAttempt;
    // no click before (e.g. a /#demo link): browsers block sound, so start muted; if even that is blocked, the poster stays
    video.play().catch((error: unknown) => {
      // Closing while play() is pending must not restart audio or muted playback.
      if (!dialog.open || attempt !== playbackAttempt || !(error instanceof DOMException) || error.name !== "NotAllowedError") return;
      video.muted = true;
      video.play().catch(() => {});
    });
  };

  const close = () => {
    if (dialog.open) dialog.close();
  };

  dialog.addEventListener("close", () => {
    playbackAttempt++;
    video.pause();
    lastFocus?.focus({ preventScroll: true });
    window.scrollTo({ ...scrollPosition, behavior: "instant" });
    lockScroll(false, "demo");
    track("demo_modal_close");
  });

  // click outside the panel = close
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) close();
  });
  dialog.querySelector("[data-close]")?.addEventListener("click", close);

  // focus trap (showModal already makes the page inert; this keeps Tab cycling inside)
  dialog.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const f = Array.from(
      dialog.querySelectorAll<HTMLElement>("a[href], button, video, [tabindex]:not([tabindex='-1'])"),
    ).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-open-demo]");
    if (!t) return;
    e.preventDefault();
    if (t.classList.contains("big-buzzer")) {
      t.classList.add("is-pressed");
      window.setTimeout(() => t.classList.remove("is-pressed"), 220);
      window.setTimeout(() => open(t.dataset.source, t), 200);
    } else open(t.dataset.source, t);
  });

  // Blog articles link to "/#demo" so readers land straight in the demo.
  if (location.hash === "#demo") {
    history.replaceState(null, "", location.pathname + location.search);
    open("link");
  }
}
