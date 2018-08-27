/**
 * Debugging Protocol 1.2 Domains
 * Generated on Mon Aug 20 2018 10:05:40 GMT-0700 (PDT)
 */
/* tslint:disable */
import { IDebuggingProtocolClient } from "../lib/types";
/** Actions and events related to the inspected page belong to the page domain. */
export class Page {
  private _domContentEventFired: Page.DomContentEventFiredHandler | null = null;
  private _loadEventFired: Page.LoadEventFiredHandler | null = null;
  private _frameAttached: Page.FrameAttachedHandler | null = null;
  private _frameNavigated: Page.FrameNavigatedHandler | null = null;
  private _frameDetached: Page.FrameDetachedHandler | null = null;
  private _javascriptDialogOpening: Page.JavascriptDialogOpeningHandler | null = null;
  private _javascriptDialogClosed: Page.JavascriptDialogClosedHandler | null = null;
  private _interstitialShown: Page.InterstitialShownHandler | null = null;
  private _interstitialHidden: Page.InterstitialHiddenHandler | null = null;
  private _navigationRequested: Page.NavigationRequestedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables page domain notifications. */
  public enable() {
    return this._client.send<void>("Page.enable");
  }
  /** Disables page domain notifications. */
  public disable() {
    return this._client.send<void>("Page.disable");
  }
  /** Reloads given page optionally ignoring the cache. */
  public reload(params: Page.ReloadParameters) {
    return this._client.send<void>("Page.reload", params);
  }
  /** Navigates current page to the given URL. */
  public navigate(params: Page.NavigateParameters) {
    return this._client.send<Page.NavigateReturn>("Page.navigate", params);
  }
  /** Overrides the Geolocation Position or Error. Omitting any of the parameters emulates position unavailable. */
  public setGeolocationOverride(params: Page.SetGeolocationOverrideParameters) {
    return this._client.send<void>("Page.setGeolocationOverride", params);
  }
  /** Clears the overriden Geolocation Position and Error. */
  public clearGeolocationOverride() {
    return this._client.send<void>("Page.clearGeolocationOverride");
  }
  /** Accepts or dismisses a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload). */
  public handleJavaScriptDialog(params: Page.HandleJavaScriptDialogParameters) {
    return this._client.send<void>("Page.handleJavaScriptDialog", params);
  }
  get domContentEventFired() {
    return this._domContentEventFired;
  }
  set domContentEventFired(handler) {
    if (this._domContentEventFired) {
      this._client.removeListener("Page.domContentEventFired", this._domContentEventFired);
    }
    this._domContentEventFired = handler;
    if (handler) {
      this._client.on("Page.domContentEventFired", handler);
    }
  }
  get loadEventFired() {
    return this._loadEventFired;
  }
  set loadEventFired(handler) {
    if (this._loadEventFired) {
      this._client.removeListener("Page.loadEventFired", this._loadEventFired);
    }
    this._loadEventFired = handler;
    if (handler) {
      this._client.on("Page.loadEventFired", handler);
    }
  }
  /** Fired when frame has been attached to its parent. */
  get frameAttached() {
    return this._frameAttached;
  }
  set frameAttached(handler) {
    if (this._frameAttached) {
      this._client.removeListener("Page.frameAttached", this._frameAttached);
    }
    this._frameAttached = handler;
    if (handler) {
      this._client.on("Page.frameAttached", handler);
    }
  }
  /** Fired once navigation of the frame has completed. Frame is now associated with the new loader. */
  get frameNavigated() {
    return this._frameNavigated;
  }
  set frameNavigated(handler) {
    if (this._frameNavigated) {
      this._client.removeListener("Page.frameNavigated", this._frameNavigated);
    }
    this._frameNavigated = handler;
    if (handler) {
      this._client.on("Page.frameNavigated", handler);
    }
  }
  /** Fired when frame has been detached from its parent. */
  get frameDetached() {
    return this._frameDetached;
  }
  set frameDetached(handler) {
    if (this._frameDetached) {
      this._client.removeListener("Page.frameDetached", this._frameDetached);
    }
    this._frameDetached = handler;
    if (handler) {
      this._client.on("Page.frameDetached", handler);
    }
  }
  /** Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) is about to open. */
  get javascriptDialogOpening() {
    return this._javascriptDialogOpening;
  }
  set javascriptDialogOpening(handler) {
    if (this._javascriptDialogOpening) {
      this._client.removeListener("Page.javascriptDialogOpening", this._javascriptDialogOpening);
    }
    this._javascriptDialogOpening = handler;
    if (handler) {
      this._client.on("Page.javascriptDialogOpening", handler);
    }
  }
  /** Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) has been closed. */
  get javascriptDialogClosed() {
    return this._javascriptDialogClosed;
  }
  set javascriptDialogClosed(handler) {
    if (this._javascriptDialogClosed) {
      this._client.removeListener("Page.javascriptDialogClosed", this._javascriptDialogClosed);
    }
    this._javascriptDialogClosed = handler;
    if (handler) {
      this._client.on("Page.javascriptDialogClosed", handler);
    }
  }
  /** Fired when interstitial page was shown */
  get interstitialShown() {
    return this._interstitialShown;
  }
  set interstitialShown(handler) {
    if (this._interstitialShown) {
      this._client.removeListener("Page.interstitialShown", this._interstitialShown);
    }
    this._interstitialShown = handler;
    if (handler) {
      this._client.on("Page.interstitialShown", handler);
    }
  }
  /** Fired when interstitial page was hidden */
  get interstitialHidden() {
    return this._interstitialHidden;
  }
  set interstitialHidden(handler) {
    if (this._interstitialHidden) {
      this._client.removeListener("Page.interstitialHidden", this._interstitialHidden);
    }
    this._interstitialHidden = handler;
    if (handler) {
      this._client.on("Page.interstitialHidden", handler);
    }
  }
  /** Fired when a navigation is started if navigation throttles are enabled.  The navigation will be deferred until processNavigation is called. */
  get navigationRequested() {
    return this._navigationRequested;
  }
  set navigationRequested(handler) {
    if (this._navigationRequested) {
      this._client.removeListener("Page.navigationRequested", this._navigationRequested);
    }
    this._navigationRequested = handler;
    if (handler) {
      this._client.on("Page.navigationRequested", handler);
    }
  }
}
export namespace Page {
  /** Resource type as it was perceived by the rendering engine. */
  export type ResourceType = "Document" | "Stylesheet" | "Image" | "Media" | "Font" | "Script" | "TextTrack" | "XHR" | "Fetch" | "EventSource" | "WebSocket" | "Manifest" | "Other";
  /** Unique frame identifier. */
  export type FrameId = string;
  /** Information about the Frame on the page. */
  export interface Frame {
    /** Frame unique identifier. */
    id: string;
    /** Parent frame identifier. */
    parentId?: string;
    /** Identifier of the loader associated with this frame. */
    loaderId: Network.LoaderId;
    /** Frame's name as specified in the tag. */
    name?: string;
    /** Frame document's URL. */
    url: string;
    /** Frame document's security origin. */
    securityOrigin: string;
    /** Frame document's mimeType as determined by the browser. */
    mimeType: string;
  }
  export type DialogType = any;
  export type DomContentEventFiredParameters = {
    timestamp: number;
  };
  export type DomContentEventFiredHandler = (params: DomContentEventFiredParameters) => void;
  export type LoadEventFiredParameters = {
    timestamp: number;
  };
  export type LoadEventFiredHandler = (params: LoadEventFiredParameters) => void;
  export type FrameAttachedParameters = {
    /** Id of the frame that has been attached. */
    frameId: FrameId;
    /** Parent frame identifier. */
    parentFrameId: FrameId;
  };
  export type FrameAttachedHandler = (params: FrameAttachedParameters) => void;
  export type FrameNavigatedParameters = {
    /** Frame object. */
    frame: Frame;
  };
  export type FrameNavigatedHandler = (params: FrameNavigatedParameters) => void;
  export type FrameDetachedParameters = {
    /** Id of the frame that has been detached. */
    frameId: FrameId;
  };
  export type FrameDetachedHandler = (params: FrameDetachedParameters) => void;
  export type JavascriptDialogOpeningParameters = {
    /** Message that will be displayed by the dialog. */
    message: string;
    /** Dialog type. */
    type: DialogType;
  };
  export type JavascriptDialogOpeningHandler = (params: JavascriptDialogOpeningParameters) => void;
  export type JavascriptDialogClosedParameters = {
    /** Whether dialog was confirmed. */
    result: boolean;
  };
  export type JavascriptDialogClosedHandler = (params: JavascriptDialogClosedParameters) => void;
  export type InterstitialShownHandler = () => void;
  export type InterstitialHiddenHandler = () => void;
  export type NavigationRequestedParameters = {
    /** Whether the navigation is taking place in the main frame or in a subframe. */
    isInMainFrame: boolean;
    /** Whether the navigation has encountered a server redirect or not. */
    isRedirect: boolean;
    navigationId: number;
    /** URL of requested navigation. */
    url: string;
  };
  export type NavigationRequestedHandler = (params: NavigationRequestedParameters) => void;
  export type ReloadParameters = {
    /** If true, browser cache is ignored (as if the user pressed Shift+refresh). */
    ignoreCache?: boolean;
    /** If set, the script will be injected into all frames of the inspected page after reload. */
    scriptToEvaluateOnLoad?: string;
  };
  export type NavigateParameters = {
    /** URL to navigate the page to. */
    url: string;
  };
  export type NavigateReturn = {
    /** Frame id that will be navigated. */
    frameId: FrameId;
  };
  export type SetGeolocationOverrideParameters = {
    /** Mock latitude */
    latitude?: number;
    /** Mock longitude */
    longitude?: number;
    /** Mock accuracy */
    accuracy?: number;
  };
  export type HandleJavaScriptDialogParameters = {
    /** Whether to accept or dismiss the dialog. */
    accept: boolean;
    /** The text to enter into the dialog prompt before accepting. Used only if this is a prompt dialog. */
    promptText?: string;
  };
}
/** This domain emulates different environments for the page. */
export class Emulation {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Overrides the values of device screen dimensions (window.screen.width, window.screen.height, window.innerWidth, window.innerHeight, and "device-width"/"device-height"-related CSS media query results). */
  public setDeviceMetricsOverride(params: Emulation.SetDeviceMetricsOverrideParameters) {
    return this._client.send<void>("Emulation.setDeviceMetricsOverride", params);
  }
  /** Clears the overriden device metrics. */
  public clearDeviceMetricsOverride() {
    return this._client.send<void>("Emulation.clearDeviceMetricsOverride");
  }
  /** Toggles mouse event-based touch event emulation. */
  public setTouchEmulationEnabled(params: Emulation.SetTouchEmulationEnabledParameters) {
    return this._client.send<void>("Emulation.setTouchEmulationEnabled", params);
  }
  /** Emulates the given media for CSS media queries. */
  public setEmulatedMedia(params: Emulation.SetEmulatedMediaParameters) {
    return this._client.send<void>("Emulation.setEmulatedMedia", params);
  }
}
export namespace Emulation {
  /** Screen orientation. */
  export interface ScreenOrientation {
    /** Orientation type. */
    type: "portraitPrimary" | "portraitSecondary" | "landscapePrimary" | "landscapeSecondary";
    /** Orientation angle. */
    angle: number;
  }
  export type SetDeviceMetricsOverrideParameters = {
    /** Overriding width value in pixels (minimum 0, maximum 10000000). 0 disables the override. */
    width: number;
    /** Overriding height value in pixels (minimum 0, maximum 10000000). 0 disables the override. */
    height: number;
    /** Overriding device scale factor value. 0 disables the override. */
    deviceScaleFactor: number;
    /** Whether to emulate mobile device. This includes viewport meta tag, overlay scrollbars, text autosizing and more. */
    mobile: boolean;
    /** Whether a view that exceeds the available browser window area should be scaled down to fit. */
    fitWindow: boolean;
    /** Scale to apply to resulting view image. Ignored in |fitWindow| mode. */
    scale?: number;
    /** Not used. */
    offsetX?: number;
    /** Not used. */
    offsetY?: number;
    /** Overriding screen width value in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|. */
    screenWidth?: number;
    /** Overriding screen height value in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|. */
    screenHeight?: number;
    /** Overriding view X position on screen in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|. */
    positionX?: number;
    /** Overriding view Y position on screen in pixels (minimum 0, maximum 10000000). Only used for |mobile==true|. */
    positionY?: number;
    /** Screen orientation override. */
    screenOrientation?: ScreenOrientation;
  };
  export type SetTouchEmulationEnabledParameters = {
    /** Whether the touch event emulation should be enabled. */
    enabled: boolean;
    /** Touch/gesture events configuration. Default: current platform. */
    configuration?: "mobile" | "desktop";
  };
  export type SetEmulatedMediaParameters = {
    /** Media type to emulate. Empty string disables the override. */
    media: string;
  };
}
/** Network domain allows tracking network activities of the page. It exposes information about http, file, data and other requests and responses, their headers, bodies, timing, etc. */
export class Network {
  private _requestWillBeSent: Network.RequestWillBeSentHandler | null = null;
  private _requestServedFromCache: Network.RequestServedFromCacheHandler | null = null;
  private _responseReceived: Network.ResponseReceivedHandler | null = null;
  private _dataReceived: Network.DataReceivedHandler | null = null;
  private _loadingFinished: Network.LoadingFinishedHandler | null = null;
  private _loadingFailed: Network.LoadingFailedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables network tracking, network events will now be delivered to the client. */
  public enable(params: Network.EnableParameters) {
    return this._client.send<void>("Network.enable", params);
  }
  /** Disables network tracking, prevents network events from being sent to the client. */
  public disable() {
    return this._client.send<void>("Network.disable");
  }
  /** Allows overriding user agent with the given string. */
  public setUserAgentOverride(params: Network.SetUserAgentOverrideParameters) {
    return this._client.send<void>("Network.setUserAgentOverride", params);
  }
  /** Specifies whether to always send extra HTTP headers with the requests from this page. */
  public setExtraHTTPHeaders(params: Network.SetExtraHTTPHeadersParameters) {
    return this._client.send<void>("Network.setExtraHTTPHeaders", params);
  }
  /** Returns content served for the given request. */
  public getResponseBody(params: Network.GetResponseBodyParameters) {
    return this._client.send<Network.GetResponseBodyReturn>("Network.getResponseBody", params);
  }
  /** Tells whether clearing browser cache is supported. */
  public canClearBrowserCache() {
    return this._client.send<Network.CanClearBrowserCacheReturn>("Network.canClearBrowserCache");
  }
  /** Clears browser cache. */
  public clearBrowserCache() {
    return this._client.send<void>("Network.clearBrowserCache");
  }
  /** Tells whether clearing browser cookies is supported. */
  public canClearBrowserCookies() {
    return this._client.send<Network.CanClearBrowserCookiesReturn>("Network.canClearBrowserCookies");
  }
  /** Clears browser cookies. */
  public clearBrowserCookies() {
    return this._client.send<void>("Network.clearBrowserCookies");
  }
  /** Activates emulation of network conditions. */
  public emulateNetworkConditions(params: Network.EmulateNetworkConditionsParameters) {
    return this._client.send<void>("Network.emulateNetworkConditions", params);
  }
  /** Toggles ignoring cache for each request. If <code>true</code>, cache will not be used. */
  public setCacheDisabled(params: Network.SetCacheDisabledParameters) {
    return this._client.send<void>("Network.setCacheDisabled", params);
  }
  /** Fired when page is about to send HTTP request. */
  get requestWillBeSent() {
    return this._requestWillBeSent;
  }
  set requestWillBeSent(handler) {
    if (this._requestWillBeSent) {
      this._client.removeListener("Network.requestWillBeSent", this._requestWillBeSent);
    }
    this._requestWillBeSent = handler;
    if (handler) {
      this._client.on("Network.requestWillBeSent", handler);
    }
  }
  /** Fired if request ended up loading from cache. */
  get requestServedFromCache() {
    return this._requestServedFromCache;
  }
  set requestServedFromCache(handler) {
    if (this._requestServedFromCache) {
      this._client.removeListener("Network.requestServedFromCache", this._requestServedFromCache);
    }
    this._requestServedFromCache = handler;
    if (handler) {
      this._client.on("Network.requestServedFromCache", handler);
    }
  }
  /** Fired when HTTP response is available. */
  get responseReceived() {
    return this._responseReceived;
  }
  set responseReceived(handler) {
    if (this._responseReceived) {
      this._client.removeListener("Network.responseReceived", this._responseReceived);
    }
    this._responseReceived = handler;
    if (handler) {
      this._client.on("Network.responseReceived", handler);
    }
  }
  /** Fired when data chunk was received over the network. */
  get dataReceived() {
    return this._dataReceived;
  }
  set dataReceived(handler) {
    if (this._dataReceived) {
      this._client.removeListener("Network.dataReceived", this._dataReceived);
    }
    this._dataReceived = handler;
    if (handler) {
      this._client.on("Network.dataReceived", handler);
    }
  }
  /** Fired when HTTP request has finished loading. */
  get loadingFinished() {
    return this._loadingFinished;
  }
  set loadingFinished(handler) {
    if (this._loadingFinished) {
      this._client.removeListener("Network.loadingFinished", this._loadingFinished);
    }
    this._loadingFinished = handler;
    if (handler) {
      this._client.on("Network.loadingFinished", handler);
    }
  }
  /** Fired when HTTP request has failed to load. */
  get loadingFailed() {
    return this._loadingFailed;
  }
  set loadingFailed(handler) {
    if (this._loadingFailed) {
      this._client.removeListener("Network.loadingFailed", this._loadingFailed);
    }
    this._loadingFailed = handler;
    if (handler) {
      this._client.on("Network.loadingFailed", handler);
    }
  }
}
export namespace Network {
  /** Unique loader identifier. */
  export type LoaderId = string;
  /** Unique request identifier. */
  export type RequestId = string;
  /** Number of seconds since epoch. */
  export type Timestamp = number;
  /** Request / response headers as keys / values of JSON object. */
  export type Headers = any;
  /** Loading priority of a resource request. */
  export type ConnectionType = "none" | "cellular2g" | "cellular3g" | "cellular4g" | "bluetooth" | "ethernet" | "wifi" | "wimax" | "other";
  /** Represents the cookie's 'SameSite' status: https://tools.ietf.org/html/draft-west-first-party-cookies */
  export type CookieSameSite = "Strict" | "Lax";
  /** Timing information for the request. */
  export interface ResourceTiming {
    /** Timing's requestTime is a baseline in seconds, while the other numbers are ticks in milliseconds relatively to this requestTime. */
    requestTime: number;
    /** Started resolving proxy. */
    proxyStart: number;
    /** Finished resolving proxy. */
    proxyEnd: number;
    /** Started DNS address resolve. */
    dnsStart: number;
    /** Finished DNS address resolve. */
    dnsEnd: number;
    /** Started connecting to the remote host. */
    connectStart: number;
    /** Connected to the remote host. */
    connectEnd: number;
    /** Started SSL handshake. */
    sslStart: number;
    /** Finished SSL handshake. */
    sslEnd: number;
    /** Started running ServiceWorker. */
    workerStart: number;
    /** Finished Starting ServiceWorker. */
    workerReady: number;
    /** Started sending request. */
    sendStart: number;
    /** Finished sending request. */
    sendEnd: number;
    /** Time the server started pushing request. */
    pushStart: number;
    /** Time the server finished pushing request. */
    pushEnd: number;
    /** Finished receiving response headers. */
    receiveHeadersEnd: number;
  }
  /** Loading priority of a resource request. */
  export type ResourcePriority = "VeryLow" | "Low" | "Medium" | "High" | "VeryHigh";
  /** HTTP request data. */
  export interface Request {
    /** Request URL. */
    url: string;
    /** HTTP request method. */
    method: string;
    /** HTTP request headers. */
    headers: Headers;
    /** HTTP POST request data. */
    postData?: string;
    /** The mixed content status of the request, as defined in http://www.w3.org/TR/mixed-content/ */
    mixedContentType?: "blockable" | "optionally-blockable" | "none";
    /** Priority of the resource request at the time request is sent. */
    initialPriority: ResourcePriority;
  }
  /** Details of a signed certificate timestamp (SCT). */
  export interface SignedCertificateTimestamp {
    /** Validation status. */
    status: string;
    /** Origin. */
    origin: string;
    /** Log name / description. */
    logDescription: string;
    /** Log ID. */
    logId: string;
    /** Issuance date. */
    timestamp: Timestamp;
    /** Hash algorithm. */
    hashAlgorithm: string;
    /** Signature algorithm. */
    signatureAlgorithm: string;
    /** Signature data. */
    signatureData: string;
  }
  /** Security details about a request. */
  export interface SecurityDetails {
    /** Protocol name (e.g. "TLS 1.2" or "QUIC"). */
    protocol: string;
    /** Key Exchange used by the connection. */
    keyExchange: string;
    /** (EC)DH group used by the connection, if applicable. */
    keyExchangeGroup?: string;
    /** Cipher name. */
    cipher: string;
    /** TLS MAC. Note that AEAD ciphers do not have separate MACs. */
    mac?: string;
    /** Certificate ID value. */
    certificateId: Security.CertificateId;
    /** Certificate subject name. */
    subjectName: string;
    /** Subject Alternative Name (SAN) DNS names and IP addresses. */
    sanList: string[];
    /** Name of the issuing CA. */
    issuer: string;
    /** Certificate valid from date. */
    validFrom: Timestamp;
    /** Certificate valid to (expiration) date */
    validTo: Timestamp;
    /** List of signed certificate timestamps (SCTs). */
    signedCertificateTimestampList: SignedCertificateTimestamp[];
  }
  /** HTTP response data. */
  export interface Response {
    /** Response URL. This URL can be different from CachedResource.url in case of redirect. */
    url: string;
    /** HTTP response status code. */
    status: number;
    /** HTTP response status text. */
    statusText: string;
    /** HTTP response headers. */
    headers: Headers;
    /** HTTP response headers text. */
    headersText?: string;
    /** Resource mimeType as determined by the browser. */
    mimeType: string;
    /** Refined HTTP request headers that were actually transmitted over the network. */
    requestHeaders?: Headers;
    /** HTTP request headers text. */
    requestHeadersText?: string;
    /** Specifies whether physical connection was actually reused for this request. */
    connectionReused: boolean;
    /** Physical connection id that was actually used for this request. */
    connectionId: number;
    /** Remote IP address. */
    remoteIPAddress?: string;
    /** Remote port. */
    remotePort?: number;
    /** Specifies that the request was served from the disk cache. */
    fromDiskCache?: boolean;
    /** Specifies that the request was served from the ServiceWorker. */
    fromServiceWorker?: boolean;
    /** Total number of bytes received for this request so far. */
    encodedDataLength: number;
    /** Timing information for the given request. */
    timing?: ResourceTiming;
    /** Protocol used to fetch this request. */
    protocol?: string;
    /** Security state of the request resource. */
    securityState: Security.SecurityState;
    /** Security details for the request. */
    securityDetails?: SecurityDetails;
  }
  /** Information about the cached resource. */
  export interface CachedResource {
    /** Resource URL. This is the url of the original network request. */
    url: string;
    /** Type of this resource. */
    type: Page.ResourceType;
    /** Cached response data. */
    response?: Response;
    /** Cached response body size. */
    bodySize: number;
  }
  /** Information about the request initiator. */
  export interface Initiator {
    /** Type of this initiator. */
    type: "parser" | "script" | "other";
    /** Initiator JavaScript stack trace, set for Script only. */
    stack?: Runtime.StackTrace;
    /** Initiator URL, set for Parser type only. */
    url?: string;
    /** Initiator line number, set for Parser type only (0-based). */
    lineNumber?: number;
  }
  export type BlockedReason = any;
  export type RequestWillBeSentParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Frame identifier. */
    frameId: Page.FrameId;
    /** Loader identifier. */
    loaderId: LoaderId;
    /** URL of the document this request is loaded for. */
    documentURL: string;
    /** Request data. */
    request: Request;
    /** Timestamp. */
    timestamp: Timestamp;
    /** UTC Timestamp. */
    wallTime: Timestamp;
    /** Request initiator. */
    initiator: Initiator;
    /** Redirect response data. */
    redirectResponse?: Response;
    /** Type of this resource. */
    type?: Page.ResourceType;
  };
  export type RequestWillBeSentHandler = (params: RequestWillBeSentParameters) => void;
  export type RequestServedFromCacheParameters = {
    /** Request identifier. */
    requestId: RequestId;
  };
  export type RequestServedFromCacheHandler = (params: RequestServedFromCacheParameters) => void;
  export type ResponseReceivedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Frame identifier. */
    frameId: Page.FrameId;
    /** Loader identifier. */
    loaderId: LoaderId;
    /** Timestamp. */
    timestamp: Timestamp;
    /** Resource type. */
    type: Page.ResourceType;
    /** Response data. */
    response: Response;
  };
  export type ResponseReceivedHandler = (params: ResponseReceivedParameters) => void;
  export type DataReceivedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: Timestamp;
    /** Data chunk length. */
    dataLength: number;
    /** Actual bytes received (might be less than dataLength for compressed encodings). */
    encodedDataLength: number;
  };
  export type DataReceivedHandler = (params: DataReceivedParameters) => void;
  export type LoadingFinishedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: Timestamp;
    /** Total number of bytes received for this request. */
    encodedDataLength: number;
  };
  export type LoadingFinishedHandler = (params: LoadingFinishedParameters) => void;
  export type LoadingFailedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: Timestamp;
    /** Resource type. */
    type: Page.ResourceType;
    /** User friendly error message. */
    errorText: string;
    /** True if loading was canceled. */
    canceled?: boolean;
    /** The reason why loading was blocked, if any. */
    blockedReason?: BlockedReason;
  };
  export type LoadingFailedHandler = (params: LoadingFailedParameters) => void;
  export type EnableParameters = {
    /** Buffer size in bytes to use when preserving network payloads (XHRs, etc). */
    maxTotalBufferSize?: number;
    /** Per-resource buffer size in bytes to use when preserving network payloads (XHRs, etc). */
    maxResourceBufferSize?: number;
  };
  export type SetUserAgentOverrideParameters = {
    /** User agent to use. */
    userAgent: string;
  };
  export type SetExtraHTTPHeadersParameters = {
    /** Map with extra HTTP headers. */
    headers: Headers;
  };
  export type GetResponseBodyParameters = {
    /** Identifier of the network request to get content for. */
    requestId: RequestId;
  };
  export type GetResponseBodyReturn = {
    /** Response body. */
    body: string;
    /** True, if content was sent as base64. */
    base64Encoded: boolean;
  };
  export type CanClearBrowserCacheReturn = {
    /** True if browser cache can be cleared. */
    result: boolean;
  };
  export type CanClearBrowserCookiesReturn = {
    /** True if browser cookies can be cleared. */
    result: boolean;
  };
  export type EmulateNetworkConditionsParameters = {
    /** True to emulate internet disconnection. */
    offline: boolean;
    /** Additional latency (ms). */
    latency: number;
    /** Maximal aggregated download throughput. */
    downloadThroughput: number;
    /** Maximal aggregated upload throughput. */
    uploadThroughput: number;
    /** Connection type if known. */
    connectionType?: ConnectionType;
  };
  export type SetCacheDisabledParameters = {
    /** Cache disabled state. */
    cacheDisabled: boolean;
  };
}
/** This domain exposes DOM read/write operations. Each DOM Node is represented with its mirror object that has an <code>id</code>. This <code>id</code> can be used to get additional information on the Node, resolve it into the JavaScript object wrapper, etc. It is important that client receives DOM events only for the nodes that are known to the client. Backend keeps track of the nodes that were sent to the client and never sends the same node twice. It is client's responsibility to collect information about the nodes that were sent to the client.<p>Note that <code>iframe</code> owner elements will return corresponding document elements as their child nodes.</p> */
export class DOM {
  private _documentUpdated: DOM.DocumentUpdatedHandler | null = null;
  private _setChildNodes: DOM.SetChildNodesHandler | null = null;
  private _attributeModified: DOM.AttributeModifiedHandler | null = null;
  private _attributeRemoved: DOM.AttributeRemovedHandler | null = null;
  private _characterDataModified: DOM.CharacterDataModifiedHandler | null = null;
  private _childNodeCountUpdated: DOM.ChildNodeCountUpdatedHandler | null = null;
  private _childNodeInserted: DOM.ChildNodeInsertedHandler | null = null;
  private _childNodeRemoved: DOM.ChildNodeRemovedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables DOM agent for the given page. */
  public enable() {
    return this._client.send<void>("DOM.enable");
  }
  /** Disables DOM agent for the given page. */
  public disable() {
    return this._client.send<void>("DOM.disable");
  }
  /** Returns the root DOM node to the caller. */
  public getDocument() {
    return this._client.send<DOM.GetDocumentReturn>("DOM.getDocument");
  }
  /** Requests that children of the node with given id are returned to the caller in form of <code>setChildNodes</code> events where not only immediate children are retrieved, but all children down to the specified depth. */
  public requestChildNodes(params: DOM.RequestChildNodesParameters) {
    return this._client.send<void>("DOM.requestChildNodes", params);
  }
  /** Executes <code>querySelector</code> on a given node. */
  public querySelector(params: DOM.QuerySelectorParameters) {
    return this._client.send<DOM.QuerySelectorReturn>("DOM.querySelector", params);
  }
  /** Executes <code>querySelectorAll</code> on a given node. */
  public querySelectorAll(params: DOM.QuerySelectorAllParameters) {
    return this._client.send<DOM.QuerySelectorAllReturn>("DOM.querySelectorAll", params);
  }
  /** Sets node name for a node with given id. */
  public setNodeName(params: DOM.SetNodeNameParameters) {
    return this._client.send<DOM.SetNodeNameReturn>("DOM.setNodeName", params);
  }
  /** Sets node value for a node with given id. */
  public setNodeValue(params: DOM.SetNodeValueParameters) {
    return this._client.send<void>("DOM.setNodeValue", params);
  }
  /** Removes node with given id. */
  public removeNode(params: DOM.RemoveNodeParameters) {
    return this._client.send<void>("DOM.removeNode", params);
  }
  /** Sets attribute for an element with given id. */
  public setAttributeValue(params: DOM.SetAttributeValueParameters) {
    return this._client.send<void>("DOM.setAttributeValue", params);
  }
  /** Sets attributes on element with given id. This method is useful when user edits some existing attribute value and types in several attribute name/value pairs. */
  public setAttributesAsText(params: DOM.SetAttributesAsTextParameters) {
    return this._client.send<void>("DOM.setAttributesAsText", params);
  }
  /** Removes attribute with given name from an element with given id. */
  public removeAttribute(params: DOM.RemoveAttributeParameters) {
    return this._client.send<void>("DOM.removeAttribute", params);
  }
  /** Returns node's HTML markup. */
  public getOuterHTML(params: DOM.GetOuterHTMLParameters) {
    return this._client.send<DOM.GetOuterHTMLReturn>("DOM.getOuterHTML", params);
  }
  /** Sets node HTML markup, returns new node id. */
  public setOuterHTML(params: DOM.SetOuterHTMLParameters) {
    return this._client.send<void>("DOM.setOuterHTML", params);
  }
  /** Requests that the node is sent to the caller given the JavaScript node object reference. All nodes that form the path from the node to the root are also sent to the client as a series of <code>setChildNodes</code> notifications. */
  public requestNode(params: DOM.RequestNodeParameters) {
    return this._client.send<DOM.RequestNodeReturn>("DOM.requestNode", params);
  }
  /** Highlights given rectangle. Coordinates are absolute with respect to the main frame viewport. */
  public highlightRect(params: DOM.HighlightRectParameters) {
    return this._client.send<void>("DOM.highlightRect", params);
  }
  /** Highlights DOM node with given id or with the given JavaScript object wrapper. Either nodeId or objectId must be specified. */
  public highlightNode(params: DOM.HighlightNodeParameters) {
    return this._client.send<void>("DOM.highlightNode", params);
  }
  /** Hides DOM node highlight. */
  public hideHighlight() {
    return this._client.send<void>("DOM.hideHighlight");
  }
  /** Resolves JavaScript node object for given node id. */
  public resolveNode(params: DOM.ResolveNodeParameters) {
    return this._client.send<DOM.ResolveNodeReturn>("DOM.resolveNode", params);
  }
  /** Returns attributes for the specified node. */
  public getAttributes(params: DOM.GetAttributesParameters) {
    return this._client.send<DOM.GetAttributesReturn>("DOM.getAttributes", params);
  }
  /** Moves node into the new container, places it before the given anchor. */
  public moveTo(params: DOM.MoveToParameters) {
    return this._client.send<DOM.MoveToReturn>("DOM.moveTo", params);
  }
  /** Fired when <code>Document</code> has been totally updated. Node ids are no longer valid. */
  get documentUpdated() {
    return this._documentUpdated;
  }
  set documentUpdated(handler) {
    if (this._documentUpdated) {
      this._client.removeListener("DOM.documentUpdated", this._documentUpdated);
    }
    this._documentUpdated = handler;
    if (handler) {
      this._client.on("DOM.documentUpdated", handler);
    }
  }
  /** Fired when backend wants to provide client with the missing DOM structure. This happens upon most of the calls requesting node ids. */
  get setChildNodes() {
    return this._setChildNodes;
  }
  set setChildNodes(handler) {
    if (this._setChildNodes) {
      this._client.removeListener("DOM.setChildNodes", this._setChildNodes);
    }
    this._setChildNodes = handler;
    if (handler) {
      this._client.on("DOM.setChildNodes", handler);
    }
  }
  /** Fired when <code>Element</code>'s attribute is modified. */
  get attributeModified() {
    return this._attributeModified;
  }
  set attributeModified(handler) {
    if (this._attributeModified) {
      this._client.removeListener("DOM.attributeModified", this._attributeModified);
    }
    this._attributeModified = handler;
    if (handler) {
      this._client.on("DOM.attributeModified", handler);
    }
  }
  /** Fired when <code>Element</code>'s attribute is removed. */
  get attributeRemoved() {
    return this._attributeRemoved;
  }
  set attributeRemoved(handler) {
    if (this._attributeRemoved) {
      this._client.removeListener("DOM.attributeRemoved", this._attributeRemoved);
    }
    this._attributeRemoved = handler;
    if (handler) {
      this._client.on("DOM.attributeRemoved", handler);
    }
  }
  /** Mirrors <code>DOMCharacterDataModified</code> event. */
  get characterDataModified() {
    return this._characterDataModified;
  }
  set characterDataModified(handler) {
    if (this._characterDataModified) {
      this._client.removeListener("DOM.characterDataModified", this._characterDataModified);
    }
    this._characterDataModified = handler;
    if (handler) {
      this._client.on("DOM.characterDataModified", handler);
    }
  }
  /** Fired when <code>Container</code>'s child node count has changed. */
  get childNodeCountUpdated() {
    return this._childNodeCountUpdated;
  }
  set childNodeCountUpdated(handler) {
    if (this._childNodeCountUpdated) {
      this._client.removeListener("DOM.childNodeCountUpdated", this._childNodeCountUpdated);
    }
    this._childNodeCountUpdated = handler;
    if (handler) {
      this._client.on("DOM.childNodeCountUpdated", handler);
    }
  }
  /** Mirrors <code>DOMNodeInserted</code> event. */
  get childNodeInserted() {
    return this._childNodeInserted;
  }
  set childNodeInserted(handler) {
    if (this._childNodeInserted) {
      this._client.removeListener("DOM.childNodeInserted", this._childNodeInserted);
    }
    this._childNodeInserted = handler;
    if (handler) {
      this._client.on("DOM.childNodeInserted", handler);
    }
  }
  /** Mirrors <code>DOMNodeRemoved</code> event. */
  get childNodeRemoved() {
    return this._childNodeRemoved;
  }
  set childNodeRemoved(handler) {
    if (this._childNodeRemoved) {
      this._client.removeListener("DOM.childNodeRemoved", this._childNodeRemoved);
    }
    this._childNodeRemoved = handler;
    if (handler) {
      this._client.on("DOM.childNodeRemoved", handler);
    }
  }
}
export namespace DOM {
  /** Unique DOM node identifier. */
  export type NodeId = number;
  /** Pseudo element type. */
  export type PseudoType = "first-line" | "first-letter" | "before" | "after" | "backdrop" | "selection" | "first-line-inherited" | "scrollbar" | "scrollbar-thumb" | "scrollbar-button" | "scrollbar-track" | "scrollbar-track-piece" | "scrollbar-corner" | "resizer" | "input-list-button";
  /** Shadow root type. */
  export type ShadowRootType = "user-agent" | "open" | "closed";
  /** DOM interaction is implemented in terms of mirror objects that represent the actual DOM nodes. DOMNode is a base node mirror type. */
  export interface Node {
    /** Node identifier that is passed into the rest of the DOM messages as the <code>nodeId</code>. Backend will only push node with given <code>id</code> once. It is aware of all requested nodes and will only fire DOM events for nodes known to the client. */
    nodeId: NodeId;
    /** <code>Node</code>'s nodeType. */
    nodeType: number;
    /** <code>Node</code>'s nodeName. */
    nodeName: string;
    /** <code>Node</code>'s localName. */
    localName: string;
    /** <code>Node</code>'s nodeValue. */
    nodeValue: string;
    /** Child count for <code>Container</code> nodes. */
    childNodeCount?: number;
    /** Child nodes of this node when requested with children. */
    children?: Node[];
    /** Attributes of the <code>Element</code> node in the form of flat array <code>[name1, value1, name2, value2]</code>. */
    attributes?: string[];
    /** Document URL that <code>Document</code> or <code>FrameOwner</code> node points to. */
    documentURL?: string;
    /** Base URL that <code>Document</code> or <code>FrameOwner</code> node uses for URL completion. */
    baseURL?: string;
    /** <code>DocumentType</code>'s publicId. */
    publicId?: string;
    /** <code>DocumentType</code>'s systemId. */
    systemId?: string;
    /** <code>DocumentType</code>'s internalSubset. */
    internalSubset?: string;
    /** <code>Document</code>'s XML version in case of XML documents. */
    xmlVersion?: string;
    /** <code>Attr</code>'s name. */
    name?: string;
    /** <code>Attr</code>'s value. */
    value?: string;
    /** Pseudo element type for this node. */
    pseudoType?: PseudoType;
    /** Shadow root type. */
    shadowRootType?: ShadowRootType;
    /** Frame ID for frame owner elements. */
    frameId?: Page.FrameId;
    /** Content document for frame owner elements. */
    contentDocument?: Node;
    /** Shadow root list for given element host. */
    shadowRoots?: Node[];
    /** Content document fragment for template elements. */
    templateContent?: Node;
    /** Pseudo elements associated with this node. */
    pseudoElements?: Node[];
    /** Import document for the HTMLImport links. */
    importedDocument?: Node;
    /** Distributed nodes for given insertion point. */
    distributedNodes?: BackendNode[];
  }
  /** A structure holding an RGBA color. */
  export interface RGBA {
    /** The red component, in the [0-255] range. */
    r: number;
    /** The green component, in the [0-255] range. */
    g: number;
    /** The blue component, in the [0-255] range. */
    b: number;
    /** The alpha component, in the [0-1] range (default: 1). */
    a?: number;
  }
  /** Configuration data for the highlighting of page elements. */
  export interface HighlightConfig {
    /** Whether the node info tooltip should be shown (default: false). */
    showInfo?: boolean;
    /** Whether the rulers should be shown (default: false). */
    showRulers?: boolean;
    /** Whether the extension lines from node to the rulers should be shown (default: false). */
    showExtensionLines?: boolean;
    displayAsMaterial?: boolean;
    /** The content box highlight fill color (default: transparent). */
    contentColor?: RGBA;
    /** The padding highlight fill color (default: transparent). */
    paddingColor?: RGBA;
    /** The border highlight fill color (default: transparent). */
    borderColor?: RGBA;
    /** The margin highlight fill color (default: transparent). */
    marginColor?: RGBA;
    /** The event target element highlight fill color (default: transparent). */
    eventTargetColor?: RGBA;
    /** The shape outside fill color (default: transparent). */
    shapeColor?: RGBA;
    /** The shape margin fill color (default: transparent). */
    shapeMarginColor?: RGBA;
    /** Selectors to highlight relevant nodes. */
    selectorList?: string;
  }
  export type BackendNode = any;
  export type BackendNodeId = any;
  export type DocumentUpdatedHandler = () => void;
  export type SetChildNodesParameters = {
    /** Parent node id to populate with children. */
    parentId: NodeId;
    /** Child nodes array. */
    nodes: Node[];
  };
  export type SetChildNodesHandler = (params: SetChildNodesParameters) => void;
  export type AttributeModifiedParameters = {
    /** Id of the node that has changed. */
    nodeId: NodeId;
    /** Attribute name. */
    name: string;
    /** Attribute value. */
    value: string;
  };
  export type AttributeModifiedHandler = (params: AttributeModifiedParameters) => void;
  export type AttributeRemovedParameters = {
    /** Id of the node that has changed. */
    nodeId: NodeId;
    /** A ttribute name. */
    name: string;
  };
  export type AttributeRemovedHandler = (params: AttributeRemovedParameters) => void;
  export type CharacterDataModifiedParameters = {
    /** Id of the node that has changed. */
    nodeId: NodeId;
    /** New text value. */
    characterData: string;
  };
  export type CharacterDataModifiedHandler = (params: CharacterDataModifiedParameters) => void;
  export type ChildNodeCountUpdatedParameters = {
    /** Id of the node that has changed. */
    nodeId: NodeId;
    /** New node count. */
    childNodeCount: number;
  };
  export type ChildNodeCountUpdatedHandler = (params: ChildNodeCountUpdatedParameters) => void;
  export type ChildNodeInsertedParameters = {
    /** Id of the node that has changed. */
    parentNodeId: NodeId;
    /** If of the previous siblint. */
    previousNodeId: NodeId;
    /** Inserted node data. */
    node: Node;
  };
  export type ChildNodeInsertedHandler = (params: ChildNodeInsertedParameters) => void;
  export type ChildNodeRemovedParameters = {
    /** Parent id. */
    parentNodeId: NodeId;
    /** Id of the node that has been removed. */
    nodeId: NodeId;
  };
  export type ChildNodeRemovedHandler = (params: ChildNodeRemovedParameters) => void;
  export type GetDocumentReturn = {
    /** Resulting node. */
    root: Node;
  };
  export type RequestChildNodesParameters = {
    /** Id of the node to get children for. */
    nodeId: NodeId;
    /** The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the entire subtree or provide an integer larger than 0. */
    depth?: number;
  };
  export type QuerySelectorParameters = {
    /** Id of the node to query upon. */
    nodeId: NodeId;
    /** Selector string. */
    selector: string;
  };
  export type QuerySelectorReturn = {
    /** Query selector result. */
    nodeId: NodeId;
  };
  export type QuerySelectorAllParameters = {
    /** Id of the node to query upon. */
    nodeId: NodeId;
    /** Selector string. */
    selector: string;
  };
  export type QuerySelectorAllReturn = {
    /** Query selector result. */
    nodeIds: NodeId[];
  };
  export type SetNodeNameParameters = {
    /** Id of the node to set name for. */
    nodeId: NodeId;
    /** New node's name. */
    name: string;
  };
  export type SetNodeNameReturn = {
    /** New node's id. */
    nodeId: NodeId;
  };
  export type SetNodeValueParameters = {
    /** Id of the node to set value for. */
    nodeId: NodeId;
    /** New node's value. */
    value: string;
  };
  export type RemoveNodeParameters = {
    /** Id of the node to remove. */
    nodeId: NodeId;
  };
  export type SetAttributeValueParameters = {
    /** Id of the element to set attribute for. */
    nodeId: NodeId;
    /** Attribute name. */
    name: string;
    /** Attribute value. */
    value: string;
  };
  export type SetAttributesAsTextParameters = {
    /** Id of the element to set attributes for. */
    nodeId: NodeId;
    /** Text with a number of attributes. Will parse this text using HTML parser. */
    text: string;
    /** Attribute name to replace with new attributes derived from text in case text parsed successfully. */
    name?: string;
  };
  export type RemoveAttributeParameters = {
    /** Id of the element to remove attribute from. */
    nodeId: NodeId;
    /** Name of the attribute to remove. */
    name: string;
  };
  export type GetOuterHTMLParameters = {
    /** Id of the node to get markup for. */
    nodeId: NodeId;
  };
  export type GetOuterHTMLReturn = {
    /** Outer HTML markup. */
    outerHTML: string;
  };
  export type SetOuterHTMLParameters = {
    /** Id of the node to set markup for. */
    nodeId: NodeId;
    /** Outer HTML markup to set. */
    outerHTML: string;
  };
  export type RequestNodeParameters = {
    /** JavaScript object id to convert into node. */
    objectId: Runtime.RemoteObjectId;
  };
  export type RequestNodeReturn = {
    /** Node id for given object. */
    nodeId: NodeId;
  };
  export type HighlightRectParameters = {
    /** X coordinate */
    x: number;
    /** Y coordinate */
    y: number;
    /** Rectangle width */
    width: number;
    /** Rectangle height */
    height: number;
    /** The highlight fill color (default: transparent). */
    color?: RGBA;
    /** The highlight outline color (default: transparent). */
    outlineColor?: RGBA;
  };
  export type HighlightNodeParameters = {
    /** A descriptor for the highlight appearance. */
    highlightConfig: HighlightConfig;
    /** Identifier of the node to highlight. */
    nodeId?: NodeId;
    /** Identifier of the backend node to highlight. */
    backendNodeId?: BackendNodeId;
    /** JavaScript object id of the node to be highlighted. */
    objectId?: Runtime.RemoteObjectId;
  };
  export type ResolveNodeParameters = {
    /** Id of the node to resolve. */
    nodeId: NodeId;
    /** Symbolic group name that can be used to release multiple objects. */
    objectGroup?: string;
  };
  export type ResolveNodeReturn = {
    /** JavaScript object wrapper for given node. */
    object: Runtime.RemoteObject;
  };
  export type GetAttributesParameters = {
    /** Id of the node to retrieve attibutes for. */
    nodeId: NodeId;
  };
  export type GetAttributesReturn = {
    /** An interleaved array of node attribute names and values. */
    attributes: string[];
  };
  export type MoveToParameters = {
    /** Id of the node to move. */
    nodeId: NodeId;
    /** Id of the element to drop the moved node into. */
    targetNodeId: NodeId;
    /** Drop node before this one (if absent, the moved node becomes the last child of <code>targetNodeId</code>). */
    insertBeforeNodeId?: NodeId;
  };
  export type MoveToReturn = {
    /** New id of the moved node. */
    nodeId: NodeId;
  };
}
/** DOM debugging allows setting breakpoints on particular DOM operations and events. JavaScript execution will stop on these operations as if there was a regular breakpoint set. */
export class DOMDebugger {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Sets breakpoint on particular operation with DOM. */
  public setDOMBreakpoint(params: DOMDebugger.SetDOMBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.setDOMBreakpoint", params);
  }
  /** Removes DOM breakpoint that was set using <code>setDOMBreakpoint</code>. */
  public removeDOMBreakpoint(params: DOMDebugger.RemoveDOMBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.removeDOMBreakpoint", params);
  }
  /** Sets breakpoint on particular DOM event. */
  public setEventListenerBreakpoint(params: DOMDebugger.SetEventListenerBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.setEventListenerBreakpoint", params);
  }
  /** Removes breakpoint on particular DOM event. */
  public removeEventListenerBreakpoint(params: DOMDebugger.RemoveEventListenerBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.removeEventListenerBreakpoint", params);
  }
  /** Sets breakpoint on XMLHttpRequest. */
  public setXHRBreakpoint(params: DOMDebugger.SetXHRBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.setXHRBreakpoint", params);
  }
  /** Removes breakpoint from XMLHttpRequest. */
  public removeXHRBreakpoint(params: DOMDebugger.RemoveXHRBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.removeXHRBreakpoint", params);
  }
}
export namespace DOMDebugger {
  /** DOM breakpoint type. */
  export type DOMBreakpointType = "subtree-modified" | "attribute-modified" | "node-removed";
  export type SetDOMBreakpointParameters = {
    /** Identifier of the node to set breakpoint on. */
    nodeId: DOM.NodeId;
    /** Type of the operation to stop upon. */
    type: DOMBreakpointType;
  };
  export type RemoveDOMBreakpointParameters = {
    /** Identifier of the node to remove breakpoint from. */
    nodeId: DOM.NodeId;
    /** Type of the breakpoint to remove. */
    type: DOMBreakpointType;
  };
  export type SetEventListenerBreakpointParameters = {
    /** DOM Event name to stop on (any DOM event will do). */
    eventName: string;
    /** EventTarget interface name to stop on. If equal to <code>"*"</code> or not provided, will stop on any EventTarget. */
    targetName?: string;
  };
  export type RemoveEventListenerBreakpointParameters = {
    /** Event name. */
    eventName: string;
    /** EventTarget interface name. */
    targetName?: string;
  };
  export type SetXHRBreakpointParameters = {
    /** Resource URL substring. All XHRs having this substring in the URL will get stopped upon. */
    url: string;
  };
  export type RemoveXHRBreakpointParameters = {
    /** Resource URL substring. */
    url: string;
  };
}
export class Input {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Dispatches a key event to the page. */
  public dispatchKeyEvent(params: Input.DispatchKeyEventParameters) {
    return this._client.send<void>("Input.dispatchKeyEvent", params);
  }
  /** Dispatches a mouse event to the page. */
  public dispatchMouseEvent(params: Input.DispatchMouseEventParameters) {
    return this._client.send<void>("Input.dispatchMouseEvent", params);
  }
}
export namespace Input {
  export type DispatchKeyEventParameters = {
    /** Type of the key event. */
    type: "keyDown" | "keyUp" | "rawKeyDown" | "char";
    /** Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8 (default: 0). */
    modifiers?: number;
    /** Time at which the event occurred. Measured in UTC time in seconds since January 1, 1970 (default: current time). */
    timestamp?: number;
    /** Text as generated by processing a virtual key code with a keyboard layout. Not needed for for <code>keyUp</code> and <code>rawKeyDown</code> events (default: "") */
    text?: string;
    /** Text that would have been generated by the keyboard if no modifiers were pressed (except for shift). Useful for shortcut (accelerator) key handling (default: ""). */
    unmodifiedText?: string;
    /** Unique key identifier (e.g., 'U+0041') (default: ""). */
    keyIdentifier?: string;
    /** Unique DOM defined string value for each physical key (e.g., 'KeyA') (default: ""). */
    code?: string;
    /** Unique DOM defined string value describing the meaning of the key in the context of active modifiers, keyboard layout, etc (e.g., 'AltGr') (default: ""). */
    key?: string;
    /** Windows virtual key code (default: 0). */
    windowsVirtualKeyCode?: number;
    /** Native virtual key code (default: 0). */
    nativeVirtualKeyCode?: number;
    /** Whether the event was generated from auto repeat (default: false). */
    autoRepeat?: boolean;
    /** Whether the event was generated from the keypad (default: false). */
    isKeypad?: boolean;
    /** Whether the event was a system key event (default: false). */
    isSystemKey?: boolean;
  };
  export type DispatchMouseEventParameters = {
    /** Type of the mouse event. */
    type: "mousePressed" | "mouseReleased" | "mouseMoved";
    /** X coordinate of the event relative to the main frame's viewport. */
    x: number;
    /** Y coordinate of the event relative to the main frame's viewport. 0 refers to the top of the viewport and Y increases as it proceeds towards the bottom of the viewport. */
    y: number;
    /** Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8 (default: 0). */
    modifiers?: number;
    /** Time at which the event occurred. Measured in UTC time in seconds since January 1, 1970 (default: current time). */
    timestamp?: number;
    /** Mouse button (default: "none"). */
    button?: "none" | "left" | "middle" | "right";
    /** Number of times the mouse button was clicked (default: 0). */
    clickCount?: number;
  };
}
/** Provides information about the protocol schema. */
export class Schema {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Returns supported domains. */
  public getDomains() {
    return this._client.send<Schema.GetDomainsReturn>("Schema.getDomains");
  }
}
export namespace Schema {
  /** Description of the protocol domain. */
  export interface Domain {
    /** Domain name. */
    name: string;
    /** Domain version. */
    version: string;
  }
  export type GetDomainsReturn = {
    /** List of supported domains. */
    domains: Domain[];
  };
}
/** Runtime domain exposes JavaScript runtime by means of remote evaluation and mirror objects. Evaluation results are returned as mirror object that expose object type, string representation and unique identifier that can be used for further object reference. Original objects are maintained in memory unless they are either explicitly released or are released along with the other objects in their object group. */
export class Runtime {
  private _executionContextCreated: Runtime.ExecutionContextCreatedHandler | null = null;
  private _executionContextDestroyed: Runtime.ExecutionContextDestroyedHandler | null = null;
  private _executionContextsCleared: Runtime.ExecutionContextsClearedHandler | null = null;
  private _exceptionThrown: Runtime.ExceptionThrownHandler | null = null;
  private _exceptionRevoked: Runtime.ExceptionRevokedHandler | null = null;
  private _consoleAPICalled: Runtime.ConsoleAPICalledHandler | null = null;
  private _inspectRequested: Runtime.InspectRequestedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Evaluates expression on global object. */
  public evaluate(params: Runtime.EvaluateParameters) {
    return this._client.send<Runtime.EvaluateReturn>("Runtime.evaluate", params);
  }
  /** Add handler to promise with given promise object id. */
  public awaitPromise(params: Runtime.AwaitPromiseParameters) {
    return this._client.send<Runtime.AwaitPromiseReturn>("Runtime.awaitPromise", params);
  }
  /** Calls function with given declaration on the given object. Object group of the result is inherited from the target object. */
  public callFunctionOn(params: Runtime.CallFunctionOnParameters) {
    return this._client.send<Runtime.CallFunctionOnReturn>("Runtime.callFunctionOn", params);
  }
  /** Returns properties of a given object. Object group of the result is inherited from the target object. */
  public getProperties(params: Runtime.GetPropertiesParameters) {
    return this._client.send<Runtime.GetPropertiesReturn>("Runtime.getProperties", params);
  }
  /** Releases remote object with given id. */
  public releaseObject(params: Runtime.ReleaseObjectParameters) {
    return this._client.send<void>("Runtime.releaseObject", params);
  }
  /** Releases all remote objects that belong to a given group. */
  public releaseObjectGroup(params: Runtime.ReleaseObjectGroupParameters) {
    return this._client.send<void>("Runtime.releaseObjectGroup", params);
  }
  /** Tells inspected instance to run if it was waiting for debugger to attach. */
  public runIfWaitingForDebugger() {
    return this._client.send<void>("Runtime.runIfWaitingForDebugger");
  }
  /** Enables reporting of execution contexts creation by means of <code>executionContextCreated</code> event. When the reporting gets enabled the event will be sent immediately for each existing execution context. */
  public enable() {
    return this._client.send<void>("Runtime.enable");
  }
  /** Disables reporting of execution contexts creation. */
  public disable() {
    return this._client.send<void>("Runtime.disable");
  }
  /** Discards collected exceptions and console API calls. */
  public discardConsoleEntries() {
    return this._client.send<void>("Runtime.discardConsoleEntries");
  }
  /** Compiles expression. */
  public compileScript(params: Runtime.CompileScriptParameters) {
    return this._client.send<Runtime.CompileScriptReturn>("Runtime.compileScript", params);
  }
  /** Runs script with given id in a given context. */
  public runScript(params: Runtime.RunScriptParameters) {
    return this._client.send<Runtime.RunScriptReturn>("Runtime.runScript", params);
  }
  /** Issued when new execution context is created. */
  get executionContextCreated() {
    return this._executionContextCreated;
  }
  set executionContextCreated(handler) {
    if (this._executionContextCreated) {
      this._client.removeListener("Runtime.executionContextCreated", this._executionContextCreated);
    }
    this._executionContextCreated = handler;
    if (handler) {
      this._client.on("Runtime.executionContextCreated", handler);
    }
  }
  /** Issued when execution context is destroyed. */
  get executionContextDestroyed() {
    return this._executionContextDestroyed;
  }
  set executionContextDestroyed(handler) {
    if (this._executionContextDestroyed) {
      this._client.removeListener("Runtime.executionContextDestroyed", this._executionContextDestroyed);
    }
    this._executionContextDestroyed = handler;
    if (handler) {
      this._client.on("Runtime.executionContextDestroyed", handler);
    }
  }
  /** Issued when all executionContexts were cleared in browser */
  get executionContextsCleared() {
    return this._executionContextsCleared;
  }
  set executionContextsCleared(handler) {
    if (this._executionContextsCleared) {
      this._client.removeListener("Runtime.executionContextsCleared", this._executionContextsCleared);
    }
    this._executionContextsCleared = handler;
    if (handler) {
      this._client.on("Runtime.executionContextsCleared", handler);
    }
  }
  /** Issued when exception was thrown and unhandled. */
  get exceptionThrown() {
    return this._exceptionThrown;
  }
  set exceptionThrown(handler) {
    if (this._exceptionThrown) {
      this._client.removeListener("Runtime.exceptionThrown", this._exceptionThrown);
    }
    this._exceptionThrown = handler;
    if (handler) {
      this._client.on("Runtime.exceptionThrown", handler);
    }
  }
  /** Issued when unhandled exception was revoked. */
  get exceptionRevoked() {
    return this._exceptionRevoked;
  }
  set exceptionRevoked(handler) {
    if (this._exceptionRevoked) {
      this._client.removeListener("Runtime.exceptionRevoked", this._exceptionRevoked);
    }
    this._exceptionRevoked = handler;
    if (handler) {
      this._client.on("Runtime.exceptionRevoked", handler);
    }
  }
  /** Issued when console API was called. */
  get consoleAPICalled() {
    return this._consoleAPICalled;
  }
  set consoleAPICalled(handler) {
    if (this._consoleAPICalled) {
      this._client.removeListener("Runtime.consoleAPICalled", this._consoleAPICalled);
    }
    this._consoleAPICalled = handler;
    if (handler) {
      this._client.on("Runtime.consoleAPICalled", handler);
    }
  }
  /** Issued when object should be inspected (for example, as a result of inspect() command line API call). */
  get inspectRequested() {
    return this._inspectRequested;
  }
  set inspectRequested(handler) {
    if (this._inspectRequested) {
      this._client.removeListener("Runtime.inspectRequested", this._inspectRequested);
    }
    this._inspectRequested = handler;
    if (handler) {
      this._client.on("Runtime.inspectRequested", handler);
    }
  }
}
export namespace Runtime {
  /** Unique script identifier. */
  export type ScriptId = string;
  /** Unique object identifier. */
  export type RemoteObjectId = string;
  /** Primitive value which cannot be JSON-stringified. */
  export type UnserializableValue = "Infinity" | "NaN" | "-Infinity" | "-0";
  /** Mirror object referencing original JavaScript object. */
  export interface RemoteObject {
    /** Object type. */
    type: "object" | "function" | "undefined" | "string" | "number" | "boolean" | "symbol";
    /** Object subtype hint. Specified for <code>object</code> type values only. */
    subtype?: "array" | "null" | "node" | "regexp" | "date" | "map" | "set" | "iterator" | "generator" | "error" | "proxy" | "promise" | "typedarray";
    /** Object class (constructor) name. Specified for <code>object</code> type values only. */
    className?: string;
    /** Remote object value in case of primitive values or JSON values (if it was requested). */
    value?: any;
    /** Primitive value which can not be JSON-stringified does not have <code>value</code>, but gets this property. */
    unserializableValue?: UnserializableValue;
    /** String representation of the object. */
    description?: string;
    /** Unique object identifier (for non-primitive values). */
    objectId?: RemoteObjectId;
    /** Preview containing abbreviated property values. Specified for <code>object</code> type values only. */
    preview?: ObjectPreview;
    customPreview?: CustomPreview;
  }
  /** Object property descriptor. */
  export interface PropertyDescriptor {
    /** Property name or symbol description. */
    name: string;
    /** The value associated with the property. */
    value?: RemoteObject;
    /** True if the value associated with the property may be changed (data descriptors only). */
    writable?: boolean;
    /** A function which serves as a getter for the property, or <code>undefined</code> if there is no getter (accessor descriptors only). */
    get?: RemoteObject;
    /** A function which serves as a setter for the property, or <code>undefined</code> if there is no setter (accessor descriptors only). */
    set?: RemoteObject;
    /** True if the type of this property descriptor may be changed and if the property may be deleted from the corresponding object. */
    configurable: boolean;
    /** True if this property shows up during enumeration of the properties on the corresponding object. */
    enumerable: boolean;
    /** True if the result was thrown during the evaluation. */
    wasThrown?: boolean;
    /** True if the property is owned for the object. */
    isOwn?: boolean;
    /** Property symbol object, if the property is of the <code>symbol</code> type. */
    symbol?: RemoteObject;
  }
  /** Object internal property descriptor. This property isn't normally visible in JavaScript code. */
  export interface InternalPropertyDescriptor {
    /** Conventional property name. */
    name: string;
    /** The value associated with the property. */
    value?: RemoteObject;
  }
  /** Represents function call argument. Either remote object id <code>objectId</code>, primitive <code>value</code>, unserializable primitive value or neither of (for undefined) them should be specified. */
  export interface CallArgument {
    /** Primitive value. */
    value?: any;
    /** Primitive value which can not be JSON-stringified. */
    unserializableValue?: UnserializableValue;
    /** Remote object handle. */
    objectId?: RemoteObjectId;
  }
  /** Id of an execution context. */
  export type ExecutionContextId = number;
  /** Description of an isolated world. */
  export interface ExecutionContextDescription {
    /** Unique id of the execution context. It can be used to specify in which execution context script evaluation should be performed. */
    id: ExecutionContextId;
    /** Execution context origin. */
    origin: string;
    /** Human readable name describing given context. */
    name: string;
    /** Embedder-specific auxiliary data. */
    auxData?: any;
  }
  /** Detailed information about exception (or error) that was thrown during script compilation or execution. */
  export interface ExceptionDetails {
    /** Exception id. */
    exceptionId: number;
    /** Exception text, which should be used together with exception object when available. */
    text: string;
    /** Line number of the exception location (0-based). */
    lineNumber: number;
    /** Column number of the exception location (0-based). */
    columnNumber: number;
    /** Script ID of the exception location. */
    scriptId?: ScriptId;
    /** URL of the exception location, to be used when the script was not reported. */
    url?: string;
    /** JavaScript stack trace if available. */
    stackTrace?: StackTrace;
    /** Exception object if available. */
    exception?: RemoteObject;
    /** Identifier of the context where exception happened. */
    executionContextId?: ExecutionContextId;
  }
  /** Number of milliseconds since epoch. */
  export type Timestamp = number;
  /** Stack entry for runtime errors and assertions. */
  export interface CallFrame {
    /** JavaScript function name. */
    functionName: string;
    /** JavaScript script id. */
    scriptId: ScriptId;
    /** JavaScript script name or url. */
    url: string;
    /** JavaScript script line number (0-based). */
    lineNumber: number;
    /** JavaScript script column number (0-based). */
    columnNumber: number;
  }
  /** Call frames for assertions or error messages. */
  export interface StackTrace {
    /** String label of this stack trace. For async traces this may be a name of the function that initiated the async call. */
    description?: string;
    /** JavaScript function name. */
    callFrames: CallFrame[];
    /** Asynchronous JavaScript stack trace that preceded this stack, if available. */
    parent?: StackTrace;
  }
  export type ObjectPreview = any;
  export type CustomPreview = any;
  export type ExecutionContextCreatedParameters = {
    /** A newly created execution contex. */
    context: ExecutionContextDescription;
  };
  export type ExecutionContextCreatedHandler = (params: ExecutionContextCreatedParameters) => void;
  export type ExecutionContextDestroyedParameters = {
    /** Id of the destroyed context */
    executionContextId: ExecutionContextId;
  };
  export type ExecutionContextDestroyedHandler = (params: ExecutionContextDestroyedParameters) => void;
  export type ExecutionContextsClearedHandler = () => void;
  export type ExceptionThrownParameters = {
    /** Timestamp of the exception. */
    timestamp: Timestamp;
    exceptionDetails: ExceptionDetails;
  };
  export type ExceptionThrownHandler = (params: ExceptionThrownParameters) => void;
  export type ExceptionRevokedParameters = {
    /** Reason describing why exception was revoked. */
    reason: string;
    /** The id of revoked exception, as reported in <code>exceptionUnhandled</code>. */
    exceptionId: number;
  };
  export type ExceptionRevokedHandler = (params: ExceptionRevokedParameters) => void;
  export type ConsoleAPICalledParameters = {
    /** Type of the call. */
    type: "log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd";
    /** Call arguments. */
    args: RemoteObject[];
    /** Identifier of the context where the call was made. */
    executionContextId: ExecutionContextId;
    /** Call timestamp. */
    timestamp: Timestamp;
    /** Stack trace captured when the call was made. */
    stackTrace?: StackTrace;
  };
  export type ConsoleAPICalledHandler = (params: ConsoleAPICalledParameters) => void;
  export type InspectRequestedParameters = {
    object: RemoteObject;
    hints: any;
  };
  export type InspectRequestedHandler = (params: InspectRequestedParameters) => void;
  export type EvaluateParameters = {
    /** Expression to evaluate. */
    expression: string;
    /** Symbolic group name that can be used to release multiple objects. */
    objectGroup?: string;
    /** Determines whether Command Line API should be available during the evaluation. */
    includeCommandLineAPI?: boolean;
    /** In silent mode exceptions thrown during evaluation are not reported and do not pause execution. Overrides <code>setPauseOnException</code> state. */
    silent?: boolean;
    /** Specifies in which execution context to perform evaluation. If the parameter is omitted the evaluation will be performed in the context of the inspected page. */
    contextId?: ExecutionContextId;
    /** Whether the result is expected to be a JSON object that should be sent by value. */
    returnByValue?: boolean;
    /** Whether preview should be generated for the result. */
    generatePreview?: boolean;
    /** Whether execution should be treated as initiated by user in the UI. */
    userGesture?: boolean;
    /** Whether execution should wait for promise to be resolved. If the result of evaluation is not a Promise, it's considered to be an error. */
    awaitPromise?: boolean;
  };
  export type EvaluateReturn = {
    /** Evaluation result. */
    result: RemoteObject;
    /** Exception details. */
    exceptionDetails?: ExceptionDetails;
  };
  export type AwaitPromiseParameters = {
    /** Identifier of the promise. */
    promiseObjectId: RemoteObjectId;
    /** Whether the result is expected to be a JSON object that should be sent by value. */
    returnByValue?: boolean;
    /** Whether preview should be generated for the result. */
    generatePreview?: boolean;
  };
  export type AwaitPromiseReturn = {
    /** Promise result. Will contain rejected value if promise was rejected. */
    result: RemoteObject;
    /** Exception details if stack strace is available. */
    exceptionDetails?: ExceptionDetails;
  };
  export type CallFunctionOnParameters = {
    /** Identifier of the object to call function on. */
    objectId: RemoteObjectId;
    /** Declaration of the function to call. */
    functionDeclaration: string;
    /** Call arguments. All call arguments must belong to the same JavaScript world as the target object. */
    arguments?: CallArgument[];
    /** In silent mode exceptions thrown during evaluation are not reported and do not pause execution. Overrides <code>setPauseOnException</code> state. */
    silent?: boolean;
    /** Whether the result is expected to be a JSON object which should be sent by value. */
    returnByValue?: boolean;
    /** Whether preview should be generated for the result. */
    generatePreview?: boolean;
    /** Whether execution should be treated as initiated by user in the UI. */
    userGesture?: boolean;
    /** Whether execution should wait for promise to be resolved. If the result of evaluation is not a Promise, it's considered to be an error. */
    awaitPromise?: boolean;
  };
  export type CallFunctionOnReturn = {
    /** Call result. */
    result: RemoteObject;
    /** Exception details. */
    exceptionDetails?: ExceptionDetails;
  };
  export type GetPropertiesParameters = {
    /** Identifier of the object to return properties for. */
    objectId: RemoteObjectId;
    /** If true, returns properties belonging only to the element itself, not to its prototype chain. */
    ownProperties?: boolean;
    /** If true, returns accessor properties (with getter/setter) only; internal properties are not returned either. */
    accessorPropertiesOnly?: boolean;
    /** Whether preview should be generated for the results. */
    generatePreview?: boolean;
  };
  export type GetPropertiesReturn = {
    /** Object properties. */
    result: PropertyDescriptor[];
    /** Internal object properties (only of the element itself). */
    internalProperties?: InternalPropertyDescriptor[];
    /** Exception details. */
    exceptionDetails?: ExceptionDetails;
  };
  export type ReleaseObjectParameters = {
    /** Identifier of the object to release. */
    objectId: RemoteObjectId;
  };
  export type ReleaseObjectGroupParameters = {
    /** Symbolic object group name. */
    objectGroup: string;
  };
  export type CompileScriptParameters = {
    /** Expression to compile. */
    expression: string;
    /** Source url to be set for the script. */
    sourceURL: string;
    /** Specifies whether the compiled script should be persisted. */
    persistScript: boolean;
    /** Specifies in which execution context to perform script run. If the parameter is omitted the evaluation will be performed in the context of the inspected page. */
    executionContextId?: ExecutionContextId;
  };
  export type CompileScriptReturn = {
    /** Id of the script. */
    scriptId?: ScriptId;
    /** Exception details. */
    exceptionDetails?: ExceptionDetails;
  };
  export type RunScriptParameters = {
    /** Id of the script to run. */
    scriptId: ScriptId;
    /** Specifies in which execution context to perform script run. If the parameter is omitted the evaluation will be performed in the context of the inspected page. */
    executionContextId?: ExecutionContextId;
    /** Symbolic group name that can be used to release multiple objects. */
    objectGroup?: string;
    /** In silent mode exceptions thrown during evaluation are not reported and do not pause execution. Overrides <code>setPauseOnException</code> state. */
    silent?: boolean;
    /** Determines whether Command Line API should be available during the evaluation. */
    includeCommandLineAPI?: boolean;
    /** Whether the result is expected to be a JSON object which should be sent by value. */
    returnByValue?: boolean;
    /** Whether preview should be generated for the result. */
    generatePreview?: boolean;
    /** Whether execution should wait for promise to be resolved. If the result of evaluation is not a Promise, it's considered to be an error. */
    awaitPromise?: boolean;
  };
  export type RunScriptReturn = {
    /** Run result. */
    result: RemoteObject;
    /** Exception details. */
    exceptionDetails?: ExceptionDetails;
  };
}
/** Debugger domain exposes JavaScript debugging capabilities. It allows setting and removing breakpoints, stepping through execution, exploring stack traces, etc. */
export class Debugger {
  private _scriptParsed: Debugger.ScriptParsedHandler | null = null;
  private _scriptFailedToParse: Debugger.ScriptFailedToParseHandler | null = null;
  private _breakpointResolved: Debugger.BreakpointResolvedHandler | null = null;
  private _paused: Debugger.PausedHandler | null = null;
  private _resumed: Debugger.ResumedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables debugger for the given page. Clients should not assume that the debugging has been enabled until the result for this command is received. */
  public enable() {
    return this._client.send<void>("Debugger.enable");
  }
  /** Disables debugger for given page. */
  public disable() {
    return this._client.send<void>("Debugger.disable");
  }
  /** Activates / deactivates all breakpoints on the page. */
  public setBreakpointsActive(params: Debugger.SetBreakpointsActiveParameters) {
    return this._client.send<void>("Debugger.setBreakpointsActive", params);
  }
  /** Makes page not interrupt on any pauses (breakpoint, exception, dom exception etc). */
  public setSkipAllPauses(params: Debugger.SetSkipAllPausesParameters) {
    return this._client.send<void>("Debugger.setSkipAllPauses", params);
  }
  /** Sets JavaScript breakpoint at given location specified either by URL or URL regex. Once this command is issued, all existing parsed scripts will have breakpoints resolved and returned in <code>locations</code> property. Further matching script parsing will result in subsequent <code>breakpointResolved</code> events issued. This logical breakpoint will survive page reloads. */
  public setBreakpointByUrl(params: Debugger.SetBreakpointByUrlParameters) {
    return this._client.send<Debugger.SetBreakpointByUrlReturn>("Debugger.setBreakpointByUrl", params);
  }
  /** Sets JavaScript breakpoint at a given location. */
  public setBreakpoint(params: Debugger.SetBreakpointParameters) {
    return this._client.send<Debugger.SetBreakpointReturn>("Debugger.setBreakpoint", params);
  }
  /** Removes JavaScript breakpoint. */
  public removeBreakpoint(params: Debugger.RemoveBreakpointParameters) {
    return this._client.send<void>("Debugger.removeBreakpoint", params);
  }
  /** Continues execution until specific location is reached. */
  public continueToLocation(params: Debugger.ContinueToLocationParameters) {
    return this._client.send<void>("Debugger.continueToLocation", params);
  }
  /** Steps over the statement. */
  public stepOver() {
    return this._client.send<void>("Debugger.stepOver");
  }
  /** Steps into the function call. */
  public stepInto() {
    return this._client.send<void>("Debugger.stepInto");
  }
  /** Steps out of the function call. */
  public stepOut() {
    return this._client.send<void>("Debugger.stepOut");
  }
  /** Stops on the next JavaScript statement. */
  public pause() {
    return this._client.send<void>("Debugger.pause");
  }
  /** Resumes JavaScript execution. */
  public resume() {
    return this._client.send<void>("Debugger.resume");
  }
  /** Edits JavaScript source live. */
  public setScriptSource(params: Debugger.SetScriptSourceParameters) {
    return this._client.send<Debugger.SetScriptSourceReturn>("Debugger.setScriptSource", params);
  }
  /** Restarts particular call frame from the beginning. */
  public restartFrame(params: Debugger.RestartFrameParameters) {
    return this._client.send<Debugger.RestartFrameReturn>("Debugger.restartFrame", params);
  }
  /** Returns source for the script with given id. */
  public getScriptSource(params: Debugger.GetScriptSourceParameters) {
    return this._client.send<Debugger.GetScriptSourceReturn>("Debugger.getScriptSource", params);
  }
  /** Defines pause on exceptions state. Can be set to stop on all exceptions, uncaught exceptions or no exceptions. Initial pause on exceptions state is <code>none</code>. */
  public setPauseOnExceptions(params: Debugger.SetPauseOnExceptionsParameters) {
    return this._client.send<void>("Debugger.setPauseOnExceptions", params);
  }
  /** Evaluates expression on a given call frame. */
  public evaluateOnCallFrame(params: Debugger.EvaluateOnCallFrameParameters) {
    return this._client.send<Debugger.EvaluateOnCallFrameReturn>("Debugger.evaluateOnCallFrame", params);
  }
  /** Changes value of variable in a callframe. Object-based scopes are not supported and must be mutated manually. */
  public setVariableValue(params: Debugger.SetVariableValueParameters) {
    return this._client.send<void>("Debugger.setVariableValue", params);
  }
  /** Enables or disables async call stacks tracking. */
  public setAsyncCallStackDepth(params: Debugger.SetAsyncCallStackDepthParameters) {
    return this._client.send<void>("Debugger.setAsyncCallStackDepth", params);
  }
  /** Fired when virtual machine parses script. This event is also fired for all known and uncollected scripts upon enabling debugger. */
  get scriptParsed() {
    return this._scriptParsed;
  }
  set scriptParsed(handler) {
    if (this._scriptParsed) {
      this._client.removeListener("Debugger.scriptParsed", this._scriptParsed);
    }
    this._scriptParsed = handler;
    if (handler) {
      this._client.on("Debugger.scriptParsed", handler);
    }
  }
  /** Fired when virtual machine fails to parse the script. */
  get scriptFailedToParse() {
    return this._scriptFailedToParse;
  }
  set scriptFailedToParse(handler) {
    if (this._scriptFailedToParse) {
      this._client.removeListener("Debugger.scriptFailedToParse", this._scriptFailedToParse);
    }
    this._scriptFailedToParse = handler;
    if (handler) {
      this._client.on("Debugger.scriptFailedToParse", handler);
    }
  }
  /** Fired when breakpoint is resolved to an actual script and location. */
  get breakpointResolved() {
    return this._breakpointResolved;
  }
  set breakpointResolved(handler) {
    if (this._breakpointResolved) {
      this._client.removeListener("Debugger.breakpointResolved", this._breakpointResolved);
    }
    this._breakpointResolved = handler;
    if (handler) {
      this._client.on("Debugger.breakpointResolved", handler);
    }
  }
  /** Fired when the virtual machine stopped on breakpoint or exception or any other stop criteria. */
  get paused() {
    return this._paused;
  }
  set paused(handler) {
    if (this._paused) {
      this._client.removeListener("Debugger.paused", this._paused);
    }
    this._paused = handler;
    if (handler) {
      this._client.on("Debugger.paused", handler);
    }
  }
  /** Fired when the virtual machine resumed execution. */
  get resumed() {
    return this._resumed;
  }
  set resumed(handler) {
    if (this._resumed) {
      this._client.removeListener("Debugger.resumed", this._resumed);
    }
    this._resumed = handler;
    if (handler) {
      this._client.on("Debugger.resumed", handler);
    }
  }
}
export namespace Debugger {
  /** Breakpoint identifier. */
  export type BreakpointId = string;
  /** Call frame identifier. */
  export type CallFrameId = string;
  /** Location in the source code. */
  export interface Location {
    /** Script identifier as reported in the <code>Debugger.scriptParsed</code>. */
    scriptId: Runtime.ScriptId;
    /** Line number in the script (0-based). */
    lineNumber: number;
    /** Column number in the script (0-based). */
    columnNumber?: number;
  }
  /** JavaScript call frame. Array of call frames form the call stack. */
  export interface CallFrame {
    /** Call frame identifier. This identifier is only valid while the virtual machine is paused. */
    callFrameId: CallFrameId;
    /** Name of the JavaScript function called on this call frame. */
    functionName: string;
    /** Location in the source code. */
    functionLocation?: Location;
    /** Location in the source code. */
    location: Location;
    /** Scope chain for this call frame. */
    scopeChain: Scope[];
    /** <code>this</code> object for this call frame. */
    this: Runtime.RemoteObject;
    /** The value being returned, if the function is at return point. */
    returnValue?: Runtime.RemoteObject;
  }
  /** Scope description. */
  export interface Scope {
    /** Scope type. */
    type: "global" | "local" | "with" | "closure" | "catch" | "block" | "script";
    /** Object representing the scope. For <code>global</code> and <code>with</code> scopes it represents the actual object; for the rest of the scopes, it is artificial transient object enumerating scope variables as its properties. */
    object: Runtime.RemoteObject;
    name?: string;
    /** Location in the source code where scope starts */
    startLocation?: Location;
    /** Location in the source code where scope ends */
    endLocation?: Location;
  }
  export type ScriptParsedParameters = {
    /** Identifier of the script parsed. */
    scriptId: Runtime.ScriptId;
    /** URL or name of the script parsed (if any). */
    url: string;
    /** Line offset of the script within the resource with given URL (for script tags). */
    startLine: number;
    /** Column offset of the script within the resource with given URL. */
    startColumn: number;
    /** Last line of the script. */
    endLine: number;
    /** Length of the last line of the script. */
    endColumn: number;
    /** Specifies script creation context. */
    executionContextId: Runtime.ExecutionContextId;
    /** Content hash of the script. */
    hash: string;
    /** Embedder-specific auxiliary data. */
    executionContextAuxData?: any;
    /** True, if this script is generated as a result of the live edit operation. */
    isLiveEdit?: boolean;
    /** URL of source map associated with script (if any). */
    sourceMapURL?: string;
    /** True, if this script has sourceURL. */
    hasSourceURL?: boolean;
  };
  export type ScriptParsedHandler = (params: ScriptParsedParameters) => void;
  export type ScriptFailedToParseParameters = {
    /** Identifier of the script parsed. */
    scriptId: Runtime.ScriptId;
    /** URL or name of the script parsed (if any). */
    url: string;
    /** Line offset of the script within the resource with given URL (for script tags). */
    startLine: number;
    /** Column offset of the script within the resource with given URL. */
    startColumn: number;
    /** Last line of the script. */
    endLine: number;
    /** Length of the last line of the script. */
    endColumn: number;
    /** Specifies script creation context. */
    executionContextId: Runtime.ExecutionContextId;
    /** Content hash of the script. */
    hash: string;
    /** Embedder-specific auxiliary data. */
    executionContextAuxData?: any;
    /** URL of source map associated with script (if any). */
    sourceMapURL?: string;
    /** True, if this script has sourceURL. */
    hasSourceURL?: boolean;
  };
  export type ScriptFailedToParseHandler = (params: ScriptFailedToParseParameters) => void;
  export type BreakpointResolvedParameters = {
    /** Breakpoint unique identifier. */
    breakpointId: BreakpointId;
    /** Actual breakpoint location. */
    location: Location;
  };
  export type BreakpointResolvedHandler = (params: BreakpointResolvedParameters) => void;
  export type PausedParameters = {
    /** Call stack the virtual machine stopped on. */
    callFrames: CallFrame[];
    /** Pause reason. */
    reason: "XHR" | "DOM" | "EventListener" | "exception" | "assert" | "debugCommand" | "promiseRejection" | "other";
    /** Object containing break-specific auxiliary properties. */
    data?: any;
    /** Hit breakpoints IDs */
    hitBreakpoints?: string[];
    /** Async stack trace, if any. */
    asyncStackTrace?: Runtime.StackTrace;
  };
  export type PausedHandler = (params: PausedParameters) => void;
  export type ResumedHandler = () => void;
  export type SetBreakpointsActiveParameters = {
    /** New value for breakpoints active state. */
    active: boolean;
  };
  export type SetSkipAllPausesParameters = {
    /** New value for skip pauses state. */
    skip: boolean;
  };
  export type SetBreakpointByUrlParameters = {
    /** Line number to set breakpoint at. */
    lineNumber: number;
    /** URL of the resources to set breakpoint on. */
    url?: string;
    /** Regex pattern for the URLs of the resources to set breakpoints on. Either <code>url</code> or <code>urlRegex</code> must be specified. */
    urlRegex?: string;
    /** Offset in the line to set breakpoint at. */
    columnNumber?: number;
    /** Expression to use as a breakpoint condition. When specified, debugger will only stop on the breakpoint if this expression evaluates to true. */
    condition?: string;
  };
  export type SetBreakpointByUrlReturn = {
    /** Id of the created breakpoint for further reference. */
    breakpointId: BreakpointId;
    /** List of the locations this breakpoint resolved into upon addition. */
    locations: Location[];
  };
  export type SetBreakpointParameters = {
    /** Location to set breakpoint in. */
    location: Location;
    /** Expression to use as a breakpoint condition. When specified, debugger will only stop on the breakpoint if this expression evaluates to true. */
    condition?: string;
  };
  export type SetBreakpointReturn = {
    /** Id of the created breakpoint for further reference. */
    breakpointId: BreakpointId;
    /** Location this breakpoint resolved into. */
    actualLocation: Location;
  };
  export type RemoveBreakpointParameters = {
    breakpointId: BreakpointId;
  };
  export type ContinueToLocationParameters = {
    /** Location to continue to. */
    location: Location;
  };
  export type SetScriptSourceParameters = {
    /** Id of the script to edit. */
    scriptId: Runtime.ScriptId;
    /** New content of the script. */
    scriptSource: string;
    /**  If true the change will not actually be applied. Dry run may be used to get result description without actually modifying the code. */
    dryRun?: boolean;
  };
  export type SetScriptSourceReturn = {
    /** New stack trace in case editing has happened while VM was stopped. */
    callFrames?: CallFrame[];
    /** Whether current call stack  was modified after applying the changes. */
    stackChanged?: boolean;
    /** Async stack trace, if any. */
    asyncStackTrace?: Runtime.StackTrace;
    /** Exception details if any. */
    exceptionDetails?: Runtime.ExceptionDetails;
  };
  export type RestartFrameParameters = {
    /** Call frame identifier to evaluate on. */
    callFrameId: CallFrameId;
  };
  export type RestartFrameReturn = {
    /** New stack trace. */
    callFrames: CallFrame[];
    /** Async stack trace, if any. */
    asyncStackTrace?: Runtime.StackTrace;
  };
  export type GetScriptSourceParameters = {
    /** Id of the script to get source for. */
    scriptId: Runtime.ScriptId;
  };
  export type GetScriptSourceReturn = {
    /** Script source. */
    scriptSource: string;
  };
  export type SetPauseOnExceptionsParameters = {
    /** Pause on exceptions mode. */
    state: "none" | "uncaught" | "all";
  };
  export type EvaluateOnCallFrameParameters = {
    /** Call frame identifier to evaluate on. */
    callFrameId: CallFrameId;
    /** Expression to evaluate. */
    expression: string;
    /** String object group name to put result into (allows rapid releasing resulting object handles using <code>releaseObjectGroup</code>). */
    objectGroup?: string;
    /** Specifies whether command line API should be available to the evaluated expression, defaults to false. */
    includeCommandLineAPI?: boolean;
    /** In silent mode exceptions thrown during evaluation are not reported and do not pause execution. Overrides <code>setPauseOnException</code> state. */
    silent?: boolean;
    /** Whether the result is expected to be a JSON object that should be sent by value. */
    returnByValue?: boolean;
    /** Whether preview should be generated for the result. */
    generatePreview?: boolean;
  };
  export type EvaluateOnCallFrameReturn = {
    /** Object wrapper for the evaluation result. */
    result: Runtime.RemoteObject;
    /** Exception details. */
    exceptionDetails?: Runtime.ExceptionDetails;
  };
  export type SetVariableValueParameters = {
    /** 0-based number of scope as was listed in scope chain. Only 'local', 'closure' and 'catch' scope types are allowed. Other scopes could be manipulated manually. */
    scopeNumber: number;
    /** Variable name. */
    variableName: string;
    /** New variable value. */
    newValue: Runtime.CallArgument;
    /** Id of callframe that holds variable. */
    callFrameId: CallFrameId;
  };
  export type SetAsyncCallStackDepthParameters = {
    /** Maximum depth of async call stacks. Setting to <code>0</code> will effectively disable collecting async call stacks (default). */
    maxDepth: number;
  };
}
export class Profiler {
  private _consoleProfileStarted: Profiler.ConsoleProfileStartedHandler | null = null;
  private _consoleProfileFinished: Profiler.ConsoleProfileFinishedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  public enable() {
    return this._client.send<void>("Profiler.enable");
  }
  public disable() {
    return this._client.send<void>("Profiler.disable");
  }
  /** Changes CPU profiler sampling interval. Must be called before CPU profiles recording started. */
  public setSamplingInterval(params: Profiler.SetSamplingIntervalParameters) {
    return this._client.send<void>("Profiler.setSamplingInterval", params);
  }
  public start() {
    return this._client.send<void>("Profiler.start");
  }
  public stop() {
    return this._client.send<Profiler.StopReturn>("Profiler.stop");
  }
  /** Sent when new profile recodring is started using console.profile() call. */
  get consoleProfileStarted() {
    return this._consoleProfileStarted;
  }
  set consoleProfileStarted(handler) {
    if (this._consoleProfileStarted) {
      this._client.removeListener("Profiler.consoleProfileStarted", this._consoleProfileStarted);
    }
    this._consoleProfileStarted = handler;
    if (handler) {
      this._client.on("Profiler.consoleProfileStarted", handler);
    }
  }
  get consoleProfileFinished() {
    return this._consoleProfileFinished;
  }
  set consoleProfileFinished(handler) {
    if (this._consoleProfileFinished) {
      this._client.removeListener("Profiler.consoleProfileFinished", this._consoleProfileFinished);
    }
    this._consoleProfileFinished = handler;
    if (handler) {
      this._client.on("Profiler.consoleProfileFinished", handler);
    }
  }
}
export namespace Profiler {
  /** Profile node. Holds callsite information, execution statistics and child nodes. */
  export interface ProfileNode {
    /** Unique id of the node. */
    id: number;
    /** Function location. */
    callFrame: Runtime.CallFrame;
    /** Number of samples where this node was on top of the call stack. */
    hitCount?: number;
    /** Child node ids. */
    children?: number[];
    /** The reason of being not optimized. The function may be deoptimized or marked as don't optimize. */
    deoptReason?: string;
    /** An array of source position ticks. */
    positionTicks?: PositionTickInfo[];
  }
  /** Profile. */
  export interface Profile {
    /** The list of profile nodes. First item is the root node. */
    nodes: ProfileNode[];
    /** Profiling start timestamp in microseconds. */
    startTime: number;
    /** Profiling end timestamp in microseconds. */
    endTime: number;
    /** Ids of samples top nodes. */
    samples?: number[];
    /** Time intervals between adjacent samples in microseconds. The first delta is relative to the profile startTime. */
    timeDeltas?: number[];
  }
  export type PositionTickInfo = any;
  export type ConsoleProfileStartedParameters = {
    id: string;
    /** Location of console.profile(). */
    location: Debugger.Location;
    /** Profile title passed as an argument to console.profile(). */
    title?: string;
  };
  export type ConsoleProfileStartedHandler = (params: ConsoleProfileStartedParameters) => void;
  export type ConsoleProfileFinishedParameters = {
    id: string;
    /** Location of console.profileEnd(). */
    location: Debugger.Location;
    profile: Profile;
    /** Profile title passed as an argument to console.profile(). */
    title?: string;
  };
  export type ConsoleProfileFinishedHandler = (params: ConsoleProfileFinishedParameters) => void;
  export type SetSamplingIntervalParameters = {
    /** New sampling interval in microseconds. */
    interval: number;
  };
  export type StopReturn = {
    /** Recorded profile. */
    profile: Profile;
  };
}
export namespace Security {
  export type CertificateId = any;
  export type SecurityState = any;
}
