import { test, expect, type Page } from '@playwright/test';

async function ready(page: Page) {
  await expect(page.locator('[data-preloader]')).toHaveCount(0);
  await expect(page.locator('#testimonials')).toHaveAttribute('data-scroll-hold', '');
}
async function arrived(page: Page, selector: string) {
  await expect.poll(async () => Math.abs((await page.locator(selector).boundingBox())!.y), { timeout: 10_000 }).toBeLessThan(2);
}
async function revealed(page: Page, selector: string) {
  for (const item of await page.locator(selector).all()) {
    await expect(item).toHaveCSS('opacity', '1');
    await expect(item).toHaveCSS('transform', 'none');
  }
}

test('header and footer anchors open the full steps and both packages', async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await ready(page);
  // Natural scrolling retains the original scene before a section link is used.
  await expect(page.locator('#scene-4')).toHaveClass(/is-pinned/);
  const nav = isMobile ? page.locator('.site-footer') : page.locator('.hero-nav');
  await nav.getByRole('link', { name: /How it works/i }).click();
  await arrived(page, '#scene-4');
  await revealed(page, '#scene-4 .step-card');
  await expect(page.locator('#scene-4')).not.toHaveClass(/is-pinned/);
  const boxes = await page.locator('.step-card').evaluateAll(els => els.map(el => el.getBoundingClientRect().toJSON()));
  if (isMobile) expect(boxes[1].top).toBeGreaterThanOrEqual(boxes[0].bottom);
  else expect(boxes[1].left).toBeGreaterThanOrEqual(boxes[0].right);

  await page.locator('.site-footer').getByRole('link', { name: 'Pricing', exact: true }).click();
  await arrived(page, '#pricing');
  await revealed(page, '#pricing .reveal');
  await expect(page.locator('.package')).toHaveCount(2);
  await expect(page.getByRole('article', { name: 'Basic' })).toContainText('$59');
  await expect(page.getByRole('article', { name: 'VIP' })).toContainText('$99');
  for (const button of await page.locator('.pricing-cta').all()) await expect(button).toHaveAttribute('href', '/create');
  await page.getByRole('link', { name: 'Start Now with Basic' }).click();
  await expect(page).toHaveURL(/\/create\/?$/);
  // Also cover links arriving from a secondary page, after delayed scene initialization.
  await page.locator('.site-footer').getByRole('link', { name: /How it works/i }).click();
  await ready(page);
  await arrived(page, '#scene-4');
  await revealed(page, '#scene-4 .step-card');
  expect(errors).toEqual([]);
});

test('direct pricing hash, demo destinations, assets, FAQ and testimonial order', async ({ page }) => {
  await page.goto('/#pricing');
  await ready(page);
  await arrived(page, '#pricing');
  await revealed(page, '#pricing .reveal');
  await page.locator('.site-footer').getByRole('link', { name: 'Live Demos' }).click();
  await arrived(page, '#demos');
  const demos = page.locator('.demo-card');
  await expect(demos).toHaveCount(3);
  const urls = ['friends-demo', 'harry-potter-demo', 'the-simpsons-demo'];
  for (let i = 0; i < 3; i++) {
    await expect(demos.nth(i)).toHaveAttribute('href', `https://tadamevents.com/${urls[i]}`);
    await expect(demos.nth(i)).toHaveAttribute('target', '_blank');
    // Bring each lazy image into view on stacked mobile layouts.
    await demos.nth(i).scrollIntoViewIfNeeded();
    await expect.poll(() => demos.nth(i).locator('img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  await expect(page.locator('.hero-home .logo-full')).toHaveAttribute('src', '/brand/tadam-logo-navigation.webp');
  await expect(page.locator('.footer-logo img')).toHaveAttribute('src', '/brand/tadam-logo-navigation.webp');
  const order = await page.locator('main > section[id]').evaluateAll(els => els.map(el => el.id));
  expect(order.indexOf('testimonials')).toBe(order.indexOf('faq') + 1);
  expect(order.indexOf('closing')).toBe(order.indexOf('testimonials') + 1);
  await expect(page.locator('#testimonials-note')).toContainText('fictional');
  await page.locator('.site-footer').getByRole('link', { name: 'FAQ', exact: true }).click();
  await arrived(page, '#faq');
  await page.getByText('Can we see an example first?', { exact: true }).click();
  await page.getByRole('link', { name: '3 demos', exact: true }).click();
  await arrived(page, '#demos');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('reduced motion leaves every step readable on a direct link', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#scene-4');
  await expect(page.locator('#scene-4')).toHaveClass(/section-revealed/);
  await arrived(page, '#scene-4');
  await revealed(page, '#scene-4 .step-card');
  await expect(page.locator('.mobile-sticky-scene')).toHaveCount(0);
});
