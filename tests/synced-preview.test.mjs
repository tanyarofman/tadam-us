import assert from "node:assert/strict";
import { test } from "node:test";
import { initSyncedPreview } from "../src/scripts/synced-preview.ts";

class Video extends EventTarget {
  readyState = 0;
  paused = true;
  seeking = false;
  currentTime = 0;
  starts = 0;
  play() { this.starts++; this.paused = false; return Promise.resolve(); }
  pause() { this.paused = true; }
  ready() { this.readyState = 4; this.dispatchEvent(new Event("canplay")); }
}

function setup(t) {
  const screen = new Video();
  const phone = new Video();
  const reduced = Object.assign(new EventTarget(), { matches: false });
  const doc = Object.assign(new EventTarget(), { hidden: false });
  let observer;
  const globals = {
    window: { matchMedia: () => reduced },
    document: doc,
    HTMLMediaElement: { HAVE_FUTURE_DATA: 3 },
    IntersectionObserver: class { constructor(cb) { observer = cb; } observe() {} },
  };
  for (const [key, value] of Object.entries(globals)) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { value, configurable: true });
    t.after(() => previous ? Object.defineProperty(globalThis, key, previous) : delete globalThis[key]);
  }
  const preview = { dataset: {}, querySelector: (s) => s.includes("screen") ? screen : phone };
  const finishIntro = initSyncedPreview(preview);
  return { screen, phone, doc, reduced, finishIntro, view: (isIntersecting) => observer([{ isIntersecting }]) };
}
const settle = () => new Promise((resolve) => setImmediate(resolve));

test("waits for both videos, restarts both at the shorter clip's end, and stays muted", async (t) => {
  const { screen, phone, finishIntro } = setup(t);
  finishIntro();
  screen.ready();
  await settle();
  assert.equal(screen.starts, 0);
  assert.equal(phone.starts, 0);
  phone.ready();
  await settle();
  assert.equal(screen.starts, 1);
  assert.equal(phone.starts, 1);
  assert.ok(screen.muted && phone.muted);
  screen.currentTime = 19.333;
  phone.currentTime = 19.333;
  screen.dispatchEvent(new Event("ended"));
  await settle();
  assert.equal(screen.currentTime, 0);
  assert.equal(phone.currentTime, 0);
  assert.equal(screen.starts, 2);
  assert.equal(phone.starts, 2);
});

test("buffers as a pair and pauses both when hidden or offscreen", async (t) => {
  const { screen, phone, doc, view, finishIntro } = setup(t);
  finishIntro();
  screen.ready(); phone.ready(); await settle();
  phone.readyState = 2;
  phone.dispatchEvent(new Event("waiting"));
  assert.ok(screen.paused && phone.paused);
  screen.dispatchEvent(new Event("canplay"));
  assert.equal(screen.starts, 1);
  phone.ready(); await settle();
  assert.ok(!screen.paused && !phone.paused);
  view(false);
  assert.ok(screen.paused && phone.paused);
  view(true); await settle();
  doc.hidden = true;
  doc.dispatchEvent(new Event("visibilitychange"));
  assert.ok(screen.paused && phone.paused);
});

test("uses static posters when reduced motion is requested", async (t) => {
  const { screen, phone, reduced, finishIntro } = setup(t);
  finishIntro();
  reduced.matches = true;
  screen.ready(); phone.ready(); await settle();
  assert.equal(screen.starts, 0);
  assert.equal(phone.starts, 0);
  reduced.matches = false;
  reduced.dispatchEvent(new Event("change"));
  await settle();
  assert.ok(!screen.paused && !phone.paused);
});

test("ready clips stay at the beginning until the logo intro finishes", async (t) => {
  const { screen, phone, finishIntro } = setup(t);
  screen.ready(); phone.ready(); await settle();
  assert.ok(screen.paused && phone.paused);
  assert.equal(screen.currentTime, 0);
  assert.equal(phone.currentTime, 0);
  assert.equal(screen.starts, 0);
  assert.equal(phone.starts, 0);
  finishIntro(); await settle();
  assert.ok(!screen.paused && !phone.paused);
  assert.equal(screen.starts, 1);
  assert.equal(phone.starts, 1);
  finishIntro(); await settle();
  assert.equal(screen.starts, 1);
  assert.equal(phone.starts, 1);
});
