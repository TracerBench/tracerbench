import type { ProtocolConnection } from 'chrome-debugging-client';
import type { Protocol } from 'devtools-protocol';
import type { RaceCancellation } from 'race-cancellation';

export interface PageSetupOptions {
  cookies: Protocol.Network.CookieParam[];
  cpuThrottlingRate: number;
  emulateNetworkConditions: Protocol.Network.EmulateNetworkConditionsRequest;
  deviceMetricsOverride: Protocol.Emulation.SetDeviceMetricsOverrideRequest;
  userAgentOverride: Protocol.Emulation.SetUserAgentOverrideRequest;
}

export default async function setupPage(
  page: ProtocolConnection,
  raceCancel: RaceCancellation,
  options: Partial<PageSetupOptions> = {}
): Promise<void> {
  const {
    cpuThrottlingRate = 0,
    emulateNetworkConditions,
    deviceMetricsOverride,
    userAgentOverride,
    cookies
  } = options;
  await Promise.all([
    page.send('Page.enable', undefined, raceCancel),
    page.send('Performance.enable', undefined, raceCancel)
  ]);
  if (cookies !== undefined) {
    await page.send('Network.setCookies', { cookies }, raceCancel);
  }
  if (deviceMetricsOverride !== undefined) {
    await page.send(
      'Emulation.setDeviceMetricsOverride',
      deviceMetricsOverride,
      raceCancel
    );
  }
  if (userAgentOverride !== undefined) {
    await page.send(
      'Emulation.setUserAgentOverride',
      userAgentOverride,
      raceCancel
    );
  }
  if (cpuThrottlingRate > 0) {
    await page.send('Emulation.setCPUThrottlingRate', {
      rate: cpuThrottlingRate
    });
  }
  if (emulateNetworkConditions !== undefined) {
    // needs to be enabled for throttling
    await page.send('Network.enable', { maxTotalBufferSize: 0 }, raceCancel);
    await page.send(
      'Network.emulateNetworkConditions',
      emulateNetworkConditions,
      raceCancel
    );
  }
}
