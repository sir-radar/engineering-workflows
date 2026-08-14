import type { Page, Route } from '@playwright/test';

export async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

export async function mockOffline(page: Page, pattern: string | RegExp) {
  await page.route(pattern, (route) => route.abort('internetdisconnected'));
}

export function deferred() {
  let release!: () => void;
  const promise = new Promise<void>((resolve) => {
    release = resolve;
  });
  return { promise, release };
}

export async function fulfillAfter(
  route: Route,
  gate: Promise<void>,
  body: unknown,
  status = 200,
) {
  await gate;
  await fulfillJson(route, body, status);
}
