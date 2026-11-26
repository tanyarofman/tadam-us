import { test, expect } from '@playwright/test';

test('Watch the demo plays Tom with sound and closes at the same position', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-preloader]')).toHaveCount(0);
  await expect(page.locator('#closing')).toHaveAttribute('data-scroll-hold', '');
  const trigger = page.getByRole('link', { name: 'Watch the demo', exact: true });
  await trigger.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const before = await page.evaluate(() => ({ y: scrollY, url: location.href }));
  await trigger.click();

  const modal = page.locator('#demo-modal');
  const video = modal.locator('video');
  await expect(modal).toBeVisible();
  await expect(modal.locator('source')).toHaveAttribute('src', '/demo/tadam-tom-demo-16x9.mp4');
  await expect(modal.getByRole('heading', { name: 'Demo Video' })).toBeFocused();
  await expect(modal.getByRole('button', { name: 'Close', exact: true })).toHaveCSS('outline-style', 'none');
  await expect(modal.locator('.dm-caption')).toHaveCount(0);
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && !v.muted && v.currentTime > 0)).toBe(true);
  expect(await video.evaluate((v: HTMLVideoElement) => [v.videoWidth, v.videoHeight])).toEqual([1920, 1080]);
  expect(await video.evaluate((v: HTMLVideoElement) => v.duration)).toBeCloseTo(93.266, 1);
  expect(await page.evaluate(() => location.href)).toBe(before.url);
  expect(Math.abs(await page.evaluate(() => scrollY) - before.y)).toBeLessThan(2);

  await modal.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(modal).not.toBeVisible();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await expect.poll(async () => Math.abs(await page.evaluate(() => scrollY) - before.y)).toBeLessThan(2);
  await expect(trigger).toBeFocused();

  // The separate scrolling player loads the same recording and still starts muted.
  const inline = page.locator('#scene-3 .s3-vid');
  await expect(inline.locator('source')).toHaveAttribute('src', '/demo/tadam-tom-demo-16x9.mp4');
  expect(await inline.evaluate((v: HTMLVideoElement) => v.muted)).toBe(true);
  await page.locator('#scene-3').evaluate(section => {
    const pin = section.querySelector('.scene-pin') as HTMLElement;
    scrollTo({ top: section.getBoundingClientRect().top + scrollY + (section.clientHeight - pin.offsetHeight) * 0.92, behavior: 'instant' });
  });
  await expect.poll(() => inline.evaluate((v: HTMLVideoElement) => !v.paused && v.muted && v.currentTime > 0)).toBe(true);
  expect(await inline.evaluate((v: HTMLVideoElement) => [v.videoWidth, v.videoHeight])).toEqual([1920, 1080]);
  expect(await inline.evaluate((v: HTMLVideoElement) => v.duration)).toBeCloseTo(93.266, 1);
});

test('direct demo links keep the page locked through the intro and support keyboard closing', async ({ page }) => {
  await page.goto('/#demo');
  const modal = page.locator('#demo-modal');
  await expect(modal).toBeVisible();
  await expect(page.locator('[data-preloader]')).toHaveCount(0);
  await expect(page.locator('#closing')).toHaveAttribute('data-scroll-hold', '');
  await expect(page.locator('html')).toHaveCSS('overflow-y', 'hidden');
  await expect(modal.getByRole('heading', { name: 'Demo Video' })).toBeFocused();
  await page.keyboard.press('Tab');
  const close = modal.getByRole('button', { name: 'Close', exact: true });
  await expect(close).toBeFocused();
  await expect(close).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Escape');
  await expect(modal).not.toBeVisible();
  await expect(page.locator('html')).not.toHaveCSS('overflow-y', 'hidden');
  await expect.poll(() => modal.locator('video').evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});

test('closing while playback is pending does not restart the hidden video', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLMediaElement.prototype.play;
    const state = { attempts: 0, reject: null as null | ((error: DOMException) => void) };
    (window as any).demoPlayback = state;
    HTMLMediaElement.prototype.play = function () {
      if (!this.hasAttribute('data-demo-video')) return original.call(this);
      state.attempts++;
      return new Promise<void>((_resolve, reject) => { state.reject = reject; });
    };
  });
  await page.goto('/');
  await expect(page.locator('[data-preloader]')).toHaveCount(0);
  await page.getByRole('link', { name: 'Watch the demo', exact: true }).click();
  const modal = page.locator('#demo-modal');
  await expect(modal).toBeVisible();
  await modal.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(modal).not.toBeVisible();
  await page.evaluate(async () => {
    (window as any).demoPlayback.reject(new DOMException('Playback blocked', 'NotAllowedError'));
    await Promise.resolve();
  });
  expect(await page.evaluate(() => (window as any).demoPlayback.attempts)).toBe(1);
  expect(await modal.locator('video').evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});
