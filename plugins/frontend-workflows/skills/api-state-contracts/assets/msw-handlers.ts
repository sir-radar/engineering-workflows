import { delay, http, HttpResponse } from 'msw';

export function createResourceHandlers(baseUrl: string) {
  return {
    success: http.get(`${baseUrl}/resources`, () =>
      HttpResponse.json({ items: [{ id: 'resource-1', name: 'Example' }] }),
    ),
    empty: http.get(`${baseUrl}/resources`, () => HttpResponse.json({ items: [] })),
    malformed: http.get(`${baseUrl}/resources`, () =>
      HttpResponse.json({ items: 'not-an-array' }),
    ),
    slow: http.get(`${baseUrl}/resources`, async () => {
      await delay(2_000);
      return HttpResponse.json({ items: [{ id: 'resource-1', name: 'Example' }] });
    }),
    failure: http.get(`${baseUrl}/resources`, () =>
      HttpResponse.json({ message: 'Unavailable' }, { status: 503 }),
    ),
  };
}
