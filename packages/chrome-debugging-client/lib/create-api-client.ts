import {
  IAPIClient,
  IHTTPClient,
  ITabResponse,
  IVersionResponse,
} from "./types";

export default function createAPIClient(httpClient: IHTTPClient): IAPIClient {
  return new APIClient(httpClient);
}

class APIClient implements IAPIClient {
  private httpClient: IHTTPClient;

  constructor(httpClient: IHTTPClient) {
    this.httpClient = httpClient;
  }

  public async version(): Promise<IVersionResponse> {
    const body = await this.httpClient.get("/json/version");
    return JSON.parse(body) as IVersionResponse;
  }

  public async listTabs(): Promise<ITabResponse[]> {
    const body = await this.httpClient.get("/json/list");
    return JSON.parse(body) as ITabResponse[];
  }

  public async newTab(url?: string): Promise<ITabResponse> {
    let path = "/json/new";
    if (url) {
      path += "?" + encodeURIComponent(url);
    }
    const body = await this.httpClient.get(path);
    return JSON.parse(body) as ITabResponse;
  }

  public async activateTab(tabId: string): Promise<void> {
    const path = "/json/activate/" + tabId;
    await this.httpClient.get(path);
    return;
  }

  public async closeTab(tabId: string): Promise<void> {
    const path = "/json/close/" + tabId;
    await this.httpClient.get(path);
    return;
  }
}
