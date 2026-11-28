import { test, expect, type Page } from '@playwright/test';

const sequences = [
  { id: 'demos', selector: '.demo-card', stops: [0.1, 0.5, 0.9] },
  { id: 'pricing', selector: '.packages > article', stops: [0.2, 0.8] },
];

async function ready(page: Page) {
  await page.goto('/');
  await expect(page.locator('[data-preloader]')).toHaveCount(0);
  await expect(page.locator('#closing')).toHaveAttribute('data-scroll-hold', '');
}

async function scrollCard(page: Page, id: string, progress: number) {
  await page.locator(`#${id}`).evaluate((section, progress) => {
    const pin = section.querySelector('[data-scroll-pause]') as HTMLElement;
    scrollTo({ top: section.getBoundingClientRect().top + scrollY + (section.clientHeight - pin.offsetHeight) * progress, behavior: 'instant' });
  }, progress);
}

async function activeCard(page: Page, id: string, selector: string, index: number) {
  const section = page.locator(`#${id}`);
  const cards = section.locator(selector);
  await expect(cards.nth(index)).toHaveCSS('opacity', '1');
  await expect(cards.nth(index)).toBeInViewport({ ratio: 1 });
  for (let i = 0; i < await cards.count(); i++) {
    if (i !== index) await expect(cards.nth(i)).toBeHidden();
  }
  await expect(section.getByRole('heading', { level: 2 })).toBeInViewport({ ratio: 1 });
  await expect(section.getByRole('heading', { level: 2 })).toHaveCSS('opacity', '1');
  const link = id === 'demos' ? cards.nth(index) : cards.nth(index).locator('a');
  await link.click({ trial: true });
}

test('mobile demo and pricing cards replace, reverse and release on scroll', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile card sequences');
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await ready(page);
  for (const { id, selector, stops } of sequences) {
    await expect(page.locator(`#${id}`)).toHaveClass(/is-replacing/);
    for (const [index, progress] of stops.entries()) {
      await scrollCard(page, id, progress);
      await activeCard(page, id, selector, index);
      expect((await page.locator(`#${id} > [data-scroll-pause]`).boundingBox())!.y).toBeCloseTo(0, 0);
    }
    await scrollCard(page, id, stops[0]);
    await activeCard(page, id, selector, 0);
    await scrollCard(page, id, 1.2);
    expect((await page.locator(`#${id} > [data-scroll-pause]`).boundingBox())!.y).toBeLessThan(-20);
  }
  expect(errors).toEqual([]);
});

test('small phones and landscape show the full demo or package including its CTA', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Small mobile layouts');
  await page.setViewportSize({ width: 320, height: 568 });
  await ready(page);
  for (const size of [{ width: 320, height: 568 }, { width: 375, height: 650 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(size);
    // Allow ScrollTrigger's debounced resize to update the preceding scenes.
    await expect.poll(() => page.locator('#demos > [data-scroll-pause]').evaluate(el => el.clientHeight)).toBeLessThan(size.height + 10);
    for (const { id, selector, stops } of sequences) {
      for (const [index, progress] of stops.entries()) {
        await scrollCard(page, id, progress);
        await activeCard(page, id, selector, index);
        if (id === 'demos') {
          const media = await page.locator('.demo-card').nth(index).evaluate(card => {
            const photo = card.querySelector('.demo-photo') as HTMLElement;
            const image = photo.querySelector('img')!;
            return { card: card.clientWidth, photo: photo.clientWidth, image: image.clientWidth, photoHeight: photo.clientHeight, imageHeight: image.clientHeight };
          });
          expect(Math.abs(media.photo - (size.width < size.height ? media.card : media.card / 2))).toBeLessThan(2);
          expect(Math.abs(media.image - media.photo)).toBeLessThan(2);
          expect(Math.abs(media.imageHeight - media.photoHeight)).toBeLessThan(2);
        }
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('active demo and package links keep their destinations', async ({ page, context, isMobile }) => {
  test.skip(!isMobile, 'Links inside mobile sequences');
  await ready(page);
  const destinations = ['friends-demo', 'stranger-things-demo', 'the-simpsons-demo'];
  await context.route('https://tadamevents.com/*-demo', route => route.fulfill({ contentType: 'text/html', body: 'Demo destination' }));
  for (const [index, progress] of sequences[0].stops.entries()) {
    await scrollCard(page, 'demos', progress);
    await activeCard(page, 'demos', '.demo-card', index);
    const popupPromise = page.waitForEvent('popup');
    await page.locator('.demo-card').nth(index).click();
    const popup = await popupPromise;
    await expect(popup).toHaveURL(`https://tadamevents.com/${destinations[index]}`);
    await popup.close();
  }
  for (const [index, progress] of sequences[1].stops.entries()) {
    await scrollCard(page, 'pricing', progress);
    await activeCard(page, 'pricing', '.packages > article', index);
    await page.locator('.package').nth(index).locator('.price-num').click();
    await expect(page).toHaveURL(/\/create\/?(?:#.*)?$/);
    if (index === 0) await ready(page);
  }
});

test('desktop keeps the rows and restores them after resizing', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Desktop layout');
  await ready(page);
  for (const { id, selector } of sequences) {
    const section = page.locator(`#${id}`);
    await expect(section).toHaveAttribute('data-scroll-hold', '');
    await expect(section).not.toHaveClass(/is-replacing/);
    const boxes = await section.locator(selector).evaluateAll(els => els.map(el => el.getBoundingClientRect().toJSON()));
    expect(boxes[1].left).toBeGreaterThan(boxes[0].right);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const { id, selector, stops } of sequences) {
    await expect(page.locator(`#${id}`)).toHaveClass(/is-replacing/);
    await scrollCard(page, id, stops[1]);
    await activeCard(page, id, selector, 1);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const { id, selector } of sequences) {
    await expect(page.locator(`#${id}`)).not.toHaveClass(/is-replacing|mobile-sticky-scene/);
    for (const card of await page.locator(`#${id} ${selector}`).all()) {
      await expect(card).toBeVisible();
      await expect(card).toHaveCSS('opacity', '1');
      await expect(card).toHaveCSS('transform', 'none');
    }
  }
});

test('reduced motion leaves demo and pricing options in the normal reading layout', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('[data-preloader]')).toHaveCount(0);
  for (const { id, selector } of sequences) {
    await expect(page.locator(`#${id}`)).not.toHaveClass(/is-replacing|mobile-sticky-scene/);
    for (const card of await page.locator(`#${id} ${selector}`).all()) {
      await card.scrollIntoViewIfNeeded();
      await expect(card).toBeVisible();
    }
  }
});
