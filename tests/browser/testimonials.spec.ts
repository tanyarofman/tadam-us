import { test, expect, type Page } from '@playwright/test';

async function ready(page: Page) {
  await page.goto('/');
  await expect(page.locator('[data-preloader]')).toHaveCount(0);
  await expect(page.locator('#closing')).toHaveAttribute('data-scroll-hold', '');
}

async function scrollReview(page: Page, progress: number) {
  await page.locator('#testimonials').evaluate((section, progress) => {
    const pin = section.querySelector('.testimonials-pin') as HTMLElement;
    const start = section.getBoundingClientRect().top + scrollY;
    scrollTo({ top: start + (section.clientHeight - pin.offsetHeight) * progress, behavior: 'instant' });
  }, progress);
}

async function reviewIsActive(page: Page, index: number) {
  const cards = page.locator('.testimonial');
  await expect(cards.nth(index)).toHaveCSS('opacity', '1');
  await expect(cards.nth(index)).toBeVisible();
  for (let i = 0; i < 3; i++) {
    if (i !== index) await expect(cards.nth(i)).toBeHidden();
  }
  // Quote, photo/name, title and the aggregate stay within the reading screen.
  for (const locator of [cards.nth(index), page.locator('#testimonials-title'), page.locator('.rating-summary')]) {
    await expect(locator).toBeInViewport({ ratio: 1 });
    await expect(locator).toHaveCSS('opacity', '1');
  }
}

test('mobile reviews replace each other while pinned, reverse and release', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile scroll sequence');
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await ready(page);
  await expect(page.locator('#testimonials')).toHaveClass(/is-replacing/);
  await scrollReview(page, 0.1);
  await reviewIsActive(page, 0);
  const centerOffset = await page.locator('.testimonials-pin > .container').evaluate(el => {
    const box = el.getBoundingClientRect();
    return Math.abs(box.top + box.height / 2 - innerHeight / 2);
  });
  expect(centerOffset).toBeLessThan(2);
  const top = (await page.locator('.testimonials-pin').boundingBox())!.y;
  await scrollReview(page, 0.5);
  await reviewIsActive(page, 1);
  expect((await page.locator('.testimonials-pin').boundingBox())!.y).toBeCloseTo(top, 0);
  await scrollReview(page, 0.9);
  await reviewIsActive(page, 2);
  await expect(page.locator('.rating-summary')).toHaveText('5/5 from these 3 customer reviews');
  await scrollReview(page, 0.5);
  await reviewIsActive(page, 1);
  await scrollReview(page, 0.1);
  await reviewIsActive(page, 0);
  await scrollReview(page, 1.15);
  await expect(page.locator('#closing')).toBeInViewport();
  expect(await page.locator('.testimonials-pin').evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(-20);
  expect(errors).toEqual([]);
});

test('small phones and landscape keep complete reviews readable', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Small mobile viewports');
  await page.setViewportSize({ width: 320, height: 568 });
  await ready(page);
  for (const [index, progress] of [0.1, 0.5, 0.9].entries()) {
    await scrollReview(page, progress);
    await reviewIsActive(page, index);
  }
  await page.setViewportSize({ width: 844, height: 390 });
  await expect.poll(() => page.locator('.testimonials-pin').evaluate(el => el.clientHeight)).toBeLessThan(450);
  for (const [index, progress] of [0.1, 0.5, 0.9].entries()) {
    await scrollReview(page, progress);
    await reviewIsActive(page, index);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('desktop keeps all reviews together, and resizing restores their layout', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Desktop and resize behavior');
  await ready(page);
  await page.locator('#testimonials').scrollIntoViewIfNeeded();
  await expect(page.locator('#testimonials')).toHaveAttribute('data-scroll-hold', '');
  await expect(page.locator('#testimonials')).not.toHaveClass(/is-replacing/);
  const cards = page.locator('.testimonial');
  for (const card of await cards.all()) await expect(card).toHaveCSS('opacity', '1');
  const boxes = await cards.evaluateAll(els => els.map(el => el.getBoundingClientRect().toJSON()));
  expect(boxes[1].left).toBeGreaterThan(boxes[0].right);
  expect(boxes[2].left).toBeGreaterThan(boxes[1].right);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('#testimonials')).toHaveClass(/is-replacing/);
  await scrollReview(page, 0.5);
  await reviewIsActive(page, 1);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator('#testimonials')).toHaveAttribute('data-scroll-hold', '');
  await expect(page.locator('#testimonials')).not.toHaveClass(/mobile-sticky-scene|is-replacing/);
  for (const card of await cards.all()) {
    await expect(card).toBeVisible();
    await expect(card).toHaveCSS('opacity', '1');
    await expect(card).toHaveCSS('transform', 'none');
  }
});

test('direct links and reduced motion show every review in a reading layout', async ({ page, isMobile }) => {
  for (const reduced of [false, true]) {
    await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
    await page.goto('/#testimonials');
    await expect(page.locator('#testimonials')).toHaveClass(/section-revealed/);
    await expect(page.locator('#testimonials')).not.toHaveClass(/is-replacing|mobile-sticky-scene/);
    const cards = page.locator('.testimonial');
    for (const card of await cards.all()) {
      await expect(card).toBeVisible();
      await expect(card).toHaveCSS('opacity', '1');
    }
    if (isMobile) {
      const boxes = await cards.evaluateAll(els => els.map(el => el.getBoundingClientRect().toJSON()));
      expect(boxes[1].top).toBeGreaterThan(boxes[0].bottom);
      expect(boxes[2].top).toBeGreaterThan(boxes[1].bottom);
    }
  }
});
