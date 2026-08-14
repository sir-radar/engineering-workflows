import { expect, test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      const fixedNow = new Date('2025-01-15T12:00:00.000Z').valueOf();
      Date.now = () => fixedNow;
      Math.random = () => 0.42;
    });
    await use(page);
  },
});

export { expect };

export async function waitForVisualReadiness(page: import('@playwright/test').Page) {
  await page.waitForFunction(async () => {
    await document.fonts.ready;
    const fontsReady = [...document.fonts].every((font) => font.status === 'loaded');
    const imagesReady = [...document.images].every(
      (image) => image.complete && image.naturalWidth > 0,
    );
    return fontsReady && imagesReady;
  });
}
