import { expect, type Locator, type Page } from '@playwright/test';

export async function verifyModalKeyboard({
  page,
  trigger,
  dialog,
  close,
}: {
  page: Page;
  trigger: Locator;
  dialog: Locator;
  close: Locator;
}) {
  await trigger.focus();
  await trigger.press('Enter');
  await expect(dialog).toBeVisible();
  await expect
    .poll(() => dialog.evaluate((element) => element.contains(document.activeElement)))
    .toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  await close.click();
  await expect(trigger).toBeFocused();
}

export async function verifyTabsKeyboard(tabs: Locator) {
  const items = tabs.getByRole('tab');
  await items.first().focus();
  await items.first().press('ArrowRight');
  await expect(items.nth(1)).toBeFocused();
  await items.nth(1).press('Home');
  await expect(items.first()).toBeFocused();
  await items.first().press('End');
  await expect(items.last()).toBeFocused();
}

export async function verifyDisclosureKeyboard(trigger: Locator, region: Locator) {
  await trigger.focus();
  await trigger.press('Space');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(region).toBeVisible();
  await trigger.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(region).toBeHidden();
}

export async function verifyPopupDismissal({
  page,
  trigger,
  popup,
}: {
  page: Page;
  trigger: Locator;
  popup: Locator;
}) {
  await trigger.focus();
  await trigger.press('Enter');
  await expect(popup).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(popup).toBeHidden();
  await expect(trigger).toBeFocused();
}

// Combobox and menu behavior varies by the selected APG model. Build their
// assertions from the exact keyboard contract instead of assuming one model.
