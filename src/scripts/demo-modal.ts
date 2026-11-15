/**
 * Demo modal: hands off to the Base44 game.
 * Desktop: big-screen view (iframe if embeddable, otherwise a "new tab" button) + QR of joinUrl.
 * Mobile: play on this phone, or send the link to a computer via WhatsApp.
 */
import { DEMO, isConfigured } from "../config/demo";
import { COPY } from "../content/copy.he";
import { track } from "../lib/analytics";
import { lockScroll } from "../lib/scroll";

const isPhone = () => window.matchMedia("(pointer: coarse) and (max-width: 900px)").matches;

export function initDemoModal() {
  const dialog = document.querySelector<HTMLDialogElement>("#demo-modal");
  if (!dialog) return;
  const qrBox = dialog.querySelector<HTMLElement>("[data-qr]")!;
  const screen = dialog.querySelector<HTMLElement>("[data-screen]")!;
  const fallback = dialog.querySelector<HTMLElement>("[data-fallback]")!;
  const hostLink = dialog.querySelector<HTMLAnchorElement>("[data-host-link]")!;
  const playLink = dialog.querySelector<HTMLAnchorElement>("[data-play-link]")!;
  const shareLink = dialog.querySelector<HTMLAnchorElement>("[data-share-link]")!;
  let lastFocus: HTMLElement | null = null;
  let qrDone = false;
  let iframeTried = false;

  hostLink.href = DEMO.hostUrl;
  const phoneUrl = isConfigured(DEMO.soloUrl) ? DEMO.soloUrl : isConfigured(DEMO.joinUrl) ? DEMO.joinUrl : DEMO.hostUrl;
  playLink.href = phoneUrl;
  const pageUrl = location.origin + location.pathname;
  shareLink.href = `https://wa.me/?text=${encodeURIComponent(`${COPY.modal.shareText} ${pageUrl}`)}`;

  hostLink.addEventListener("click", () => track("demo_open_big_screen"));
  playLink.addEventListener("click", () => track("demo_play_on_phone", { url: phoneUrl }));
  shareLink.addEventListener("click", () => track("demo_send_to_desktop"));

  async function renderQr() {
    if (qrDone || !isConfigured(DEMO.joinUrl)) return;
    const { default: qrcode } = await import("qrcode-generator");
    const qr = qrcode(0, "M");
    qr.addData(DEMO.joinUrl);
    qr.make();
    qrBox.innerHTML = qr.createSvgTag({ cellSize: 8, margin: 0, scalable: true });
    qrBox.querySelector("svg")?.setAttribute("aria-label", COPY.modal.scan);
    qrDone = true;
  }

  function tryIframe() {
    if (iframeTried || !DEMO.hostEmbeddable) return;
    iframeTried = true;
    fallback.hidden = true;
    const frame = document.createElement("iframe");
    frame.src = DEMO.hostUrl;
    frame.title = COPY.modal.bigScreen;
    frame.loading = "lazy";
    frame.allow = "fullscreen; autoplay";
    let loaded = false;
    frame.addEventListener("load", () => (loaded = true));
    screen.prepend(frame);
    window.setTimeout(() => {
      if (!loaded) {
        frame.remove();
        fallback.hidden = false;
        track("demo_iframe_fallback");
      }
    }, DEMO.iframeTimeoutMs);
  }

  function open(source?: string) {
    lastFocus = document.activeElement as HTMLElement;
    const mobile = isPhone();
    dialog.classList.toggle("is-mobile", mobile);
    if (!mobile) {
      renderQr().then(() => qrDone && track("demo_qr_shown"));
      tryIframe();
    }
    dialog.showModal();
    lockScroll(true);
    track("demo_modal_open", { source, mobile });
    dialog.querySelector<HTMLElement>(".dm-close")?.focus();
  }

  function close() {
    if (!dialog.open) return;
    dialog.close();
  }

  dialog.addEventListener("close", () => {
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
      dialog.querySelectorAll<HTMLElement>("a[href], button, iframe, [tabindex]:not([tabindex='-1'])"),
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
}
