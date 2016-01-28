/**
 * Generated from protocol chromium/src/third_party/WebKit/Source/devtools/protocol.json (version 1.1)
 */

export interface Inspector {
  /** Enables inspector domain notifications. */
  enable(): Promise<void>;
  /** Disables inspector domain notifications. */
  disable(): Promise<void>;
  evaluateForTestInFrontend: (evt: {
    testCallId: number;
    script: string;
  }) => void;
  inspect: (evt: {
    object: Runtime.RemoteObject;
    hints: any;
  }) => void;
  /** Fired when remote debugging connection is about to be terminated. Contains detach reason. */
  detached: (evt: {
    /** The reason why connection has been terminated. */
    reason: string;
  }) => void;
  /** Fired when debugging target has crashed */
  targetCrashed: () => void;
}
export namespace Inspector {
}
export interface Memory {
  getDOMCounters(): Promise<{
    documents: number;
    nodes: number;
    jsEventListeners: number;
  }>;
  /** Enable/disable suppressing memory pressure notifications in all processes. */
  setPressureNotificationsSuppressed(params: {
    /** If true, memory pressure notifications will be suppressed. */
    suppressed: boolean;
  }): Promise<void>;
  /** Simulate a memory pressure notification in all processes. */
  simulatePressureNotification(params: {
    /** Memory pressure level of the notification. */
    level: Memory.PressureLevel;
  }): Promise<void>;
}
export namespace Memory {
  /** Memory pressure level. */
  export type PressureLevel = "moderate" | "critical";
}
/** Actions and events related to the inspected page belong to the page domain. */
export interface Page {
  /** Enables page domain notifications. */
  enable(): Promise<void>;
  /** Disables page domain notifications. */
  disable(): Promise<void>;
  addScriptToEvaluateOnLoad(params: {
    scriptSource: string;
  }): Promise<{
    /** Identifier of the added script. */
    identifier: Page.ScriptIdentifier;
  }>;
  removeScriptToEvaluateOnLoad(params: {
    identifier: Page.ScriptIdentifier;
  }): Promise<void>;
  /** Reloads given page optionally ignoring the cache. */
  reload(params: {
    /** If true, browser cache is ignored (as if the user pressed Shift+refresh). */
    ignoreCache?: boolean;
    /** If set, the script will be injected into all frames of the inspected page after reload. */
    scriptToEvaluateOnLoad?: string;
  }): Promise<void>;
  /** Navigates current page to the given URL. */
  navigate(params: {
    /** URL to navigate the page to. */
    url: string;
  }): Promise<{
    /** Frame id that will be navigated. */
    frameId: Page.FrameId;
  }>;
  /** Returns navigation history for the current page. */
  getNavigationHistory(params: {
  }): Promise<{
    /** Index of the current navigation history entry. */
    currentIndex: number;
    /** Array of navigation history entries. */
    entries: Page.NavigationEntry[];
  }>;
  /** Navigates current page to the given history entry. */
  navigateToHistoryEntry(params: {
    /** Unique id of the entry to navigate to. */
    entryId: number;
  }): Promise<void>;
  /** Returns all browser cookies. Depending on the backend support, will return detailed cookie information in the <code>cookies</code> field. */
  getCookies(): Promise<{
    /** Array of cookie objects. */
    cookies: Network.Cookie[];
  }>;
  /** Deletes browser cookie with given name, domain and path. */
  deleteCookie(params: {
    /** Name of the cookie to remove. */
    cookieName: string;
    /** URL to match cooke domain and path. */
    url: string;
  }): Promise<void>;
  /** Returns present frame / resource tree structure. */
  getResourceTree(): Promise<{
    /** Present frame / resource tree structure. */
    frameTree: Page.FrameResourceTree;
  }>;
  /** Returns content of the given resource. */
  getResourceContent(params: {
    /** Frame id to get resource for. */
    frameId: Page.FrameId;
    /** URL of the resource to get content for. */
    url: string;
  }): Promise<{
    /** Resource content. */
    content: string;
    /** True, if content was served as base64. */
    base64Encoded: boolean;
  }>;
  /** Searches for given string in resource content. */
  searchInResource(params: {
    /** Frame id for resource to search in. */
    frameId: Page.FrameId;
    /** URL of the resource to search in. */
    url: string;
    /** String to search for. */
    query: string;
    /** If true, search is case sensitive. */
    caseSensitive?: boolean;
    /** If true, treats string parameter as regex. */
    isRegex?: boolean;
  }): Promise<{
    /** List of search matches. */
    result: Debugger.SearchMatch[];
  }>;
  /** Sets given markup as the document's HTML. */
  setDocumentContent(params: {
    /** Frame id to set HTML for. */
    frameId: Page.FrameId;
    /** HTML content to set. */
    html: string;
  }): Promise<void>;
  /** Overrides the values of device screen dimensions (window.screen.width, window.screen.height, window.innerWidth, window.innerHeight, and "device-width"/"device-height"-related CSS media query results). */
  setDeviceMetricsOverride(params: {
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
  }): Promise<void>;
  /** Clears the overriden device metrics. */
  clearDeviceMetricsOverride(): Promise<void>;
  /** Overrides the Geolocation Position or Error. Omitting any of the parameters emulates position unavailable. */
  setGeolocationOverride(params: {
    /** Mock latitude */
    latitude?: number;
    /** Mock longitude */
    longitude?: number;
    /** Mock accuracy */
    accuracy?: number;
  }): Promise<void>;
  /** Clears the overriden Geolocation Position and Error. */
  clearGeolocationOverride(): Promise<void>;
  /** Overrides the Device Orientation. */
  setDeviceOrientationOverride(params: {
    /** Mock alpha */
    alpha: number;
    /** Mock beta */
    beta: number;
    /** Mock gamma */
    gamma: number;
  }): Promise<void>;
  /** Clears the overridden Device Orientation. */
  clearDeviceOrientationOverride(): Promise<void>;
  /** Toggles mouse event-based touch event emulation. */
  setTouchEmulationEnabled(params: {
    /** Whether the touch event emulation should be enabled. */
    enabled: boolean;
    /** Touch/gesture events configuration. Default: current platform. */
    configuration?: "mobile" | "desktop";
  }): Promise<void>;
  /** Capture page screenshot. */
  captureScreenshot(params: {
  }): Promise<{
    /** Base64-encoded image data (PNG). */
    data: string;
  }>;
  /** Starts sending each frame using the <code>screencastFrame</code> event. */
  startScreencast(params: {
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
  }): Promise<void>;
  /** Stops sending each frame in the <code>screencastFrame</code>. */
  stopScreencast(): Promise<void>;
  /** Acknowledges that a screencast frame has been received by the frontend. */
  screencastFrameAck(params: {
    /** Frame number. */
    sessionId: number;
  }): Promise<void>;
  /** Accepts or dismisses a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload). */
  handleJavaScriptDialog(params: {
    /** Whether to accept or dismiss the dialog. */
    accept: boolean;
    /** The text to enter into the dialog prompt before accepting. Used only if this is a prompt dialog. */
    promptText?: string;
  }): Promise<void>;
  /** Shows / hides color picker */
  setColorPickerEnabled(params: {
    /** Shows / hides color picker */
    enabled: boolean;
  }): Promise<void>;
  /** Sets overlay message. */
  setOverlayMessage(params: {
    /** Overlay message to display when paused in debugger. */
    message?: string;
  }): Promise<void>;
  domContentEventFired: (evt: {
    timestamp: number;
  }) => void;
  loadEventFired: (evt: {
    timestamp: number;
  }) => void;
  /** Fired when frame has been attached to its parent. */
  frameAttached: (evt: {
    /** Id of the frame that has been attached. */
    frameId: Page.FrameId;
    /** Parent frame identifier. */
    parentFrameId: Page.FrameId;
  }) => void;
  /** Fired once navigation of the frame has completed. Frame is now associated with the new loader. */
  frameNavigated: (evt: {
    /** Frame object. */
    frame: Page.Frame;
  }) => void;
  /** Fired when frame has been detached from its parent. */
  frameDetached: (evt: {
    /** Id of the frame that has been detached. */
    frameId: Page.FrameId;
  }) => void;
  /** Fired when frame has started loading. */
  frameStartedLoading: (evt: {
    /** Id of the frame that has started loading. */
    frameId: Page.FrameId;
  }) => void;
  /** Fired when frame has stopped loading. */
  frameStoppedLoading: (evt: {
    /** Id of the frame that has stopped loading. */
    frameId: Page.FrameId;
  }) => void;
  /** Fired when frame schedules a potential navigation. */
  frameScheduledNavigation: (evt: {
    /** Id of the frame that has scheduled a navigation. */
    frameId: Page.FrameId;
    /** Delay (in seconds) until the navigation is scheduled to begin. The navigation is not guaranteed to start. */
    delay: number;
  }) => void;
  /** Fired when frame no longer has a scheduled navigation. */
  frameClearedScheduledNavigation: (evt: {
    /** Id of the frame that has cleared its scheduled navigation. */
    frameId: Page.FrameId;
  }) => void;
  frameResized: () => void;
  /** Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) is about to open. */
  javascriptDialogOpening: (evt: {
    /** Message that will be displayed by the dialog. */
    message: string;
    /** Dialog type. */
    type: Page.DialogType;
  }) => void;
  /** Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) has been closed. */
  javascriptDialogClosed: (evt: {
    /** Whether dialog was confirmed. */
    result: boolean;
  }) => void;
  /** Compressed image data requested by the <code>startScreencast</code>. */
  screencastFrame: (evt: {
    /** Base64-encoded compressed image. */
    data: string;
    /** Screencast frame metadata. */
    metadata: Page.ScreencastFrameMetadata;
    /** Frame number. */
    sessionId: number;
  }) => void;
  /** Fired when the page with currently enabled screencast was shown or hidden </code>. */
  screencastVisibilityChanged: (evt: {
    /** True if the page is visible. */
    visible: boolean;
  }) => void;
  /** Fired when a color has been picked. */
  colorPicked: (evt: {
    /** RGBA of the picked color. */
    color: DOM.RGBA;
  }) => void;
  /** Fired when interstitial page was shown */
  interstitialShown: () => void;
  /** Fired when interstitial page was hidden */
  interstitialHidden: () => void;
}
export namespace Page {
  /** Resource type as it was perceived by the rendering engine. */
  export type ResourceType = "Document" | "Stylesheet" | "Image" | "Media" | "Font" | "Script" | "TextTrack" | "XHR" | "Fetch" | "EventSource" | "WebSocket" | "Manifest" | "Other";
  /** Unique frame identifier. */
  export type FrameId = string;
  /** Information about the Frame on the page. */
  export type Frame = {
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
  /** Information about the Frame hierarchy along with their cached resources. */
  export type FrameResourceTree = {
    /** Frame information for this tree item. */
    frame: Frame;
    /** Child frames. */
    childFrames?: FrameResourceTree[];
    /** Information about frame resources. */
    resources: { url: string; type: ResourceType; mimeType: string; failed?: boolean; canceled?: boolean }[];
  }
  /** Unique script identifier. */
  export type ScriptIdentifier = string;
  /** Navigation history entry. */
  export type NavigationEntry = {
    /** Unique id of the navigation history entry. */
    id: number;
    /** URL of the navigation history entry. */
    url: string;
    /** Title of the navigation history entry. */
    title: string;
  }
  /** Screencast frame metadata */
  export type ScreencastFrameMetadata = {
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
  /** Javascript dialog type */
  export type DialogType = "alert" | "confirm" | "prompt" | "beforeunload";
}
/** This domain allows to control rendering of the page. */
export interface Rendering {
  /** Requests that backend shows paint rectangles */
  setShowPaintRects(params: {
    /** True for showing paint rectangles */
    result: boolean;
  }): Promise<void>;
  /** Requests that backend shows debug borders on layers */
  setShowDebugBorders(params: {
    /** True for showing debug borders */
    show: boolean;
  }): Promise<void>;
  /** Requests that backend shows the FPS counter */
  setShowFPSCounter(params: {
    /** True for showing the FPS counter */
    show: boolean;
  }): Promise<void>;
  /** Requests that backend shows scroll bottleneck rects */
  setShowScrollBottleneckRects(params: {
    /** True for showing scroll bottleneck rects */
    show: boolean;
  }): Promise<void>;
}
/** This domain emulates different environments for the page. */
export interface Emulation {
  /** Overrides the values of device screen dimensions (window.screen.width, window.screen.height, window.innerWidth, window.innerHeight, and "device-width"/"device-height"-related CSS media query results). */
  setDeviceMetricsOverride(params: {
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
  }): Promise<void>;
  /** Clears the overriden device metrics. */
  clearDeviceMetricsOverride(): Promise<void>;
  /** Requests that scroll offsets and page scale factor are reset to initial values. */
  resetScrollAndPageScaleFactor(): Promise<void>;
  /** Sets a specified page scale factor. */
  setPageScaleFactor(params: {
    /** Page scale factor. */
    pageScaleFactor: number;
  }): Promise<void>;
  /** Switches script execution in the page. */
  setScriptExecutionDisabled(params: {
    /** Whether script execution should be disabled in the page. */
    value: boolean;
  }): Promise<void>;
  /** Overrides the Geolocation Position or Error. Omitting any of the parameters emulates position unavailable. */
  setGeolocationOverride(params: {
    /** Mock latitude */
    latitude?: number;
    /** Mock longitude */
    longitude?: number;
    /** Mock accuracy */
    accuracy?: number;
  }): Promise<void>;
  /** Clears the overriden Geolocation Position and Error. */
  clearGeolocationOverride(): Promise<void>;
  /** Toggles mouse event-based touch event emulation. */
  setTouchEmulationEnabled(params: {
    /** Whether the touch event emulation should be enabled. */
    enabled: boolean;
    /** Touch/gesture events configuration. Default: current platform. */
    configuration?: "mobile" | "desktop";
  }): Promise<void>;
  /** Emulates the given media for CSS media queries. */
  setEmulatedMedia(params: {
    /** Media type to emulate. Empty string disables the override. */
    media: string;
  }): Promise<void>;
  /** Enables CPU throttling to emulate slow CPUs. */
  setCPUThrottlingRate(params: {
    /** Throttling rate as a slowdown factor (1 is no throttle, 2 is 2x slowdown, etc). */
    rate: number;
  }): Promise<void>;
  /** Tells whether emulation is supported. */
  canEmulate(): Promise<{
    /** True if emulation is supported. */
    result: boolean;
  }>;
  /** Fired when a visible page viewport has changed. Only fired when device metrics are overridden. */
  viewportChanged: (evt: {
    /** Viewport description. */
    viewport: Emulation.Viewport;
  }) => void;
}
export namespace Emulation {
  /** Visible page viewport */
  export type Viewport = {
    /** X scroll offset in CSS pixels. */
    scrollX: number;
    /** Y scroll offset in CSS pixels. */
    scrollY: number;
    /** Contents width in CSS pixels. */
    contentsWidth: number;
    /** Contents height in CSS pixels. */
    contentsHeight: number;
    /** Page scale factor. */
    pageScaleFactor: number;
    /** Minimum page scale factor. */
    minimumPageScaleFactor: number;
    /** Maximum page scale factor. */
    maximumPageScaleFactor: number;
  }
}
/** Runtime domain exposes JavaScript runtime by means of remote evaluation and mirror objects. Evaluation results are returned as mirror object that expose object type, string representation and unique identifier that can be used for further object reference. Original objects are maintained in memory unless they are either explicitly released or are released along with the other objects in their object group. */
export interface Runtime {
  /** Evaluates expression on global object. */
  evaluate(params: {
    /** Expression to evaluate. */
    expression: string;
    /** Symbolic group name that can be used to release multiple objects. */
    objectGroup?: string;
    /** Determines whether Command Line API should be available during the evaluation. */
    includeCommandLineAPI?: boolean;
    /** Specifies whether evaluation should stop on exceptions and mute console. Overrides setPauseOnException state. */
    doNotPauseOnExceptionsAndMuteConsole?: boolean;
    /** Specifies in which isolated context to perform evaluation. Each content script lives in an isolated context and this parameter may be used to specify one of those contexts. If the parameter is omitted or 0 the evaluation will be performed in the context of the inspected page. */
    contextId?: Runtime.ExecutionContextId;
    /** Whether the result is expected to be a JSON object that should be sent by value. */
    returnByValue?: boolean;
    /** Whether preview should be generated for the result. */
    generatePreview?: boolean;
  }): Promise<{
    /** Evaluation result. */
    result: Runtime.RemoteObject;
    /** True if the result was thrown during the evaluation. */
    wasThrown?: boolean;
    /** Exception details. */
    exceptionDetails?: Debugger.ExceptionDetails;
  }>;
  /** Calls function with given declaration on the given object. Object group of the result is inherited from the target object. */
  callFunctionOn(params: {
    /** Identifier of the object to call function on. */
    objectId: Runtime.RemoteObjectId;
    /** Declaration of the function to call. */
    functionDeclaration: string;
    /** Call arguments. All call arguments must belong to the same JavaScript world as the target object. */
    arguments?: Runtime.CallArgument[];
    /** Specifies whether function call should stop on exceptions and mute console. Overrides setPauseOnException state. */
    doNotPauseOnExceptionsAndMuteConsole?: boolean;
    /** Whether the result is expected to be a JSON object which should be sent by value. */
    returnByValue?: boolean;
    /** Whether preview should be generated for the result. */
    generatePreview?: boolean;
  }): Promise<{
    /** Call result. */
    result: Runtime.RemoteObject;
    /** True if the result was thrown during the evaluation. */
    wasThrown?: boolean;
  }>;
  /** Returns properties of a given object. Object group of the result is inherited from the target object. */
  getProperties(params: {
    /** Identifier of the object to return properties for. */
    objectId: Runtime.RemoteObjectId;
    /** If true, returns properties belonging only to the element itself, not to its prototype chain. */
    ownProperties?: boolean;
    /** If true, returns accessor properties (with getter/setter) only; internal properties are not returned either. */
    accessorPropertiesOnly?: boolean;
    /** Whether preview should be generated for the results. */
    generatePreview?: boolean;
  }): Promise<{
    /** Object properties. */
    result: Runtime.PropertyDescriptor[];
    /** Internal object properties (only of the element itself). */
    internalProperties?: Runtime.InternalPropertyDescriptor[];
    /** Exception details. */
    exceptionDetails?: Debugger.ExceptionDetails;
  }>;
  /** Releases remote object with given id. */
  releaseObject(params: {
    /** Identifier of the object to release. */
    objectId: Runtime.RemoteObjectId;
  }): Promise<void>;
  /** Releases all remote objects that belong to a given group. */
  releaseObjectGroup(params: {
    /** Symbolic object group name. */
    objectGroup: string;
  }): Promise<void>;
  /** Tells inspected instance(worker or page) that it can run in case it was started paused. */
  run(): Promise<void>;
  /** Enables reporting of execution contexts creation by means of <code>executionContextCreated</code> event. When the reporting gets enabled the event will be sent immediately for each existing execution context. */
  enable(): Promise<void>;
  /** Disables reporting of execution contexts creation. */
  disable(): Promise<void>;
  isRunRequired(): Promise<{
    /** True if the Runtime is in paused on start state. */
    result: boolean;
  }>;
  setCustomObjectFormatterEnabled(params: {
    enabled: boolean;
  }): Promise<void>;
  /** Issued when new execution context is created. */
  executionContextCreated: (evt: {
    /** A newly created execution contex. */
    context: Runtime.ExecutionContextDescription;
  }) => void;
  /** Issued when execution context is destroyed. */
  executionContextDestroyed: (evt: {
    /** Id of the destroyed context */
    executionContextId: Runtime.ExecutionContextId;
  }) => void;
  /** Issued when all executionContexts were cleared in browser */
  executionContextsCleared: () => void;
}
export namespace Runtime {
  /** Unique object identifier. */
  export type RemoteObjectId = string;
  /** Mirror object referencing original JavaScript object. */
  export type RemoteObject = {
    /** Object type. */
    type: "object" | "function" | "undefined" | "string" | "number" | "boolean" | "symbol";
    /** Object subtype hint. Specified for <code>object</code> type values only. */
    subtype?: "array" | "null" | "node" | "regexp" | "date" | "map" | "set" | "iterator" | "generator" | "error";
    /** Object class (constructor) name. Specified for <code>object</code> type values only. */
    className?: string;
    /** Remote object value in case of primitive values or JSON values (if it was requested), or description string if the value can not be JSON-stringified (like NaN, Infinity, -Infinity, -0). */
    value?: any;
    /** String representation of the object. */
    description?: string;
    /** Unique object identifier (for non-primitive values). */
    objectId?: RemoteObjectId;
    /** Preview containing abbreviated property values. Specified for <code>object</code> type values only. */
    preview?: ObjectPreview;
    customPreview?: CustomPreview;
  }
  export type CustomPreview = {
    header: string;
    hasBody: boolean;
    formatterObjectId: RemoteObjectId;
    configObjectId?: RemoteObjectId;
  }
  /** Object containing abbreviated remote object value. */
  export type ObjectPreview = {
    /** Object type. */
    type: "object" | "function" | "undefined" | "string" | "number" | "boolean" | "symbol";
    /** Object subtype hint. Specified for <code>object</code> type values only. */
    subtype?: "array" | "null" | "node" | "regexp" | "date" | "map" | "set" | "iterator" | "generator" | "error";
    /** String representation of the object. */
    description?: string;
    /** Determines whether preview is lossless (contains all information of the original object). */
    lossless: boolean;
    /** True iff some of the properties or entries of the original object did not fit. */
    overflow: boolean;
    /** List of the properties. */
    properties: PropertyPreview[];
    /** List of the entries. Specified for <code>map</code> and <code>set</code> subtype values only. */
    entries?: EntryPreview[];
  }
  export type PropertyPreview = {
    /** Property name. */
    name: string;
    /** Object type. Accessor means that the property itself is an accessor property. */
    type: "object" | "function" | "undefined" | "string" | "number" | "boolean" | "symbol" | "accessor";
    /** User-friendly property value string. */
    value?: string;
    /** Nested value preview. */
    valuePreview?: ObjectPreview;
    /** Object subtype hint. Specified for <code>object</code> type values only. */
    subtype?: "array" | "null" | "node" | "regexp" | "date" | "map" | "set" | "iterator" | "generator" | "error";
  }
  export type EntryPreview = {
    /** Preview of the key. Specified for map-like collection entries. */
    key?: ObjectPreview;
    /** Preview of the value. */
    value: ObjectPreview;
  }
  /** Object property descriptor. */
  export type PropertyDescriptor = {
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
  export type InternalPropertyDescriptor = {
    /** Conventional property name. */
    name: string;
    /** The value associated with the property. */
    value?: RemoteObject;
  }
  /** Represents function call argument. Either remote object id <code>objectId</code> or primitive <code>value</code> or neither of (for undefined) them should be specified. */
  export type CallArgument = {
    /** Primitive value, or description string if the value can not be JSON-stringified (like NaN, Infinity, -Infinity, -0). */
    value?: any;
    /** Remote object handle. */
    objectId?: RemoteObjectId;
    /** Object type. */
    type?: "object" | "function" | "undefined" | "string" | "number" | "boolean" | "symbol";
  }
  /** Id of an execution context. */
  export type ExecutionContextId = number;
  /** Description of an isolated world. */
  export type ExecutionContextDescription = {
    /** Unique id of the execution context. It can be used to specify in which execution context script evaluation should be performed. */
    id: ExecutionContextId;
    /** Context type. It is used e.g. to distinguish content scripts from web page script. */
    type?: string;
    /** Execution context origin. */
    origin: string;
    /** Human readable name describing given context. */
    name: string;
    /** Id of the owning frame. May be an empty string if the context is not associated with a frame. */
    frameId: string;
  }
}
/** Console domain defines methods and events for interaction with the JavaScript console. Console collects messages created by means of the <a href='http://getfirebug.com/wiki/index.php/Console_API'>JavaScript Console API</a>. One needs to enable this domain using <code>enable</code> command in order to start receiving the console messages. Browser collects messages issued while console domain is not enabled as well and reports them using <code>messageAdded</code> notification upon enabling. */
export interface Console {
  /** Enables console domain, sends the messages collected so far to the client by means of the <code>messageAdded</code> notification. */
  enable(): Promise<void>;
  /** Disables console domain, prevents further console messages from being reported to the client. */
  disable(): Promise<void>;
  /** Clears console messages collected in the browser. */
  clearMessages(): Promise<void>;
  /** Issued when new console message is added. */
  messageAdded: (evt: {
    /** Console message that has been added. */
    message: Console.ConsoleMessage;
  }) => void;
  /** Is not issued. Will be gone in the future versions of the protocol. */
  messageRepeatCountUpdated: (evt: {
    /** New repeat count value. */
    count: number;
    /** Timestamp of most recent message in batch. */
    timestamp: Console.Timestamp;
  }) => void;
  /** Issued when console is cleared. This happens either upon <code>clearMessages</code> command or after page navigation. */
  messagesCleared: () => void;
}
export namespace Console {
  /** Number of seconds since epoch. */
  export type Timestamp = number;
  /** Console message. */
  export type ConsoleMessage = {
    /** Message source. */
    source: "xml" | "javascript" | "network" | "console-api" | "storage" | "appcache" | "rendering" | "security" | "other" | "deprecation";
    /** Message severity. */
    level: "log" | "warning" | "error" | "debug" | "info" | "revokedError";
    /** Message text. */
    text: string;
    /** Console message type. */
    type?: "log" | "dir" | "dirxml" | "table" | "trace" | "clear" | "startGroup" | "startGroupCollapsed" | "endGroup" | "assert" | "profile" | "profileEnd";
    /** Script ID of the message origin. */
    scriptId?: string;
    /** URL of the message origin. */
    url?: string;
    /** Line number in the resource that generated this message. */
    line?: number;
    /** Column number in the resource that generated this message. */
    column?: number;
    /** Repeat count for repeated messages. */
    repeatCount?: number;
    /** Message parameters in case of the formatted message. */
    parameters?: Runtime.RemoteObject[];
    /** JavaScript stack trace for assertions and error messages. */
    stackTrace?: StackTrace;
    /** Asynchronous JavaScript stack trace that preceded this message, if available. */
    asyncStackTrace?: AsyncStackTrace;
    /** Identifier of the network request associated with this message. */
    networkRequestId?: Network.RequestId;
    /** Timestamp, when this message was fired. */
    timestamp: Timestamp;
    /** Identifier of the context where this message was created */
    executionContextId?: Runtime.ExecutionContextId;
    /** Message id. */
    messageId?: number;
    /** Related message id. */
    relatedMessageId?: number;
  }
  /** Stack entry for console errors and assertions. */
  export type CallFrame = {
    /** JavaScript function name. */
    functionName: string;
    /** JavaScript script id. */
    scriptId: string;
    /** JavaScript script name or url. */
    url: string;
    /** JavaScript script line number. */
    lineNumber: number;
    /** JavaScript script column number. */
    columnNumber: number;
  }
  /** Call frames for assertions or error messages. */
  export type StackTrace = CallFrame[];
  /** Asynchronous JavaScript call stack. */
  export type AsyncStackTrace = {
    /** Call frames of the stack trace. */
    callFrames: CallFrame[];
    /** String label of this stack trace. For async traces this may be a name of the function that initiated the async call. */
    description?: string;
    /** Next asynchronous stack trace, if any. */
    asyncStackTrace?: AsyncStackTrace;
  }
}
/** Security */
export interface Security {
  /** Enables tracking security state changes. */
  enable(): Promise<void>;
  /** Disables tracking security state changes. */
  disable(): Promise<void>;
  /** The security state of the page changed. */
  securityStateChanged: (evt: {
    /** Security state. */
    securityState: Security.SecurityState;
    /** List of explanations for the security state. If the overall security state is `insecure` or `warning`, at least one corresponding explanation should be included. */
    explanations?: Security.SecurityStateExplanation[];
    /** Information about mixed content on the page. */
    mixedContentStatus?: Security.MixedContentStatus;
    /** True if the page was loaded over cryptographic transport such as HTTPS. */
    schemeIsCryptographic?: boolean;
  }) => void;
}
export namespace Security {
  /** The security level of a page or resource. */
  export type SecurityState = "unknown" | "neutral" | "insecure" | "warning" | "secure" | "info";
  /** An explanation of an factor contributing to the security state. */
  export type SecurityStateExplanation = {
    /** Security state representing the severity of the factor being explained. */
    securityState: SecurityState;
    /** Short phrase describing the type of factor. */
    summary: string;
    /** Full text explanation of the factor. */
    description: string;
    /** Associated certificate id. */
    certificateId?: Network.CertificateId;
  }
  /** Information about mixed content on the page. */
  export type MixedContentStatus = {
    /** True if the page ran insecure content such as scripts. */
    ranInsecureContent: boolean;
    /** True if the page displayed insecure content such as images. */
    displayedInsecureContent: boolean;
    /** Security state representing a page that ran insecure content. */
    ranInsecureContentStyle: SecurityState;
    /** Security state representing a page that displayed insecure content. */
    displayedInsecureContentStyle: SecurityState;
  }
}
/** Network domain allows tracking network activities of the page. It exposes information about http, file, data and other requests and responses, their headers, bodies, timing, etc. */
export interface Network {
  /** Enables network tracking, network events will now be delivered to the client. */
  enable(): Promise<void>;
  /** Disables network tracking, prevents network events from being sent to the client. */
  disable(): Promise<void>;
  /** Allows overriding user agent with the given string. */
  setUserAgentOverride(params: {
    /** User agent to use. */
    userAgent: string;
  }): Promise<void>;
  /** Specifies whether to always send extra HTTP headers with the requests from this page. */
  setExtraHTTPHeaders(params: {
    /** Map with extra HTTP headers. */
    headers: Network.Headers;
  }): Promise<void>;
  /** Returns content served for the given request. */
  getResponseBody(params: {
    /** Identifier of the network request to get content for. */
    requestId: Network.RequestId;
  }): Promise<{
    /** Response body. */
    body: string;
    /** True, if content was sent as base64. */
    base64Encoded: boolean;
  }>;
  /** Blocks specific URL from loading. */
  addBlockedURL(params: {
    /** URL to block. */
    url: string;
  }): Promise<void>;
  /** Cancels blocking of a specific URL from loading. */
  removeBlockedURL(params: {
    /** URL to stop blocking. */
    url: string;
  }): Promise<void>;
  /** This method sends a new XMLHttpRequest which is identical to the original one. The following parameters should be identical: method, url, async, request body, extra headers, withCredentials attribute, user, password. */
  replayXHR(params: {
    /** Identifier of XHR to replay. */
    requestId: Network.RequestId;
  }): Promise<void>;
  /** Toggles monitoring of XMLHttpRequest. If <code>true</code>, console will receive messages upon each XHR issued. */
  setMonitoringXHREnabled(params: {
    /** Monitoring enabled state. */
    enabled: boolean;
  }): Promise<void>;
  /** Tells whether clearing browser cache is supported. */
  canClearBrowserCache(): Promise<{
    /** True if browser cache can be cleared. */
    result: boolean;
  }>;
  /** Clears browser cache. */
  clearBrowserCache(): Promise<void>;
  /** Tells whether clearing browser cookies is supported. */
  canClearBrowserCookies(): Promise<{
    /** True if browser cookies can be cleared. */
    result: boolean;
  }>;
  /** Clears browser cookies. */
  clearBrowserCookies(): Promise<void>;
  /** Returns all browser cookies. Depending on the backend support, will return detailed cookie information in the <code>cookies</code> field. */
  getCookies(): Promise<{
    /** Array of cookie objects. */
    cookies: Network.Cookie[];
  }>;
  /** Deletes browser cookie with given name, domain and path. */
  deleteCookie(params: {
    /** Name of the cookie to remove. */
    cookieName: string;
    /** URL to match cooke domain and path. */
    url: string;
  }): Promise<void>;
  /** Tells whether emulation of network conditions is supported. */
  canEmulateNetworkConditions(): Promise<{
    /** True if emulation of network conditions is supported. */
    result: boolean;
  }>;
  /** Activates emulation of network conditions. */
  emulateNetworkConditions(params: {
    /** True to emulate internet disconnection. */
    offline: boolean;
    /** Additional latency (ms). */
    latency: number;
    /** Maximal aggregated download throughput. */
    downloadThroughput: number;
    /** Maximal aggregated upload throughput. */
    uploadThroughput: number;
  }): Promise<void>;
  /** Toggles ignoring cache for each request. If <code>true</code>, cache will not be used. */
  setCacheDisabled(params: {
    /** Cache disabled state. */
    cacheDisabled: boolean;
  }): Promise<void>;
  /** For testing. */
  setDataSizeLimitsForTest(params: {
    /** Maximum total buffer size. */
    maxTotalSize: number;
    /** Maximum per-resource size. */
    maxResourceSize: number;
  }): Promise<void>;
  /** Returns details for the given certificate. */
  getCertificateDetails(params: {
    /** ID of the certificate to get details for. */
    certificateId: Network.CertificateId;
  }): Promise<{
    /** Certificate details. */
    result: Network.CertificateDetails;
  }>;
  /** Displays native dialog with the certificate details. */
  showCertificateViewer(params: {
    /** Certificate id. */
    certificateId: Network.CertificateId;
  }): Promise<void>;
  /** Fired when page is about to send HTTP request. */
  requestWillBeSent: (evt: {
    /** Request identifier. */
    requestId: Network.RequestId;
    /** Frame identifier. */
    frameId: Page.FrameId;
    /** Loader identifier. */
    loaderId: Network.LoaderId;
    /** URL of the document this request is loaded for. */
    documentURL: string;
    /** Request data. */
    request: Network.Request;
    /** Timestamp. */
    timestamp: Network.Timestamp;
    /** UTC Timestamp. */
    wallTime: Network.Timestamp;
    /** Request initiator. */
    initiator: Network.Initiator;
    /** Redirect response data. */
    redirectResponse?: Network.Response;
    /** Type of this resource. */
    type?: Page.ResourceType;
  }) => void;
  /** Fired if request ended up loading from cache. */
  requestServedFromCache: (evt: {
    /** Request identifier. */
    requestId: Network.RequestId;
  }) => void;
  /** Fired when HTTP response is available. */
  responseReceived: (evt: {
    /** Request identifier. */
    requestId: Network.RequestId;
    /** Frame identifier. */
    frameId: Page.FrameId;
    /** Loader identifier. */
    loaderId: Network.LoaderId;
    /** Timestamp. */
    timestamp: Network.Timestamp;
    /** Resource type. */
    type: Page.ResourceType;
    /** Response data. */
    response: Network.Response;
  }) => void;
  /** Fired when data chunk was received over the network. */
  dataReceived: (evt: {
    /** Request identifier. */
    requestId: Network.RequestId;
    /** Timestamp. */
    timestamp: Network.Timestamp;
    /** Data chunk length. */
    dataLength: number;
    /** Actual bytes received (might be less than dataLength for compressed encodings). */
    encodedDataLength: number;
  }) => void;
  /** Fired when HTTP request has finished loading. */
  loadingFinished: (evt: {
    /** Request identifier. */
    requestId: Network.RequestId;
    /** Timestamp. */
    timestamp: Network.Timestamp;
    /** Total number of bytes received for this request. */
    encodedDataLength: number;
  }) => void;
  /** Fired when HTTP request has failed to load. */
  loadingFailed: (evt: {
    /** Request identifier. */
    requestId: Network.RequestId;
    /** Timestamp. */
    timestamp: Network.Timestamp;
    /** Resource type. */
    type: Page.ResourceType;
    /** User friendly error message. */
    errorText: string;
    /** True if loading was canceled. */
    canceled?: boolean;
    /** The reason why loading was blocked, if any. */
    blockedReason?: Network.BlockedReason;
  }) => void;
  /** Fired when WebSocket is about to initiate handshake. */
  webSocketWillSendHandshakeRequest: (evt: {
    /** Request identifier. */
    requestId: Network.RequestId;
    /** Timestamp. */
    timestamp: Network.Timestamp;
    /** UTC Timestamp. */
    wallTime: Network.Timestamp;
    /** WebSocket request data. */
    request: Network.WebSocketRequest;
  }) => void;
  /** Fired when WebSocket handshake response becomes available. */
  webSocketHandshakeResponseReceived: (evt: {
    /** Request identifier. */
    requestId: Network.RequestId;
    /** Timestamp. */
    timestamp: Network.Timestamp;
    /** WebSocket response data. */
    response: Network.WebSocketResponse;
  }) => void;
  /** Fired upon WebSocket creation. */
  webSocketCreated: (evt: {
    /** Request identifier. */
    requestId: Network.RequestId;
    /** WebSocket request URL. */
    url: string;
  }) => void;
  /** Fired when WebSocket is closed. */
  webSocketClosed: (evt: {
    /** Request identifier. */
    requestId: Network.RequestId;
    /** Timestamp. */
    timestamp: Network.Timestamp;
  }) => void;
  /** Fired when WebSocket frame is received. */
  webSocketFrameReceived: (evt: {
    /** Request identifier. */
    requestId: Network.RequestId;
    /** Timestamp. */
    timestamp: Network.Timestamp;
    /** WebSocket response data. */
    response: Network.WebSocketFrame;
  }) => void;
  /** Fired when WebSocket frame error occurs. */
  webSocketFrameError: (evt: {
    /** Request identifier. */
    requestId: Network.RequestId;
    /** Timestamp. */
    timestamp: Network.Timestamp;
    /** WebSocket frame error message. */
    errorMessage: string;
  }) => void;
  /** Fired when WebSocket frame is sent. */
  webSocketFrameSent: (evt: {
    /** Request identifier. */
    requestId: Network.RequestId;
    /** Timestamp. */
    timestamp: Network.Timestamp;
    /** WebSocket response data. */
    response: Network.WebSocketFrame;
  }) => void;
  /** Fired when EventSource message is received. */
  eventSourceMessageReceived: (evt: {
    /** Request identifier. */
    requestId: Network.RequestId;
    /** Timestamp. */
    timestamp: Network.Timestamp;
    /** Message type. */
    eventName: string;
    /** Message identifier. */
    eventId: string;
    /** Message content. */
    data: string;
  }) => void;
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
  /** Timing information for the request. */
  export type ResourceTiming = {
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
    /** Finished receiving response headers. */
    receiveHeadersEnd: number;
  }
  /** Loading priority of a resource request. */
  export type ResourcePriority = "VeryLow" | "Low" | "Medium" | "High" | "VeryHigh";
  /** HTTP request data. */
  export type Request = {
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
  /** An internal certificate ID value. */
  export type CertificateId = number;
  /** Subject of a certificate. */
  export type CertificateSubject = {
    /** Certificate subject name. */
    name: string;
    /** Subject Alternative Name (SAN) DNS names. */
    sanDnsNames: string[];
    /** Subject Alternative Name (SAN) IP addresses. */
    sanIpAddresses: string[];
  }
  /** Details about a request's certificate. */
  export type CertificateDetails = {
    /** Certificate subject. */
    subject: CertificateSubject;
    /** Name of the issuing CA. */
    issuer: string;
    /** Certificate valid from date. */
    validFrom: Timestamp;
    /** Certificate valid to (expiration) date */
    validTo: Timestamp;
  }
  /** Security details about a request. */
  export type SecurityDetails = {
    /** Protocol name (e.g. "TLS 1.2" or "QUIC"). */
    protocol: string;
    /** Key Exchange used by the connection. */
    keyExchange: string;
    /** Cipher name. */
    cipher: string;
    /** TLS MAC. Note that AEAD ciphers do not have separate MACs. */
    mac?: string;
    /** Certificate ID value. */
    certificateId: CertificateId;
  }
  /** The reason why request was blocked. */
  export type BlockedReason = "csp" | "mixed-content" | "origin" | "inspector" | "other";
  /** HTTP response data. */
  export type Response = {
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
  export type WebSocketRequest = {
    /** HTTP request headers. */
    headers: Headers;
  }
  /** WebSocket response data. */
  export type WebSocketResponse = {
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
  export type WebSocketFrame = {
    /** WebSocket frame opcode. */
    opcode: number;
    /** WebSocke frame mask. */
    mask: boolean;
    /** WebSocke frame payload data. */
    payloadData: string;
  }
  /** Information about the cached resource. */
  export type CachedResource = {
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
  export type Initiator = {
    /** Type of this initiator. */
    type: "parser" | "script" | "other";
    /** Initiator JavaScript stack trace, set for Script only. */
    stackTrace?: Console.StackTrace;
    /** Initiator URL, set for Parser type only. */
    url?: string;
    /** Initiator line number, set for Parser type only. */
    lineNumber?: number;
    /** Initiator asynchronous JavaScript stack trace, if available. */
    asyncStackTrace?: Console.AsyncStackTrace;
  }
  /** Cookie object */
  export type Cookie = {
    /** Cookie name. */
    name: string;
    /** Cookie value. */
    value: string;
    /** Cookie domain. */
    domain: string;
    /** Cookie path. */
    path: string;
    /** Cookie expires. */
    expires: number;
    /** Cookie size. */
    size: number;
    /** True if cookie is http-only. */
    httpOnly: boolean;
    /** True if cookie is secure. */
    secure: boolean;
    /** True in case of session cookie. */
    session: boolean;
  }
}
export interface Database {
  /** Enables database tracking, database events will now be delivered to the client. */
  enable(): Promise<void>;
  /** Disables database tracking, prevents database events from being sent to the client. */
  disable(): Promise<void>;
  getDatabaseTableNames(params: {
    databaseId: Database.DatabaseId;
  }): Promise<{
    tableNames: string[];
  }>;
  executeSQL(params: {
    databaseId: Database.DatabaseId;
    query: string;
  }): Promise<{
    columnNames?: string[];
    values?: any[];
    sqlError?: Database.Error;
  }>;
  addDatabase: (evt: {
    database: Database.Database;
  }) => void;
}
export namespace Database {
  /** Unique identifier of Database object. */
  export type DatabaseId = string;
  /** Database object. */
  export type Database = {
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
  export type Error = {
    /** Error message. */
    message: string;
    /** Error code. */
    code: number;
  }
}
export interface IndexedDB {
  /** Enables events from backend. */
  enable(): Promise<void>;
  /** Disables events from backend. */
  disable(): Promise<void>;
  /** Requests database names for given security origin. */
  requestDatabaseNames(params: {
    /** Security origin. */
    securityOrigin: string;
  }): Promise<{
    /** Database names for origin. */
    databaseNames: string[];
  }>;
  /** Requests database with given name in given frame. */
  requestDatabase(params: {
    /** Security origin. */
    securityOrigin: string;
    /** Database name. */
    databaseName: string;
  }): Promise<{
    /** Database with an array of object stores. */
    databaseWithObjectStores: IndexedDB.DatabaseWithObjectStores;
  }>;
  /** Requests data from object store or index. */
  requestData(params: {
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
    keyRange?: IndexedDB.KeyRange;
  }): Promise<{
    /** Array of object store data entries. */
    objectStoreDataEntries: IndexedDB.DataEntry[];
    /** If true, there are more entries to fetch in the given range. */
    hasMore: boolean;
  }>;
  /** Clears all entries from an object store. */
  clearObjectStore(params: {
    /** Security origin. */
    securityOrigin: string;
    /** Database name. */
    databaseName: string;
    /** Object store name. */
    objectStoreName: string;
  }): Promise<{
  }>;
}
export namespace IndexedDB {
  /** Database with an array of object stores. */
  export type DatabaseWithObjectStores = {
    /** Database name. */
    name: string;
    /** Deprecated string database version. */
    version: string;
    /** Integer database version. */
    intVersion: number;
    /** Object stores in this database. */
    objectStores: ObjectStore[];
  }
  /** Object store. */
  export type ObjectStore = {
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
  export type ObjectStoreIndex = {
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
  export type Key = {
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
  export type KeyRange = {
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
  export type DataEntry = {
    /** JSON-stringified key object. */
    key: string;
    /** JSON-stringified primary key object. */
    primaryKey: string;
    /** JSON-stringified value object. */
    value: string;
  }
  /** Key path. */
  export type KeyPath = {
    /** Key path type. */
    type: "null" | "string" | "array";
    /** String value. */
    string?: string;
    /** Array value. */
    array?: string[];
  }
}
export interface CacheStorage {
  /** Requests cache names. */
  requestCacheNames(params: {
    /** Security origin. */
    securityOrigin: string;
  }): Promise<{
    /** Caches for the security origin. */
    caches: CacheStorage.Cache[];
  }>;
  /** Requests data from cache. */
  requestEntries(params: {
    /** ID of cache to get entries from. */
    cacheId: CacheStorage.CacheId;
    /** Number of records to skip. */
    skipCount: number;
    /** Number of records to fetch. */
    pageSize: number;
  }): Promise<{
    /** Array of object store data entries. */
    cacheDataEntries: CacheStorage.DataEntry[];
    /** If true, there are more entries to fetch in the given range. */
    hasMore: boolean;
  }>;
  /** Deletes a cache. */
  deleteCache(params: {
    /** Id of cache for deletion. */
    cacheId: CacheStorage.CacheId;
  }): Promise<void>;
  /** Deletes a cache entry. */
  deleteEntry(params: {
    /** Id of cache where the entry will be deleted. */
    cacheId: CacheStorage.CacheId;
    /** URL spec of the request. */
    request: string;
  }): Promise<void>;
}
export namespace CacheStorage {
  /** Unique identifier of the Cache object. */
  export type CacheId = string;
  /** Data entry. */
  export type DataEntry = {
    /** Request url spec. */
    request: string;
    /** Response stataus text. */
    response: string;
  }
  /** Cache identifier. */
  export type Cache = {
    /** An opaque unique id of the cache. */
    cacheId: CacheId;
    /** Security origin of the cache. */
    securityOrigin: string;
    /** The name of the cache. */
    cacheName: string;
  }
}
/** Query and modify DOM storage. */
export interface DOMStorage {
  /** Enables storage tracking, storage events will now be delivered to the client. */
  enable(): Promise<void>;
  /** Disables storage tracking, prevents storage events from being sent to the client. */
  disable(): Promise<void>;
  getDOMStorageItems(params: {
    storageId: DOMStorage.StorageId;
  }): Promise<{
    entries: DOMStorage.Item[];
  }>;
  setDOMStorageItem(params: {
    storageId: DOMStorage.StorageId;
    key: string;
    value: string;
  }): Promise<void>;
  removeDOMStorageItem(params: {
    storageId: DOMStorage.StorageId;
    key: string;
  }): Promise<void>;
  domStorageItemsCleared: (evt: {
    storageId: DOMStorage.StorageId;
  }) => void;
  domStorageItemRemoved: (evt: {
    storageId: DOMStorage.StorageId;
    key: string;
  }) => void;
  domStorageItemAdded: (evt: {
    storageId: DOMStorage.StorageId;
    key: string;
    newValue: string;
  }) => void;
  domStorageItemUpdated: (evt: {
    storageId: DOMStorage.StorageId;
    key: string;
    oldValue: string;
    newValue: string;
  }) => void;
}
export namespace DOMStorage {
  /** DOM Storage identifier. */
  export type StorageId = {
    /** Security origin for the storage. */
    securityOrigin: string;
    /** Whether the storage is local storage (not session storage). */
    isLocalStorage: boolean;
  }
  /** DOM Storage item. */
  export type Item = string[];
}
export interface ApplicationCache {
  /** Returns array of frame identifiers with manifest urls for each frame containing a document associated with some application cache. */
  getFramesWithManifests(): Promise<{
    /** Array of frame identifiers with manifest urls for each frame containing a document associated with some application cache. */
    frameIds: ApplicationCache.FrameWithManifest[];
  }>;
  /** Enables application cache domain notifications. */
  enable(): Promise<void>;
  /** Returns manifest URL for document in the given frame. */
  getManifestForFrame(params: {
    /** Identifier of the frame containing document whose manifest is retrieved. */
    frameId: Page.FrameId;
  }): Promise<{
    /** Manifest URL for document in the given frame. */
    manifestURL: string;
  }>;
  /** Returns relevant application cache data for the document in given frame. */
  getApplicationCacheForFrame(params: {
    /** Identifier of the frame containing document whose application cache is retrieved. */
    frameId: Page.FrameId;
  }): Promise<{
    /** Relevant application cache data for the document in given frame. */
    applicationCache: ApplicationCache.ApplicationCache;
  }>;
  applicationCacheStatusUpdated: (evt: {
    /** Identifier of the frame containing document whose application cache updated status. */
    frameId: Page.FrameId;
    /** Manifest URL. */
    manifestURL: string;
    /** Updated application cache status. */
    status: number;
  }) => void;
  networkStateUpdated: (evt: {
    isNowOnline: boolean;
  }) => void;
}
export namespace ApplicationCache {
  /** Detailed application cache resource information. */
  export type ApplicationCacheResource = {
    /** Resource url. */
    url: string;
    /** Resource size. */
    size: number;
    /** Resource type. */
    type: string;
  }
  /** Detailed application cache information. */
  export type ApplicationCache = {
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
  export type FrameWithManifest = {
    /** Frame identifier. */
    frameId: Page.FrameId;
    /** Manifest URL. */
    manifestURL: string;
    /** Application cache status. */
    status: number;
  }
}
export interface FileSystem {
  /** Enables events from backend. */
  enable(): Promise<void>;
  /** Disables events from backend. */
  disable(): Promise<void>;
  /** Returns root directory of the FileSystem, if exists. */
  requestFileSystemRoot(params: {
    /** Security origin of requesting FileSystem. One of frames in current page needs to have this security origin. */
    origin: string;
    /** FileSystem type of requesting FileSystem. */
    type: "temporary" | "persistent";
  }): Promise<{
    /** 0, if no error. Otherwise, errorCode is set to FileError::ErrorCode value. */
    errorCode: number;
    /** Contains root of the requested FileSystem if the command completed successfully. */
    root?: FileSystem.Entry;
  }>;
  /** Returns content of the directory. */
  requestDirectoryContent(params: {
    /** URL of the directory that the frontend is requesting to read from. */
    url: string;
  }): Promise<{
    /** 0, if no error. Otherwise, errorCode is set to FileError::ErrorCode value. */
    errorCode: number;
    /** Contains all entries on directory if the command completed successfully. */
    entries?: FileSystem.Entry[];
  }>;
  /** Returns metadata of the entry. */
  requestMetadata(params: {
    /** URL of the entry that the frontend is requesting to get metadata from. */
    url: string;
  }): Promise<{
    /** 0, if no error. Otherwise, errorCode is set to FileError::ErrorCode value. */
    errorCode: number;
    /** Contains metadata of the entry if the command completed successfully. */
    metadata?: FileSystem.Metadata;
  }>;
  /** Returns content of the file. Result should be sliced into [start, end). */
  requestFileContent(params: {
    /** URL of the file that the frontend is requesting to read from. */
    url: string;
    /** True if the content should be read as text, otherwise the result will be returned as base64 encoded text. */
    readAsText: boolean;
    /** Specifies the start of range to read. */
    start?: number;
    /** Specifies the end of range to read exclusively. */
    end?: number;
    /** Overrides charset of the content when content is served as text. */
    charset?: string;
  }): Promise<{
    /** 0, if no error. Otherwise, errorCode is set to FileError::ErrorCode value. */
    errorCode: number;
    /** Content of the file. */
    content?: string;
    /** Charset of the content if it is served as text. */
    charset?: string;
  }>;
  /** Deletes specified entry. If the entry is a directory, the agent deletes children recursively. */
  deleteEntry(params: {
    /** URL of the entry to delete. */
    url: string;
  }): Promise<{
    /** 0, if no error. Otherwise errorCode is set to FileError::ErrorCode value. */
    errorCode: number;
  }>;
}
export namespace FileSystem {
  /** Represents a browser side file or directory. */
  export type Entry = {
    /** filesystem: URL for the entry. */
    url: string;
    /** The name of the file or directory. */
    name: string;
    /** True if the entry is a directory. */
    isDirectory: boolean;
    /** MIME type of the entry, available for a file only. */
    mimeType?: string;
    /** ResourceType of the entry, available for a file only. */
    resourceType?: Page.ResourceType;
    /** True if the entry is a text file. */
    isTextFile?: boolean;
  }
  /** Represents metadata of a file or entry. */
  export type Metadata = {
    /** Modification time. */
    modificationTime: number;
    /** File size. This field is always zero for directories. */
    size: number;
  }
}
/** This domain exposes DOM read/write operations. Each DOM Node is represented with its mirror object that has an <code>id</code>. This <code>id</code> can be used to get additional information on the Node, resolve it into the JavaScript object wrapper, etc. It is important that client receives DOM events only for the nodes that are known to the client. Backend keeps track of the nodes that were sent to the client and never sends the same node twice. It is client's responsibility to collect information about the nodes that were sent to the client.<p>Note that <code>iframe</code> owner elements will return corresponding document elements as their child nodes.</p> */
export interface DOM {
  /** Enables DOM agent for the given page. */
  enable(): Promise<void>;
  /** Disables DOM agent for the given page. */
  disable(): Promise<void>;
  /** Returns the root DOM node to the caller. */
  getDocument(): Promise<{
    /** Resulting node. */
    root: DOM.Node;
  }>;
  /** Requests that children of the node with given id are returned to the caller in form of <code>setChildNodes</code> events where not only immediate children are retrieved, but all children down to the specified depth. */
  requestChildNodes(params: {
    /** Id of the node to get children for. */
    nodeId: DOM.NodeId;
    /** The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the entire subtree or provide an integer larger than 0. */
    depth?: number;
  }): Promise<void>;
  /** Executes <code>querySelector</code> on a given node. */
  querySelector(params: {
    /** Id of the node to query upon. */
    nodeId: DOM.NodeId;
    /** Selector string. */
    selector: string;
  }): Promise<{
    /** Query selector result. */
    nodeId: DOM.NodeId;
  }>;
  /** Executes <code>querySelectorAll</code> on a given node. */
  querySelectorAll(params: {
    /** Id of the node to query upon. */
    nodeId: DOM.NodeId;
    /** Selector string. */
    selector: string;
  }): Promise<{
    /** Query selector result. */
    nodeIds: DOM.NodeId[];
  }>;
  /** Sets node name for a node with given id. */
  setNodeName(params: {
    /** Id of the node to set name for. */
    nodeId: DOM.NodeId;
    /** New node's name. */
    name: string;
  }): Promise<{
    /** New node's id. */
    nodeId: DOM.NodeId;
  }>;
  /** Sets node value for a node with given id. */
  setNodeValue(params: {
    /** Id of the node to set value for. */
    nodeId: DOM.NodeId;
    /** New node's value. */
    value: string;
  }): Promise<void>;
  /** Removes node with given id. */
  removeNode(params: {
    /** Id of the node to remove. */
    nodeId: DOM.NodeId;
  }): Promise<void>;
  /** Sets attribute for an element with given id. */
  setAttributeValue(params: {
    /** Id of the element to set attribute for. */
    nodeId: DOM.NodeId;
    /** Attribute name. */
    name: string;
    /** Attribute value. */
    value: string;
  }): Promise<void>;
  /** Sets attributes on element with given id. This method is useful when user edits some existing attribute value and types in several attribute name/value pairs. */
  setAttributesAsText(params: {
    /** Id of the element to set attributes for. */
    nodeId: DOM.NodeId;
    /** Text with a number of attributes. Will parse this text using HTML parser. */
    text: string;
    /** Attribute name to replace with new attributes derived from text in case text parsed successfully. */
    name?: string;
  }): Promise<void>;
  /** Removes attribute with given name from an element with given id. */
  removeAttribute(params: {
    /** Id of the element to remove attribute from. */
    nodeId: DOM.NodeId;
    /** Name of the attribute to remove. */
    name: string;
  }): Promise<void>;
  /** Returns node's HTML markup. */
  getOuterHTML(params: {
    /** Id of the node to get markup for. */
    nodeId: DOM.NodeId;
  }): Promise<{
    /** Outer HTML markup. */
    outerHTML: string;
  }>;
  /** Sets node HTML markup, returns new node id. */
  setOuterHTML(params: {
    /** Id of the node to set markup for. */
    nodeId: DOM.NodeId;
    /** Outer HTML markup to set. */
    outerHTML: string;
  }): Promise<void>;
  /** Searches for a given string in the DOM tree. Use <code>getSearchResults</code> to access search results or <code>cancelSearch</code> to end this search session. */
  performSearch(params: {
    /** Plain text or query selector or XPath search query. */
    query: string;
    /** True to search in user agent shadow DOM. */
    includeUserAgentShadowDOM?: boolean;
  }): Promise<{
    /** Unique search session identifier. */
    searchId: string;
    /** Number of search results. */
    resultCount: number;
  }>;
  /** Returns search results from given <code>fromIndex</code> to given <code>toIndex</code> from the sarch with the given identifier. */
  getSearchResults(params: {
    /** Unique search session identifier. */
    searchId: string;
    /** Start index of the search result to be returned. */
    fromIndex: number;
    /** End index of the search result to be returned. */
    toIndex: number;
  }): Promise<{
    /** Ids of the search result nodes. */
    nodeIds: DOM.NodeId[];
  }>;
  /** Discards search results from the session with the given id. <code>getSearchResults</code> should no longer be called for that search. */
  discardSearchResults(params: {
    /** Unique search session identifier. */
    searchId: string;
  }): Promise<void>;
  /** Requests that the node is sent to the caller given the JavaScript node object reference. All nodes that form the path from the node to the root are also sent to the client as a series of <code>setChildNodes</code> notifications. */
  requestNode(params: {
    /** JavaScript object id to convert into node. */
    objectId: Runtime.RemoteObjectId;
  }): Promise<{
    /** Node id for given object. */
    nodeId: DOM.NodeId;
  }>;
  /** Enters the 'inspect' mode. In this mode, elements that user is hovering over are highlighted. Backend then generates 'inspectNodeRequested' event upon element selection. */
  setInspectMode(params: {
    /** Set an inspection mode. */
    mode: DOM.InspectMode;
    /** A descriptor for the highlight appearance of hovered-over nodes. May be omitted if <code>enabled == false</code>. */
    highlightConfig?: DOM.HighlightConfig;
  }): Promise<void>;
  /** Highlights given rectangle. Coordinates are absolute with respect to the main frame viewport. */
  highlightRect(params: {
    /** X coordinate */
    x: number;
    /** Y coordinate */
    y: number;
    /** Rectangle width */
    width: number;
    /** Rectangle height */
    height: number;
    /** The highlight fill color (default: transparent). */
    color?: DOM.RGBA;
    /** The highlight outline color (default: transparent). */
    outlineColor?: DOM.RGBA;
  }): Promise<void>;
  /** Highlights given quad. Coordinates are absolute with respect to the main frame viewport. */
  highlightQuad(params: {
    /** Quad to highlight */
    quad: DOM.Quad;
    /** The highlight fill color (default: transparent). */
    color?: DOM.RGBA;
    /** The highlight outline color (default: transparent). */
    outlineColor?: DOM.RGBA;
  }): Promise<void>;
  /** Highlights DOM node with given id or with the given JavaScript object wrapper. Either nodeId or objectId must be specified. */
  highlightNode(params: {
    /** A descriptor for the highlight appearance. */
    highlightConfig: DOM.HighlightConfig;
    /** Identifier of the node to highlight. */
    nodeId?: DOM.NodeId;
    /** Identifier of the backend node to highlight. */
    backendNodeId?: DOM.BackendNodeId;
    /** JavaScript object id of the node to be highlighted. */
    objectId?: Runtime.RemoteObjectId;
  }): Promise<void>;
  /** Hides DOM node highlight. */
  hideHighlight(): Promise<void>;
  /** Highlights owner element of the frame with given id. */
  highlightFrame(params: {
    /** Identifier of the frame to highlight. */
    frameId: Page.FrameId;
    /** The content box highlight fill color (default: transparent). */
    contentColor?: DOM.RGBA;
    /** The content box highlight outline color (default: transparent). */
    contentOutlineColor?: DOM.RGBA;
  }): Promise<void>;
  /** Requests that the node is sent to the caller given its path. // FIXME, use XPath */
  pushNodeByPathToFrontend(params: {
    /** Path to node in the proprietary format. */
    path: string;
  }): Promise<{
    /** Id of the node for given path. */
    nodeId: DOM.NodeId;
  }>;
  /** Requests that a batch of nodes is sent to the caller given their backend node ids. */
  pushNodesByBackendIdsToFrontend(params: {
    /** The array of backend node ids. */
    backendNodeIds: DOM.BackendNodeId[];
  }): Promise<{
    /** The array of ids of pushed nodes that correspond to the backend ids specified in backendNodeIds. */
    nodeIds: DOM.NodeId[];
  }>;
  /** Enables console to refer to the node with given id via $x (see Command Line API for more details $x functions). */
  setInspectedNode(params: {
    /** DOM node id to be accessible by means of $x command line API. */
    nodeId: DOM.NodeId;
  }): Promise<void>;
  /** Resolves JavaScript node object for given node id. */
  resolveNode(params: {
    /** Id of the node to resolve. */
    nodeId: DOM.NodeId;
    /** Symbolic group name that can be used to release multiple objects. */
    objectGroup?: string;
  }): Promise<{
    /** JavaScript object wrapper for given node. */
    object: Runtime.RemoteObject;
  }>;
  /** Returns attributes for the specified node. */
  getAttributes(params: {
    /** Id of the node to retrieve attibutes for. */
    nodeId: DOM.NodeId;
  }): Promise<{
    /** An interleaved array of node attribute names and values. */
    attributes: string[];
  }>;
  /** Creates a deep copy of the specified node and places it into the target container before the given anchor. */
  copyTo(params: {
    /** Id of the node to copy. */
    nodeId: DOM.NodeId;
    /** Id of the element to drop the copy into. */
    targetNodeId: DOM.NodeId;
    /** Drop the copy before this node (if absent, the copy becomes the last child of <code>targetNodeId</code>). */
    insertBeforeNodeId?: DOM.NodeId;
  }): Promise<{
    /** Id of the node clone. */
    nodeId: DOM.NodeId;
  }>;
  /** Moves node into the new container, places it before the given anchor. */
  moveTo(params: {
    /** Id of the node to move. */
    nodeId: DOM.NodeId;
    /** Id of the element to drop the moved node into. */
    targetNodeId: DOM.NodeId;
    /** Drop node before this one (if absent, the moved node becomes the last child of <code>targetNodeId</code>). */
    insertBeforeNodeId?: DOM.NodeId;
  }): Promise<{
    /** New id of the moved node. */
    nodeId: DOM.NodeId;
  }>;
  /** Undoes the last performed action. */
  undo(): Promise<void>;
  /** Re-does the last undone action. */
  redo(): Promise<void>;
  /** Marks last undoable state. */
  markUndoableState(): Promise<void>;
  /** Focuses the given element. */
  focus(params: {
    /** Id of the node to focus. */
    nodeId: DOM.NodeId;
  }): Promise<void>;
  /** Sets files for the given file input element. */
  setFileInputFiles(params: {
    /** Id of the file input node to set files for. */
    nodeId: DOM.NodeId;
    /** Array of file paths to set. */
    files: string[];
  }): Promise<void>;
  /** Returns boxes for the currently selected nodes. */
  getBoxModel(params: {
    /** Id of the node to get box model for. */
    nodeId: DOM.NodeId;
  }): Promise<{
    /** Box model for the node. */
    model: DOM.BoxModel;
  }>;
  /** Returns node id at given location. */
  getNodeForLocation(params: {
    /** X coordinate. */
    x: number;
    /** Y coordinate. */
    y: number;
  }): Promise<{
    /** Id of the node at given coordinates. */
    nodeId: DOM.NodeId;
  }>;
  /** Returns the id of the nearest ancestor that is a relayout boundary. */
  getRelayoutBoundary(params: {
    /** Id of the node. */
    nodeId: DOM.NodeId;
  }): Promise<{
    /** Relayout boundary node id for the given node. */
    nodeId: DOM.NodeId;
  }>;
  /** For testing. */
  getHighlightObjectForTest(params: {
    /** Id of the node to get highlight object for. */
    nodeId: DOM.NodeId;
  }): Promise<{
    /** Highlight data for the node. */
    highlight: any;
  }>;
  /** Fired when <code>Document</code> has been totally updated. Node ids are no longer valid. */
  documentUpdated: () => void;
  /** Fired when the node should be inspected. This happens after call to <code>setInspectMode</code>. */
  inspectNodeRequested: (evt: {
    /** Id of the node to inspect. */
    backendNodeId: DOM.BackendNodeId;
  }) => void;
  /** Fired when backend wants to provide client with the missing DOM structure. This happens upon most of the calls requesting node ids. */
  setChildNodes: (evt: {
    /** Parent node id to populate with children. */
    parentId: DOM.NodeId;
    /** Child nodes array. */
    nodes: DOM.Node[];
  }) => void;
  /** Fired when <code>Element</code>'s attribute is modified. */
  attributeModified: (evt: {
    /** Id of the node that has changed. */
    nodeId: DOM.NodeId;
    /** Attribute name. */
    name: string;
    /** Attribute value. */
    value: string;
  }) => void;
  /** Fired when <code>Element</code>'s attribute is removed. */
  attributeRemoved: (evt: {
    /** Id of the node that has changed. */
    nodeId: DOM.NodeId;
    /** A ttribute name. */
    name: string;
  }) => void;
  /** Fired when <code>Element</code>'s inline style is modified via a CSS property modification. */
  inlineStyleInvalidated: (evt: {
    /** Ids of the nodes for which the inline styles have been invalidated. */
    nodeIds: DOM.NodeId[];
  }) => void;
  /** Mirrors <code>DOMCharacterDataModified</code> event. */
  characterDataModified: (evt: {
    /** Id of the node that has changed. */
    nodeId: DOM.NodeId;
    /** New text value. */
    characterData: string;
  }) => void;
  /** Fired when <code>Container</code>'s child node count has changed. */
  childNodeCountUpdated: (evt: {
    /** Id of the node that has changed. */
    nodeId: DOM.NodeId;
    /** New node count. */
    childNodeCount: number;
  }) => void;
  /** Mirrors <code>DOMNodeInserted</code> event. */
  childNodeInserted: (evt: {
    /** Id of the node that has changed. */
    parentNodeId: DOM.NodeId;
    /** If of the previous siblint. */
    previousNodeId: DOM.NodeId;
    /** Inserted node data. */
    node: DOM.Node;
  }) => void;
  /** Mirrors <code>DOMNodeRemoved</code> event. */
  childNodeRemoved: (evt: {
    /** Parent id. */
    parentNodeId: DOM.NodeId;
    /** Id of the node that has been removed. */
    nodeId: DOM.NodeId;
  }) => void;
  /** Called when shadow root is pushed into the element. */
  shadowRootPushed: (evt: {
    /** Host element id. */
    hostId: DOM.NodeId;
    /** Shadow root. */
    root: DOM.Node;
  }) => void;
  /** Called when shadow root is popped from the element. */
  shadowRootPopped: (evt: {
    /** Host element id. */
    hostId: DOM.NodeId;
    /** Shadow root id. */
    rootId: DOM.NodeId;
  }) => void;
  /** Called when a pseudo element is added to an element. */
  pseudoElementAdded: (evt: {
    /** Pseudo element's parent element id. */
    parentId: DOM.NodeId;
    /** The added pseudo element. */
    pseudoElement: DOM.Node;
  }) => void;
  /** Called when a pseudo element is removed from an element. */
  pseudoElementRemoved: (evt: {
    /** Pseudo element's parent element id. */
    parentId: DOM.NodeId;
    /** The removed pseudo element id. */
    pseudoElementId: DOM.NodeId;
  }) => void;
  /** Called when distrubution is changed. */
  distributedNodesUpdated: (evt: {
    /** Insertion point where distrubuted nodes were updated. */
    insertionPointId: DOM.NodeId;
    /** Distributed nodes for given insertion point. */
    distributedNodes: DOM.BackendNode[];
  }) => void;
  nodeHighlightRequested: (evt: {
    nodeId: DOM.NodeId;
  }) => void;
}
export namespace DOM {
  /** Unique DOM node identifier. */
  export type NodeId = number;
  /** Unique DOM node identifier used to reference a node that may not have been pushed to the front-end. */
  export type BackendNodeId = number;
  /** Backend node with a friendly name. */
  export type BackendNode = {
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
  export type Node = {
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
  export type RGBA = {
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
  export type BoxModel = {
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
  export type ShapeOutsideInfo = {
    /** Shape bounds */
    bounds: Quad;
    /** Shape coordinate details */
    shape: any[];
    /** Margin shape bounds */
    marginShape: any[];
  }
  /** Rectangle. */
  export type Rect = {
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
  export type HighlightConfig = {
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
  export type InspectMode = "searchForNode" | "searchForUAShadowDOM" | "showLayoutEditor" | "none";
}
/** This domain exposes CSS read/write operations. All CSS objects (stylesheets, rules, and styles) have an associated <code>id</code> used in subsequent operations on the related object. Each object type has a specific <code>id</code> structure, and those are not interchangeable between objects of different kinds. CSS objects can be loaded using the <code>get*ForNode()</code> calls (which accept a DOM node id). A client can also discover all the existing stylesheets with the <code>getAllStyleSheets()</code> method (or keeping track of the <code>styleSheetAdded</code>/<code>styleSheetRemoved</code> events) and subsequently load the required stylesheet contents using the <code>getStyleSheet[Text]()</code> methods. */
export interface CSS {
  /** Enables the CSS agent for the given page. Clients should not assume that the CSS agent has been enabled until the result of this command is received. */
  enable(): Promise<void>;
  /** Disables the CSS agent for the given page. */
  disable(): Promise<void>;
  /** Returns requested styles for a DOM node identified by <code>nodeId</code>. */
  getMatchedStylesForNode(params: {
    nodeId: DOM.NodeId;
  }): Promise<{
    /** Inline style for the specified DOM node. */
    inlineStyle?: CSS.CSSStyle;
    /** Attribute-defined element style (e.g. resulting from "width=20 height=100%"). */
    attributesStyle?: CSS.CSSStyle;
    /** CSS rules matching this node, from all applicable stylesheets. */
    matchedCSSRules?: CSS.RuleMatch[];
    /** Pseudo style matches for this node. */
    pseudoElements?: CSS.PseudoElementMatches[];
    /** A chain of inherited styles (from the immediate node parent up to the DOM tree root). */
    inherited?: CSS.InheritedStyleEntry[];
  }>;
  /** Returns the styles defined inline (explicitly in the "style" attribute and implicitly, using DOM attributes) for a DOM node identified by <code>nodeId</code>. */
  getInlineStylesForNode(params: {
    nodeId: DOM.NodeId;
  }): Promise<{
    /** Inline style for the specified DOM node. */
    inlineStyle?: CSS.CSSStyle;
    /** Attribute-defined element style (e.g. resulting from "width=20 height=100%"). */
    attributesStyle?: CSS.CSSStyle;
  }>;
  /** Returns the computed style for a DOM node identified by <code>nodeId</code>. */
  getComputedStyleForNode(params: {
    nodeId: DOM.NodeId;
  }): Promise<{
    /** Computed style for the specified DOM node. */
    computedStyle: CSS.CSSComputedStyleProperty[];
  }>;
  /** Requests information about platform fonts which we used to render child TextNodes in the given node. */
  getPlatformFontsForNode(params: {
    nodeId: DOM.NodeId;
  }): Promise<{
    /** Usage statistics for every employed platform font. */
    fonts: CSS.PlatformFontUsage[];
  }>;
  /** Returns all CSS keyframed animations mtaching this node. */
  getCSSAnimationsForNode(params: {
    nodeId: DOM.NodeId;
  }): Promise<{
    /** A list of CSS keyframed animations matching this node. */
    cssKeyframesRules?: CSS.CSSKeyframesRule[];
  }>;
  /** Returns the current textual content and the URL for a stylesheet. */
  getStyleSheetText(params: {
    styleSheetId: CSS.StyleSheetId;
  }): Promise<{
    /** The stylesheet text. */
    text: string;
  }>;
  /** Sets the new stylesheet text. */
  setStyleSheetText(params: {
    styleSheetId: CSS.StyleSheetId;
    text: string;
  }): Promise<{
    /** URL of source map associated with script (if any). */
    sourceMapURL?: string;
  }>;
  /** Modifies the rule selector. */
  setRuleSelector(params: {
    styleSheetId: CSS.StyleSheetId;
    range: CSS.SourceRange;
    selector: string;
  }): Promise<{
    /** The resulting selector list after modification. */
    selectorList: CSS.SelectorList;
  }>;
  /** Modifies the style text. */
  setStyleText(params: {
    styleSheetId: CSS.StyleSheetId;
    range: CSS.SourceRange;
    text: string;
  }): Promise<{
    /** The resulting style after the selector modification. */
    style: CSS.CSSStyle;
  }>;
  /** Modifies the rule selector. */
  setMediaText(params: {
    styleSheetId: CSS.StyleSheetId;
    range: CSS.SourceRange;
    text: string;
  }): Promise<{
    /** The resulting CSS media rule after modification. */
    media: CSS.CSSMedia;
  }>;
  /** Creates a new special "via-inspector" stylesheet in the frame with given <code>frameId</code>. */
  createStyleSheet(params: {
    /** Identifier of the frame where "via-inspector" stylesheet should be created. */
    frameId: Page.FrameId;
  }): Promise<{
    /** Identifier of the created "via-inspector" stylesheet. */
    styleSheetId: CSS.StyleSheetId;
  }>;
  /** Inserts a new rule with the given <code>ruleText</code> in a stylesheet with given <code>styleSheetId</code>, at the position specified by <code>location</code>. */
  addRule(params: {
    /** The css style sheet identifier where a new rule should be inserted. */
    styleSheetId: CSS.StyleSheetId;
    /** The text of a new rule. */
    ruleText: string;
    /** Text position of a new rule in the target style sheet. */
    location: CSS.SourceRange;
  }): Promise<{
    /** The newly created rule. */
    rule: CSS.CSSRule;
  }>;
  /** Ensures that the given node will have specified pseudo-classes whenever its style is computed by the browser. */
  forcePseudoState(params: {
    /** The element id for which to force the pseudo state. */
    nodeId: DOM.NodeId;
    /** Element pseudo classes to force when computing the element's style. */
    forcedPseudoClasses: "active" | "focus" | "hover" | "visited"[];
  }): Promise<void>;
  /** Returns all media queries parsed by the rendering engine. */
  getMediaQueries(): Promise<{
    medias: CSS.CSSMedia[];
  }>;
  /** Find a rule with the given active property for the given node and set the new value for this property */
  setEffectivePropertyValueForNode(params: {
    /** The element id for which to set property. */
    nodeId: DOM.NodeId;
    propertyName: string;
    value: string;
  }): Promise<void>;
  getBackgroundColors(params: {
    /** Id of the node to get background colors for. */
    nodeId: DOM.NodeId;
  }): Promise<{
    /** The range of background colors behind this element, if it contains any visible text. If no visible text is present, this will be undefined. In the case of a flat background color, this will consist of simply that color. In the case of a gradient, this will consist of each of the color stops. For anything more complicated, this will be an empty array. Images will be ignored (as if the image had failed to load). */
    backgroundColors?: string[];
  }>;
  /** Fires whenever a MediaQuery result changes (for example, after a browser window has been resized.) The current implementation considers only viewport-dependent media features. */
  mediaQueryResultChanged: () => void;
  /** Fired whenever a stylesheet is changed as a result of the client operation. */
  styleSheetChanged: (evt: {
    styleSheetId: CSS.StyleSheetId;
  }) => void;
  /** Fired whenever an active document stylesheet is added. */
  styleSheetAdded: (evt: {
    /** Added stylesheet metainfo. */
    header: CSS.CSSStyleSheetHeader;
  }) => void;
  /** Fired whenever an active document stylesheet is removed. */
  styleSheetRemoved: (evt: {
    /** Identifier of the removed stylesheet. */
    styleSheetId: CSS.StyleSheetId;
  }) => void;
  layoutEditorChange: (evt: {
    /** Identifier of the stylesheet where the modification occurred. */
    styleSheetId: CSS.StyleSheetId;
    /** Range where the modification occurred. */
    changeRange: CSS.SourceRange;
  }) => void;
}
export namespace CSS {
  export type StyleSheetId = string;
  /** Stylesheet type: "injected" for stylesheets injected via extension, "user-agent" for user-agent stylesheets, "inspector" for stylesheets created by the inspector (i.e. those holding the "via inspector" rules), "regular" for regular stylesheets. */
  export type StyleSheetOrigin = "injected" | "user-agent" | "inspector" | "regular";
  /** CSS rule collection for a single pseudo style. */
  export type PseudoElementMatches = {
    /** Pseudo element type. */
    pseudoType: DOM.PseudoType;
    /** Matches of CSS rules applicable to the pseudo style. */
    matches: RuleMatch[];
  }
  /** Inherited CSS rule collection from ancestor node. */
  export type InheritedStyleEntry = {
    /** The ancestor node's inline style, if any, in the style inheritance chain. */
    inlineStyle?: CSSStyle;
    /** Matches of CSS rules matching the ancestor node in the style inheritance chain. */
    matchedCSSRules: RuleMatch[];
  }
  /** Match data for a CSS rule. */
  export type RuleMatch = {
    /** CSS rule in the match. */
    rule: CSSRule;
    /** Matching selector indices in the rule's selectorList selectors (0-based). */
    matchingSelectors: number[];
  }
  /** Data for a simple selector (these are delimited by commas in a selector list). */
  export type Value = {
    /** Value text. */
    text: string;
    /** Value range in the underlying resource (if available). */
    range?: SourceRange;
  }
  /** Selector list data. */
  export type SelectorList = {
    /** Selectors in the list. */
    selectors: Value[];
    /** Rule selector text. */
    text: string;
  }
  /** CSS stylesheet metainformation. */
  export type CSSStyleSheetHeader = {
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
  }
  /** CSS rule representation. */
  export type CSSRule = {
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
  /** Text range within a resource. All numbers are zero-based. */
  export type SourceRange = {
    /** Start line of range. */
    startLine: number;
    /** Start column of range (inclusive). */
    startColumn: number;
    /** End line of range */
    endLine: number;
    /** End column of range (exclusive). */
    endColumn: number;
  }
  export type ShorthandEntry = {
    /** Shorthand name. */
    name: string;
    /** Shorthand value. */
    value: string;
    /** Whether the property has "!important" annotation (implies <code>false</code> if absent). */
    important?: boolean;
  }
  export type CSSComputedStyleProperty = {
    /** Computed style property name. */
    name: string;
    /** Computed style property value. */
    value: string;
  }
  /** CSS style representation. */
  export type CSSStyle = {
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
  export type CSSProperty = {
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
  export type CSSMedia = {
    /** Media query text. */
    text: string;
    /** Source of the media query: "mediaRule" if specified by a @media rule, "importRule" if specified by an @import rule, "linkedSheet" if specified by a "media" attribute in a linked stylesheet's LINK tag, "inlineSheet" if specified by a "media" attribute in an inline stylesheet's STYLE tag. */
    source: "mediaRule" | "importRule" | "linkedSheet" | "inlineSheet";
    /** URL of the document containing the media query description. */
    sourceURL?: string;
    /** The associated rule (@media or @import) header range in the enclosing stylesheet (if available). */
    range?: SourceRange;
    /** Identifier of the stylesheet containing this object (if exists). */
    parentStyleSheetId?: StyleSheetId;
    /** Array of media queries. */
    mediaList?: MediaQuery[];
  }
  /** Media query descriptor. */
  export type MediaQuery = {
    /** Array of media query expressions. */
    expressions: MediaQueryExpression[];
    /** Whether the media query condition is satisfied. */
    active: boolean;
  }
  /** Media query expression descriptor. */
  export type MediaQueryExpression = {
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
  export type PlatformFontUsage = {
    /** Font's family name reported by platform. */
    familyName: string;
    /** Amount of glyphs that were rendered with this font. */
    glyphCount: number;
  }
  /** CSS keyframes rule representation. */
  export type CSSKeyframesRule = {
    /** Animation name. */
    animationName: Value;
    /** List of keyframes. */
    keyframes: CSSKeyframeRule[];
  }
  /** CSS keyframe rule representation. */
  export type CSSKeyframeRule = {
    /** Associated key text. */
    keyText: Value;
    /** Associated style declaration. */
    style: CSSStyle;
  }
}
/** Input/Output operations for streams produced by DevTools. */
export interface IO {
  /** Read a chunk of the stream */
  read(params: {
    /** Handle of the stream to read. */
    handle: IO.StreamHandle;
    /** Seek to the specified offset before reading (if not specificed, proceed with offset following the last read). */
    offset?: number;
    /** Maximum number of bytes to read (left upon the agent discretion if not specified). */
    size?: number;
  }): Promise<{
    /** Data that were read. */
    data: string;
    /** Set if the end-of-file condition occured while reading. */
    eof: boolean;
  }>;
  /** Close the stream, discard any temporary backing storage. */
  close(params: {
    /** Handle of the stream to close. */
    handle: IO.StreamHandle;
  }): Promise<void>;
}
export namespace IO {
  export type StreamHandle = string;
}
/** Timeline domain is deprecated. Please use Tracing instead. */
export interface Timeline {
  /** Deprecated. */
  enable(): Promise<void>;
  /** Deprecated. */
  disable(): Promise<void>;
  /** Deprecated. */
  start(params: {
    /** Samples JavaScript stack traces up to <code>maxCallStackDepth</code>, defaults to 5. */
    maxCallStackDepth?: number;
    /** Whether instrumentation events should be buffered and returned upon <code>stop</code> call. */
    bufferEvents?: boolean;
    /** Coma separated event types to issue although bufferEvents is set. */
    liveEvents?: string;
    /** Whether counters data should be included into timeline events. */
    includeCounters?: boolean;
    /** Whether events from GPU process should be collected. */
    includeGPUEvents?: boolean;
  }): Promise<void>;
  /** Deprecated. */
  stop(): Promise<void>;
  /** Deprecated. */
  eventRecorded: (evt: {
    /** Timeline event record data. */
    record: Timeline.TimelineEvent;
  }) => void;
}
export namespace Timeline {
  /** Timeline record contains information about the recorded activity. */
  export type TimelineEvent = {
    /** Event type. */
    type: string;
    /** Event data. */
    data: any;
    /** Start time. */
    startTime: number;
    /** End time. */
    endTime?: number;
    /** Nested records. */
    children?: TimelineEvent[];
    /** If present, identifies the thread that produced the event. */
    thread?: string;
    /** Stack trace. */
    stackTrace?: Console.StackTrace;
    /** Unique identifier of the frame within the page that the event relates to. */
    frameId?: string;
  }
}
/** Debugger domain exposes JavaScript debugging capabilities. It allows setting and removing breakpoints, stepping through execution, exploring stack traces, etc. */
export interface Debugger {
  /** Enables debugger for the given page. Clients should not assume that the debugging has been enabled until the result for this command is received. */
  enable(): Promise<void>;
  /** Disables debugger for given page. */
  disable(): Promise<void>;
  /** Activates / deactivates all breakpoints on the page. */
  setBreakpointsActive(params: {
    /** New value for breakpoints active state. */
    active: boolean;
  }): Promise<void>;
  /** Makes page not interrupt on any pauses (breakpoint, exception, dom exception etc). */
  setSkipAllPauses(params: {
    /** New value for skip pauses state. */
    skipped: boolean;
  }): Promise<void>;
  /** Sets JavaScript breakpoint at given location specified either by URL or URL regex. Once this command is issued, all existing parsed scripts will have breakpoints resolved and returned in <code>locations</code> property. Further matching script parsing will result in subsequent <code>breakpointResolved</code> events issued. This logical breakpoint will survive page reloads. */
  setBreakpointByUrl(params: {
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
  }): Promise<{
    /** Id of the created breakpoint for further reference. */
    breakpointId: Debugger.BreakpointId;
    /** List of the locations this breakpoint resolved into upon addition. */
    locations: Debugger.Location[];
  }>;
  /** Sets JavaScript breakpoint at a given location. */
  setBreakpoint(params: {
    /** Location to set breakpoint in. */
    location: Debugger.Location;
    /** Expression to use as a breakpoint condition. When specified, debugger will only stop on the breakpoint if this expression evaluates to true. */
    condition?: string;
  }): Promise<{
    /** Id of the created breakpoint for further reference. */
    breakpointId: Debugger.BreakpointId;
    /** Location this breakpoint resolved into. */
    actualLocation: Debugger.Location;
  }>;
  /** Removes JavaScript breakpoint. */
  removeBreakpoint(params: {
    breakpointId: Debugger.BreakpointId;
  }): Promise<void>;
  /** Continues execution until specific location is reached. */
  continueToLocation(params: {
    /** Location to continue to. */
    location: Debugger.Location;
    /** Allows breakpoints at the intemediate positions inside statements. */
    interstatementLocation?: boolean;
  }): Promise<void>;
  /** Steps over the statement. */
  stepOver(): Promise<void>;
  /** Steps into the function call. */
  stepInto(): Promise<void>;
  /** Steps out of the function call. */
  stepOut(): Promise<void>;
  /** Stops on the next JavaScript statement. */
  pause(): Promise<void>;
  /** Resumes JavaScript execution. */
  resume(): Promise<void>;
  /** Steps into the first async operation handler that was scheduled by or after the current statement. */
  stepIntoAsync(): Promise<void>;
  /** Searches for given string in script content. */
  searchInContent(params: {
    /** Id of the script to search in. */
    scriptId: Debugger.ScriptId;
    /** String to search for. */
    query: string;
    /** If true, search is case sensitive. */
    caseSensitive?: boolean;
    /** If true, treats string parameter as regex. */
    isRegex?: boolean;
  }): Promise<{
    /** List of search matches. */
    result: Debugger.SearchMatch[];
  }>;
  /** Always returns true. */
  canSetScriptSource(): Promise<{
    /** True if <code>setScriptSource</code> is supported. */
    result: boolean;
  }>;
  /** Edits JavaScript source live. */
  setScriptSource(params: {
    /** Id of the script to edit. */
    scriptId: Debugger.ScriptId;
    /** New content of the script. */
    scriptSource: string;
    /**  If true the change will not actually be applied. Preview mode may be used to get result description without actually modifying the code. */
    preview?: boolean;
  }): Promise<{
    /** New stack trace in case editing has happened while VM was stopped. */
    callFrames?: Debugger.CallFrame[];
    /** Whether current call stack  was modified after applying the changes. */
    stackChanged?: boolean;
    /** Async stack trace, if any. */
    asyncStackTrace?: Debugger.StackTrace;
  }>;
  /** Restarts particular call frame from the beginning. */
  restartFrame(params: {
    /** Call frame identifier to evaluate on. */
    callFrameId: Debugger.CallFrameId;
  }): Promise<{
    /** New stack trace. */
    callFrames: Debugger.CallFrame[];
    /** Async stack trace, if any. */
    asyncStackTrace?: Debugger.StackTrace;
  }>;
  /** Returns source for the script with given id. */
  getScriptSource(params: {
    /** Id of the script to get source for. */
    scriptId: Debugger.ScriptId;
  }): Promise<{
    /** Script source. */
    scriptSource: string;
  }>;
  /** Returns detailed information on given function. */
  getFunctionDetails(params: {
    /** Id of the function to get details for. */
    functionId: Runtime.RemoteObjectId;
  }): Promise<{
    /** Information about the function. */
    details: Debugger.FunctionDetails;
  }>;
  /** Returns detailed information on given generator object. */
  getGeneratorObjectDetails(params: {
    /** Id of the generator object to get details for. */
    objectId: Runtime.RemoteObjectId;
  }): Promise<{
    /** Information about the generator object. */
    details: Debugger.GeneratorObjectDetails;
  }>;
  /** Returns entries of given collection. */
  getCollectionEntries(params: {
    /** Id of the collection to get entries for. */
    objectId: Runtime.RemoteObjectId;
  }): Promise<{
    /** Array of collection entries. */
    entries: Debugger.CollectionEntry[];
  }>;
  /** Defines pause on exceptions state. Can be set to stop on all exceptions, uncaught exceptions or no exceptions. Initial pause on exceptions state is <code>none</code>. */
  setPauseOnExceptions(params: {
    /** Pause on exceptions mode. */
    state: "none" | "uncaught" | "all";
  }): Promise<void>;
  /** Evaluates expression on a given call frame. */
  evaluateOnCallFrame(params: {
    /** Call frame identifier to evaluate on. */
    callFrameId: Debugger.CallFrameId;
    /** Expression to evaluate. */
    expression: string;
    /** String object group name to put result into (allows rapid releasing resulting object handles using <code>releaseObjectGroup</code>). */
    objectGroup?: string;
    /** Specifies whether command line API should be available to the evaluated expression, defaults to false. */
    includeCommandLineAPI?: boolean;
    /** Specifies whether evaluation should stop on exceptions and mute console. Overrides setPauseOnException state. */
    doNotPauseOnExceptionsAndMuteConsole?: boolean;
    /** Whether the result is expected to be a JSON object that should be sent by value. */
    returnByValue?: boolean;
    /** Whether preview should be generated for the result. */
    generatePreview?: boolean;
  }): Promise<{
    /** Object wrapper for the evaluation result. */
    result: Runtime.RemoteObject;
    /** True if the result was thrown during the evaluation. */
    wasThrown?: boolean;
    /** Exception details. */
    exceptionDetails?: Debugger.ExceptionDetails;
  }>;
  /** Compiles expression. */
  compileScript(params: {
    /** Expression to compile. */
    expression: string;
    /** Source url to be set for the script. */
    sourceURL: string;
    /** Specifies whether the compiled script should be persisted. */
    persistScript: boolean;
    /** Specifies in which isolated context to perform script run. Each content script lives in an isolated context and this parameter is used to specify one of those contexts. */
    executionContextId: Runtime.ExecutionContextId;
  }): Promise<{
    /** Id of the script. */
    scriptId?: Debugger.ScriptId;
    /** Exception details. */
    exceptionDetails?: Debugger.ExceptionDetails;
  }>;
  /** Runs script with given id in a given context. */
  runScript(params: {
    /** Id of the script to run. */
    scriptId: Debugger.ScriptId;
    /** Specifies in which isolated context to perform script run. Each content script lives in an isolated context and this parameter is used to specify one of those contexts. */
    executionContextId: Runtime.ExecutionContextId;
    /** Symbolic group name that can be used to release multiple objects. */
    objectGroup?: string;
    /** Specifies whether script run should stop on exceptions and mute console. Overrides setPauseOnException state. */
    doNotPauseOnExceptionsAndMuteConsole?: boolean;
  }): Promise<{
    /** Run result. */
    result: Runtime.RemoteObject;
    /** Exception details. */
    exceptionDetails?: Debugger.ExceptionDetails;
  }>;
  /** Changes value of variable in a callframe or a closure. Either callframe or function must be specified. Object-based scopes are not supported and must be mutated manually. */
  setVariableValue(params: {
    /** 0-based number of scope as was listed in scope chain. Only 'local', 'closure' and 'catch' scope types are allowed. Other scopes could be manipulated manually. */
    scopeNumber: number;
    /** Variable name. */
    variableName: string;
    /** New variable value. */
    newValue: Runtime.CallArgument;
    /** Id of callframe that holds variable. */
    callFrameId?: Debugger.CallFrameId;
    /** Object id of closure (function) that holds variable. */
    functionObjectId?: Runtime.RemoteObjectId;
  }): Promise<void>;
  /** Lists all positions where step-in is possible for a current statement in a specified call frame */
  getStepInPositions(params: {
    /** Id of a call frame where the current statement should be analized */
    callFrameId: Debugger.CallFrameId;
  }): Promise<{
    /** experimental */
    stepInPositions?: Debugger.Location[];
  }>;
  /** Returns call stack including variables changed since VM was paused. VM must be paused. */
  getBacktrace(): Promise<{
    /** Call stack the virtual machine stopped on. */
    callFrames: Debugger.CallFrame[];
    /** Async stack trace, if any. */
    asyncStackTrace?: Debugger.StackTrace;
  }>;
  /** Makes backend skip steps in the sources with names matching given pattern. VM will try leave blacklisted scripts by performing 'step in' several times, finally resorting to 'step out' if unsuccessful. */
  skipStackFrames(params: {
    /** Regular expression defining the scripts to ignore while stepping. */
    script?: string;
    /** True, if all content scripts should be ignored. */
    skipContentScripts?: boolean;
  }): Promise<void>;
  /** Enables or disables async call stacks tracking. */
  setAsyncCallStackDepth(params: {
    /** Maximum depth of async call stacks. Setting to <code>0</code> will effectively disable collecting async call stacks (default). */
    maxDepth: number;
  }): Promise<void>;
  /** Enables promise tracking, information about <code>Promise</code>s created or updated will now be stored on the backend. */
  enablePromiseTracker(params: {
    /** Whether to capture stack traces for promise creation and settlement events (default: false). */
    captureStacks?: boolean;
  }): Promise<void>;
  /** Disables promise tracking. */
  disablePromiseTracker(): Promise<void>;
  /** Returns <code>Promise</code> with specified ID. */
  getPromiseById(params: {
    promiseId: number;
    /** Symbolic group name that can be used to release multiple objects. */
    objectGroup?: string;
  }): Promise<{
    /** Object wrapper for <code>Promise</code> with specified ID, if any. */
    promise: Runtime.RemoteObject;
  }>;
  /** Fires pending <code>asyncOperationStarted</code> events (if any), as if a debugger stepping session has just been started. */
  flushAsyncOperationEvents(): Promise<void>;
  /** Sets breakpoint on AsyncOperation callback handler. */
  setAsyncOperationBreakpoint(params: {
    /** ID of the async operation to set breakpoint for. */
    operationId: number;
  }): Promise<void>;
  /** Removes AsyncOperation breakpoint. */
  removeAsyncOperationBreakpoint(params: {
    /** ID of the async operation to remove breakpoint for. */
    operationId: number;
  }): Promise<void>;
  /** Called when global has been cleared and debugger client should reset its state. Happens upon navigation or reload. */
  globalObjectCleared: () => void;
  /** Fired when virtual machine parses script. This event is also fired for all known and uncollected scripts upon enabling debugger. */
  scriptParsed: (evt: {
    /** Identifier of the script parsed. */
    scriptId: Debugger.ScriptId;
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
    /** Determines whether this script is a user extension script. */
    isContentScript?: boolean;
    /** Determines whether this script is an internal script. */
    isInternalScript?: boolean;
    /** True, if this script is generated as a result of the live edit operation. */
    isLiveEdit?: boolean;
    /** URL of source map associated with script (if any). */
    sourceMapURL?: string;
    /** True, if this script has sourceURL. */
    hasSourceURL?: boolean;
  }) => void;
  /** Fired when virtual machine fails to parse the script. */
  scriptFailedToParse: (evt: {
    /** Identifier of the script parsed. */
    scriptId: Debugger.ScriptId;
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
    /** Determines whether this script is a user extension script. */
    isContentScript?: boolean;
    /** Determines whether this script is an internal script. */
    isInternalScript?: boolean;
    /** URL of source map associated with script (if any). */
    sourceMapURL?: string;
    /** True, if this script has sourceURL. */
    hasSourceURL?: boolean;
  }) => void;
  /** Fired when breakpoint is resolved to an actual script and location. */
  breakpointResolved: (evt: {
    /** Breakpoint unique identifier. */
    breakpointId: Debugger.BreakpointId;
    /** Actual breakpoint location. */
    location: Debugger.Location;
  }) => void;
  /** Fired when the virtual machine stopped on breakpoint or exception or any other stop criteria. */
  paused: (evt: {
    /** Call stack the virtual machine stopped on. */
    callFrames: Debugger.CallFrame[];
    /** Pause reason. */
    reason: "XHR" | "DOM" | "EventListener" | "exception" | "assert" | "CSPViolation" | "debugCommand" | "promiseRejection" | "AsyncOperation" | "other";
    /** Object containing break-specific auxiliary properties. */
    data?: any;
    /** Hit breakpoints IDs */
    hitBreakpoints?: string[];
    /** Async stack trace, if any. */
    asyncStackTrace?: Debugger.StackTrace;
  }) => void;
  /** Fired when the virtual machine resumed execution. */
  resumed: () => void;
  /** Fired when a <code>Promise</code> is created, updated or garbage collected. */
  promiseUpdated: (evt: {
    /** Type of the event. */
    eventType: "new" | "update" | "gc";
    /** Information about the updated <code>Promise</code>. */
    promise: Debugger.PromiseDetails;
  }) => void;
  /** Fired when an async operation is scheduled (while in a debugger stepping session). */
  asyncOperationStarted: (evt: {
    /** Information about the async operation. */
    operation: Debugger.AsyncOperation;
  }) => void;
  /** Fired when an async operation is completed (while in a debugger stepping session). */
  asyncOperationCompleted: (evt: {
    /** ID of the async operation that was completed. */
    id: number;
  }) => void;
}
export namespace Debugger {
  /** Breakpoint identifier. */
  export type BreakpointId = string;
  /** Unique script identifier. */
  export type ScriptId = string;
  /** Call frame identifier. */
  export type CallFrameId = string;
  /** Location in the source code. */
  export type Location = {
    /** Script identifier as reported in the <code>Debugger.scriptParsed</code>. */
    scriptId: ScriptId;
    /** Line number in the script (0-based). */
    lineNumber: number;
    /** Column number in the script (0-based). */
    columnNumber?: number;
  }
  /** Information about the function. */
  export type FunctionDetails = {
    /** Location of the function, none for native functions. */
    location?: Location;
    /** Name of the function. */
    functionName: string;
    /** Whether this is a generator function. */
    isGenerator: boolean;
    /** Scope chain for this closure. */
    scopeChain?: Scope[];
  }
  /** Information about the generator object. */
  export type GeneratorObjectDetails = {
    /** Generator function. */
    function: Runtime.RemoteObject;
    /** Name of the generator function. */
    functionName: string;
    /** Current generator object status. */
    status: "running" | "suspended" | "closed";
    /** If suspended, location where generator function was suspended (e.g. location of the last 'yield'). Otherwise, location of the generator function. */
    location?: Location;
  }
  /** Collection entry. */
  export type CollectionEntry = {
    /** Entry key of a map-like collection, otherwise not provided. */
    key?: Runtime.RemoteObject;
    /** Entry value. */
    value: Runtime.RemoteObject;
  }
  /** JavaScript call frame. Array of call frames form the call stack. */
  export type CallFrame = {
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
  /** JavaScript call stack, including async stack traces. */
  export type StackTrace = {
    /** Call frames of the stack trace. */
    callFrames: CallFrame[];
    /** String label of this stack trace. For async traces this may be a name of the function that initiated the async call. */
    description?: string;
    /** Async stack trace, if any. */
    asyncStackTrace?: StackTrace;
  }
  /** Scope description. */
  export type Scope = {
    /** Scope type. */
    type: "global" | "local" | "with" | "closure" | "catch" | "block" | "script";
    /** Object representing the scope. For <code>global</code> and <code>with</code> scopes it represents the actual object; for the rest of the scopes, it is artificial transient object enumerating scope variables as its properties. */
    object: Runtime.RemoteObject;
    name?: string;
  }
  /** Detailed information on exception (or error) that was thrown during script compilation or execution. */
  export type ExceptionDetails = {
    /** Exception text. */
    text: string;
    /** URL of the message origin. */
    url?: string;
    /** Script ID of the message origin. */
    scriptId?: string;
    /** Line number in the resource that generated this message. */
    line?: number;
    /** Column number in the resource that generated this message. */
    column?: number;
    /** JavaScript stack trace for assertions and error messages. */
    stackTrace?: Console.StackTrace;
  }
  /** Error data for setScriptSource command. compileError is a case type for uncompilable script source error. */
  export type SetScriptSourceError = {
    compileError?: { message: string; lineNumber: number; columnNumber: number };
  }
  /** Information about the promise. All fields but id are optional and if present they reflect the new state of the property on the promise with given id. */
  export type PromiseDetails = {
    /** Unique id of the promise. */
    id: number;
    /** Status of the promise. */
    status?: "pending" | "resolved" | "rejected";
    /** Id of the parent promise. */
    parentId?: number;
    /** Top call frame on promise creation. */
    callFrame?: Console.CallFrame;
    /** Creation time of the promise. */
    creationTime?: number;
    /** Settlement time of the promise. */
    settlementTime?: number;
    /** JavaScript stack trace on promise creation. */
    creationStack?: Console.StackTrace;
    /** JavaScript asynchronous stack trace on promise creation, if available. */
    asyncCreationStack?: Console.AsyncStackTrace;
    /** JavaScript stack trace on promise settlement. */
    settlementStack?: Console.StackTrace;
    /** JavaScript asynchronous stack trace on promise settlement, if available. */
    asyncSettlementStack?: Console.AsyncStackTrace;
  }
  /** Information about the async operation. */
  export type AsyncOperation = {
    /** Unique id of the async operation. */
    id: number;
    /** String description of the async operation. */
    description: string;
    /** Stack trace where async operation was scheduled. */
    stackTrace?: Console.StackTrace;
    /** Asynchronous stack trace where async operation was scheduled, if available. */
    asyncStackTrace?: Console.AsyncStackTrace;
  }
  /** Search match for resource. */
  export type SearchMatch = {
    /** Line number in resource content. */
    lineNumber: number;
    /** Line with match content. */
    lineContent: string;
  }
}
/** DOM debugging allows setting breakpoints on particular DOM operations and events. JavaScript execution will stop on these operations as if there was a regular breakpoint set. */
export interface DOMDebugger {
  /** Sets breakpoint on particular operation with DOM. */
  setDOMBreakpoint(params: {
    /** Identifier of the node to set breakpoint on. */
    nodeId: DOM.NodeId;
    /** Type of the operation to stop upon. */
    type: DOMDebugger.DOMBreakpointType;
  }): Promise<void>;
  /** Removes DOM breakpoint that was set using <code>setDOMBreakpoint</code>. */
  removeDOMBreakpoint(params: {
    /** Identifier of the node to remove breakpoint from. */
    nodeId: DOM.NodeId;
    /** Type of the breakpoint to remove. */
    type: DOMDebugger.DOMBreakpointType;
  }): Promise<void>;
  /** Sets breakpoint on particular DOM event. */
  setEventListenerBreakpoint(params: {
    /** DOM Event name to stop on (any DOM event will do). */
    eventName: string;
    /** EventTarget interface name to stop on. If equal to <code>"*"</code> or not provided, will stop on any EventTarget. */
    targetName?: string;
  }): Promise<void>;
  /** Removes breakpoint on particular DOM event. */
  removeEventListenerBreakpoint(params: {
    /** Event name. */
    eventName: string;
    /** EventTarget interface name. */
    targetName?: string;
  }): Promise<void>;
  /** Sets breakpoint on particular native event. */
  setInstrumentationBreakpoint(params: {
    /** Instrumentation name to stop on. */
    eventName: string;
  }): Promise<void>;
  /** Removes breakpoint on particular native event. */
  removeInstrumentationBreakpoint(params: {
    /** Instrumentation name to stop on. */
    eventName: string;
  }): Promise<void>;
  /** Sets breakpoint on XMLHttpRequest. */
  setXHRBreakpoint(params: {
    /** Resource URL substring. All XHRs having this substring in the URL will get stopped upon. */
    url: string;
  }): Promise<void>;
  /** Removes breakpoint from XMLHttpRequest. */
  removeXHRBreakpoint(params: {
    /** Resource URL substring. */
    url: string;
  }): Promise<void>;
  /** Returns event listeners of the given object. */
  getEventListeners(params: {
    /** Identifier of the object to return listeners for. */
    objectId: Runtime.RemoteObjectId;
  }): Promise<{
    /** Array of relevant listeners. */
    listeners: DOMDebugger.EventListener[];
  }>;
}
export namespace DOMDebugger {
  /** DOM breakpoint type. */
  export type DOMBreakpointType = "subtree-modified" | "attribute-modified" | "node-removed";
  /** Object event listener. */
  export type EventListener = {
    /** <code>EventListener</code>'s type. */
    type: string;
    /** <code>EventListener</code>'s useCapture. */
    useCapture: boolean;
    /** Handler code location. */
    location: Debugger.Location;
    /** Event handler function value. */
    handler?: Runtime.RemoteObject;
    /** Event original handler function value. */
    originalHandler?: Runtime.RemoteObject;
  }
}
export interface Profiler {
  enable(): Promise<void>;
  disable(): Promise<void>;
  /** Changes CPU profiler sampling interval. Must be called before CPU profiles recording started. */
  setSamplingInterval(params: {
    /** New sampling interval in microseconds. */
    interval: number;
  }): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<{
    /** Recorded profile. */
    profile: Profiler.CPUProfile;
  }>;
  /** Sent when new profile recodring is started using console.profile() call. */
  consoleProfileStarted: (evt: {
    id: string;
    /** Location of console.profile(). */
    location: Debugger.Location;
    /** Profile title passed as argument to console.profile(). */
    title?: string;
  }) => void;
  consoleProfileFinished: (evt: {
    id: string;
    /** Location of console.profileEnd(). */
    location: Debugger.Location;
    profile: Profiler.CPUProfile;
    /** Profile title passed as argunet to console.profile(). */
    title?: string;
  }) => void;
}
export namespace Profiler {
  /** CPU Profile node. Holds callsite information, execution statistics and child nodes. */
  export type CPUProfileNode = {
    /** Function name. */
    functionName: string;
    /** Script identifier. */
    scriptId: Debugger.ScriptId;
    /** URL. */
    url: string;
    /** 1-based line number of the function start position. */
    lineNumber: number;
    /** 1-based column number of the function start position. */
    columnNumber: number;
    /** Number of samples where this node was on top of the call stack. */
    hitCount: number;
    /** Call UID. */
    callUID: number;
    /** Child nodes. */
    children: CPUProfileNode[];
    /** The reason of being not optimized. The function may be deoptimized or marked as don't optimize. */
    deoptReason: string;
    /** Unique id of the node. */
    id: number;
    /** An array of source position ticks. */
    positionTicks: PositionTickInfo[];
  }
  /** Profile. */
  export type CPUProfile = {
    head: CPUProfileNode;
    /** Profiling start time in seconds. */
    startTime: number;
    /** Profiling end time in seconds. */
    endTime: number;
    /** Ids of samples top nodes. */
    samples?: number[];
    /** Timestamps of the samples in microseconds. */
    timestamps?: number[];
  }
  /** Specifies a number of samples attributed to a certain source position. */
  export type PositionTickInfo = {
    /** Source line number (1-based). */
    line: number;
    /** Number of samples attributed to the source line. */
    ticks: number;
  }
}
export interface HeapProfiler {
  enable(): Promise<void>;
  disable(): Promise<void>;
  startTrackingHeapObjects(params: {
    trackAllocations?: boolean;
  }): Promise<void>;
  stopTrackingHeapObjects(params: {
    /** If true 'reportHeapSnapshotProgress' events will be generated while snapshot is being taken when the tracking is stopped. */
    reportProgress?: boolean;
  }): Promise<void>;
  takeHeapSnapshot(params: {
    /** If true 'reportHeapSnapshotProgress' events will be generated while snapshot is being taken. */
    reportProgress?: boolean;
  }): Promise<void>;
  collectGarbage(): Promise<void>;
  getObjectByHeapObjectId(params: {
    objectId: HeapProfiler.HeapSnapshotObjectId;
    /** Symbolic group name that can be used to release multiple objects. */
    objectGroup?: string;
  }): Promise<{
    /** Evaluation result. */
    result: Runtime.RemoteObject;
  }>;
  /** Enables console to refer to the node with given id via $x (see Command Line API for more details $x functions). */
  addInspectedHeapObject(params: {
    /** Heap snapshot object id to be accessible by means of $x command line API. */
    heapObjectId: HeapProfiler.HeapSnapshotObjectId;
  }): Promise<void>;
  getHeapObjectId(params: {
    /** Identifier of the object to get heap object id for. */
    objectId: Runtime.RemoteObjectId;
  }): Promise<{
    /** Id of the heap snapshot object corresponding to the passed remote object id. */
    heapSnapshotObjectId: HeapProfiler.HeapSnapshotObjectId;
  }>;
  addHeapSnapshotChunk: (evt: {
    chunk: string;
  }) => void;
  resetProfiles: () => void;
  reportHeapSnapshotProgress: (evt: {
    done: number;
    total: number;
    finished?: boolean;
  }) => void;
  /** If heap objects tracking has been started then backend regulary sends a current value for last seen object id and corresponding timestamp. If the were changes in the heap since last event then one or more heapStatsUpdate events will be sent before a new lastSeenObjectId event. */
  lastSeenObjectId: (evt: {
    lastSeenObjectId: number;
    timestamp: number;
  }) => void;
  /** If heap objects tracking has been started then backend may send update for one or more fragments */
  heapStatsUpdate: (evt: {
    /** An array of triplets. Each triplet describes a fragment. The first integer is the fragment index, the second integer is a total count of objects for the fragment, the third integer is a total size of the objects for the fragment. */
    statsUpdate: number[];
  }) => void;
}
export namespace HeapProfiler {
  /** Heap snapshot object id. */
  export type HeapSnapshotObjectId = string;
}
export interface Worker {
  enable(): Promise<void>;
  disable(): Promise<void>;
  sendMessageToWorker(params: {
    workerId: string;
    message: string;
  }): Promise<void>;
  connectToWorker(params: {
    workerId: string;
  }): Promise<void>;
  disconnectFromWorker(params: {
    workerId: string;
  }): Promise<void>;
  setAutoconnectToWorkers(params: {
    value: boolean;
  }): Promise<void>;
  workerCreated: (evt: {
    workerId: string;
    url: string;
    inspectorConnected: boolean;
  }) => void;
  workerTerminated: (evt: {
    workerId: string;
  }) => void;
  dispatchMessageFromWorker: (evt: {
    workerId: string;
    message: string;
  }) => void;
}
export namespace Worker {
}
export interface ServiceWorker {
  enable(): Promise<void>;
  disable(): Promise<void>;
  sendMessage(params: {
    workerId: string;
    message: string;
  }): Promise<void>;
  stop(params: {
    workerId: string;
  }): Promise<void>;
  unregister(params: {
    scopeURL: string;
  }): Promise<void>;
  updateRegistration(params: {
    scopeURL: string;
  }): Promise<void>;
  startWorker(params: {
    scopeURL: string;
  }): Promise<void>;
  stopWorker(params: {
    versionId: string;
  }): Promise<void>;
  inspectWorker(params: {
    versionId: string;
  }): Promise<void>;
  setDebugOnStart(params: {
    debugOnStart: boolean;
  }): Promise<void>;
  setForceUpdateOnPageLoad(params: {
    registrationId: string;
    forceUpdateOnPageLoad: boolean;
  }): Promise<void>;
  deliverPushMessage(params: {
    origin: string;
    registrationId: string;
    data: string;
  }): Promise<void>;
  getTargetInfo(params: {
    targetId: ServiceWorker.TargetID;
  }): Promise<{
    targetInfo: ServiceWorker.TargetInfo;
  }>;
  activateTarget(params: {
    targetId: ServiceWorker.TargetID;
  }): Promise<void>;
  workerCreated: (evt: {
    workerId: string;
    url: string;
    versionId: string;
  }) => void;
  workerTerminated: (evt: {
    workerId: string;
  }) => void;
  dispatchMessage: (evt: {
    workerId: string;
    message: string;
  }) => void;
  workerRegistrationUpdated: (evt: {
    registrations: ServiceWorker.ServiceWorkerRegistration[];
  }) => void;
  workerVersionUpdated: (evt: {
    versions: ServiceWorker.ServiceWorkerVersion[];
  }) => void;
  workerErrorReported: (evt: {
    errorMessage: ServiceWorker.ServiceWorkerErrorMessage;
  }) => void;
  debugOnStartUpdated: (evt: {
    debugOnStart: boolean;
  }) => void;
}
export namespace ServiceWorker {
  /** ServiceWorker registration. */
  export type ServiceWorkerRegistration = {
    registrationId: string;
    scopeURL: string;
    isDeleted: boolean;
    forceUpdateOnPageLoad?: boolean;
  }
  export type ServiceWorkerVersionRunningStatus = "stopped" | "starting" | "running" | "stopping";
  export type ServiceWorkerVersionStatus = "new" | "installing" | "installed" | "activating" | "activated" | "redundant";
  export type TargetID = string;
  /** ServiceWorker version. */
  export type ServiceWorkerVersion = {
    versionId: string;
    registrationId: string;
    scriptURL: string;
    runningStatus: ServiceWorkerVersionRunningStatus;
    status: ServiceWorkerVersionStatus;
    /** The Last-Modified header value of the main script. */
    scriptLastModified?: number;
    /** The time at which the response headers of the main script were received from the server.  For cached script it is the last time the cache entry was validated. */
    scriptResponseTime?: number;
    controlledClients?: TargetID[];
  }
  /** ServiceWorker error message. */
  export type ServiceWorkerErrorMessage = {
    errorMessage: string;
    registrationId: string;
    versionId: string;
    sourceURL: string;
    lineNumber: number;
    columnNumber: number;
  }
  export type TargetInfo = {
    id: TargetID;
    type: string;
    title: string;
    url: string;
  }
}
export interface Input {
  /** Dispatches a key event to the page. */
  dispatchKeyEvent(params: {
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
  }): Promise<void>;
  /** Dispatches a mouse event to the page. */
  dispatchMouseEvent(params: {
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
  }): Promise<void>;
  /** Dispatches a touch event to the page. */
  dispatchTouchEvent(params: {
    /** Type of the touch event. */
    type: "touchStart" | "touchEnd" | "touchMove";
    /** Touch points. */
    touchPoints: Input.TouchPoint[];
    /** Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8 (default: 0). */
    modifiers?: number;
    /** Time at which the event occurred. Measured in UTC time in seconds since January 1, 1970 (default: current time). */
    timestamp?: number;
  }): Promise<void>;
  /** Emulates touch event from the mouse event parameters. */
  emulateTouchFromMouseEvent(params: {
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
  }): Promise<void>;
  /** Synthesizes a pinch gesture over a time period by issuing appropriate touch events. */
  synthesizePinchGesture(params: {
    /** X coordinate of the start of the gesture in CSS pixels. */
    x: number;
    /** Y coordinate of the start of the gesture in CSS pixels. */
    y: number;
    /** Relative scale factor after zooming (>1.0 zooms in, <1.0 zooms out). */
    scaleFactor: number;
    /** Relative pointer speed in pixels per second (default: 800). */
    relativeSpeed?: number;
    /** Which type of input events to be generated (default: 'default', which queries the platform for the preferred input type). */
    gestureSourceType?: Input.GestureSourceType;
  }): Promise<void>;
  /** Synthesizes a scroll gesture over a time period by issuing appropriate touch events. */
  synthesizeScrollGesture(params: {
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
    gestureSourceType?: Input.GestureSourceType;
    /** The number of times to repeat the gesture (default: 0). */
    repeatCount?: number;
    /** The number of milliseconds delay between each repeat. (default: 250). */
    repeatDelayMs?: number;
    /** The name of the interaction markers to generate, if not empty (default: ""). */
    interactionMarkerName?: string;
  }): Promise<void>;
  /** Synthesizes a tap gesture over a time period by issuing appropriate touch events. */
  synthesizeTapGesture(params: {
    /** X coordinate of the start of the gesture in CSS pixels. */
    x: number;
    /** Y coordinate of the start of the gesture in CSS pixels. */
    y: number;
    /** Duration between touchdown and touchup events in ms (default: 50). */
    duration?: number;
    /** Number of times to perform the tap (e.g. 2 for double tap, default: 1). */
    tapCount?: number;
    /** Which type of input events to be generated (default: 'default', which queries the platform for the preferred input type). */
    gestureSourceType?: Input.GestureSourceType;
  }): Promise<void>;
}
export namespace Input {
  export type TouchPoint = {
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
}
export interface LayerTree {
  /** Enables compositing tree inspection. */
  enable(): Promise<void>;
  /** Disables compositing tree inspection. */
  disable(): Promise<void>;
  /** Provides the reasons why the given layer was composited. */
  compositingReasons(params: {
    /** The id of the layer for which we want to get the reasons it was composited. */
    layerId: LayerTree.LayerId;
  }): Promise<{
    /** A list of strings specifying reasons for the given layer to become composited. */
    compositingReasons: string[];
  }>;
  /** Returns the layer snapshot identifier. */
  makeSnapshot(params: {
    /** The id of the layer. */
    layerId: LayerTree.LayerId;
  }): Promise<{
    /** The id of the layer snapshot. */
    snapshotId: LayerTree.SnapshotId;
  }>;
  /** Returns the snapshot identifier. */
  loadSnapshot(params: {
    /** An array of tiles composing the snapshot. */
    tiles: LayerTree.PictureTile[];
  }): Promise<{
    /** The id of the snapshot. */
    snapshotId: LayerTree.SnapshotId;
  }>;
  /** Releases layer snapshot captured by the back-end. */
  releaseSnapshot(params: {
    /** The id of the layer snapshot. */
    snapshotId: LayerTree.SnapshotId;
  }): Promise<void>;
  profileSnapshot(params: {
    /** The id of the layer snapshot. */
    snapshotId: LayerTree.SnapshotId;
    /** The maximum number of times to replay the snapshot (1, if not specified). */
    minRepeatCount?: number;
    /** The minimum duration (in seconds) to replay the snapshot. */
    minDuration?: number;
    /** The clip rectangle to apply when replaying the snapshot. */
    clipRect?: DOM.Rect;
  }): Promise<{
    /** The array of paint profiles, one per run. */
    timings: LayerTree.PaintProfile[];
  }>;
  /** Replays the layer snapshot and returns the resulting bitmap. */
  replaySnapshot(params: {
    /** The id of the layer snapshot. */
    snapshotId: LayerTree.SnapshotId;
    /** The first step to replay from (replay from the very start if not specified). */
    fromStep?: number;
    /** The last step to replay to (replay till the end if not specified). */
    toStep?: number;
    /** The scale to apply while replaying (defaults to 1). */
    scale?: number;
  }): Promise<{
    /** A data: URL for resulting image. */
    dataURL: string;
  }>;
  /** Replays the layer snapshot and returns canvas log. */
  snapshotCommandLog(params: {
    /** The id of the layer snapshot. */
    snapshotId: LayerTree.SnapshotId;
  }): Promise<{
    /** The array of canvas function calls. */
    commandLog: any[];
  }>;
  layerTreeDidChange: (evt: {
    /** Layer tree, absent if not in the comspositing mode. */
    layers?: LayerTree.Layer[];
  }) => void;
  layerPainted: (evt: {
    /** The id of the painted layer. */
    layerId: LayerTree.LayerId;
    /** Clip rectangle. */
    clip: DOM.Rect;
  }) => void;
}
export namespace LayerTree {
  /** Unique Layer identifier. */
  export type LayerId = string;
  /** Unique snapshot identifier. */
  export type SnapshotId = string;
  /** Rectangle where scrolling happens on the main thread. */
  export type ScrollRect = {
    /** Rectangle itself. */
    rect: DOM.Rect;
    /** Reason for rectangle to force scrolling on the main thread */
    type: "RepaintsOnScroll" | "TouchEventHandler" | "WheelEventHandler";
  }
  /** Serialized fragment of layer picture along with its offset within the layer. */
  export type PictureTile = {
    /** Offset from owning layer left boundary */
    x: number;
    /** Offset from owning layer top boundary */
    y: number;
    /** Base64-encoded snapshot data. */
    picture: string;
  }
  /** Information about a compositing layer. */
  export type Layer = {
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
}
export interface DeviceOrientation {
  /** Overrides the Device Orientation. */
  setDeviceOrientationOverride(params: {
    /** Mock alpha */
    alpha: number;
    /** Mock beta */
    beta: number;
    /** Mock gamma */
    gamma: number;
  }): Promise<void>;
  /** Clears the overridden Device Orientation. */
  clearDeviceOrientationOverride(): Promise<void>;
}
export interface ScreenOrientation {
  /** Overrides the Screen Orientation. */
  setScreenOrientationOverride(params: {
    /** Orientation angle */
    angle: number;
    /** Orientation type */
    type: ScreenOrientation.OrientationType;
  }): Promise<void>;
  /** Clears the overridden Screen Orientation. */
  clearScreenOrientationOverride(): Promise<void>;
}
export namespace ScreenOrientation {
  /** Orientation type */
  export type OrientationType = "portraitPrimary" | "portraitSecondary" | "landscapePrimary" | "landscapeSecondary";
}
export interface Tracing {
  /** Start trace events collection. */
  start(params: {
    /** Category/tag filter */
    categories?: string;
    /** Tracing options */
    options?: string;
    /** If set, the agent will issue bufferUsage events at this interval, specified in milliseconds */
    bufferUsageReportingInterval?: number;
    /** Whether to report trace events as series of dataCollected events or to save trace to a stream (defaults to <code>ReportEvents</code>). */
    transferMode?: "ReportEvents" | "ReturnAsStream";
  }): Promise<void>;
  /** Stop trace events collection. */
  end(): Promise<void>;
  /** Gets supported tracing categories. */
  getCategories(): Promise<{
    /** A list of supported tracing categories. */
    categories: string[];
  }>;
  /** Request a global memory dump. */
  requestMemoryDump(): Promise<{
    /** GUID of the resulting global memory dump. */
    dumpGuid: string;
    /** True iff the global memory dump succeeded. */
    success: boolean;
  }>;
  /** Contains an bucket of collected trace events. When tracing is stopped collected events will be send as a sequence of dataCollected events followed by tracingComplete event. */
  dataCollected: (evt: {
    value: any[];
  }) => void;
  /** Signals that tracing is stopped and there is no trace buffers pending flush, all data were delivered via dataCollected events. */
  tracingComplete: (evt: {
    /** A handle of the stream that holds resulting trace data. */
    stream?: IO.StreamHandle;
  }) => void;
  bufferUsage: (evt: {
    /** A number in range [0..1] that indicates the used size of event buffer as a fraction of its total size. */
    percentFull?: number;
    /** An approximate number of events in the trace log. */
    eventCount?: number;
    /** A number in range [0..1] that indicates the used size of event buffer as a fraction of its total size. */
    value?: number;
  }) => void;
}
export interface Animation {
  /** Enables animation domain notifications. */
  enable(): Promise<void>;
  /** Disables animation domain notifications. */
  disable(): Promise<void>;
  /** Gets the playback rate of the document timeline. */
  getPlaybackRate(): Promise<{
    /** Playback rate for animations on page. */
    playbackRate: number;
  }>;
  /** Sets the playback rate of the document timeline. */
  setPlaybackRate(params: {
    /** Playback rate for animations on page */
    playbackRate: number;
  }): Promise<void>;
  /** Returns the current time of the an animation. */
  getCurrentTime(params: {
    /** Id of animation. */
    id: string;
  }): Promise<{
    /** Current time of the page. */
    currentTime: number;
  }>;
  /** Sets the paused state of a set of animations. */
  setPaused(params: {
    /** Animations to set the pause state of. */
    animations: string[];
    /** Paused state to set to. */
    paused: boolean;
  }): Promise<void>;
  /** Sets the timing of an animation node. */
  setTiming(params: {
    /** Animation id. */
    animationId: string;
    /** Duration of the animation. */
    duration: number;
    /** Delay of the animation. */
    delay: number;
  }): Promise<void>;
  /** Seek a set of animations to a particular time within each animation. */
  seekAnimations(params: {
    /** List of animation ids to seek. */
    animations: string[];
    /** Set the current time of each animation. */
    currentTime: number;
  }): Promise<void>;
  /** Releases a set of animations to no longer be manipulated. */
  releaseAnimations(params: {
    /** List of animation ids to seek. */
    animations: string[];
  }): Promise<void>;
  /** Gets the remote object of the Animation. */
  resolveAnimation(params: {
    /** Animation id. */
    animationId: string;
  }): Promise<{
    /** Corresponding remote object. */
    remoteObject: Runtime.RemoteObject;
  }>;
  /** Event for each animation that has been created. */
  animationCreated: (evt: {
    /** Id of the animation that was created. */
    id: string;
  }) => void;
  /** Event for animation that has been started. */
  animationStarted: (evt: {
    /** Animation that was started. */
    animation: Animation.Animation;
  }) => void;
  /** Event for when an animation has been cancelled. */
  animationCanceled: (evt: {
    /** Id of the animation that was cancelled. */
    id: string;
  }) => void;
}
export namespace Animation {
  /** Animation instance. */
  export type Animation = {
    /** <code>Animation</code>'s id. */
    id: string;
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
  export type AnimationEffect = {
    /** <code>AnimationEffect</code>'s delay. */
    delay: number;
    /** <code>AnimationEffect</code>'s end delay. */
    endDelay: number;
    /** <code>AnimationEffect</code>'s playbackRate. */
    playbackRate: number;
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
    /** <code>AnimationEffect</code>'s name. */
    name: string;
    /** <code>AnimationEffect</code>'s target node. */
    backendNodeId: DOM.BackendNodeId;
    /** <code>AnimationEffect</code>'s keyframes. */
    keyframesRule?: KeyframesRule;
    /** <code>AnimationEffect</code>'s timing function. */
    easing: string;
  }
  /** Keyframes Rule */
  export type KeyframesRule = {
    /** CSS keyframed animation's name. */
    name?: string;
    /** List of animation keyframes. */
    keyframes: KeyframeStyle[];
  }
  /** Keyframe Style */
  export type KeyframeStyle = {
    /** Keyframe's time offset. */
    offset: string;
    /** <code>AnimationEffect</code>'s timing function. */
    easing: string;
  }
}
export interface Accessibility {
  /** Fetches the accessibility node for this DOM node, if it exists. */
  getAXNode(params: {
    /** ID of node to get accessibility node for. */
    nodeId: DOM.NodeId;
  }): Promise<{
    /** The <code>Accessibility.AXNode</code> for this DOM node, if it exists. */
    accessibilityNode?: Accessibility.AXNode;
  }>;
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
  export type AXValueSource = {
    /** What type of source this is. */
    type: AXValueSourceType;
    /** The value of this property source. */
    value?: AXValue;
    /** The attribute, if any. */
    attribute?: string;
    /** Whether this source is superseded by a higher priority source. */
    superseded?: boolean;
    /** The native markup source for this value, e.g. a <label> element. */
    nativeSource?: AXValueNativeSourceType;
    /** Whether the value for this property is invalid. */
    invalid?: boolean;
    /** Reason for the value being invalid, if it is. */
    invalidReason?: string;
  }
  export type AXRelatedNode = {
    /** The BackendNodeId of the related node. */
    backendNodeId: DOM.BackendNodeId;
    /** The IDRef value provided, if any. */
    idref?: string;
    /** The text alternative of this node in the current context. */
    text?: string;
  }
  export type AXProperty = {
    /** The name of this property. */
    name: string;
    /** The value of this property. */
    value: AXValue;
  }
  /** A single computed AX property. */
  export type AXValue = {
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
  export type AXGlobalStates = "disabled" | "hidden" | "hiddenRoot" | "invalid";
  /** Attributes which apply to nodes in live regions. */
  export type AXLiveRegionAttributes = "live" | "atomic" | "relevant" | "busy" | "root";
  export type AXWidgetAttributes = "autocomplete" | "haspopup" | "level" | "multiselectable" | "orientation" | "multiline" | "readonly" | "required" | "valuemin" | "valuemax" | "valuetext";
  /** States which apply to widgets. */
  export type AXWidgetStates = "checked" | "expanded" | "pressed" | "selected";
  /** Relationships between elements other than parent/child/sibling. */
  export type AXRelationshipAttributes = "activedescendant" | "flowto" | "controls" | "describedby" | "labelledby" | "owns";
  /** A node in the accessibility tree. */
  export type AXNode = {
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
  }
}
interface DebuggingProtocolDomains {
  Inspector: Inspector;
  Memory: Memory;
  Page: Page;
  Rendering: Rendering;
  Emulation: Emulation;
  Runtime: Runtime;
  Console: Console;
  Security: Security;
  Network: Network;
  Database: Database;
  IndexedDB: IndexedDB;
  CacheStorage: CacheStorage;
  DOMStorage: DOMStorage;
  ApplicationCache: ApplicationCache;
  FileSystem: FileSystem;
  DOM: DOM;
  CSS: CSS;
  IO: IO;
  Timeline: Timeline;
  Debugger: Debugger;
  DOMDebugger: DOMDebugger;
  Profiler: Profiler;
  HeapProfiler: HeapProfiler;
  Worker: Worker;
  ServiceWorker: ServiceWorker;
  Input: Input;
  LayerTree: LayerTree;
  DeviceOrientation: DeviceOrientation;
  ScreenOrientation: ScreenOrientation;
  Tracing: Tracing;
  Animation: Animation;
  Accessibility: Accessibility;
}
export default DebuggingProtocolDomains;
