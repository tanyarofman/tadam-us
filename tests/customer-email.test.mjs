import { test } from "node:test";
import assert from "node:assert/strict";
import { customerEmailHtml } from "../netlify/lib/notify.mjs";

test("customer HTML email keeps the wording, escapes input and uses the PNG logo", () => {
  const html = customerEmailHtml({ "order-id": "TD-1", package: "vip", "game-title": "<b>Emma</b>" });
  assert.match(html, /https:\/\/tadamevents\.com\/brand\/tadam-logo-email\.png/);
  assert.match(html, /TD-1/);
  assert.match(html, /VIP/);
  assert.match(html, /&lt;b&gt;Emma/);
  assert.doesNotMatch(html, /<b>Emma/);
  assert.match(html, /Your receipt comes separately from Paddle/);
  assert.match(html, /PADDLE\.NET\* VELONOVA/);
  assert.match(html, /Just reply to this email/);
  assert.doesNotMatch(html, /[–—]/);
});
