import { ProtocolConnection } from 'chrome-debugging-client';
import Protocol from 'devtools-protocol';
import type { RaceCancellation } from 'race-cancellation';

export default async function navigate(
  page: ProtocolConnection,
  url: string,
  raceCancellation: RaceCancellation
): Promise<Protocol.Page.NavigateResponse> {
  const [, navigateResponse] = await Promise.all([
    page.until('Page.loadEventFired', undefined, raceCancellation),
    page.send(
      'Page.navigate',
      {
        url
      },
      raceCancellation
    )
  ]);

  if (navigateResponse.errorText) {
    throw new Error(navigateResponse.errorText);
  }

  return navigateResponse;
}
