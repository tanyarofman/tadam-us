/**
 * Demo modal: the full recording of a real game, with sound, plus a WhatsApp CTA.
 * Opening is a click, so the video may start with sound; closing pauses it (it continues from there next time).
 */
import { track } from "../lib/analytics";
import { lockScroll } from "../lib/scroll";

export function initDemoModal() {
  const dialog = document.querySelector<HTMLDialogElement>("#demo-modal");
  if (!dialog) return;
  const video = dialog.querySelector<HTMLVideoElement>("[data-demo-video]")!;
  let lastFocus: HTMLElement | null = null;

  function open(source?: string) {
    lastFocus = document.activeElement as HTMLElement;
    dialog.showModal();
    lockScroll(true);
    track("demo_modal_open", { source });
    dialog.querySelector<HTMLElement>(".dm-close")?.focus();
    if (video.ended) video.currentTime = 0;
    video.muted = false;
    // no click before (e.g. a /#demo link): browsers block sound, so start muted; if even that is blocked, the poster stays
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }

  function close() {
    if (dialog.open) dialog.close();
  }

  dialog.addEventListener("close", () => {
    video.pause();
    lockScroll(false);
    track("demo_modal_close");
    lastFocus?.focus();
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
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-open-demo]");
    if (!t) return;
    e.preventDefault();
    if (t.classList.contains("big-buzzer")) {
      t.classList.add("is-pressed");
      window.setTimeout(() => t.classList.remove("is-pressed"), 220);
      window.setTimeout(() => open(t.dataset.source), 200);
    } else open(t.dataset.source);
  });

  // Blog articles link to "/#demo" so readers land straight in the demo.
  if (location.hash === "#demo") {
    history.replaceState(null, "", location.pathname + location.search);
    open("link");
  }
}
