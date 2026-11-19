import assert from "node:assert/strict";
import { test } from "node:test";
import { initMobilePreview } from "../src/scripts/mobile-preview.ts";

class Video extends EventTarget {
  readyState = 1;
  paused = true;
  seeking = false;
  starts = 0;
  time = 0;
  blocked = false;
  pending = null;
  get currentTime() { return this.time; }
  set currentTime(time) {
    this.time = time;
    this.seeking = true;
    queueMicrotask(() => { this.seeking = false; this.dispatchEvent(new Event("seeked")); });
  }
  play() {
    this.starts++;
    if (this.blocked) return Promise.reject(new DOMException("Gesture required", "NotAllowedError"));
    this.paused = false;
    if (this.readyState >= 3) return Promise.resolve();
    return new Promise((resolve, reject) => { this.pending = { resolve, reject }; });
  }
  pause() {
    this.paused = true;
    this.pending?.reject(new DOMException("Playback interrupted", "AbortError"));
    this.pending = null;
  }
  ready() {
    this.readyState = 4;
    this.pending?.resolve();
    this.pending = null;
    this.dispatchEvent(new Event("canplay"));
  }
}
const settle = () => new Promise((resolve) => setImmediate(resolve));
function setup(t) {
  const videos = [new Video(), new Video()];
  const reduced = Object.assign(new EventTarget(), { matches: false });
  const doc = Object.assign(new EventTarget(), { hidden: false });
  let observe;
  for (const [key, value] of Object.entries({
    window: { matchMedia: () => reduced }, document: doc,
    IntersectionObserver: class { constructor(cb) { observe = cb; } observe() {} },
  })) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { value, configurable: true });
    t.after(() => previous ? Object.defineProperty(globalThis, key, previous) : delete globalThis[key]);
  }
  const preview = { dataset: {}, querySelectorAll: () => videos };
  const release = initMobilePreview(preview);
  return { videos, preview, release, doc, reduced, view: (isIntersecting) => observe([{ isIntersecting }]) };
}

test("mobile requests playback from metadata, waits for both decoders, then starts the visible pair at zero", async (t) => {
  const { videos: [screen, phone], preview, release, view } = setup(t);
  view(true);
  assert.equal(screen.starts, 0, "intro must finish first");
  release();
  assert.equal(screen.starts, 1);
  assert.equal(phone.starts, 1);
  screen.time = 0.3;
  screen.ready();
  await settle();
  assert.equal(preview.dataset.playback, "loading", "one ready decoder must not reveal the pair");
  phone.ready();
  await settle();
  assert.equal(preview.dataset.playback, "playing");
  assert.equal(screen.currentTime, 0);
  assert.equal(phone.currentTime, 0);
  assert.ok(screen.muted && phone.muted && screen.playsInline && phone.playsInline);
});

test("mobile retries blocked autoplay on a gesture without reloading the page", async (t) => {
  const { videos, preview, release, view, doc } = setup(t);
  videos.forEach(v => { v.blocked = true; v.ready(); });
  view(true); release(); await settle();
  assert.ok(videos.every(v => v.paused));
  videos.forEach(v => { v.blocked = false; });
  doc.dispatchEvent(new Event("touchend")); await settle();
  assert.equal(preview.dataset.playback, "playing");
});

test("mobile recovers when scrolling away and back during initial buffering", async (t) => {
  const { videos, preview, release, view } = setup(t);
  view(true); release();
  view(false); view(true); await settle();
  videos.forEach(v => v.ready()); await settle();
  assert.equal(preview.dataset.playback, "playing");
  view(false);
  assert.ok(videos.every(v => v.paused));
  view(true); await settle();
  assert.equal(preview.dataset.playback, "playing");
});

test("mobile loops together and stops for a hidden page or reduced motion", async (t) => {
  const { videos, preview, release, view, doc, reduced } = setup(t);
  videos.forEach(v => v.ready()); view(true); release(); await settle();
  videos.forEach(v => { v.time = 19.3; });
  videos[0].dispatchEvent(new Event("ended")); await settle();
  assert.ok(videos.every(v => v.currentTime === 0 && !v.paused));
  doc.hidden = true; doc.dispatchEvent(new Event("visibilitychange"));
  assert.ok(videos.every(v => v.paused));
  doc.hidden = false; reduced.matches = true;
  doc.dispatchEvent(new Event("visibilitychange")); await settle();
  assert.equal(preview.dataset.playback, "paused");
  reduced.matches = false; reduced.dispatchEvent(new Event("change")); await settle();
  assert.equal(preview.dataset.playback, "playing");
});
