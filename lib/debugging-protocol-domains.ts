/* tslint:disable */
/**
 * Debugging Protocol 1.2 Domains
 * Generated on Mon Apr 10 2017 12:58:29 GMT-0700 (PDT)
 */
import { IDebuggingProtocolClient } from "chrome-debugging-client";
export class Inspector {
  private _detached: Inspector.detached_Handler = undefined;
  private _targetCrashed: Inspector.targetCrashed_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables inspector domain notifications. */
  enable(): Promise<void> {
    return this._client.send<void>("Inspector.enable");
  }
  /** Disables inspector domain notifications. */
  disable(): Promise<void> {
    return this._client.send<void>("Inspector.disable");
  }
  /** Fired when remote debugging connection is about to be terminated. Contains detach reason. */
  get detached(): Inspector.detached_Handler {
    return this._detached;
  }
  set detached(handler: Inspector.detached_Handler) {
    if (this._detached) {
      this._client.removeListener("Inspector.detached", this._detached);
    }
    this._detached = handler;
    if (handler) {
      this._client.on("Inspector.detached", handler);
    }
  }
  /** Fired when debugging target has crashed */
  get targetCrashed(): Inspector.targetCrashed_Handler {
    return this._targetCrashed;
  }
  set targetCrashed(handler: Inspector.targetCrashed_Handler) {
    if (this._targetCrashed) {
      this._client.removeListener("Inspector.targetCrashed", this._targetCrashed);
    }
    this._targetCrashed = handler;
    if (handler) {
      this._client.on("Inspector.targetCrashed", handler);
    }
  }
}
export namespace Inspector {
  export type detached_Parameters = {
    /** The reason why connection has been terminated. */
    reason: string;
  };
  export type detached_Handler = (params: detached_Parameters) => void;
  export type targetCrashed_Handler = () => void;
}
export class Memory {
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  getDOMCounters(): Promise<Memory.getDOMCounters_Return> {
    return this._client.send<Memory.getDOMCounters_Return>("Memory.getDOMCounters");
  }
  /** Enable/disable suppressing memory pressure notifications in all processes. */
  setPressureNotificationsSuppressed(params: Memory.setPressureNotificationsSuppressed_Parameters): Promise<void> {
    return this._client.send<void>("Memory.setPressureNotificationsSuppressed", params);
  }
  /** Simulate a memory pressure notification in all processes. */
  simulatePressureNotification(params: Memory.simulatePressureNotification_Parameters): Promise<void> {
    return this._client.send<void>("Memory.simulatePressureNotification", params);
  }
}
export namespace Memory {
  /** Memory pressure level. */
  export type PressureLevel = "moderate" | "critical";
  export type getDOMCounters_Return = {
    documents: number;
    nodes: number;
    jsEventListeners: number;
  };
  export type setPressureNotificationsSuppressed_Parameters = {
    /** If true, memory pressure notifications will be suppressed. */
    suppressed: boolean;
  };
  export type simulatePressureNotification_Parameters = {
    /** Memory pressure level of the notification. */
    level: PressureLevel;
  };
}
/** Actions and events related to the inspected page belong to the page domain. */
export class Page {
  private _domContentEventFired: Page.domContentEventFired_Handler = undefined;
  private _loadEventFired: Page.loadEventFired_Handler = undefined;
  private _frameAttached: Page.frameAttached_Handler = undefined;
  private _frameNavigated: Page.frameNavigated_Handler = undefined;
  private _frameDetached: Page.frameDetached_Handler = undefined;
  private _frameStartedLoading: Page.frameStartedLoading_Handler = undefined;
  private _frameStoppedLoading: Page.frameStoppedLoading_Handler = undefined;
  private _frameScheduledNavigation: Page.frameScheduledNavigation_Handler = undefined;
  private _frameClearedScheduledNavigation: Page.frameClearedScheduledNavigation_Handler = undefined;
  private _frameResized: Page.frameResized_Handler = undefined;
  private _javascriptDialogOpening: Page.javascriptDialogOpening_Handler = undefined;
  private _javascriptDialogClosed: Page.javascriptDialogClosed_Handler = undefined;
  private _screencastFrame: Page.screencastFrame_Handler = undefined;
  private _screencastVisibilityChanged: Page.screencastVisibilityChanged_Handler = undefined;
  private _colorPicked: Page.colorPicked_Handler = undefined;
  private _interstitialShown: Page.interstitialShown_Handler = undefined;
  private _interstitialHidden: Page.interstitialHidden_Handler = undefined;
  private _navigationRequested: Page.navigationRequested_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables page domain notifications. */
  enable(): Promise<void> {
    return this._client.send<void>("Page.enable");
  }
  /** Disables page domain notifications. */
  disable(): Promise<void> {
    return this._client.send<void>("Page.disable");
  }
  addScriptToEvaluateOnLoad(params: Page.addScriptToEvaluateOnLoad_Parameters): Promise<Page.addScriptToEvaluateOnLoad_Return> {
    return this._client.send<Page.addScriptToEvaluateOnLoad_Return>("Page.addScriptToEvaluateOnLoad", params);
  }
  removeScriptToEvaluateOnLoad(params: Page.removeScriptToEvaluateOnLoad_Parameters): Promise<void> {
    return this._client.send<void>("Page.removeScriptToEvaluateOnLoad", params);
  }
  /** Controls whether browser will open a new inspector window for connected pages. */
  setAutoAttachToCreatedPages(params: Page.setAutoAttachToCreatedPages_Parameters): Promise<void> {
    return this._client.send<void>("Page.setAutoAttachToCreatedPages", params);
  }
  /** Reloads given page optionally ignoring the cache. */
  reload(params: Page.reload_Parameters): Promise<void> {
    return this._client.send<void>("Page.reload", params);
  }
  /** Navigates current page to the given URL. */
  navigate(params: Page.navigate_Parameters): Promise<Page.navigate_Return> {
    return this._client.send<Page.navigate_Return>("Page.navigate", params);
  }
  /** Force the page stop all navigations and pending resource fetches. */
  stopLoading(): Promise<void> {
    return this._client.send<void>("Page.stopLoading");
  }
  /** Returns navigation history for the current page. */
  getNavigationHistory(): Promise<Page.getNavigationHistory_Return> {
    return this._client.send<Page.getNavigationHistory_Return>("Page.getNavigationHistory");
  }
  /** Navigates current page to the given history entry. */
  navigateToHistoryEntry(params: Page.navigateToHistoryEntry_Parameters): Promise<void> {
    return this._client.send<void>("Page.navigateToHistoryEntry", params);
  }
  /** Returns all browser cookies. Depending on the backend support, will return detailed cookie information in the <code>cookies</code> field. */
  getCookies(): Promise<Page.getCookies_Return> {
    return this._client.send<Page.getCookies_Return>("Page.getCookies");
  }
  /** Deletes browser cookie with given name, domain and path. */
  deleteCookie(params: Page.deleteCookie_Parameters): Promise<void> {
    return this._client.send<void>("Page.deleteCookie", params);
  }
  /** Returns present frame / resource tree structure. */
  getResourceTree(): Promise<Page.getResourceTree_Return> {
    return this._client.send<Page.getResourceTree_Return>("Page.getResourceTree");
  }
  /** Returns content of the given resource. */
  getResourceContent(params: Page.getResourceContent_Parameters): Promise<Page.getResourceContent_Return> {
    return this._client.send<Page.getResourceContent_Return>("Page.getResourceContent", params);
  }
  /** Searches for given string in resource content. */
  searchInResource(params: Page.searchInResource_Parameters): Promise<Page.searchInResource_Return> {
    return this._client.send<Page.searchInResource_Return>("Page.searchInResource", params);
  }
  /** Sets given markup as the document's HTML. */
  setDocumentContent(params: Page.setDocumentContent_Parameters): Promise<void> {
    return this._client.send<void>("Page.setDocumentContent", params);
  }
  /** Overrides the values of device screen dimensions (window.screen.width, window.screen.height, window.innerWidth, window.innerHeight, and "device-width"/"device-height"-related CSS media query results). */
  setDeviceMetricsOverride(params: Page.setDeviceMetricsOverride_Parameters): Promise<void> {
    return this._client.send<void>("Page.setDeviceMetricsOverride", params);
  }
  /** Clears the overriden device metrics. */
  clearDeviceMetricsOverride(): Promise<void> {
    return this._client.send<void>("Page.clearDeviceMetricsOverride");
  }
  /** Overrides the Geolocation Position or Error. Omitting any of the parameters emulates position unavailable. */
  setGeolocationOverride(params: Page.setGeolocationOverride_Parameters): Promise<void> {
    return this._client.send<void>("Page.setGeolocationOverride", params);
  }
  /** Clears the overriden Geolocation Position and Error. */
  clearGeolocationOverride(): Promise<void> {
    return this._client.send<void>("Page.clearGeolocationOverride");
  }
  /** Overrides the Device Orientation. */
  setDeviceOrientationOverride(params: Page.setDeviceOrientationOverride_Parameters): Promise<void> {
    return this._client.send<void>("Page.setDeviceOrientationOverride", params);
  }
  /** Clears the overridden Device Orientation. */
  clearDeviceOrientationOverride(): Promise<void> {
    return this._client.send<void>("Page.clearDeviceOrientationOverride");
  }
  /** Toggles mouse event-based touch event emulation. */
  setTouchEmulationEnabled(params: Page.setTouchEmulationEnabled_Parameters): Promise<void> {
    return this._client.send<void>("Page.setTouchEmulationEnabled", params);
  }
  /** Capture page screenshot. */
  captureScreenshot(params: Page.captureScreenshot_Parameters): Promise<Page.captureScreenshot_Return> {
    return this._client.send<Page.captureScreenshot_Return>("Page.captureScreenshot", params);
  }
  /** Print page as pdf. */
  printToPDF(): Promise<Page.printToPDF_Return> {
    return this._client.send<Page.printToPDF_Return>("Page.printToPDF");
  }
  /** Starts sending each frame using the <code>screencastFrame</code> event. */
  startScreencast(params: Page.startScreencast_Parameters): Promise<void> {
    return this._client.send<void>("Page.startScreencast", params);
  }
  /** Stops sending each frame in the <code>screencastFrame</code>. */
  stopScreencast(): Promise<void> {
    return this._client.send<void>("Page.stopScreencast");
  }
  /** Acknowledges that a screencast frame has been received by the frontend. */
  screencastFrameAck(params: Page.screencastFrameAck_Parameters): Promise<void> {
    return this._client.send<void>("Page.screencastFrameAck", params);
  }
  /** Accepts or dismisses a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload). */
  handleJavaScriptDialog(params: Page.handleJavaScriptDialog_Parameters): Promise<void> {
    return this._client.send<void>("Page.handleJavaScriptDialog", params);
  }
  /** Shows / hides color picker */
  setColorPickerEnabled(params: Page.setColorPickerEnabled_Parameters): Promise<void> {
    return this._client.send<void>("Page.setColorPickerEnabled", params);
  }
  /** Configures overlay. */
  configureOverlay(params: Page.configureOverlay_Parameters): Promise<void> {
    return this._client.send<void>("Page.configureOverlay", params);
  }
  getAppManifest(): Promise<Page.getAppManifest_Return> {
    return this._client.send<Page.getAppManifest_Return>("Page.getAppManifest");
  }
  requestAppBanner(): Promise<void> {
    return this._client.send<void>("Page.requestAppBanner");
  }
  /** Toggles navigation throttling which allows programatic control over navigation and redirect response. */
  setControlNavigations(params: Page.setControlNavigations_Parameters): Promise<void> {
    return this._client.send<void>("Page.setControlNavigations", params);
  }
  /** Should be sent in response to a navigationRequested or a redirectRequested event, telling the browser how to handle the navigation. */
  processNavigation(params: Page.processNavigation_Parameters): Promise<void> {
    return this._client.send<void>("Page.processNavigation", params);
  }
  /** Returns metrics relating to the layouting of the page, such as viewport bounds/scale. */
  getLayoutMetrics(): Promise<Page.getLayoutMetrics_Return> {
    return this._client.send<Page.getLayoutMetrics_Return>("Page.getLayoutMetrics");
  }
  get domContentEventFired(): Page.domContentEventFired_Handler {
    return this._domContentEventFired;
  }
  set domContentEventFired(handler: Page.domContentEventFired_Handler) {
    if (this._domContentEventFired) {
      this._client.removeListener("Page.domContentEventFired", this._domContentEventFired);
    }
    this._domContentEventFired = handler;
    if (handler) {
      this._client.on("Page.domContentEventFired", handler);
    }
  }
  get loadEventFired(): Page.loadEventFired_Handler {
    return this._loadEventFired;
  }
  set loadEventFired(handler: Page.loadEventFired_Handler) {
    if (this._loadEventFired) {
      this._client.removeListener("Page.loadEventFired", this._loadEventFired);
    }
    this._loadEventFired = handler;
    if (handler) {
      this._client.on("Page.loadEventFired", handler);
    }
  }
  /** Fired when frame has been attached to its parent. */
  get frameAttached(): Page.frameAttached_Handler {
    return this._frameAttached;
  }
  set frameAttached(handler: Page.frameAttached_Handler) {
    if (this._frameAttached) {
      this._client.removeListener("Page.frameAttached", this._frameAttached);
    }
    this._frameAttached = handler;
    if (handler) {
      this._client.on("Page.frameAttached", handler);
    }
  }
  /** Fired once navigation of the frame has completed. Frame is now associated with the new loader. */
  get frameNavigated(): Page.frameNavigated_Handler {
    return this._frameNavigated;
  }
  set frameNavigated(handler: Page.frameNavigated_Handler) {
    if (this._frameNavigated) {
      this._client.removeListener("Page.frameNavigated", this._frameNavigated);
    }
    this._frameNavigated = handler;
    if (handler) {
      this._client.on("Page.frameNavigated", handler);
    }
  }
  /** Fired when frame has been detached from its parent. */
  get frameDetached(): Page.frameDetached_Handler {
    return this._frameDetached;
  }
  set frameDetached(handler: Page.frameDetached_Handler) {
    if (this._frameDetached) {
      this._client.removeListener("Page.frameDetached", this._frameDetached);
    }
    this._frameDetached = handler;
    if (handler) {
      this._client.on("Page.frameDetached", handler);
    }
  }
  /** Fired when frame has started loading. */
  get frameStartedLoading(): Page.frameStartedLoading_Handler {
    return this._frameStartedLoading;
  }
  set frameStartedLoading(handler: Page.frameStartedLoading_Handler) {
    if (this._frameStartedLoading) {
      this._client.removeListener("Page.frameStartedLoading", this._frameStartedLoading);
    }
    this._frameStartedLoading = handler;
    if (handler) {
      this._client.on("Page.frameStartedLoading", handler);
    }
  }
  /** Fired when frame has stopped loading. */
  get frameStoppedLoading(): Page.frameStoppedLoading_Handler {
    return this._frameStoppedLoading;
  }
  set frameStoppedLoading(handler: Page.frameStoppedLoading_Handler) {
    if (this._frameStoppedLoading) {
      this._client.removeListener("Page.frameStoppedLoading", this._frameStoppedLoading);
    }
    this._frameStoppedLoading = handler;
    if (handler) {
      this._client.on("Page.frameStoppedLoading", handler);
    }
  }
  /** Fired when frame schedules a potential navigation. */
  get frameScheduledNavigation(): Page.frameScheduledNavigation_Handler {
    return this._frameScheduledNavigation;
  }
  set frameScheduledNavigation(handler: Page.frameScheduledNavigation_Handler) {
    if (this._frameScheduledNavigation) {
      this._client.removeListener("Page.frameScheduledNavigation", this._frameScheduledNavigation);
    }
    this._frameScheduledNavigation = handler;
    if (handler) {
      this._client.on("Page.frameScheduledNavigation", handler);
    }
  }
  /** Fired when frame no longer has a scheduled navigation. */
  get frameClearedScheduledNavigation(): Page.frameClearedScheduledNavigation_Handler {
    return this._frameClearedScheduledNavigation;
  }
  set frameClearedScheduledNavigation(handler: Page.frameClearedScheduledNavigation_Handler) {
    if (this._frameClearedScheduledNavigation) {
      this._client.removeListener("Page.frameClearedScheduledNavigation", this._frameClearedScheduledNavigation);
    }
    this._frameClearedScheduledNavigation = handler;
    if (handler) {
      this._client.on("Page.frameClearedScheduledNavigation", handler);
    }
  }
  get frameResized(): Page.frameResized_Handler {
    return this._frameResized;
  }
  set frameResized(handler: Page.frameResized_Handler) {
    if (this._frameResized) {
      this._client.removeListener("Page.frameResized", this._frameResized);
    }
    this._frameResized = handler;
    if (handler) {
      this._client.on("Page.frameResized", handler);
    }
  }
  /** Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) is about to open. */
  get javascriptDialogOpening(): Page.javascriptDialogOpening_Handler {
    return this._javascriptDialogOpening;
  }
  set javascriptDialogOpening(handler: Page.javascriptDialogOpening_Handler) {
    if (this._javascriptDialogOpening) {
      this._client.removeListener("Page.javascriptDialogOpening", this._javascriptDialogOpening);
    }
    this._javascriptDialogOpening = handler;
    if (handler) {
      this._client.on("Page.javascriptDialogOpening", handler);
    }
  }
  /** Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) has been closed. */
  get javascriptDialogClosed(): Page.javascriptDialogClosed_Handler {
    return this._javascriptDialogClosed;
  }
  set javascriptDialogClosed(handler: Page.javascriptDialogClosed_Handler) {
    if (this._javascriptDialogClosed) {
      this._client.removeListener("Page.javascriptDialogClosed", this._javascriptDialogClosed);
    }
    this._javascriptDialogClosed = handler;
    if (handler) {
      this._client.on("Page.javascriptDialogClosed", handler);
    }
  }
  /** Compressed image data requested by the <code>startScreencast</code>. */
  get screencastFrame(): Page.screencastFrame_Handler {
    return this._screencastFrame;
  }
  set screencastFrame(handler: Page.screencastFrame_Handler) {
    if (this._screencastFrame) {
      this._client.removeListener("Page.screencastFrame", this._screencastFrame);
    }
    this._screencastFrame = handler;
    if (handler) {
      this._client.on("Page.screencastFrame", handler);
    }
  }
  /** Fired when the page with currently enabled screencast was shown or hidden </code>. */
  get screencastVisibilityChanged(): Page.screencastVisibilityChanged_Handler {
    return this._screencastVisibilityChanged;
  }
  set screencastVisibilityChanged(handler: Page.screencastVisibilityChanged_Handler) {
    if (this._screencastVisibilityChanged) {
      this._client.removeListener("Page.screencastVisibilityChanged", this._screencastVisibilityChanged);
    }
    this._screencastVisibilityChanged = handler;
    if (handler) {
      this._client.on("Page.screencastVisibilityChanged", handler);
    }
  }
  /** Fired when a color has been picked. */
  get colorPicked(): Page.colorPicked_Handler {
    return this._colorPicked;
  }
  set colorPicked(handler: Page.colorPicked_Handler) {
    if (this._colorPicked) {
      this._client.removeListener("Page.colorPicked", this._colorPicked);
    }
    this._colorPicked = handler;
    if (handler) {
      this._client.on("Page.colorPicked", handler);
    }
  }
  /** Fired when interstitial page was shown */
  get interstitialShown(): Page.interstitialShown_Handler {
    return this._interstitialShown;
  }
  set interstitialShown(handler: Page.interstitialShown_Handler) {
    if (this._interstitialShown) {
      this._client.removeListener("Page.interstitialShown", this._interstitialShown);
    }
    this._interstitialShown = handler;
    if (handler) {
      this._client.on("Page.interstitialShown", handler);
    }
  }
  /** Fired when interstitial page was hidden */
  get interstitialHidden(): Page.interstitialHidden_Handler {
    return this._interstitialHidden;
  }
  set interstitialHidden(handler: Page.interstitialHidden_Handler) {
    if (this._interstitialHidden) {
      this._client.removeListener("Page.interstitialHidden", this._interstitialHidden);
    }
    this._interstitialHidden = handler;
    if (handler) {
      this._client.on("Page.interstitialHidden", handler);
    }
  }
  /** Fired when a navigation is started if navigation throttles are enabled.  The navigation will be deferred until processNavigation is called. */
  get navigationRequested(): Page.navigationRequested_Handler {
    return this._navigationRequested;
  }
  set navigationRequested(handler: Page.navigationRequested_Handler) {
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
  /** Information about the Resource on the page. */
  export interface FrameResource {
    /** Resource URL. */
    url: string;
    /** Type of this resource. */
    type: ResourceType;
    /** Resource mimeType as determined by the browser. */
    mimeType: string;
    /** last-modified timestamp as reported by server. */
    lastModified?: Network.Timestamp;
    /** Resource content size. */
    contentSize?: number;
    /** True if the resource failed to load. */
    failed?: boolean;
    /** True if the resource was canceled during loading. */
    canceled?: boolean;
  }
  /** Information about the Frame hierarchy along with their cached resources. */
  export interface FrameResourceTree {
    /** Frame information for this tree item. */
    frame: Frame;
    /** Child frames. */
    childFrames?: FrameResourceTree[];
    /** Information about frame resources. */
    resources: FrameResource[];
  }
  /** Unique script identifier. */
  export type ScriptIdentifier = string;
  /** Navigation history entry. */
  export interface NavigationEntry {
    /** Unique id of the navigation history entry. */
    id: number;
    /** URL of the navigation history entry. */
    url: string;
    /** Title of the navigation history entry. */
    title: string;
  }
  /** Screencast frame metadata. */
  export interface ScreencastFrameMetadata {
    /** Top offset in DIP. */
    offsetTop: number;
    /** Page scale factor. */
    pageScaleFactor: number;
    /** Device screen width in DIP. */
    deviceWidth: number;
    /** Device screen height in DIP. */
    deviceHeight: number;
    /** Position of horizontal scroll in CSS pixels. */
    scrollOffsetX: number;
    /** Position of vertical scroll in CSS pixels. */
    scrollOffsetY: number;
    /** Frame swap timestamp. */
    timestamp?: number;
  }
  /** Javascript dialog type. */
  export type DialogType = "alert" | "confirm" | "prompt" | "beforeunload";
  /** Error while paring app manifest. */
  export interface AppManifestError {
    /** Error message. */
    message: string;
    /** If criticial, this is a non-recoverable parse error. */
    critical: number;
    /** Error line. */
    line: number;
    /** Error column. */
    column: number;
  }
  /** Proceed: allow the navigation; Cancel: cancel the navigation; CancelAndIgnore: cancels the navigation and makes the requester of the navigation acts like the request was never made. */
  export type NavigationResponse = "Proceed" | "Cancel" | "CancelAndIgnore";
  /** Layout viewport position and dimensions. */
  export interface LayoutViewport {
    /** Horizontal offset relative to the document (CSS pixels). */
    pageX: number;
    /** Vertical offset relative to the document (CSS pixels). */
    pageY: number;
    /** Width (CSS pixels), excludes scrollbar if present. */
    clientWidth: number;
    /** Height (CSS pixels), excludes scrollbar if present. */
    clientHeight: number;
  }
  /** Visual viewport position, dimensions, and scale. */
  export interface VisualViewport {
    /** Horizontal offset relative to the layout viewport (CSS pixels). */
    offsetX: number;
    /** Vertical offset relative to the layout viewport (CSS pixels). */
    offsetY: number;
    /** Horizontal offset relative to the document (CSS pixels). */
    pageX: number;
    /** Vertical offset relative to the document (CSS pixels). */
    pageY: number;
    /** Width (CSS pixels), excludes scrollbar if present. */
    clientWidth: number;
    /** Height (CSS pixels), excludes scrollbar if present. */
    clientHeight: number;
    /** Scale relative to the ideal viewport (size at width=device-width). */
    scale: number;
  }
  export type domContentEventFired_Parameters = {
    timestamp: number;
  };
  export type domContentEventFired_Handler = (params: domContentEventFired_Parameters) => void;
  export type loadEventFired_Parameters = {
    timestamp: number;
  };
  export type loadEventFired_Handler = (params: loadEventFired_Parameters) => void;
  export type frameAttached_Parameters = {
    /** Id of the frame that has been attached. */
    frameId: FrameId;
    /** Parent frame identifier. */
    parentFrameId: FrameId;
    /** JavaScript stack trace of when frame was attached, only set if frame initiated from script. */
    stack?: Runtime.StackTrace;
  };
  export type frameAttached_Handler = (params: frameAttached_Parameters) => void;
  export type frameNavigated_Parameters = {
    /** Frame object. */
    frame: Frame;
  };
  export type frameNavigated_Handler = (params: frameNavigated_Parameters) => void;
  export type frameDetached_Parameters = {
    /** Id of the frame that has been detached. */
    frameId: FrameId;
  };
  export type frameDetached_Handler = (params: frameDetached_Parameters) => void;
  export type frameStartedLoading_Parameters = {
    /** Id of the frame that has started loading. */
    frameId: FrameId;
  };
  export type frameStartedLoading_Handler = (params: frameStartedLoading_Parameters) => void;
  export type frameStoppedLoading_Parameters = {
    /** Id of the frame that has stopped loading. */
    frameId: FrameId;
  };
  export type frameStoppedLoading_Handler = (params: frameStoppedLoading_Parameters) => void;
  export type frameScheduledNavigation_Parameters = {
    /** Id of the frame that has scheduled a navigation. */
    frameId: FrameId;
    /** Delay (in seconds) until the navigation is scheduled to begin. The navigation is not guaranteed to start. */
    delay: number;
  };
  export type frameScheduledNavigation_Handler = (params: frameScheduledNavigation_Parameters) => void;
  export type frameClearedScheduledNavigation_Parameters = {
    /** Id of the frame that has cleared its scheduled navigation. */
    frameId: FrameId;
  };
  export type frameClearedScheduledNavigation_Handler = (params: frameClearedScheduledNavigation_Parameters) => void;
  export type frameResized_Handler = () => void;
  export type javascriptDialogOpening_Parameters = {
    /** Message that will be displayed by the dialog. */
    message: string;
    /** Dialog type. */
    type: DialogType;
  };
  export type javascriptDialogOpening_Handler = (params: javascriptDialogOpening_Parameters) => void;
  export type javascriptDialogClosed_Parameters = {
    /** Whether dialog was confirmed. */
    result: boolean;
  };
  export type javascriptDialogClosed_Handler = (params: javascriptDialogClosed_Parameters) => void;
  export type screencastFrame_Parameters = {
    /** Base64-encoded compressed image. */
    data: string;
    /** Screencast frame metadata. */
    metadata: ScreencastFrameMetadata;
    /** Frame number. */
    sessionId: number;
  };
  export type screencastFrame_Handler = (params: screencastFrame_Parameters) => void;
  export type screencastVisibilityChanged_Parameters = {
    /** True if the page is visible. */
    visible: boolean;
  };
  export type screencastVisibilityChanged_Handler = (params: screencastVisibilityChanged_Parameters) => void;
  export type colorPicked_Parameters = {
    /** RGBA of the picked color. */
    color: DOM.RGBA;
  };
  export type colorPicked_Handler = (params: colorPicked_Parameters) => void;
  export type interstitialShown_Handler = () => void;
  export type interstitialHidden_Handler = () => void;
  export type navigationRequested_Parameters = {
    /** Whether the navigation is taking place in the main frame or in a subframe. */
    isInMainFrame: boolean;
    /** Whether the navigation has encountered a server redirect or not. */
    isRedirect: boolean;
    navigationId: number;
    /** URL of requested navigation. */
    url: string;
  };
  export type navigationRequested_Handler = (params: navigationRequested_Parameters) => void;
  export type addScriptToEvaluateOnLoad_Parameters = {
    scriptSource: string;
  };
  export type addScriptToEvaluateOnLoad_Return = {
    /** Identifier of the added script. */
    identifier: ScriptIdentifier;
  };
  export type removeScriptToEvaluateOnLoad_Parameters = {
    identifier: ScriptIdentifier;
  };
  export type setAutoAttachToCreatedPages_Parameters = {
    /** If true, browser will open a new inspector window for every page created from this one. */
    autoAttach: boolean;
  };
  export type reload_Parameters = {
    /** If true, browser cache is ignored (as if the user pressed Shift+refresh). */
    ignoreCache?: boolean;
    /** If set, the script will be injected into all frames of the inspected page after reload. */
    scriptToEvaluateOnLoad?: string;
  };
  export type navigate_Parameters = {
    /** URL to navigate the page to. */
    url: string;
    /** Referrer URL. */
    referrer?: string;
  };
  export type navigate_Return = {
    /** Frame id that will be navigated. */
    frameId: FrameId;
  };
  export type getNavigationHistory_Return = {
    /** Index of the current navigation history entry. */
    currentIndex: number;
    /** Array of navigation history entries. */
    entries: NavigationEntry[];
  };
  export type navigateToHistoryEntry_Parameters = {
    /** Unique id of the entry to navigate to. */
    entryId: number;
  };
  export type getCookies_Return = {
    /** Array of cookie objects. */
    cookies: Network.Cookie[];
  };
  export type deleteCookie_Parameters = {
    /** Name of the cookie to remove. */
    cookieName: string;
    /** URL to match cooke domain and path. */
    url: string;
  };
  export type getResourceTree_Return = {
    /** Present frame / resource tree structure. */
    frameTree: FrameResourceTree;
  };
  export type getResourceContent_Parameters = {
    /** Frame id to get resource for. */
    frameId: FrameId;
    /** URL of the resource to get content for. */
    url: string;
  };
  export type getResourceContent_Return = {
    /** Resource content. */
    content: string;
    /** True, if content was served as base64. */
    base64Encoded: boolean;
  };
  export type searchInResource_Parameters = {
    /** Frame id for resource to search in. */
    frameId: FrameId;
    /** URL of the resource to search in. */
    url: string;
    /** String to search for. */
    query: string;
    /** If true, search is case sensitive. */
    caseSensitive?: boolean;
    /** If true, treats string parameter as regex. */
    isRegex?: boolean;
  };
  export type searchInResource_Return = {
    /** List of search matches. */
    result: Debugger.SearchMatch[];
  };
  export type setDocumentContent_Parameters = {
    /** Frame id to set HTML for. */
    frameId: FrameId;
    /** HTML content to set. */
    html: string;
  };
  export type setDeviceMetricsOverride_Parameters = {
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
    /** X offset to shift resulting view image by. Ignored in |fitWindow| mode. */
    offsetX?: number;
    /** Y offset to shift resulting view image by. Ignored in |fitWindow| mode. */
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
    screenOrientation?: Emulation.ScreenOrientation;
  };
  export type setGeolocationOverride_Parameters = {
    /** Mock latitude */
    latitude?: number;
    /** Mock longitude */
    longitude?: number;
    /** Mock accuracy */
    accuracy?: number;
  };
  export type setDeviceOrientationOverride_Parameters = {
    /** Mock alpha */
    alpha: number;
    /** Mock beta */
    beta: number;
    /** Mock gamma */
    gamma: number;
  };
  export type setTouchEmulationEnabled_Parameters = {
    /** Whether the touch event emulation should be enabled. */
    enabled: boolean;
    /** Touch/gesture events configuration. Default: current platform. */
    configuration?: "mobile" | "desktop";
  };
  export type captureScreenshot_Parameters = {
    /** Image compression format (defaults to png). */
    format?: "jpeg" | "png";
    /** Compression quality from range [0..100] (jpeg only). */
    quality?: number;
    /** Capture the screenshot from the surface, rather than the view. Defaults to false. */
    fromSurface?: boolean;
  };
  export type captureScreenshot_Return = {
    /** Base64-encoded image data. */
    data: string;
  };
  export type printToPDF_Return = {
    /** Base64-encoded pdf data. */
    data: string;
  };
  export type startScreencast_Parameters = {
    /** Image compression format. */
    format?: "jpeg" | "png";
    /** Compression quality from range [0..100]. */
    quality?: number;
    /** Maximum screenshot width. */
    maxWidth?: number;
    /** Maximum screenshot height. */
    maxHeight?: number;
    /** Send every n-th frame. */
    everyNthFrame?: number;
  };
  export type screencastFrameAck_Parameters = {
    /** Frame number. */
    sessionId: number;
  };
  export type handleJavaScriptDialog_Parameters = {
    /** Whether to accept or dismiss the dialog. */
    accept: boolean;
    /** The text to enter into the dialog prompt before accepting. Used only if this is a prompt dialog. */
    promptText?: string;
  };
  export type setColorPickerEnabled_Parameters = {
    /** Shows / hides color picker */
    enabled: boolean;
  };
  export type configureOverlay_Parameters = {
    /** Whether overlay should be suspended and not consume any resources. */
    suspended?: boolean;
    /** Overlay message to display. */
    message?: string;
  };
  export type getAppManifest_Return = {
    /** Manifest location. */
    url: string;
    errors: AppManifestError[];
    /** Manifest content. */
    data?: string;
  };
  export type setControlNavigations_Parameters = {
    enabled: boolean;
  };
  export type processNavigation_Parameters = {
    response: NavigationResponse;
    navigationId: number;
  };
  export type getLayoutMetrics_Return = {
    /** Metrics relating to the layout viewport. */
    layoutViewport: LayoutViewport;
    /** Metrics relating to the visual viewport. */
    visualViewport: VisualViewport;
    /** Size of scrollable area. */
    contentSize: DOM.Rect;
  };
}
/** This domain allows to control rendering of the page. */
export class Rendering {
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Requests that backend shows paint rectangles */
  setShowPaintRects(params: Rendering.setShowPaintRects_Parameters): Promise<void> {
    return this._client.send<void>("Rendering.setShowPaintRects", params);
  }
  /** Requests that backend shows debug borders on layers */
  setShowDebugBorders(params: Rendering.setShowDebugBorders_Parameters): Promise<void> {
    return this._client.send<void>("Rendering.setShowDebugBorders", params);
  }
  /** Requests that backend shows the FPS counter */
  setShowFPSCounter(params: Rendering.setShowFPSCounter_Parameters): Promise<void> {
    return this._client.send<void>("Rendering.setShowFPSCounter", params);
  }
  /** Requests that backend shows scroll bottleneck rects */
  setShowScrollBottleneckRects(params: Rendering.setShowScrollBottleneckRects_Parameters): Promise<void> {
    return this._client.send<void>("Rendering.setShowScrollBottleneckRects", params);
  }
  /** Paints viewport size upon main frame resize. */
  setShowViewportSizeOnResize(params: Rendering.setShowViewportSizeOnResize_Parameters): Promise<void> {
    return this._client.send<void>("Rendering.setShowViewportSizeOnResize", params);
  }
}
export namespace Rendering {
  export type setShowPaintRects_Parameters = {
    /** True for showing paint rectangles */
    result: boolean;
  };
  export type setShowDebugBorders_Parameters = {
    /** True for showing debug borders */
    show: boolean;
  };
  export type setShowFPSCounter_Parameters = {
    /** True for showing the FPS counter */
    show: boolean;
  };
  export type setShowScrollBottleneckRects_Parameters = {
    /** True for showing scroll bottleneck rects */
    show: boolean;
  };
  export type setShowViewportSizeOnResize_Parameters = {
    /** Whether to paint size or not. */
    show: boolean;
  };
}
/** This domain emulates different environments for the page. */
export class Emulation {
  private _virtualTimeBudgetExpired: Emulation.virtualTimeBudgetExpired_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Overrides the values of device screen dimensions (window.screen.width, window.screen.height, window.innerWidth, window.innerHeight, and "device-width"/"device-height"-related CSS media query results). */
  setDeviceMetricsOverride(params: Emulation.setDeviceMetricsOverride_Parameters): Promise<void> {
    return this._client.send<void>("Emulation.setDeviceMetricsOverride", params);
  }
  /** Clears the overriden device metrics. */
  clearDeviceMetricsOverride(): Promise<void> {
    return this._client.send<void>("Emulation.clearDeviceMetricsOverride");
  }
  /** Overrides the visible area of the page. The change is hidden from the page, i.e. the observable scroll position and page scale does not change. In effect, the command moves the specified area of the page into the top-left corner of the frame. */
  forceViewport(params: Emulation.forceViewport_Parameters): Promise<void> {
    return this._client.send<void>("Emulation.forceViewport", params);
  }
  /** Resets the visible area of the page to the original viewport, undoing any effects of the <code>forceViewport</code> command. */
  resetViewport(): Promise<void> {
    return this._client.send<void>("Emulation.resetViewport");
  }
  /** Requests that page scale factor is reset to initial values. */
  resetPageScaleFactor(): Promise<void> {
    return this._client.send<void>("Emulation.resetPageScaleFactor");
  }
  /** Sets a specified page scale factor. */
  setPageScaleFactor(params: Emulation.setPageScaleFactor_Parameters): Promise<void> {
    return this._client.send<void>("Emulation.setPageScaleFactor", params);
  }
  /** Resizes the frame/viewport of the page. Note that this does not affect the frame's container (e.g. browser window). Can be used to produce screenshots of the specified size. Not supported on Android. */
  setVisibleSize(params: Emulation.setVisibleSize_Parameters): Promise<void> {
    return this._client.send<void>("Emulation.setVisibleSize", params);
  }
  /** Switches script execution in the page. */
  setScriptExecutionDisabled(params: Emulation.setScriptExecutionDisabled_Parameters): Promise<void> {
    return this._client.send<void>("Emulation.setScriptExecutionDisabled", params);
  }
  /** Overrides the Geolocation Position or Error. Omitting any of the parameters emulates position unavailable. */
  setGeolocationOverride(params: Emulation.setGeolocationOverride_Parameters): Promise<void> {
    return this._client.send<void>("Emulation.setGeolocationOverride", params);
  }
  /** Clears the overriden Geolocation Position and Error. */
  clearGeolocationOverride(): Promise<void> {
    return this._client.send<void>("Emulation.clearGeolocationOverride");
  }
  /** Toggles mouse event-based touch event emulation. */
  setTouchEmulationEnabled(params: Emulation.setTouchEmulationEnabled_Parameters): Promise<void> {
    return this._client.send<void>("Emulation.setTouchEmulationEnabled", params);
  }
  /** Emulates the given media for CSS media queries. */
  setEmulatedMedia(params: Emulation.setEmulatedMedia_Parameters): Promise<void> {
    return this._client.send<void>("Emulation.setEmulatedMedia", params);
  }
  /** Enables CPU throttling to emulate slow CPUs. */
  setCPUThrottlingRate(params: Emulation.setCPUThrottlingRate_Parameters): Promise<void> {
    return this._client.send<void>("Emulation.setCPUThrottlingRate", params);
  }
  /** Tells whether emulation is supported. */
  canEmulate(): Promise<Emulation.canEmulate_Return> {
    return this._client.send<Emulation.canEmulate_Return>("Emulation.canEmulate");
  }
  /** Turns on virtual time for all frames (replacing real-time with a synthetic time source) and sets the current virtual time policy.  Note this supersedes any previous time budget. */
  setVirtualTimePolicy(params: Emulation.setVirtualTimePolicy_Parameters): Promise<void> {
    return this._client.send<void>("Emulation.setVirtualTimePolicy", params);
  }
  /** Sets or clears an override of the default background color of the frame. This override is used if the content does not specify one. */
  setDefaultBackgroundColorOverride(params: Emulation.setDefaultBackgroundColorOverride_Parameters): Promise<void> {
    return this._client.send<void>("Emulation.setDefaultBackgroundColorOverride", params);
  }
  /** Notification sent after the virual time budget for the current VirtualTimePolicy has run out. */
  get virtualTimeBudgetExpired(): Emulation.virtualTimeBudgetExpired_Handler {
    return this._virtualTimeBudgetExpired;
  }
  set virtualTimeBudgetExpired(handler: Emulation.virtualTimeBudgetExpired_Handler) {
    if (this._virtualTimeBudgetExpired) {
      this._client.removeListener("Emulation.virtualTimeBudgetExpired", this._virtualTimeBudgetExpired);
    }
    this._virtualTimeBudgetExpired = handler;
    if (handler) {
      this._client.on("Emulation.virtualTimeBudgetExpired", handler);
    }
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
  /** advance: If the scheduler runs out of immediate work, the virtual time base may fast forward to allow the next delayed task (if any) to run; pause: The virtual time base may not advance; pauseIfNetworkFetchesPending: The virtual time base may not advance if there are any pending resource fetches. */
  export type VirtualTimePolicy = "advance" | "pause" | "pauseIfNetworkFetchesPending";
  export type virtualTimeBudgetExpired_Handler = () => void;
  export type setDeviceMetricsOverride_Parameters = {
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
  export type forceViewport_Parameters = {
    /** X coordinate of top-left corner of the area (CSS pixels). */
    x: number;
    /** Y coordinate of top-left corner of the area (CSS pixels). */
    y: number;
    /** Scale to apply to the area (relative to a page scale of 1.0). */
    scale: number;
  };
  export type setPageScaleFactor_Parameters = {
    /** Page scale factor. */
    pageScaleFactor: number;
  };
  export type setVisibleSize_Parameters = {
    /** Frame width (DIP). */
    width: number;
    /** Frame height (DIP). */
    height: number;
  };
  export type setScriptExecutionDisabled_Parameters = {
    /** Whether script execution should be disabled in the page. */
    value: boolean;
  };
  export type setGeolocationOverride_Parameters = {
    /** Mock latitude */
    latitude?: number;
    /** Mock longitude */
    longitude?: number;
    /** Mock accuracy */
    accuracy?: number;
  };
  export type setTouchEmulationEnabled_Parameters = {
    /** Whether the touch event emulation should be enabled. */
    enabled: boolean;
    /** Touch/gesture events configuration. Default: current platform. */
    configuration?: "mobile" | "desktop";
  };
  export type setEmulatedMedia_Parameters = {
    /** Media type to emulate. Empty string disables the override. */
    media: string;
  };
  export type setCPUThrottlingRate_Parameters = {
    /** Throttling rate as a slowdown factor (1 is no throttle, 2 is 2x slowdown, etc). */
    rate: number;
  };
  export type canEmulate_Return = {
    /** True if emulation is supported. */
    result: boolean;
  };
  export type setVirtualTimePolicy_Parameters = {
    policy: VirtualTimePolicy;
    /** If set, after this many virtual milliseconds have elapsed virtual time will be paused and a virtualTimeBudgetExpired event is sent. */
    budget?: number;
  };
  export type setDefaultBackgroundColorOverride_Parameters = {
    /** RGBA of the default background color. If not specified, any existing override will be cleared. */
    color?: DOM.RGBA;
  };
}
/** Security */
export class Security {
  private _securityStateChanged: Security.securityStateChanged_Handler = undefined;
  private _certificateError: Security.certificateError_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables tracking security state changes. */
  enable(): Promise<void> {
    return this._client.send<void>("Security.enable");
  }
  /** Disables tracking security state changes. */
  disable(): Promise<void> {
    return this._client.send<void>("Security.disable");
  }
  /** Displays native dialog with the certificate details. */
  showCertificateViewer(): Promise<void> {
    return this._client.send<void>("Security.showCertificateViewer");
  }
  /** Handles a certificate error that fired a certificateError event. */
  handleCertificateError(params: Security.handleCertificateError_Parameters): Promise<void> {
    return this._client.send<void>("Security.handleCertificateError", params);
  }
  /** Enable/disable overriding certificate errors. If enabled, all certificate error events need to be handled by the DevTools client and should be answered with handleCertificateError commands. */
  setOverrideCertificateErrors(params: Security.setOverrideCertificateErrors_Parameters): Promise<void> {
    return this._client.send<void>("Security.setOverrideCertificateErrors", params);
  }
  /** The security state of the page changed. */
  get securityStateChanged(): Security.securityStateChanged_Handler {
    return this._securityStateChanged;
  }
  set securityStateChanged(handler: Security.securityStateChanged_Handler) {
    if (this._securityStateChanged) {
      this._client.removeListener("Security.securityStateChanged", this._securityStateChanged);
    }
    this._securityStateChanged = handler;
    if (handler) {
      this._client.on("Security.securityStateChanged", handler);
    }
  }
  /** There is a certificate error. If overriding certificate errors is enabled, then it should be handled with the handleCertificateError command. Note: this event does not fire if the certificate error has been allowed internally. */
  get certificateError(): Security.certificateError_Handler {
    return this._certificateError;
  }
  set certificateError(handler: Security.certificateError_Handler) {
    if (this._certificateError) {
      this._client.removeListener("Security.certificateError", this._certificateError);
    }
    this._certificateError = handler;
    if (handler) {
      this._client.on("Security.certificateError", handler);
    }
  }
}
export namespace Security {
  /** An internal certificate ID value. */
  export type CertificateId = number;
  /** The security level of a page or resource. */
  export type SecurityState = "unknown" | "neutral" | "insecure" | "warning" | "secure" | "info";
  /** An explanation of an factor contributing to the security state. */
  export interface SecurityStateExplanation {
    /** Security state representing the severity of the factor being explained. */
    securityState: SecurityState;
    /** Short phrase describing the type of factor. */
    summary: string;
    /** Full text explanation of the factor. */
    description: string;
    /** True if the page has a certificate. */
    hasCertificate: boolean;
  }
  /** Information about insecure content on the page. */
  export interface InsecureContentStatus {
    /** True if the page was loaded over HTTPS and ran mixed (HTTP) content such as scripts. */
    ranMixedContent: boolean;
    /** True if the page was loaded over HTTPS and displayed mixed (HTTP) content such as images. */
    displayedMixedContent: boolean;
    /** True if the page was loaded over HTTPS and contained a form targeting an insecure url. */
    containedMixedForm: boolean;
    /** True if the page was loaded over HTTPS without certificate errors, and ran content such as scripts that were loaded with certificate errors. */
    ranContentWithCertErrors: boolean;
    /** True if the page was loaded over HTTPS without certificate errors, and displayed content such as images that were loaded with certificate errors. */
    displayedContentWithCertErrors: boolean;
    /** Security state representing a page that ran insecure content. */
    ranInsecureContentStyle: SecurityState;
    /** Security state representing a page that displayed insecure content. */
    displayedInsecureContentStyle: SecurityState;
  }
  /** The action to take when a certificate error occurs. continue will continue processing the request and cancel will cancel the request. */
  export type CertificateErrorAction = "continue" | "cancel";
  export type securityStateChanged_Parameters = {
    /** Security state. */
    securityState: SecurityState;
    /** True if the page was loaded over cryptographic transport such as HTTPS. */
    schemeIsCryptographic: boolean;
    /** List of explanations for the security state. If the overall security state is `insecure` or `warning`, at least one corresponding explanation should be included. */
    explanations: SecurityStateExplanation[];
    /** Information about insecure content on the page. */
    insecureContentStatus: InsecureContentStatus;
    /** Overrides user-visible description of the state. */
    summary?: string;
  };
  export type securityStateChanged_Handler = (params: securityStateChanged_Parameters) => void;
  export type certificateError_Parameters = {
    /** The ID of the event. */
    eventId: number;
    /** The type of the error. */
    errorType: string;
    /** The url that was requested. */
    requestURL: string;
  };
  export type certificateError_Handler = (params: certificateError_Parameters) => void;
  export type handleCertificateError_Parameters = {
    /** The ID of the event. */
    eventId: number;
    /** The action to take on the certificate error. */
    action: CertificateErrorAction;
  };
  export type setOverrideCertificateErrors_Parameters = {
    /** If true, certificate errors will be overridden. */
    override: boolean;
  };
}
/** Network domain allows tracking network activities of the page. It exposes information about http, file, data and other requests and responses, their headers, bodies, timing, etc. */
export class Network {
  private _resourceChangedPriority: Network.resourceChangedPriority_Handler = undefined;
  private _requestWillBeSent: Network.requestWillBeSent_Handler = undefined;
  private _requestServedFromCache: Network.requestServedFromCache_Handler = undefined;
  private _responseReceived: Network.responseReceived_Handler = undefined;
  private _dataReceived: Network.dataReceived_Handler = undefined;
  private _loadingFinished: Network.loadingFinished_Handler = undefined;
  private _loadingFailed: Network.loadingFailed_Handler = undefined;
  private _webSocketWillSendHandshakeRequest: Network.webSocketWillSendHandshakeRequest_Handler = undefined;
  private _webSocketHandshakeResponseReceived: Network.webSocketHandshakeResponseReceived_Handler = undefined;
  private _webSocketCreated: Network.webSocketCreated_Handler = undefined;
  private _webSocketClosed: Network.webSocketClosed_Handler = undefined;
  private _webSocketFrameReceived: Network.webSocketFrameReceived_Handler = undefined;
  private _webSocketFrameError: Network.webSocketFrameError_Handler = undefined;
  private _webSocketFrameSent: Network.webSocketFrameSent_Handler = undefined;
  private _eventSourceMessageReceived: Network.eventSourceMessageReceived_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables network tracking, network events will now be delivered to the client. */
  enable(params: Network.enable_Parameters): Promise<void> {
    return this._client.send<void>("Network.enable", params);
  }
  /** Disables network tracking, prevents network events from being sent to the client. */
  disable(): Promise<void> {
    return this._client.send<void>("Network.disable");
  }
  /** Allows overriding user agent with the given string. */
  setUserAgentOverride(params: Network.setUserAgentOverride_Parameters): Promise<void> {
    return this._client.send<void>("Network.setUserAgentOverride", params);
  }
  /** Specifies whether to always send extra HTTP headers with the requests from this page. */
  setExtraHTTPHeaders(params: Network.setExtraHTTPHeaders_Parameters): Promise<void> {
    return this._client.send<void>("Network.setExtraHTTPHeaders", params);
  }
  /** Returns content served for the given request. */
  getResponseBody(params: Network.getResponseBody_Parameters): Promise<Network.getResponseBody_Return> {
    return this._client.send<Network.getResponseBody_Return>("Network.getResponseBody", params);
  }
  /** Blocks URLs from loading. */
  setBlockedURLs(params: Network.setBlockedURLs_Parameters): Promise<void> {
    return this._client.send<void>("Network.setBlockedURLs", params);
  }
  /** This method sends a new XMLHttpRequest which is identical to the original one. The following parameters should be identical: method, url, async, request body, extra headers, withCredentials attribute, user, password. */
  replayXHR(params: Network.replayXHR_Parameters): Promise<void> {
    return this._client.send<void>("Network.replayXHR", params);
  }
  /** Toggles monitoring of XMLHttpRequest. If <code>true</code>, console will receive messages upon each XHR issued. */
  setMonitoringXHREnabled(params: Network.setMonitoringXHREnabled_Parameters): Promise<void> {
    return this._client.send<void>("Network.setMonitoringXHREnabled", params);
  }
  /** Tells whether clearing browser cache is supported. */
  canClearBrowserCache(): Promise<Network.canClearBrowserCache_Return> {
    return this._client.send<Network.canClearBrowserCache_Return>("Network.canClearBrowserCache");
  }
  /** Clears browser cache. */
  clearBrowserCache(): Promise<void> {
    return this._client.send<void>("Network.clearBrowserCache");
  }
  /** Tells whether clearing browser cookies is supported. */
  canClearBrowserCookies(): Promise<Network.canClearBrowserCookies_Return> {
    return this._client.send<Network.canClearBrowserCookies_Return>("Network.canClearBrowserCookies");
  }
  /** Clears browser cookies. */
  clearBrowserCookies(): Promise<void> {
    return this._client.send<void>("Network.clearBrowserCookies");
  }
  /** Returns all browser cookies for the current URL. Depending on the backend support, will return detailed cookie information in the <code>cookies</code> field. */
  getCookies(params: Network.getCookies_Parameters): Promise<Network.getCookies_Return> {
    return this._client.send<Network.getCookies_Return>("Network.getCookies", params);
  }
  /** Returns all browser cookies. Depending on the backend support, will return detailed cookie information in the <code>cookies</code> field. */
  getAllCookies(): Promise<Network.getAllCookies_Return> {
    return this._client.send<Network.getAllCookies_Return>("Network.getAllCookies");
  }
  /** Deletes browser cookie with given name, domain and path. */
  deleteCookie(params: Network.deleteCookie_Parameters): Promise<void> {
    return this._client.send<void>("Network.deleteCookie", params);
  }
  /** Sets a cookie with the given cookie data; may overwrite equivalent cookies if they exist. */
  setCookie(params: Network.setCookie_Parameters): Promise<Network.setCookie_Return> {
    return this._client.send<Network.setCookie_Return>("Network.setCookie", params);
  }
  /** Tells whether emulation of network conditions is supported. */
  canEmulateNetworkConditions(): Promise<Network.canEmulateNetworkConditions_Return> {
    return this._client.send<Network.canEmulateNetworkConditions_Return>("Network.canEmulateNetworkConditions");
  }
  /** Activates emulation of network conditions. */
  emulateNetworkConditions(params: Network.emulateNetworkConditions_Parameters): Promise<void> {
    return this._client.send<void>("Network.emulateNetworkConditions", params);
  }
  /** Toggles ignoring cache for each request. If <code>true</code>, cache will not be used. */
  setCacheDisabled(params: Network.setCacheDisabled_Parameters): Promise<void> {
    return this._client.send<void>("Network.setCacheDisabled", params);
  }
  /** Toggles ignoring of service worker for each request. */
  setBypassServiceWorker(params: Network.setBypassServiceWorker_Parameters): Promise<void> {
    return this._client.send<void>("Network.setBypassServiceWorker", params);
  }
  /** For testing. */
  setDataSizeLimitsForTest(params: Network.setDataSizeLimitsForTest_Parameters): Promise<void> {
    return this._client.send<void>("Network.setDataSizeLimitsForTest", params);
  }
  /** Returns the DER-encoded certificate. */
  getCertificate(params: Network.getCertificate_Parameters): Promise<Network.getCertificate_Return> {
    return this._client.send<Network.getCertificate_Return>("Network.getCertificate", params);
  }
  /** Fired when resource loading priority is changed */
  get resourceChangedPriority(): Network.resourceChangedPriority_Handler {
    return this._resourceChangedPriority;
  }
  set resourceChangedPriority(handler: Network.resourceChangedPriority_Handler) {
    if (this._resourceChangedPriority) {
      this._client.removeListener("Network.resourceChangedPriority", this._resourceChangedPriority);
    }
    this._resourceChangedPriority = handler;
    if (handler) {
      this._client.on("Network.resourceChangedPriority", handler);
    }
  }
  /** Fired when page is about to send HTTP request. */
  get requestWillBeSent(): Network.requestWillBeSent_Handler {
    return this._requestWillBeSent;
  }
  set requestWillBeSent(handler: Network.requestWillBeSent_Handler) {
    if (this._requestWillBeSent) {
      this._client.removeListener("Network.requestWillBeSent", this._requestWillBeSent);
    }
    this._requestWillBeSent = handler;
    if (handler) {
      this._client.on("Network.requestWillBeSent", handler);
    }
  }
  /** Fired if request ended up loading from cache. */
  get requestServedFromCache(): Network.requestServedFromCache_Handler {
    return this._requestServedFromCache;
  }
  set requestServedFromCache(handler: Network.requestServedFromCache_Handler) {
    if (this._requestServedFromCache) {
      this._client.removeListener("Network.requestServedFromCache", this._requestServedFromCache);
    }
    this._requestServedFromCache = handler;
    if (handler) {
      this._client.on("Network.requestServedFromCache", handler);
    }
  }
  /** Fired when HTTP response is available. */
  get responseReceived(): Network.responseReceived_Handler {
    return this._responseReceived;
  }
  set responseReceived(handler: Network.responseReceived_Handler) {
    if (this._responseReceived) {
      this._client.removeListener("Network.responseReceived", this._responseReceived);
    }
    this._responseReceived = handler;
    if (handler) {
      this._client.on("Network.responseReceived", handler);
    }
  }
  /** Fired when data chunk was received over the network. */
  get dataReceived(): Network.dataReceived_Handler {
    return this._dataReceived;
  }
  set dataReceived(handler: Network.dataReceived_Handler) {
    if (this._dataReceived) {
      this._client.removeListener("Network.dataReceived", this._dataReceived);
    }
    this._dataReceived = handler;
    if (handler) {
      this._client.on("Network.dataReceived", handler);
    }
  }
  /** Fired when HTTP request has finished loading. */
  get loadingFinished(): Network.loadingFinished_Handler {
    return this._loadingFinished;
  }
  set loadingFinished(handler: Network.loadingFinished_Handler) {
    if (this._loadingFinished) {
      this._client.removeListener("Network.loadingFinished", this._loadingFinished);
    }
    this._loadingFinished = handler;
    if (handler) {
      this._client.on("Network.loadingFinished", handler);
    }
  }
  /** Fired when HTTP request has failed to load. */
  get loadingFailed(): Network.loadingFailed_Handler {
    return this._loadingFailed;
  }
  set loadingFailed(handler: Network.loadingFailed_Handler) {
    if (this._loadingFailed) {
      this._client.removeListener("Network.loadingFailed", this._loadingFailed);
    }
    this._loadingFailed = handler;
    if (handler) {
      this._client.on("Network.loadingFailed", handler);
    }
  }
  /** Fired when WebSocket is about to initiate handshake. */
  get webSocketWillSendHandshakeRequest(): Network.webSocketWillSendHandshakeRequest_Handler {
    return this._webSocketWillSendHandshakeRequest;
  }
  set webSocketWillSendHandshakeRequest(handler: Network.webSocketWillSendHandshakeRequest_Handler) {
    if (this._webSocketWillSendHandshakeRequest) {
      this._client.removeListener("Network.webSocketWillSendHandshakeRequest", this._webSocketWillSendHandshakeRequest);
    }
    this._webSocketWillSendHandshakeRequest = handler;
    if (handler) {
      this._client.on("Network.webSocketWillSendHandshakeRequest", handler);
    }
  }
  /** Fired when WebSocket handshake response becomes available. */
  get webSocketHandshakeResponseReceived(): Network.webSocketHandshakeResponseReceived_Handler {
    return this._webSocketHandshakeResponseReceived;
  }
  set webSocketHandshakeResponseReceived(handler: Network.webSocketHandshakeResponseReceived_Handler) {
    if (this._webSocketHandshakeResponseReceived) {
      this._client.removeListener("Network.webSocketHandshakeResponseReceived", this._webSocketHandshakeResponseReceived);
    }
    this._webSocketHandshakeResponseReceived = handler;
    if (handler) {
      this._client.on("Network.webSocketHandshakeResponseReceived", handler);
    }
  }
  /** Fired upon WebSocket creation. */
  get webSocketCreated(): Network.webSocketCreated_Handler {
    return this._webSocketCreated;
  }
  set webSocketCreated(handler: Network.webSocketCreated_Handler) {
    if (this._webSocketCreated) {
      this._client.removeListener("Network.webSocketCreated", this._webSocketCreated);
    }
    this._webSocketCreated = handler;
    if (handler) {
      this._client.on("Network.webSocketCreated", handler);
    }
  }
  /** Fired when WebSocket is closed. */
  get webSocketClosed(): Network.webSocketClosed_Handler {
    return this._webSocketClosed;
  }
  set webSocketClosed(handler: Network.webSocketClosed_Handler) {
    if (this._webSocketClosed) {
      this._client.removeListener("Network.webSocketClosed", this._webSocketClosed);
    }
    this._webSocketClosed = handler;
    if (handler) {
      this._client.on("Network.webSocketClosed", handler);
    }
  }
  /** Fired when WebSocket frame is received. */
  get webSocketFrameReceived(): Network.webSocketFrameReceived_Handler {
    return this._webSocketFrameReceived;
  }
  set webSocketFrameReceived(handler: Network.webSocketFrameReceived_Handler) {
    if (this._webSocketFrameReceived) {
      this._client.removeListener("Network.webSocketFrameReceived", this._webSocketFrameReceived);
    }
    this._webSocketFrameReceived = handler;
    if (handler) {
      this._client.on("Network.webSocketFrameReceived", handler);
    }
  }
  /** Fired when WebSocket frame error occurs. */
  get webSocketFrameError(): Network.webSocketFrameError_Handler {
    return this._webSocketFrameError;
  }
  set webSocketFrameError(handler: Network.webSocketFrameError_Handler) {
    if (this._webSocketFrameError) {
      this._client.removeListener("Network.webSocketFrameError", this._webSocketFrameError);
    }
    this._webSocketFrameError = handler;
    if (handler) {
      this._client.on("Network.webSocketFrameError", handler);
    }
  }
  /** Fired when WebSocket frame is sent. */
  get webSocketFrameSent(): Network.webSocketFrameSent_Handler {
    return this._webSocketFrameSent;
  }
  set webSocketFrameSent(handler: Network.webSocketFrameSent_Handler) {
    if (this._webSocketFrameSent) {
      this._client.removeListener("Network.webSocketFrameSent", this._webSocketFrameSent);
    }
    this._webSocketFrameSent = handler;
    if (handler) {
      this._client.on("Network.webSocketFrameSent", handler);
    }
  }
  /** Fired when EventSource message is received. */
  get eventSourceMessageReceived(): Network.eventSourceMessageReceived_Handler {
    return this._eventSourceMessageReceived;
  }
  set eventSourceMessageReceived(handler: Network.eventSourceMessageReceived_Handler) {
    if (this._eventSourceMessageReceived) {
      this._client.removeListener("Network.eventSourceMessageReceived", this._eventSourceMessageReceived);
    }
    this._eventSourceMessageReceived = handler;
    if (handler) {
      this._client.on("Network.eventSourceMessageReceived", handler);
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
    /** The referrer policy of the request, as defined in https://www.w3.org/TR/referrer-policy/ */
    referrerPolicy: "unsafe-url" | "no-referrer-when-downgrade" | "no-referrer" | "origin" | "origin-when-cross-origin" | "no-referrer-when-downgrade-origin-when-cross-origin";
    /** Whether is loaded via link preload. */
    isLinkPreload?: boolean;
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
    /** Key Exchange used by the connection, or the empty string if not applicable. */
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
  /** The reason why request was blocked. */
  export type BlockedReason = "csp" | "mixed-content" | "origin" | "inspector" | "subresource-filter" | "other";
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
  /** WebSocket request data. */
  export interface WebSocketRequest {
    /** HTTP request headers. */
    headers: Headers;
  }
  /** WebSocket response data. */
  export interface WebSocketResponse {
    /** HTTP response status code. */
    status: number;
    /** HTTP response status text. */
    statusText: string;
    /** HTTP response headers. */
    headers: Headers;
    /** HTTP response headers text. */
    headersText?: string;
    /** HTTP request headers. */
    requestHeaders?: Headers;
    /** HTTP request headers text. */
    requestHeadersText?: string;
  }
  /** WebSocket frame data. */
  export interface WebSocketFrame {
    /** WebSocket frame opcode. */
    opcode: number;
    /** WebSocke frame mask. */
    mask: boolean;
    /** WebSocke frame payload data. */
    payloadData: string;
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
    type: "parser" | "script" | "preload" | "other";
    /** Initiator JavaScript stack trace, set for Script only. */
    stack?: Runtime.StackTrace;
    /** Initiator URL, set for Parser type only. */
    url?: string;
    /** Initiator line number, set for Parser type only (0-based). */
    lineNumber?: number;
  }
  /** Cookie object */
  export interface Cookie {
    /** Cookie name. */
    name: string;
    /** Cookie value. */
    value: string;
    /** Cookie domain. */
    domain: string;
    /** Cookie path. */
    path: string;
    /** Cookie expiration date as the number of seconds since the UNIX epoch. */
    expires: number;
    /** Cookie size. */
    size: number;
    /** True if cookie is http-only. */
    httpOnly: boolean;
    /** True if cookie is secure. */
    secure: boolean;
    /** True in case of session cookie. */
    session: boolean;
    /** Cookie SameSite type. */
    sameSite?: CookieSameSite;
  }
  export type resourceChangedPriority_Parameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** New priority */
    newPriority: ResourcePriority;
    /** Timestamp. */
    timestamp: Timestamp;
  };
  export type resourceChangedPriority_Handler = (params: resourceChangedPriority_Parameters) => void;
  export type requestWillBeSent_Parameters = {
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
  export type requestWillBeSent_Handler = (params: requestWillBeSent_Parameters) => void;
  export type requestServedFromCache_Parameters = {
    /** Request identifier. */
    requestId: RequestId;
  };
  export type requestServedFromCache_Handler = (params: requestServedFromCache_Parameters) => void;
  export type responseReceived_Parameters = {
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
  export type responseReceived_Handler = (params: responseReceived_Parameters) => void;
  export type dataReceived_Parameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: Timestamp;
    /** Data chunk length. */
    dataLength: number;
    /** Actual bytes received (might be less than dataLength for compressed encodings). */
    encodedDataLength: number;
  };
  export type dataReceived_Handler = (params: dataReceived_Parameters) => void;
  export type loadingFinished_Parameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: Timestamp;
    /** Total number of bytes received for this request. */
    encodedDataLength: number;
  };
  export type loadingFinished_Handler = (params: loadingFinished_Parameters) => void;
  export type loadingFailed_Parameters = {
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
  export type loadingFailed_Handler = (params: loadingFailed_Parameters) => void;
  export type webSocketWillSendHandshakeRequest_Parameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: Timestamp;
    /** UTC Timestamp. */
    wallTime: Timestamp;
    /** WebSocket request data. */
    request: WebSocketRequest;
  };
  export type webSocketWillSendHandshakeRequest_Handler = (params: webSocketWillSendHandshakeRequest_Parameters) => void;
  export type webSocketHandshakeResponseReceived_Parameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: Timestamp;
    /** WebSocket response data. */
    response: WebSocketResponse;
  };
  export type webSocketHandshakeResponseReceived_Handler = (params: webSocketHandshakeResponseReceived_Parameters) => void;
  export type webSocketCreated_Parameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** WebSocket request URL. */
    url: string;
    /** Request initiator. */
    initiator?: Initiator;
  };
  export type webSocketCreated_Handler = (params: webSocketCreated_Parameters) => void;
  export type webSocketClosed_Parameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: Timestamp;
  };
  export type webSocketClosed_Handler = (params: webSocketClosed_Parameters) => void;
  export type webSocketFrameReceived_Parameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: Timestamp;
    /** WebSocket response data. */
    response: WebSocketFrame;
  };
  export type webSocketFrameReceived_Handler = (params: webSocketFrameReceived_Parameters) => void;
  export type webSocketFrameError_Parameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: Timestamp;
    /** WebSocket frame error message. */
    errorMessage: string;
  };
  export type webSocketFrameError_Handler = (params: webSocketFrameError_Parameters) => void;
  export type webSocketFrameSent_Parameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: Timestamp;
    /** WebSocket response data. */
    response: WebSocketFrame;
  };
  export type webSocketFrameSent_Handler = (params: webSocketFrameSent_Parameters) => void;
  export type eventSourceMessageReceived_Parameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: Timestamp;
    /** Message type. */
    eventName: string;
    /** Message identifier. */
    eventId: string;
    /** Message content. */
    data: string;
  };
  export type eventSourceMessageReceived_Handler = (params: eventSourceMessageReceived_Parameters) => void;
  export type enable_Parameters = {
    /** Buffer size in bytes to use when preserving network payloads (XHRs, etc). */
    maxTotalBufferSize?: number;
    /** Per-resource buffer size in bytes to use when preserving network payloads (XHRs, etc). */
    maxResourceBufferSize?: number;
  };
  export type setUserAgentOverride_Parameters = {
    /** User agent to use. */
    userAgent: string;
  };
  export type setExtraHTTPHeaders_Parameters = {
    /** Map with extra HTTP headers. */
    headers: Headers;
  };
  export type getResponseBody_Parameters = {
    /** Identifier of the network request to get content for. */
    requestId: RequestId;
  };
  export type getResponseBody_Return = {
    /** Response body. */
    body: string;
    /** True, if content was sent as base64. */
    base64Encoded: boolean;
  };
  export type setBlockedURLs_Parameters = {
    /** URL patterns to block. Wildcards ('*') are allowed. */
    urls: string[];
  };
  export type replayXHR_Parameters = {
    /** Identifier of XHR to replay. */
    requestId: RequestId;
  };
  export type setMonitoringXHREnabled_Parameters = {
    /** Monitoring enabled state. */
    enabled: boolean;
  };
  export type canClearBrowserCache_Return = {
    /** True if browser cache can be cleared. */
    result: boolean;
  };
  export type canClearBrowserCookies_Return = {
    /** True if browser cookies can be cleared. */
    result: boolean;
  };
  export type getCookies_Parameters = {
    /** The list of URLs for which applicable cookies will be fetched */
    urls?: string[];
  };
  export type getCookies_Return = {
    /** Array of cookie objects. */
    cookies: Cookie[];
  };
  export type getAllCookies_Return = {
    /** Array of cookie objects. */
    cookies: Cookie[];
  };
  export type deleteCookie_Parameters = {
    /** Name of the cookie to remove. */
    cookieName: string;
    /** URL to match cooke domain and path. */
    url: string;
  };
  export type setCookie_Parameters = {
    /** The request-URI to associate with the setting of the cookie. This value can affect the default domain and path values of the created cookie. */
    url: string;
    /** The name of the cookie. */
    name: string;
    /** The value of the cookie. */
    value: string;
    /** If omitted, the cookie becomes a host-only cookie. */
    domain?: string;
    /** Defaults to the path portion of the url parameter. */
    path?: string;
    /** Defaults ot false. */
    secure?: boolean;
    /** Defaults to false. */
    httpOnly?: boolean;
    /** Defaults to browser default behavior. */
    sameSite?: CookieSameSite;
    /** If omitted, the cookie becomes a session cookie. */
    expirationDate?: Timestamp;
  };
  export type setCookie_Return = {
    /** True if successfully set cookie. */
    success: boolean;
  };
  export type canEmulateNetworkConditions_Return = {
    /** True if emulation of network conditions is supported. */
    result: boolean;
  };
  export type emulateNetworkConditions_Parameters = {
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
  export type setCacheDisabled_Parameters = {
    /** Cache disabled state. */
    cacheDisabled: boolean;
  };
  export type setBypassServiceWorker_Parameters = {
    /** Bypass service worker and load from network. */
    bypass: boolean;
  };
  export type setDataSizeLimitsForTest_Parameters = {
    /** Maximum total buffer size. */
    maxTotalSize: number;
    /** Maximum per-resource size. */
    maxResourceSize: number;
  };
  export type getCertificate_Parameters = {
    /** Origin to get certificate for. */
    origin: string;
  };
  export type getCertificate_Return = {
    tableNames: string[];
  };
}
export class Database {
  private _addDatabase: Database.addDatabase_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables database tracking, database events will now be delivered to the client. */
  enable(): Promise<void> {
    return this._client.send<void>("Database.enable");
  }
  /** Disables database tracking, prevents database events from being sent to the client. */
  disable(): Promise<void> {
    return this._client.send<void>("Database.disable");
  }
  getDatabaseTableNames(params: Database.getDatabaseTableNames_Parameters): Promise<Database.getDatabaseTableNames_Return> {
    return this._client.send<Database.getDatabaseTableNames_Return>("Database.getDatabaseTableNames", params);
  }
  executeSQL(params: Database.executeSQL_Parameters): Promise<Database.executeSQL_Return> {
    return this._client.send<Database.executeSQL_Return>("Database.executeSQL", params);
  }
  get addDatabase(): Database.addDatabase_Handler {
    return this._addDatabase;
  }
  set addDatabase(handler: Database.addDatabase_Handler) {
    if (this._addDatabase) {
      this._client.removeListener("Database.addDatabase", this._addDatabase);
    }
    this._addDatabase = handler;
    if (handler) {
      this._client.on("Database.addDatabase", handler);
    }
  }
}
export namespace Database {
  /** Unique identifier of Database object. */
  export type DatabaseId = string;
  /** Database object. */
  export interface Database {
    /** Database ID. */
    id: DatabaseId;
    /** Database domain. */
    domain: string;
    /** Database name. */
    name: string;
    /** Database version. */
    version: string;
  }
  /** Database error. */
  export interface Error {
    /** Error message. */
    message: string;
    /** Error code. */
    code: number;
  }
  export type addDatabase_Parameters = {
    database: Database;
  };
  export type addDatabase_Handler = (params: addDatabase_Parameters) => void;
  export type getDatabaseTableNames_Parameters = {
    databaseId: DatabaseId;
  };
  export type getDatabaseTableNames_Return = {
    tableNames: string[];
  };
  export type executeSQL_Parameters = {
    databaseId: DatabaseId;
    query: string;
  };
  export type executeSQL_Return = {
    columnNames?: string[];
    values?: any[];
    sqlError?: Error;
  };
}
export class IndexedDB {
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables events from backend. */
  enable(): Promise<void> {
    return this._client.send<void>("IndexedDB.enable");
  }
  /** Disables events from backend. */
  disable(): Promise<void> {
    return this._client.send<void>("IndexedDB.disable");
  }
  /** Requests database names for given security origin. */
  requestDatabaseNames(params: IndexedDB.requestDatabaseNames_Parameters): Promise<IndexedDB.requestDatabaseNames_Return> {
    return this._client.send<IndexedDB.requestDatabaseNames_Return>("IndexedDB.requestDatabaseNames", params);
  }
  /** Requests database with given name in given frame. */
  requestDatabase(params: IndexedDB.requestDatabase_Parameters): Promise<IndexedDB.requestDatabase_Return> {
    return this._client.send<IndexedDB.requestDatabase_Return>("IndexedDB.requestDatabase", params);
  }
  /** Requests data from object store or index. */
  requestData(params: IndexedDB.requestData_Parameters): Promise<IndexedDB.requestData_Return> {
    return this._client.send<IndexedDB.requestData_Return>("IndexedDB.requestData", params);
  }
  /** Clears all entries from an object store. */
  clearObjectStore(params: IndexedDB.clearObjectStore_Parameters): Promise<IndexedDB.clearObjectStore_Return> {
    return this._client.send<IndexedDB.clearObjectStore_Return>("IndexedDB.clearObjectStore", params);
  }
  /** Deletes a database. */
  deleteDatabase(params: IndexedDB.deleteDatabase_Parameters): Promise<IndexedDB.deleteDatabase_Return> {
    return this._client.send<IndexedDB.deleteDatabase_Return>("IndexedDB.deleteDatabase", params);
  }
}
export namespace IndexedDB {
  /** Database with an array of object stores. */
  export interface DatabaseWithObjectStores {
    /** Database name. */
    name: string;
    /** Database version. */
    version: number;
    /** Object stores in this database. */
    objectStores: ObjectStore[];
  }
  /** Object store. */
  export interface ObjectStore {
    /** Object store name. */
    name: string;
    /** Object store key path. */
    keyPath: KeyPath;
    /** If true, object store has auto increment flag set. */
    autoIncrement: boolean;
    /** Indexes in this object store. */
    indexes: ObjectStoreIndex[];
  }
  /** Object store index. */
  export interface ObjectStoreIndex {
    /** Index name. */
    name: string;
    /** Index key path. */
    keyPath: KeyPath;
    /** If true, index is unique. */
    unique: boolean;
    /** If true, index allows multiple entries for a key. */
    multiEntry: boolean;
  }
  /** Key. */
  export interface Key {
    /** Key type. */
    type: "number" | "string" | "date" | "array";
    /** Number value. */
    number?: number;
    /** String value. */
    string?: string;
    /** Date value. */
    date?: number;
    /** Array value. */
    array?: Key[];
  }
  /** Key range. */
  export interface KeyRange {
    /** Lower bound. */
    lower?: Key;
    /** Upper bound. */
    upper?: Key;
    /** If true lower bound is open. */
    lowerOpen: boolean;
    /** If true upper bound is open. */
    upperOpen: boolean;
  }
  /** Data entry. */
  export interface DataEntry {
    /** Key object. */
    key: Runtime.RemoteObject;
    /** Primary key object. */
    primaryKey: Runtime.RemoteObject;
    /** Value object. */
    value: Runtime.RemoteObject;
  }
  /** Key path. */
  export interface KeyPath {
    /** Key path type. */
    type: "null" | "string" | "array";
    /** String value. */
    string?: string;
    /** Array value. */
    array?: string[];
  }
  export type requestDatabaseNames_Parameters = {
    /** Security origin. */
    securityOrigin: string;
  };
  export type requestDatabaseNames_Return = {
    /** Database names for origin. */
    databaseNames: string[];
  };
  export type requestDatabase_Parameters = {
    /** Security origin. */
    securityOrigin: string;
    /** Database name. */
    databaseName: string;
  };
  export type requestDatabase_Return = {
    /** Database with an array of object stores. */
    databaseWithObjectStores: DatabaseWithObjectStores;
  };
  export type requestData_Parameters = {
    /** Security origin. */
    securityOrigin: string;
    /** Database name. */
    databaseName: string;
    /** Object store name. */
    objectStoreName: string;
    /** Index name, empty string for object store data requests. */
    indexName: string;
    /** Number of records to skip. */
    skipCount: number;
    /** Number of records to fetch. */
    pageSize: number;
    /** Key range. */
    keyRange?: KeyRange;
  };
  export type requestData_Return = {
    /** Array of object store data entries. */
    objectStoreDataEntries: DataEntry[];
    /** If true, there are more entries to fetch in the given range. */
    hasMore: boolean;
  };
  export type clearObjectStore_Parameters = {
    /** Security origin. */
    securityOrigin: string;
    /** Database name. */
    databaseName: string;
    /** Object store name. */
    objectStoreName: string;
  };
  export type clearObjectStore_Return = any;
  export type deleteDatabase_Parameters = {
    /** Security origin. */
    securityOrigin: string;
    /** Database name. */
    databaseName: string;
  };
  export type deleteDatabase_Return = any;
}
export class CacheStorage {
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Requests cache names. */
  requestCacheNames(params: CacheStorage.requestCacheNames_Parameters): Promise<CacheStorage.requestCacheNames_Return> {
    return this._client.send<CacheStorage.requestCacheNames_Return>("CacheStorage.requestCacheNames", params);
  }
  /** Requests data from cache. */
  requestEntries(params: CacheStorage.requestEntries_Parameters): Promise<CacheStorage.requestEntries_Return> {
    return this._client.send<CacheStorage.requestEntries_Return>("CacheStorage.requestEntries", params);
  }
  /** Deletes a cache. */
  deleteCache(params: CacheStorage.deleteCache_Parameters): Promise<void> {
    return this._client.send<void>("CacheStorage.deleteCache", params);
  }
  /** Deletes a cache entry. */
  deleteEntry(params: CacheStorage.deleteEntry_Parameters): Promise<void> {
    return this._client.send<void>("CacheStorage.deleteEntry", params);
  }
}
export namespace CacheStorage {
  /** Unique identifier of the Cache object. */
  export type CacheId = string;
  /** Data entry. */
  export interface DataEntry {
    /** Request url spec. */
    request: string;
    /** Response stataus text. */
    response: string;
  }
  /** Cache identifier. */
  export interface Cache {
    /** An opaque unique id of the cache. */
    cacheId: CacheId;
    /** Security origin of the cache. */
    securityOrigin: string;
    /** The name of the cache. */
    cacheName: string;
  }
  export type requestCacheNames_Parameters = {
    /** Security origin. */
    securityOrigin: string;
  };
  export type requestCacheNames_Return = {
    /** Caches for the security origin. */
    caches: Cache[];
  };
  export type requestEntries_Parameters = {
    /** ID of cache to get entries from. */
    cacheId: CacheId;
    /** Number of records to skip. */
    skipCount: number;
    /** Number of records to fetch. */
    pageSize: number;
  };
  export type requestEntries_Return = {
    /** Array of object store data entries. */
    cacheDataEntries: DataEntry[];
    /** If true, there are more entries to fetch in the given range. */
    hasMore: boolean;
  };
  export type deleteCache_Parameters = {
    /** Id of cache for deletion. */
    cacheId: CacheId;
  };
  export type deleteEntry_Parameters = {
    /** Id of cache where the entry will be deleted. */
    cacheId: CacheId;
    /** URL spec of the request. */
    request: string;
  };
}
/** Query and modify DOM storage. */
export class DOMStorage {
  private _domStorageItemsCleared: DOMStorage.domStorageItemsCleared_Handler = undefined;
  private _domStorageItemRemoved: DOMStorage.domStorageItemRemoved_Handler = undefined;
  private _domStorageItemAdded: DOMStorage.domStorageItemAdded_Handler = undefined;
  private _domStorageItemUpdated: DOMStorage.domStorageItemUpdated_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables storage tracking, storage events will now be delivered to the client. */
  enable(): Promise<void> {
    return this._client.send<void>("DOMStorage.enable");
  }
  /** Disables storage tracking, prevents storage events from being sent to the client. */
  disable(): Promise<void> {
    return this._client.send<void>("DOMStorage.disable");
  }
  clear(params: DOMStorage.clear_Parameters): Promise<void> {
    return this._client.send<void>("DOMStorage.clear", params);
  }
  getDOMStorageItems(params: DOMStorage.getDOMStorageItems_Parameters): Promise<DOMStorage.getDOMStorageItems_Return> {
    return this._client.send<DOMStorage.getDOMStorageItems_Return>("DOMStorage.getDOMStorageItems", params);
  }
  setDOMStorageItem(params: DOMStorage.setDOMStorageItem_Parameters): Promise<void> {
    return this._client.send<void>("DOMStorage.setDOMStorageItem", params);
  }
  removeDOMStorageItem(params: DOMStorage.removeDOMStorageItem_Parameters): Promise<void> {
    return this._client.send<void>("DOMStorage.removeDOMStorageItem", params);
  }
  get domStorageItemsCleared(): DOMStorage.domStorageItemsCleared_Handler {
    return this._domStorageItemsCleared;
  }
  set domStorageItemsCleared(handler: DOMStorage.domStorageItemsCleared_Handler) {
    if (this._domStorageItemsCleared) {
      this._client.removeListener("DOMStorage.domStorageItemsCleared", this._domStorageItemsCleared);
    }
    this._domStorageItemsCleared = handler;
    if (handler) {
      this._client.on("DOMStorage.domStorageItemsCleared", handler);
    }
  }
  get domStorageItemRemoved(): DOMStorage.domStorageItemRemoved_Handler {
    return this._domStorageItemRemoved;
  }
  set domStorageItemRemoved(handler: DOMStorage.domStorageItemRemoved_Handler) {
    if (this._domStorageItemRemoved) {
      this._client.removeListener("DOMStorage.domStorageItemRemoved", this._domStorageItemRemoved);
    }
    this._domStorageItemRemoved = handler;
    if (handler) {
      this._client.on("DOMStorage.domStorageItemRemoved", handler);
    }
  }
  get domStorageItemAdded(): DOMStorage.domStorageItemAdded_Handler {
    return this._domStorageItemAdded;
  }
  set domStorageItemAdded(handler: DOMStorage.domStorageItemAdded_Handler) {
    if (this._domStorageItemAdded) {
      this._client.removeListener("DOMStorage.domStorageItemAdded", this._domStorageItemAdded);
    }
    this._domStorageItemAdded = handler;
    if (handler) {
      this._client.on("DOMStorage.domStorageItemAdded", handler);
    }
  }
  get domStorageItemUpdated(): DOMStorage.domStorageItemUpdated_Handler {
    return this._domStorageItemUpdated;
  }
  set domStorageItemUpdated(handler: DOMStorage.domStorageItemUpdated_Handler) {
    if (this._domStorageItemUpdated) {
      this._client.removeListener("DOMStorage.domStorageItemUpdated", this._domStorageItemUpdated);
    }
    this._domStorageItemUpdated = handler;
    if (handler) {
      this._client.on("DOMStorage.domStorageItemUpdated", handler);
    }
  }
}
export namespace DOMStorage {
  /** DOM Storage identifier. */
  export interface StorageId {
    /** Security origin for the storage. */
    securityOrigin: string;
    /** Whether the storage is local storage (not session storage). */
    isLocalStorage: boolean;
  }
  /** DOM Storage item. */
  export type Item = string[];
  export type domStorageItemsCleared_Parameters = {
    storageId: StorageId;
  };
  export type domStorageItemsCleared_Handler = (params: domStorageItemsCleared_Parameters) => void;
  export type domStorageItemRemoved_Parameters = {
    storageId: StorageId;
    key: string;
  };
  export type domStorageItemRemoved_Handler = (params: domStorageItemRemoved_Parameters) => void;
  export type domStorageItemAdded_Parameters = {
    storageId: StorageId;
    key: string;
    newValue: string;
  };
  export type domStorageItemAdded_Handler = (params: domStorageItemAdded_Parameters) => void;
  export type domStorageItemUpdated_Parameters = {
    storageId: StorageId;
    key: string;
    oldValue: string;
    newValue: string;
  };
  export type domStorageItemUpdated_Handler = (params: domStorageItemUpdated_Parameters) => void;
  export type clear_Parameters = {
    storageId: StorageId;
  };
  export type getDOMStorageItems_Parameters = {
    storageId: StorageId;
  };
  export type getDOMStorageItems_Return = {
    entries: Item[];
  };
  export type setDOMStorageItem_Parameters = {
    storageId: StorageId;
    key: string;
    value: string;
  };
  export type removeDOMStorageItem_Parameters = {
    storageId: StorageId;
    key: string;
  };
}
export class ApplicationCache {
  private _applicationCacheStatusUpdated: ApplicationCache.applicationCacheStatusUpdated_Handler = undefined;
  private _networkStateUpdated: ApplicationCache.networkStateUpdated_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Returns array of frame identifiers with manifest urls for each frame containing a document associated with some application cache. */
  getFramesWithManifests(): Promise<ApplicationCache.getFramesWithManifests_Return> {
    return this._client.send<ApplicationCache.getFramesWithManifests_Return>("ApplicationCache.getFramesWithManifests");
  }
  /** Enables application cache domain notifications. */
  enable(): Promise<void> {
    return this._client.send<void>("ApplicationCache.enable");
  }
  /** Returns manifest URL for document in the given frame. */
  getManifestForFrame(params: ApplicationCache.getManifestForFrame_Parameters): Promise<ApplicationCache.getManifestForFrame_Return> {
    return this._client.send<ApplicationCache.getManifestForFrame_Return>("ApplicationCache.getManifestForFrame", params);
  }
  /** Returns relevant application cache data for the document in given frame. */
  getApplicationCacheForFrame(params: ApplicationCache.getApplicationCacheForFrame_Parameters): Promise<ApplicationCache.getApplicationCacheForFrame_Return> {
    return this._client.send<ApplicationCache.getApplicationCacheForFrame_Return>("ApplicationCache.getApplicationCacheForFrame", params);
  }
  get applicationCacheStatusUpdated(): ApplicationCache.applicationCacheStatusUpdated_Handler {
    return this._applicationCacheStatusUpdated;
  }
  set applicationCacheStatusUpdated(handler: ApplicationCache.applicationCacheStatusUpdated_Handler) {
    if (this._applicationCacheStatusUpdated) {
      this._client.removeListener("ApplicationCache.applicationCacheStatusUpdated", this._applicationCacheStatusUpdated);
    }
    this._applicationCacheStatusUpdated = handler;
    if (handler) {
      this._client.on("ApplicationCache.applicationCacheStatusUpdated", handler);
    }
  }
  get networkStateUpdated(): ApplicationCache.networkStateUpdated_Handler {
    return this._networkStateUpdated;
  }
  set networkStateUpdated(handler: ApplicationCache.networkStateUpdated_Handler) {
    if (this._networkStateUpdated) {
      this._client.removeListener("ApplicationCache.networkStateUpdated", this._networkStateUpdated);
    }
    this._networkStateUpdated = handler;
    if (handler) {
      this._client.on("ApplicationCache.networkStateUpdated", handler);
    }
  }
}
export namespace ApplicationCache {
  /** Detailed application cache resource information. */
  export interface ApplicationCacheResource {
    /** Resource url. */
    url: string;
    /** Resource size. */
    size: number;
    /** Resource type. */
    type: string;
  }
  /** Detailed application cache information. */
  export interface ApplicationCache {
    /** Manifest URL. */
    manifestURL: string;
    /** Application cache size. */
    size: number;
    /** Application cache creation time. */
    creationTime: number;
    /** Application cache update time. */
    updateTime: number;
    /** Application cache resources. */
    resources: ApplicationCacheResource[];
  }
  /** Frame identifier - manifest URL pair. */
  export interface FrameWithManifest {
    /** Frame identifier. */
    frameId: Page.FrameId;
    /** Manifest URL. */
    manifestURL: string;
    /** Application cache status. */
    status: number;
  }
  export type applicationCacheStatusUpdated_Parameters = {
    /** Identifier of the frame containing document whose application cache updated status. */
    frameId: Page.FrameId;
    /** Manifest URL. */
    manifestURL: string;
    /** Updated application cache status. */
    status: number;
  };
  export type applicationCacheStatusUpdated_Handler = (params: applicationCacheStatusUpdated_Parameters) => void;
  export type networkStateUpdated_Parameters = {
    isNowOnline: boolean;
  };
  export type networkStateUpdated_Handler = (params: networkStateUpdated_Parameters) => void;
  export type getFramesWithManifests_Return = {
    /** Array of frame identifiers with manifest urls for each frame containing a document associated with some application cache. */
    frameIds: FrameWithManifest[];
  };
  export type getManifestForFrame_Parameters = {
    /** Identifier of the frame containing document whose manifest is retrieved. */
    frameId: Page.FrameId;
  };
  export type getManifestForFrame_Return = {
    /** Manifest URL for document in the given frame. */
    manifestURL: string;
  };
  export type getApplicationCacheForFrame_Parameters = {
    /** Identifier of the frame containing document whose application cache is retrieved. */
    frameId: Page.FrameId;
  };
  export type getApplicationCacheForFrame_Return = {
    /** Relevant application cache data for the document in given frame. */
    applicationCache: ApplicationCache;
  };
}
/** This domain exposes DOM read/write operations. Each DOM Node is represented with its mirror object that has an <code>id</code>. This <code>id</code> can be used to get additional information on the Node, resolve it into the JavaScript object wrapper, etc. It is important that client receives DOM events only for the nodes that are known to the client. Backend keeps track of the nodes that were sent to the client and never sends the same node twice. It is client's responsibility to collect information about the nodes that were sent to the client.<p>Note that <code>iframe</code> owner elements will return corresponding document elements as their child nodes.</p> */
export class DOM {
  private _documentUpdated: DOM.documentUpdated_Handler = undefined;
  private _inspectNodeRequested: DOM.inspectNodeRequested_Handler = undefined;
  private _setChildNodes: DOM.setChildNodes_Handler = undefined;
  private _attributeModified: DOM.attributeModified_Handler = undefined;
  private _attributeRemoved: DOM.attributeRemoved_Handler = undefined;
  private _inlineStyleInvalidated: DOM.inlineStyleInvalidated_Handler = undefined;
  private _characterDataModified: DOM.characterDataModified_Handler = undefined;
  private _childNodeCountUpdated: DOM.childNodeCountUpdated_Handler = undefined;
  private _childNodeInserted: DOM.childNodeInserted_Handler = undefined;
  private _childNodeRemoved: DOM.childNodeRemoved_Handler = undefined;
  private _shadowRootPushed: DOM.shadowRootPushed_Handler = undefined;
  private _shadowRootPopped: DOM.shadowRootPopped_Handler = undefined;
  private _pseudoElementAdded: DOM.pseudoElementAdded_Handler = undefined;
  private _pseudoElementRemoved: DOM.pseudoElementRemoved_Handler = undefined;
  private _distributedNodesUpdated: DOM.distributedNodesUpdated_Handler = undefined;
  private _nodeHighlightRequested: DOM.nodeHighlightRequested_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables DOM agent for the given page. */
  enable(): Promise<void> {
    return this._client.send<void>("DOM.enable");
  }
  /** Disables DOM agent for the given page. */
  disable(): Promise<void> {
    return this._client.send<void>("DOM.disable");
  }
  /** Returns the root DOM node (and optionally the subtree) to the caller. */
  getDocument(params: DOM.getDocument_Parameters): Promise<DOM.getDocument_Return> {
    return this._client.send<DOM.getDocument_Return>("DOM.getDocument", params);
  }
  /** Returns the root DOM node (and optionally the subtree) to the caller. */
  getFlattenedDocument(params: DOM.getFlattenedDocument_Parameters): Promise<DOM.getFlattenedDocument_Return> {
    return this._client.send<DOM.getFlattenedDocument_Return>("DOM.getFlattenedDocument", params);
  }
  /** Collects class names for the node with given id and all of it's child nodes. */
  collectClassNamesFromSubtree(params: DOM.collectClassNamesFromSubtree_Parameters): Promise<DOM.collectClassNamesFromSubtree_Return> {
    return this._client.send<DOM.collectClassNamesFromSubtree_Return>("DOM.collectClassNamesFromSubtree", params);
  }
  /** Requests that children of the node with given id are returned to the caller in form of <code>setChildNodes</code> events where not only immediate children are retrieved, but all children down to the specified depth. */
  requestChildNodes(params: DOM.requestChildNodes_Parameters): Promise<void> {
    return this._client.send<void>("DOM.requestChildNodes", params);
  }
  /** Executes <code>querySelector</code> on a given node. */
  querySelector(params: DOM.querySelector_Parameters): Promise<DOM.querySelector_Return> {
    return this._client.send<DOM.querySelector_Return>("DOM.querySelector", params);
  }
  /** Executes <code>querySelectorAll</code> on a given node. */
  querySelectorAll(params: DOM.querySelectorAll_Parameters): Promise<DOM.querySelectorAll_Return> {
    return this._client.send<DOM.querySelectorAll_Return>("DOM.querySelectorAll", params);
  }
  /** Sets node name for a node with given id. */
  setNodeName(params: DOM.setNodeName_Parameters): Promise<DOM.setNodeName_Return> {
    return this._client.send<DOM.setNodeName_Return>("DOM.setNodeName", params);
  }
  /** Sets node value for a node with given id. */
  setNodeValue(params: DOM.setNodeValue_Parameters): Promise<void> {
    return this._client.send<void>("DOM.setNodeValue", params);
  }
  /** Removes node with given id. */
  removeNode(params: DOM.removeNode_Parameters): Promise<void> {
    return this._client.send<void>("DOM.removeNode", params);
  }
  /** Sets attribute for an element with given id. */
  setAttributeValue(params: DOM.setAttributeValue_Parameters): Promise<void> {
    return this._client.send<void>("DOM.setAttributeValue", params);
  }
  /** Sets attributes on element with given id. This method is useful when user edits some existing attribute value and types in several attribute name/value pairs. */
  setAttributesAsText(params: DOM.setAttributesAsText_Parameters): Promise<void> {
    return this._client.send<void>("DOM.setAttributesAsText", params);
  }
  /** Removes attribute with given name from an element with given id. */
  removeAttribute(params: DOM.removeAttribute_Parameters): Promise<void> {
    return this._client.send<void>("DOM.removeAttribute", params);
  }
  /** Returns node's HTML markup. */
  getOuterHTML(params: DOM.getOuterHTML_Parameters): Promise<DOM.getOuterHTML_Return> {
    return this._client.send<DOM.getOuterHTML_Return>("DOM.getOuterHTML", params);
  }
  /** Sets node HTML markup, returns new node id. */
  setOuterHTML(params: DOM.setOuterHTML_Parameters): Promise<void> {
    return this._client.send<void>("DOM.setOuterHTML", params);
  }
  /** Searches for a given string in the DOM tree. Use <code>getSearchResults</code> to access search results or <code>cancelSearch</code> to end this search session. */
  performSearch(params: DOM.performSearch_Parameters): Promise<DOM.performSearch_Return> {
    return this._client.send<DOM.performSearch_Return>("DOM.performSearch", params);
  }
  /** Returns search results from given <code>fromIndex</code> to given <code>toIndex</code> from the sarch with the given identifier. */
  getSearchResults(params: DOM.getSearchResults_Parameters): Promise<DOM.getSearchResults_Return> {
    return this._client.send<DOM.getSearchResults_Return>("DOM.getSearchResults", params);
  }
  /** Discards search results from the session with the given id. <code>getSearchResults</code> should no longer be called for that search. */
  discardSearchResults(params: DOM.discardSearchResults_Parameters): Promise<void> {
    return this._client.send<void>("DOM.discardSearchResults", params);
  }
  /** Requests that the node is sent to the caller given the JavaScript node object reference. All nodes that form the path from the node to the root are also sent to the client as a series of <code>setChildNodes</code> notifications. */
  requestNode(params: DOM.requestNode_Parameters): Promise<DOM.requestNode_Return> {
    return this._client.send<DOM.requestNode_Return>("DOM.requestNode", params);
  }
  /** Enters the 'inspect' mode. In this mode, elements that user is hovering over are highlighted. Backend then generates 'inspectNodeRequested' event upon element selection. */
  setInspectMode(params: DOM.setInspectMode_Parameters): Promise<void> {
    return this._client.send<void>("DOM.setInspectMode", params);
  }
  /** Highlights given rectangle. Coordinates are absolute with respect to the main frame viewport. */
  highlightRect(params: DOM.highlightRect_Parameters): Promise<void> {
    return this._client.send<void>("DOM.highlightRect", params);
  }
  /** Highlights given quad. Coordinates are absolute with respect to the main frame viewport. */
  highlightQuad(params: DOM.highlightQuad_Parameters): Promise<void> {
    return this._client.send<void>("DOM.highlightQuad", params);
  }
  /** Highlights DOM node with given id or with the given JavaScript object wrapper. Either nodeId or objectId must be specified. */
  highlightNode(params: DOM.highlightNode_Parameters): Promise<void> {
    return this._client.send<void>("DOM.highlightNode", params);
  }
  /** Hides DOM node highlight. */
  hideHighlight(): Promise<void> {
    return this._client.send<void>("DOM.hideHighlight");
  }
  /** Highlights owner element of the frame with given id. */
  highlightFrame(params: DOM.highlightFrame_Parameters): Promise<void> {
    return this._client.send<void>("DOM.highlightFrame", params);
  }
  /** Requests that the node is sent to the caller given its path. // FIXME, use XPath */
  pushNodeByPathToFrontend(params: DOM.pushNodeByPathToFrontend_Parameters): Promise<DOM.pushNodeByPathToFrontend_Return> {
    return this._client.send<DOM.pushNodeByPathToFrontend_Return>("DOM.pushNodeByPathToFrontend", params);
  }
  /** Requests that a batch of nodes is sent to the caller given their backend node ids. */
  pushNodesByBackendIdsToFrontend(params: DOM.pushNodesByBackendIdsToFrontend_Parameters): Promise<DOM.pushNodesByBackendIdsToFrontend_Return> {
    return this._client.send<DOM.pushNodesByBackendIdsToFrontend_Return>("DOM.pushNodesByBackendIdsToFrontend", params);
  }
  /** Enables console to refer to the node with given id via $x (see Command Line API for more details $x functions). */
  setInspectedNode(params: DOM.setInspectedNode_Parameters): Promise<void> {
    return this._client.send<void>("DOM.setInspectedNode", params);
  }
  /** Resolves JavaScript node object for given node id. */
  resolveNode(params: DOM.resolveNode_Parameters): Promise<DOM.resolveNode_Return> {
    return this._client.send<DOM.resolveNode_Return>("DOM.resolveNode", params);
  }
  /** Returns attributes for the specified node. */
  getAttributes(params: DOM.getAttributes_Parameters): Promise<DOM.getAttributes_Return> {
    return this._client.send<DOM.getAttributes_Return>("DOM.getAttributes", params);
  }
  /** Creates a deep copy of the specified node and places it into the target container before the given anchor. */
  copyTo(params: DOM.copyTo_Parameters): Promise<DOM.copyTo_Return> {
    return this._client.send<DOM.copyTo_Return>("DOM.copyTo", params);
  }
  /** Moves node into the new container, places it before the given anchor. */
  moveTo(params: DOM.moveTo_Parameters): Promise<DOM.moveTo_Return> {
    return this._client.send<DOM.moveTo_Return>("DOM.moveTo", params);
  }
  /** Undoes the last performed action. */
  undo(): Promise<void> {
    return this._client.send<void>("DOM.undo");
  }
  /** Re-does the last undone action. */
  redo(): Promise<void> {
    return this._client.send<void>("DOM.redo");
  }
  /** Marks last undoable state. */
  markUndoableState(): Promise<void> {
    return this._client.send<void>("DOM.markUndoableState");
  }
  /** Focuses the given element. */
  focus(params: DOM.focus_Parameters): Promise<void> {
    return this._client.send<void>("DOM.focus", params);
  }
  /** Sets files for the given file input element. */
  setFileInputFiles(params: DOM.setFileInputFiles_Parameters): Promise<void> {
    return this._client.send<void>("DOM.setFileInputFiles", params);
  }
  /** Returns boxes for the currently selected nodes. */
  getBoxModel(params: DOM.getBoxModel_Parameters): Promise<DOM.getBoxModel_Return> {
    return this._client.send<DOM.getBoxModel_Return>("DOM.getBoxModel", params);
  }
  /** Returns node id at given location. */
  getNodeForLocation(params: DOM.getNodeForLocation_Parameters): Promise<DOM.getNodeForLocation_Return> {
    return this._client.send<DOM.getNodeForLocation_Return>("DOM.getNodeForLocation", params);
  }
  /** Returns the id of the nearest ancestor that is a relayout boundary. */
  getRelayoutBoundary(params: DOM.getRelayoutBoundary_Parameters): Promise<DOM.getRelayoutBoundary_Return> {
    return this._client.send<DOM.getRelayoutBoundary_Return>("DOM.getRelayoutBoundary", params);
  }
  /** For testing. */
  getHighlightObjectForTest(params: DOM.getHighlightObjectForTest_Parameters): Promise<DOM.getHighlightObjectForTest_Return> {
    return this._client.send<DOM.getHighlightObjectForTest_Return>("DOM.getHighlightObjectForTest", params);
  }
  /** Fired when <code>Document</code> has been totally updated. Node ids are no longer valid. */
  get documentUpdated(): DOM.documentUpdated_Handler {
    return this._documentUpdated;
  }
  set documentUpdated(handler: DOM.documentUpdated_Handler) {
    if (this._documentUpdated) {
      this._client.removeListener("DOM.documentUpdated", this._documentUpdated);
    }
    this._documentUpdated = handler;
    if (handler) {
      this._client.on("DOM.documentUpdated", handler);
    }
  }
  /** Fired when the node should be inspected. This happens after call to <code>setInspectMode</code>. */
  get inspectNodeRequested(): DOM.inspectNodeRequested_Handler {
    return this._inspectNodeRequested;
  }
  set inspectNodeRequested(handler: DOM.inspectNodeRequested_Handler) {
    if (this._inspectNodeRequested) {
      this._client.removeListener("DOM.inspectNodeRequested", this._inspectNodeRequested);
    }
    this._inspectNodeRequested = handler;
    if (handler) {
      this._client.on("DOM.inspectNodeRequested", handler);
    }
  }
  /** Fired when backend wants to provide client with the missing DOM structure. This happens upon most of the calls requesting node ids. */
  get setChildNodes(): DOM.setChildNodes_Handler {
    return this._setChildNodes;
  }
  set setChildNodes(handler: DOM.setChildNodes_Handler) {
    if (this._setChildNodes) {
      this._client.removeListener("DOM.setChildNodes", this._setChildNodes);
    }
    this._setChildNodes = handler;
    if (handler) {
      this._client.on("DOM.setChildNodes", handler);
    }
  }
  /** Fired when <code>Element</code>'s attribute is modified. */
  get attributeModified(): DOM.attributeModified_Handler {
    return this._attributeModified;
  }
  set attributeModified(handler: DOM.attributeModified_Handler) {
    if (this._attributeModified) {
      this._client.removeListener("DOM.attributeModified", this._attributeModified);
    }
    this._attributeModified = handler;
    if (handler) {
      this._client.on("DOM.attributeModified", handler);
    }
  }
  /** Fired when <code>Element</code>'s attribute is removed. */
  get attributeRemoved(): DOM.attributeRemoved_Handler {
    return this._attributeRemoved;
  }
  set attributeRemoved(handler: DOM.attributeRemoved_Handler) {
    if (this._attributeRemoved) {
      this._client.removeListener("DOM.attributeRemoved", this._attributeRemoved);
    }
    this._attributeRemoved = handler;
    if (handler) {
      this._client.on("DOM.attributeRemoved", handler);
    }
  }
  /** Fired when <code>Element</code>'s inline style is modified via a CSS property modification. */
  get inlineStyleInvalidated(): DOM.inlineStyleInvalidated_Handler {
    return this._inlineStyleInvalidated;
  }
  set inlineStyleInvalidated(handler: DOM.inlineStyleInvalidated_Handler) {
    if (this._inlineStyleInvalidated) {
      this._client.removeListener("DOM.inlineStyleInvalidated", this._inlineStyleInvalidated);
    }
    this._inlineStyleInvalidated = handler;
    if (handler) {
      this._client.on("DOM.inlineStyleInvalidated", handler);
    }
  }
  /** Mirrors <code>DOMCharacterDataModified</code> event. */
  get characterDataModified(): DOM.characterDataModified_Handler {
    return this._characterDataModified;
  }
  set characterDataModified(handler: DOM.characterDataModified_Handler) {
    if (this._characterDataModified) {
      this._client.removeListener("DOM.characterDataModified", this._characterDataModified);
    }
    this._characterDataModified = handler;
    if (handler) {
      this._client.on("DOM.characterDataModified", handler);
    }
  }
  /** Fired when <code>Container</code>'s child node count has changed. */
  get childNodeCountUpdated(): DOM.childNodeCountUpdated_Handler {
    return this._childNodeCountUpdated;
  }
  set childNodeCountUpdated(handler: DOM.childNodeCountUpdated_Handler) {
    if (this._childNodeCountUpdated) {
      this._client.removeListener("DOM.childNodeCountUpdated", this._childNodeCountUpdated);
    }
    this._childNodeCountUpdated = handler;
    if (handler) {
      this._client.on("DOM.childNodeCountUpdated", handler);
    }
  }
  /** Mirrors <code>DOMNodeInserted</code> event. */
  get childNodeInserted(): DOM.childNodeInserted_Handler {
    return this._childNodeInserted;
  }
  set childNodeInserted(handler: DOM.childNodeInserted_Handler) {
    if (this._childNodeInserted) {
      this._client.removeListener("DOM.childNodeInserted", this._childNodeInserted);
    }
    this._childNodeInserted = handler;
    if (handler) {
      this._client.on("DOM.childNodeInserted", handler);
    }
  }
  /** Mirrors <code>DOMNodeRemoved</code> event. */
  get childNodeRemoved(): DOM.childNodeRemoved_Handler {
    return this._childNodeRemoved;
  }
  set childNodeRemoved(handler: DOM.childNodeRemoved_Handler) {
    if (this._childNodeRemoved) {
      this._client.removeListener("DOM.childNodeRemoved", this._childNodeRemoved);
    }
    this._childNodeRemoved = handler;
    if (handler) {
      this._client.on("DOM.childNodeRemoved", handler);
    }
  }
  /** Called when shadow root is pushed into the element. */
  get shadowRootPushed(): DOM.shadowRootPushed_Handler {
    return this._shadowRootPushed;
  }
  set shadowRootPushed(handler: DOM.shadowRootPushed_Handler) {
    if (this._shadowRootPushed) {
      this._client.removeListener("DOM.shadowRootPushed", this._shadowRootPushed);
    }
    this._shadowRootPushed = handler;
    if (handler) {
      this._client.on("DOM.shadowRootPushed", handler);
    }
  }
  /** Called when shadow root is popped from the element. */
  get shadowRootPopped(): DOM.shadowRootPopped_Handler {
    return this._shadowRootPopped;
  }
  set shadowRootPopped(handler: DOM.shadowRootPopped_Handler) {
    if (this._shadowRootPopped) {
      this._client.removeListener("DOM.shadowRootPopped", this._shadowRootPopped);
    }
    this._shadowRootPopped = handler;
    if (handler) {
      this._client.on("DOM.shadowRootPopped", handler);
    }
  }
  /** Called when a pseudo element is added to an element. */
  get pseudoElementAdded(): DOM.pseudoElementAdded_Handler {
    return this._pseudoElementAdded;
  }
  set pseudoElementAdded(handler: DOM.pseudoElementAdded_Handler) {
    if (this._pseudoElementAdded) {
      this._client.removeListener("DOM.pseudoElementAdded", this._pseudoElementAdded);
    }
    this._pseudoElementAdded = handler;
    if (handler) {
      this._client.on("DOM.pseudoElementAdded", handler);
    }
  }
  /** Called when a pseudo element is removed from an element. */
  get pseudoElementRemoved(): DOM.pseudoElementRemoved_Handler {
    return this._pseudoElementRemoved;
  }
  set pseudoElementRemoved(handler: DOM.pseudoElementRemoved_Handler) {
    if (this._pseudoElementRemoved) {
      this._client.removeListener("DOM.pseudoElementRemoved", this._pseudoElementRemoved);
    }
    this._pseudoElementRemoved = handler;
    if (handler) {
      this._client.on("DOM.pseudoElementRemoved", handler);
    }
  }
  /** Called when distrubution is changed. */
  get distributedNodesUpdated(): DOM.distributedNodesUpdated_Handler {
    return this._distributedNodesUpdated;
  }
  set distributedNodesUpdated(handler: DOM.distributedNodesUpdated_Handler) {
    if (this._distributedNodesUpdated) {
      this._client.removeListener("DOM.distributedNodesUpdated", this._distributedNodesUpdated);
    }
    this._distributedNodesUpdated = handler;
    if (handler) {
      this._client.on("DOM.distributedNodesUpdated", handler);
    }
  }
  get nodeHighlightRequested(): DOM.nodeHighlightRequested_Handler {
    return this._nodeHighlightRequested;
  }
  set nodeHighlightRequested(handler: DOM.nodeHighlightRequested_Handler) {
    if (this._nodeHighlightRequested) {
      this._client.removeListener("DOM.nodeHighlightRequested", this._nodeHighlightRequested);
    }
    this._nodeHighlightRequested = handler;
    if (handler) {
      this._client.on("DOM.nodeHighlightRequested", handler);
    }
  }
}
export namespace DOM {
  /** Unique DOM node identifier. */
  export type NodeId = number;
  /** Unique DOM node identifier used to reference a node that may not have been pushed to the front-end. */
  export type BackendNodeId = number;
  /** Backend node with a friendly name. */
  export interface BackendNode {
    /** <code>Node</code>'s nodeType. */
    nodeType: number;
    /** <code>Node</code>'s nodeName. */
    nodeName: string;
    backendNodeId: BackendNodeId;
  }
  /** Pseudo element type. */
  export type PseudoType = "first-line" | "first-letter" | "before" | "after" | "backdrop" | "selection" | "first-line-inherited" | "scrollbar" | "scrollbar-thumb" | "scrollbar-button" | "scrollbar-track" | "scrollbar-track-piece" | "scrollbar-corner" | "resizer" | "input-list-button";
  /** Shadow root type. */
  export type ShadowRootType = "user-agent" | "open" | "closed";
  /** DOM interaction is implemented in terms of mirror objects that represent the actual DOM nodes. DOMNode is a base node mirror type. */
  export interface Node {
    /** Node identifier that is passed into the rest of the DOM messages as the <code>nodeId</code>. Backend will only push node with given <code>id</code> once. It is aware of all requested nodes and will only fire DOM events for nodes known to the client. */
    nodeId: NodeId;
    /** The id of the parent node if any. */
    parentId?: NodeId;
    /** The BackendNodeId for this node. */
    backendNodeId: BackendNodeId;
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
    /** Whether the node is SVG. */
    isSVG?: boolean;
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
  /** An array of quad vertices, x immediately followed by y for each point, points clock-wise. */
  export type Quad = number[];
  /** Box model. */
  export interface BoxModel {
    /** Content box */
    content: Quad;
    /** Padding box */
    padding: Quad;
    /** Border box */
    border: Quad;
    /** Margin box */
    margin: Quad;
    /** Node width */
    width: number;
    /** Node height */
    height: number;
    /** Shape outside coordinates */
    shapeOutside?: ShapeOutsideInfo;
  }
  /** CSS Shape Outside details. */
  export interface ShapeOutsideInfo {
    /** Shape bounds */
    bounds: Quad;
    /** Shape coordinate details */
    shape: any[];
    /** Margin shape bounds */
    marginShape: any[];
  }
  /** Rectangle. */
  export interface Rect {
    /** X coordinate */
    x: number;
    /** Y coordinate */
    y: number;
    /** Rectangle width */
    width: number;
    /** Rectangle height */
    height: number;
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
  export type InspectMode = "searchForNode" | "searchForUAShadowDOM" | "none";
  export type documentUpdated_Handler = () => void;
  export type inspectNodeRequested_Parameters = {
    /** Id of the node to inspect. */
    backendNodeId: BackendNodeId;
  };
  export type inspectNodeRequested_Handler = (params: inspectNodeRequested_Parameters) => void;
  export type setChildNodes_Parameters = {
    /** Parent node id to populate with children. */
    parentId: NodeId;
    /** Child nodes array. */
    nodes: Node[];
  };
  export type setChildNodes_Handler = (params: setChildNodes_Parameters) => void;
  export type attributeModified_Parameters = {
    /** Id of the node that has changed. */
    nodeId: NodeId;
    /** Attribute name. */
    name: string;
    /** Attribute value. */
    value: string;
  };
  export type attributeModified_Handler = (params: attributeModified_Parameters) => void;
  export type attributeRemoved_Parameters = {
    /** Id of the node that has changed. */
    nodeId: NodeId;
    /** A ttribute name. */
    name: string;
  };
  export type attributeRemoved_Handler = (params: attributeRemoved_Parameters) => void;
  export type inlineStyleInvalidated_Parameters = {
    /** Ids of the nodes for which the inline styles have been invalidated. */
    nodeIds: NodeId[];
  };
  export type inlineStyleInvalidated_Handler = (params: inlineStyleInvalidated_Parameters) => void;
  export type characterDataModified_Parameters = {
    /** Id of the node that has changed. */
    nodeId: NodeId;
    /** New text value. */
    characterData: string;
  };
  export type characterDataModified_Handler = (params: characterDataModified_Parameters) => void;
  export type childNodeCountUpdated_Parameters = {
    /** Id of the node that has changed. */
    nodeId: NodeId;
    /** New node count. */
    childNodeCount: number;
  };
  export type childNodeCountUpdated_Handler = (params: childNodeCountUpdated_Parameters) => void;
  export type childNodeInserted_Parameters = {
    /** Id of the node that has changed. */
    parentNodeId: NodeId;
    /** If of the previous siblint. */
    previousNodeId: NodeId;
    /** Inserted node data. */
    node: Node;
  };
  export type childNodeInserted_Handler = (params: childNodeInserted_Parameters) => void;
  export type childNodeRemoved_Parameters = {
    /** Parent id. */
    parentNodeId: NodeId;
    /** Id of the node that has been removed. */
    nodeId: NodeId;
  };
  export type childNodeRemoved_Handler = (params: childNodeRemoved_Parameters) => void;
  export type shadowRootPushed_Parameters = {
    /** Host element id. */
    hostId: NodeId;
    /** Shadow root. */
    root: Node;
  };
  export type shadowRootPushed_Handler = (params: shadowRootPushed_Parameters) => void;
  export type shadowRootPopped_Parameters = {
    /** Host element id. */
    hostId: NodeId;
    /** Shadow root id. */
    rootId: NodeId;
  };
  export type shadowRootPopped_Handler = (params: shadowRootPopped_Parameters) => void;
  export type pseudoElementAdded_Parameters = {
    /** Pseudo element's parent element id. */
    parentId: NodeId;
    /** The added pseudo element. */
    pseudoElement: Node;
  };
  export type pseudoElementAdded_Handler = (params: pseudoElementAdded_Parameters) => void;
  export type pseudoElementRemoved_Parameters = {
    /** Pseudo element's parent element id. */
    parentId: NodeId;
    /** The removed pseudo element id. */
    pseudoElementId: NodeId;
  };
  export type pseudoElementRemoved_Handler = (params: pseudoElementRemoved_Parameters) => void;
  export type distributedNodesUpdated_Parameters = {
    /** Insertion point where distrubuted nodes were updated. */
    insertionPointId: NodeId;
    /** Distributed nodes for given insertion point. */
    distributedNodes: BackendNode[];
  };
  export type distributedNodesUpdated_Handler = (params: distributedNodesUpdated_Parameters) => void;
  export type nodeHighlightRequested_Parameters = {
    nodeId: NodeId;
  };
  export type nodeHighlightRequested_Handler = (params: nodeHighlightRequested_Parameters) => void;
  export type getDocument_Parameters = {
    /** The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the entire subtree or provide an integer larger than 0. */
    depth?: number;
    /** Whether or not iframes and shadow roots should be traversed when returning the subtree (default is false). */
    pierce?: boolean;
  };
  export type getDocument_Return = {
    /** Resulting node. */
    root: Node;
  };
  export type getFlattenedDocument_Parameters = {
    /** The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the entire subtree or provide an integer larger than 0. */
    depth?: number;
    /** Whether or not iframes and shadow roots should be traversed when returning the subtree (default is false). */
    pierce?: boolean;
  };
  export type getFlattenedDocument_Return = {
    /** Resulting node. */
    nodes: Node[];
  };
  export type collectClassNamesFromSubtree_Parameters = {
    /** Id of the node to collect class names. */
    nodeId: NodeId;
  };
  export type collectClassNamesFromSubtree_Return = {
    /** Class name list. */
    classNames: string[];
  };
  export type requestChildNodes_Parameters = {
    /** Id of the node to get children for. */
    nodeId: NodeId;
    /** The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the entire subtree or provide an integer larger than 0. */
    depth?: number;
    /** Whether or not iframes and shadow roots should be traversed when returning the sub-tree (default is false). */
    pierce?: boolean;
  };
  export type querySelector_Parameters = {
    /** Id of the node to query upon. */
    nodeId: NodeId;
    /** Selector string. */
    selector: string;
  };
  export type querySelector_Return = {
    /** Query selector result. */
    nodeId: NodeId;
  };
  export type querySelectorAll_Parameters = {
    /** Id of the node to query upon. */
    nodeId: NodeId;
    /** Selector string. */
    selector: string;
  };
  export type querySelectorAll_Return = {
    /** Query selector result. */
    nodeIds: NodeId[];
  };
  export type setNodeName_Parameters = {
    /** Id of the node to set name for. */
    nodeId: NodeId;
    /** New node's name. */
    name: string;
  };
  export type setNodeName_Return = {
    /** New node's id. */
    nodeId: NodeId;
  };
  export type setNodeValue_Parameters = {
    /** Id of the node to set value for. */
    nodeId: NodeId;
    /** New node's value. */
    value: string;
  };
  export type removeNode_Parameters = {
    /** Id of the node to remove. */
    nodeId: NodeId;
  };
  export type setAttributeValue_Parameters = {
    /** Id of the element to set attribute for. */
    nodeId: NodeId;
    /** Attribute name. */
    name: string;
    /** Attribute value. */
    value: string;
  };
  export type setAttributesAsText_Parameters = {
    /** Id of the element to set attributes for. */
    nodeId: NodeId;
    /** Text with a number of attributes. Will parse this text using HTML parser. */
    text: string;
    /** Attribute name to replace with new attributes derived from text in case text parsed successfully. */
    name?: string;
  };
  export type removeAttribute_Parameters = {
    /** Id of the element to remove attribute from. */
    nodeId: NodeId;
    /** Name of the attribute to remove. */
    name: string;
  };
  export type getOuterHTML_Parameters = {
    /** Id of the node to get markup for. */
    nodeId: NodeId;
  };
  export type getOuterHTML_Return = {
    /** Outer HTML markup. */
    outerHTML: string;
  };
  export type setOuterHTML_Parameters = {
    /** Id of the node to set markup for. */
    nodeId: NodeId;
    /** Outer HTML markup to set. */
    outerHTML: string;
  };
  export type performSearch_Parameters = {
    /** Plain text or query selector or XPath search query. */
    query: string;
    /** True to search in user agent shadow DOM. */
    includeUserAgentShadowDOM?: boolean;
  };
  export type performSearch_Return = {
    /** Unique search session identifier. */
    searchId: string;
    /** Number of search results. */
    resultCount: number;
  };
  export type getSearchResults_Parameters = {
    /** Unique search session identifier. */
    searchId: string;
    /** Start index of the search result to be returned. */
    fromIndex: number;
    /** End index of the search result to be returned. */
    toIndex: number;
  };
  export type getSearchResults_Return = {
    /** Ids of the search result nodes. */
    nodeIds: NodeId[];
  };
  export type discardSearchResults_Parameters = {
    /** Unique search session identifier. */
    searchId: string;
  };
  export type requestNode_Parameters = {
    /** JavaScript object id to convert into node. */
    objectId: Runtime.RemoteObjectId;
  };
  export type requestNode_Return = {
    /** Node id for given object. */
    nodeId: NodeId;
  };
  export type setInspectMode_Parameters = {
    /** Set an inspection mode. */
    mode: InspectMode;
    /** A descriptor for the highlight appearance of hovered-over nodes. May be omitted if <code>enabled == false</code>. */
    highlightConfig?: HighlightConfig;
  };
  export type highlightRect_Parameters = {
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
  export type highlightQuad_Parameters = {
    /** Quad to highlight */
    quad: Quad;
    /** The highlight fill color (default: transparent). */
    color?: RGBA;
    /** The highlight outline color (default: transparent). */
    outlineColor?: RGBA;
  };
  export type highlightNode_Parameters = {
    /** A descriptor for the highlight appearance. */
    highlightConfig: HighlightConfig;
    /** Identifier of the node to highlight. */
    nodeId?: NodeId;
    /** Identifier of the backend node to highlight. */
    backendNodeId?: BackendNodeId;
    /** JavaScript object id of the node to be highlighted. */
    objectId?: Runtime.RemoteObjectId;
  };
  export type highlightFrame_Parameters = {
    /** Identifier of the frame to highlight. */
    frameId: Page.FrameId;
    /** The content box highlight fill color (default: transparent). */
    contentColor?: RGBA;
    /** The content box highlight outline color (default: transparent). */
    contentOutlineColor?: RGBA;
  };
  export type pushNodeByPathToFrontend_Parameters = {
    /** Path to node in the proprietary format. */
    path: string;
  };
  export type pushNodeByPathToFrontend_Return = {
    /** Id of the node for given path. */
    nodeId: NodeId;
  };
  export type pushNodesByBackendIdsToFrontend_Parameters = {
    /** The array of backend node ids. */
    backendNodeIds: BackendNodeId[];
  };
  export type pushNodesByBackendIdsToFrontend_Return = {
    /** The array of ids of pushed nodes that correspond to the backend ids specified in backendNodeIds. */
    nodeIds: NodeId[];
  };
  export type setInspectedNode_Parameters = {
    /** DOM node id to be accessible by means of $x command line API. */
    nodeId: NodeId;
  };
  export type resolveNode_Parameters = {
    /** Id of the node to resolve. */
    nodeId: NodeId;
    /** Symbolic group name that can be used to release multiple objects. */
    objectGroup?: string;
  };
  export type resolveNode_Return = {
    /** JavaScript object wrapper for given node. */
    object: Runtime.RemoteObject;
  };
  export type getAttributes_Parameters = {
    /** Id of the node to retrieve attibutes for. */
    nodeId: NodeId;
  };
  export type getAttributes_Return = {
    /** An interleaved array of node attribute names and values. */
    attributes: string[];
  };
  export type copyTo_Parameters = {
    /** Id of the node to copy. */
    nodeId: NodeId;
    /** Id of the element to drop the copy into. */
    targetNodeId: NodeId;
    /** Drop the copy before this node (if absent, the copy becomes the last child of <code>targetNodeId</code>). */
    insertBeforeNodeId?: NodeId;
  };
  export type copyTo_Return = {
    /** Id of the node clone. */
    nodeId: NodeId;
  };
  export type moveTo_Parameters = {
    /** Id of the node to move. */
    nodeId: NodeId;
    /** Id of the element to drop the moved node into. */
    targetNodeId: NodeId;
    /** Drop node before this one (if absent, the moved node becomes the last child of <code>targetNodeId</code>). */
    insertBeforeNodeId?: NodeId;
  };
  export type moveTo_Return = {
    /** New id of the moved node. */
    nodeId: NodeId;
  };
  export type focus_Parameters = {
    /** Id of the node to focus. */
    nodeId: NodeId;
  };
  export type setFileInputFiles_Parameters = {
    /** Id of the file input node to set files for. */
    nodeId: NodeId;
    /** Array of file paths to set. */
    files: string[];
  };
  export type getBoxModel_Parameters = {
    /** Id of the node to get box model for. */
    nodeId: NodeId;
  };
  export type getBoxModel_Return = {
    /** Box model for the node. */
    model: BoxModel;
  };
  export type getNodeForLocation_Parameters = {
    /** X coordinate. */
    x: number;
    /** Y coordinate. */
    y: number;
    /** False to skip to the nearest non-UA shadow root ancestor (default: false). */
    includeUserAgentShadowDOM?: boolean;
  };
  export type getNodeForLocation_Return = {
    /** Id of the node at given coordinates. */
    nodeId: NodeId;
  };
  export type getRelayoutBoundary_Parameters = {
    /** Id of the node. */
    nodeId: NodeId;
  };
  export type getRelayoutBoundary_Return = {
    /** Relayout boundary node id for the given node. */
    nodeId: NodeId;
  };
  export type getHighlightObjectForTest_Parameters = {
    /** Id of the node to get highlight object for. */
    nodeId: NodeId;
  };
  export type getHighlightObjectForTest_Return = {
    /** Highlight data for the node. */
    highlight: any;
  };
}
/** This domain exposes CSS read/write operations. All CSS objects (stylesheets, rules, and styles) have an associated <code>id</code> used in subsequent operations on the related object. Each object type has a specific <code>id</code> structure, and those are not interchangeable between objects of different kinds. CSS objects can be loaded using the <code>get*ForNode()</code> calls (which accept a DOM node id). A client can also discover all the existing stylesheets with the <code>getAllStyleSheets()</code> method (or keeping track of the <code>styleSheetAdded</code>/<code>styleSheetRemoved</code> events) and subsequently load the required stylesheet contents using the <code>getStyleSheet[Text]()</code> methods. */
export class CSS {
  private _mediaQueryResultChanged: CSS.mediaQueryResultChanged_Handler = undefined;
  private _fontsUpdated: CSS.fontsUpdated_Handler = undefined;
  private _styleSheetChanged: CSS.styleSheetChanged_Handler = undefined;
  private _styleSheetAdded: CSS.styleSheetAdded_Handler = undefined;
  private _styleSheetRemoved: CSS.styleSheetRemoved_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables the CSS agent for the given page. Clients should not assume that the CSS agent has been enabled until the result of this command is received. */
  enable(): Promise<void> {
    return this._client.send<void>("CSS.enable");
  }
  /** Disables the CSS agent for the given page. */
  disable(): Promise<void> {
    return this._client.send<void>("CSS.disable");
  }
  /** Returns requested styles for a DOM node identified by <code>nodeId</code>. */
  getMatchedStylesForNode(params: CSS.getMatchedStylesForNode_Parameters): Promise<CSS.getMatchedStylesForNode_Return> {
    return this._client.send<CSS.getMatchedStylesForNode_Return>("CSS.getMatchedStylesForNode", params);
  }
  /** Returns the styles defined inline (explicitly in the "style" attribute and implicitly, using DOM attributes) for a DOM node identified by <code>nodeId</code>. */
  getInlineStylesForNode(params: CSS.getInlineStylesForNode_Parameters): Promise<CSS.getInlineStylesForNode_Return> {
    return this._client.send<CSS.getInlineStylesForNode_Return>("CSS.getInlineStylesForNode", params);
  }
  /** Returns the computed style for a DOM node identified by <code>nodeId</code>. */
  getComputedStyleForNode(params: CSS.getComputedStyleForNode_Parameters): Promise<CSS.getComputedStyleForNode_Return> {
    return this._client.send<CSS.getComputedStyleForNode_Return>("CSS.getComputedStyleForNode", params);
  }
  /** Requests information about platform fonts which we used to render child TextNodes in the given node. */
  getPlatformFontsForNode(params: CSS.getPlatformFontsForNode_Parameters): Promise<CSS.getPlatformFontsForNode_Return> {
    return this._client.send<CSS.getPlatformFontsForNode_Return>("CSS.getPlatformFontsForNode", params);
  }
  /** Returns the current textual content and the URL for a stylesheet. */
  getStyleSheetText(params: CSS.getStyleSheetText_Parameters): Promise<CSS.getStyleSheetText_Return> {
    return this._client.send<CSS.getStyleSheetText_Return>("CSS.getStyleSheetText", params);
  }
  /** Returns all class names from specified stylesheet. */
  collectClassNames(params: CSS.collectClassNames_Parameters): Promise<CSS.collectClassNames_Return> {
    return this._client.send<CSS.collectClassNames_Return>("CSS.collectClassNames", params);
  }
  /** Sets the new stylesheet text. */
  setStyleSheetText(params: CSS.setStyleSheetText_Parameters): Promise<CSS.setStyleSheetText_Return> {
    return this._client.send<CSS.setStyleSheetText_Return>("CSS.setStyleSheetText", params);
  }
  /** Modifies the rule selector. */
  setRuleSelector(params: CSS.setRuleSelector_Parameters): Promise<CSS.setRuleSelector_Return> {
    return this._client.send<CSS.setRuleSelector_Return>("CSS.setRuleSelector", params);
  }
  /** Modifies the keyframe rule key text. */
  setKeyframeKey(params: CSS.setKeyframeKey_Parameters): Promise<CSS.setKeyframeKey_Return> {
    return this._client.send<CSS.setKeyframeKey_Return>("CSS.setKeyframeKey", params);
  }
  /** Applies specified style edits one after another in the given order. */
  setStyleTexts(params: CSS.setStyleTexts_Parameters): Promise<CSS.setStyleTexts_Return> {
    return this._client.send<CSS.setStyleTexts_Return>("CSS.setStyleTexts", params);
  }
  /** Modifies the rule selector. */
  setMediaText(params: CSS.setMediaText_Parameters): Promise<CSS.setMediaText_Return> {
    return this._client.send<CSS.setMediaText_Return>("CSS.setMediaText", params);
  }
  /** Creates a new special "via-inspector" stylesheet in the frame with given <code>frameId</code>. */
  createStyleSheet(params: CSS.createStyleSheet_Parameters): Promise<CSS.createStyleSheet_Return> {
    return this._client.send<CSS.createStyleSheet_Return>("CSS.createStyleSheet", params);
  }
  /** Inserts a new rule with the given <code>ruleText</code> in a stylesheet with given <code>styleSheetId</code>, at the position specified by <code>location</code>. */
  addRule(params: CSS.addRule_Parameters): Promise<CSS.addRule_Return> {
    return this._client.send<CSS.addRule_Return>("CSS.addRule", params);
  }
  /** Ensures that the given node will have specified pseudo-classes whenever its style is computed by the browser. */
  forcePseudoState(params: CSS.forcePseudoState_Parameters): Promise<void> {
    return this._client.send<void>("CSS.forcePseudoState", params);
  }
  /** Returns all media queries parsed by the rendering engine. */
  getMediaQueries(): Promise<CSS.getMediaQueries_Return> {
    return this._client.send<CSS.getMediaQueries_Return>("CSS.getMediaQueries");
  }
  /** Find a rule with the given active property for the given node and set the new value for this property */
  setEffectivePropertyValueForNode(params: CSS.setEffectivePropertyValueForNode_Parameters): Promise<void> {
    return this._client.send<void>("CSS.setEffectivePropertyValueForNode", params);
  }
  getBackgroundColors(params: CSS.getBackgroundColors_Parameters): Promise<CSS.getBackgroundColors_Return> {
    return this._client.send<CSS.getBackgroundColors_Return>("CSS.getBackgroundColors", params);
  }
  /** For the main document and any content documents, return the LayoutTreeNodes and a whitelisted subset of the computed style. It only returns pushed nodes, on way to pull all nodes is to call DOM.getDocument with a depth of -1. */
  getLayoutTreeAndStyles(params: CSS.getLayoutTreeAndStyles_Parameters): Promise<CSS.getLayoutTreeAndStyles_Return> {
    return this._client.send<CSS.getLayoutTreeAndStyles_Return>("CSS.getLayoutTreeAndStyles", params);
  }
  /** Enables the selector recording. */
  startRuleUsageTracking(): Promise<void> {
    return this._client.send<void>("CSS.startRuleUsageTracking");
  }
  /** Obtain list of rules that became used since last call to this method (or since start of coverage instrumentation) */
  takeCoverageDelta(): Promise<CSS.takeCoverageDelta_Return> {
    return this._client.send<CSS.takeCoverageDelta_Return>("CSS.takeCoverageDelta");
  }
  /** The list of rules with an indication of whether these were used */
  stopRuleUsageTracking(): Promise<CSS.stopRuleUsageTracking_Return> {
    return this._client.send<CSS.stopRuleUsageTracking_Return>("CSS.stopRuleUsageTracking");
  }
  /** Fires whenever a MediaQuery result changes (for example, after a browser window has been resized.) The current implementation considers only viewport-dependent media features. */
  get mediaQueryResultChanged(): CSS.mediaQueryResultChanged_Handler {
    return this._mediaQueryResultChanged;
  }
  set mediaQueryResultChanged(handler: CSS.mediaQueryResultChanged_Handler) {
    if (this._mediaQueryResultChanged) {
      this._client.removeListener("CSS.mediaQueryResultChanged", this._mediaQueryResultChanged);
    }
    this._mediaQueryResultChanged = handler;
    if (handler) {
      this._client.on("CSS.mediaQueryResultChanged", handler);
    }
  }
  /** Fires whenever a web font gets loaded. */
  get fontsUpdated(): CSS.fontsUpdated_Handler {
    return this._fontsUpdated;
  }
  set fontsUpdated(handler: CSS.fontsUpdated_Handler) {
    if (this._fontsUpdated) {
      this._client.removeListener("CSS.fontsUpdated", this._fontsUpdated);
    }
    this._fontsUpdated = handler;
    if (handler) {
      this._client.on("CSS.fontsUpdated", handler);
    }
  }
  /** Fired whenever a stylesheet is changed as a result of the client operation. */
  get styleSheetChanged(): CSS.styleSheetChanged_Handler {
    return this._styleSheetChanged;
  }
  set styleSheetChanged(handler: CSS.styleSheetChanged_Handler) {
    if (this._styleSheetChanged) {
      this._client.removeListener("CSS.styleSheetChanged", this._styleSheetChanged);
    }
    this._styleSheetChanged = handler;
    if (handler) {
      this._client.on("CSS.styleSheetChanged", handler);
    }
  }
  /** Fired whenever an active document stylesheet is added. */
  get styleSheetAdded(): CSS.styleSheetAdded_Handler {
    return this._styleSheetAdded;
  }
  set styleSheetAdded(handler: CSS.styleSheetAdded_Handler) {
    if (this._styleSheetAdded) {
      this._client.removeListener("CSS.styleSheetAdded", this._styleSheetAdded);
    }
    this._styleSheetAdded = handler;
    if (handler) {
      this._client.on("CSS.styleSheetAdded", handler);
    }
  }
  /** Fired whenever an active document stylesheet is removed. */
  get styleSheetRemoved(): CSS.styleSheetRemoved_Handler {
    return this._styleSheetRemoved;
  }
  set styleSheetRemoved(handler: CSS.styleSheetRemoved_Handler) {
    if (this._styleSheetRemoved) {
      this._client.removeListener("CSS.styleSheetRemoved", this._styleSheetRemoved);
    }
    this._styleSheetRemoved = handler;
    if (handler) {
      this._client.on("CSS.styleSheetRemoved", handler);
    }
  }
}
export namespace CSS {
  export type StyleSheetId = string;
  /** Stylesheet type: "injected" for stylesheets injected via extension, "user-agent" for user-agent stylesheets, "inspector" for stylesheets created by the inspector (i.e. those holding the "via inspector" rules), "regular" for regular stylesheets. */
  export type StyleSheetOrigin = "injected" | "user-agent" | "inspector" | "regular";
  /** CSS rule collection for a single pseudo style. */
  export interface PseudoElementMatches {
    /** Pseudo element type. */
    pseudoType: DOM.PseudoType;
    /** Matches of CSS rules applicable to the pseudo style. */
    matches: RuleMatch[];
  }
  /** Inherited CSS rule collection from ancestor node. */
  export interface InheritedStyleEntry {
    /** The ancestor node's inline style, if any, in the style inheritance chain. */
    inlineStyle?: CSSStyle;
    /** Matches of CSS rules matching the ancestor node in the style inheritance chain. */
    matchedCSSRules: RuleMatch[];
  }
  /** Match data for a CSS rule. */
  export interface RuleMatch {
    /** CSS rule in the match. */
    rule: CSSRule;
    /** Matching selector indices in the rule's selectorList selectors (0-based). */
    matchingSelectors: number[];
  }
  /** Data for a simple selector (these are delimited by commas in a selector list). */
  export interface Value {
    /** Value text. */
    text: string;
    /** Value range in the underlying resource (if available). */
    range?: SourceRange;
  }
  /** Selector list data. */
  export interface SelectorList {
    /** Selectors in the list. */
    selectors: Value[];
    /** Rule selector text. */
    text: string;
  }
  /** CSS stylesheet metainformation. */
  export interface CSSStyleSheetHeader {
    /** The stylesheet identifier. */
    styleSheetId: StyleSheetId;
    /** Owner frame identifier. */
    frameId: Page.FrameId;
    /** Stylesheet resource URL. */
    sourceURL: string;
    /** URL of source map associated with the stylesheet (if any). */
    sourceMapURL?: string;
    /** Stylesheet origin. */
    origin: StyleSheetOrigin;
    /** Stylesheet title. */
    title: string;
    /** The backend id for the owner node of the stylesheet. */
    ownerNode?: DOM.BackendNodeId;
    /** Denotes whether the stylesheet is disabled. */
    disabled: boolean;
    /** Whether the sourceURL field value comes from the sourceURL comment. */
    hasSourceURL?: boolean;
    /** Whether this stylesheet is created for STYLE tag by parser. This flag is not set for document.written STYLE tags. */
    isInline: boolean;
    /** Line offset of the stylesheet within the resource (zero based). */
    startLine: number;
    /** Column offset of the stylesheet within the resource (zero based). */
    startColumn: number;
    /** Size of the content (in characters). */
    length: number;
  }
  /** CSS rule representation. */
  export interface CSSRule {
    /** The css style sheet identifier (absent for user agent stylesheet and user-specified stylesheet rules) this rule came from. */
    styleSheetId?: StyleSheetId;
    /** Rule selector data. */
    selectorList: SelectorList;
    /** Parent stylesheet's origin. */
    origin: StyleSheetOrigin;
    /** Associated style declaration. */
    style: CSSStyle;
    /** Media list array (for rules involving media queries). The array enumerates media queries starting with the innermost one, going outwards. */
    media?: CSSMedia[];
  }
  /** CSS coverage information. */
  export interface RuleUsage {
    /** The css style sheet identifier (absent for user agent stylesheet and user-specified stylesheet rules) this rule came from. */
    styleSheetId: StyleSheetId;
    /** Offset of the start of the rule (including selector) from the beginning of the stylesheet. */
    startOffset: number;
    /** Offset of the end of the rule body from the beginning of the stylesheet. */
    endOffset: number;
    /** Indicates whether the rule was actually used by some element in the page. */
    used: boolean;
  }
  /** Text range within a resource. All numbers are zero-based. */
  export interface SourceRange {
    /** Start line of range. */
    startLine: number;
    /** Start column of range (inclusive). */
    startColumn: number;
    /** End line of range */
    endLine: number;
    /** End column of range (exclusive). */
    endColumn: number;
  }
  export interface ShorthandEntry {
    /** Shorthand name. */
    name: string;
    /** Shorthand value. */
    value: string;
    /** Whether the property has "!important" annotation (implies <code>false</code> if absent). */
    important?: boolean;
  }
  export interface CSSComputedStyleProperty {
    /** Computed style property name. */
    name: string;
    /** Computed style property value. */
    value: string;
  }
  /** CSS style representation. */
  export interface CSSStyle {
    /** The css style sheet identifier (absent for user agent stylesheet and user-specified stylesheet rules) this rule came from. */
    styleSheetId?: StyleSheetId;
    /** CSS properties in the style. */
    cssProperties: CSSProperty[];
    /** Computed values for all shorthands found in the style. */
    shorthandEntries: ShorthandEntry[];
    /** Style declaration text (if available). */
    cssText?: string;
    /** Style declaration range in the enclosing stylesheet (if available). */
    range?: SourceRange;
  }
  /** CSS property declaration data. */
  export interface CSSProperty {
    /** The property name. */
    name: string;
    /** The property value. */
    value: string;
    /** Whether the property has "!important" annotation (implies <code>false</code> if absent). */
    important?: boolean;
    /** Whether the property is implicit (implies <code>false</code> if absent). */
    implicit?: boolean;
    /** The full property text as specified in the style. */
    text?: string;
    /** Whether the property is understood by the browser (implies <code>true</code> if absent). */
    parsedOk?: boolean;
    /** Whether the property is disabled by the user (present for source-based properties only). */
    disabled?: boolean;
    /** The entire property range in the enclosing style declaration (if available). */
    range?: SourceRange;
  }
  /** CSS media rule descriptor. */
  export interface CSSMedia {
    /** Media query text. */
    text: string;
    /** Source of the media query: "mediaRule" if specified by a @media rule, "importRule" if specified by an @import rule, "linkedSheet" if specified by a "media" attribute in a linked stylesheet's LINK tag, "inlineSheet" if specified by a "media" attribute in an inline stylesheet's STYLE tag. */
    source: "mediaRule" | "importRule" | "linkedSheet" | "inlineSheet";
    /** URL of the document containing the media query description. */
    sourceURL?: string;
    /** The associated rule (@media or @import) header range in the enclosing stylesheet (if available). */
    range?: SourceRange;
    /** Identifier of the stylesheet containing this object (if exists). */
    styleSheetId?: StyleSheetId;
    /** Array of media queries. */
    mediaList?: MediaQuery[];
  }
  /** Media query descriptor. */
  export interface MediaQuery {
    /** Array of media query expressions. */
    expressions: MediaQueryExpression[];
    /** Whether the media query condition is satisfied. */
    active: boolean;
  }
  /** Media query expression descriptor. */
  export interface MediaQueryExpression {
    /** Media query expression value. */
    value: number;
    /** Media query expression units. */
    unit: string;
    /** Media query expression feature. */
    feature: string;
    /** The associated range of the value text in the enclosing stylesheet (if available). */
    valueRange?: SourceRange;
    /** Computed length of media query expression (if applicable). */
    computedLength?: number;
  }
  /** Information about amount of glyphs that were rendered with given font. */
  export interface PlatformFontUsage {
    /** Font's family name reported by platform. */
    familyName: string;
    /** Indicates if the font was downloaded or resolved locally. */
    isCustomFont: boolean;
    /** Amount of glyphs that were rendered with this font. */
    glyphCount: number;
  }
  /** CSS keyframes rule representation. */
  export interface CSSKeyframesRule {
    /** Animation name. */
    animationName: Value;
    /** List of keyframes. */
    keyframes: CSSKeyframeRule[];
  }
  /** CSS keyframe rule representation. */
  export interface CSSKeyframeRule {
    /** The css style sheet identifier (absent for user agent stylesheet and user-specified stylesheet rules) this rule came from. */
    styleSheetId?: StyleSheetId;
    /** Parent stylesheet's origin. */
    origin: StyleSheetOrigin;
    /** Associated key text. */
    keyText: Value;
    /** Associated style declaration. */
    style: CSSStyle;
  }
  /** A descriptor of operation to mutate style declaration text. */
  export interface StyleDeclarationEdit {
    /** The css style sheet identifier. */
    styleSheetId: StyleSheetId;
    /** The range of the style text in the enclosing stylesheet. */
    range: SourceRange;
    /** New style text. */
    text: string;
  }
  /** Details of post layout rendered text positions. The exact layout should not be regarded as stable and may change between versions. */
  export interface InlineTextBox {
    /** The absolute position bounding box. */
    boundingBox: DOM.Rect;
    /** The starting index in characters, for this post layout textbox substring. */
    startCharacterIndex: number;
    /** The number of characters in this post layout textbox substring. */
    numCharacters: number;
  }
  /** Details of an element in the DOM tree with a LayoutObject. */
  export interface LayoutTreeNode {
    /** The id of the related DOM node matching one from DOM.GetDocument. */
    nodeId: DOM.NodeId;
    /** The absolute position bounding box. */
    boundingBox: DOM.Rect;
    /** Contents of the LayoutText if any */
    layoutText?: string;
    /** The post layout inline text nodes, if any. */
    inlineTextNodes?: InlineTextBox[];
    /** Index into the computedStyles array returned by getLayoutTreeAndStyles. */
    styleIndex?: number;
  }
  /** A subset of the full ComputedStyle as defined by the request whitelist. */
  export interface ComputedStyle {
    properties: CSSComputedStyleProperty[];
  }
  export type mediaQueryResultChanged_Handler = () => void;
  export type fontsUpdated_Handler = () => void;
  export type styleSheetChanged_Parameters = {
    styleSheetId: StyleSheetId;
  };
  export type styleSheetChanged_Handler = (params: styleSheetChanged_Parameters) => void;
  export type styleSheetAdded_Parameters = {
    /** Added stylesheet metainfo. */
    header: CSSStyleSheetHeader;
  };
  export type styleSheetAdded_Handler = (params: styleSheetAdded_Parameters) => void;
  export type styleSheetRemoved_Parameters = {
    /** Identifier of the removed stylesheet. */
    styleSheetId: StyleSheetId;
  };
  export type styleSheetRemoved_Handler = (params: styleSheetRemoved_Parameters) => void;
  export type getMatchedStylesForNode_Parameters = {
    nodeId: DOM.NodeId;
  };
  export type getMatchedStylesForNode_Return = {
    /** Inline style for the specified DOM node. */
    inlineStyle?: CSSStyle;
    /** Attribute-defined element style (e.g. resulting from "width=20 height=100%"). */
    attributesStyle?: CSSStyle;
    /** CSS rules matching this node, from all applicable stylesheets. */
    matchedCSSRules?: RuleMatch[];
    /** Pseudo style matches for this node. */
    pseudoElements?: PseudoElementMatches[];
    /** A chain of inherited styles (from the immediate node parent up to the DOM tree root). */
    inherited?: InheritedStyleEntry[];
    /** A list of CSS keyframed animations matching this node. */
    cssKeyframesRules?: CSSKeyframesRule[];
  };
  export type getInlineStylesForNode_Parameters = {
    nodeId: DOM.NodeId;
  };
  export type getInlineStylesForNode_Return = {
    /** Inline style for the specified DOM node. */
    inlineStyle?: CSSStyle;
    /** Attribute-defined element style (e.g. resulting from "width=20 height=100%"). */
    attributesStyle?: CSSStyle;
  };
  export type getComputedStyleForNode_Parameters = {
    nodeId: DOM.NodeId;
  };
  export type getComputedStyleForNode_Return = {
    /** Computed style for the specified DOM node. */
    computedStyle: CSSComputedStyleProperty[];
  };
  export type getPlatformFontsForNode_Parameters = {
    nodeId: DOM.NodeId;
  };
  export type getPlatformFontsForNode_Return = {
    /** Usage statistics for every employed platform font. */
    fonts: PlatformFontUsage[];
  };
  export type getStyleSheetText_Parameters = {
    styleSheetId: StyleSheetId;
  };
  export type getStyleSheetText_Return = {
    /** The stylesheet text. */
    text: string;
  };
  export type collectClassNames_Parameters = {
    styleSheetId: StyleSheetId;
  };
  export type collectClassNames_Return = {
    /** Class name list. */
    classNames: string[];
  };
  export type setStyleSheetText_Parameters = {
    styleSheetId: StyleSheetId;
    text: string;
  };
  export type setStyleSheetText_Return = {
    /** URL of source map associated with script (if any). */
    sourceMapURL?: string;
  };
  export type setRuleSelector_Parameters = {
    styleSheetId: StyleSheetId;
    range: SourceRange;
    selector: string;
  };
  export type setRuleSelector_Return = {
    /** The resulting selector list after modification. */
    selectorList: SelectorList;
  };
  export type setKeyframeKey_Parameters = {
    styleSheetId: StyleSheetId;
    range: SourceRange;
    keyText: string;
  };
  export type setKeyframeKey_Return = {
    /** The resulting key text after modification. */
    keyText: Value;
  };
  export type setStyleTexts_Parameters = {
    edits: StyleDeclarationEdit[];
  };
  export type setStyleTexts_Return = {
    /** The resulting styles after modification. */
    styles: CSSStyle[];
  };
  export type setMediaText_Parameters = {
    styleSheetId: StyleSheetId;
    range: SourceRange;
    text: string;
  };
  export type setMediaText_Return = {
    /** The resulting CSS media rule after modification. */
    media: CSSMedia;
  };
  export type createStyleSheet_Parameters = {
    /** Identifier of the frame where "via-inspector" stylesheet should be created. */
    frameId: Page.FrameId;
  };
  export type createStyleSheet_Return = {
    /** Identifier of the created "via-inspector" stylesheet. */
    styleSheetId: StyleSheetId;
  };
  export type addRule_Parameters = {
    /** The css style sheet identifier where a new rule should be inserted. */
    styleSheetId: StyleSheetId;
    /** The text of a new rule. */
    ruleText: string;
    /** Text position of a new rule in the target style sheet. */
    location: SourceRange;
  };
  export type addRule_Return = {
    /** The newly created rule. */
    rule: CSSRule;
  };
  export type forcePseudoState_Parameters = {
    /** The element id for which to force the pseudo state. */
    nodeId: DOM.NodeId;
    /** Element pseudo classes to force when computing the element's style. */
    forcedPseudoClasses: Array<"active" | "focus" | "hover" | "visited">;
  };
  export type getMediaQueries_Return = {
    medias: CSSMedia[];
  };
  export type setEffectivePropertyValueForNode_Parameters = {
    /** The element id for which to set property. */
    nodeId: DOM.NodeId;
    propertyName: string;
    value: string;
  };
  export type getBackgroundColors_Parameters = {
    /** Id of the node to get background colors for. */
    nodeId: DOM.NodeId;
  };
  export type getBackgroundColors_Return = {
    /** The range of background colors behind this element, if it contains any visible text. If no visible text is present, this will be undefined. In the case of a flat background color, this will consist of simply that color. In the case of a gradient, this will consist of each of the color stops. For anything more complicated, this will be an empty array. Images will be ignored (as if the image had failed to load). */
    backgroundColors?: string[];
  };
  export type getLayoutTreeAndStyles_Parameters = {
    /** Whitelist of computed styles to return. */
    computedStyleWhitelist: string[];
  };
  export type getLayoutTreeAndStyles_Return = {
    layoutTreeNodes: LayoutTreeNode[];
    computedStyles: ComputedStyle[];
  };
  export type takeCoverageDelta_Return = {
    coverage: RuleUsage[];
  };
  export type stopRuleUsageTracking_Return = {
    ruleUsage: RuleUsage[];
  };
}
/** Input/Output operations for streams produced by DevTools. */
export class IO {
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Read a chunk of the stream */
  read(params: IO.read_Parameters): Promise<IO.read_Return> {
    return this._client.send<IO.read_Return>("IO.read", params);
  }
  /** Close the stream, discard any temporary backing storage. */
  close(params: IO.close_Parameters): Promise<void> {
    return this._client.send<void>("IO.close", params);
  }
}
export namespace IO {
  export type StreamHandle = string;
  export type read_Parameters = {
    /** Handle of the stream to read. */
    handle: StreamHandle;
    /** Seek to the specified offset before reading (if not specificed, proceed with offset following the last read). */
    offset?: number;
    /** Maximum number of bytes to read (left upon the agent discretion if not specified). */
    size?: number;
  };
  export type read_Return = {
    /** Data that were read. */
    data: string;
    /** Set if the end-of-file condition occured while reading. */
    eof: boolean;
  };
  export type close_Parameters = {
    /** Handle of the stream to close. */
    handle: StreamHandle;
  };
}
/** DOM debugging allows setting breakpoints on particular DOM operations and events. JavaScript execution will stop on these operations as if there was a regular breakpoint set. */
export class DOMDebugger {
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Sets breakpoint on particular operation with DOM. */
  setDOMBreakpoint(params: DOMDebugger.setDOMBreakpoint_Parameters): Promise<void> {
    return this._client.send<void>("DOMDebugger.setDOMBreakpoint", params);
  }
  /** Removes DOM breakpoint that was set using <code>setDOMBreakpoint</code>. */
  removeDOMBreakpoint(params: DOMDebugger.removeDOMBreakpoint_Parameters): Promise<void> {
    return this._client.send<void>("DOMDebugger.removeDOMBreakpoint", params);
  }
  /** Sets breakpoint on particular DOM event. */
  setEventListenerBreakpoint(params: DOMDebugger.setEventListenerBreakpoint_Parameters): Promise<void> {
    return this._client.send<void>("DOMDebugger.setEventListenerBreakpoint", params);
  }
  /** Removes breakpoint on particular DOM event. */
  removeEventListenerBreakpoint(params: DOMDebugger.removeEventListenerBreakpoint_Parameters): Promise<void> {
    return this._client.send<void>("DOMDebugger.removeEventListenerBreakpoint", params);
  }
  /** Sets breakpoint on particular native event. */
  setInstrumentationBreakpoint(params: DOMDebugger.setInstrumentationBreakpoint_Parameters): Promise<void> {
    return this._client.send<void>("DOMDebugger.setInstrumentationBreakpoint", params);
  }
  /** Removes breakpoint on particular native event. */
  removeInstrumentationBreakpoint(params: DOMDebugger.removeInstrumentationBreakpoint_Parameters): Promise<void> {
    return this._client.send<void>("DOMDebugger.removeInstrumentationBreakpoint", params);
  }
  /** Sets breakpoint on XMLHttpRequest. */
  setXHRBreakpoint(params: DOMDebugger.setXHRBreakpoint_Parameters): Promise<void> {
    return this._client.send<void>("DOMDebugger.setXHRBreakpoint", params);
  }
  /** Removes breakpoint from XMLHttpRequest. */
  removeXHRBreakpoint(params: DOMDebugger.removeXHRBreakpoint_Parameters): Promise<void> {
    return this._client.send<void>("DOMDebugger.removeXHRBreakpoint", params);
  }
  /** Returns event listeners of the given object. */
  getEventListeners(params: DOMDebugger.getEventListeners_Parameters): Promise<DOMDebugger.getEventListeners_Return> {
    return this._client.send<DOMDebugger.getEventListeners_Return>("DOMDebugger.getEventListeners", params);
  }
}
export namespace DOMDebugger {
  /** DOM breakpoint type. */
  export type DOMBreakpointType = "subtree-modified" | "attribute-modified" | "node-removed";
  /** Object event listener. */
  export interface EventListener {
    /** <code>EventListener</code>'s type. */
    type: string;
    /** <code>EventListener</code>'s useCapture. */
    useCapture: boolean;
    /** <code>EventListener</code>'s passive flag. */
    passive: boolean;
    /** <code>EventListener</code>'s once flag. */
    once: boolean;
    /** Script id of the handler code. */
    scriptId: Runtime.ScriptId;
    /** Line number in the script (0-based). */
    lineNumber: number;
    /** Column number in the script (0-based). */
    columnNumber: number;
    /** Event handler function value. */
    handler?: Runtime.RemoteObject;
    /** Event original handler function value. */
    originalHandler?: Runtime.RemoteObject;
    /** Node the listener is added to (if any). */
    backendNodeId?: DOM.BackendNodeId;
  }
  export type setDOMBreakpoint_Parameters = {
    /** Identifier of the node to set breakpoint on. */
    nodeId: DOM.NodeId;
    /** Type of the operation to stop upon. */
    type: DOMBreakpointType;
  };
  export type removeDOMBreakpoint_Parameters = {
    /** Identifier of the node to remove breakpoint from. */
    nodeId: DOM.NodeId;
    /** Type of the breakpoint to remove. */
    type: DOMBreakpointType;
  };
  export type setEventListenerBreakpoint_Parameters = {
    /** DOM Event name to stop on (any DOM event will do). */
    eventName: string;
    /** EventTarget interface name to stop on. If equal to <code>"*"</code> or not provided, will stop on any EventTarget. */
    targetName?: string;
  };
  export type removeEventListenerBreakpoint_Parameters = {
    /** Event name. */
    eventName: string;
    /** EventTarget interface name. */
    targetName?: string;
  };
  export type setInstrumentationBreakpoint_Parameters = {
    /** Instrumentation name to stop on. */
    eventName: string;
  };
  export type removeInstrumentationBreakpoint_Parameters = {
    /** Instrumentation name to stop on. */
    eventName: string;
  };
  export type setXHRBreakpoint_Parameters = {
    /** Resource URL substring. All XHRs having this substring in the URL will get stopped upon. */
    url: string;
  };
  export type removeXHRBreakpoint_Parameters = {
    /** Resource URL substring. */
    url: string;
  };
  export type getEventListeners_Parameters = {
    /** Identifier of the object to return listeners for. */
    objectId: Runtime.RemoteObjectId;
    /** The maximum depth at which Node children should be retrieved, defaults to 1. Use -1 for the entire subtree or provide an integer larger than 0. */
    depth?: number;
    /** Whether or not iframes and shadow roots should be traversed when returning the subtree (default is false). Reports listeners for all contexts if pierce is enabled. */
    pierce?: boolean;
  };
  export type getEventListeners_Return = {
    /** Array of relevant listeners. */
    listeners: EventListener[];
  };
}
/** Supports additional targets discovery and allows to attach to them. */
export class Target {
  private _targetCreated: Target.targetCreated_Handler = undefined;
  private _targetDestroyed: Target.targetDestroyed_Handler = undefined;
  private _attachedToTarget: Target.attachedToTarget_Handler = undefined;
  private _detachedFromTarget: Target.detachedFromTarget_Handler = undefined;
  private _receivedMessageFromTarget: Target.receivedMessageFromTarget_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Controls whether to discover available targets and notify via <code>targetCreated/targetDestroyed</code> events. */
  setDiscoverTargets(params: Target.setDiscoverTargets_Parameters): Promise<void> {
    return this._client.send<void>("Target.setDiscoverTargets", params);
  }
  /** Controls whether to automatically attach to new targets which are considered to be related to this one. When turned on, attaches to all existing related targets as well. When turned off, automatically detaches from all currently attached targets. */
  setAutoAttach(params: Target.setAutoAttach_Parameters): Promise<void> {
    return this._client.send<void>("Target.setAutoAttach", params);
  }
  setAttachToFrames(params: Target.setAttachToFrames_Parameters): Promise<void> {
    return this._client.send<void>("Target.setAttachToFrames", params);
  }
  /** Enables target discovery for the specified locations, when <code>setDiscoverTargets</code> was set to <code>true</code>. */
  setRemoteLocations(params: Target.setRemoteLocations_Parameters): Promise<void> {
    return this._client.send<void>("Target.setRemoteLocations", params);
  }
  /** Sends protocol message to the target with given id. */
  sendMessageToTarget(params: Target.sendMessageToTarget_Parameters): Promise<void> {
    return this._client.send<void>("Target.sendMessageToTarget", params);
  }
  /** Returns information about a target. */
  getTargetInfo(params: Target.getTargetInfo_Parameters): Promise<Target.getTargetInfo_Return> {
    return this._client.send<Target.getTargetInfo_Return>("Target.getTargetInfo", params);
  }
  /** Activates (focuses) the target. */
  activateTarget(params: Target.activateTarget_Parameters): Promise<void> {
    return this._client.send<void>("Target.activateTarget", params);
  }
  /** Closes the target. If the target is a page that gets closed too. */
  closeTarget(params: Target.closeTarget_Parameters): Promise<Target.closeTarget_Return> {
    return this._client.send<Target.closeTarget_Return>("Target.closeTarget", params);
  }
  /** Attaches to the target with given id. */
  attachToTarget(params: Target.attachToTarget_Parameters): Promise<Target.attachToTarget_Return> {
    return this._client.send<Target.attachToTarget_Return>("Target.attachToTarget", params);
  }
  /** Detaches from the target with given id. */
  detachFromTarget(params: Target.detachFromTarget_Parameters): Promise<void> {
    return this._client.send<void>("Target.detachFromTarget", params);
  }
  /** Creates a new empty BrowserContext. Similar to an incognito profile but you can have more than one. */
  createBrowserContext(): Promise<Target.createBrowserContext_Return> {
    return this._client.send<Target.createBrowserContext_Return>("Target.createBrowserContext");
  }
  /** Deletes a BrowserContext, will fail of any open page uses it. */
  disposeBrowserContext(params: Target.disposeBrowserContext_Parameters): Promise<Target.disposeBrowserContext_Return> {
    return this._client.send<Target.disposeBrowserContext_Return>("Target.disposeBrowserContext", params);
  }
  /** Creates a new page. */
  createTarget(params: Target.createTarget_Parameters): Promise<Target.createTarget_Return> {
    return this._client.send<Target.createTarget_Return>("Target.createTarget", params);
  }
  /** Retrieves a list of available targets. */
  getTargets(): Promise<Target.getTargets_Return> {
    return this._client.send<Target.getTargets_Return>("Target.getTargets");
  }
  /** Issued when a possible inspection target is created. */
  get targetCreated(): Target.targetCreated_Handler {
    return this._targetCreated;
  }
  set targetCreated(handler: Target.targetCreated_Handler) {
    if (this._targetCreated) {
      this._client.removeListener("Target.targetCreated", this._targetCreated);
    }
    this._targetCreated = handler;
    if (handler) {
      this._client.on("Target.targetCreated", handler);
    }
  }
  /** Issued when a target is destroyed. */
  get targetDestroyed(): Target.targetDestroyed_Handler {
    return this._targetDestroyed;
  }
  set targetDestroyed(handler: Target.targetDestroyed_Handler) {
    if (this._targetDestroyed) {
      this._client.removeListener("Target.targetDestroyed", this._targetDestroyed);
    }
    this._targetDestroyed = handler;
    if (handler) {
      this._client.on("Target.targetDestroyed", handler);
    }
  }
  /** Issued when attached to target because of auto-attach or <code>attachToTarget</code> command. */
  get attachedToTarget(): Target.attachedToTarget_Handler {
    return this._attachedToTarget;
  }
  set attachedToTarget(handler: Target.attachedToTarget_Handler) {
    if (this._attachedToTarget) {
      this._client.removeListener("Target.attachedToTarget", this._attachedToTarget);
    }
    this._attachedToTarget = handler;
    if (handler) {
      this._client.on("Target.attachedToTarget", handler);
    }
  }
  /** Issued when detached from target for any reason (including <code>detachFromTarget</code> command). */
  get detachedFromTarget(): Target.detachedFromTarget_Handler {
    return this._detachedFromTarget;
  }
  set detachedFromTarget(handler: Target.detachedFromTarget_Handler) {
    if (this._detachedFromTarget) {
      this._client.removeListener("Target.detachedFromTarget", this._detachedFromTarget);
    }
    this._detachedFromTarget = handler;
    if (handler) {
      this._client.on("Target.detachedFromTarget", handler);
    }
  }
  /** Notifies about new protocol message from attached target. */
  get receivedMessageFromTarget(): Target.receivedMessageFromTarget_Handler {
    return this._receivedMessageFromTarget;
  }
  set receivedMessageFromTarget(handler: Target.receivedMessageFromTarget_Handler) {
    if (this._receivedMessageFromTarget) {
      this._client.removeListener("Target.receivedMessageFromTarget", this._receivedMessageFromTarget);
    }
    this._receivedMessageFromTarget = handler;
    if (handler) {
      this._client.on("Target.receivedMessageFromTarget", handler);
    }
  }
}
export namespace Target {
  export type TargetID = string;
  export type BrowserContextID = string;
  export interface TargetInfo {
    targetId: TargetID;
    type: string;
    title: string;
    url: string;
  }
  export interface RemoteLocation {
    host: string;
    port: number;
  }
  export type targetCreated_Parameters = {
    targetInfo: TargetInfo;
  };
  export type targetCreated_Handler = (params: targetCreated_Parameters) => void;
  export type targetDestroyed_Parameters = {
    targetId: TargetID;
  };
  export type targetDestroyed_Handler = (params: targetDestroyed_Parameters) => void;
  export type attachedToTarget_Parameters = {
    targetInfo: TargetInfo;
    waitingForDebugger: boolean;
  };
  export type attachedToTarget_Handler = (params: attachedToTarget_Parameters) => void;
  export type detachedFromTarget_Parameters = {
    targetId: TargetID;
  };
  export type detachedFromTarget_Handler = (params: detachedFromTarget_Parameters) => void;
  export type receivedMessageFromTarget_Parameters = {
    targetId: TargetID;
    message: string;
  };
  export type receivedMessageFromTarget_Handler = (params: receivedMessageFromTarget_Parameters) => void;
  export type setDiscoverTargets_Parameters = {
    /** Whether to discover available targets. */
    discover: boolean;
  };
  export type setAutoAttach_Parameters = {
    /** Whether to auto-attach to related targets. */
    autoAttach: boolean;
    /** Whether to pause new targets when attaching to them. Use <code>Runtime.runIfWaitingForDebugger</code> to run paused targets. */
    waitForDebuggerOnStart: boolean;
  };
  export type setAttachToFrames_Parameters = {
    /** Whether to attach to frames. */
    value: boolean;
  };
  export type setRemoteLocations_Parameters = {
    /** List of remote locations. */
    locations: RemoteLocation[];
  };
  export type sendMessageToTarget_Parameters = {
    targetId: string;
    message: string;
  };
  export type getTargetInfo_Parameters = {
    targetId: TargetID;
  };
  export type getTargetInfo_Return = {
    targetInfo: TargetInfo;
  };
  export type activateTarget_Parameters = {
    targetId: TargetID;
  };
  export type closeTarget_Parameters = {
    targetId: TargetID;
  };
  export type closeTarget_Return = {
    success: boolean;
  };
  export type attachToTarget_Parameters = {
    targetId: TargetID;
  };
  export type attachToTarget_Return = {
    /** Whether attach succeeded. */
    success: boolean;
  };
  export type detachFromTarget_Parameters = {
    targetId: TargetID;
  };
  export type createBrowserContext_Return = {
    /** The id of the context created. */
    browserContextId: BrowserContextID;
  };
  export type disposeBrowserContext_Parameters = {
    browserContextId: BrowserContextID;
  };
  export type disposeBrowserContext_Return = {
    success: boolean;
  };
  export type createTarget_Parameters = {
    /** The initial URL the page will be navigated to. */
    url: string;
    /** Frame width in DIP (headless chrome only). */
    width?: number;
    /** Frame height in DIP (headless chrome only). */
    height?: number;
    /** The browser context to create the page in (headless chrome only). */
    browserContextId?: BrowserContextID;
  };
  export type createTarget_Return = {
    /** The id of the page opened. */
    targetId: TargetID;
  };
  export type getTargets_Return = {
    /** The list of targets. */
    targetInfos: TargetInfo[];
  };
}
export class ServiceWorker {
  private _workerRegistrationUpdated: ServiceWorker.workerRegistrationUpdated_Handler = undefined;
  private _workerVersionUpdated: ServiceWorker.workerVersionUpdated_Handler = undefined;
  private _workerErrorReported: ServiceWorker.workerErrorReported_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  enable(): Promise<void> {
    return this._client.send<void>("ServiceWorker.enable");
  }
  disable(): Promise<void> {
    return this._client.send<void>("ServiceWorker.disable");
  }
  unregister(params: ServiceWorker.unregister_Parameters): Promise<void> {
    return this._client.send<void>("ServiceWorker.unregister", params);
  }
  updateRegistration(params: ServiceWorker.updateRegistration_Parameters): Promise<void> {
    return this._client.send<void>("ServiceWorker.updateRegistration", params);
  }
  startWorker(params: ServiceWorker.startWorker_Parameters): Promise<void> {
    return this._client.send<void>("ServiceWorker.startWorker", params);
  }
  skipWaiting(params: ServiceWorker.skipWaiting_Parameters): Promise<void> {
    return this._client.send<void>("ServiceWorker.skipWaiting", params);
  }
  stopWorker(params: ServiceWorker.stopWorker_Parameters): Promise<void> {
    return this._client.send<void>("ServiceWorker.stopWorker", params);
  }
  inspectWorker(params: ServiceWorker.inspectWorker_Parameters): Promise<void> {
    return this._client.send<void>("ServiceWorker.inspectWorker", params);
  }
  setForceUpdateOnPageLoad(params: ServiceWorker.setForceUpdateOnPageLoad_Parameters): Promise<void> {
    return this._client.send<void>("ServiceWorker.setForceUpdateOnPageLoad", params);
  }
  deliverPushMessage(params: ServiceWorker.deliverPushMessage_Parameters): Promise<void> {
    return this._client.send<void>("ServiceWorker.deliverPushMessage", params);
  }
  dispatchSyncEvent(params: ServiceWorker.dispatchSyncEvent_Parameters): Promise<void> {
    return this._client.send<void>("ServiceWorker.dispatchSyncEvent", params);
  }
  get workerRegistrationUpdated(): ServiceWorker.workerRegistrationUpdated_Handler {
    return this._workerRegistrationUpdated;
  }
  set workerRegistrationUpdated(handler: ServiceWorker.workerRegistrationUpdated_Handler) {
    if (this._workerRegistrationUpdated) {
      this._client.removeListener("ServiceWorker.workerRegistrationUpdated", this._workerRegistrationUpdated);
    }
    this._workerRegistrationUpdated = handler;
    if (handler) {
      this._client.on("ServiceWorker.workerRegistrationUpdated", handler);
    }
  }
  get workerVersionUpdated(): ServiceWorker.workerVersionUpdated_Handler {
    return this._workerVersionUpdated;
  }
  set workerVersionUpdated(handler: ServiceWorker.workerVersionUpdated_Handler) {
    if (this._workerVersionUpdated) {
      this._client.removeListener("ServiceWorker.workerVersionUpdated", this._workerVersionUpdated);
    }
    this._workerVersionUpdated = handler;
    if (handler) {
      this._client.on("ServiceWorker.workerVersionUpdated", handler);
    }
  }
  get workerErrorReported(): ServiceWorker.workerErrorReported_Handler {
    return this._workerErrorReported;
  }
  set workerErrorReported(handler: ServiceWorker.workerErrorReported_Handler) {
    if (this._workerErrorReported) {
      this._client.removeListener("ServiceWorker.workerErrorReported", this._workerErrorReported);
    }
    this._workerErrorReported = handler;
    if (handler) {
      this._client.on("ServiceWorker.workerErrorReported", handler);
    }
  }
}
export namespace ServiceWorker {
  /** ServiceWorker registration. */
  export interface ServiceWorkerRegistration {
    registrationId: string;
    scopeURL: string;
    isDeleted: boolean;
  }
  export type ServiceWorkerVersionRunningStatus = "stopped" | "starting" | "running" | "stopping";
  export type ServiceWorkerVersionStatus = "new" | "installing" | "installed" | "activating" | "activated" | "redundant";
  /** ServiceWorker version. */
  export interface ServiceWorkerVersion {
    versionId: string;
    registrationId: string;
    scriptURL: string;
    runningStatus: ServiceWorkerVersionRunningStatus;
    status: ServiceWorkerVersionStatus;
    /** The Last-Modified header value of the main script. */
    scriptLastModified?: number;
    /** The time at which the response headers of the main script were received from the server.  For cached script it is the last time the cache entry was validated. */
    scriptResponseTime?: number;
    controlledClients?: Target.TargetID[];
    targetId?: Target.TargetID;
  }
  /** ServiceWorker error message. */
  export interface ServiceWorkerErrorMessage {
    errorMessage: string;
    registrationId: string;
    versionId: string;
    sourceURL: string;
    lineNumber: number;
    columnNumber: number;
  }
  export type workerRegistrationUpdated_Parameters = {
    registrations: ServiceWorkerRegistration[];
  };
  export type workerRegistrationUpdated_Handler = (params: workerRegistrationUpdated_Parameters) => void;
  export type workerVersionUpdated_Parameters = {
    versions: ServiceWorkerVersion[];
  };
  export type workerVersionUpdated_Handler = (params: workerVersionUpdated_Parameters) => void;
  export type workerErrorReported_Parameters = {
    errorMessage: ServiceWorkerErrorMessage;
  };
  export type workerErrorReported_Handler = (params: workerErrorReported_Parameters) => void;
  export type unregister_Parameters = {
    scopeURL: string;
  };
  export type updateRegistration_Parameters = {
    scopeURL: string;
  };
  export type startWorker_Parameters = {
    scopeURL: string;
  };
  export type skipWaiting_Parameters = {
    scopeURL: string;
  };
  export type stopWorker_Parameters = {
    versionId: string;
  };
  export type inspectWorker_Parameters = {
    versionId: string;
  };
  export type setForceUpdateOnPageLoad_Parameters = {
    forceUpdateOnPageLoad: boolean;
  };
  export type deliverPushMessage_Parameters = {
    origin: string;
    registrationId: string;
    data: string;
  };
  export type dispatchSyncEvent_Parameters = {
    origin: string;
    registrationId: string;
    tag: string;
    lastChance: boolean;
  };
}
export class Input {
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Dispatches a key event to the page. */
  dispatchKeyEvent(params: Input.dispatchKeyEvent_Parameters): Promise<void> {
    return this._client.send<void>("Input.dispatchKeyEvent", params);
  }
  /** Dispatches a mouse event to the page. */
  dispatchMouseEvent(params: Input.dispatchMouseEvent_Parameters): Promise<void> {
    return this._client.send<void>("Input.dispatchMouseEvent", params);
  }
  /** Dispatches a touch event to the page. */
  dispatchTouchEvent(params: Input.dispatchTouchEvent_Parameters): Promise<void> {
    return this._client.send<void>("Input.dispatchTouchEvent", params);
  }
  /** Emulates touch event from the mouse event parameters. */
  emulateTouchFromMouseEvent(params: Input.emulateTouchFromMouseEvent_Parameters): Promise<void> {
    return this._client.send<void>("Input.emulateTouchFromMouseEvent", params);
  }
  /** Synthesizes a pinch gesture over a time period by issuing appropriate touch events. */
  synthesizePinchGesture(params: Input.synthesizePinchGesture_Parameters): Promise<void> {
    return this._client.send<void>("Input.synthesizePinchGesture", params);
  }
  /** Synthesizes a scroll gesture over a time period by issuing appropriate touch events. */
  synthesizeScrollGesture(params: Input.synthesizeScrollGesture_Parameters): Promise<void> {
    return this._client.send<void>("Input.synthesizeScrollGesture", params);
  }
  /** Synthesizes a tap gesture over a time period by issuing appropriate touch events. */
  synthesizeTapGesture(params: Input.synthesizeTapGesture_Parameters): Promise<void> {
    return this._client.send<void>("Input.synthesizeTapGesture", params);
  }
}
export namespace Input {
  export interface TouchPoint {
    /** State of the touch point. */
    state: "touchPressed" | "touchReleased" | "touchMoved" | "touchStationary" | "touchCancelled";
    /** X coordinate of the event relative to the main frame's viewport. */
    x: number;
    /** Y coordinate of the event relative to the main frame's viewport. 0 refers to the top of the viewport and Y increases as it proceeds towards the bottom of the viewport. */
    y: number;
    /** X radius of the touch area (default: 1). */
    radiusX?: number;
    /** Y radius of the touch area (default: 1). */
    radiusY?: number;
    /** Rotation angle (default: 0.0). */
    rotationAngle?: number;
    /** Force (default: 1.0). */
    force?: number;
    /** Identifier used to track touch sources between events, must be unique within an event. */
    id?: number;
  }
  export type GestureSourceType = "default" | "touch" | "mouse";
  export type dispatchKeyEvent_Parameters = {
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
  export type dispatchMouseEvent_Parameters = {
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
  export type dispatchTouchEvent_Parameters = {
    /** Type of the touch event. */
    type: "touchStart" | "touchEnd" | "touchMove";
    /** Touch points. */
    touchPoints: TouchPoint[];
    /** Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8 (default: 0). */
    modifiers?: number;
    /** Time at which the event occurred. Measured in UTC time in seconds since January 1, 1970 (default: current time). */
    timestamp?: number;
  };
  export type emulateTouchFromMouseEvent_Parameters = {
    /** Type of the mouse event. */
    type: "mousePressed" | "mouseReleased" | "mouseMoved" | "mouseWheel";
    /** X coordinate of the mouse pointer in DIP. */
    x: number;
    /** Y coordinate of the mouse pointer in DIP. */
    y: number;
    /** Time at which the event occurred. Measured in UTC time in seconds since January 1, 1970. */
    timestamp: number;
    /** Mouse button. */
    button: "none" | "left" | "middle" | "right";
    /** X delta in DIP for mouse wheel event (default: 0). */
    deltaX?: number;
    /** Y delta in DIP for mouse wheel event (default: 0). */
    deltaY?: number;
    /** Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8 (default: 0). */
    modifiers?: number;
    /** Number of times the mouse button was clicked (default: 0). */
    clickCount?: number;
  };
  export type synthesizePinchGesture_Parameters = {
    /** X coordinate of the start of the gesture in CSS pixels. */
    x: number;
    /** Y coordinate of the start of the gesture in CSS pixels. */
    y: number;
    /** Relative scale factor after zooming (>1.0 zooms in, <1.0 zooms out). */
    scaleFactor: number;
    /** Relative pointer speed in pixels per second (default: 800). */
    relativeSpeed?: number;
    /** Which type of input events to be generated (default: 'default', which queries the platform for the preferred input type). */
    gestureSourceType?: GestureSourceType;
  };
  export type synthesizeScrollGesture_Parameters = {
    /** X coordinate of the start of the gesture in CSS pixels. */
    x: number;
    /** Y coordinate of the start of the gesture in CSS pixels. */
    y: number;
    /** The distance to scroll along the X axis (positive to scroll left). */
    xDistance?: number;
    /** The distance to scroll along the Y axis (positive to scroll up). */
    yDistance?: number;
    /** The number of additional pixels to scroll back along the X axis, in addition to the given distance. */
    xOverscroll?: number;
    /** The number of additional pixels to scroll back along the Y axis, in addition to the given distance. */
    yOverscroll?: number;
    /** Prevent fling (default: true). */
    preventFling?: boolean;
    /** Swipe speed in pixels per second (default: 800). */
    speed?: number;
    /** Which type of input events to be generated (default: 'default', which queries the platform for the preferred input type). */
    gestureSourceType?: GestureSourceType;
    /** The number of times to repeat the gesture (default: 0). */
    repeatCount?: number;
    /** The number of milliseconds delay between each repeat. (default: 250). */
    repeatDelayMs?: number;
    /** The name of the interaction markers to generate, if not empty (default: ""). */
    interactionMarkerName?: string;
  };
  export type synthesizeTapGesture_Parameters = {
    /** X coordinate of the start of the gesture in CSS pixels. */
    x: number;
    /** Y coordinate of the start of the gesture in CSS pixels. */
    y: number;
    /** Duration between touchdown and touchup events in ms (default: 50). */
    duration?: number;
    /** Number of times to perform the tap (e.g. 2 for double tap, default: 1). */
    tapCount?: number;
    /** Which type of input events to be generated (default: 'default', which queries the platform for the preferred input type). */
    gestureSourceType?: GestureSourceType;
  };
}
export class LayerTree {
  private _layerTreeDidChange: LayerTree.layerTreeDidChange_Handler = undefined;
  private _layerPainted: LayerTree.layerPainted_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables compositing tree inspection. */
  enable(): Promise<void> {
    return this._client.send<void>("LayerTree.enable");
  }
  /** Disables compositing tree inspection. */
  disable(): Promise<void> {
    return this._client.send<void>("LayerTree.disable");
  }
  /** Provides the reasons why the given layer was composited. */
  compositingReasons(params: LayerTree.compositingReasons_Parameters): Promise<LayerTree.compositingReasons_Return> {
    return this._client.send<LayerTree.compositingReasons_Return>("LayerTree.compositingReasons", params);
  }
  /** Returns the layer snapshot identifier. */
  makeSnapshot(params: LayerTree.makeSnapshot_Parameters): Promise<LayerTree.makeSnapshot_Return> {
    return this._client.send<LayerTree.makeSnapshot_Return>("LayerTree.makeSnapshot", params);
  }
  /** Returns the snapshot identifier. */
  loadSnapshot(params: LayerTree.loadSnapshot_Parameters): Promise<LayerTree.loadSnapshot_Return> {
    return this._client.send<LayerTree.loadSnapshot_Return>("LayerTree.loadSnapshot", params);
  }
  /** Releases layer snapshot captured by the back-end. */
  releaseSnapshot(params: LayerTree.releaseSnapshot_Parameters): Promise<void> {
    return this._client.send<void>("LayerTree.releaseSnapshot", params);
  }
  profileSnapshot(params: LayerTree.profileSnapshot_Parameters): Promise<LayerTree.profileSnapshot_Return> {
    return this._client.send<LayerTree.profileSnapshot_Return>("LayerTree.profileSnapshot", params);
  }
  /** Replays the layer snapshot and returns the resulting bitmap. */
  replaySnapshot(params: LayerTree.replaySnapshot_Parameters): Promise<LayerTree.replaySnapshot_Return> {
    return this._client.send<LayerTree.replaySnapshot_Return>("LayerTree.replaySnapshot", params);
  }
  /** Replays the layer snapshot and returns canvas log. */
  snapshotCommandLog(params: LayerTree.snapshotCommandLog_Parameters): Promise<LayerTree.snapshotCommandLog_Return> {
    return this._client.send<LayerTree.snapshotCommandLog_Return>("LayerTree.snapshotCommandLog", params);
  }
  get layerTreeDidChange(): LayerTree.layerTreeDidChange_Handler {
    return this._layerTreeDidChange;
  }
  set layerTreeDidChange(handler: LayerTree.layerTreeDidChange_Handler) {
    if (this._layerTreeDidChange) {
      this._client.removeListener("LayerTree.layerTreeDidChange", this._layerTreeDidChange);
    }
    this._layerTreeDidChange = handler;
    if (handler) {
      this._client.on("LayerTree.layerTreeDidChange", handler);
    }
  }
  get layerPainted(): LayerTree.layerPainted_Handler {
    return this._layerPainted;
  }
  set layerPainted(handler: LayerTree.layerPainted_Handler) {
    if (this._layerPainted) {
      this._client.removeListener("LayerTree.layerPainted", this._layerPainted);
    }
    this._layerPainted = handler;
    if (handler) {
      this._client.on("LayerTree.layerPainted", handler);
    }
  }
}
export namespace LayerTree {
  /** Unique Layer identifier. */
  export type LayerId = string;
  /** Unique snapshot identifier. */
  export type SnapshotId = string;
  /** Rectangle where scrolling happens on the main thread. */
  export interface ScrollRect {
    /** Rectangle itself. */
    rect: DOM.Rect;
    /** Reason for rectangle to force scrolling on the main thread */
    type: "RepaintsOnScroll" | "TouchEventHandler" | "WheelEventHandler";
  }
  /** Serialized fragment of layer picture along with its offset within the layer. */
  export interface PictureTile {
    /** Offset from owning layer left boundary */
    x: number;
    /** Offset from owning layer top boundary */
    y: number;
    /** Base64-encoded snapshot data. */
    picture: string;
  }
  /** Information about a compositing layer. */
  export interface Layer {
    /** The unique id for this layer. */
    layerId: LayerId;
    /** The id of parent (not present for root). */
    parentLayerId?: LayerId;
    /** The backend id for the node associated with this layer. */
    backendNodeId?: DOM.BackendNodeId;
    /** Offset from parent layer, X coordinate. */
    offsetX: number;
    /** Offset from parent layer, Y coordinate. */
    offsetY: number;
    /** Layer width. */
    width: number;
    /** Layer height. */
    height: number;
    /** Transformation matrix for layer, default is identity matrix */
    transform?: number[];
    /** Transform anchor point X, absent if no transform specified */
    anchorX?: number;
    /** Transform anchor point Y, absent if no transform specified */
    anchorY?: number;
    /** Transform anchor point Z, absent if no transform specified */
    anchorZ?: number;
    /** Indicates how many time this layer has painted. */
    paintCount: number;
    /** Indicates whether this layer hosts any content, rather than being used for transform/scrolling purposes only. */
    drawsContent: boolean;
    /** Set if layer is not visible. */
    invisible?: boolean;
    /** Rectangles scrolling on main thread only. */
    scrollRects?: ScrollRect[];
  }
  /** Array of timings, one per paint step. */
  export type PaintProfile = number[];
  export type layerTreeDidChange_Parameters = {
    /** Layer tree, absent if not in the comspositing mode. */
    layers?: Layer[];
  };
  export type layerTreeDidChange_Handler = (params: layerTreeDidChange_Parameters) => void;
  export type layerPainted_Parameters = {
    /** The id of the painted layer. */
    layerId: LayerId;
    /** Clip rectangle. */
    clip: DOM.Rect;
  };
  export type layerPainted_Handler = (params: layerPainted_Parameters) => void;
  export type compositingReasons_Parameters = {
    /** The id of the layer for which we want to get the reasons it was composited. */
    layerId: LayerId;
  };
  export type compositingReasons_Return = {
    /** A list of strings specifying reasons for the given layer to become composited. */
    compositingReasons: string[];
  };
  export type makeSnapshot_Parameters = {
    /** The id of the layer. */
    layerId: LayerId;
  };
  export type makeSnapshot_Return = {
    /** The id of the layer snapshot. */
    snapshotId: SnapshotId;
  };
  export type loadSnapshot_Parameters = {
    /** An array of tiles composing the snapshot. */
    tiles: PictureTile[];
  };
  export type loadSnapshot_Return = {
    /** The id of the snapshot. */
    snapshotId: SnapshotId;
  };
  export type releaseSnapshot_Parameters = {
    /** The id of the layer snapshot. */
    snapshotId: SnapshotId;
  };
  export type profileSnapshot_Parameters = {
    /** The id of the layer snapshot. */
    snapshotId: SnapshotId;
    /** The maximum number of times to replay the snapshot (1, if not specified). */
    minRepeatCount?: number;
    /** The minimum duration (in seconds) to replay the snapshot. */
    minDuration?: number;
    /** The clip rectangle to apply when replaying the snapshot. */
    clipRect?: DOM.Rect;
  };
  export type profileSnapshot_Return = {
    /** The array of paint profiles, one per run. */
    timings: PaintProfile[];
  };
  export type replaySnapshot_Parameters = {
    /** The id of the layer snapshot. */
    snapshotId: SnapshotId;
    /** The first step to replay from (replay from the very start if not specified). */
    fromStep?: number;
    /** The last step to replay to (replay till the end if not specified). */
    toStep?: number;
    /** The scale to apply while replaying (defaults to 1). */
    scale?: number;
  };
  export type replaySnapshot_Return = {
    /** A data: URL for resulting image. */
    dataURL: string;
  };
  export type snapshotCommandLog_Parameters = {
    /** The id of the layer snapshot. */
    snapshotId: SnapshotId;
  };
  export type snapshotCommandLog_Return = {
    /** The array of canvas function calls. */
    commandLog: any[];
  };
}
export class DeviceOrientation {
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Overrides the Device Orientation. */
  setDeviceOrientationOverride(params: DeviceOrientation.setDeviceOrientationOverride_Parameters): Promise<void> {
    return this._client.send<void>("DeviceOrientation.setDeviceOrientationOverride", params);
  }
  /** Clears the overridden Device Orientation. */
  clearDeviceOrientationOverride(): Promise<void> {
    return this._client.send<void>("DeviceOrientation.clearDeviceOrientationOverride");
  }
}
export namespace DeviceOrientation {
  export type setDeviceOrientationOverride_Parameters = {
    /** Mock alpha */
    alpha: number;
    /** Mock beta */
    beta: number;
    /** Mock gamma */
    gamma: number;
  };
}
export class Tracing {
  private _dataCollected: Tracing.dataCollected_Handler = undefined;
  private _tracingComplete: Tracing.tracingComplete_Handler = undefined;
  private _bufferUsage: Tracing.bufferUsage_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Start trace events collection. */
  start(params: Tracing.start_Parameters): Promise<void> {
    return this._client.send<void>("Tracing.start", params);
  }
  /** Stop trace events collection. */
  end(): Promise<void> {
    return this._client.send<void>("Tracing.end");
  }
  /** Gets supported tracing categories. */
  getCategories(): Promise<Tracing.getCategories_Return> {
    return this._client.send<Tracing.getCategories_Return>("Tracing.getCategories");
  }
  /** Request a global memory dump. */
  requestMemoryDump(): Promise<Tracing.requestMemoryDump_Return> {
    return this._client.send<Tracing.requestMemoryDump_Return>("Tracing.requestMemoryDump");
  }
  /** Record a clock sync marker in the trace. */
  recordClockSyncMarker(params: Tracing.recordClockSyncMarker_Parameters): Promise<void> {
    return this._client.send<void>("Tracing.recordClockSyncMarker", params);
  }
  /** Contains an bucket of collected trace events. When tracing is stopped collected events will be send as a sequence of dataCollected events followed by tracingComplete event. */
  get dataCollected(): Tracing.dataCollected_Handler {
    return this._dataCollected;
  }
  set dataCollected(handler: Tracing.dataCollected_Handler) {
    if (this._dataCollected) {
      this._client.removeListener("Tracing.dataCollected", this._dataCollected);
    }
    this._dataCollected = handler;
    if (handler) {
      this._client.on("Tracing.dataCollected", handler);
    }
  }
  /** Signals that tracing is stopped and there is no trace buffers pending flush, all data were delivered via dataCollected events. */
  get tracingComplete(): Tracing.tracingComplete_Handler {
    return this._tracingComplete;
  }
  set tracingComplete(handler: Tracing.tracingComplete_Handler) {
    if (this._tracingComplete) {
      this._client.removeListener("Tracing.tracingComplete", this._tracingComplete);
    }
    this._tracingComplete = handler;
    if (handler) {
      this._client.on("Tracing.tracingComplete", handler);
    }
  }
  get bufferUsage(): Tracing.bufferUsage_Handler {
    return this._bufferUsage;
  }
  set bufferUsage(handler: Tracing.bufferUsage_Handler) {
    if (this._bufferUsage) {
      this._client.removeListener("Tracing.bufferUsage", this._bufferUsage);
    }
    this._bufferUsage = handler;
    if (handler) {
      this._client.on("Tracing.bufferUsage", handler);
    }
  }
}
export namespace Tracing {
  /** Configuration for memory dump. Used only when "memory-infra" category is enabled. */
  export type MemoryDumpConfig = any;
  export interface TraceConfig {
    /** Controls how the trace buffer stores data. */
    recordMode?: "recordUntilFull" | "recordContinuously" | "recordAsMuchAsPossible" | "echoToConsole";
    /** Turns on JavaScript stack sampling. */
    enableSampling?: boolean;
    /** Turns on system tracing. */
    enableSystrace?: boolean;
    /** Turns on argument filter. */
    enableArgumentFilter?: boolean;
    /** Included category filters. */
    includedCategories?: string[];
    /** Excluded category filters. */
    excludedCategories?: string[];
    /** Configuration to synthesize the delays in tracing. */
    syntheticDelays?: string[];
    /** Configuration for memory dump triggers. Used only when "memory-infra" category is enabled. */
    memoryDumpConfig?: MemoryDumpConfig;
  }
  export type dataCollected_Parameters = {
    value: any[];
  };
  export type dataCollected_Handler = (params: dataCollected_Parameters) => void;
  export type tracingComplete_Parameters = {
    /** A handle of the stream that holds resulting trace data. */
    stream?: IO.StreamHandle;
  };
  export type tracingComplete_Handler = (params: tracingComplete_Parameters) => void;
  export type bufferUsage_Parameters = {
    /** A number in range [0..1] that indicates the used size of event buffer as a fraction of its total size. */
    percentFull?: number;
    /** An approximate number of events in the trace log. */
    eventCount?: number;
    /** A number in range [0..1] that indicates the used size of event buffer as a fraction of its total size. */
    value?: number;
  };
  export type bufferUsage_Handler = (params: bufferUsage_Parameters) => void;
  export type start_Parameters = {
    /** Category/tag filter */
    categories?: string;
    /** Tracing options */
    options?: string;
    /** If set, the agent will issue bufferUsage events at this interval, specified in milliseconds */
    bufferUsageReportingInterval?: number;
    /** Whether to report trace events as series of dataCollected events or to save trace to a stream (defaults to <code>ReportEvents</code>). */
    transferMode?: "ReportEvents" | "ReturnAsStream";
    traceConfig?: TraceConfig;
  };
  export type getCategories_Return = {
    /** A list of supported tracing categories. */
    categories: string[];
  };
  export type requestMemoryDump_Return = {
    /** GUID of the resulting global memory dump. */
    dumpGuid: string;
    /** True iff the global memory dump succeeded. */
    success: boolean;
  };
  export type recordClockSyncMarker_Parameters = {
    /** The ID of this clock sync marker */
    syncId: string;
  };
}
export class Animation {
  private _animationCreated: Animation.animationCreated_Handler = undefined;
  private _animationStarted: Animation.animationStarted_Handler = undefined;
  private _animationCanceled: Animation.animationCanceled_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables animation domain notifications. */
  enable(): Promise<void> {
    return this._client.send<void>("Animation.enable");
  }
  /** Disables animation domain notifications. */
  disable(): Promise<void> {
    return this._client.send<void>("Animation.disable");
  }
  /** Gets the playback rate of the document timeline. */
  getPlaybackRate(): Promise<Animation.getPlaybackRate_Return> {
    return this._client.send<Animation.getPlaybackRate_Return>("Animation.getPlaybackRate");
  }
  /** Sets the playback rate of the document timeline. */
  setPlaybackRate(params: Animation.setPlaybackRate_Parameters): Promise<void> {
    return this._client.send<void>("Animation.setPlaybackRate", params);
  }
  /** Returns the current time of the an animation. */
  getCurrentTime(params: Animation.getCurrentTime_Parameters): Promise<Animation.getCurrentTime_Return> {
    return this._client.send<Animation.getCurrentTime_Return>("Animation.getCurrentTime", params);
  }
  /** Sets the paused state of a set of animations. */
  setPaused(params: Animation.setPaused_Parameters): Promise<void> {
    return this._client.send<void>("Animation.setPaused", params);
  }
  /** Sets the timing of an animation node. */
  setTiming(params: Animation.setTiming_Parameters): Promise<void> {
    return this._client.send<void>("Animation.setTiming", params);
  }
  /** Seek a set of animations to a particular time within each animation. */
  seekAnimations(params: Animation.seekAnimations_Parameters): Promise<void> {
    return this._client.send<void>("Animation.seekAnimations", params);
  }
  /** Releases a set of animations to no longer be manipulated. */
  releaseAnimations(params: Animation.releaseAnimations_Parameters): Promise<void> {
    return this._client.send<void>("Animation.releaseAnimations", params);
  }
  /** Gets the remote object of the Animation. */
  resolveAnimation(params: Animation.resolveAnimation_Parameters): Promise<Animation.resolveAnimation_Return> {
    return this._client.send<Animation.resolveAnimation_Return>("Animation.resolveAnimation", params);
  }
  /** Event for each animation that has been created. */
  get animationCreated(): Animation.animationCreated_Handler {
    return this._animationCreated;
  }
  set animationCreated(handler: Animation.animationCreated_Handler) {
    if (this._animationCreated) {
      this._client.removeListener("Animation.animationCreated", this._animationCreated);
    }
    this._animationCreated = handler;
    if (handler) {
      this._client.on("Animation.animationCreated", handler);
    }
  }
  /** Event for animation that has been started. */
  get animationStarted(): Animation.animationStarted_Handler {
    return this._animationStarted;
  }
  set animationStarted(handler: Animation.animationStarted_Handler) {
    if (this._animationStarted) {
      this._client.removeListener("Animation.animationStarted", this._animationStarted);
    }
    this._animationStarted = handler;
    if (handler) {
      this._client.on("Animation.animationStarted", handler);
    }
  }
  /** Event for when an animation has been cancelled. */
  get animationCanceled(): Animation.animationCanceled_Handler {
    return this._animationCanceled;
  }
  set animationCanceled(handler: Animation.animationCanceled_Handler) {
    if (this._animationCanceled) {
      this._client.removeListener("Animation.animationCanceled", this._animationCanceled);
    }
    this._animationCanceled = handler;
    if (handler) {
      this._client.on("Animation.animationCanceled", handler);
    }
  }
}
export namespace Animation {
  /** Animation instance. */
  export interface Animation {
    /** <code>Animation</code>'s id. */
    id: string;
    /** <code>Animation</code>'s name. */
    name: string;
    /** <code>Animation</code>'s internal paused state. */
    pausedState: boolean;
    /** <code>Animation</code>'s play state. */
    playState: string;
    /** <code>Animation</code>'s playback rate. */
    playbackRate: number;
    /** <code>Animation</code>'s start time. */
    startTime: number;
    /** <code>Animation</code>'s current time. */
    currentTime: number;
    /** <code>Animation</code>'s source animation node. */
    source: AnimationEffect;
    /** Animation type of <code>Animation</code>. */
    type: "CSSTransition" | "CSSAnimation" | "WebAnimation";
    /** A unique ID for <code>Animation</code> representing the sources that triggered this CSS animation/transition. */
    cssId?: string;
  }
  /** AnimationEffect instance */
  export interface AnimationEffect {
    /** <code>AnimationEffect</code>'s delay. */
    delay: number;
    /** <code>AnimationEffect</code>'s end delay. */
    endDelay: number;
    /** <code>AnimationEffect</code>'s iteration start. */
    iterationStart: number;
    /** <code>AnimationEffect</code>'s iterations. */
    iterations: number;
    /** <code>AnimationEffect</code>'s iteration duration. */
    duration: number;
    /** <code>AnimationEffect</code>'s playback direction. */
    direction: string;
    /** <code>AnimationEffect</code>'s fill mode. */
    fill: string;
    /** <code>AnimationEffect</code>'s target node. */
    backendNodeId: DOM.BackendNodeId;
    /** <code>AnimationEffect</code>'s keyframes. */
    keyframesRule?: KeyframesRule;
    /** <code>AnimationEffect</code>'s timing function. */
    easing: string;
  }
  /** Keyframes Rule */
  export interface KeyframesRule {
    /** CSS keyframed animation's name. */
    name?: string;
    /** List of animation keyframes. */
    keyframes: KeyframeStyle[];
  }
  /** Keyframe Style */
  export interface KeyframeStyle {
    /** Keyframe's time offset. */
    offset: string;
    /** <code>AnimationEffect</code>'s timing function. */
    easing: string;
  }
  export type animationCreated_Parameters = {
    /** Id of the animation that was created. */
    id: string;
  };
  export type animationCreated_Handler = (params: animationCreated_Parameters) => void;
  export type animationStarted_Parameters = {
    /** Animation that was started. */
    animation: Animation;
  };
  export type animationStarted_Handler = (params: animationStarted_Parameters) => void;
  export type animationCanceled_Parameters = {
    /** Id of the animation that was cancelled. */
    id: string;
  };
  export type animationCanceled_Handler = (params: animationCanceled_Parameters) => void;
  export type getPlaybackRate_Return = {
    /** Playback rate for animations on page. */
    playbackRate: number;
  };
  export type setPlaybackRate_Parameters = {
    /** Playback rate for animations on page */
    playbackRate: number;
  };
  export type getCurrentTime_Parameters = {
    /** Id of animation. */
    id: string;
  };
  export type getCurrentTime_Return = {
    /** Current time of the page. */
    currentTime: number;
  };
  export type setPaused_Parameters = {
    /** Animations to set the pause state of. */
    animations: string[];
    /** Paused state to set to. */
    paused: boolean;
  };
  export type setTiming_Parameters = {
    /** Animation id. */
    animationId: string;
    /** Duration of the animation. */
    duration: number;
    /** Delay of the animation. */
    delay: number;
  };
  export type seekAnimations_Parameters = {
    /** List of animation ids to seek. */
    animations: string[];
    /** Set the current time of each animation. */
    currentTime: number;
  };
  export type releaseAnimations_Parameters = {
    /** List of animation ids to seek. */
    animations: string[];
  };
  export type resolveAnimation_Parameters = {
    /** Animation id. */
    animationId: string;
  };
  export type resolveAnimation_Return = {
    /** Corresponding remote object. */
    remoteObject: Runtime.RemoteObject;
  };
}
export class Accessibility {
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Fetches the accessibility node and partial accessibility tree for this DOM node, if it exists. */
  getPartialAXTree(params: Accessibility.getPartialAXTree_Parameters): Promise<Accessibility.getPartialAXTree_Return> {
    return this._client.send<Accessibility.getPartialAXTree_Return>("Accessibility.getPartialAXTree", params);
  }
}
export namespace Accessibility {
  /** Unique accessibility node identifier. */
  export type AXNodeId = string;
  /** Enum of possible property types. */
  export type AXValueType = "boolean" | "tristate" | "booleanOrUndefined" | "idref" | "idrefList" | "integer" | "node" | "nodeList" | "number" | "string" | "computedString" | "token" | "tokenList" | "domRelation" | "role" | "internalRole" | "valueUndefined";
  /** Enum of possible property sources. */
  export type AXValueSourceType = "attribute" | "implicit" | "style" | "contents" | "placeholder" | "relatedElement";
  /** Enum of possible native property sources (as a subtype of a particular AXValueSourceType). */
  export type AXValueNativeSourceType = "figcaption" | "label" | "labelfor" | "labelwrapped" | "legend" | "tablecaption" | "title" | "other";
  /** A single source for a computed AX property. */
  export interface AXValueSource {
    /** What type of source this is. */
    type: AXValueSourceType;
    /** The value of this property source. */
    value?: AXValue;
    /** The name of the relevant attribute, if any. */
    attribute?: string;
    /** The value of the relevant attribute, if any. */
    attributeValue?: AXValue;
    /** Whether this source is superseded by a higher priority source. */
    superseded?: boolean;
    /** The native markup source for this value, e.g. a <label> element. */
    nativeSource?: AXValueNativeSourceType;
    /** The value, such as a node or node list, of the native source. */
    nativeSourceValue?: AXValue;
    /** Whether the value for this property is invalid. */
    invalid?: boolean;
    /** Reason for the value being invalid, if it is. */
    invalidReason?: string;
  }
  export interface AXRelatedNode {
    /** The BackendNodeId of the related DOM node. */
    backendDOMNodeId: DOM.BackendNodeId;
    /** The IDRef value provided, if any. */
    idref?: string;
    /** The text alternative of this node in the current context. */
    text?: string;
  }
  export interface AXProperty {
    /** The name of this property. */
    name: string;
    /** The value of this property. */
    value: AXValue;
  }
  /** A single computed AX property. */
  export interface AXValue {
    /** The type of this value. */
    type: AXValueType;
    /** The computed value of this property. */
    value?: any;
    /** One or more related nodes, if applicable. */
    relatedNodes?: AXRelatedNode[];
    /** The sources which contributed to the computation of this property. */
    sources?: AXValueSource[];
  }
  /** States which apply to every AX node. */
  export type AXGlobalStates = "disabled" | "hidden" | "hiddenRoot" | "invalid" | "keyshortcuts" | "roledescription";
  /** Attributes which apply to nodes in live regions. */
  export type AXLiveRegionAttributes = "live" | "atomic" | "relevant" | "busy" | "root";
  /** Attributes which apply to widgets. */
  export type AXWidgetAttributes = "autocomplete" | "haspopup" | "level" | "multiselectable" | "orientation" | "multiline" | "readonly" | "required" | "valuemin" | "valuemax" | "valuetext";
  /** States which apply to widgets. */
  export type AXWidgetStates = "checked" | "expanded" | "modal" | "pressed" | "selected";
  /** Relationships between elements other than parent/child/sibling. */
  export type AXRelationshipAttributes = "activedescendant" | "controls" | "describedby" | "details" | "errormessage" | "flowto" | "labelledby" | "owns";
  /** A node in the accessibility tree. */
  export interface AXNode {
    /** Unique identifier for this node. */
    nodeId: AXNodeId;
    /** Whether this node is ignored for accessibility */
    ignored: boolean;
    /** Collection of reasons why this node is hidden. */
    ignoredReasons?: AXProperty[];
    /** This <code>Node</code>'s role, whether explicit or implicit. */
    role?: AXValue;
    /** The accessible name for this <code>Node</code>. */
    name?: AXValue;
    /** The accessible description for this <code>Node</code>. */
    description?: AXValue;
    /** The value for this <code>Node</code>. */
    value?: AXValue;
    /** All other properties */
    properties?: AXProperty[];
    /** IDs for each of this node's child nodes. */
    childIds?: AXNodeId[];
    /** The backend ID for the associated DOM node, if any. */
    backendDOMNodeId?: DOM.BackendNodeId;
  }
  export type getPartialAXTree_Parameters = {
    /** ID of node to get the partial accessibility tree for. */
    nodeId: DOM.NodeId;
    /** Whether to fetch this nodes ancestors, siblings and children. Defaults to true. */
    fetchRelatives?: boolean;
  };
  export type getPartialAXTree_Return = {
    /** The <code>Accessibility.AXNode</code> for this DOM node, if it exists, plus its ancestors, siblings and children, if requested. */
    nodes: AXNode[];
  };
}
export class Storage {
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Clears storage for origin. */
  clearDataForOrigin(params: Storage.clearDataForOrigin_Parameters): Promise<void> {
    return this._client.send<void>("Storage.clearDataForOrigin", params);
  }
}
export namespace Storage {
  /** Enum of possible storage types. */
  export type StorageType = "appcache" | "cookies" | "file_systems" | "indexeddb" | "local_storage" | "shader_cache" | "websql" | "service_workers" | "cache_storage" | "all";
  export type clearDataForOrigin_Parameters = {
    /** Security origin. */
    origin: string;
    /** Comma separated origin names. */
    storageTypes: string;
  };
}
/** Provides access to log entries. */
export class Log {
  private _entryAdded: Log.entryAdded_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables log domain, sends the entries collected so far to the client by means of the <code>entryAdded</code> notification. */
  enable(): Promise<void> {
    return this._client.send<void>("Log.enable");
  }
  /** Disables log domain, prevents further log entries from being reported to the client. */
  disable(): Promise<void> {
    return this._client.send<void>("Log.disable");
  }
  /** Clears the log. */
  clear(): Promise<void> {
    return this._client.send<void>("Log.clear");
  }
  /** start violation reporting. */
  startViolationsReport(params: Log.startViolationsReport_Parameters): Promise<void> {
    return this._client.send<void>("Log.startViolationsReport", params);
  }
  /** Stop violation reporting. */
  stopViolationsReport(): Promise<void> {
    return this._client.send<void>("Log.stopViolationsReport");
  }
  /** Issued when new message was logged. */
  get entryAdded(): Log.entryAdded_Handler {
    return this._entryAdded;
  }
  set entryAdded(handler: Log.entryAdded_Handler) {
    if (this._entryAdded) {
      this._client.removeListener("Log.entryAdded", this._entryAdded);
    }
    this._entryAdded = handler;
    if (handler) {
      this._client.on("Log.entryAdded", handler);
    }
  }
}
export namespace Log {
  /** Log entry. */
  export interface LogEntry {
    /** Log entry source. */
    source: "xml" | "javascript" | "network" | "storage" | "appcache" | "rendering" | "security" | "deprecation" | "worker" | "violation" | "intervention" | "other";
    /** Log entry severity. */
    level: "verbose" | "info" | "warning" | "error";
    /** Logged text. */
    text: string;
    /** Timestamp when this entry was added. */
    timestamp: Runtime.Timestamp;
    /** URL of the resource if known. */
    url?: string;
    /** Line number in the resource. */
    lineNumber?: number;
    /** JavaScript stack trace. */
    stackTrace?: Runtime.StackTrace;
    /** Identifier of the network request associated with this entry. */
    networkRequestId?: Network.RequestId;
    /** Identifier of the worker associated with this entry. */
    workerId?: string;
  }
  /** Violation configuration setting. */
  export interface ViolationSetting {
    /** Violation type. */
    name: "longTask" | "longLayout" | "blockedEvent" | "blockedParser" | "discouragedAPIUse" | "handler" | "recurringHandler";
    /** Time threshold to trigger upon. */
    threshold: number;
  }
  export type entryAdded_Parameters = {
    /** The entry. */
    entry: LogEntry;
  };
  export type entryAdded_Handler = (params: entryAdded_Parameters) => void;
  export type startViolationsReport_Parameters = {
    /** Configuration for violations. */
    config: ViolationSetting[];
  };
}
/** The SystemInfo domain defines methods and events for querying low-level system information. */
export class SystemInfo {
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Returns information about the system. */
  getInfo(): Promise<SystemInfo.getInfo_Return> {
    return this._client.send<SystemInfo.getInfo_Return>("SystemInfo.getInfo");
  }
}
export namespace SystemInfo {
  /** Describes a single graphics processor (GPU). */
  export interface GPUDevice {
    /** PCI ID of the GPU vendor, if available; 0 otherwise. */
    vendorId: number;
    /** PCI ID of the GPU device, if available; 0 otherwise. */
    deviceId: number;
    /** String description of the GPU vendor, if the PCI ID is not available. */
    vendorString: string;
    /** String description of the GPU device, if the PCI ID is not available. */
    deviceString: string;
  }
  /** Provides information about the GPU(s) on the system. */
  export interface GPUInfo {
    /** The graphics devices on the system. Element 0 is the primary GPU. */
    devices: GPUDevice[];
    /** An optional dictionary of additional GPU related attributes. */
    auxAttributes?: any;
    /** An optional dictionary of graphics features and their status. */
    featureStatus?: any;
    /** An optional array of GPU driver bug workarounds. */
    driverBugWorkarounds: string[];
  }
  export type getInfo_Return = {
    /** Information about the GPUs on the system. */
    gpu: GPUInfo;
    /** A platform-dependent description of the model of the machine. On Mac OS, this is, for example, 'MacBookPro'. Will be the empty string if not supported. */
    modelName: string;
    /** A platform-dependent description of the version of the machine. On Mac OS, this is, for example, '10.1'. Will be the empty string if not supported. */
    modelVersion: string;
  };
}
/** The Tethering domain defines methods and events for browser port binding. */
export class Tethering {
  private _accepted: Tethering.accepted_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Request browser port binding. */
  bind(params: Tethering.bind_Parameters): Promise<void> {
    return this._client.send<void>("Tethering.bind", params);
  }
  /** Request browser port unbinding. */
  unbind(params: Tethering.unbind_Parameters): Promise<void> {
    return this._client.send<void>("Tethering.unbind", params);
  }
  /** Informs that port was successfully bound and got a specified connection id. */
  get accepted(): Tethering.accepted_Handler {
    return this._accepted;
  }
  set accepted(handler: Tethering.accepted_Handler) {
    if (this._accepted) {
      this._client.removeListener("Tethering.accepted", this._accepted);
    }
    this._accepted = handler;
    if (handler) {
      this._client.on("Tethering.accepted", handler);
    }
  }
}
export namespace Tethering {
  export type accepted_Parameters = {
    /** Port number that was successfully bound. */
    port: number;
    /** Connection id to be used. */
    connectionId: string;
  };
  export type accepted_Handler = (params: accepted_Parameters) => void;
  export type bind_Parameters = {
    /** Port number to bind. */
    port: number;
  };
  export type unbind_Parameters = {
    /** Port number to unbind. */
    port: number;
  };
}
/** Provides information about the protocol schema. */
export class Schema {
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Returns supported domains. */
  getDomains(): Promise<Schema.getDomains_Return> {
    return this._client.send<Schema.getDomains_Return>("Schema.getDomains");
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
  export type getDomains_Return = {
    /** List of supported domains. */
    domains: Domain[];
  };
}
/** Runtime domain exposes JavaScript runtime by means of remote evaluation and mirror objects. Evaluation results are returned as mirror object that expose object type, string representation and unique identifier that can be used for further object reference. Original objects are maintained in memory unless they are either explicitly released or are released along with the other objects in their object group. */
export class Runtime {
  private _executionContextCreated: Runtime.executionContextCreated_Handler = undefined;
  private _executionContextDestroyed: Runtime.executionContextDestroyed_Handler = undefined;
  private _executionContextsCleared: Runtime.executionContextsCleared_Handler = undefined;
  private _exceptionThrown: Runtime.exceptionThrown_Handler = undefined;
  private _exceptionRevoked: Runtime.exceptionRevoked_Handler = undefined;
  private _consoleAPICalled: Runtime.consoleAPICalled_Handler = undefined;
  private _inspectRequested: Runtime.inspectRequested_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Evaluates expression on global object. */
  evaluate(params: Runtime.evaluate_Parameters): Promise<Runtime.evaluate_Return> {
    return this._client.send<Runtime.evaluate_Return>("Runtime.evaluate", params);
  }
  /** Add handler to promise with given promise object id. */
  awaitPromise(params: Runtime.awaitPromise_Parameters): Promise<Runtime.awaitPromise_Return> {
    return this._client.send<Runtime.awaitPromise_Return>("Runtime.awaitPromise", params);
  }
  /** Calls function with given declaration on the given object. Object group of the result is inherited from the target object. */
  callFunctionOn(params: Runtime.callFunctionOn_Parameters): Promise<Runtime.callFunctionOn_Return> {
    return this._client.send<Runtime.callFunctionOn_Return>("Runtime.callFunctionOn", params);
  }
  /** Returns properties of a given object. Object group of the result is inherited from the target object. */
  getProperties(params: Runtime.getProperties_Parameters): Promise<Runtime.getProperties_Return> {
    return this._client.send<Runtime.getProperties_Return>("Runtime.getProperties", params);
  }
  /** Releases remote object with given id. */
  releaseObject(params: Runtime.releaseObject_Parameters): Promise<void> {
    return this._client.send<void>("Runtime.releaseObject", params);
  }
  /** Releases all remote objects that belong to a given group. */
  releaseObjectGroup(params: Runtime.releaseObjectGroup_Parameters): Promise<void> {
    return this._client.send<void>("Runtime.releaseObjectGroup", params);
  }
  /** Tells inspected instance to run if it was waiting for debugger to attach. */
  runIfWaitingForDebugger(): Promise<void> {
    return this._client.send<void>("Runtime.runIfWaitingForDebugger");
  }
  /** Enables reporting of execution contexts creation by means of <code>executionContextCreated</code> event. When the reporting gets enabled the event will be sent immediately for each existing execution context. */
  enable(): Promise<void> {
    return this._client.send<void>("Runtime.enable");
  }
  /** Disables reporting of execution contexts creation. */
  disable(): Promise<void> {
    return this._client.send<void>("Runtime.disable");
  }
  /** Discards collected exceptions and console API calls. */
  discardConsoleEntries(): Promise<void> {
    return this._client.send<void>("Runtime.discardConsoleEntries");
  }
  setCustomObjectFormatterEnabled(params: Runtime.setCustomObjectFormatterEnabled_Parameters): Promise<void> {
    return this._client.send<void>("Runtime.setCustomObjectFormatterEnabled", params);
  }
  /** Compiles expression. */
  compileScript(params: Runtime.compileScript_Parameters): Promise<Runtime.compileScript_Return> {
    return this._client.send<Runtime.compileScript_Return>("Runtime.compileScript", params);
  }
  /** Runs script with given id in a given context. */
  runScript(params: Runtime.runScript_Parameters): Promise<Runtime.runScript_Return> {
    return this._client.send<Runtime.runScript_Return>("Runtime.runScript", params);
  }
  /** Issued when new execution context is created. */
  get executionContextCreated(): Runtime.executionContextCreated_Handler {
    return this._executionContextCreated;
  }
  set executionContextCreated(handler: Runtime.executionContextCreated_Handler) {
    if (this._executionContextCreated) {
      this._client.removeListener("Runtime.executionContextCreated", this._executionContextCreated);
    }
    this._executionContextCreated = handler;
    if (handler) {
      this._client.on("Runtime.executionContextCreated", handler);
    }
  }
  /** Issued when execution context is destroyed. */
  get executionContextDestroyed(): Runtime.executionContextDestroyed_Handler {
    return this._executionContextDestroyed;
  }
  set executionContextDestroyed(handler: Runtime.executionContextDestroyed_Handler) {
    if (this._executionContextDestroyed) {
      this._client.removeListener("Runtime.executionContextDestroyed", this._executionContextDestroyed);
    }
    this._executionContextDestroyed = handler;
    if (handler) {
      this._client.on("Runtime.executionContextDestroyed", handler);
    }
  }
  /** Issued when all executionContexts were cleared in browser */
  get executionContextsCleared(): Runtime.executionContextsCleared_Handler {
    return this._executionContextsCleared;
  }
  set executionContextsCleared(handler: Runtime.executionContextsCleared_Handler) {
    if (this._executionContextsCleared) {
      this._client.removeListener("Runtime.executionContextsCleared", this._executionContextsCleared);
    }
    this._executionContextsCleared = handler;
    if (handler) {
      this._client.on("Runtime.executionContextsCleared", handler);
    }
  }
  /** Issued when exception was thrown and unhandled. */
  get exceptionThrown(): Runtime.exceptionThrown_Handler {
    return this._exceptionThrown;
  }
  set exceptionThrown(handler: Runtime.exceptionThrown_Handler) {
    if (this._exceptionThrown) {
      this._client.removeListener("Runtime.exceptionThrown", this._exceptionThrown);
    }
    this._exceptionThrown = handler;
    if (handler) {
      this._client.on("Runtime.exceptionThrown", handler);
    }
  }
  /** Issued when unhandled exception was revoked. */
  get exceptionRevoked(): Runtime.exceptionRevoked_Handler {
    return this._exceptionRevoked;
  }
  set exceptionRevoked(handler: Runtime.exceptionRevoked_Handler) {
    if (this._exceptionRevoked) {
      this._client.removeListener("Runtime.exceptionRevoked", this._exceptionRevoked);
    }
    this._exceptionRevoked = handler;
    if (handler) {
      this._client.on("Runtime.exceptionRevoked", handler);
    }
  }
  /** Issued when console API was called. */
  get consoleAPICalled(): Runtime.consoleAPICalled_Handler {
    return this._consoleAPICalled;
  }
  set consoleAPICalled(handler: Runtime.consoleAPICalled_Handler) {
    if (this._consoleAPICalled) {
      this._client.removeListener("Runtime.consoleAPICalled", this._consoleAPICalled);
    }
    this._consoleAPICalled = handler;
    if (handler) {
      this._client.on("Runtime.consoleAPICalled", handler);
    }
  }
  /** Issued when object should be inspected (for example, as a result of inspect() command line API call). */
  get inspectRequested(): Runtime.inspectRequested_Handler {
    return this._inspectRequested;
  }
  set inspectRequested(handler: Runtime.inspectRequested_Handler) {
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
    subtype?: "array" | "null" | "node" | "regexp" | "date" | "map" | "set" | "weakmap" | "weakset" | "iterator" | "generator" | "error" | "proxy" | "promise" | "typedarray";
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
  export interface CustomPreview {
    header: string;
    hasBody: boolean;
    formatterObjectId: RemoteObjectId;
    bindRemoteObjectFunctionId: RemoteObjectId;
    configObjectId?: RemoteObjectId;
  }
  /** Object containing abbreviated remote object value. */
  export interface ObjectPreview {
    /** Object type. */
    type: "object" | "function" | "undefined" | "string" | "number" | "boolean" | "symbol";
    /** Object subtype hint. Specified for <code>object</code> type values only. */
    subtype?: "array" | "null" | "node" | "regexp" | "date" | "map" | "set" | "weakmap" | "weakset" | "iterator" | "generator" | "error";
    /** String representation of the object. */
    description?: string;
    /** True iff some of the properties or entries of the original object did not fit. */
    overflow: boolean;
    /** List of the properties. */
    properties: PropertyPreview[];
    /** List of the entries. Specified for <code>map</code> and <code>set</code> subtype values only. */
    entries?: EntryPreview[];
  }
  export interface PropertyPreview {
    /** Property name. */
    name: string;
    /** Object type. Accessor means that the property itself is an accessor property. */
    type: "object" | "function" | "undefined" | "string" | "number" | "boolean" | "symbol" | "accessor";
    /** User-friendly property value string. */
    value?: string;
    /** Nested value preview. */
    valuePreview?: ObjectPreview;
    /** Object subtype hint. Specified for <code>object</code> type values only. */
    subtype?: "array" | "null" | "node" | "regexp" | "date" | "map" | "set" | "weakmap" | "weakset" | "iterator" | "generator" | "error";
  }
  export interface EntryPreview {
    /** Preview of the key. Specified for map-like collection entries. */
    key?: ObjectPreview;
    /** Preview of the value. */
    value: ObjectPreview;
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
    /** Creation frame of the Promise which produced the next synchronous trace when resolved, if available. */
    promiseCreationFrame?: CallFrame;
  }
  export type executionContextCreated_Parameters = {
    /** A newly created execution contex. */
    context: ExecutionContextDescription;
  };
  export type executionContextCreated_Handler = (params: executionContextCreated_Parameters) => void;
  export type executionContextDestroyed_Parameters = {
    /** Id of the destroyed context */
    executionContextId: ExecutionContextId;
  };
  export type executionContextDestroyed_Handler = (params: executionContextDestroyed_Parameters) => void;
  export type executionContextsCleared_Handler = () => void;
  export type exceptionThrown_Parameters = {
    /** Timestamp of the exception. */
    timestamp: Timestamp;
    exceptionDetails: ExceptionDetails;
  };
  export type exceptionThrown_Handler = (params: exceptionThrown_Parameters) => void;
  export type exceptionRevoked_Parameters = {
    /** Reason describing why exception was revoked. */
    reason: string;
    /** The id of revoked exception, as reported in <code>exceptionUnhandled</code>. */
    exceptionId: number;
  };
  export type exceptionRevoked_Handler = (params: exceptionRevoked_Parameters) => void;
  export type consoleAPICalled_Parameters = {
    /** Type of the call. */
    type: "log" | "debug" | "info" | "error" | "warning" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd" | "count" | "timeEnd";
    /** Call arguments. */
    args: RemoteObject[];
    /** Identifier of the context where the call was made. */
    executionContextId: ExecutionContextId;
    /** Call timestamp. */
    timestamp: Timestamp;
    /** Stack trace captured when the call was made. */
    stackTrace?: StackTrace;
  };
  export type consoleAPICalled_Handler = (params: consoleAPICalled_Parameters) => void;
  export type inspectRequested_Parameters = {
    object: RemoteObject;
    hints: any;
  };
  export type inspectRequested_Handler = (params: inspectRequested_Parameters) => void;
  export type evaluate_Parameters = {
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
  export type evaluate_Return = {
    /** Evaluation result. */
    result: RemoteObject;
    /** Exception details. */
    exceptionDetails?: ExceptionDetails;
  };
  export type awaitPromise_Parameters = {
    /** Identifier of the promise. */
    promiseObjectId: RemoteObjectId;
    /** Whether the result is expected to be a JSON object that should be sent by value. */
    returnByValue?: boolean;
    /** Whether preview should be generated for the result. */
    generatePreview?: boolean;
  };
  export type awaitPromise_Return = {
    /** Promise result. Will contain rejected value if promise was rejected. */
    result: RemoteObject;
    /** Exception details if stack strace is available. */
    exceptionDetails?: ExceptionDetails;
  };
  export type callFunctionOn_Parameters = {
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
  export type callFunctionOn_Return = {
    /** Call result. */
    result: RemoteObject;
    /** Exception details. */
    exceptionDetails?: ExceptionDetails;
  };
  export type getProperties_Parameters = {
    /** Identifier of the object to return properties for. */
    objectId: RemoteObjectId;
    /** If true, returns properties belonging only to the element itself, not to its prototype chain. */
    ownProperties?: boolean;
    /** If true, returns accessor properties (with getter/setter) only; internal properties are not returned either. */
    accessorPropertiesOnly?: boolean;
    /** Whether preview should be generated for the results. */
    generatePreview?: boolean;
  };
  export type getProperties_Return = {
    /** Object properties. */
    result: PropertyDescriptor[];
    /** Internal object properties (only of the element itself). */
    internalProperties?: InternalPropertyDescriptor[];
    /** Exception details. */
    exceptionDetails?: ExceptionDetails;
  };
  export type releaseObject_Parameters = {
    /** Identifier of the object to release. */
    objectId: RemoteObjectId;
  };
  export type releaseObjectGroup_Parameters = {
    /** Symbolic object group name. */
    objectGroup: string;
  };
  export type setCustomObjectFormatterEnabled_Parameters = {
    enabled: boolean;
  };
  export type compileScript_Parameters = {
    /** Expression to compile. */
    expression: string;
    /** Source url to be set for the script. */
    sourceURL: string;
    /** Specifies whether the compiled script should be persisted. */
    persistScript: boolean;
    /** Specifies in which execution context to perform script run. If the parameter is omitted the evaluation will be performed in the context of the inspected page. */
    executionContextId?: ExecutionContextId;
  };
  export type compileScript_Return = {
    /** Id of the script. */
    scriptId?: ScriptId;
    /** Exception details. */
    exceptionDetails?: ExceptionDetails;
  };
  export type runScript_Parameters = {
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
  export type runScript_Return = {
    /** Run result. */
    result: RemoteObject;
    /** Exception details. */
    exceptionDetails?: ExceptionDetails;
  };
}
/** Debugger domain exposes JavaScript debugging capabilities. It allows setting and removing breakpoints, stepping through execution, exploring stack traces, etc. */
export class Debugger {
  private _scriptParsed: Debugger.scriptParsed_Handler = undefined;
  private _scriptFailedToParse: Debugger.scriptFailedToParse_Handler = undefined;
  private _breakpointResolved: Debugger.breakpointResolved_Handler = undefined;
  private _paused: Debugger.paused_Handler = undefined;
  private _resumed: Debugger.resumed_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables debugger for the given page. Clients should not assume that the debugging has been enabled until the result for this command is received. */
  enable(): Promise<void> {
    return this._client.send<void>("Debugger.enable");
  }
  /** Disables debugger for given page. */
  disable(): Promise<void> {
    return this._client.send<void>("Debugger.disable");
  }
  /** Activates / deactivates all breakpoints on the page. */
  setBreakpointsActive(params: Debugger.setBreakpointsActive_Parameters): Promise<void> {
    return this._client.send<void>("Debugger.setBreakpointsActive", params);
  }
  /** Makes page not interrupt on any pauses (breakpoint, exception, dom exception etc). */
  setSkipAllPauses(params: Debugger.setSkipAllPauses_Parameters): Promise<void> {
    return this._client.send<void>("Debugger.setSkipAllPauses", params);
  }
  /** Sets JavaScript breakpoint at given location specified either by URL or URL regex. Once this command is issued, all existing parsed scripts will have breakpoints resolved and returned in <code>locations</code> property. Further matching script parsing will result in subsequent <code>breakpointResolved</code> events issued. This logical breakpoint will survive page reloads. */
  setBreakpointByUrl(params: Debugger.setBreakpointByUrl_Parameters): Promise<Debugger.setBreakpointByUrl_Return> {
    return this._client.send<Debugger.setBreakpointByUrl_Return>("Debugger.setBreakpointByUrl", params);
  }
  /** Sets JavaScript breakpoint at a given location. */
  setBreakpoint(params: Debugger.setBreakpoint_Parameters): Promise<Debugger.setBreakpoint_Return> {
    return this._client.send<Debugger.setBreakpoint_Return>("Debugger.setBreakpoint", params);
  }
  /** Removes JavaScript breakpoint. */
  removeBreakpoint(params: Debugger.removeBreakpoint_Parameters): Promise<void> {
    return this._client.send<void>("Debugger.removeBreakpoint", params);
  }
  /** Returns possible locations for breakpoint. scriptId in start and end range locations should be the same. */
  getPossibleBreakpoints(params: Debugger.getPossibleBreakpoints_Parameters): Promise<Debugger.getPossibleBreakpoints_Return> {
    return this._client.send<Debugger.getPossibleBreakpoints_Return>("Debugger.getPossibleBreakpoints", params);
  }
  /** Continues execution until specific location is reached. */
  continueToLocation(params: Debugger.continueToLocation_Parameters): Promise<void> {
    return this._client.send<void>("Debugger.continueToLocation", params);
  }
  /** Steps over the statement. */
  stepOver(): Promise<void> {
    return this._client.send<void>("Debugger.stepOver");
  }
  /** Steps into the function call. */
  stepInto(): Promise<void> {
    return this._client.send<void>("Debugger.stepInto");
  }
  /** Steps out of the function call. */
  stepOut(): Promise<void> {
    return this._client.send<void>("Debugger.stepOut");
  }
  /** Stops on the next JavaScript statement. */
  pause(): Promise<void> {
    return this._client.send<void>("Debugger.pause");
  }
  /** Steps into next scheduled async task if any is scheduled before next pause. Returns success when async task is actually scheduled, returns error if no task were scheduled or another scheduleStepIntoAsync was called. */
  scheduleStepIntoAsync(): Promise<void> {
    return this._client.send<void>("Debugger.scheduleStepIntoAsync");
  }
  /** Resumes JavaScript execution. */
  resume(): Promise<void> {
    return this._client.send<void>("Debugger.resume");
  }
  /** Searches for given string in script content. */
  searchInContent(params: Debugger.searchInContent_Parameters): Promise<Debugger.searchInContent_Return> {
    return this._client.send<Debugger.searchInContent_Return>("Debugger.searchInContent", params);
  }
  /** Edits JavaScript source live. */
  setScriptSource(params: Debugger.setScriptSource_Parameters): Promise<Debugger.setScriptSource_Return> {
    return this._client.send<Debugger.setScriptSource_Return>("Debugger.setScriptSource", params);
  }
  /** Restarts particular call frame from the beginning. */
  restartFrame(params: Debugger.restartFrame_Parameters): Promise<Debugger.restartFrame_Return> {
    return this._client.send<Debugger.restartFrame_Return>("Debugger.restartFrame", params);
  }
  /** Returns source for the script with given id. */
  getScriptSource(params: Debugger.getScriptSource_Parameters): Promise<Debugger.getScriptSource_Return> {
    return this._client.send<Debugger.getScriptSource_Return>("Debugger.getScriptSource", params);
  }
  /** Defines pause on exceptions state. Can be set to stop on all exceptions, uncaught exceptions or no exceptions. Initial pause on exceptions state is <code>none</code>. */
  setPauseOnExceptions(params: Debugger.setPauseOnExceptions_Parameters): Promise<void> {
    return this._client.send<void>("Debugger.setPauseOnExceptions", params);
  }
  /** Evaluates expression on a given call frame. */
  evaluateOnCallFrame(params: Debugger.evaluateOnCallFrame_Parameters): Promise<Debugger.evaluateOnCallFrame_Return> {
    return this._client.send<Debugger.evaluateOnCallFrame_Return>("Debugger.evaluateOnCallFrame", params);
  }
  /** Changes value of variable in a callframe. Object-based scopes are not supported and must be mutated manually. */
  setVariableValue(params: Debugger.setVariableValue_Parameters): Promise<void> {
    return this._client.send<void>("Debugger.setVariableValue", params);
  }
  /** Enables or disables async call stacks tracking. */
  setAsyncCallStackDepth(params: Debugger.setAsyncCallStackDepth_Parameters): Promise<void> {
    return this._client.send<void>("Debugger.setAsyncCallStackDepth", params);
  }
  /** Replace previous blackbox patterns with passed ones. Forces backend to skip stepping/pausing in scripts with url matching one of the patterns. VM will try to leave blackboxed script by performing 'step in' several times, finally resorting to 'step out' if unsuccessful. */
  setBlackboxPatterns(params: Debugger.setBlackboxPatterns_Parameters): Promise<void> {
    return this._client.send<void>("Debugger.setBlackboxPatterns", params);
  }
  /** Makes backend skip steps in the script in blackboxed ranges. VM will try leave blacklisted scripts by performing 'step in' several times, finally resorting to 'step out' if unsuccessful. Positions array contains positions where blackbox state is changed. First interval isn't blackboxed. Array should be sorted. */
  setBlackboxedRanges(params: Debugger.setBlackboxedRanges_Parameters): Promise<void> {
    return this._client.send<void>("Debugger.setBlackboxedRanges", params);
  }
  /** Fired when virtual machine parses script. This event is also fired for all known and uncollected scripts upon enabling debugger. */
  get scriptParsed(): Debugger.scriptParsed_Handler {
    return this._scriptParsed;
  }
  set scriptParsed(handler: Debugger.scriptParsed_Handler) {
    if (this._scriptParsed) {
      this._client.removeListener("Debugger.scriptParsed", this._scriptParsed);
    }
    this._scriptParsed = handler;
    if (handler) {
      this._client.on("Debugger.scriptParsed", handler);
    }
  }
  /** Fired when virtual machine fails to parse the script. */
  get scriptFailedToParse(): Debugger.scriptFailedToParse_Handler {
    return this._scriptFailedToParse;
  }
  set scriptFailedToParse(handler: Debugger.scriptFailedToParse_Handler) {
    if (this._scriptFailedToParse) {
      this._client.removeListener("Debugger.scriptFailedToParse", this._scriptFailedToParse);
    }
    this._scriptFailedToParse = handler;
    if (handler) {
      this._client.on("Debugger.scriptFailedToParse", handler);
    }
  }
  /** Fired when breakpoint is resolved to an actual script and location. */
  get breakpointResolved(): Debugger.breakpointResolved_Handler {
    return this._breakpointResolved;
  }
  set breakpointResolved(handler: Debugger.breakpointResolved_Handler) {
    if (this._breakpointResolved) {
      this._client.removeListener("Debugger.breakpointResolved", this._breakpointResolved);
    }
    this._breakpointResolved = handler;
    if (handler) {
      this._client.on("Debugger.breakpointResolved", handler);
    }
  }
  /** Fired when the virtual machine stopped on breakpoint or exception or any other stop criteria. */
  get paused(): Debugger.paused_Handler {
    return this._paused;
  }
  set paused(handler: Debugger.paused_Handler) {
    if (this._paused) {
      this._client.removeListener("Debugger.paused", this._paused);
    }
    this._paused = handler;
    if (handler) {
      this._client.on("Debugger.paused", handler);
    }
  }
  /** Fired when the virtual machine resumed execution. */
  get resumed(): Debugger.resumed_Handler {
    return this._resumed;
  }
  set resumed(handler: Debugger.resumed_Handler) {
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
  /** Location in the source code. */
  export interface ScriptPosition {
    lineNumber: number;
    columnNumber: number;
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
    type: "global" | "local" | "with" | "closure" | "catch" | "block" | "script" | "eval" | "module";
    /** Object representing the scope. For <code>global</code> and <code>with</code> scopes it represents the actual object; for the rest of the scopes, it is artificial transient object enumerating scope variables as its properties. */
    object: Runtime.RemoteObject;
    name?: string;
    /** Location in the source code where scope starts */
    startLocation?: Location;
    /** Location in the source code where scope ends */
    endLocation?: Location;
  }
  /** Search match for resource. */
  export interface SearchMatch {
    /** Line number in resource content. */
    lineNumber: number;
    /** Line with match content. */
    lineContent: string;
  }
  export interface BreakLocation {
    /** Script identifier as reported in the <code>Debugger.scriptParsed</code>. */
    scriptId: Runtime.ScriptId;
    /** Line number in the script (0-based). */
    lineNumber: number;
    /** Column number in the script (0-based). */
    columnNumber?: number;
    type?: "debuggerStatement" | "call" | "return";
  }
  export type scriptParsed_Parameters = {
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
    /** True, if this script is ES6 module. */
    isModule?: boolean;
    /** This script length. */
    length?: number;
    /** JavaScript top stack frame of where the script parsed event was triggered if available. */
    stackTrace?: Runtime.StackTrace;
  };
  export type scriptParsed_Handler = (params: scriptParsed_Parameters) => void;
  export type scriptFailedToParse_Parameters = {
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
    /** True, if this script is ES6 module. */
    isModule?: boolean;
    /** This script length. */
    length?: number;
    /** JavaScript top stack frame of where the script parsed event was triggered if available. */
    stackTrace?: Runtime.StackTrace;
  };
  export type scriptFailedToParse_Handler = (params: scriptFailedToParse_Parameters) => void;
  export type breakpointResolved_Parameters = {
    /** Breakpoint unique identifier. */
    breakpointId: BreakpointId;
    /** Actual breakpoint location. */
    location: Location;
  };
  export type breakpointResolved_Handler = (params: breakpointResolved_Parameters) => void;
  export type paused_Parameters = {
    /** Call stack the virtual machine stopped on. */
    callFrames: CallFrame[];
    /** Pause reason. */
    reason: "XHR" | "DOM" | "EventListener" | "exception" | "assert" | "debugCommand" | "promiseRejection" | "OOM" | "other" | "ambiguous";
    /** Object containing break-specific auxiliary properties. */
    data?: any;
    /** Hit breakpoints IDs */
    hitBreakpoints?: string[];
    /** Async stack trace, if any. */
    asyncStackTrace?: Runtime.StackTrace;
  };
  export type paused_Handler = (params: paused_Parameters) => void;
  export type resumed_Handler = () => void;
  export type setBreakpointsActive_Parameters = {
    /** New value for breakpoints active state. */
    active: boolean;
  };
  export type setSkipAllPauses_Parameters = {
    /** New value for skip pauses state. */
    skip: boolean;
  };
  export type setBreakpointByUrl_Parameters = {
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
  export type setBreakpointByUrl_Return = {
    /** Id of the created breakpoint for further reference. */
    breakpointId: BreakpointId;
    /** List of the locations this breakpoint resolved into upon addition. */
    locations: Location[];
  };
  export type setBreakpoint_Parameters = {
    /** Location to set breakpoint in. */
    location: Location;
    /** Expression to use as a breakpoint condition. When specified, debugger will only stop on the breakpoint if this expression evaluates to true. */
    condition?: string;
  };
  export type setBreakpoint_Return = {
    /** Id of the created breakpoint for further reference. */
    breakpointId: BreakpointId;
    /** Location this breakpoint resolved into. */
    actualLocation: Location;
  };
  export type removeBreakpoint_Parameters = {
    breakpointId: BreakpointId;
  };
  export type getPossibleBreakpoints_Parameters = {
    /** Start of range to search possible breakpoint locations in. */
    start: Location;
    /** End of range to search possible breakpoint locations in (excluding). When not specifed, end of scripts is used as end of range. */
    end?: Location;
    /** Only consider locations which are in the same (non-nested) function as start. */
    restrictToFunction?: boolean;
  };
  export type getPossibleBreakpoints_Return = {
    /** List of the possible breakpoint locations. */
    locations: BreakLocation[];
  };
  export type continueToLocation_Parameters = {
    /** Location to continue to. */
    location: Location;
  };
  export type searchInContent_Parameters = {
    /** Id of the script to search in. */
    scriptId: Runtime.ScriptId;
    /** String to search for. */
    query: string;
    /** If true, search is case sensitive. */
    caseSensitive?: boolean;
    /** If true, treats string parameter as regex. */
    isRegex?: boolean;
  };
  export type searchInContent_Return = {
    /** List of search matches. */
    result: SearchMatch[];
  };
  export type setScriptSource_Parameters = {
    /** Id of the script to edit. */
    scriptId: Runtime.ScriptId;
    /** New content of the script. */
    scriptSource: string;
    /**  If true the change will not actually be applied. Dry run may be used to get result description without actually modifying the code. */
    dryRun?: boolean;
  };
  export type setScriptSource_Return = {
    /** New stack trace in case editing has happened while VM was stopped. */
    callFrames?: CallFrame[];
    /** Whether current call stack  was modified after applying the changes. */
    stackChanged?: boolean;
    /** Async stack trace, if any. */
    asyncStackTrace?: Runtime.StackTrace;
    /** Exception details if any. */
    exceptionDetails?: Runtime.ExceptionDetails;
  };
  export type restartFrame_Parameters = {
    /** Call frame identifier to evaluate on. */
    callFrameId: CallFrameId;
  };
  export type restartFrame_Return = {
    /** New stack trace. */
    callFrames: CallFrame[];
    /** Async stack trace, if any. */
    asyncStackTrace?: Runtime.StackTrace;
  };
  export type getScriptSource_Parameters = {
    /** Id of the script to get source for. */
    scriptId: Runtime.ScriptId;
  };
  export type getScriptSource_Return = {
    /** Script source. */
    scriptSource: string;
  };
  export type setPauseOnExceptions_Parameters = {
    /** Pause on exceptions mode. */
    state: "none" | "uncaught" | "all";
  };
  export type evaluateOnCallFrame_Parameters = {
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
    /** Whether to throw an exception if side effect cannot be ruled out during evaluation. */
    throwOnSideEffect?: boolean;
  };
  export type evaluateOnCallFrame_Return = {
    /** Object wrapper for the evaluation result. */
    result: Runtime.RemoteObject;
    /** Exception details. */
    exceptionDetails?: Runtime.ExceptionDetails;
  };
  export type setVariableValue_Parameters = {
    /** 0-based number of scope as was listed in scope chain. Only 'local', 'closure' and 'catch' scope types are allowed. Other scopes could be manipulated manually. */
    scopeNumber: number;
    /** Variable name. */
    variableName: string;
    /** New variable value. */
    newValue: Runtime.CallArgument;
    /** Id of callframe that holds variable. */
    callFrameId: CallFrameId;
  };
  export type setAsyncCallStackDepth_Parameters = {
    /** Maximum depth of async call stacks. Setting to <code>0</code> will effectively disable collecting async call stacks (default). */
    maxDepth: number;
  };
  export type setBlackboxPatterns_Parameters = {
    /** Array of regexps that will be used to check script url for blackbox state. */
    patterns: string[];
  };
  export type setBlackboxedRanges_Parameters = {
    /** Id of the script. */
    scriptId: Runtime.ScriptId;
    positions: ScriptPosition[];
  };
}
/** This domain is deprecated - use Runtime or Log instead. */
export class Console {
  private _messageAdded: Console.messageAdded_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables console domain, sends the messages collected so far to the client by means of the <code>messageAdded</code> notification. */
  enable(): Promise<void> {
    return this._client.send<void>("Console.enable");
  }
  /** Disables console domain, prevents further console messages from being reported to the client. */
  disable(): Promise<void> {
    return this._client.send<void>("Console.disable");
  }
  /** Does nothing. */
  clearMessages(): Promise<void> {
    return this._client.send<void>("Console.clearMessages");
  }
  /** Issued when new console message is added. */
  get messageAdded(): Console.messageAdded_Handler {
    return this._messageAdded;
  }
  set messageAdded(handler: Console.messageAdded_Handler) {
    if (this._messageAdded) {
      this._client.removeListener("Console.messageAdded", this._messageAdded);
    }
    this._messageAdded = handler;
    if (handler) {
      this._client.on("Console.messageAdded", handler);
    }
  }
}
export namespace Console {
  /** Console message. */
  export interface ConsoleMessage {
    /** Message source. */
    source: "xml" | "javascript" | "network" | "console-api" | "storage" | "appcache" | "rendering" | "security" | "other" | "deprecation" | "worker";
    /** Message severity. */
    level: "log" | "warning" | "error" | "debug" | "info";
    /** Message text. */
    text: string;
    /** URL of the message origin. */
    url?: string;
    /** Line number in the resource that generated this message (1-based). */
    line?: number;
    /** Column number in the resource that generated this message (1-based). */
    column?: number;
  }
  export type messageAdded_Parameters = {
    /** Console message that has been added. */
    message: ConsoleMessage;
  };
  export type messageAdded_Handler = (params: messageAdded_Parameters) => void;
}
export class Profiler {
  private _consoleProfileStarted: Profiler.consoleProfileStarted_Handler = undefined;
  private _consoleProfileFinished: Profiler.consoleProfileFinished_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  enable(): Promise<void> {
    return this._client.send<void>("Profiler.enable");
  }
  disable(): Promise<void> {
    return this._client.send<void>("Profiler.disable");
  }
  /** Changes CPU profiler sampling interval. Must be called before CPU profiles recording started. */
  setSamplingInterval(params: Profiler.setSamplingInterval_Parameters): Promise<void> {
    return this._client.send<void>("Profiler.setSamplingInterval", params);
  }
  start(): Promise<void> {
    return this._client.send<void>("Profiler.start");
  }
  stop(): Promise<Profiler.stop_Return> {
    return this._client.send<Profiler.stop_Return>("Profiler.stop");
  }
  /** Enable precise code coverage. Coverage data for JavaScript executed before enabling precise code coverage may be incomplete. Enabling prevents running optimized code and resets execution counters. */
  startPreciseCoverage(params: Profiler.startPreciseCoverage_Parameters): Promise<void> {
    return this._client.send<void>("Profiler.startPreciseCoverage", params);
  }
  /** Disable precise code coverage. Disabling releases unnecessary execution count records and allows executing optimized code. */
  stopPreciseCoverage(): Promise<void> {
    return this._client.send<void>("Profiler.stopPreciseCoverage");
  }
  /** Collect coverage data for the current isolate, and resets execution counters. Precise code coverage needs to have started. */
  takePreciseCoverage(): Promise<Profiler.takePreciseCoverage_Return> {
    return this._client.send<Profiler.takePreciseCoverage_Return>("Profiler.takePreciseCoverage");
  }
  /** Collect coverage data for the current isolate. The coverage data may be incomplete due to garbage collection. */
  getBestEffortCoverage(): Promise<Profiler.getBestEffortCoverage_Return> {
    return this._client.send<Profiler.getBestEffortCoverage_Return>("Profiler.getBestEffortCoverage");
  }
  /** Sent when new profile recodring is started using console.profile() call. */
  get consoleProfileStarted(): Profiler.consoleProfileStarted_Handler {
    return this._consoleProfileStarted;
  }
  set consoleProfileStarted(handler: Profiler.consoleProfileStarted_Handler) {
    if (this._consoleProfileStarted) {
      this._client.removeListener("Profiler.consoleProfileStarted", this._consoleProfileStarted);
    }
    this._consoleProfileStarted = handler;
    if (handler) {
      this._client.on("Profiler.consoleProfileStarted", handler);
    }
  }
  get consoleProfileFinished(): Profiler.consoleProfileFinished_Handler {
    return this._consoleProfileFinished;
  }
  set consoleProfileFinished(handler: Profiler.consoleProfileFinished_Handler) {
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
  /** Specifies a number of samples attributed to a certain source position. */
  export interface PositionTickInfo {
    /** Source line number (1-based). */
    line: number;
    /** Number of samples attributed to the source line. */
    ticks: number;
  }
  /** Coverage data for a source range. */
  export interface CoverageRange {
    /** JavaScript script source offset for the range start. */
    startOffset: number;
    /** JavaScript script source offset for the range end. */
    endOffset: number;
    /** Collected execution count of the source range. */
    count: number;
  }
  /** Coverage data for a JavaScript function. */
  export interface FunctionCoverage {
    /** JavaScript function name. */
    functionName: string;
    /** Source ranges inside the function with coverage data. */
    ranges: CoverageRange[];
  }
  /** Coverage data for a JavaScript script. */
  export interface ScriptCoverage {
    /** JavaScript script id. */
    scriptId: Runtime.ScriptId;
    /** JavaScript script name or url. */
    url: string;
    /** Functions contained in the script that has coverage data. */
    functions: FunctionCoverage[];
  }
  export type consoleProfileStarted_Parameters = {
    id: string;
    /** Location of console.profile(). */
    location: Debugger.Location;
    /** Profile title passed as an argument to console.profile(). */
    title?: string;
  };
  export type consoleProfileStarted_Handler = (params: consoleProfileStarted_Parameters) => void;
  export type consoleProfileFinished_Parameters = {
    id: string;
    /** Location of console.profileEnd(). */
    location: Debugger.Location;
    profile: Profile;
    /** Profile title passed as an argument to console.profile(). */
    title?: string;
  };
  export type consoleProfileFinished_Handler = (params: consoleProfileFinished_Parameters) => void;
  export type setSamplingInterval_Parameters = {
    /** New sampling interval in microseconds. */
    interval: number;
  };
  export type stop_Return = {
    /** Recorded profile. */
    profile: Profile;
  };
  export type startPreciseCoverage_Parameters = {
    /** Collect accurate call counts beyond simple 'covered' or 'not covered'. */
    callCount?: boolean;
  };
  export type takePreciseCoverage_Return = {
    /** Coverage data for the current isolate. */
    result: ScriptCoverage[];
  };
  export type getBestEffortCoverage_Return = {
    /** Coverage data for the current isolate. */
    result: ScriptCoverage[];
  };
}
export class HeapProfiler {
  private _addHeapSnapshotChunk: HeapProfiler.addHeapSnapshotChunk_Handler = undefined;
  private _resetProfiles: HeapProfiler.resetProfiles_Handler = undefined;
  private _reportHeapSnapshotProgress: HeapProfiler.reportHeapSnapshotProgress_Handler = undefined;
  private _lastSeenObjectId: HeapProfiler.lastSeenObjectId_Handler = undefined;
  private _heapStatsUpdate: HeapProfiler.heapStatsUpdate_Handler = undefined;
  private _client: IDebuggingProtocolClient = undefined;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  enable(): Promise<void> {
    return this._client.send<void>("HeapProfiler.enable");
  }
  disable(): Promise<void> {
    return this._client.send<void>("HeapProfiler.disable");
  }
  startTrackingHeapObjects(params: HeapProfiler.startTrackingHeapObjects_Parameters): Promise<void> {
    return this._client.send<void>("HeapProfiler.startTrackingHeapObjects", params);
  }
  stopTrackingHeapObjects(params: HeapProfiler.stopTrackingHeapObjects_Parameters): Promise<void> {
    return this._client.send<void>("HeapProfiler.stopTrackingHeapObjects", params);
  }
  takeHeapSnapshot(params: HeapProfiler.takeHeapSnapshot_Parameters): Promise<void> {
    return this._client.send<void>("HeapProfiler.takeHeapSnapshot", params);
  }
  collectGarbage(): Promise<void> {
    return this._client.send<void>("HeapProfiler.collectGarbage");
  }
  getObjectByHeapObjectId(params: HeapProfiler.getObjectByHeapObjectId_Parameters): Promise<HeapProfiler.getObjectByHeapObjectId_Return> {
    return this._client.send<HeapProfiler.getObjectByHeapObjectId_Return>("HeapProfiler.getObjectByHeapObjectId", params);
  }
  /** Enables console to refer to the node with given id via $x (see Command Line API for more details $x functions). */
  addInspectedHeapObject(params: HeapProfiler.addInspectedHeapObject_Parameters): Promise<void> {
    return this._client.send<void>("HeapProfiler.addInspectedHeapObject", params);
  }
  getHeapObjectId(params: HeapProfiler.getHeapObjectId_Parameters): Promise<HeapProfiler.getHeapObjectId_Return> {
    return this._client.send<HeapProfiler.getHeapObjectId_Return>("HeapProfiler.getHeapObjectId", params);
  }
  startSampling(params: HeapProfiler.startSampling_Parameters): Promise<void> {
    return this._client.send<void>("HeapProfiler.startSampling", params);
  }
  stopSampling(): Promise<HeapProfiler.stopSampling_Return> {
    return this._client.send<HeapProfiler.stopSampling_Return>("HeapProfiler.stopSampling");
  }
  get addHeapSnapshotChunk(): HeapProfiler.addHeapSnapshotChunk_Handler {
    return this._addHeapSnapshotChunk;
  }
  set addHeapSnapshotChunk(handler: HeapProfiler.addHeapSnapshotChunk_Handler) {
    if (this._addHeapSnapshotChunk) {
      this._client.removeListener("HeapProfiler.addHeapSnapshotChunk", this._addHeapSnapshotChunk);
    }
    this._addHeapSnapshotChunk = handler;
    if (handler) {
      this._client.on("HeapProfiler.addHeapSnapshotChunk", handler);
    }
  }
  get resetProfiles(): HeapProfiler.resetProfiles_Handler {
    return this._resetProfiles;
  }
  set resetProfiles(handler: HeapProfiler.resetProfiles_Handler) {
    if (this._resetProfiles) {
      this._client.removeListener("HeapProfiler.resetProfiles", this._resetProfiles);
    }
    this._resetProfiles = handler;
    if (handler) {
      this._client.on("HeapProfiler.resetProfiles", handler);
    }
  }
  get reportHeapSnapshotProgress(): HeapProfiler.reportHeapSnapshotProgress_Handler {
    return this._reportHeapSnapshotProgress;
  }
  set reportHeapSnapshotProgress(handler: HeapProfiler.reportHeapSnapshotProgress_Handler) {
    if (this._reportHeapSnapshotProgress) {
      this._client.removeListener("HeapProfiler.reportHeapSnapshotProgress", this._reportHeapSnapshotProgress);
    }
    this._reportHeapSnapshotProgress = handler;
    if (handler) {
      this._client.on("HeapProfiler.reportHeapSnapshotProgress", handler);
    }
  }
  /** If heap objects tracking has been started then backend regulary sends a current value for last seen object id and corresponding timestamp. If the were changes in the heap since last event then one or more heapStatsUpdate events will be sent before a new lastSeenObjectId event. */
  get lastSeenObjectId(): HeapProfiler.lastSeenObjectId_Handler {
    return this._lastSeenObjectId;
  }
  set lastSeenObjectId(handler: HeapProfiler.lastSeenObjectId_Handler) {
    if (this._lastSeenObjectId) {
      this._client.removeListener("HeapProfiler.lastSeenObjectId", this._lastSeenObjectId);
    }
    this._lastSeenObjectId = handler;
    if (handler) {
      this._client.on("HeapProfiler.lastSeenObjectId", handler);
    }
  }
  /** If heap objects tracking has been started then backend may send update for one or more fragments */
  get heapStatsUpdate(): HeapProfiler.heapStatsUpdate_Handler {
    return this._heapStatsUpdate;
  }
  set heapStatsUpdate(handler: HeapProfiler.heapStatsUpdate_Handler) {
    if (this._heapStatsUpdate) {
      this._client.removeListener("HeapProfiler.heapStatsUpdate", this._heapStatsUpdate);
    }
    this._heapStatsUpdate = handler;
    if (handler) {
      this._client.on("HeapProfiler.heapStatsUpdate", handler);
    }
  }
}
export namespace HeapProfiler {
  /** Heap snapshot object id. */
  export type HeapSnapshotObjectId = string;
  /** Sampling Heap Profile node. Holds callsite information, allocation statistics and child nodes. */
  export interface SamplingHeapProfileNode {
    /** Function location. */
    callFrame: Runtime.CallFrame;
    /** Allocations size in bytes for the node excluding children. */
    selfSize: number;
    /** Child nodes. */
    children: SamplingHeapProfileNode[];
  }
  /** Profile. */
  export interface SamplingHeapProfile {
    head: SamplingHeapProfileNode;
  }
  export type addHeapSnapshotChunk_Parameters = {
    chunk: string;
  };
  export type addHeapSnapshotChunk_Handler = (params: addHeapSnapshotChunk_Parameters) => void;
  export type resetProfiles_Handler = () => void;
  export type reportHeapSnapshotProgress_Parameters = {
    done: number;
    total: number;
    finished?: boolean;
  };
  export type reportHeapSnapshotProgress_Handler = (params: reportHeapSnapshotProgress_Parameters) => void;
  export type lastSeenObjectId_Parameters = {
    lastSeenObjectId: number;
    timestamp: number;
  };
  export type lastSeenObjectId_Handler = (params: lastSeenObjectId_Parameters) => void;
  export type heapStatsUpdate_Parameters = {
    /** An array of triplets. Each triplet describes a fragment. The first integer is the fragment index, the second integer is a total count of objects for the fragment, the third integer is a total size of the objects for the fragment. */
    statsUpdate: number[];
  };
  export type heapStatsUpdate_Handler = (params: heapStatsUpdate_Parameters) => void;
  export type startTrackingHeapObjects_Parameters = {
    trackAllocations?: boolean;
  };
  export type stopTrackingHeapObjects_Parameters = {
    /** If true 'reportHeapSnapshotProgress' events will be generated while snapshot is being taken when the tracking is stopped. */
    reportProgress?: boolean;
  };
  export type takeHeapSnapshot_Parameters = {
    /** If true 'reportHeapSnapshotProgress' events will be generated while snapshot is being taken. */
    reportProgress?: boolean;
  };
  export type getObjectByHeapObjectId_Parameters = {
    objectId: HeapSnapshotObjectId;
    /** Symbolic group name that can be used to release multiple objects. */
    objectGroup?: string;
  };
  export type getObjectByHeapObjectId_Return = {
    /** Evaluation result. */
    result: Runtime.RemoteObject;
  };
  export type addInspectedHeapObject_Parameters = {
    /** Heap snapshot object id to be accessible by means of $x command line API. */
    heapObjectId: HeapSnapshotObjectId;
  };
  export type getHeapObjectId_Parameters = {
    /** Identifier of the object to get heap object id for. */
    objectId: Runtime.RemoteObjectId;
  };
  export type getHeapObjectId_Return = {
    /** Id of the heap snapshot object corresponding to the passed remote object id. */
    heapSnapshotObjectId: HeapSnapshotObjectId;
  };
  export type startSampling_Parameters = {
    /** Average sample interval in bytes. Poisson distribution is used for the intervals. The default value is 32768 bytes. */
    samplingInterval?: number;
  };
  export type stopSampling_Return = {
    /** Recorded sampling heap profile. */
    profile: SamplingHeapProfile;
  };
}
