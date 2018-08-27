/**
 * Debugging Protocol Domains
 * Generated on Mon Aug 20 2018 10:05:40 GMT-0700 (PDT)
 */
/* tslint:disable */
import { IDebuggingProtocolClient } from "../lib/types";
export class Accessibility {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Fetches the accessibility node and partial accessibility tree for this DOM node, if it exists. */
  public getPartialAXTree(params: Accessibility.GetPartialAXTreeParameters) {
    return this._client.send<Accessibility.GetPartialAXTreeReturn>("Accessibility.getPartialAXTree", params);
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
    name: AXPropertyName;
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
  /** Values of AXProperty name: from 'busy' to 'roledescription' - states which apply to every AX
node, from 'live' to 'root' - attributes which apply to nodes in live regions, from
'autocomplete' to 'valuetext' - attributes which apply to widgets, from 'checked' to 'selected'
- states which apply to widgets, from 'activedescendant' to 'owns' - relationships between
elements other than parent/child/sibling. */
  export type AXPropertyName = "busy" | "disabled" | "hidden" | "hiddenRoot" | "invalid" | "keyshortcuts" | "roledescription" | "live" | "atomic" | "relevant" | "root" | "autocomplete" | "hasPopup" | "level" | "multiselectable" | "orientation" | "multiline" | "readonly" | "required" | "valuemin" | "valuemax" | "valuetext" | "checked" | "expanded" | "modal" | "pressed" | "selected" | "activedescendant" | "controls" | "describedby" | "details" | "errormessage" | "flowto" | "labelledby" | "owns";
  /** A node in the accessibility tree. */
  export interface AXNode {
    /** Unique identifier for this node. */
    nodeId: AXNodeId;
    /** Whether this node is ignored for accessibility */
    ignored: boolean;
    /** Collection of reasons why this node is hidden. */
    ignoredReasons?: AXProperty[];
    /** This `Node`'s role, whether explicit or implicit. */
    role?: AXValue;
    /** The accessible name for this `Node`. */
    name?: AXValue;
    /** The accessible description for this `Node`. */
    description?: AXValue;
    /** The value for this `Node`. */
    value?: AXValue;
    /** All other properties */
    properties?: AXProperty[];
    /** IDs for each of this node's child nodes. */
    childIds?: AXNodeId[];
    /** The backend ID for the associated DOM node, if any. */
    backendDOMNodeId?: DOM.BackendNodeId;
  }
  export type GetPartialAXTreeParameters = {
    /** Identifier of the node to get the partial accessibility tree for. */
    nodeId?: DOM.NodeId;
    /** Identifier of the backend node to get the partial accessibility tree for. */
    backendNodeId?: DOM.BackendNodeId;
    /** JavaScript object id of the node wrapper to get the partial accessibility tree for. */
    objectId?: Runtime.RemoteObjectId;
    /** Whether to fetch this nodes ancestors, siblings and children. Defaults to true. */
    fetchRelatives?: boolean;
  };
  export type GetPartialAXTreeReturn = {
    /** The `Accessibility.AXNode` for this DOM node, if it exists, plus its ancestors, siblings and
children, if requested. */
    nodes: AXNode[];
  };
}
export class Animation {
  private _animationCanceled: Animation.AnimationCanceledHandler | null = null;
  private _animationCreated: Animation.AnimationCreatedHandler | null = null;
  private _animationStarted: Animation.AnimationStartedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Disables animation domain notifications. */
  public disable() {
    return this._client.send<void>("Animation.disable");
  }
  /** Enables animation domain notifications. */
  public enable() {
    return this._client.send<void>("Animation.enable");
  }
  /** Returns the current time of the an animation. */
  public getCurrentTime(params: Animation.GetCurrentTimeParameters) {
    return this._client.send<Animation.GetCurrentTimeReturn>("Animation.getCurrentTime", params);
  }
  /** Gets the playback rate of the document timeline. */
  public getPlaybackRate() {
    return this._client.send<Animation.GetPlaybackRateReturn>("Animation.getPlaybackRate");
  }
  /** Releases a set of animations to no longer be manipulated. */
  public releaseAnimations(params: Animation.ReleaseAnimationsParameters) {
    return this._client.send<void>("Animation.releaseAnimations", params);
  }
  /** Gets the remote object of the Animation. */
  public resolveAnimation(params: Animation.ResolveAnimationParameters) {
    return this._client.send<Animation.ResolveAnimationReturn>("Animation.resolveAnimation", params);
  }
  /** Seek a set of animations to a particular time within each animation. */
  public seekAnimations(params: Animation.SeekAnimationsParameters) {
    return this._client.send<void>("Animation.seekAnimations", params);
  }
  /** Sets the paused state of a set of animations. */
  public setPaused(params: Animation.SetPausedParameters) {
    return this._client.send<void>("Animation.setPaused", params);
  }
  /** Sets the playback rate of the document timeline. */
  public setPlaybackRate(params: Animation.SetPlaybackRateParameters) {
    return this._client.send<void>("Animation.setPlaybackRate", params);
  }
  /** Sets the timing of an animation node. */
  public setTiming(params: Animation.SetTimingParameters) {
    return this._client.send<void>("Animation.setTiming", params);
  }
  /** Event for when an animation has been cancelled. */
  get animationCanceled() {
    return this._animationCanceled;
  }
  set animationCanceled(handler) {
    if (this._animationCanceled) {
      this._client.removeListener("Animation.animationCanceled", this._animationCanceled);
    }
    this._animationCanceled = handler;
    if (handler) {
      this._client.on("Animation.animationCanceled", handler);
    }
  }
  /** Event for each animation that has been created. */
  get animationCreated() {
    return this._animationCreated;
  }
  set animationCreated(handler) {
    if (this._animationCreated) {
      this._client.removeListener("Animation.animationCreated", this._animationCreated);
    }
    this._animationCreated = handler;
    if (handler) {
      this._client.on("Animation.animationCreated", handler);
    }
  }
  /** Event for animation that has been started. */
  get animationStarted() {
    return this._animationStarted;
  }
  set animationStarted(handler) {
    if (this._animationStarted) {
      this._client.removeListener("Animation.animationStarted", this._animationStarted);
    }
    this._animationStarted = handler;
    if (handler) {
      this._client.on("Animation.animationStarted", handler);
    }
  }
}
export namespace Animation {
  /** Animation instance. */
  export interface Animation {
    /** `Animation`'s id. */
    id: string;
    /** `Animation`'s name. */
    name: string;
    /** `Animation`'s internal paused state. */
    pausedState: boolean;
    /** `Animation`'s play state. */
    playState: string;
    /** `Animation`'s playback rate. */
    playbackRate: number;
    /** `Animation`'s start time. */
    startTime: number;
    /** `Animation`'s current time. */
    currentTime: number;
    /** Animation type of `Animation`. */
    type: "CSSTransition" | "CSSAnimation" | "WebAnimation";
    /** `Animation`'s source animation node. */
    source?: AnimationEffect;
    /** A unique ID for `Animation` representing the sources that triggered this CSS
animation/transition. */
    cssId?: string;
  }
  /** AnimationEffect instance */
  export interface AnimationEffect {
    /** `AnimationEffect`'s delay. */
    delay: number;
    /** `AnimationEffect`'s end delay. */
    endDelay: number;
    /** `AnimationEffect`'s iteration start. */
    iterationStart: number;
    /** `AnimationEffect`'s iterations. */
    iterations: number;
    /** `AnimationEffect`'s iteration duration. */
    duration: number;
    /** `AnimationEffect`'s playback direction. */
    direction: string;
    /** `AnimationEffect`'s fill mode. */
    fill: string;
    /** `AnimationEffect`'s target node. */
    backendNodeId?: DOM.BackendNodeId;
    /** `AnimationEffect`'s keyframes. */
    keyframesRule?: KeyframesRule;
    /** `AnimationEffect`'s timing function. */
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
    /** `AnimationEffect`'s timing function. */
    easing: string;
  }
  export type AnimationCanceledParameters = {
    /** Id of the animation that was cancelled. */
    id: string;
  };
  export type AnimationCanceledHandler = (params: AnimationCanceledParameters) => void;
  export type AnimationCreatedParameters = {
    /** Id of the animation that was created. */
    id: string;
  };
  export type AnimationCreatedHandler = (params: AnimationCreatedParameters) => void;
  export type AnimationStartedParameters = {
    /** Animation that was started. */
    animation: Animation;
  };
  export type AnimationStartedHandler = (params: AnimationStartedParameters) => void;
  export type GetCurrentTimeParameters = {
    /** Id of animation. */
    id: string;
  };
  export type GetCurrentTimeReturn = {
    /** Current time of the page. */
    currentTime: number;
  };
  export type GetPlaybackRateReturn = {
    /** Playback rate for animations on page. */
    playbackRate: number;
  };
  export type ReleaseAnimationsParameters = {
    /** List of animation ids to seek. */
    animations: string[];
  };
  export type ResolveAnimationParameters = {
    /** Animation id. */
    animationId: string;
  };
  export type ResolveAnimationReturn = {
    /** Corresponding remote object. */
    remoteObject: Runtime.RemoteObject;
  };
  export type SeekAnimationsParameters = {
    /** List of animation ids to seek. */
    animations: string[];
    /** Set the current time of each animation. */
    currentTime: number;
  };
  export type SetPausedParameters = {
    /** Animations to set the pause state of. */
    animations: string[];
    /** Paused state to set to. */
    paused: boolean;
  };
  export type SetPlaybackRateParameters = {
    /** Playback rate for animations on page */
    playbackRate: number;
  };
  export type SetTimingParameters = {
    /** Animation id. */
    animationId: string;
    /** Duration of the animation. */
    duration: number;
    /** Delay of the animation. */
    delay: number;
  };
}
export class ApplicationCache {
  private _applicationCacheStatusUpdated: ApplicationCache.ApplicationCacheStatusUpdatedHandler | null = null;
  private _networkStateUpdated: ApplicationCache.NetworkStateUpdatedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables application cache domain notifications. */
  public enable() {
    return this._client.send<void>("ApplicationCache.enable");
  }
  /** Returns relevant application cache data for the document in given frame. */
  public getApplicationCacheForFrame(params: ApplicationCache.GetApplicationCacheForFrameParameters) {
    return this._client.send<ApplicationCache.GetApplicationCacheForFrameReturn>("ApplicationCache.getApplicationCacheForFrame", params);
  }
  /** Returns array of frame identifiers with manifest urls for each frame containing a document
associated with some application cache. */
  public getFramesWithManifests() {
    return this._client.send<ApplicationCache.GetFramesWithManifestsReturn>("ApplicationCache.getFramesWithManifests");
  }
  /** Returns manifest URL for document in the given frame. */
  public getManifestForFrame(params: ApplicationCache.GetManifestForFrameParameters) {
    return this._client.send<ApplicationCache.GetManifestForFrameReturn>("ApplicationCache.getManifestForFrame", params);
  }
  get applicationCacheStatusUpdated() {
    return this._applicationCacheStatusUpdated;
  }
  set applicationCacheStatusUpdated(handler) {
    if (this._applicationCacheStatusUpdated) {
      this._client.removeListener("ApplicationCache.applicationCacheStatusUpdated", this._applicationCacheStatusUpdated);
    }
    this._applicationCacheStatusUpdated = handler;
    if (handler) {
      this._client.on("ApplicationCache.applicationCacheStatusUpdated", handler);
    }
  }
  get networkStateUpdated() {
    return this._networkStateUpdated;
  }
  set networkStateUpdated(handler) {
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
  export type ApplicationCacheStatusUpdatedParameters = {
    /** Identifier of the frame containing document whose application cache updated status. */
    frameId: Page.FrameId;
    /** Manifest URL. */
    manifestURL: string;
    /** Updated application cache status. */
    status: number;
  };
  export type ApplicationCacheStatusUpdatedHandler = (params: ApplicationCacheStatusUpdatedParameters) => void;
  export type NetworkStateUpdatedParameters = {
    isNowOnline: boolean;
  };
  export type NetworkStateUpdatedHandler = (params: NetworkStateUpdatedParameters) => void;
  export type GetApplicationCacheForFrameParameters = {
    /** Identifier of the frame containing document whose application cache is retrieved. */
    frameId: Page.FrameId;
  };
  export type GetApplicationCacheForFrameReturn = {
    /** Relevant application cache data for the document in given frame. */
    applicationCache: ApplicationCache;
  };
  export type GetFramesWithManifestsReturn = {
    /** Array of frame identifiers with manifest urls for each frame containing a document
associated with some application cache. */
    frameIds: FrameWithManifest[];
  };
  export type GetManifestForFrameParameters = {
    /** Identifier of the frame containing document whose manifest is retrieved. */
    frameId: Page.FrameId;
  };
  export type GetManifestForFrameReturn = {
    /** Manifest URL for document in the given frame. */
    manifestURL: string;
  };
}
/** Audits domain allows investigation of page violations and possible improvements. */
export class Audits {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Returns the response body and size if it were re-encoded with the specified settings. Only
applies to images. */
  public getEncodedResponse(params: Audits.GetEncodedResponseParameters) {
    return this._client.send<Audits.GetEncodedResponseReturn>("Audits.getEncodedResponse", params);
  }
}
export namespace Audits {
  export type GetEncodedResponseParameters = {
    /** Identifier of the network request to get content for. */
    requestId: Network.RequestId;
    /** The encoding to use. */
    encoding: "webp" | "jpeg" | "png";
    /** The quality of the encoding (0-1). (defaults to 1) */
    quality?: number;
    /** Whether to only return the size information (defaults to false). */
    sizeOnly?: boolean;
  };
  export type GetEncodedResponseReturn = {
    /** The encoded body as a base64 string. Omitted if sizeOnly is true. */
    body?: string;
    /** Size before re-encoding. */
    originalSize: number;
    /** Size after re-encoding. */
    encodedSize: number;
  };
}
/** The Browser domain defines methods and events for browser managing. */
export class Browser {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Close browser gracefully. */
  public close() {
    return this._client.send<void>("Browser.close");
  }
  /** Returns version information. */
  public getVersion() {
    return this._client.send<Browser.GetVersionReturn>("Browser.getVersion");
  }
  /** Returns the command line switches for the browser process if, and only if
--enable-automation is on the commandline. */
  public getBrowserCommandLine() {
    return this._client.send<Browser.GetBrowserCommandLineReturn>("Browser.getBrowserCommandLine");
  }
  /** Get Chrome histograms. */
  public getHistograms(params: Browser.GetHistogramsParameters) {
    return this._client.send<Browser.GetHistogramsReturn>("Browser.getHistograms", params);
  }
  /** Get a Chrome histogram by name. */
  public getHistogram(params: Browser.GetHistogramParameters) {
    return this._client.send<Browser.GetHistogramReturn>("Browser.getHistogram", params);
  }
  /** Get position and size of the browser window. */
  public getWindowBounds(params: Browser.GetWindowBoundsParameters) {
    return this._client.send<Browser.GetWindowBoundsReturn>("Browser.getWindowBounds", params);
  }
  /** Get the browser window that contains the devtools target. */
  public getWindowForTarget(params: Browser.GetWindowForTargetParameters) {
    return this._client.send<Browser.GetWindowForTargetReturn>("Browser.getWindowForTarget", params);
  }
  /** Set position and/or size of the browser window. */
  public setWindowBounds(params: Browser.SetWindowBoundsParameters) {
    return this._client.send<void>("Browser.setWindowBounds", params);
  }
}
export namespace Browser {
  export type WindowID = number;
  /** The state of the browser window. */
  export type WindowState = "normal" | "minimized" | "maximized" | "fullscreen";
  /** Browser window bounds information */
  export interface Bounds {
    /** The offset from the left edge of the screen to the window in pixels. */
    left?: number;
    /** The offset from the top edge of the screen to the window in pixels. */
    top?: number;
    /** The window width in pixels. */
    width?: number;
    /** The window height in pixels. */
    height?: number;
    /** The window state. Default to normal. */
    windowState?: WindowState;
  }
  /** Chrome histogram bucket. */
  export interface Bucket {
    /** Minimum value (inclusive). */
    low: number;
    /** Maximum value (exclusive). */
    high: number;
    /** Number of samples. */
    count: number;
  }
  /** Chrome histogram. */
  export interface Histogram {
    /** Name. */
    name: string;
    /** Sum of sample values. */
    sum: number;
    /** Total number of samples. */
    count: number;
    /** Buckets. */
    buckets: Bucket[];
  }
  export type GetVersionReturn = {
    /** Protocol version. */
    protocolVersion: string;
    /** Product name. */
    product: string;
    /** Product revision. */
    revision: string;
    /** User-Agent. */
    userAgent: string;
    /** V8 version. */
    jsVersion: string;
  };
  export type GetBrowserCommandLineReturn = {
    /** Commandline parameters */
    arguments: string[];
  };
  export type GetHistogramsParameters = {
    /** Requested substring in name. Only histograms which have query as a
substring in their name are extracted. An empty or absent query returns
all histograms. */
    query?: string;
    /** If true, retrieve delta since last call. */
    delta?: boolean;
  };
  export type GetHistogramsReturn = {
    /** Histograms. */
    histograms: Histogram[];
  };
  export type GetHistogramParameters = {
    /** Requested histogram name. */
    name: string;
    /** If true, retrieve delta since last call. */
    delta?: boolean;
  };
  export type GetHistogramReturn = {
    /** Histogram. */
    histogram: Histogram;
  };
  export type GetWindowBoundsParameters = {
    /** Browser window id. */
    windowId: WindowID;
  };
  export type GetWindowBoundsReturn = {
    /** Bounds information of the window. When window state is 'minimized', the restored window
position and size are returned. */
    bounds: Bounds;
  };
  export type GetWindowForTargetParameters = {
    /** Devtools agent host id. */
    targetId: Target.TargetID;
  };
  export type GetWindowForTargetReturn = {
    /** Browser window id. */
    windowId: WindowID;
    /** Bounds information of the window. When window state is 'minimized', the restored window
position and size are returned. */
    bounds: Bounds;
  };
  export type SetWindowBoundsParameters = {
    /** Browser window id. */
    windowId: WindowID;
    /** New window bounds. The 'minimized', 'maximized' and 'fullscreen' states cannot be combined
with 'left', 'top', 'width' or 'height'. Leaves unspecified fields unchanged. */
    bounds: Bounds;
  };
}
/** This domain exposes CSS read/write operations. All CSS objects (stylesheets, rules, and styles)
have an associated `id` used in subsequent operations on the related object. Each object type has
a specific `id` structure, and those are not interchangeable between objects of different kinds.
CSS objects can be loaded using the `get*ForNode()` calls (which accept a DOM node id). A client
can also keep track of stylesheets via the `styleSheetAdded`/`styleSheetRemoved` events and
subsequently load the required stylesheet contents using the `getStyleSheet[Text]()` methods. */
export class CSS {
  private _fontsUpdated: CSS.FontsUpdatedHandler | null = null;
  private _mediaQueryResultChanged: CSS.MediaQueryResultChangedHandler | null = null;
  private _styleSheetAdded: CSS.StyleSheetAddedHandler | null = null;
  private _styleSheetChanged: CSS.StyleSheetChangedHandler | null = null;
  private _styleSheetRemoved: CSS.StyleSheetRemovedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Inserts a new rule with the given `ruleText` in a stylesheet with given `styleSheetId`, at the
position specified by `location`. */
  public addRule(params: CSS.AddRuleParameters) {
    return this._client.send<CSS.AddRuleReturn>("CSS.addRule", params);
  }
  /** Returns all class names from specified stylesheet. */
  public collectClassNames(params: CSS.CollectClassNamesParameters) {
    return this._client.send<CSS.CollectClassNamesReturn>("CSS.collectClassNames", params);
  }
  /** Creates a new special "via-inspector" stylesheet in the frame with given `frameId`. */
  public createStyleSheet(params: CSS.CreateStyleSheetParameters) {
    return this._client.send<CSS.CreateStyleSheetReturn>("CSS.createStyleSheet", params);
  }
  /** Disables the CSS agent for the given page. */
  public disable() {
    return this._client.send<void>("CSS.disable");
  }
  /** Enables the CSS agent for the given page. Clients should not assume that the CSS agent has been
enabled until the result of this command is received. */
  public enable() {
    return this._client.send<void>("CSS.enable");
  }
  /** Ensures that the given node will have specified pseudo-classes whenever its style is computed by
the browser. */
  public forcePseudoState(params: CSS.ForcePseudoStateParameters) {
    return this._client.send<void>("CSS.forcePseudoState", params);
  }
  public getBackgroundColors(params: CSS.GetBackgroundColorsParameters) {
    return this._client.send<CSS.GetBackgroundColorsReturn>("CSS.getBackgroundColors", params);
  }
  /** Returns the computed style for a DOM node identified by `nodeId`. */
  public getComputedStyleForNode(params: CSS.GetComputedStyleForNodeParameters) {
    return this._client.send<CSS.GetComputedStyleForNodeReturn>("CSS.getComputedStyleForNode", params);
  }
  /** Returns the styles defined inline (explicitly in the "style" attribute and implicitly, using DOM
attributes) for a DOM node identified by `nodeId`. */
  public getInlineStylesForNode(params: CSS.GetInlineStylesForNodeParameters) {
    return this._client.send<CSS.GetInlineStylesForNodeReturn>("CSS.getInlineStylesForNode", params);
  }
  /** Returns requested styles for a DOM node identified by `nodeId`. */
  public getMatchedStylesForNode(params: CSS.GetMatchedStylesForNodeParameters) {
    return this._client.send<CSS.GetMatchedStylesForNodeReturn>("CSS.getMatchedStylesForNode", params);
  }
  /** Returns all media queries parsed by the rendering engine. */
  public getMediaQueries() {
    return this._client.send<CSS.GetMediaQueriesReturn>("CSS.getMediaQueries");
  }
  /** Requests information about platform fonts which we used to render child TextNodes in the given
node. */
  public getPlatformFontsForNode(params: CSS.GetPlatformFontsForNodeParameters) {
    return this._client.send<CSS.GetPlatformFontsForNodeReturn>("CSS.getPlatformFontsForNode", params);
  }
  /** Returns the current textual content for a stylesheet. */
  public getStyleSheetText(params: CSS.GetStyleSheetTextParameters) {
    return this._client.send<CSS.GetStyleSheetTextReturn>("CSS.getStyleSheetText", params);
  }
  /** Find a rule with the given active property for the given node and set the new value for this
property */
  public setEffectivePropertyValueForNode(params: CSS.SetEffectivePropertyValueForNodeParameters) {
    return this._client.send<void>("CSS.setEffectivePropertyValueForNode", params);
  }
  /** Modifies the keyframe rule key text. */
  public setKeyframeKey(params: CSS.SetKeyframeKeyParameters) {
    return this._client.send<CSS.SetKeyframeKeyReturn>("CSS.setKeyframeKey", params);
  }
  /** Modifies the rule selector. */
  public setMediaText(params: CSS.SetMediaTextParameters) {
    return this._client.send<CSS.SetMediaTextReturn>("CSS.setMediaText", params);
  }
  /** Modifies the rule selector. */
  public setRuleSelector(params: CSS.SetRuleSelectorParameters) {
    return this._client.send<CSS.SetRuleSelectorReturn>("CSS.setRuleSelector", params);
  }
  /** Sets the new stylesheet text. */
  public setStyleSheetText(params: CSS.SetStyleSheetTextParameters) {
    return this._client.send<CSS.SetStyleSheetTextReturn>("CSS.setStyleSheetText", params);
  }
  /** Applies specified style edits one after another in the given order. */
  public setStyleTexts(params: CSS.SetStyleTextsParameters) {
    return this._client.send<CSS.SetStyleTextsReturn>("CSS.setStyleTexts", params);
  }
  /** Enables the selector recording. */
  public startRuleUsageTracking() {
    return this._client.send<void>("CSS.startRuleUsageTracking");
  }
  /** Stop tracking rule usage and return the list of rules that were used since last call to
`takeCoverageDelta` (or since start of coverage instrumentation) */
  public stopRuleUsageTracking() {
    return this._client.send<CSS.StopRuleUsageTrackingReturn>("CSS.stopRuleUsageTracking");
  }
  /** Obtain list of rules that became used since last call to this method (or since start of coverage
instrumentation) */
  public takeCoverageDelta() {
    return this._client.send<CSS.TakeCoverageDeltaReturn>("CSS.takeCoverageDelta");
  }
  /** Fires whenever a web font is updated.  A non-empty font parameter indicates a successfully loaded
web font */
  get fontsUpdated() {
    return this._fontsUpdated;
  }
  set fontsUpdated(handler) {
    if (this._fontsUpdated) {
      this._client.removeListener("CSS.fontsUpdated", this._fontsUpdated);
    }
    this._fontsUpdated = handler;
    if (handler) {
      this._client.on("CSS.fontsUpdated", handler);
    }
  }
  /** Fires whenever a MediaQuery result changes (for example, after a browser window has been
resized.) The current implementation considers only viewport-dependent media features. */
  get mediaQueryResultChanged() {
    return this._mediaQueryResultChanged;
  }
  set mediaQueryResultChanged(handler) {
    if (this._mediaQueryResultChanged) {
      this._client.removeListener("CSS.mediaQueryResultChanged", this._mediaQueryResultChanged);
    }
    this._mediaQueryResultChanged = handler;
    if (handler) {
      this._client.on("CSS.mediaQueryResultChanged", handler);
    }
  }
  /** Fired whenever an active document stylesheet is added. */
  get styleSheetAdded() {
    return this._styleSheetAdded;
  }
  set styleSheetAdded(handler) {
    if (this._styleSheetAdded) {
      this._client.removeListener("CSS.styleSheetAdded", this._styleSheetAdded);
    }
    this._styleSheetAdded = handler;
    if (handler) {
      this._client.on("CSS.styleSheetAdded", handler);
    }
  }
  /** Fired whenever a stylesheet is changed as a result of the client operation. */
  get styleSheetChanged() {
    return this._styleSheetChanged;
  }
  set styleSheetChanged(handler) {
    if (this._styleSheetChanged) {
      this._client.removeListener("CSS.styleSheetChanged", this._styleSheetChanged);
    }
    this._styleSheetChanged = handler;
    if (handler) {
      this._client.on("CSS.styleSheetChanged", handler);
    }
  }
  /** Fired whenever an active document stylesheet is removed. */
  get styleSheetRemoved() {
    return this._styleSheetRemoved;
  }
  set styleSheetRemoved(handler) {
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
  /** Stylesheet type: "injected" for stylesheets injected via extension, "user-agent" for user-agent
stylesheets, "inspector" for stylesheets created by the inspector (i.e. those holding the "via
inspector" rules), "regular" for regular stylesheets. */
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
    /** Whether this stylesheet is created for STYLE tag by parser. This flag is not set for
document.written STYLE tags. */
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
    /** The css style sheet identifier (absent for user agent stylesheet and user-specified
stylesheet rules) this rule came from. */
    styleSheetId?: StyleSheetId;
    /** Rule selector data. */
    selectorList: SelectorList;
    /** Parent stylesheet's origin. */
    origin: StyleSheetOrigin;
    /** Associated style declaration. */
    style: CSSStyle;
    /** Media list array (for rules involving media queries). The array enumerates media queries
starting with the innermost one, going outwards. */
    media?: CSSMedia[];
  }
  /** CSS coverage information. */
  export interface RuleUsage {
    /** The css style sheet identifier (absent for user agent stylesheet and user-specified
stylesheet rules) this rule came from. */
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
    /** Whether the property has "!important" annotation (implies `false` if absent). */
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
    /** The css style sheet identifier (absent for user agent stylesheet and user-specified
stylesheet rules) this rule came from. */
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
    /** Whether the property has "!important" annotation (implies `false` if absent). */
    important?: boolean;
    /** Whether the property is implicit (implies `false` if absent). */
    implicit?: boolean;
    /** The full property text as specified in the style. */
    text?: string;
    /** Whether the property is understood by the browser (implies `true` if absent). */
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
    /** Source of the media query: "mediaRule" if specified by a @media rule, "importRule" if
specified by an @import rule, "linkedSheet" if specified by a "media" attribute in a linked
stylesheet's LINK tag, "inlineSheet" if specified by a "media" attribute in an inline
stylesheet's STYLE tag. */
    source: "mediaRule" | "importRule" | "linkedSheet" | "inlineSheet";
    /** URL of the document containing the media query description. */
    sourceURL?: string;
    /** The associated rule (@media or @import) header range in the enclosing stylesheet (if
available). */
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
  /** Properties of a web font: https://www.w3.org/TR/2008/REC-CSS2-20080411/fonts.html#font-descriptions */
  export interface FontFace {
    /** The font-family. */
    fontFamily: string;
    /** The font-style. */
    fontStyle: string;
    /** The font-variant. */
    fontVariant: string;
    /** The font-weight. */
    fontWeight: string;
    /** The font-stretch. */
    fontStretch: string;
    /** The unicode-range. */
    unicodeRange: string;
    /** The src. */
    src: string;
    /** The resolved platform font family */
    platformFontFamily: string;
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
    /** The css style sheet identifier (absent for user agent stylesheet and user-specified
stylesheet rules) this rule came from. */
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
  export type FontsUpdatedParameters = {
    /** The web font that has loaded. */
    font?: FontFace;
  };
  export type FontsUpdatedHandler = (params: FontsUpdatedParameters) => void;
  export type MediaQueryResultChangedHandler = () => void;
  export type StyleSheetAddedParameters = {
    /** Added stylesheet metainfo. */
    header: CSSStyleSheetHeader;
  };
  export type StyleSheetAddedHandler = (params: StyleSheetAddedParameters) => void;
  export type StyleSheetChangedParameters = {
    styleSheetId: StyleSheetId;
  };
  export type StyleSheetChangedHandler = (params: StyleSheetChangedParameters) => void;
  export type StyleSheetRemovedParameters = {
    /** Identifier of the removed stylesheet. */
    styleSheetId: StyleSheetId;
  };
  export type StyleSheetRemovedHandler = (params: StyleSheetRemovedParameters) => void;
  export type AddRuleParameters = {
    /** The css style sheet identifier where a new rule should be inserted. */
    styleSheetId: StyleSheetId;
    /** The text of a new rule. */
    ruleText: string;
    /** Text position of a new rule in the target style sheet. */
    location: SourceRange;
  };
  export type AddRuleReturn = {
    /** The newly created rule. */
    rule: CSSRule;
  };
  export type CollectClassNamesParameters = {
    styleSheetId: StyleSheetId;
  };
  export type CollectClassNamesReturn = {
    /** Class name list. */
    classNames: string[];
  };
  export type CreateStyleSheetParameters = {
    /** Identifier of the frame where "via-inspector" stylesheet should be created. */
    frameId: Page.FrameId;
  };
  export type CreateStyleSheetReturn = {
    /** Identifier of the created "via-inspector" stylesheet. */
    styleSheetId: StyleSheetId;
  };
  export type ForcePseudoStateParameters = {
    /** The element id for which to force the pseudo state. */
    nodeId: DOM.NodeId;
    /** Element pseudo classes to force when computing the element's style. */
    forcedPseudoClasses: string[];
  };
  export type GetBackgroundColorsParameters = {
    /** Id of the node to get background colors for. */
    nodeId: DOM.NodeId;
  };
  export type GetBackgroundColorsReturn = {
    /** The range of background colors behind this element, if it contains any visible text. If no
visible text is present, this will be undefined. In the case of a flat background color,
this will consist of simply that color. In the case of a gradient, this will consist of each
of the color stops. For anything more complicated, this will be an empty array. Images will
be ignored (as if the image had failed to load). */
    backgroundColors?: string[];
    /** The computed font size for this node, as a CSS computed value string (e.g. '12px'). */
    computedFontSize?: string;
    /** The computed font weight for this node, as a CSS computed value string (e.g. 'normal' or
'100'). */
    computedFontWeight?: string;
    /** The computed font size for the document body, as a computed CSS value string (e.g. '16px'). */
    computedBodyFontSize?: string;
  };
  export type GetComputedStyleForNodeParameters = {
    nodeId: DOM.NodeId;
  };
  export type GetComputedStyleForNodeReturn = {
    /** Computed style for the specified DOM node. */
    computedStyle: CSSComputedStyleProperty[];
  };
  export type GetInlineStylesForNodeParameters = {
    nodeId: DOM.NodeId;
  };
  export type GetInlineStylesForNodeReturn = {
    /** Inline style for the specified DOM node. */
    inlineStyle?: CSSStyle;
    /** Attribute-defined element style (e.g. resulting from "width=20 height=100%"). */
    attributesStyle?: CSSStyle;
  };
  export type GetMatchedStylesForNodeParameters = {
    nodeId: DOM.NodeId;
  };
  export type GetMatchedStylesForNodeReturn = {
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
  export type GetMediaQueriesReturn = {
    medias: CSSMedia[];
  };
  export type GetPlatformFontsForNodeParameters = {
    nodeId: DOM.NodeId;
  };
  export type GetPlatformFontsForNodeReturn = {
    /** Usage statistics for every employed platform font. */
    fonts: PlatformFontUsage[];
  };
  export type GetStyleSheetTextParameters = {
    styleSheetId: StyleSheetId;
  };
  export type GetStyleSheetTextReturn = {
    /** The stylesheet text. */
    text: string;
  };
  export type SetEffectivePropertyValueForNodeParameters = {
    /** The element id for which to set property. */
    nodeId: DOM.NodeId;
    propertyName: string;
    value: string;
  };
  export type SetKeyframeKeyParameters = {
    styleSheetId: StyleSheetId;
    range: SourceRange;
    keyText: string;
  };
  export type SetKeyframeKeyReturn = {
    /** The resulting key text after modification. */
    keyText: Value;
  };
  export type SetMediaTextParameters = {
    styleSheetId: StyleSheetId;
    range: SourceRange;
    text: string;
  };
  export type SetMediaTextReturn = {
    /** The resulting CSS media rule after modification. */
    media: CSSMedia;
  };
  export type SetRuleSelectorParameters = {
    styleSheetId: StyleSheetId;
    range: SourceRange;
    selector: string;
  };
  export type SetRuleSelectorReturn = {
    /** The resulting selector list after modification. */
    selectorList: SelectorList;
  };
  export type SetStyleSheetTextParameters = {
    styleSheetId: StyleSheetId;
    text: string;
  };
  export type SetStyleSheetTextReturn = {
    /** URL of source map associated with script (if any). */
    sourceMapURL?: string;
  };
  export type SetStyleTextsParameters = {
    edits: StyleDeclarationEdit[];
  };
  export type SetStyleTextsReturn = {
    /** The resulting styles after modification. */
    styles: CSSStyle[];
  };
  export type StopRuleUsageTrackingReturn = {
    ruleUsage: RuleUsage[];
  };
  export type TakeCoverageDeltaReturn = {
    coverage: RuleUsage[];
  };
}
export class CacheStorage {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Deletes a cache. */
  public deleteCache(params: CacheStorage.DeleteCacheParameters) {
    return this._client.send<void>("CacheStorage.deleteCache", params);
  }
  /** Deletes a cache entry. */
  public deleteEntry(params: CacheStorage.DeleteEntryParameters) {
    return this._client.send<void>("CacheStorage.deleteEntry", params);
  }
  /** Requests cache names. */
  public requestCacheNames(params: CacheStorage.RequestCacheNamesParameters) {
    return this._client.send<CacheStorage.RequestCacheNamesReturn>("CacheStorage.requestCacheNames", params);
  }
  /** Fetches cache entry. */
  public requestCachedResponse(params: CacheStorage.RequestCachedResponseParameters) {
    return this._client.send<CacheStorage.RequestCachedResponseReturn>("CacheStorage.requestCachedResponse", params);
  }
  /** Requests data from cache. */
  public requestEntries(params: CacheStorage.RequestEntriesParameters) {
    return this._client.send<CacheStorage.RequestEntriesReturn>("CacheStorage.requestEntries", params);
  }
}
export namespace CacheStorage {
  /** Unique identifier of the Cache object. */
  export type CacheId = string;
  /** Data entry. */
  export interface DataEntry {
    /** Request URL. */
    requestURL: string;
    /** Request method. */
    requestMethod: string;
    /** Request headers */
    requestHeaders: Header[];
    /** Number of seconds since epoch. */
    responseTime: number;
    /** HTTP response status code. */
    responseStatus: number;
    /** HTTP response status text. */
    responseStatusText: string;
    /** Response headers */
    responseHeaders: Header[];
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
  export interface Header {
    name: string;
    value: string;
  }
  /** Cached response */
  export interface CachedResponse {
    /** Entry content, base64-encoded. */
    body: string;
  }
  export type DeleteCacheParameters = {
    /** Id of cache for deletion. */
    cacheId: CacheId;
  };
  export type DeleteEntryParameters = {
    /** Id of cache where the entry will be deleted. */
    cacheId: CacheId;
    /** URL spec of the request. */
    request: string;
  };
  export type RequestCacheNamesParameters = {
    /** Security origin. */
    securityOrigin: string;
  };
  export type RequestCacheNamesReturn = {
    /** Caches for the security origin. */
    caches: Cache[];
  };
  export type RequestCachedResponseParameters = {
    /** Id of cache that contains the enty. */
    cacheId: CacheId;
    /** URL spec of the request. */
    requestURL: string;
  };
  export type RequestCachedResponseReturn = {
    /** Response read from the cache. */
    response: CachedResponse;
  };
  export type RequestEntriesParameters = {
    /** ID of cache to get entries from. */
    cacheId: CacheId;
    /** Number of records to skip. */
    skipCount: number;
    /** Number of records to fetch. */
    pageSize: number;
  };
  export type RequestEntriesReturn = {
    /** Array of object store data entries. */
    cacheDataEntries: DataEntry[];
    /** If true, there are more entries to fetch in the given range. */
    hasMore: boolean;
  };
}
/** This domain exposes DOM read/write operations. Each DOM Node is represented with its mirror object
that has an `id`. This `id` can be used to get additional information on the Node, resolve it into
the JavaScript object wrapper, etc. It is important that client receives DOM events only for the
nodes that are known to the client. Backend keeps track of the nodes that were sent to the client
and never sends the same node twice. It is client's responsibility to collect information about
the nodes that were sent to the client.<p>Note that `iframe` owner elements will return
corresponding document elements as their child nodes.</p> */
export class DOM {
  private _attributeModified: DOM.AttributeModifiedHandler | null = null;
  private _attributeRemoved: DOM.AttributeRemovedHandler | null = null;
  private _characterDataModified: DOM.CharacterDataModifiedHandler | null = null;
  private _childNodeCountUpdated: DOM.ChildNodeCountUpdatedHandler | null = null;
  private _childNodeInserted: DOM.ChildNodeInsertedHandler | null = null;
  private _childNodeRemoved: DOM.ChildNodeRemovedHandler | null = null;
  private _distributedNodesUpdated: DOM.DistributedNodesUpdatedHandler | null = null;
  private _documentUpdated: DOM.DocumentUpdatedHandler | null = null;
  private _inlineStyleInvalidated: DOM.InlineStyleInvalidatedHandler | null = null;
  private _pseudoElementAdded: DOM.PseudoElementAddedHandler | null = null;
  private _pseudoElementRemoved: DOM.PseudoElementRemovedHandler | null = null;
  private _setChildNodes: DOM.SetChildNodesHandler | null = null;
  private _shadowRootPopped: DOM.ShadowRootPoppedHandler | null = null;
  private _shadowRootPushed: DOM.ShadowRootPushedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Collects class names for the node with given id and all of it's child nodes. */
  public collectClassNamesFromSubtree(params: DOM.CollectClassNamesFromSubtreeParameters) {
    return this._client.send<DOM.CollectClassNamesFromSubtreeReturn>("DOM.collectClassNamesFromSubtree", params);
  }
  /** Creates a deep copy of the specified node and places it into the target container before the
given anchor. */
  public copyTo(params: DOM.CopyToParameters) {
    return this._client.send<DOM.CopyToReturn>("DOM.copyTo", params);
  }
  /** Describes node given its id, does not require domain to be enabled. Does not start tracking any
objects, can be used for automation. */
  public describeNode(params: DOM.DescribeNodeParameters) {
    return this._client.send<DOM.DescribeNodeReturn>("DOM.describeNode", params);
  }
  /** Disables DOM agent for the given page. */
  public disable() {
    return this._client.send<void>("DOM.disable");
  }
  /** Discards search results from the session with the given id. `getSearchResults` should no longer
be called for that search. */
  public discardSearchResults(params: DOM.DiscardSearchResultsParameters) {
    return this._client.send<void>("DOM.discardSearchResults", params);
  }
  /** Enables DOM agent for the given page. */
  public enable() {
    return this._client.send<void>("DOM.enable");
  }
  /** Focuses the given element. */
  public focus(params: DOM.FocusParameters) {
    return this._client.send<void>("DOM.focus", params);
  }
  /** Returns attributes for the specified node. */
  public getAttributes(params: DOM.GetAttributesParameters) {
    return this._client.send<DOM.GetAttributesReturn>("DOM.getAttributes", params);
  }
  /** Returns boxes for the given node. */
  public getBoxModel(params: DOM.GetBoxModelParameters) {
    return this._client.send<DOM.GetBoxModelReturn>("DOM.getBoxModel", params);
  }
  /** Returns quads that describe node position on the page. This method
might return multiple quads for inline nodes. */
  public getContentQuads(params: DOM.GetContentQuadsParameters) {
    return this._client.send<DOM.GetContentQuadsReturn>("DOM.getContentQuads", params);
  }
  /** Returns the root DOM node (and optionally the subtree) to the caller. */
  public getDocument(params: DOM.GetDocumentParameters) {
    return this._client.send<DOM.GetDocumentReturn>("DOM.getDocument", params);
  }
  /** Returns the root DOM node (and optionally the subtree) to the caller. */
  public getFlattenedDocument(params: DOM.GetFlattenedDocumentParameters) {
    return this._client.send<DOM.GetFlattenedDocumentReturn>("DOM.getFlattenedDocument", params);
  }
  /** Returns node id at given location. */
  public getNodeForLocation(params: DOM.GetNodeForLocationParameters) {
    return this._client.send<DOM.GetNodeForLocationReturn>("DOM.getNodeForLocation", params);
  }
  /** Returns node's HTML markup. */
  public getOuterHTML(params: DOM.GetOuterHTMLParameters) {
    return this._client.send<DOM.GetOuterHTMLReturn>("DOM.getOuterHTML", params);
  }
  /** Returns the id of the nearest ancestor that is a relayout boundary. */
  public getRelayoutBoundary(params: DOM.GetRelayoutBoundaryParameters) {
    return this._client.send<DOM.GetRelayoutBoundaryReturn>("DOM.getRelayoutBoundary", params);
  }
  /** Returns search results from given `fromIndex` to given `toIndex` from the search with the given
identifier. */
  public getSearchResults(params: DOM.GetSearchResultsParameters) {
    return this._client.send<DOM.GetSearchResultsReturn>("DOM.getSearchResults", params);
  }
  /** Hides any highlight. */
  public hideHighlight() {
    return this._client.send<void>("DOM.hideHighlight");
  }
  /** Highlights DOM node. */
  public highlightNode() {
    return this._client.send<void>("DOM.highlightNode");
  }
  /** Highlights given rectangle. */
  public highlightRect() {
    return this._client.send<void>("DOM.highlightRect");
  }
  /** Marks last undoable state. */
  public markUndoableState() {
    return this._client.send<void>("DOM.markUndoableState");
  }
  /** Moves node into the new container, places it before the given anchor. */
  public moveTo(params: DOM.MoveToParameters) {
    return this._client.send<DOM.MoveToReturn>("DOM.moveTo", params);
  }
  /** Searches for a given string in the DOM tree. Use `getSearchResults` to access search results or
`cancelSearch` to end this search session. */
  public performSearch(params: DOM.PerformSearchParameters) {
    return this._client.send<DOM.PerformSearchReturn>("DOM.performSearch", params);
  }
  /** Requests that the node is sent to the caller given its path. // FIXME, use XPath */
  public pushNodeByPathToFrontend(params: DOM.PushNodeByPathToFrontendParameters) {
    return this._client.send<DOM.PushNodeByPathToFrontendReturn>("DOM.pushNodeByPathToFrontend", params);
  }
  /** Requests that a batch of nodes is sent to the caller given their backend node ids. */
  public pushNodesByBackendIdsToFrontend(params: DOM.PushNodesByBackendIdsToFrontendParameters) {
    return this._client.send<DOM.PushNodesByBackendIdsToFrontendReturn>("DOM.pushNodesByBackendIdsToFrontend", params);
  }
  /** Executes `querySelector` on a given node. */
  public querySelector(params: DOM.QuerySelectorParameters) {
    return this._client.send<DOM.QuerySelectorReturn>("DOM.querySelector", params);
  }
  /** Executes `querySelectorAll` on a given node. */
  public querySelectorAll(params: DOM.QuerySelectorAllParameters) {
    return this._client.send<DOM.QuerySelectorAllReturn>("DOM.querySelectorAll", params);
  }
  /** Re-does the last undone action. */
  public redo() {
    return this._client.send<void>("DOM.redo");
  }
  /** Removes attribute with given name from an element with given id. */
  public removeAttribute(params: DOM.RemoveAttributeParameters) {
    return this._client.send<void>("DOM.removeAttribute", params);
  }
  /** Removes node with given id. */
  public removeNode(params: DOM.RemoveNodeParameters) {
    return this._client.send<void>("DOM.removeNode", params);
  }
  /** Requests that children of the node with given id are returned to the caller in form of
`setChildNodes` events where not only immediate children are retrieved, but all children down to
the specified depth. */
  public requestChildNodes(params: DOM.RequestChildNodesParameters) {
    return this._client.send<void>("DOM.requestChildNodes", params);
  }
  /** Requests that the node is sent to the caller given the JavaScript node object reference. All
nodes that form the path from the node to the root are also sent to the client as a series of
`setChildNodes` notifications. */
  public requestNode(params: DOM.RequestNodeParameters) {
    return this._client.send<DOM.RequestNodeReturn>("DOM.requestNode", params);
  }
  /** Resolves the JavaScript node object for a given NodeId or BackendNodeId. */
  public resolveNode(params: DOM.ResolveNodeParameters) {
    return this._client.send<DOM.ResolveNodeReturn>("DOM.resolveNode", params);
  }
  /** Sets attribute for an element with given id. */
  public setAttributeValue(params: DOM.SetAttributeValueParameters) {
    return this._client.send<void>("DOM.setAttributeValue", params);
  }
  /** Sets attributes on element with given id. This method is useful when user edits some existing
attribute value and types in several attribute name/value pairs. */
  public setAttributesAsText(params: DOM.SetAttributesAsTextParameters) {
    return this._client.send<void>("DOM.setAttributesAsText", params);
  }
  /** Sets files for the given file input element. */
  public setFileInputFiles(params: DOM.SetFileInputFilesParameters) {
    return this._client.send<void>("DOM.setFileInputFiles", params);
  }
  /** Enables console to refer to the node with given id via $x (see Command Line API for more details
$x functions). */
  public setInspectedNode(params: DOM.SetInspectedNodeParameters) {
    return this._client.send<void>("DOM.setInspectedNode", params);
  }
  /** Sets node name for a node with given id. */
  public setNodeName(params: DOM.SetNodeNameParameters) {
    return this._client.send<DOM.SetNodeNameReturn>("DOM.setNodeName", params);
  }
  /** Sets node value for a node with given id. */
  public setNodeValue(params: DOM.SetNodeValueParameters) {
    return this._client.send<void>("DOM.setNodeValue", params);
  }
  /** Sets node HTML markup, returns new node id. */
  public setOuterHTML(params: DOM.SetOuterHTMLParameters) {
    return this._client.send<void>("DOM.setOuterHTML", params);
  }
  /** Undoes the last performed action. */
  public undo() {
    return this._client.send<void>("DOM.undo");
  }
  /** Returns iframe node that owns iframe with the given domain. */
  public getFrameOwner(params: DOM.GetFrameOwnerParameters) {
    return this._client.send<DOM.GetFrameOwnerReturn>("DOM.getFrameOwner", params);
  }
  /** Fired when `Element`'s attribute is modified. */
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
  /** Fired when `Element`'s attribute is removed. */
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
  /** Mirrors `DOMCharacterDataModified` event. */
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
  /** Fired when `Container`'s child node count has changed. */
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
  /** Mirrors `DOMNodeInserted` event. */
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
  /** Mirrors `DOMNodeRemoved` event. */
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
  /** Called when distrubution is changed. */
  get distributedNodesUpdated() {
    return this._distributedNodesUpdated;
  }
  set distributedNodesUpdated(handler) {
    if (this._distributedNodesUpdated) {
      this._client.removeListener("DOM.distributedNodesUpdated", this._distributedNodesUpdated);
    }
    this._distributedNodesUpdated = handler;
    if (handler) {
      this._client.on("DOM.distributedNodesUpdated", handler);
    }
  }
  /** Fired when `Document` has been totally updated. Node ids are no longer valid. */
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
  /** Fired when `Element`'s inline style is modified via a CSS property modification. */
  get inlineStyleInvalidated() {
    return this._inlineStyleInvalidated;
  }
  set inlineStyleInvalidated(handler) {
    if (this._inlineStyleInvalidated) {
      this._client.removeListener("DOM.inlineStyleInvalidated", this._inlineStyleInvalidated);
    }
    this._inlineStyleInvalidated = handler;
    if (handler) {
      this._client.on("DOM.inlineStyleInvalidated", handler);
    }
  }
  /** Called when a pseudo element is added to an element. */
  get pseudoElementAdded() {
    return this._pseudoElementAdded;
  }
  set pseudoElementAdded(handler) {
    if (this._pseudoElementAdded) {
      this._client.removeListener("DOM.pseudoElementAdded", this._pseudoElementAdded);
    }
    this._pseudoElementAdded = handler;
    if (handler) {
      this._client.on("DOM.pseudoElementAdded", handler);
    }
  }
  /** Called when a pseudo element is removed from an element. */
  get pseudoElementRemoved() {
    return this._pseudoElementRemoved;
  }
  set pseudoElementRemoved(handler) {
    if (this._pseudoElementRemoved) {
      this._client.removeListener("DOM.pseudoElementRemoved", this._pseudoElementRemoved);
    }
    this._pseudoElementRemoved = handler;
    if (handler) {
      this._client.on("DOM.pseudoElementRemoved", handler);
    }
  }
  /** Fired when backend wants to provide client with the missing DOM structure. This happens upon
most of the calls requesting node ids. */
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
  /** Called when shadow root is popped from the element. */
  get shadowRootPopped() {
    return this._shadowRootPopped;
  }
  set shadowRootPopped(handler) {
    if (this._shadowRootPopped) {
      this._client.removeListener("DOM.shadowRootPopped", this._shadowRootPopped);
    }
    this._shadowRootPopped = handler;
    if (handler) {
      this._client.on("DOM.shadowRootPopped", handler);
    }
  }
  /** Called when shadow root is pushed into the element. */
  get shadowRootPushed() {
    return this._shadowRootPushed;
  }
  set shadowRootPushed(handler) {
    if (this._shadowRootPushed) {
      this._client.removeListener("DOM.shadowRootPushed", this._shadowRootPushed);
    }
    this._shadowRootPushed = handler;
    if (handler) {
      this._client.on("DOM.shadowRootPushed", handler);
    }
  }
}
export namespace DOM {
  /** Unique DOM node identifier. */
  export type NodeId = number;
  /** Unique DOM node identifier used to reference a node that may not have been pushed to the
front-end. */
  export type BackendNodeId = number;
  /** Backend node with a friendly name. */
  export interface BackendNode {
    /** `Node`'s nodeType. */
    nodeType: number;
    /** `Node`'s nodeName. */
    nodeName: string;
    backendNodeId: BackendNodeId;
  }
  /** Pseudo element type. */
  export type PseudoType = "first-line" | "first-letter" | "before" | "after" | "backdrop" | "selection" | "first-line-inherited" | "scrollbar" | "scrollbar-thumb" | "scrollbar-button" | "scrollbar-track" | "scrollbar-track-piece" | "scrollbar-corner" | "resizer" | "input-list-button";
  /** Shadow root type. */
  export type ShadowRootType = "user-agent" | "open" | "closed";
  /** DOM interaction is implemented in terms of mirror objects that represent the actual DOM nodes.
DOMNode is a base node mirror type. */
  export interface Node {
    /** Node identifier that is passed into the rest of the DOM messages as the `nodeId`. Backend
will only push node with given `id` once. It is aware of all requested nodes and will only
fire DOM events for nodes known to the client. */
    nodeId: NodeId;
    /** The id of the parent node if any. */
    parentId?: NodeId;
    /** The BackendNodeId for this node. */
    backendNodeId: BackendNodeId;
    /** `Node`'s nodeType. */
    nodeType: number;
    /** `Node`'s nodeName. */
    nodeName: string;
    /** `Node`'s localName. */
    localName: string;
    /** `Node`'s nodeValue. */
    nodeValue: string;
    /** Child count for `Container` nodes. */
    childNodeCount?: number;
    /** Child nodes of this node when requested with children. */
    children?: Node[];
    /** Attributes of the `Element` node in the form of flat array `[name1, value1, name2, value2]`. */
    attributes?: string[];
    /** Document URL that `Document` or `FrameOwner` node points to. */
    documentURL?: string;
    /** Base URL that `Document` or `FrameOwner` node uses for URL completion. */
    baseURL?: string;
    /** `DocumentType`'s publicId. */
    publicId?: string;
    /** `DocumentType`'s systemId. */
    systemId?: string;
    /** `DocumentType`'s internalSubset. */
    internalSubset?: string;
    /** `Document`'s XML version in case of XML documents. */
    xmlVersion?: string;
    /** `Attr`'s name. */
    name?: string;
    /** `Attr`'s value. */
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
  export type DistributedNodesUpdatedParameters = {
    /** Insertion point where distrubuted nodes were updated. */
    insertionPointId: NodeId;
    /** Distributed nodes for given insertion point. */
    distributedNodes: BackendNode[];
  };
  export type DistributedNodesUpdatedHandler = (params: DistributedNodesUpdatedParameters) => void;
  export type DocumentUpdatedHandler = () => void;
  export type InlineStyleInvalidatedParameters = {
    /** Ids of the nodes for which the inline styles have been invalidated. */
    nodeIds: NodeId[];
  };
  export type InlineStyleInvalidatedHandler = (params: InlineStyleInvalidatedParameters) => void;
  export type PseudoElementAddedParameters = {
    /** Pseudo element's parent element id. */
    parentId: NodeId;
    /** The added pseudo element. */
    pseudoElement: Node;
  };
  export type PseudoElementAddedHandler = (params: PseudoElementAddedParameters) => void;
  export type PseudoElementRemovedParameters = {
    /** Pseudo element's parent element id. */
    parentId: NodeId;
    /** The removed pseudo element id. */
    pseudoElementId: NodeId;
  };
  export type PseudoElementRemovedHandler = (params: PseudoElementRemovedParameters) => void;
  export type SetChildNodesParameters = {
    /** Parent node id to populate with children. */
    parentId: NodeId;
    /** Child nodes array. */
    nodes: Node[];
  };
  export type SetChildNodesHandler = (params: SetChildNodesParameters) => void;
  export type ShadowRootPoppedParameters = {
    /** Host element id. */
    hostId: NodeId;
    /** Shadow root id. */
    rootId: NodeId;
  };
  export type ShadowRootPoppedHandler = (params: ShadowRootPoppedParameters) => void;
  export type ShadowRootPushedParameters = {
    /** Host element id. */
    hostId: NodeId;
    /** Shadow root. */
    root: Node;
  };
  export type ShadowRootPushedHandler = (params: ShadowRootPushedParameters) => void;
  export type CollectClassNamesFromSubtreeParameters = {
    /** Id of the node to collect class names. */
    nodeId: NodeId;
  };
  export type CollectClassNamesFromSubtreeReturn = {
    /** Class name list. */
    classNames: string[];
  };
  export type CopyToParameters = {
    /** Id of the node to copy. */
    nodeId: NodeId;
    /** Id of the element to drop the copy into. */
    targetNodeId: NodeId;
    /** Drop the copy before this node (if absent, the copy becomes the last child of
`targetNodeId`). */
    insertBeforeNodeId?: NodeId;
  };
  export type CopyToReturn = {
    /** Id of the node clone. */
    nodeId: NodeId;
  };
  export type DescribeNodeParameters = {
    /** Identifier of the node. */
    nodeId?: NodeId;
    /** Identifier of the backend node. */
    backendNodeId?: BackendNodeId;
    /** JavaScript object id of the node wrapper. */
    objectId?: Runtime.RemoteObjectId;
    /** The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the
entire subtree or provide an integer larger than 0. */
    depth?: number;
    /** Whether or not iframes and shadow roots should be traversed when returning the subtree
(default is false). */
    pierce?: boolean;
  };
  export type DescribeNodeReturn = {
    /** Node description. */
    node: Node;
  };
  export type DiscardSearchResultsParameters = {
    /** Unique search session identifier. */
    searchId: string;
  };
  export type FocusParameters = {
    /** Identifier of the node. */
    nodeId?: NodeId;
    /** Identifier of the backend node. */
    backendNodeId?: BackendNodeId;
    /** JavaScript object id of the node wrapper. */
    objectId?: Runtime.RemoteObjectId;
  };
  export type GetAttributesParameters = {
    /** Id of the node to retrieve attibutes for. */
    nodeId: NodeId;
  };
  export type GetAttributesReturn = {
    /** An interleaved array of node attribute names and values. */
    attributes: string[];
  };
  export type GetBoxModelParameters = {
    /** Identifier of the node. */
    nodeId?: NodeId;
    /** Identifier of the backend node. */
    backendNodeId?: BackendNodeId;
    /** JavaScript object id of the node wrapper. */
    objectId?: Runtime.RemoteObjectId;
  };
  export type GetBoxModelReturn = {
    /** Box model for the node. */
    model: BoxModel;
  };
  export type GetContentQuadsParameters = {
    /** Identifier of the node. */
    nodeId?: NodeId;
    /** Identifier of the backend node. */
    backendNodeId?: BackendNodeId;
    /** JavaScript object id of the node wrapper. */
    objectId?: Runtime.RemoteObjectId;
  };
  export type GetContentQuadsReturn = {
    /** Quads that describe node layout relative to viewport. */
    quads: Quad[];
  };
  export type GetDocumentParameters = {
    /** The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the
entire subtree or provide an integer larger than 0. */
    depth?: number;
    /** Whether or not iframes and shadow roots should be traversed when returning the subtree
(default is false). */
    pierce?: boolean;
  };
  export type GetDocumentReturn = {
    /** Resulting node. */
    root: Node;
  };
  export type GetFlattenedDocumentParameters = {
    /** The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the
entire subtree or provide an integer larger than 0. */
    depth?: number;
    /** Whether or not iframes and shadow roots should be traversed when returning the subtree
(default is false). */
    pierce?: boolean;
  };
  export type GetFlattenedDocumentReturn = {
    /** Resulting node. */
    nodes: Node[];
  };
  export type GetNodeForLocationParameters = {
    /** X coordinate. */
    x: number;
    /** Y coordinate. */
    y: number;
    /** False to skip to the nearest non-UA shadow root ancestor (default: false). */
    includeUserAgentShadowDOM?: boolean;
  };
  export type GetNodeForLocationReturn = {
    /** Id of the node at given coordinates. */
    nodeId: NodeId;
  };
  export type GetOuterHTMLParameters = {
    /** Identifier of the node. */
    nodeId?: NodeId;
    /** Identifier of the backend node. */
    backendNodeId?: BackendNodeId;
    /** JavaScript object id of the node wrapper. */
    objectId?: Runtime.RemoteObjectId;
  };
  export type GetOuterHTMLReturn = {
    /** Outer HTML markup. */
    outerHTML: string;
  };
  export type GetRelayoutBoundaryParameters = {
    /** Id of the node. */
    nodeId: NodeId;
  };
  export type GetRelayoutBoundaryReturn = {
    /** Relayout boundary node id for the given node. */
    nodeId: NodeId;
  };
  export type GetSearchResultsParameters = {
    /** Unique search session identifier. */
    searchId: string;
    /** Start index of the search result to be returned. */
    fromIndex: number;
    /** End index of the search result to be returned. */
    toIndex: number;
  };
  export type GetSearchResultsReturn = {
    /** Ids of the search result nodes. */
    nodeIds: NodeId[];
  };
  export type MoveToParameters = {
    /** Id of the node to move. */
    nodeId: NodeId;
    /** Id of the element to drop the moved node into. */
    targetNodeId: NodeId;
    /** Drop node before this one (if absent, the moved node becomes the last child of
`targetNodeId`). */
    insertBeforeNodeId?: NodeId;
  };
  export type MoveToReturn = {
    /** New id of the moved node. */
    nodeId: NodeId;
  };
  export type PerformSearchParameters = {
    /** Plain text or query selector or XPath search query. */
    query: string;
    /** True to search in user agent shadow DOM. */
    includeUserAgentShadowDOM?: boolean;
  };
  export type PerformSearchReturn = {
    /** Unique search session identifier. */
    searchId: string;
    /** Number of search results. */
    resultCount: number;
  };
  export type PushNodeByPathToFrontendParameters = {
    /** Path to node in the proprietary format. */
    path: string;
  };
  export type PushNodeByPathToFrontendReturn = {
    /** Id of the node for given path. */
    nodeId: NodeId;
  };
  export type PushNodesByBackendIdsToFrontendParameters = {
    /** The array of backend node ids. */
    backendNodeIds: BackendNodeId[];
  };
  export type PushNodesByBackendIdsToFrontendReturn = {
    /** The array of ids of pushed nodes that correspond to the backend ids specified in
backendNodeIds. */
    nodeIds: NodeId[];
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
  export type RemoveAttributeParameters = {
    /** Id of the element to remove attribute from. */
    nodeId: NodeId;
    /** Name of the attribute to remove. */
    name: string;
  };
  export type RemoveNodeParameters = {
    /** Id of the node to remove. */
    nodeId: NodeId;
  };
  export type RequestChildNodesParameters = {
    /** Id of the node to get children for. */
    nodeId: NodeId;
    /** The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the
entire subtree or provide an integer larger than 0. */
    depth?: number;
    /** Whether or not iframes and shadow roots should be traversed when returning the sub-tree
(default is false). */
    pierce?: boolean;
  };
  export type RequestNodeParameters = {
    /** JavaScript object id to convert into node. */
    objectId: Runtime.RemoteObjectId;
  };
  export type RequestNodeReturn = {
    /** Node id for given object. */
    nodeId: NodeId;
  };
  export type ResolveNodeParameters = {
    /** Id of the node to resolve. */
    nodeId?: NodeId;
    /** Backend identifier of the node to resolve. */
    backendNodeId?: DOM.BackendNodeId;
    /** Symbolic group name that can be used to release multiple objects. */
    objectGroup?: string;
  };
  export type ResolveNodeReturn = {
    /** JavaScript object wrapper for given node. */
    object: Runtime.RemoteObject;
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
    /** Attribute name to replace with new attributes derived from text in case text parsed
successfully. */
    name?: string;
  };
  export type SetFileInputFilesParameters = {
    /** Array of file paths to set. */
    files: string[];
    /** Identifier of the node. */
    nodeId?: NodeId;
    /** Identifier of the backend node. */
    backendNodeId?: BackendNodeId;
    /** JavaScript object id of the node wrapper. */
    objectId?: Runtime.RemoteObjectId;
  };
  export type SetInspectedNodeParameters = {
    /** DOM node id to be accessible by means of $x command line API. */
    nodeId: NodeId;
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
  export type SetOuterHTMLParameters = {
    /** Id of the node to set markup for. */
    nodeId: NodeId;
    /** Outer HTML markup to set. */
    outerHTML: string;
  };
  export type GetFrameOwnerParameters = {
    frameId: Page.FrameId;
  };
  export type GetFrameOwnerReturn = {
    nodeId: NodeId;
  };
}
/** DOM debugging allows setting breakpoints on particular DOM operations and events. JavaScript
execution will stop on these operations as if there was a regular breakpoint set. */
export class DOMDebugger {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Returns event listeners of the given object. */
  public getEventListeners(params: DOMDebugger.GetEventListenersParameters) {
    return this._client.send<DOMDebugger.GetEventListenersReturn>("DOMDebugger.getEventListeners", params);
  }
  /** Removes DOM breakpoint that was set using `setDOMBreakpoint`. */
  public removeDOMBreakpoint(params: DOMDebugger.RemoveDOMBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.removeDOMBreakpoint", params);
  }
  /** Removes breakpoint on particular DOM event. */
  public removeEventListenerBreakpoint(params: DOMDebugger.RemoveEventListenerBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.removeEventListenerBreakpoint", params);
  }
  /** Removes breakpoint on particular native event. */
  public removeInstrumentationBreakpoint(params: DOMDebugger.RemoveInstrumentationBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.removeInstrumentationBreakpoint", params);
  }
  /** Removes breakpoint from XMLHttpRequest. */
  public removeXHRBreakpoint(params: DOMDebugger.RemoveXHRBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.removeXHRBreakpoint", params);
  }
  /** Sets breakpoint on particular operation with DOM. */
  public setDOMBreakpoint(params: DOMDebugger.SetDOMBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.setDOMBreakpoint", params);
  }
  /** Sets breakpoint on particular DOM event. */
  public setEventListenerBreakpoint(params: DOMDebugger.SetEventListenerBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.setEventListenerBreakpoint", params);
  }
  /** Sets breakpoint on particular native event. */
  public setInstrumentationBreakpoint(params: DOMDebugger.SetInstrumentationBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.setInstrumentationBreakpoint", params);
  }
  /** Sets breakpoint on XMLHttpRequest. */
  public setXHRBreakpoint(params: DOMDebugger.SetXHRBreakpointParameters) {
    return this._client.send<void>("DOMDebugger.setXHRBreakpoint", params);
  }
}
export namespace DOMDebugger {
  /** DOM breakpoint type. */
  export type DOMBreakpointType = "subtree-modified" | "attribute-modified" | "node-removed";
  /** Object event listener. */
  export interface EventListener {
    /** `EventListener`'s type. */
    type: string;
    /** `EventListener`'s useCapture. */
    useCapture: boolean;
    /** `EventListener`'s passive flag. */
    passive: boolean;
    /** `EventListener`'s once flag. */
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
  export type GetEventListenersParameters = {
    /** Identifier of the object to return listeners for. */
    objectId: Runtime.RemoteObjectId;
    /** The maximum depth at which Node children should be retrieved, defaults to 1. Use -1 for the
entire subtree or provide an integer larger than 0. */
    depth?: number;
    /** Whether or not iframes and shadow roots should be traversed when returning the subtree
(default is false). Reports listeners for all contexts if pierce is enabled. */
    pierce?: boolean;
  };
  export type GetEventListenersReturn = {
    /** Array of relevant listeners. */
    listeners: EventListener[];
  };
  export type RemoveDOMBreakpointParameters = {
    /** Identifier of the node to remove breakpoint from. */
    nodeId: DOM.NodeId;
    /** Type of the breakpoint to remove. */
    type: DOMBreakpointType;
  };
  export type RemoveEventListenerBreakpointParameters = {
    /** Event name. */
    eventName: string;
    /** EventTarget interface name. */
    targetName?: string;
  };
  export type RemoveInstrumentationBreakpointParameters = {
    /** Instrumentation name to stop on. */
    eventName: string;
  };
  export type RemoveXHRBreakpointParameters = {
    /** Resource URL substring. */
    url: string;
  };
  export type SetDOMBreakpointParameters = {
    /** Identifier of the node to set breakpoint on. */
    nodeId: DOM.NodeId;
    /** Type of the operation to stop upon. */
    type: DOMBreakpointType;
  };
  export type SetEventListenerBreakpointParameters = {
    /** DOM Event name to stop on (any DOM event will do). */
    eventName: string;
    /** EventTarget interface name to stop on. If equal to `"*"` or not provided, will stop on any
EventTarget. */
    targetName?: string;
  };
  export type SetInstrumentationBreakpointParameters = {
    /** Instrumentation name to stop on. */
    eventName: string;
  };
  export type SetXHRBreakpointParameters = {
    /** Resource URL substring. All XHRs having this substring in the URL will get stopped upon. */
    url: string;
  };
}
/** This domain facilitates obtaining document snapshots with DOM, layout, and style information. */
export class DOMSnapshot {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Disables DOM snapshot agent for the given page. */
  public disable() {
    return this._client.send<void>("DOMSnapshot.disable");
  }
  /** Enables DOM snapshot agent for the given page. */
  public enable() {
    return this._client.send<void>("DOMSnapshot.enable");
  }
  /** Returns a document snapshot, including the full DOM tree of the root node (including iframes,
template contents, and imported documents) in a flattened array, as well as layout and
white-listed computed style information for the nodes. Shadow DOM in the returned DOM tree is
flattened. */
  public getSnapshot(params: DOMSnapshot.GetSnapshotParameters) {
    return this._client.send<DOMSnapshot.GetSnapshotReturn>("DOMSnapshot.getSnapshot", params);
  }
  /** Returns a document snapshot, including the full DOM tree of the root node (including iframes,
template contents, and imported documents) in a flattened array, as well as layout and
white-listed computed style information for the nodes. Shadow DOM in the returned DOM tree is
flattened. */
  public captureSnapshot(params: DOMSnapshot.CaptureSnapshotParameters) {
    return this._client.send<DOMSnapshot.CaptureSnapshotReturn>("DOMSnapshot.captureSnapshot", params);
  }
}
export namespace DOMSnapshot {
  /** A Node in the DOM tree. */
  export interface DOMNode {
    /** `Node`'s nodeType. */
    nodeType: number;
    /** `Node`'s nodeName. */
    nodeName: string;
    /** `Node`'s nodeValue. */
    nodeValue: string;
    /** Only set for textarea elements, contains the text value. */
    textValue?: string;
    /** Only set for input elements, contains the input's associated text value. */
    inputValue?: string;
    /** Only set for radio and checkbox input elements, indicates if the element has been checked */
    inputChecked?: boolean;
    /** Only set for option elements, indicates if the element has been selected */
    optionSelected?: boolean;
    /** `Node`'s id, corresponds to DOM.Node.backendNodeId. */
    backendNodeId: DOM.BackendNodeId;
    /** The indexes of the node's child nodes in the `domNodes` array returned by `getSnapshot`, if
any. */
    childNodeIndexes?: number[];
    /** Attributes of an `Element` node. */
    attributes?: NameValue[];
    /** Indexes of pseudo elements associated with this node in the `domNodes` array returned by
`getSnapshot`, if any. */
    pseudoElementIndexes?: number[];
    /** The index of the node's related layout tree node in the `layoutTreeNodes` array returned by
`getSnapshot`, if any. */
    layoutNodeIndex?: number;
    /** Document URL that `Document` or `FrameOwner` node points to. */
    documentURL?: string;
    /** Base URL that `Document` or `FrameOwner` node uses for URL completion. */
    baseURL?: string;
    /** Only set for documents, contains the document's content language. */
    contentLanguage?: string;
    /** Only set for documents, contains the document's character set encoding. */
    documentEncoding?: string;
    /** `DocumentType` node's publicId. */
    publicId?: string;
    /** `DocumentType` node's systemId. */
    systemId?: string;
    /** Frame ID for frame owner elements and also for the document node. */
    frameId?: Page.FrameId;
    /** The index of a frame owner element's content document in the `domNodes` array returned by
`getSnapshot`, if any. */
    contentDocumentIndex?: number;
    /** Type of a pseudo element node. */
    pseudoType?: DOM.PseudoType;
    /** Shadow root type. */
    shadowRootType?: DOM.ShadowRootType;
    /** Whether this DOM node responds to mouse clicks. This includes nodes that have had click
event listeners attached via JavaScript as well as anchor tags that naturally navigate when
clicked. */
    isClickable?: boolean;
    /** Details of the node's event listeners, if any. */
    eventListeners?: DOMDebugger.EventListener[];
    /** The selected url for nodes with a srcset attribute. */
    currentSourceURL?: string;
    /** The url of the script (if any) that generates this node. */
    originURL?: string;
  }
  /** Details of post layout rendered text positions. The exact layout should not be regarded as
stable and may change between versions. */
  export interface InlineTextBox {
    /** The absolute position bounding box. */
    boundingBox: DOM.Rect;
    /** The starting index in characters, for this post layout textbox substring. Characters that
would be represented as a surrogate pair in UTF-16 have length 2. */
    startCharacterIndex: number;
    /** The number of characters in this post layout textbox substring. Characters that would be
represented as a surrogate pair in UTF-16 have length 2. */
    numCharacters: number;
  }
  /** Details of an element in the DOM tree with a LayoutObject. */
  export interface LayoutTreeNode {
    /** The index of the related DOM node in the `domNodes` array returned by `getSnapshot`. */
    domNodeIndex: number;
    /** The absolute position bounding box. */
    boundingBox: DOM.Rect;
    /** Contents of the LayoutText, if any. */
    layoutText?: string;
    /** The post-layout inline text nodes, if any. */
    inlineTextNodes?: InlineTextBox[];
    /** Index into the `computedStyles` array returned by `getSnapshot`. */
    styleIndex?: number;
    /** Global paint order index, which is determined by the stacking order of the nodes. Nodes
that are painted together will have the same index. Only provided if includePaintOrder in
getSnapshot was true. */
    paintOrder?: number;
  }
  /** A subset of the full ComputedStyle as defined by the request whitelist. */
  export interface ComputedStyle {
    /** Name/value pairs of computed style properties. */
    properties: NameValue[];
  }
  /** A name/value pair. */
  export interface NameValue {
    /** Attribute/property name. */
    name: string;
    /** Attribute/property value. */
    value: string;
  }
  /** Index of the string in the strings table. */
  export type StringIndex = number;
  /** Index of the string in the strings table. */
  export type ArrayOfStrings = StringIndex[];
  /** Data that is only present on rare nodes. */
  export interface RareStringData {
    index: number[];
    value: StringIndex[];
  }
  export interface RareBooleanData {
    index: number[];
  }
  export interface RareIntegerData {
    index: number[];
    value: number[];
  }
  export type Rectangle = number[];
  /** Document snapshot. */
  export interface DocumentSnapshot {
    /** Document URL that `Document` or `FrameOwner` node points to. */
    documentURL: StringIndex;
    /** Base URL that `Document` or `FrameOwner` node uses for URL completion. */
    baseURL: StringIndex;
    /** Contains the document's content language. */
    contentLanguage: StringIndex;
    /** Contains the document's character set encoding. */
    encodingName: StringIndex;
    /** `DocumentType` node's publicId. */
    publicId: StringIndex;
    /** `DocumentType` node's systemId. */
    systemId: StringIndex;
    /** Frame ID for frame owner elements and also for the document node. */
    frameId: StringIndex;
    /** A table with dom nodes. */
    nodes: NodeTreeSnapshot;
    /** The nodes in the layout tree. */
    layout: LayoutTreeSnapshot;
    /** The post-layout inline text nodes. */
    textBoxes: TextBoxSnapshot;
  }
  /** Table containing nodes. */
  export interface NodeTreeSnapshot {
    /** Parent node index. */
    parentIndex?: number[];
    /** `Node`'s nodeType. */
    nodeType?: number[];
    /** `Node`'s nodeName. */
    nodeName?: StringIndex[];
    /** `Node`'s nodeValue. */
    nodeValue?: StringIndex[];
    /** `Node`'s id, corresponds to DOM.Node.backendNodeId. */
    backendNodeId?: DOM.BackendNodeId[];
    /** Attributes of an `Element` node. Flatten name, value pairs. */
    attributes?: ArrayOfStrings[];
    /** Only set for textarea elements, contains the text value. */
    textValue?: RareStringData;
    /** Only set for input elements, contains the input's associated text value. */
    inputValue?: RareStringData;
    /** Only set for radio and checkbox input elements, indicates if the element has been checked */
    inputChecked?: RareBooleanData;
    /** Only set for option elements, indicates if the element has been selected */
    optionSelected?: RareBooleanData;
    /** The index of the document in the list of the snapshot documents. */
    contentDocumentIndex?: RareIntegerData;
    /** Type of a pseudo element node. */
    pseudoType?: RareStringData;
    /** Whether this DOM node responds to mouse clicks. This includes nodes that have had click
event listeners attached via JavaScript as well as anchor tags that naturally navigate when
clicked. */
    isClickable?: RareBooleanData;
    /** The selected url for nodes with a srcset attribute. */
    currentSourceURL?: RareStringData;
    /** The url of the script (if any) that generates this node. */
    originURL?: RareStringData;
  }
  /** Details of an element in the DOM tree with a LayoutObject. */
  export interface LayoutTreeSnapshot {
    /** The index of the related DOM node in the `domNodes` array returned by `getSnapshot`. */
    nodeIndex: number[];
    /** Index into the `computedStyles` array returned by `captureSnapshot`. */
    styles: ArrayOfStrings[];
    /** The absolute position bounding box. */
    bounds: Rectangle[];
    /** Contents of the LayoutText, if any. */
    text: StringIndex[];
  }
  /** Details of post layout rendered text positions. The exact layout should not be regarded as
stable and may change between versions. */
  export interface TextBoxSnapshot {
    /** Intex of th elayout tree node that owns this box collection. */
    layoutIndex: number[];
    /** The absolute position bounding box. */
    bounds: Rectangle[];
    /** The starting index in characters, for this post layout textbox substring. Characters that
would be represented as a surrogate pair in UTF-16 have length 2. */
    start: number[];
    /** The number of characters in this post layout textbox substring. Characters that would be
represented as a surrogate pair in UTF-16 have length 2. */
    length: number[];
  }
  export type GetSnapshotParameters = {
    /** Whitelist of computed styles to return. */
    computedStyleWhitelist: string[];
    /** Whether or not to retrieve details of DOM listeners (default false). */
    includeEventListeners?: boolean;
    /** Whether to determine and include the paint order index of LayoutTreeNodes (default false). */
    includePaintOrder?: boolean;
    /** Whether to include UA shadow tree in the snapshot (default false). */
    includeUserAgentShadowTree?: boolean;
  };
  export type GetSnapshotReturn = {
    /** The nodes in the DOM tree. The DOMNode at index 0 corresponds to the root document. */
    domNodes: DOMNode[];
    /** The nodes in the layout tree. */
    layoutTreeNodes: LayoutTreeNode[];
    /** Whitelisted ComputedStyle properties for each node in the layout tree. */
    computedStyles: ComputedStyle[];
  };
  export type CaptureSnapshotParameters = {
    /** Whitelist of computed styles to return. */
    computedStyles: string[];
  };
  export type CaptureSnapshotReturn = {
    /** The nodes in the DOM tree. The DOMNode at index 0 corresponds to the root document. */
    documents: DocumentSnapshot[];
    /** Shared string table that all string properties refer to with indexes. */
    strings: string[];
  };
}
/** Query and modify DOM storage. */
export class DOMStorage {
  private _domStorageItemAdded: DOMStorage.DomStorageItemAddedHandler | null = null;
  private _domStorageItemRemoved: DOMStorage.DomStorageItemRemovedHandler | null = null;
  private _domStorageItemUpdated: DOMStorage.DomStorageItemUpdatedHandler | null = null;
  private _domStorageItemsCleared: DOMStorage.DomStorageItemsClearedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  public clear(params: DOMStorage.ClearParameters) {
    return this._client.send<void>("DOMStorage.clear", params);
  }
  /** Disables storage tracking, prevents storage events from being sent to the client. */
  public disable() {
    return this._client.send<void>("DOMStorage.disable");
  }
  /** Enables storage tracking, storage events will now be delivered to the client. */
  public enable() {
    return this._client.send<void>("DOMStorage.enable");
  }
  public getDOMStorageItems(params: DOMStorage.GetDOMStorageItemsParameters) {
    return this._client.send<DOMStorage.GetDOMStorageItemsReturn>("DOMStorage.getDOMStorageItems", params);
  }
  public removeDOMStorageItem(params: DOMStorage.RemoveDOMStorageItemParameters) {
    return this._client.send<void>("DOMStorage.removeDOMStorageItem", params);
  }
  public setDOMStorageItem(params: DOMStorage.SetDOMStorageItemParameters) {
    return this._client.send<void>("DOMStorage.setDOMStorageItem", params);
  }
  get domStorageItemAdded() {
    return this._domStorageItemAdded;
  }
  set domStorageItemAdded(handler) {
    if (this._domStorageItemAdded) {
      this._client.removeListener("DOMStorage.domStorageItemAdded", this._domStorageItemAdded);
    }
    this._domStorageItemAdded = handler;
    if (handler) {
      this._client.on("DOMStorage.domStorageItemAdded", handler);
    }
  }
  get domStorageItemRemoved() {
    return this._domStorageItemRemoved;
  }
  set domStorageItemRemoved(handler) {
    if (this._domStorageItemRemoved) {
      this._client.removeListener("DOMStorage.domStorageItemRemoved", this._domStorageItemRemoved);
    }
    this._domStorageItemRemoved = handler;
    if (handler) {
      this._client.on("DOMStorage.domStorageItemRemoved", handler);
    }
  }
  get domStorageItemUpdated() {
    return this._domStorageItemUpdated;
  }
  set domStorageItemUpdated(handler) {
    if (this._domStorageItemUpdated) {
      this._client.removeListener("DOMStorage.domStorageItemUpdated", this._domStorageItemUpdated);
    }
    this._domStorageItemUpdated = handler;
    if (handler) {
      this._client.on("DOMStorage.domStorageItemUpdated", handler);
    }
  }
  get domStorageItemsCleared() {
    return this._domStorageItemsCleared;
  }
  set domStorageItemsCleared(handler) {
    if (this._domStorageItemsCleared) {
      this._client.removeListener("DOMStorage.domStorageItemsCleared", this._domStorageItemsCleared);
    }
    this._domStorageItemsCleared = handler;
    if (handler) {
      this._client.on("DOMStorage.domStorageItemsCleared", handler);
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
  export type DomStorageItemAddedParameters = {
    storageId: StorageId;
    key: string;
    newValue: string;
  };
  export type DomStorageItemAddedHandler = (params: DomStorageItemAddedParameters) => void;
  export type DomStorageItemRemovedParameters = {
    storageId: StorageId;
    key: string;
  };
  export type DomStorageItemRemovedHandler = (params: DomStorageItemRemovedParameters) => void;
  export type DomStorageItemUpdatedParameters = {
    storageId: StorageId;
    key: string;
    oldValue: string;
    newValue: string;
  };
  export type DomStorageItemUpdatedHandler = (params: DomStorageItemUpdatedParameters) => void;
  export type DomStorageItemsClearedParameters = {
    storageId: StorageId;
  };
  export type DomStorageItemsClearedHandler = (params: DomStorageItemsClearedParameters) => void;
  export type ClearParameters = {
    storageId: StorageId;
  };
  export type GetDOMStorageItemsParameters = {
    storageId: StorageId;
  };
  export type GetDOMStorageItemsReturn = {
    entries: Item[];
  };
  export type RemoveDOMStorageItemParameters = {
    storageId: StorageId;
    key: string;
  };
  export type SetDOMStorageItemParameters = {
    storageId: StorageId;
    key: string;
    value: string;
  };
}
export class Database {
  private _addDatabase: Database.AddDatabaseHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Disables database tracking, prevents database events from being sent to the client. */
  public disable() {
    return this._client.send<void>("Database.disable");
  }
  /** Enables database tracking, database events will now be delivered to the client. */
  public enable() {
    return this._client.send<void>("Database.enable");
  }
  public executeSQL(params: Database.ExecuteSQLParameters) {
    return this._client.send<Database.ExecuteSQLReturn>("Database.executeSQL", params);
  }
  public getDatabaseTableNames(params: Database.GetDatabaseTableNamesParameters) {
    return this._client.send<Database.GetDatabaseTableNamesReturn>("Database.getDatabaseTableNames", params);
  }
  get addDatabase() {
    return this._addDatabase;
  }
  set addDatabase(handler) {
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
  export type AddDatabaseParameters = {
    database: Database;
  };
  export type AddDatabaseHandler = (params: AddDatabaseParameters) => void;
  export type ExecuteSQLParameters = {
    databaseId: DatabaseId;
    query: string;
  };
  export type ExecuteSQLReturn = {
    columnNames?: string[];
    values?: any[];
    sqlError?: Error;
  };
  export type GetDatabaseTableNamesParameters = {
    databaseId: DatabaseId;
  };
  export type GetDatabaseTableNamesReturn = {
    tableNames: string[];
  };
}
export class DeviceOrientation {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Clears the overridden Device Orientation. */
  public clearDeviceOrientationOverride() {
    return this._client.send<void>("DeviceOrientation.clearDeviceOrientationOverride");
  }
  /** Overrides the Device Orientation. */
  public setDeviceOrientationOverride(params: DeviceOrientation.SetDeviceOrientationOverrideParameters) {
    return this._client.send<void>("DeviceOrientation.setDeviceOrientationOverride", params);
  }
}
export namespace DeviceOrientation {
  export type SetDeviceOrientationOverrideParameters = {
    /** Mock alpha */
    alpha: number;
    /** Mock beta */
    beta: number;
    /** Mock gamma */
    gamma: number;
  };
}
/** This domain emulates different environments for the page. */
export class Emulation {
  private _virtualTimeAdvanced: Emulation.VirtualTimeAdvancedHandler | null = null;
  private _virtualTimeBudgetExpired: Emulation.VirtualTimeBudgetExpiredHandler | null = null;
  private _virtualTimePaused: Emulation.VirtualTimePausedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Tells whether emulation is supported. */
  public canEmulate() {
    return this._client.send<Emulation.CanEmulateReturn>("Emulation.canEmulate");
  }
  /** Clears the overriden device metrics. */
  public clearDeviceMetricsOverride() {
    return this._client.send<void>("Emulation.clearDeviceMetricsOverride");
  }
  /** Clears the overriden Geolocation Position and Error. */
  public clearGeolocationOverride() {
    return this._client.send<void>("Emulation.clearGeolocationOverride");
  }
  /** Requests that page scale factor is reset to initial values. */
  public resetPageScaleFactor() {
    return this._client.send<void>("Emulation.resetPageScaleFactor");
  }
  /** Enables CPU throttling to emulate slow CPUs. */
  public setCPUThrottlingRate(params: Emulation.SetCPUThrottlingRateParameters) {
    return this._client.send<void>("Emulation.setCPUThrottlingRate", params);
  }
  /** Sets or clears an override of the default background color of the frame. This override is used
if the content does not specify one. */
  public setDefaultBackgroundColorOverride(params: Emulation.SetDefaultBackgroundColorOverrideParameters) {
    return this._client.send<void>("Emulation.setDefaultBackgroundColorOverride", params);
  }
  /** Overrides the values of device screen dimensions (window.screen.width, window.screen.height,
window.innerWidth, window.innerHeight, and "device-width"/"device-height"-related CSS media
query results). */
  public setDeviceMetricsOverride(params: Emulation.SetDeviceMetricsOverrideParameters) {
    return this._client.send<void>("Emulation.setDeviceMetricsOverride", params);
  }
  public setScrollbarsHidden(params: Emulation.SetScrollbarsHiddenParameters) {
    return this._client.send<void>("Emulation.setScrollbarsHidden", params);
  }
  public setDocumentCookieDisabled(params: Emulation.SetDocumentCookieDisabledParameters) {
    return this._client.send<void>("Emulation.setDocumentCookieDisabled", params);
  }
  public setEmitTouchEventsForMouse(params: Emulation.SetEmitTouchEventsForMouseParameters) {
    return this._client.send<void>("Emulation.setEmitTouchEventsForMouse", params);
  }
  /** Emulates the given media for CSS media queries. */
  public setEmulatedMedia(params: Emulation.SetEmulatedMediaParameters) {
    return this._client.send<void>("Emulation.setEmulatedMedia", params);
  }
  /** Overrides the Geolocation Position or Error. Omitting any of the parameters emulates position
unavailable. */
  public setGeolocationOverride(params: Emulation.SetGeolocationOverrideParameters) {
    return this._client.send<void>("Emulation.setGeolocationOverride", params);
  }
  /** Overrides value returned by the javascript navigator object. */
  public setNavigatorOverrides(params: Emulation.SetNavigatorOverridesParameters) {
    return this._client.send<void>("Emulation.setNavigatorOverrides", params);
  }
  /** Sets a specified page scale factor. */
  public setPageScaleFactor(params: Emulation.SetPageScaleFactorParameters) {
    return this._client.send<void>("Emulation.setPageScaleFactor", params);
  }
  /** Switches script execution in the page. */
  public setScriptExecutionDisabled(params: Emulation.SetScriptExecutionDisabledParameters) {
    return this._client.send<void>("Emulation.setScriptExecutionDisabled", params);
  }
  /** Enables touch on platforms which do not support them. */
  public setTouchEmulationEnabled(params: Emulation.SetTouchEmulationEnabledParameters) {
    return this._client.send<void>("Emulation.setTouchEmulationEnabled", params);
  }
  /** Turns on virtual time for all frames (replacing real-time with a synthetic time source) and sets
the current virtual time policy.  Note this supersedes any previous time budget. */
  public setVirtualTimePolicy(params: Emulation.SetVirtualTimePolicyParameters) {
    return this._client.send<Emulation.SetVirtualTimePolicyReturn>("Emulation.setVirtualTimePolicy", params);
  }
  /** Resizes the frame/viewport of the page. Note that this does not affect the frame's container
(e.g. browser window). Can be used to produce screenshots of the specified size. Not supported
on Android. */
  public setVisibleSize(params: Emulation.SetVisibleSizeParameters) {
    return this._client.send<void>("Emulation.setVisibleSize", params);
  }
  /** Allows overriding user agent with the given string. */
  public setUserAgentOverride(params: Emulation.SetUserAgentOverrideParameters) {
    return this._client.send<void>("Emulation.setUserAgentOverride", params);
  }
  /** Notification sent after the virtual time has advanced. */
  get virtualTimeAdvanced() {
    return this._virtualTimeAdvanced;
  }
  set virtualTimeAdvanced(handler) {
    if (this._virtualTimeAdvanced) {
      this._client.removeListener("Emulation.virtualTimeAdvanced", this._virtualTimeAdvanced);
    }
    this._virtualTimeAdvanced = handler;
    if (handler) {
      this._client.on("Emulation.virtualTimeAdvanced", handler);
    }
  }
  /** Notification sent after the virtual time budget for the current VirtualTimePolicy has run out. */
  get virtualTimeBudgetExpired() {
    return this._virtualTimeBudgetExpired;
  }
  set virtualTimeBudgetExpired(handler) {
    if (this._virtualTimeBudgetExpired) {
      this._client.removeListener("Emulation.virtualTimeBudgetExpired", this._virtualTimeBudgetExpired);
    }
    this._virtualTimeBudgetExpired = handler;
    if (handler) {
      this._client.on("Emulation.virtualTimeBudgetExpired", handler);
    }
  }
  /** Notification sent after the virtual time has paused. */
  get virtualTimePaused() {
    return this._virtualTimePaused;
  }
  set virtualTimePaused(handler) {
    if (this._virtualTimePaused) {
      this._client.removeListener("Emulation.virtualTimePaused", this._virtualTimePaused);
    }
    this._virtualTimePaused = handler;
    if (handler) {
      this._client.on("Emulation.virtualTimePaused", handler);
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
  /** advance: If the scheduler runs out of immediate work, the virtual time base may fast forward to
allow the next delayed task (if any) to run; pause: The virtual time base may not advance;
pauseIfNetworkFetchesPending: The virtual time base may not advance if there are any pending
resource fetches. */
  export type VirtualTimePolicy = "advance" | "pause" | "pauseIfNetworkFetchesPending";
  export type VirtualTimeAdvancedParameters = {
    /** The amount of virtual time that has elapsed in milliseconds since virtual time was first
enabled. */
    virtualTimeElapsed: number;
  };
  export type VirtualTimeAdvancedHandler = (params: VirtualTimeAdvancedParameters) => void;
  export type VirtualTimeBudgetExpiredHandler = () => void;
  export type VirtualTimePausedParameters = {
    /** The amount of virtual time that has elapsed in milliseconds since virtual time was first
enabled. */
    virtualTimeElapsed: number;
  };
  export type VirtualTimePausedHandler = (params: VirtualTimePausedParameters) => void;
  export type CanEmulateReturn = {
    /** True if emulation is supported. */
    result: boolean;
  };
  export type SetCPUThrottlingRateParameters = {
    /** Throttling rate as a slowdown factor (1 is no throttle, 2 is 2x slowdown, etc). */
    rate: number;
  };
  export type SetDefaultBackgroundColorOverrideParameters = {
    /** RGBA of the default background color. If not specified, any existing override will be
cleared. */
    color?: DOM.RGBA;
  };
  export type SetDeviceMetricsOverrideParameters = {
    /** Overriding width value in pixels (minimum 0, maximum 10000000). 0 disables the override. */
    width: number;
    /** Overriding height value in pixels (minimum 0, maximum 10000000). 0 disables the override. */
    height: number;
    /** Overriding device scale factor value. 0 disables the override. */
    deviceScaleFactor: number;
    /** Whether to emulate mobile device. This includes viewport meta tag, overlay scrollbars, text
autosizing and more. */
    mobile: boolean;
    /** Scale to apply to resulting view image. */
    scale?: number;
    /** Overriding screen width value in pixels (minimum 0, maximum 10000000). */
    screenWidth?: number;
    /** Overriding screen height value in pixels (minimum 0, maximum 10000000). */
    screenHeight?: number;
    /** Overriding view X position on screen in pixels (minimum 0, maximum 10000000). */
    positionX?: number;
    /** Overriding view Y position on screen in pixels (minimum 0, maximum 10000000). */
    positionY?: number;
    /** Do not set visible view size, rely upon explicit setVisibleSize call. */
    dontSetVisibleSize?: boolean;
    /** Screen orientation override. */
    screenOrientation?: ScreenOrientation;
    /** If set, the visible area of the page will be overridden to this viewport. This viewport
change is not observed by the page, e.g. viewport-relative elements do not change positions. */
    viewport?: Page.Viewport;
  };
  export type SetScrollbarsHiddenParameters = {
    /** Whether scrollbars should be always hidden. */
    hidden: boolean;
  };
  export type SetDocumentCookieDisabledParameters = {
    /** Whether document.coookie API should be disabled. */
    disabled: boolean;
  };
  export type SetEmitTouchEventsForMouseParameters = {
    /** Whether touch emulation based on mouse input should be enabled. */
    enabled: boolean;
    /** Touch/gesture events configuration. Default: current platform. */
    configuration?: "mobile" | "desktop";
  };
  export type SetEmulatedMediaParameters = {
    /** Media type to emulate. Empty string disables the override. */
    media: string;
  };
  export type SetGeolocationOverrideParameters = {
    /** Mock latitude */
    latitude?: number;
    /** Mock longitude */
    longitude?: number;
    /** Mock accuracy */
    accuracy?: number;
  };
  export type SetNavigatorOverridesParameters = {
    /** The platform navigator.platform should return. */
    platform: string;
  };
  export type SetPageScaleFactorParameters = {
    /** Page scale factor. */
    pageScaleFactor: number;
  };
  export type SetScriptExecutionDisabledParameters = {
    /** Whether script execution should be disabled in the page. */
    value: boolean;
  };
  export type SetTouchEmulationEnabledParameters = {
    /** Whether the touch event emulation should be enabled. */
    enabled: boolean;
    /** Maximum touch points supported. Defaults to one. */
    maxTouchPoints?: number;
  };
  export type SetVirtualTimePolicyParameters = {
    policy: VirtualTimePolicy;
    /** If set, after this many virtual milliseconds have elapsed virtual time will be paused and a
virtualTimeBudgetExpired event is sent. */
    budget?: number;
    /** If set this specifies the maximum number of tasks that can be run before virtual is forced
forwards to prevent deadlock. */
    maxVirtualTimeTaskStarvationCount?: number;
    /** If set the virtual time policy change should be deferred until any frame starts navigating.
Note any previous deferred policy change is superseded. */
    waitForNavigation?: boolean;
    /** If set, base::Time::Now will be overriden to initially return this value. */
    initialVirtualTime?: Network.TimeSinceEpoch;
  };
  export type SetVirtualTimePolicyReturn = {
    /** Absolute timestamp at which virtual time was first enabled (up time in milliseconds). */
    virtualTimeTicksBase: number;
  };
  export type SetVisibleSizeParameters = {
    /** Frame width (DIP). */
    width: number;
    /** Frame height (DIP). */
    height: number;
  };
  export type SetUserAgentOverrideParameters = {
    /** User agent to use. */
    userAgent: string;
    /** Browser langugage to emulate. */
    acceptLanguage?: string;
    /** The platform navigator.platform should return. */
    platform?: string;
  };
}
/** This domain provides experimental commands only supported in headless mode. */
export class HeadlessExperimental {
  private _needsBeginFramesChanged: HeadlessExperimental.NeedsBeginFramesChangedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Sends a BeginFrame to the target and returns when the frame was completed. Optionally captures a
screenshot from the resulting frame. Requires that the target was created with enabled
BeginFrameControl. Designed for use with --run-all-compositor-stages-before-draw, see also
https://goo.gl/3zHXhB for more background. */
  public beginFrame(params: HeadlessExperimental.BeginFrameParameters) {
    return this._client.send<HeadlessExperimental.BeginFrameReturn>("HeadlessExperimental.beginFrame", params);
  }
  /** Disables headless events for the target. */
  public disable() {
    return this._client.send<void>("HeadlessExperimental.disable");
  }
  /** Enables headless events for the target. */
  public enable() {
    return this._client.send<void>("HeadlessExperimental.enable");
  }
  /** Issued when the target starts or stops needing BeginFrames. */
  get needsBeginFramesChanged() {
    return this._needsBeginFramesChanged;
  }
  set needsBeginFramesChanged(handler) {
    if (this._needsBeginFramesChanged) {
      this._client.removeListener("HeadlessExperimental.needsBeginFramesChanged", this._needsBeginFramesChanged);
    }
    this._needsBeginFramesChanged = handler;
    if (handler) {
      this._client.on("HeadlessExperimental.needsBeginFramesChanged", handler);
    }
  }
}
export namespace HeadlessExperimental {
  /** Encoding options for a screenshot. */
  export interface ScreenshotParams {
    /** Image compression format (defaults to png). */
    format?: "jpeg" | "png";
    /** Compression quality from range [0..100] (jpeg only). */
    quality?: number;
  }
  export type NeedsBeginFramesChangedParameters = {
    /** True if BeginFrames are needed, false otherwise. */
    needsBeginFrames: boolean;
  };
  export type NeedsBeginFramesChangedHandler = (params: NeedsBeginFramesChangedParameters) => void;
  export type BeginFrameParameters = {
    /** Timestamp of this BeginFrame in Renderer TimeTicks (milliseconds of uptime). If not set,
the current time will be used. */
    frameTimeTicks?: number;
    /** The interval between BeginFrames that is reported to the compositor, in milliseconds.
Defaults to a 60 frames/second interval, i.e. about 16.666 milliseconds. */
    interval?: number;
    /** Whether updates should not be committed and drawn onto the display. False by default. If
true, only side effects of the BeginFrame will be run, such as layout and animations, but
any visual updates may not be visible on the display or in screenshots. */
    noDisplayUpdates?: boolean;
    /** If set, a screenshot of the frame will be captured and returned in the response. Otherwise,
no screenshot will be captured. Note that capturing a screenshot can fail, for example,
during renderer initialization. In such a case, no screenshot data will be returned. */
    screenshot?: ScreenshotParams;
  };
  export type BeginFrameReturn = {
    /** Whether the BeginFrame resulted in damage and, thus, a new frame was committed to the
display. Reported for diagnostic uses, may be removed in the future. */
    hasDamage: boolean;
    /** Base64-encoded image data of the screenshot, if one was requested and successfully taken. */
    screenshotData?: string;
  };
}
/** Input/Output operations for streams produced by DevTools. */
export class IO {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Close the stream, discard any temporary backing storage. */
  public close(params: IO.CloseParameters) {
    return this._client.send<void>("IO.close", params);
  }
  /** Read a chunk of the stream */
  public read(params: IO.ReadParameters) {
    return this._client.send<IO.ReadReturn>("IO.read", params);
  }
  /** Return UUID of Blob object specified by a remote object id. */
  public resolveBlob(params: IO.ResolveBlobParameters) {
    return this._client.send<IO.ResolveBlobReturn>("IO.resolveBlob", params);
  }
}
export namespace IO {
  /** This is either obtained from another method or specifed as `blob:&lt;uuid&gt;` where
`&lt;uuid&gt` is an UUID of a Blob. */
  export type StreamHandle = string;
  export type CloseParameters = {
    /** Handle of the stream to close. */
    handle: StreamHandle;
  };
  export type ReadParameters = {
    /** Handle of the stream to read. */
    handle: StreamHandle;
    /** Seek to the specified offset before reading (if not specificed, proceed with offset
following the last read). Some types of streams may only support sequential reads. */
    offset?: number;
    /** Maximum number of bytes to read (left upon the agent discretion if not specified). */
    size?: number;
  };
  export type ReadReturn = {
    /** Set if the data is base64-encoded */
    base64Encoded?: boolean;
    /** Data that were read. */
    data: string;
    /** Set if the end-of-file condition occured while reading. */
    eof: boolean;
  };
  export type ResolveBlobParameters = {
    /** Object id of a Blob object wrapper. */
    objectId: Runtime.RemoteObjectId;
  };
  export type ResolveBlobReturn = {
    /** UUID of the specified Blob. */
    uuid: string;
  };
}
export class IndexedDB {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Clears all entries from an object store. */
  public clearObjectStore(params: IndexedDB.ClearObjectStoreParameters) {
    return this._client.send<void>("IndexedDB.clearObjectStore", params);
  }
  /** Deletes a database. */
  public deleteDatabase(params: IndexedDB.DeleteDatabaseParameters) {
    return this._client.send<void>("IndexedDB.deleteDatabase", params);
  }
  /** Delete a range of entries from an object store */
  public deleteObjectStoreEntries(params: IndexedDB.DeleteObjectStoreEntriesParameters) {
    return this._client.send<void>("IndexedDB.deleteObjectStoreEntries", params);
  }
  /** Disables events from backend. */
  public disable() {
    return this._client.send<void>("IndexedDB.disable");
  }
  /** Enables events from backend. */
  public enable() {
    return this._client.send<void>("IndexedDB.enable");
  }
  /** Requests data from object store or index. */
  public requestData(params: IndexedDB.RequestDataParameters) {
    return this._client.send<IndexedDB.RequestDataReturn>("IndexedDB.requestData", params);
  }
  /** Requests database with given name in given frame. */
  public requestDatabase(params: IndexedDB.RequestDatabaseParameters) {
    return this._client.send<IndexedDB.RequestDatabaseReturn>("IndexedDB.requestDatabase", params);
  }
  /** Requests database names for given security origin. */
  public requestDatabaseNames(params: IndexedDB.RequestDatabaseNamesParameters) {
    return this._client.send<IndexedDB.RequestDatabaseNamesReturn>("IndexedDB.requestDatabaseNames", params);
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
  export type ClearObjectStoreParameters = {
    /** Security origin. */
    securityOrigin: string;
    /** Database name. */
    databaseName: string;
    /** Object store name. */
    objectStoreName: string;
  };
  export type DeleteDatabaseParameters = {
    /** Security origin. */
    securityOrigin: string;
    /** Database name. */
    databaseName: string;
  };
  export type DeleteObjectStoreEntriesParameters = {
    securityOrigin: string;
    databaseName: string;
    objectStoreName: string;
    /** Range of entry keys to delete */
    keyRange: KeyRange;
  };
  export type RequestDataParameters = {
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
  export type RequestDataReturn = {
    /** Array of object store data entries. */
    objectStoreDataEntries: DataEntry[];
    /** If true, there are more entries to fetch in the given range. */
    hasMore: boolean;
  };
  export type RequestDatabaseParameters = {
    /** Security origin. */
    securityOrigin: string;
    /** Database name. */
    databaseName: string;
  };
  export type RequestDatabaseReturn = {
    /** Database with an array of object stores. */
    databaseWithObjectStores: DatabaseWithObjectStores;
  };
  export type RequestDatabaseNamesParameters = {
    /** Security origin. */
    securityOrigin: string;
  };
  export type RequestDatabaseNamesReturn = {
    /** Database names for origin. */
    databaseNames: string[];
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
  /** This method emulates inserting text that doesn't come from a key press,
for example an emoji keyboard or an IME. */
  public insertText(params: Input.InsertTextParameters) {
    return this._client.send<void>("Input.insertText", params);
  }
  /** Dispatches a mouse event to the page. */
  public dispatchMouseEvent(params: Input.DispatchMouseEventParameters) {
    return this._client.send<void>("Input.dispatchMouseEvent", params);
  }
  /** Dispatches a touch event to the page. */
  public dispatchTouchEvent(params: Input.DispatchTouchEventParameters) {
    return this._client.send<void>("Input.dispatchTouchEvent", params);
  }
  /** Emulates touch event from the mouse event parameters. */
  public emulateTouchFromMouseEvent(params: Input.EmulateTouchFromMouseEventParameters) {
    return this._client.send<void>("Input.emulateTouchFromMouseEvent", params);
  }
  /** Ignores input events (useful while auditing page). */
  public setIgnoreInputEvents(params: Input.SetIgnoreInputEventsParameters) {
    return this._client.send<void>("Input.setIgnoreInputEvents", params);
  }
  /** Synthesizes a pinch gesture over a time period by issuing appropriate touch events. */
  public synthesizePinchGesture(params: Input.SynthesizePinchGestureParameters) {
    return this._client.send<void>("Input.synthesizePinchGesture", params);
  }
  /** Synthesizes a scroll gesture over a time period by issuing appropriate touch events. */
  public synthesizeScrollGesture(params: Input.SynthesizeScrollGestureParameters) {
    return this._client.send<void>("Input.synthesizeScrollGesture", params);
  }
  /** Synthesizes a tap gesture over a time period by issuing appropriate touch events. */
  public synthesizeTapGesture(params: Input.SynthesizeTapGestureParameters) {
    return this._client.send<void>("Input.synthesizeTapGesture", params);
  }
}
export namespace Input {
  export interface TouchPoint {
    /** X coordinate of the event relative to the main frame's viewport in CSS pixels. */
    x: number;
    /** Y coordinate of the event relative to the main frame's viewport in CSS pixels. 0 refers to
the top of the viewport and Y increases as it proceeds towards the bottom of the viewport. */
    y: number;
    /** X radius of the touch area (default: 1.0). */
    radiusX?: number;
    /** Y radius of the touch area (default: 1.0). */
    radiusY?: number;
    /** Rotation angle (default: 0.0). */
    rotationAngle?: number;
    /** Force (default: 1.0). */
    force?: number;
    /** Identifier used to track touch sources between events, must be unique within an event. */
    id?: number;
  }
  export type GestureSourceType = "default" | "touch" | "mouse";
  /** UTC time in seconds, counted from January 1, 1970. */
  export type TimeSinceEpoch = number;
  export type DispatchKeyEventParameters = {
    /** Type of the key event. */
    type: "keyDown" | "keyUp" | "rawKeyDown" | "char";
    /** Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8
(default: 0). */
    modifiers?: number;
    /** Time at which the event occurred. */
    timestamp?: TimeSinceEpoch;
    /** Text as generated by processing a virtual key code with a keyboard layout. Not needed for
for `keyUp` and `rawKeyDown` events (default: "") */
    text?: string;
    /** Text that would have been generated by the keyboard if no modifiers were pressed (except for
shift). Useful for shortcut (accelerator) key handling (default: ""). */
    unmodifiedText?: string;
    /** Unique key identifier (e.g., 'U+0041') (default: ""). */
    keyIdentifier?: string;
    /** Unique DOM defined string value for each physical key (e.g., 'KeyA') (default: ""). */
    code?: string;
    /** Unique DOM defined string value describing the meaning of the key in the context of active
modifiers, keyboard layout, etc (e.g., 'AltGr') (default: ""). */
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
    /** Whether the event was from the left or right side of the keyboard. 1=Left, 2=Right (default:
0). */
    location?: number;
  };
  export type InsertTextParameters = {
    /** The text to insert. */
    text: string;
  };
  export type DispatchMouseEventParameters = {
    /** Type of the mouse event. */
    type: "mousePressed" | "mouseReleased" | "mouseMoved" | "mouseWheel";
    /** X coordinate of the event relative to the main frame's viewport in CSS pixels. */
    x: number;
    /** Y coordinate of the event relative to the main frame's viewport in CSS pixels. 0 refers to
the top of the viewport and Y increases as it proceeds towards the bottom of the viewport. */
    y: number;
    /** Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8
(default: 0). */
    modifiers?: number;
    /** Time at which the event occurred. */
    timestamp?: TimeSinceEpoch;
    /** Mouse button (default: "none"). */
    button?: "none" | "left" | "middle" | "right";
    /** Number of times the mouse button was clicked (default: 0). */
    clickCount?: number;
    /** X delta in CSS pixels for mouse wheel event (default: 0). */
    deltaX?: number;
    /** Y delta in CSS pixels for mouse wheel event (default: 0). */
    deltaY?: number;
  };
  export type DispatchTouchEventParameters = {
    /** Type of the touch event. TouchEnd and TouchCancel must not contain any touch points, while
TouchStart and TouchMove must contains at least one. */
    type: "touchStart" | "touchEnd" | "touchMove" | "touchCancel";
    /** Active touch points on the touch device. One event per any changed point (compared to
previous touch event in a sequence) is generated, emulating pressing/moving/releasing points
one by one. */
    touchPoints: TouchPoint[];
    /** Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8
(default: 0). */
    modifiers?: number;
    /** Time at which the event occurred. */
    timestamp?: TimeSinceEpoch;
  };
  export type EmulateTouchFromMouseEventParameters = {
    /** Type of the mouse event. */
    type: "mousePressed" | "mouseReleased" | "mouseMoved" | "mouseWheel";
    /** X coordinate of the mouse pointer in DIP. */
    x: number;
    /** Y coordinate of the mouse pointer in DIP. */
    y: number;
    /** Mouse button. */
    button: "none" | "left" | "middle" | "right";
    /** Time at which the event occurred (default: current time). */
    timestamp?: TimeSinceEpoch;
    /** X delta in DIP for mouse wheel event (default: 0). */
    deltaX?: number;
    /** Y delta in DIP for mouse wheel event (default: 0). */
    deltaY?: number;
    /** Bit field representing pressed modifier keys. Alt=1, Ctrl=2, Meta/Command=4, Shift=8
(default: 0). */
    modifiers?: number;
    /** Number of times the mouse button was clicked (default: 0). */
    clickCount?: number;
  };
  export type SetIgnoreInputEventsParameters = {
    /** Ignores input events processing when set to true. */
    ignore: boolean;
  };
  export type SynthesizePinchGestureParameters = {
    /** X coordinate of the start of the gesture in CSS pixels. */
    x: number;
    /** Y coordinate of the start of the gesture in CSS pixels. */
    y: number;
    /** Relative scale factor after zooming (>1.0 zooms in, <1.0 zooms out). */
    scaleFactor: number;
    /** Relative pointer speed in pixels per second (default: 800). */
    relativeSpeed?: number;
    /** Which type of input events to be generated (default: 'default', which queries the platform
for the preferred input type). */
    gestureSourceType?: GestureSourceType;
  };
  export type SynthesizeScrollGestureParameters = {
    /** X coordinate of the start of the gesture in CSS pixels. */
    x: number;
    /** Y coordinate of the start of the gesture in CSS pixels. */
    y: number;
    /** The distance to scroll along the X axis (positive to scroll left). */
    xDistance?: number;
    /** The distance to scroll along the Y axis (positive to scroll up). */
    yDistance?: number;
    /** The number of additional pixels to scroll back along the X axis, in addition to the given
distance. */
    xOverscroll?: number;
    /** The number of additional pixels to scroll back along the Y axis, in addition to the given
distance. */
    yOverscroll?: number;
    /** Prevent fling (default: true). */
    preventFling?: boolean;
    /** Swipe speed in pixels per second (default: 800). */
    speed?: number;
    /** Which type of input events to be generated (default: 'default', which queries the platform
for the preferred input type). */
    gestureSourceType?: GestureSourceType;
    /** The number of times to repeat the gesture (default: 0). */
    repeatCount?: number;
    /** The number of milliseconds delay between each repeat. (default: 250). */
    repeatDelayMs?: number;
    /** The name of the interaction markers to generate, if not empty (default: ""). */
    interactionMarkerName?: string;
  };
  export type SynthesizeTapGestureParameters = {
    /** X coordinate of the start of the gesture in CSS pixels. */
    x: number;
    /** Y coordinate of the start of the gesture in CSS pixels. */
    y: number;
    /** Duration between touchdown and touchup events in ms (default: 50). */
    duration?: number;
    /** Number of times to perform the tap (e.g. 2 for double tap, default: 1). */
    tapCount?: number;
    /** Which type of input events to be generated (default: 'default', which queries the platform
for the preferred input type). */
    gestureSourceType?: GestureSourceType;
  };
}
export class Inspector {
  private _detached: Inspector.DetachedHandler | null = null;
  private _targetCrashed: Inspector.TargetCrashedHandler | null = null;
  private _targetReloadedAfterCrash: Inspector.TargetReloadedAfterCrashHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Disables inspector domain notifications. */
  public disable() {
    return this._client.send<void>("Inspector.disable");
  }
  /** Enables inspector domain notifications. */
  public enable() {
    return this._client.send<void>("Inspector.enable");
  }
  /** Fired when remote debugging connection is about to be terminated. Contains detach reason. */
  get detached() {
    return this._detached;
  }
  set detached(handler) {
    if (this._detached) {
      this._client.removeListener("Inspector.detached", this._detached);
    }
    this._detached = handler;
    if (handler) {
      this._client.on("Inspector.detached", handler);
    }
  }
  /** Fired when debugging target has crashed */
  get targetCrashed() {
    return this._targetCrashed;
  }
  set targetCrashed(handler) {
    if (this._targetCrashed) {
      this._client.removeListener("Inspector.targetCrashed", this._targetCrashed);
    }
    this._targetCrashed = handler;
    if (handler) {
      this._client.on("Inspector.targetCrashed", handler);
    }
  }
  /** Fired when debugging target has reloaded after crash */
  get targetReloadedAfterCrash() {
    return this._targetReloadedAfterCrash;
  }
  set targetReloadedAfterCrash(handler) {
    if (this._targetReloadedAfterCrash) {
      this._client.removeListener("Inspector.targetReloadedAfterCrash", this._targetReloadedAfterCrash);
    }
    this._targetReloadedAfterCrash = handler;
    if (handler) {
      this._client.on("Inspector.targetReloadedAfterCrash", handler);
    }
  }
}
export namespace Inspector {
  export type DetachedParameters = {
    /** The reason why connection has been terminated. */
    reason: string;
  };
  export type DetachedHandler = (params: DetachedParameters) => void;
  export type TargetCrashedHandler = () => void;
  export type TargetReloadedAfterCrashHandler = () => void;
}
export class LayerTree {
  private _layerPainted: LayerTree.LayerPaintedHandler | null = null;
  private _layerTreeDidChange: LayerTree.LayerTreeDidChangeHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Provides the reasons why the given layer was composited. */
  public compositingReasons(params: LayerTree.CompositingReasonsParameters) {
    return this._client.send<LayerTree.CompositingReasonsReturn>("LayerTree.compositingReasons", params);
  }
  /** Disables compositing tree inspection. */
  public disable() {
    return this._client.send<void>("LayerTree.disable");
  }
  /** Enables compositing tree inspection. */
  public enable() {
    return this._client.send<void>("LayerTree.enable");
  }
  /** Returns the snapshot identifier. */
  public loadSnapshot(params: LayerTree.LoadSnapshotParameters) {
    return this._client.send<LayerTree.LoadSnapshotReturn>("LayerTree.loadSnapshot", params);
  }
  /** Returns the layer snapshot identifier. */
  public makeSnapshot(params: LayerTree.MakeSnapshotParameters) {
    return this._client.send<LayerTree.MakeSnapshotReturn>("LayerTree.makeSnapshot", params);
  }
  public profileSnapshot(params: LayerTree.ProfileSnapshotParameters) {
    return this._client.send<LayerTree.ProfileSnapshotReturn>("LayerTree.profileSnapshot", params);
  }
  /** Releases layer snapshot captured by the back-end. */
  public releaseSnapshot(params: LayerTree.ReleaseSnapshotParameters) {
    return this._client.send<void>("LayerTree.releaseSnapshot", params);
  }
  /** Replays the layer snapshot and returns the resulting bitmap. */
  public replaySnapshot(params: LayerTree.ReplaySnapshotParameters) {
    return this._client.send<LayerTree.ReplaySnapshotReturn>("LayerTree.replaySnapshot", params);
  }
  /** Replays the layer snapshot and returns canvas log. */
  public snapshotCommandLog(params: LayerTree.SnapshotCommandLogParameters) {
    return this._client.send<LayerTree.SnapshotCommandLogReturn>("LayerTree.snapshotCommandLog", params);
  }
  get layerPainted() {
    return this._layerPainted;
  }
  set layerPainted(handler) {
    if (this._layerPainted) {
      this._client.removeListener("LayerTree.layerPainted", this._layerPainted);
    }
    this._layerPainted = handler;
    if (handler) {
      this._client.on("LayerTree.layerPainted", handler);
    }
  }
  get layerTreeDidChange() {
    return this._layerTreeDidChange;
  }
  set layerTreeDidChange(handler) {
    if (this._layerTreeDidChange) {
      this._client.removeListener("LayerTree.layerTreeDidChange", this._layerTreeDidChange);
    }
    this._layerTreeDidChange = handler;
    if (handler) {
      this._client.on("LayerTree.layerTreeDidChange", handler);
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
  /** Sticky position constraints. */
  export interface StickyPositionConstraint {
    /** Layout rectangle of the sticky element before being shifted */
    stickyBoxRect: DOM.Rect;
    /** Layout rectangle of the containing block of the sticky element */
    containingBlockRect: DOM.Rect;
    /** The nearest sticky layer that shifts the sticky box */
    nearestLayerShiftingStickyBox?: LayerId;
    /** The nearest sticky layer that shifts the containing block */
    nearestLayerShiftingContainingBlock?: LayerId;
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
    /** Indicates whether this layer hosts any content, rather than being used for
transform/scrolling purposes only. */
    drawsContent: boolean;
    /** Set if layer is not visible. */
    invisible?: boolean;
    /** Rectangles scrolling on main thread only. */
    scrollRects?: ScrollRect[];
    /** Sticky position constraint information */
    stickyPositionConstraint?: StickyPositionConstraint;
  }
  /** Array of timings, one per paint step. */
  export type PaintProfile = number[];
  export type LayerPaintedParameters = {
    /** The id of the painted layer. */
    layerId: LayerId;
    /** Clip rectangle. */
    clip: DOM.Rect;
  };
  export type LayerPaintedHandler = (params: LayerPaintedParameters) => void;
  export type LayerTreeDidChangeParameters = {
    /** Layer tree, absent if not in the comspositing mode. */
    layers?: Layer[];
  };
  export type LayerTreeDidChangeHandler = (params: LayerTreeDidChangeParameters) => void;
  export type CompositingReasonsParameters = {
    /** The id of the layer for which we want to get the reasons it was composited. */
    layerId: LayerId;
  };
  export type CompositingReasonsReturn = {
    /** A list of strings specifying reasons for the given layer to become composited. */
    compositingReasons: string[];
  };
  export type LoadSnapshotParameters = {
    /** An array of tiles composing the snapshot. */
    tiles: PictureTile[];
  };
  export type LoadSnapshotReturn = {
    /** The id of the snapshot. */
    snapshotId: SnapshotId;
  };
  export type MakeSnapshotParameters = {
    /** The id of the layer. */
    layerId: LayerId;
  };
  export type MakeSnapshotReturn = {
    /** The id of the layer snapshot. */
    snapshotId: SnapshotId;
  };
  export type ProfileSnapshotParameters = {
    /** The id of the layer snapshot. */
    snapshotId: SnapshotId;
    /** The maximum number of times to replay the snapshot (1, if not specified). */
    minRepeatCount?: number;
    /** The minimum duration (in seconds) to replay the snapshot. */
    minDuration?: number;
    /** The clip rectangle to apply when replaying the snapshot. */
    clipRect?: DOM.Rect;
  };
  export type ProfileSnapshotReturn = {
    /** The array of paint profiles, one per run. */
    timings: PaintProfile[];
  };
  export type ReleaseSnapshotParameters = {
    /** The id of the layer snapshot. */
    snapshotId: SnapshotId;
  };
  export type ReplaySnapshotParameters = {
    /** The id of the layer snapshot. */
    snapshotId: SnapshotId;
    /** The first step to replay from (replay from the very start if not specified). */
    fromStep?: number;
    /** The last step to replay to (replay till the end if not specified). */
    toStep?: number;
    /** The scale to apply while replaying (defaults to 1). */
    scale?: number;
  };
  export type ReplaySnapshotReturn = {
    /** A data: URL for resulting image. */
    dataURL: string;
  };
  export type SnapshotCommandLogParameters = {
    /** The id of the layer snapshot. */
    snapshotId: SnapshotId;
  };
  export type SnapshotCommandLogReturn = {
    /** The array of canvas function calls. */
    commandLog: any[];
  };
}
/** Provides access to log entries. */
export class Log {
  private _entryAdded: Log.EntryAddedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Clears the log. */
  public clear() {
    return this._client.send<void>("Log.clear");
  }
  /** Disables log domain, prevents further log entries from being reported to the client. */
  public disable() {
    return this._client.send<void>("Log.disable");
  }
  /** Enables log domain, sends the entries collected so far to the client by means of the
`entryAdded` notification. */
  public enable() {
    return this._client.send<void>("Log.enable");
  }
  /** start violation reporting. */
  public startViolationsReport(params: Log.StartViolationsReportParameters) {
    return this._client.send<void>("Log.startViolationsReport", params);
  }
  /** Stop violation reporting. */
  public stopViolationsReport() {
    return this._client.send<void>("Log.stopViolationsReport");
  }
  /** Issued when new message was logged. */
  get entryAdded() {
    return this._entryAdded;
  }
  set entryAdded(handler) {
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
    source: "xml" | "javascript" | "network" | "storage" | "appcache" | "rendering" | "security" | "deprecation" | "worker" | "violation" | "intervention" | "recommendation" | "other";
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
    /** Call arguments. */
    args?: Runtime.RemoteObject[];
  }
  /** Violation configuration setting. */
  export interface ViolationSetting {
    /** Violation type. */
    name: "longTask" | "longLayout" | "blockedEvent" | "blockedParser" | "discouragedAPIUse" | "handler" | "recurringHandler";
    /** Time threshold to trigger upon. */
    threshold: number;
  }
  export type EntryAddedParameters = {
    /** The entry. */
    entry: LogEntry;
  };
  export type EntryAddedHandler = (params: EntryAddedParameters) => void;
  export type StartViolationsReportParameters = {
    /** Configuration for violations. */
    config: ViolationSetting[];
  };
}
export class Memory {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  public getDOMCounters() {
    return this._client.send<Memory.GetDOMCountersReturn>("Memory.getDOMCounters");
  }
  public prepareForLeakDetection() {
    return this._client.send<void>("Memory.prepareForLeakDetection");
  }
  /** Enable/disable suppressing memory pressure notifications in all processes. */
  public setPressureNotificationsSuppressed(params: Memory.SetPressureNotificationsSuppressedParameters) {
    return this._client.send<void>("Memory.setPressureNotificationsSuppressed", params);
  }
  /** Simulate a memory pressure notification in all processes. */
  public simulatePressureNotification(params: Memory.SimulatePressureNotificationParameters) {
    return this._client.send<void>("Memory.simulatePressureNotification", params);
  }
  /** Start collecting native memory profile. */
  public startSampling(params: Memory.StartSamplingParameters) {
    return this._client.send<void>("Memory.startSampling", params);
  }
  /** Stop collecting native memory profile. */
  public stopSampling() {
    return this._client.send<void>("Memory.stopSampling");
  }
  /** Retrieve native memory allocations profile
collected since renderer process startup. */
  public getAllTimeSamplingProfile() {
    return this._client.send<Memory.GetAllTimeSamplingProfileReturn>("Memory.getAllTimeSamplingProfile");
  }
  /** Retrieve native memory allocations profile
collected since browser process startup. */
  public getBrowserSamplingProfile() {
    return this._client.send<Memory.GetBrowserSamplingProfileReturn>("Memory.getBrowserSamplingProfile");
  }
  /** Retrieve native memory allocations profile collected since last
`startSampling` call. */
  public getSamplingProfile() {
    return this._client.send<Memory.GetSamplingProfileReturn>("Memory.getSamplingProfile");
  }
}
export namespace Memory {
  /** Memory pressure level. */
  export type PressureLevel = "moderate" | "critical";
  /** Heap profile sample. */
  export interface SamplingProfileNode {
    /** Size of the sampled allocation. */
    size: number;
    /** Total bytes attributed to this sample. */
    total: number;
    /** Execution stack at the point of allocation. */
    stack: string[];
  }
  /** Array of heap profile samples. */
  export interface SamplingProfile {
    samples: SamplingProfileNode[];
    modules: Module[];
  }
  /** Executable module information */
  export interface Module {
    /** Name of the module. */
    name: string;
    /** UUID of the module. */
    uuid: string;
    /** Base address where the module is loaded into memory. Encoded as a decimal
or hexadecimal (0x prefixed) string. */
    baseAddress: string;
    /** Size of the module in bytes. */
    size: number;
  }
  export type GetDOMCountersReturn = {
    documents: number;
    nodes: number;
    jsEventListeners: number;
  };
  export type SetPressureNotificationsSuppressedParameters = {
    /** If true, memory pressure notifications will be suppressed. */
    suppressed: boolean;
  };
  export type SimulatePressureNotificationParameters = {
    /** Memory pressure level of the notification. */
    level: PressureLevel;
  };
  export type StartSamplingParameters = {
    /** Average number of bytes between samples. */
    samplingInterval?: number;
    /** Do not randomize intervals between samples. */
    suppressRandomness?: boolean;
  };
  export type GetAllTimeSamplingProfileReturn = {
    profile: SamplingProfile;
  };
  export type GetBrowserSamplingProfileReturn = {
    profile: SamplingProfile;
  };
  export type GetSamplingProfileReturn = {
    profile: SamplingProfile;
  };
}
/** Network domain allows tracking network activities of the page. It exposes information about http,
file, data and other requests and responses, their headers, bodies, timing, etc. */
export class Network {
  private _dataReceived: Network.DataReceivedHandler | null = null;
  private _eventSourceMessageReceived: Network.EventSourceMessageReceivedHandler | null = null;
  private _loadingFailed: Network.LoadingFailedHandler | null = null;
  private _loadingFinished: Network.LoadingFinishedHandler | null = null;
  private _requestIntercepted: Network.RequestInterceptedHandler | null = null;
  private _requestServedFromCache: Network.RequestServedFromCacheHandler | null = null;
  private _requestWillBeSent: Network.RequestWillBeSentHandler | null = null;
  private _resourceChangedPriority: Network.ResourceChangedPriorityHandler | null = null;
  private _signedExchangeReceived: Network.SignedExchangeReceivedHandler | null = null;
  private _responseReceived: Network.ResponseReceivedHandler | null = null;
  private _webSocketClosed: Network.WebSocketClosedHandler | null = null;
  private _webSocketCreated: Network.WebSocketCreatedHandler | null = null;
  private _webSocketFrameError: Network.WebSocketFrameErrorHandler | null = null;
  private _webSocketFrameReceived: Network.WebSocketFrameReceivedHandler | null = null;
  private _webSocketFrameSent: Network.WebSocketFrameSentHandler | null = null;
  private _webSocketHandshakeResponseReceived: Network.WebSocketHandshakeResponseReceivedHandler | null = null;
  private _webSocketWillSendHandshakeRequest: Network.WebSocketWillSendHandshakeRequestHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Tells whether clearing browser cache is supported. */
  public canClearBrowserCache() {
    return this._client.send<Network.CanClearBrowserCacheReturn>("Network.canClearBrowserCache");
  }
  /** Tells whether clearing browser cookies is supported. */
  public canClearBrowserCookies() {
    return this._client.send<Network.CanClearBrowserCookiesReturn>("Network.canClearBrowserCookies");
  }
  /** Tells whether emulation of network conditions is supported. */
  public canEmulateNetworkConditions() {
    return this._client.send<Network.CanEmulateNetworkConditionsReturn>("Network.canEmulateNetworkConditions");
  }
  /** Clears browser cache. */
  public clearBrowserCache() {
    return this._client.send<void>("Network.clearBrowserCache");
  }
  /** Clears browser cookies. */
  public clearBrowserCookies() {
    return this._client.send<void>("Network.clearBrowserCookies");
  }
  /** Response to Network.requestIntercepted which either modifies the request to continue with any
modifications, or blocks it, or completes it with the provided response bytes. If a network
fetch occurs as a result which encounters a redirect an additional Network.requestIntercepted
event will be sent with the same InterceptionId. */
  public continueInterceptedRequest(params: Network.ContinueInterceptedRequestParameters) {
    return this._client.send<void>("Network.continueInterceptedRequest", params);
  }
  /** Deletes browser cookies with matching name and url or domain/path pair. */
  public deleteCookies(params: Network.DeleteCookiesParameters) {
    return this._client.send<void>("Network.deleteCookies", params);
  }
  /** Disables network tracking, prevents network events from being sent to the client. */
  public disable() {
    return this._client.send<void>("Network.disable");
  }
  /** Activates emulation of network conditions. */
  public emulateNetworkConditions(params: Network.EmulateNetworkConditionsParameters) {
    return this._client.send<void>("Network.emulateNetworkConditions", params);
  }
  /** Enables network tracking, network events will now be delivered to the client. */
  public enable(params: Network.EnableParameters) {
    return this._client.send<void>("Network.enable", params);
  }
  /** Returns all browser cookies. Depending on the backend support, will return detailed cookie
information in the `cookies` field. */
  public getAllCookies() {
    return this._client.send<Network.GetAllCookiesReturn>("Network.getAllCookies");
  }
  /** Returns the DER-encoded certificate. */
  public getCertificate(params: Network.GetCertificateParameters) {
    return this._client.send<Network.GetCertificateReturn>("Network.getCertificate", params);
  }
  /** Returns all browser cookies for the current URL. Depending on the backend support, will return
detailed cookie information in the `cookies` field. */
  public getCookies(params: Network.GetCookiesParameters) {
    return this._client.send<Network.GetCookiesReturn>("Network.getCookies", params);
  }
  /** Returns content served for the given request. */
  public getResponseBody(params: Network.GetResponseBodyParameters) {
    return this._client.send<Network.GetResponseBodyReturn>("Network.getResponseBody", params);
  }
  /** Returns post data sent with the request. Returns an error when no data was sent with the request. */
  public getRequestPostData(params: Network.GetRequestPostDataParameters) {
    return this._client.send<Network.GetRequestPostDataReturn>("Network.getRequestPostData", params);
  }
  /** Returns content served for the given currently intercepted request. */
  public getResponseBodyForInterception(params: Network.GetResponseBodyForInterceptionParameters) {
    return this._client.send<Network.GetResponseBodyForInterceptionReturn>("Network.getResponseBodyForInterception", params);
  }
  /** Returns a handle to the stream representing the response body. Note that after this command,
the intercepted request can't be continued as is -- you either need to cancel it or to provide
the response body. The stream only supports sequential read, IO.read will fail if the position
is specified. */
  public takeResponseBodyForInterceptionAsStream(params: Network.TakeResponseBodyForInterceptionAsStreamParameters) {
    return this._client.send<Network.TakeResponseBodyForInterceptionAsStreamReturn>("Network.takeResponseBodyForInterceptionAsStream", params);
  }
  /** This method sends a new XMLHttpRequest which is identical to the original one. The following
parameters should be identical: method, url, async, request body, extra headers, withCredentials
attribute, user, password. */
  public replayXHR(params: Network.ReplayXHRParameters) {
    return this._client.send<void>("Network.replayXHR", params);
  }
  /** Searches for given string in response content. */
  public searchInResponseBody(params: Network.SearchInResponseBodyParameters) {
    return this._client.send<Network.SearchInResponseBodyReturn>("Network.searchInResponseBody", params);
  }
  /** Blocks URLs from loading. */
  public setBlockedURLs(params: Network.SetBlockedURLsParameters) {
    return this._client.send<void>("Network.setBlockedURLs", params);
  }
  /** Toggles ignoring of service worker for each request. */
  public setBypassServiceWorker(params: Network.SetBypassServiceWorkerParameters) {
    return this._client.send<void>("Network.setBypassServiceWorker", params);
  }
  /** Toggles ignoring cache for each request. If `true`, cache will not be used. */
  public setCacheDisabled(params: Network.SetCacheDisabledParameters) {
    return this._client.send<void>("Network.setCacheDisabled", params);
  }
  /** Sets a cookie with the given cookie data; may overwrite equivalent cookies if they exist. */
  public setCookie(params: Network.SetCookieParameters) {
    return this._client.send<Network.SetCookieReturn>("Network.setCookie", params);
  }
  /** Sets given cookies. */
  public setCookies(params: Network.SetCookiesParameters) {
    return this._client.send<void>("Network.setCookies", params);
  }
  /** For testing. */
  public setDataSizeLimitsForTest(params: Network.SetDataSizeLimitsForTestParameters) {
    return this._client.send<void>("Network.setDataSizeLimitsForTest", params);
  }
  /** Specifies whether to always send extra HTTP headers with the requests from this page. */
  public setExtraHTTPHeaders(params: Network.SetExtraHTTPHeadersParameters) {
    return this._client.send<void>("Network.setExtraHTTPHeaders", params);
  }
  /** Sets the requests to intercept that match a the provided patterns and optionally resource types. */
  public setRequestInterception(params: Network.SetRequestInterceptionParameters) {
    return this._client.send<void>("Network.setRequestInterception", params);
  }
  /** Allows overriding user agent with the given string. */
  public setUserAgentOverride(params: Network.SetUserAgentOverrideParameters) {
    return this._client.send<void>("Network.setUserAgentOverride", params);
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
  /** Fired when EventSource message is received. */
  get eventSourceMessageReceived() {
    return this._eventSourceMessageReceived;
  }
  set eventSourceMessageReceived(handler) {
    if (this._eventSourceMessageReceived) {
      this._client.removeListener("Network.eventSourceMessageReceived", this._eventSourceMessageReceived);
    }
    this._eventSourceMessageReceived = handler;
    if (handler) {
      this._client.on("Network.eventSourceMessageReceived", handler);
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
  /** Details of an intercepted HTTP request, which must be either allowed, blocked, modified or
mocked. */
  get requestIntercepted() {
    return this._requestIntercepted;
  }
  set requestIntercepted(handler) {
    if (this._requestIntercepted) {
      this._client.removeListener("Network.requestIntercepted", this._requestIntercepted);
    }
    this._requestIntercepted = handler;
    if (handler) {
      this._client.on("Network.requestIntercepted", handler);
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
  /** Fired when resource loading priority is changed */
  get resourceChangedPriority() {
    return this._resourceChangedPriority;
  }
  set resourceChangedPriority(handler) {
    if (this._resourceChangedPriority) {
      this._client.removeListener("Network.resourceChangedPriority", this._resourceChangedPriority);
    }
    this._resourceChangedPriority = handler;
    if (handler) {
      this._client.on("Network.resourceChangedPriority", handler);
    }
  }
  /** Fired when a signed exchange was received over the network */
  get signedExchangeReceived() {
    return this._signedExchangeReceived;
  }
  set signedExchangeReceived(handler) {
    if (this._signedExchangeReceived) {
      this._client.removeListener("Network.signedExchangeReceived", this._signedExchangeReceived);
    }
    this._signedExchangeReceived = handler;
    if (handler) {
      this._client.on("Network.signedExchangeReceived", handler);
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
  /** Fired when WebSocket is closed. */
  get webSocketClosed() {
    return this._webSocketClosed;
  }
  set webSocketClosed(handler) {
    if (this._webSocketClosed) {
      this._client.removeListener("Network.webSocketClosed", this._webSocketClosed);
    }
    this._webSocketClosed = handler;
    if (handler) {
      this._client.on("Network.webSocketClosed", handler);
    }
  }
  /** Fired upon WebSocket creation. */
  get webSocketCreated() {
    return this._webSocketCreated;
  }
  set webSocketCreated(handler) {
    if (this._webSocketCreated) {
      this._client.removeListener("Network.webSocketCreated", this._webSocketCreated);
    }
    this._webSocketCreated = handler;
    if (handler) {
      this._client.on("Network.webSocketCreated", handler);
    }
  }
  /** Fired when WebSocket frame error occurs. */
  get webSocketFrameError() {
    return this._webSocketFrameError;
  }
  set webSocketFrameError(handler) {
    if (this._webSocketFrameError) {
      this._client.removeListener("Network.webSocketFrameError", this._webSocketFrameError);
    }
    this._webSocketFrameError = handler;
    if (handler) {
      this._client.on("Network.webSocketFrameError", handler);
    }
  }
  /** Fired when WebSocket frame is received. */
  get webSocketFrameReceived() {
    return this._webSocketFrameReceived;
  }
  set webSocketFrameReceived(handler) {
    if (this._webSocketFrameReceived) {
      this._client.removeListener("Network.webSocketFrameReceived", this._webSocketFrameReceived);
    }
    this._webSocketFrameReceived = handler;
    if (handler) {
      this._client.on("Network.webSocketFrameReceived", handler);
    }
  }
  /** Fired when WebSocket frame is sent. */
  get webSocketFrameSent() {
    return this._webSocketFrameSent;
  }
  set webSocketFrameSent(handler) {
    if (this._webSocketFrameSent) {
      this._client.removeListener("Network.webSocketFrameSent", this._webSocketFrameSent);
    }
    this._webSocketFrameSent = handler;
    if (handler) {
      this._client.on("Network.webSocketFrameSent", handler);
    }
  }
  /** Fired when WebSocket handshake response becomes available. */
  get webSocketHandshakeResponseReceived() {
    return this._webSocketHandshakeResponseReceived;
  }
  set webSocketHandshakeResponseReceived(handler) {
    if (this._webSocketHandshakeResponseReceived) {
      this._client.removeListener("Network.webSocketHandshakeResponseReceived", this._webSocketHandshakeResponseReceived);
    }
    this._webSocketHandshakeResponseReceived = handler;
    if (handler) {
      this._client.on("Network.webSocketHandshakeResponseReceived", handler);
    }
  }
  /** Fired when WebSocket is about to initiate handshake. */
  get webSocketWillSendHandshakeRequest() {
    return this._webSocketWillSendHandshakeRequest;
  }
  set webSocketWillSendHandshakeRequest(handler) {
    if (this._webSocketWillSendHandshakeRequest) {
      this._client.removeListener("Network.webSocketWillSendHandshakeRequest", this._webSocketWillSendHandshakeRequest);
    }
    this._webSocketWillSendHandshakeRequest = handler;
    if (handler) {
      this._client.on("Network.webSocketWillSendHandshakeRequest", handler);
    }
  }
}
export namespace Network {
  /** Unique loader identifier. */
  export type LoaderId = string;
  /** Unique request identifier. */
  export type RequestId = string;
  /** Unique intercepted request identifier. */
  export type InterceptionId = string;
  /** Network level fetch failure reason. */
  export type ErrorReason = "Failed" | "Aborted" | "TimedOut" | "AccessDenied" | "ConnectionClosed" | "ConnectionReset" | "ConnectionRefused" | "ConnectionAborted" | "ConnectionFailed" | "NameNotResolved" | "InternetDisconnected" | "AddressUnreachable" | "BlockedByClient" | "BlockedByResponse";
  /** UTC time in seconds, counted from January 1, 1970. */
  export type TimeSinceEpoch = number;
  /** Monotonically increasing time in seconds since an arbitrary point in the past. */
  export type MonotonicTime = number;
  /** Request / response headers as keys / values of JSON object. */
  export type Headers = any;
  /** The underlying connection technology that the browser is supposedly using. */
  export type ConnectionType = "none" | "cellular2g" | "cellular3g" | "cellular4g" | "bluetooth" | "ethernet" | "wifi" | "wimax" | "other";
  /** Represents the cookie's 'SameSite' status:
https://tools.ietf.org/html/draft-west-first-party-cookies */
  export type CookieSameSite = "Strict" | "Lax";
  /** Timing information for the request. */
  export interface ResourceTiming {
    /** Timing's requestTime is a baseline in seconds, while the other numbers are ticks in
milliseconds relatively to this requestTime. */
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
    /** Request URL (without fragment). */
    url: string;
    /** Fragment of the requested URL starting with hash, if present. */
    urlFragment?: string;
    /** HTTP request method. */
    method: string;
    /** HTTP request headers. */
    headers: Headers;
    /** HTTP POST request data. */
    postData?: string;
    /** True when the request has POST data. Note that postData might still be omitted when this flag is true when the data is too long. */
    hasPostData?: boolean;
    /** The mixed content type of the request. */
    mixedContentType?: Security.MixedContentType;
    /** Priority of the resource request at the time request is sent. */
    initialPriority: ResourcePriority;
    /** The referrer policy of the request, as defined in https://www.w3.org/TR/referrer-policy/ */
    referrerPolicy: "unsafe-url" | "no-referrer-when-downgrade" | "no-referrer" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin";
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
    timestamp: TimeSinceEpoch;
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
    validFrom: TimeSinceEpoch;
    /** Certificate valid to (expiration) date */
    validTo: TimeSinceEpoch;
    /** List of signed certificate timestamps (SCTs). */
    signedCertificateTimestampList: SignedCertificateTimestamp[];
    /** Whether the request complied with Certificate Transparency policy */
    certificateTransparencyCompliance: CertificateTransparencyCompliance;
  }
  /** Whether the request complied with Certificate Transparency policy. */
  export type CertificateTransparencyCompliance = "unknown" | "not-compliant" | "compliant";
  /** The reason why request was blocked. */
  export type BlockedReason = "other" | "csp" | "mixed-content" | "origin" | "inspector" | "subresource-filter" | "content-type" | "collapsed-by-client";
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
    type: "parser" | "script" | "preload" | "SignedExchange" | "other";
    /** Initiator JavaScript stack trace, set for Script only. */
    stack?: Runtime.StackTrace;
    /** Initiator URL, set for Parser type or for Script type (when script is importing module) or for SignedExchange type. */
    url?: string;
    /** Initiator line number, set for Parser type or for Script type (when script is importing
module) (0-based). */
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
  /** Cookie parameter object */
  export interface CookieParam {
    /** Cookie name. */
    name: string;
    /** Cookie value. */
    value: string;
    /** The request-URI to associate with the setting of the cookie. This value can affect the
default domain and path values of the created cookie. */
    url?: string;
    /** Cookie domain. */
    domain?: string;
    /** Cookie path. */
    path?: string;
    /** True if cookie is secure. */
    secure?: boolean;
    /** True if cookie is http-only. */
    httpOnly?: boolean;
    /** Cookie SameSite type. */
    sameSite?: CookieSameSite;
    /** Cookie expiration date, session cookie if not set */
    expires?: TimeSinceEpoch;
  }
  /** Authorization challenge for HTTP status code 401 or 407. */
  export interface AuthChallenge {
    /** Source of the authentication challenge. */
    source?: "Server" | "Proxy";
    /** Origin of the challenger. */
    origin: string;
    /** The authentication scheme used, such as basic or digest */
    scheme: string;
    /** The realm of the challenge. May be empty. */
    realm: string;
  }
  /** Response to an AuthChallenge. */
  export interface AuthChallengeResponse {
    /** The decision on what to do in response to the authorization challenge.  Default means
deferring to the default behavior of the net stack, which will likely either the Cancel
authentication or display a popup dialog box. */
    response: "Default" | "CancelAuth" | "ProvideCredentials";
    /** The username to provide, possibly empty. Should only be set if response is
ProvideCredentials. */
    username?: string;
    /** The password to provide, possibly empty. Should only be set if response is
ProvideCredentials. */
    password?: string;
  }
  /** Stages of the interception to begin intercepting. Request will intercept before the request is
sent. Response will intercept after the response is received. */
  export type InterceptionStage = "Request" | "HeadersReceived";
  /** Request pattern for interception. */
  export interface RequestPattern {
    /** Wildcards ('*' -> zero or more, '?' -> exactly one) are allowed. Escape character is
backslash. Omitting is equivalent to "*". */
    urlPattern?: string;
    /** If set, only requests for matching resource types will be intercepted. */
    resourceType?: Page.ResourceType;
    /** Stage at wich to begin intercepting requests. Default is Request. */
    interceptionStage?: InterceptionStage;
  }
  /** Information about a signed exchange signature.
https://wicg.github.io/webpackage/draft-yasskin-httpbis-origin-signed-exchanges-impl.html#rfc.section.3.1 */
  export interface SignedExchangeSignature {
    /** Signed exchange signature label. */
    label: string;
    /** The hex string of signed exchange signature. */
    signature: string;
    /** Signed exchange signature integrity. */
    integrity: string;
    /** Signed exchange signature cert Url. */
    certUrl?: string;
    /** The hex string of signed exchange signature cert sha256. */
    certSha256?: string;
    /** Signed exchange signature validity Url. */
    validityUrl: string;
    /** Signed exchange signature date. */
    date: number;
    /** Signed exchange signature expires. */
    expires: number;
    /** The encoded certificates. */
    certificates?: string[];
  }
  /** Information about a signed exchange header.
https://wicg.github.io/webpackage/draft-yasskin-httpbis-origin-signed-exchanges-impl.html#cbor-representation */
  export interface SignedExchangeHeader {
    /** Signed exchange request URL. */
    requestUrl: string;
    /** Signed exchange request method. */
    requestMethod: string;
    /** Signed exchange response code. */
    responseCode: number;
    /** Signed exchange response headers. */
    responseHeaders: Headers;
    /** Signed exchange response signature. */
    signatures: SignedExchangeSignature[];
  }
  /** Field type for a signed exchange related error. */
  export type SignedExchangeErrorField = "signatureSig" | "signatureIntegrity" | "signatureCertUrl" | "signatureCertSha256" | "signatureValidityUrl" | "signatureTimestamps";
  /** Information about a signed exchange response. */
  export interface SignedExchangeError {
    /** Error message. */
    message: string;
    /** The index of the signature which caused the error. */
    signatureIndex?: number;
    /** The field which caused the error. */
    errorField?: SignedExchangeErrorField;
  }
  /** Information about a signed exchange response. */
  export interface SignedExchangeInfo {
    /** The outer response of signed HTTP exchange which was received from network. */
    outerResponse: Response;
    /** Information about the signed exchange header. */
    header?: SignedExchangeHeader;
    /** Security details for the signed exchange header. */
    securityDetails?: SecurityDetails;
    /** Errors occurred while handling the signed exchagne. */
    errors?: SignedExchangeError[];
  }
  export type DataReceivedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** Data chunk length. */
    dataLength: number;
    /** Actual bytes received (might be less than dataLength for compressed encodings). */
    encodedDataLength: number;
  };
  export type DataReceivedHandler = (params: DataReceivedParameters) => void;
  export type EventSourceMessageReceivedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** Message type. */
    eventName: string;
    /** Message identifier. */
    eventId: string;
    /** Message content. */
    data: string;
  };
  export type EventSourceMessageReceivedHandler = (params: EventSourceMessageReceivedParameters) => void;
  export type LoadingFailedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
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
  export type LoadingFinishedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** Total number of bytes received for this request. */
    encodedDataLength: number;
    /** Set when 1) response was blocked by Cross-Origin Read Blocking and also
2) this needs to be reported to the DevTools console. */
    shouldReportCorbBlocking?: boolean;
  };
  export type LoadingFinishedHandler = (params: LoadingFinishedParameters) => void;
  export type RequestInterceptedParameters = {
    /** Each request the page makes will have a unique id, however if any redirects are encountered
while processing that fetch, they will be reported with the same id as the original fetch.
Likewise if HTTP authentication is needed then the same fetch id will be used. */
    interceptionId: InterceptionId;
    request: Request;
    /** The id of the frame that initiated the request. */
    frameId: Page.FrameId;
    /** How the requested resource will be used. */
    resourceType: Page.ResourceType;
    /** Whether this is a navigation request, which can abort the navigation completely. */
    isNavigationRequest: boolean;
    /** Set if the request is a navigation that will result in a download.
Only present after response is received from the server (i.e. HeadersReceived stage). */
    isDownload?: boolean;
    /** Redirect location, only sent if a redirect was intercepted. */
    redirectUrl?: string;
    /** Details of the Authorization Challenge encountered. If this is set then
continueInterceptedRequest must contain an authChallengeResponse. */
    authChallenge?: AuthChallenge;
    /** Response error if intercepted at response stage or if redirect occurred while intercepting
request. */
    responseErrorReason?: ErrorReason;
    /** Response code if intercepted at response stage or if redirect occurred while intercepting
request or auth retry occurred. */
    responseStatusCode?: number;
    /** Response headers if intercepted at the response stage or if redirect occurred while
intercepting request or auth retry occurred. */
    responseHeaders?: Headers;
  };
  export type RequestInterceptedHandler = (params: RequestInterceptedParameters) => void;
  export type RequestServedFromCacheParameters = {
    /** Request identifier. */
    requestId: RequestId;
  };
  export type RequestServedFromCacheHandler = (params: RequestServedFromCacheParameters) => void;
  export type RequestWillBeSentParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Loader identifier. Empty string if the request is fetched from worker. */
    loaderId: LoaderId;
    /** URL of the document this request is loaded for. */
    documentURL: string;
    /** Request data. */
    request: Request;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** Timestamp. */
    wallTime: TimeSinceEpoch;
    /** Request initiator. */
    initiator: Initiator;
    /** Redirect response data. */
    redirectResponse?: Response;
    /** Type of this resource. */
    type?: Page.ResourceType;
    /** Frame identifier. */
    frameId?: Page.FrameId;
    /** Whether the request is initiated by a user gesture. Defaults to false. */
    hasUserGesture?: boolean;
  };
  export type RequestWillBeSentHandler = (params: RequestWillBeSentParameters) => void;
  export type ResourceChangedPriorityParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** New priority */
    newPriority: ResourcePriority;
    /** Timestamp. */
    timestamp: MonotonicTime;
  };
  export type ResourceChangedPriorityHandler = (params: ResourceChangedPriorityParameters) => void;
  export type SignedExchangeReceivedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Information about the signed exchange response. */
    info: SignedExchangeInfo;
  };
  export type SignedExchangeReceivedHandler = (params: SignedExchangeReceivedParameters) => void;
  export type ResponseReceivedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Loader identifier. Empty string if the request is fetched from worker. */
    loaderId: LoaderId;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** Resource type. */
    type: Page.ResourceType;
    /** Response data. */
    response: Response;
    /** Frame identifier. */
    frameId?: Page.FrameId;
  };
  export type ResponseReceivedHandler = (params: ResponseReceivedParameters) => void;
  export type WebSocketClosedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
  };
  export type WebSocketClosedHandler = (params: WebSocketClosedParameters) => void;
  export type WebSocketCreatedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** WebSocket request URL. */
    url: string;
    /** Request initiator. */
    initiator?: Initiator;
  };
  export type WebSocketCreatedHandler = (params: WebSocketCreatedParameters) => void;
  export type WebSocketFrameErrorParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** WebSocket frame error message. */
    errorMessage: string;
  };
  export type WebSocketFrameErrorHandler = (params: WebSocketFrameErrorParameters) => void;
  export type WebSocketFrameReceivedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** WebSocket response data. */
    response: WebSocketFrame;
  };
  export type WebSocketFrameReceivedHandler = (params: WebSocketFrameReceivedParameters) => void;
  export type WebSocketFrameSentParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** WebSocket response data. */
    response: WebSocketFrame;
  };
  export type WebSocketFrameSentHandler = (params: WebSocketFrameSentParameters) => void;
  export type WebSocketHandshakeResponseReceivedParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** WebSocket response data. */
    response: WebSocketResponse;
  };
  export type WebSocketHandshakeResponseReceivedHandler = (params: WebSocketHandshakeResponseReceivedParameters) => void;
  export type WebSocketWillSendHandshakeRequestParameters = {
    /** Request identifier. */
    requestId: RequestId;
    /** Timestamp. */
    timestamp: MonotonicTime;
    /** UTC Timestamp. */
    wallTime: TimeSinceEpoch;
    /** WebSocket request data. */
    request: WebSocketRequest;
  };
  export type WebSocketWillSendHandshakeRequestHandler = (params: WebSocketWillSendHandshakeRequestParameters) => void;
  export type CanClearBrowserCacheReturn = {
    /** True if browser cache can be cleared. */
    result: boolean;
  };
  export type CanClearBrowserCookiesReturn = {
    /** True if browser cookies can be cleared. */
    result: boolean;
  };
  export type CanEmulateNetworkConditionsReturn = {
    /** True if emulation of network conditions is supported. */
    result: boolean;
  };
  export type ContinueInterceptedRequestParameters = {
    interceptionId: InterceptionId;
    /** If set this causes the request to fail with the given reason. Passing `Aborted` for requests
marked with `isNavigationRequest` also cancels the navigation. Must not be set in response
to an authChallenge. */
    errorReason?: ErrorReason;
    /** If set the requests completes using with the provided base64 encoded raw response, including
HTTP status line and headers etc... Must not be set in response to an authChallenge. */
    rawResponse?: string;
    /** If set the request url will be modified in a way that's not observable by page. Must not be
set in response to an authChallenge. */
    url?: string;
    /** If set this allows the request method to be overridden. Must not be set in response to an
authChallenge. */
    method?: string;
    /** If set this allows postData to be set. Must not be set in response to an authChallenge. */
    postData?: string;
    /** If set this allows the request headers to be changed. Must not be set in response to an
authChallenge. */
    headers?: Headers;
    /** Response to a requestIntercepted with an authChallenge. Must not be set otherwise. */
    authChallengeResponse?: AuthChallengeResponse;
  };
  export type DeleteCookiesParameters = {
    /** Name of the cookies to remove. */
    name: string;
    /** If specified, deletes all the cookies with the given name where domain and path match
provided URL. */
    url?: string;
    /** If specified, deletes only cookies with the exact domain. */
    domain?: string;
    /** If specified, deletes only cookies with the exact path. */
    path?: string;
  };
  export type EmulateNetworkConditionsParameters = {
    /** True to emulate internet disconnection. */
    offline: boolean;
    /** Minimum latency from request sent to response headers received (ms). */
    latency: number;
    /** Maximal aggregated download throughput (bytes/sec). -1 disables download throttling. */
    downloadThroughput: number;
    /** Maximal aggregated upload throughput (bytes/sec).  -1 disables upload throttling. */
    uploadThroughput: number;
    /** Connection type if known. */
    connectionType?: ConnectionType;
  };
  export type EnableParameters = {
    /** Buffer size in bytes to use when preserving network payloads (XHRs, etc). */
    maxTotalBufferSize?: number;
    /** Per-resource buffer size in bytes to use when preserving network payloads (XHRs, etc). */
    maxResourceBufferSize?: number;
    /** Longest post body size (in bytes) that would be included in requestWillBeSent notification */
    maxPostDataSize?: number;
  };
  export type GetAllCookiesReturn = {
    /** Array of cookie objects. */
    cookies: Cookie[];
  };
  export type GetCertificateParameters = {
    /** Origin to get certificate for. */
    origin: string;
  };
  export type GetCertificateReturn = {
    tableNames: string[];
  };
  export type GetCookiesParameters = {
    /** The list of URLs for which applicable cookies will be fetched */
    urls?: string[];
  };
  export type GetCookiesReturn = {
    /** Array of cookie objects. */
    cookies: Cookie[];
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
  export type GetRequestPostDataParameters = {
    /** Identifier of the network request to get content for. */
    requestId: RequestId;
  };
  export type GetRequestPostDataReturn = {
    /** Base64-encoded request body. */
    postData: string;
  };
  export type GetResponseBodyForInterceptionParameters = {
    /** Identifier for the intercepted request to get body for. */
    interceptionId: InterceptionId;
  };
  export type GetResponseBodyForInterceptionReturn = {
    /** Response body. */
    body: string;
    /** True, if content was sent as base64. */
    base64Encoded: boolean;
  };
  export type TakeResponseBodyForInterceptionAsStreamParameters = {
    interceptionId: InterceptionId;
  };
  export type TakeResponseBodyForInterceptionAsStreamReturn = {
    stream: IO.StreamHandle;
  };
  export type ReplayXHRParameters = {
    /** Identifier of XHR to replay. */
    requestId: RequestId;
  };
  export type SearchInResponseBodyParameters = {
    /** Identifier of the network response to search. */
    requestId: RequestId;
    /** String to search for. */
    query: string;
    /** If true, search is case sensitive. */
    caseSensitive?: boolean;
    /** If true, treats string parameter as regex. */
    isRegex?: boolean;
  };
  export type SearchInResponseBodyReturn = {
    /** List of search matches. */
    result: Debugger.SearchMatch[];
  };
  export type SetBlockedURLsParameters = {
    /** URL patterns to block. Wildcards ('*') are allowed. */
    urls: string[];
  };
  export type SetBypassServiceWorkerParameters = {
    /** Bypass service worker and load from network. */
    bypass: boolean;
  };
  export type SetCacheDisabledParameters = {
    /** Cache disabled state. */
    cacheDisabled: boolean;
  };
  export type SetCookieParameters = {
    /** Cookie name. */
    name: string;
    /** Cookie value. */
    value: string;
    /** The request-URI to associate with the setting of the cookie. This value can affect the
default domain and path values of the created cookie. */
    url?: string;
    /** Cookie domain. */
    domain?: string;
    /** Cookie path. */
    path?: string;
    /** True if cookie is secure. */
    secure?: boolean;
    /** True if cookie is http-only. */
    httpOnly?: boolean;
    /** Cookie SameSite type. */
    sameSite?: CookieSameSite;
    /** Cookie expiration date, session cookie if not set */
    expires?: TimeSinceEpoch;
  };
  export type SetCookieReturn = {
    /** True if successfully set cookie. */
    success: boolean;
  };
  export type SetCookiesParameters = {
    /** Cookies to be set. */
    cookies: CookieParam[];
  };
  export type SetDataSizeLimitsForTestParameters = {
    /** Maximum total buffer size. */
    maxTotalSize: number;
    /** Maximum per-resource size. */
    maxResourceSize: number;
  };
  export type SetExtraHTTPHeadersParameters = {
    /** Map with extra HTTP headers. */
    headers: Headers;
  };
  export type SetRequestInterceptionParameters = {
    /** Requests matching any of these patterns will be forwarded and wait for the corresponding
continueInterceptedRequest call. */
    patterns: RequestPattern[];
  };
  export type SetUserAgentOverrideParameters = {
    /** User agent to use. */
    userAgent: string;
    /** Browser langugage to emulate. */
    acceptLanguage?: string;
    /** The platform navigator.platform should return. */
    platform?: string;
  };
}
/** This domain provides various functionality related to drawing atop the inspected page. */
export class Overlay {
  private _inspectNodeRequested: Overlay.InspectNodeRequestedHandler | null = null;
  private _nodeHighlightRequested: Overlay.NodeHighlightRequestedHandler | null = null;
  private _screenshotRequested: Overlay.ScreenshotRequestedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Disables domain notifications. */
  public disable() {
    return this._client.send<void>("Overlay.disable");
  }
  /** Enables domain notifications. */
  public enable() {
    return this._client.send<void>("Overlay.enable");
  }
  /** For testing. */
  public getHighlightObjectForTest(params: Overlay.GetHighlightObjectForTestParameters) {
    return this._client.send<Overlay.GetHighlightObjectForTestReturn>("Overlay.getHighlightObjectForTest", params);
  }
  /** Hides any highlight. */
  public hideHighlight() {
    return this._client.send<void>("Overlay.hideHighlight");
  }
  /** Highlights owner element of the frame with given id. */
  public highlightFrame(params: Overlay.HighlightFrameParameters) {
    return this._client.send<void>("Overlay.highlightFrame", params);
  }
  /** Highlights DOM node with given id or with the given JavaScript object wrapper. Either nodeId or
objectId must be specified. */
  public highlightNode(params: Overlay.HighlightNodeParameters) {
    return this._client.send<void>("Overlay.highlightNode", params);
  }
  /** Highlights given quad. Coordinates are absolute with respect to the main frame viewport. */
  public highlightQuad(params: Overlay.HighlightQuadParameters) {
    return this._client.send<void>("Overlay.highlightQuad", params);
  }
  /** Highlights given rectangle. Coordinates are absolute with respect to the main frame viewport. */
  public highlightRect(params: Overlay.HighlightRectParameters) {
    return this._client.send<void>("Overlay.highlightRect", params);
  }
  /** Enters the 'inspect' mode. In this mode, elements that user is hovering over are highlighted.
Backend then generates 'inspectNodeRequested' event upon element selection. */
  public setInspectMode(params: Overlay.SetInspectModeParameters) {
    return this._client.send<void>("Overlay.setInspectMode", params);
  }
  public setPausedInDebuggerMessage(params: Overlay.SetPausedInDebuggerMessageParameters) {
    return this._client.send<void>("Overlay.setPausedInDebuggerMessage", params);
  }
  /** Requests that backend shows debug borders on layers */
  public setShowDebugBorders(params: Overlay.SetShowDebugBordersParameters) {
    return this._client.send<void>("Overlay.setShowDebugBorders", params);
  }
  /** Requests that backend shows the FPS counter */
  public setShowFPSCounter(params: Overlay.SetShowFPSCounterParameters) {
    return this._client.send<void>("Overlay.setShowFPSCounter", params);
  }
  /** Requests that backend shows paint rectangles */
  public setShowPaintRects(params: Overlay.SetShowPaintRectsParameters) {
    return this._client.send<void>("Overlay.setShowPaintRects", params);
  }
  /** Requests that backend shows scroll bottleneck rects */
  public setShowScrollBottleneckRects(params: Overlay.SetShowScrollBottleneckRectsParameters) {
    return this._client.send<void>("Overlay.setShowScrollBottleneckRects", params);
  }
  /** Paints viewport size upon main frame resize. */
  public setShowViewportSizeOnResize(params: Overlay.SetShowViewportSizeOnResizeParameters) {
    return this._client.send<void>("Overlay.setShowViewportSizeOnResize", params);
  }
  public setSuspended(params: Overlay.SetSuspendedParameters) {
    return this._client.send<void>("Overlay.setSuspended", params);
  }
  /** Fired when the node should be inspected. This happens after call to `setInspectMode` or when
user manually inspects an element. */
  get inspectNodeRequested() {
    return this._inspectNodeRequested;
  }
  set inspectNodeRequested(handler) {
    if (this._inspectNodeRequested) {
      this._client.removeListener("Overlay.inspectNodeRequested", this._inspectNodeRequested);
    }
    this._inspectNodeRequested = handler;
    if (handler) {
      this._client.on("Overlay.inspectNodeRequested", handler);
    }
  }
  /** Fired when the node should be highlighted. This happens after call to `setInspectMode`. */
  get nodeHighlightRequested() {
    return this._nodeHighlightRequested;
  }
  set nodeHighlightRequested(handler) {
    if (this._nodeHighlightRequested) {
      this._client.removeListener("Overlay.nodeHighlightRequested", this._nodeHighlightRequested);
    }
    this._nodeHighlightRequested = handler;
    if (handler) {
      this._client.on("Overlay.nodeHighlightRequested", handler);
    }
  }
  /** Fired when user asks to capture screenshot of some area on the page. */
  get screenshotRequested() {
    return this._screenshotRequested;
  }
  set screenshotRequested(handler) {
    if (this._screenshotRequested) {
      this._client.removeListener("Overlay.screenshotRequested", this._screenshotRequested);
    }
    this._screenshotRequested = handler;
    if (handler) {
      this._client.on("Overlay.screenshotRequested", handler);
    }
  }
}
export namespace Overlay {
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
    contentColor?: DOM.RGBA;
    /** The padding highlight fill color (default: transparent). */
    paddingColor?: DOM.RGBA;
    /** The border highlight fill color (default: transparent). */
    borderColor?: DOM.RGBA;
    /** The margin highlight fill color (default: transparent). */
    marginColor?: DOM.RGBA;
    /** The event target element highlight fill color (default: transparent). */
    eventTargetColor?: DOM.RGBA;
    /** The shape outside fill color (default: transparent). */
    shapeColor?: DOM.RGBA;
    /** The shape margin fill color (default: transparent). */
    shapeMarginColor?: DOM.RGBA;
    /** Selectors to highlight relevant nodes. */
    selectorList?: string;
    /** The grid layout color (default: transparent). */
    cssGridColor?: DOM.RGBA;
  }
  export type InspectMode = "searchForNode" | "searchForUAShadowDOM" | "none";
  export type InspectNodeRequestedParameters = {
    /** Id of the node to inspect. */
    backendNodeId: DOM.BackendNodeId;
  };
  export type InspectNodeRequestedHandler = (params: InspectNodeRequestedParameters) => void;
  export type NodeHighlightRequestedParameters = {
    nodeId: DOM.NodeId;
  };
  export type NodeHighlightRequestedHandler = (params: NodeHighlightRequestedParameters) => void;
  export type ScreenshotRequestedParameters = {
    /** Viewport to capture, in CSS. */
    viewport: Page.Viewport;
  };
  export type ScreenshotRequestedHandler = (params: ScreenshotRequestedParameters) => void;
  export type GetHighlightObjectForTestParameters = {
    /** Id of the node to get highlight object for. */
    nodeId: DOM.NodeId;
  };
  export type GetHighlightObjectForTestReturn = {
    /** Highlight data for the node. */
    highlight: any;
  };
  export type HighlightFrameParameters = {
    /** Identifier of the frame to highlight. */
    frameId: Page.FrameId;
    /** The content box highlight fill color (default: transparent). */
    contentColor?: DOM.RGBA;
    /** The content box highlight outline color (default: transparent). */
    contentOutlineColor?: DOM.RGBA;
  };
  export type HighlightNodeParameters = {
    /** A descriptor for the highlight appearance. */
    highlightConfig: HighlightConfig;
    /** Identifier of the node to highlight. */
    nodeId?: DOM.NodeId;
    /** Identifier of the backend node to highlight. */
    backendNodeId?: DOM.BackendNodeId;
    /** JavaScript object id of the node to be highlighted. */
    objectId?: Runtime.RemoteObjectId;
  };
  export type HighlightQuadParameters = {
    /** Quad to highlight */
    quad: DOM.Quad;
    /** The highlight fill color (default: transparent). */
    color?: DOM.RGBA;
    /** The highlight outline color (default: transparent). */
    outlineColor?: DOM.RGBA;
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
    color?: DOM.RGBA;
    /** The highlight outline color (default: transparent). */
    outlineColor?: DOM.RGBA;
  };
  export type SetInspectModeParameters = {
    /** Set an inspection mode. */
    mode: InspectMode;
    /** A descriptor for the highlight appearance of hovered-over nodes. May be omitted if `enabled
== false`. */
    highlightConfig?: HighlightConfig;
  };
  export type SetPausedInDebuggerMessageParameters = {
    /** The message to display, also triggers resume and step over controls. */
    message?: string;
  };
  export type SetShowDebugBordersParameters = {
    /** True for showing debug borders */
    show: boolean;
  };
  export type SetShowFPSCounterParameters = {
    /** True for showing the FPS counter */
    show: boolean;
  };
  export type SetShowPaintRectsParameters = {
    /** True for showing paint rectangles */
    result: boolean;
  };
  export type SetShowScrollBottleneckRectsParameters = {
    /** True for showing scroll bottleneck rects */
    show: boolean;
  };
  export type SetShowViewportSizeOnResizeParameters = {
    /** Whether to paint size or not. */
    show: boolean;
  };
  export type SetSuspendedParameters = {
    /** Whether overlay should be suspended and not consume any resources until resumed. */
    suspended: boolean;
  };
}
/** Actions and events related to the inspected page belong to the page domain. */
export class Page {
  private _domContentEventFired: Page.DomContentEventFiredHandler | null = null;
  private _frameAttached: Page.FrameAttachedHandler | null = null;
  private _frameClearedScheduledNavigation: Page.FrameClearedScheduledNavigationHandler | null = null;
  private _frameDetached: Page.FrameDetachedHandler | null = null;
  private _frameNavigated: Page.FrameNavigatedHandler | null = null;
  private _frameResized: Page.FrameResizedHandler | null = null;
  private _frameScheduledNavigation: Page.FrameScheduledNavigationHandler | null = null;
  private _frameStartedLoading: Page.FrameStartedLoadingHandler | null = null;
  private _frameStoppedLoading: Page.FrameStoppedLoadingHandler | null = null;
  private _interstitialHidden: Page.InterstitialHiddenHandler | null = null;
  private _interstitialShown: Page.InterstitialShownHandler | null = null;
  private _javascriptDialogClosed: Page.JavascriptDialogClosedHandler | null = null;
  private _javascriptDialogOpening: Page.JavascriptDialogOpeningHandler | null = null;
  private _lifecycleEvent: Page.LifecycleEventHandler | null = null;
  private _loadEventFired: Page.LoadEventFiredHandler | null = null;
  private _navigatedWithinDocument: Page.NavigatedWithinDocumentHandler | null = null;
  private _screencastFrame: Page.ScreencastFrameHandler | null = null;
  private _screencastVisibilityChanged: Page.ScreencastVisibilityChangedHandler | null = null;
  private _windowOpen: Page.WindowOpenHandler | null = null;
  private _compilationCacheProduced: Page.CompilationCacheProducedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Deprecated, please use addScriptToEvaluateOnNewDocument instead. */
  public addScriptToEvaluateOnLoad(params: Page.AddScriptToEvaluateOnLoadParameters) {
    return this._client.send<Page.AddScriptToEvaluateOnLoadReturn>("Page.addScriptToEvaluateOnLoad", params);
  }
  /** Evaluates given script in every frame upon creation (before loading frame's scripts). */
  public addScriptToEvaluateOnNewDocument(params: Page.AddScriptToEvaluateOnNewDocumentParameters) {
    return this._client.send<Page.AddScriptToEvaluateOnNewDocumentReturn>("Page.addScriptToEvaluateOnNewDocument", params);
  }
  /** Brings page to front (activates tab). */
  public bringToFront() {
    return this._client.send<void>("Page.bringToFront");
  }
  /** Capture page screenshot. */
  public captureScreenshot(params: Page.CaptureScreenshotParameters) {
    return this._client.send<Page.CaptureScreenshotReturn>("Page.captureScreenshot", params);
  }
  /** Clears the overriden device metrics. */
  public clearDeviceMetricsOverride() {
    return this._client.send<void>("Page.clearDeviceMetricsOverride");
  }
  /** Clears the overridden Device Orientation. */
  public clearDeviceOrientationOverride() {
    return this._client.send<void>("Page.clearDeviceOrientationOverride");
  }
  /** Clears the overriden Geolocation Position and Error. */
  public clearGeolocationOverride() {
    return this._client.send<void>("Page.clearGeolocationOverride");
  }
  /** Creates an isolated world for the given frame. */
  public createIsolatedWorld(params: Page.CreateIsolatedWorldParameters) {
    return this._client.send<Page.CreateIsolatedWorldReturn>("Page.createIsolatedWorld", params);
  }
  /** Deletes browser cookie with given name, domain and path. */
  public deleteCookie(params: Page.DeleteCookieParameters) {
    return this._client.send<void>("Page.deleteCookie", params);
  }
  /** Disables page domain notifications. */
  public disable() {
    return this._client.send<void>("Page.disable");
  }
  /** Enables page domain notifications. */
  public enable() {
    return this._client.send<void>("Page.enable");
  }
  public getAppManifest() {
    return this._client.send<Page.GetAppManifestReturn>("Page.getAppManifest");
  }
  /** Returns all browser cookies. Depending on the backend support, will return detailed cookie
information in the `cookies` field. */
  public getCookies() {
    return this._client.send<Page.GetCookiesReturn>("Page.getCookies");
  }
  /** Returns present frame tree structure. */
  public getFrameTree() {
    return this._client.send<Page.GetFrameTreeReturn>("Page.getFrameTree");
  }
  /** Returns metrics relating to the layouting of the page, such as viewport bounds/scale. */
  public getLayoutMetrics() {
    return this._client.send<Page.GetLayoutMetricsReturn>("Page.getLayoutMetrics");
  }
  /** Returns navigation history for the current page. */
  public getNavigationHistory() {
    return this._client.send<Page.GetNavigationHistoryReturn>("Page.getNavigationHistory");
  }
  /** Returns content of the given resource. */
  public getResourceContent(params: Page.GetResourceContentParameters) {
    return this._client.send<Page.GetResourceContentReturn>("Page.getResourceContent", params);
  }
  /** Returns present frame / resource tree structure. */
  public getResourceTree() {
    return this._client.send<Page.GetResourceTreeReturn>("Page.getResourceTree");
  }
  /** Accepts or dismisses a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload). */
  public handleJavaScriptDialog(params: Page.HandleJavaScriptDialogParameters) {
    return this._client.send<void>("Page.handleJavaScriptDialog", params);
  }
  /** Navigates current page to the given URL. */
  public navigate(params: Page.NavigateParameters) {
    return this._client.send<Page.NavigateReturn>("Page.navigate", params);
  }
  /** Navigates current page to the given history entry. */
  public navigateToHistoryEntry(params: Page.NavigateToHistoryEntryParameters) {
    return this._client.send<void>("Page.navigateToHistoryEntry", params);
  }
  /** Print page as PDF. */
  public printToPDF(params: Page.PrintToPDFParameters) {
    return this._client.send<Page.PrintToPDFReturn>("Page.printToPDF", params);
  }
  /** Reloads given page optionally ignoring the cache. */
  public reload(params: Page.ReloadParameters) {
    return this._client.send<void>("Page.reload", params);
  }
  /** Deprecated, please use removeScriptToEvaluateOnNewDocument instead. */
  public removeScriptToEvaluateOnLoad(params: Page.RemoveScriptToEvaluateOnLoadParameters) {
    return this._client.send<void>("Page.removeScriptToEvaluateOnLoad", params);
  }
  /** Removes given script from the list. */
  public removeScriptToEvaluateOnNewDocument(params: Page.RemoveScriptToEvaluateOnNewDocumentParameters) {
    return this._client.send<void>("Page.removeScriptToEvaluateOnNewDocument", params);
  }
  public requestAppBanner() {
    return this._client.send<void>("Page.requestAppBanner");
  }
  /** Acknowledges that a screencast frame has been received by the frontend. */
  public screencastFrameAck(params: Page.ScreencastFrameAckParameters) {
    return this._client.send<void>("Page.screencastFrameAck", params);
  }
  /** Searches for given string in resource content. */
  public searchInResource(params: Page.SearchInResourceParameters) {
    return this._client.send<Page.SearchInResourceReturn>("Page.searchInResource", params);
  }
  /** Enable Chrome's experimental ad filter on all sites. */
  public setAdBlockingEnabled(params: Page.SetAdBlockingEnabledParameters) {
    return this._client.send<void>("Page.setAdBlockingEnabled", params);
  }
  /** Enable page Content Security Policy by-passing. */
  public setBypassCSP(params: Page.SetBypassCSPParameters) {
    return this._client.send<void>("Page.setBypassCSP", params);
  }
  /** Overrides the values of device screen dimensions (window.screen.width, window.screen.height,
window.innerWidth, window.innerHeight, and "device-width"/"device-height"-related CSS media
query results). */
  public setDeviceMetricsOverride(params: Page.SetDeviceMetricsOverrideParameters) {
    return this._client.send<void>("Page.setDeviceMetricsOverride", params);
  }
  /** Overrides the Device Orientation. */
  public setDeviceOrientationOverride(params: Page.SetDeviceOrientationOverrideParameters) {
    return this._client.send<void>("Page.setDeviceOrientationOverride", params);
  }
  /** Set generic font families. */
  public setFontFamilies(params: Page.SetFontFamiliesParameters) {
    return this._client.send<void>("Page.setFontFamilies", params);
  }
  /** Set default font sizes. */
  public setFontSizes(params: Page.SetFontSizesParameters) {
    return this._client.send<void>("Page.setFontSizes", params);
  }
  /** Sets given markup as the document's HTML. */
  public setDocumentContent(params: Page.SetDocumentContentParameters) {
    return this._client.send<void>("Page.setDocumentContent", params);
  }
  /** Set the behavior when downloading a file. */
  public setDownloadBehavior(params: Page.SetDownloadBehaviorParameters) {
    return this._client.send<void>("Page.setDownloadBehavior", params);
  }
  /** Overrides the Geolocation Position or Error. Omitting any of the parameters emulates position
unavailable. */
  public setGeolocationOverride(params: Page.SetGeolocationOverrideParameters) {
    return this._client.send<void>("Page.setGeolocationOverride", params);
  }
  /** Controls whether page will emit lifecycle events. */
  public setLifecycleEventsEnabled(params: Page.SetLifecycleEventsEnabledParameters) {
    return this._client.send<void>("Page.setLifecycleEventsEnabled", params);
  }
  /** Toggles mouse event-based touch event emulation. */
  public setTouchEmulationEnabled(params: Page.SetTouchEmulationEnabledParameters) {
    return this._client.send<void>("Page.setTouchEmulationEnabled", params);
  }
  /** Starts sending each frame using the `screencastFrame` event. */
  public startScreencast(params: Page.StartScreencastParameters) {
    return this._client.send<void>("Page.startScreencast", params);
  }
  /** Force the page stop all navigations and pending resource fetches. */
  public stopLoading() {
    return this._client.send<void>("Page.stopLoading");
  }
  /** Crashes renderer on the IO thread, generates minidumps. */
  public crash() {
    return this._client.send<void>("Page.crash");
  }
  /** Tries to close page, running its beforeunload hooks, if any. */
  public close() {
    return this._client.send<void>("Page.close");
  }
  /** Tries to update the web lifecycle state of the page.
It will transition the page to the given state according to:
https://github.com/WICG/web-lifecycle/ */
  public setWebLifecycleState(params: Page.SetWebLifecycleStateParameters) {
    return this._client.send<void>("Page.setWebLifecycleState", params);
  }
  /** Stops sending each frame in the `screencastFrame`. */
  public stopScreencast() {
    return this._client.send<void>("Page.stopScreencast");
  }
  /** Forces compilation cache to be generated for every subresource script. */
  public setProduceCompilationCache(params: Page.SetProduceCompilationCacheParameters) {
    return this._client.send<void>("Page.setProduceCompilationCache", params);
  }
  /** Seeds compilation cache for given url. Compilation cache does not survive
cross-process navigation. */
  public addCompilationCache(params: Page.AddCompilationCacheParameters) {
    return this._client.send<void>("Page.addCompilationCache", params);
  }
  /** Clears seeded compilation cache. */
  public clearCompilationCache() {
    return this._client.send<void>("Page.clearCompilationCache");
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
  /** Fired when frame no longer has a scheduled navigation. */
  get frameClearedScheduledNavigation() {
    return this._frameClearedScheduledNavigation;
  }
  set frameClearedScheduledNavigation(handler) {
    if (this._frameClearedScheduledNavigation) {
      this._client.removeListener("Page.frameClearedScheduledNavigation", this._frameClearedScheduledNavigation);
    }
    this._frameClearedScheduledNavigation = handler;
    if (handler) {
      this._client.on("Page.frameClearedScheduledNavigation", handler);
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
  get frameResized() {
    return this._frameResized;
  }
  set frameResized(handler) {
    if (this._frameResized) {
      this._client.removeListener("Page.frameResized", this._frameResized);
    }
    this._frameResized = handler;
    if (handler) {
      this._client.on("Page.frameResized", handler);
    }
  }
  /** Fired when frame schedules a potential navigation. */
  get frameScheduledNavigation() {
    return this._frameScheduledNavigation;
  }
  set frameScheduledNavigation(handler) {
    if (this._frameScheduledNavigation) {
      this._client.removeListener("Page.frameScheduledNavigation", this._frameScheduledNavigation);
    }
    this._frameScheduledNavigation = handler;
    if (handler) {
      this._client.on("Page.frameScheduledNavigation", handler);
    }
  }
  /** Fired when frame has started loading. */
  get frameStartedLoading() {
    return this._frameStartedLoading;
  }
  set frameStartedLoading(handler) {
    if (this._frameStartedLoading) {
      this._client.removeListener("Page.frameStartedLoading", this._frameStartedLoading);
    }
    this._frameStartedLoading = handler;
    if (handler) {
      this._client.on("Page.frameStartedLoading", handler);
    }
  }
  /** Fired when frame has stopped loading. */
  get frameStoppedLoading() {
    return this._frameStoppedLoading;
  }
  set frameStoppedLoading(handler) {
    if (this._frameStoppedLoading) {
      this._client.removeListener("Page.frameStoppedLoading", this._frameStoppedLoading);
    }
    this._frameStoppedLoading = handler;
    if (handler) {
      this._client.on("Page.frameStoppedLoading", handler);
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
  /** Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) has been
closed. */
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
  /** Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) is about to
open. */
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
  /** Fired for top level page lifecycle events such as navigation, load, paint, etc. */
  get lifecycleEvent() {
    return this._lifecycleEvent;
  }
  set lifecycleEvent(handler) {
    if (this._lifecycleEvent) {
      this._client.removeListener("Page.lifecycleEvent", this._lifecycleEvent);
    }
    this._lifecycleEvent = handler;
    if (handler) {
      this._client.on("Page.lifecycleEvent", handler);
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
  /** Fired when same-document navigation happens, e.g. due to history API usage or anchor navigation. */
  get navigatedWithinDocument() {
    return this._navigatedWithinDocument;
  }
  set navigatedWithinDocument(handler) {
    if (this._navigatedWithinDocument) {
      this._client.removeListener("Page.navigatedWithinDocument", this._navigatedWithinDocument);
    }
    this._navigatedWithinDocument = handler;
    if (handler) {
      this._client.on("Page.navigatedWithinDocument", handler);
    }
  }
  /** Compressed image data requested by the `startScreencast`. */
  get screencastFrame() {
    return this._screencastFrame;
  }
  set screencastFrame(handler) {
    if (this._screencastFrame) {
      this._client.removeListener("Page.screencastFrame", this._screencastFrame);
    }
    this._screencastFrame = handler;
    if (handler) {
      this._client.on("Page.screencastFrame", handler);
    }
  }
  /** Fired when the page with currently enabled screencast was shown or hidden `. */
  get screencastVisibilityChanged() {
    return this._screencastVisibilityChanged;
  }
  set screencastVisibilityChanged(handler) {
    if (this._screencastVisibilityChanged) {
      this._client.removeListener("Page.screencastVisibilityChanged", this._screencastVisibilityChanged);
    }
    this._screencastVisibilityChanged = handler;
    if (handler) {
      this._client.on("Page.screencastVisibilityChanged", handler);
    }
  }
  /** Fired when a new window is going to be opened, via window.open(), link click, form submission,
etc. */
  get windowOpen() {
    return this._windowOpen;
  }
  set windowOpen(handler) {
    if (this._windowOpen) {
      this._client.removeListener("Page.windowOpen", this._windowOpen);
    }
    this._windowOpen = handler;
    if (handler) {
      this._client.on("Page.windowOpen", handler);
    }
  }
  /** Issued for every compilation cache generated. Is only available
if Page.setGenerateCompilationCache is enabled. */
  get compilationCacheProduced() {
    return this._compilationCacheProduced;
  }
  set compilationCacheProduced(handler) {
    if (this._compilationCacheProduced) {
      this._client.removeListener("Page.compilationCacheProduced", this._compilationCacheProduced);
    }
    this._compilationCacheProduced = handler;
    if (handler) {
      this._client.on("Page.compilationCacheProduced", handler);
    }
  }
}
export namespace Page {
  /** Resource type as it was perceived by the rendering engine. */
  export type ResourceType = "Document" | "Stylesheet" | "Image" | "Media" | "Font" | "Script" | "TextTrack" | "XHR" | "Fetch" | "EventSource" | "WebSocket" | "Manifest" | "SignedExchange" | "Ping" | "CSPViolationReport" | "Other";
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
    /** If the frame failed to load, this contains the URL that could not be loaded. */
    unreachableUrl?: string;
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
    lastModified?: Network.TimeSinceEpoch;
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
  /** Information about the Frame hierarchy. */
  export interface FrameTree {
    /** Frame information for this tree item. */
    frame: Frame;
    /** Child frames. */
    childFrames?: FrameTree[];
  }
  /** Unique script identifier. */
  export type ScriptIdentifier = string;
  /** Transition type. */
  export type TransitionType = "link" | "typed" | "auto_bookmark" | "auto_subframe" | "manual_subframe" | "generated" | "auto_toplevel" | "form_submit" | "reload" | "keyword" | "keyword_generated" | "other";
  /** Navigation history entry. */
  export interface NavigationEntry {
    /** Unique id of the navigation history entry. */
    id: number;
    /** URL of the navigation history entry. */
    url: string;
    /** URL that the user typed in the url bar. */
    userTypedURL: string;
    /** Title of the navigation history entry. */
    title: string;
    /** Transition type. */
    transitionType: TransitionType;
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
    timestamp?: Network.TimeSinceEpoch;
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
  /** Viewport for capturing screenshot. */
  export interface Viewport {
    /** X offset in CSS pixels. */
    x: number;
    /** Y offset in CSS pixels */
    y: number;
    /** Rectangle width in CSS pixels */
    width: number;
    /** Rectangle height in CSS pixels */
    height: number;
    /** Page scale factor. */
    scale: number;
  }
  /** Generic font families collection. */
  export interface FontFamilies {
    /** The standard font-family. */
    standard?: string;
    /** The fixed font-family. */
    fixed?: string;
    /** The serif font-family. */
    serif?: string;
    /** The sansSerif font-family. */
    sansSerif?: string;
    /** The cursive font-family. */
    cursive?: string;
    /** The fantasy font-family. */
    fantasy?: string;
    /** The pictograph font-family. */
    pictograph?: string;
  }
  /** Default font sizes. */
  export interface FontSizes {
    /** Default standard font size. */
    standard?: number;
    /** Default fixed font size. */
    fixed?: number;
  }
  export type DomContentEventFiredParameters = {
    timestamp: Network.MonotonicTime;
  };
  export type DomContentEventFiredHandler = (params: DomContentEventFiredParameters) => void;
  export type FrameAttachedParameters = {
    /** Id of the frame that has been attached. */
    frameId: FrameId;
    /** Parent frame identifier. */
    parentFrameId: FrameId;
    /** JavaScript stack trace of when frame was attached, only set if frame initiated from script. */
    stack?: Runtime.StackTrace;
  };
  export type FrameAttachedHandler = (params: FrameAttachedParameters) => void;
  export type FrameClearedScheduledNavigationParameters = {
    /** Id of the frame that has cleared its scheduled navigation. */
    frameId: FrameId;
  };
  export type FrameClearedScheduledNavigationHandler = (params: FrameClearedScheduledNavigationParameters) => void;
  export type FrameDetachedParameters = {
    /** Id of the frame that has been detached. */
    frameId: FrameId;
  };
  export type FrameDetachedHandler = (params: FrameDetachedParameters) => void;
  export type FrameNavigatedParameters = {
    /** Frame object. */
    frame: Frame;
  };
  export type FrameNavigatedHandler = (params: FrameNavigatedParameters) => void;
  export type FrameResizedHandler = () => void;
  export type FrameScheduledNavigationParameters = {
    /** Id of the frame that has scheduled a navigation. */
    frameId: FrameId;
    /** Delay (in seconds) until the navigation is scheduled to begin. The navigation is not
guaranteed to start. */
    delay: number;
    /** The reason for the navigation. */
    reason: "formSubmissionGet" | "formSubmissionPost" | "httpHeaderRefresh" | "scriptInitiated" | "metaTagRefresh" | "pageBlockInterstitial" | "reload";
    /** The destination URL for the scheduled navigation. */
    url: string;
  };
  export type FrameScheduledNavigationHandler = (params: FrameScheduledNavigationParameters) => void;
  export type FrameStartedLoadingParameters = {
    /** Id of the frame that has started loading. */
    frameId: FrameId;
  };
  export type FrameStartedLoadingHandler = (params: FrameStartedLoadingParameters) => void;
  export type FrameStoppedLoadingParameters = {
    /** Id of the frame that has stopped loading. */
    frameId: FrameId;
  };
  export type FrameStoppedLoadingHandler = (params: FrameStoppedLoadingParameters) => void;
  export type InterstitialHiddenHandler = () => void;
  export type InterstitialShownHandler = () => void;
  export type JavascriptDialogClosedParameters = {
    /** Whether dialog was confirmed. */
    result: boolean;
    /** User input in case of prompt. */
    userInput: string;
  };
  export type JavascriptDialogClosedHandler = (params: JavascriptDialogClosedParameters) => void;
  export type JavascriptDialogOpeningParameters = {
    /** Frame url. */
    url: string;
    /** Message that will be displayed by the dialog. */
    message: string;
    /** Dialog type. */
    type: DialogType;
    /** True iff browser is capable showing or acting on the given dialog. When browser has no
dialog handler for given target, calling alert while Page domain is engaged will stall
the page execution. Execution can be resumed via calling Page.handleJavaScriptDialog. */
    hasBrowserHandler: boolean;
    /** Default dialog prompt. */
    defaultPrompt?: string;
  };
  export type JavascriptDialogOpeningHandler = (params: JavascriptDialogOpeningParameters) => void;
  export type LifecycleEventParameters = {
    /** Id of the frame. */
    frameId: FrameId;
    /** Loader identifier. Empty string if the request is fetched from worker. */
    loaderId: Network.LoaderId;
    name: string;
    timestamp: Network.MonotonicTime;
  };
  export type LifecycleEventHandler = (params: LifecycleEventParameters) => void;
  export type LoadEventFiredParameters = {
    timestamp: Network.MonotonicTime;
  };
  export type LoadEventFiredHandler = (params: LoadEventFiredParameters) => void;
  export type NavigatedWithinDocumentParameters = {
    /** Id of the frame. */
    frameId: FrameId;
    /** Frame's new url. */
    url: string;
  };
  export type NavigatedWithinDocumentHandler = (params: NavigatedWithinDocumentParameters) => void;
  export type ScreencastFrameParameters = {
    /** Base64-encoded compressed image. */
    data: string;
    /** Screencast frame metadata. */
    metadata: ScreencastFrameMetadata;
    /** Frame number. */
    sessionId: number;
  };
  export type ScreencastFrameHandler = (params: ScreencastFrameParameters) => void;
  export type ScreencastVisibilityChangedParameters = {
    /** True if the page is visible. */
    visible: boolean;
  };
  export type ScreencastVisibilityChangedHandler = (params: ScreencastVisibilityChangedParameters) => void;
  export type WindowOpenParameters = {
    /** The URL for the new window. */
    url: string;
    /** Window name. */
    windowName: string;
    /** An array of enabled window features. */
    windowFeatures: string[];
    /** Whether or not it was triggered by user gesture. */
    userGesture: boolean;
  };
  export type WindowOpenHandler = (params: WindowOpenParameters) => void;
  export type CompilationCacheProducedParameters = {
    url: string;
    /** Base64-encoded data */
    data: string;
  };
  export type CompilationCacheProducedHandler = (params: CompilationCacheProducedParameters) => void;
  export type AddScriptToEvaluateOnLoadParameters = {
    scriptSource: string;
  };
  export type AddScriptToEvaluateOnLoadReturn = {
    /** Identifier of the added script. */
    identifier: ScriptIdentifier;
  };
  export type AddScriptToEvaluateOnNewDocumentParameters = {
    source: string;
  };
  export type AddScriptToEvaluateOnNewDocumentReturn = {
    /** Identifier of the added script. */
    identifier: ScriptIdentifier;
  };
  export type CaptureScreenshotParameters = {
    /** Image compression format (defaults to png). */
    format?: "jpeg" | "png";
    /** Compression quality from range [0..100] (jpeg only). */
    quality?: number;
    /** Capture the screenshot of a given region only. */
    clip?: Viewport;
    /** Capture the screenshot from the surface, rather than the view. Defaults to true. */
    fromSurface?: boolean;
  };
  export type CaptureScreenshotReturn = {
    /** Base64-encoded image data. */
    data: string;
  };
  export type CreateIsolatedWorldParameters = {
    /** Id of the frame in which the isolated world should be created. */
    frameId: FrameId;
    /** An optional name which is reported in the Execution Context. */
    worldName?: string;
    /** Whether or not universal access should be granted to the isolated world. This is a powerful
option, use with caution. */
    grantUniveralAccess?: boolean;
  };
  export type CreateIsolatedWorldReturn = {
    /** Execution context of the isolated world. */
    executionContextId: Runtime.ExecutionContextId;
  };
  export type DeleteCookieParameters = {
    /** Name of the cookie to remove. */
    cookieName: string;
    /** URL to match cooke domain and path. */
    url: string;
  };
  export type GetAppManifestReturn = {
    /** Manifest location. */
    url: string;
    errors: AppManifestError[];
    /** Manifest content. */
    data?: string;
  };
  export type GetCookiesReturn = {
    /** Array of cookie objects. */
    cookies: Network.Cookie[];
  };
  export type GetFrameTreeReturn = {
    /** Present frame tree structure. */
    frameTree: FrameTree;
  };
  export type GetLayoutMetricsReturn = {
    /** Metrics relating to the layout viewport. */
    layoutViewport: LayoutViewport;
    /** Metrics relating to the visual viewport. */
    visualViewport: VisualViewport;
    /** Size of scrollable area. */
    contentSize: DOM.Rect;
  };
  export type GetNavigationHistoryReturn = {
    /** Index of the current navigation history entry. */
    currentIndex: number;
    /** Array of navigation history entries. */
    entries: NavigationEntry[];
  };
  export type GetResourceContentParameters = {
    /** Frame id to get resource for. */
    frameId: FrameId;
    /** URL of the resource to get content for. */
    url: string;
  };
  export type GetResourceContentReturn = {
    /** Resource content. */
    content: string;
    /** True, if content was served as base64. */
    base64Encoded: boolean;
  };
  export type GetResourceTreeReturn = {
    /** Present frame / resource tree structure. */
    frameTree: FrameResourceTree;
  };
  export type HandleJavaScriptDialogParameters = {
    /** Whether to accept or dismiss the dialog. */
    accept: boolean;
    /** The text to enter into the dialog prompt before accepting. Used only if this is a prompt
dialog. */
    promptText?: string;
  };
  export type NavigateParameters = {
    /** URL to navigate the page to. */
    url: string;
    /** Referrer URL. */
    referrer?: string;
    /** Intended transition type. */
    transitionType?: TransitionType;
    /** Frame id to navigate, if not specified navigates the top frame. */
    frameId?: FrameId;
  };
  export type NavigateReturn = {
    /** Frame id that has navigated (or failed to navigate) */
    frameId: FrameId;
    /** Loader identifier. */
    loaderId?: Network.LoaderId;
    /** User friendly error message, present if and only if navigation has failed. */
    errorText?: string;
  };
  export type NavigateToHistoryEntryParameters = {
    /** Unique id of the entry to navigate to. */
    entryId: number;
  };
  export type PrintToPDFParameters = {
    /** Paper orientation. Defaults to false. */
    landscape?: boolean;
    /** Display header and footer. Defaults to false. */
    displayHeaderFooter?: boolean;
    /** Print background graphics. Defaults to false. */
    printBackground?: boolean;
    /** Scale of the webpage rendering. Defaults to 1. */
    scale?: number;
    /** Paper width in inches. Defaults to 8.5 inches. */
    paperWidth?: number;
    /** Paper height in inches. Defaults to 11 inches. */
    paperHeight?: number;
    /** Top margin in inches. Defaults to 1cm (~0.4 inches). */
    marginTop?: number;
    /** Bottom margin in inches. Defaults to 1cm (~0.4 inches). */
    marginBottom?: number;
    /** Left margin in inches. Defaults to 1cm (~0.4 inches). */
    marginLeft?: number;
    /** Right margin in inches. Defaults to 1cm (~0.4 inches). */
    marginRight?: number;
    /** Paper ranges to print, e.g., '1-5, 8, 11-13'. Defaults to the empty string, which means
print all pages. */
    pageRanges?: string;
    /** Whether to silently ignore invalid but successfully parsed page ranges, such as '3-2'.
Defaults to false. */
    ignoreInvalidPageRanges?: boolean;
    /** HTML template for the print header. Should be valid HTML markup with following
classes used to inject printing values into them:
- `date`: formatted print date
- `title`: document title
- `url`: document location
- `pageNumber`: current page number
- `totalPages`: total pages in the document

For example, `<span class=title></span>` would generate span containing the title. */
    headerTemplate?: string;
    /** HTML template for the print footer. Should use the same format as the `headerTemplate`. */
    footerTemplate?: string;
    /** Whether or not to prefer page size as defined by css. Defaults to false,
in which case the content will be scaled to fit the paper size. */
    preferCSSPageSize?: boolean;
  };
  export type PrintToPDFReturn = {
    /** Base64-encoded pdf data. */
    data: string;
  };
  export type ReloadParameters = {
    /** If true, browser cache is ignored (as if the user pressed Shift+refresh). */
    ignoreCache?: boolean;
    /** If set, the script will be injected into all frames of the inspected page after reload.
Argument will be ignored if reloading dataURL origin. */
    scriptToEvaluateOnLoad?: string;
  };
  export type RemoveScriptToEvaluateOnLoadParameters = {
    identifier: ScriptIdentifier;
  };
  export type RemoveScriptToEvaluateOnNewDocumentParameters = {
    identifier: ScriptIdentifier;
  };
  export type ScreencastFrameAckParameters = {
    /** Frame number. */
    sessionId: number;
  };
  export type SearchInResourceParameters = {
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
  export type SearchInResourceReturn = {
    /** List of search matches. */
    result: Debugger.SearchMatch[];
  };
  export type SetAdBlockingEnabledParameters = {
    /** Whether to block ads. */
    enabled: boolean;
  };
  export type SetBypassCSPParameters = {
    /** Whether to bypass page CSP. */
    enabled: boolean;
  };
  export type SetDeviceMetricsOverrideParameters = {
    /** Overriding width value in pixels (minimum 0, maximum 10000000). 0 disables the override. */
    width: number;
    /** Overriding height value in pixels (minimum 0, maximum 10000000). 0 disables the override. */
    height: number;
    /** Overriding device scale factor value. 0 disables the override. */
    deviceScaleFactor: number;
    /** Whether to emulate mobile device. This includes viewport meta tag, overlay scrollbars, text
autosizing and more. */
    mobile: boolean;
    /** Scale to apply to resulting view image. */
    scale?: number;
    /** Overriding screen width value in pixels (minimum 0, maximum 10000000). */
    screenWidth?: number;
    /** Overriding screen height value in pixels (minimum 0, maximum 10000000). */
    screenHeight?: number;
    /** Overriding view X position on screen in pixels (minimum 0, maximum 10000000). */
    positionX?: number;
    /** Overriding view Y position on screen in pixels (minimum 0, maximum 10000000). */
    positionY?: number;
    /** Do not set visible view size, rely upon explicit setVisibleSize call. */
    dontSetVisibleSize?: boolean;
    /** Screen orientation override. */
    screenOrientation?: Emulation.ScreenOrientation;
    /** The viewport dimensions and scale. If not set, the override is cleared. */
    viewport?: Viewport;
  };
  export type SetDeviceOrientationOverrideParameters = {
    /** Mock alpha */
    alpha: number;
    /** Mock beta */
    beta: number;
    /** Mock gamma */
    gamma: number;
  };
  export type SetFontFamiliesParameters = {
    /** Specifies font families to set. If a font family is not specified, it won't be changed. */
    fontFamilies: FontFamilies;
  };
  export type SetFontSizesParameters = {
    /** Specifies font sizes to set. If a font size is not specified, it won't be changed. */
    fontSizes: FontSizes;
  };
  export type SetDocumentContentParameters = {
    /** Frame id to set HTML for. */
    frameId: FrameId;
    /** HTML content to set. */
    html: string;
  };
  export type SetDownloadBehaviorParameters = {
    /** Whether to allow all or deny all download requests, or use default Chrome behavior if
available (otherwise deny). */
    behavior: "deny" | "allow" | "default";
    /** The default path to save downloaded files to. This is requred if behavior is set to 'allow' */
    downloadPath?: string;
  };
  export type SetGeolocationOverrideParameters = {
    /** Mock latitude */
    latitude?: number;
    /** Mock longitude */
    longitude?: number;
    /** Mock accuracy */
    accuracy?: number;
  };
  export type SetLifecycleEventsEnabledParameters = {
    /** If true, starts emitting lifecycle events. */
    enabled: boolean;
  };
  export type SetTouchEmulationEnabledParameters = {
    /** Whether the touch event emulation should be enabled. */
    enabled: boolean;
    /** Touch/gesture events configuration. Default: current platform. */
    configuration?: "mobile" | "desktop";
  };
  export type StartScreencastParameters = {
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
  export type SetWebLifecycleStateParameters = {
    /** Target lifecycle state */
    state: "frozen" | "active";
  };
  export type SetProduceCompilationCacheParameters = {
    enabled: boolean;
  };
  export type AddCompilationCacheParameters = {
    url: string;
    /** Base64-encoded data */
    data: string;
  };
}
export class Performance {
  private _metrics: Performance.MetricsHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Disable collecting and reporting metrics. */
  public disable() {
    return this._client.send<void>("Performance.disable");
  }
  /** Enable collecting and reporting metrics. */
  public enable() {
    return this._client.send<void>("Performance.enable");
  }
  /** Retrieve current values of run-time metrics. */
  public getMetrics() {
    return this._client.send<Performance.GetMetricsReturn>("Performance.getMetrics");
  }
  /** Current values of the metrics. */
  get metrics() {
    return this._metrics;
  }
  set metrics(handler) {
    if (this._metrics) {
      this._client.removeListener("Performance.metrics", this._metrics);
    }
    this._metrics = handler;
    if (handler) {
      this._client.on("Performance.metrics", handler);
    }
  }
}
export namespace Performance {
  /** Run-time execution metric. */
  export interface Metric {
    /** Metric name. */
    name: string;
    /** Metric value. */
    value: number;
  }
  export type MetricsParameters = {
    /** Current values of the metrics. */
    metrics: Metric[];
    /** Timestamp title. */
    title: string;
  };
  export type MetricsHandler = (params: MetricsParameters) => void;
  export type GetMetricsReturn = {
    /** Current values for run-time metrics. */
    metrics: Metric[];
  };
}
/** Security */
export class Security {
  private _certificateError: Security.CertificateErrorHandler | null = null;
  private _securityStateChanged: Security.SecurityStateChangedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Disables tracking security state changes. */
  public disable() {
    return this._client.send<void>("Security.disable");
  }
  /** Enables tracking security state changes. */
  public enable() {
    return this._client.send<void>("Security.enable");
  }
  /** Enable/disable whether all certificate errors should be ignored. */
  public setIgnoreCertificateErrors(params: Security.SetIgnoreCertificateErrorsParameters) {
    return this._client.send<void>("Security.setIgnoreCertificateErrors", params);
  }
  /** Handles a certificate error that fired a certificateError event. */
  public handleCertificateError(params: Security.HandleCertificateErrorParameters) {
    return this._client.send<void>("Security.handleCertificateError", params);
  }
  /** Enable/disable overriding certificate errors. If enabled, all certificate error events need to
be handled by the DevTools client and should be answered with `handleCertificateError` commands. */
  public setOverrideCertificateErrors(params: Security.SetOverrideCertificateErrorsParameters) {
    return this._client.send<void>("Security.setOverrideCertificateErrors", params);
  }
  /** There is a certificate error. If overriding certificate errors is enabled, then it should be
handled with the `handleCertificateError` command. Note: this event does not fire if the
certificate error has been allowed internally. Only one client per target should override
certificate errors at the same time. */
  get certificateError() {
    return this._certificateError;
  }
  set certificateError(handler) {
    if (this._certificateError) {
      this._client.removeListener("Security.certificateError", this._certificateError);
    }
    this._certificateError = handler;
    if (handler) {
      this._client.on("Security.certificateError", handler);
    }
  }
  /** The security state of the page changed. */
  get securityStateChanged() {
    return this._securityStateChanged;
  }
  set securityStateChanged(handler) {
    if (this._securityStateChanged) {
      this._client.removeListener("Security.securityStateChanged", this._securityStateChanged);
    }
    this._securityStateChanged = handler;
    if (handler) {
      this._client.on("Security.securityStateChanged", handler);
    }
  }
}
export namespace Security {
  /** An internal certificate ID value. */
  export type CertificateId = number;
  /** A description of mixed content (HTTP resources on HTTPS pages), as defined by
https://www.w3.org/TR/mixed-content/#categories */
  export type MixedContentType = "blockable" | "optionally-blockable" | "none";
  /** The security level of a page or resource. */
  export type SecurityState = "unknown" | "neutral" | "insecure" | "secure" | "info";
  /** An explanation of an factor contributing to the security state. */
  export interface SecurityStateExplanation {
    /** Security state representing the severity of the factor being explained. */
    securityState: SecurityState;
    /** Title describing the type of factor. */
    title: string;
    /** Short phrase describing the type of factor. */
    summary: string;
    /** Full text explanation of the factor. */
    description: string;
    /** The type of mixed content described by the explanation. */
    mixedContentType: MixedContentType;
    /** Page certificate. */
    certificate: string[];
  }
  /** Information about insecure content on the page. */
  export interface InsecureContentStatus {
    /** True if the page was loaded over HTTPS and ran mixed (HTTP) content such as scripts. */
    ranMixedContent: boolean;
    /** True if the page was loaded over HTTPS and displayed mixed (HTTP) content such as images. */
    displayedMixedContent: boolean;
    /** True if the page was loaded over HTTPS and contained a form targeting an insecure url. */
    containedMixedForm: boolean;
    /** True if the page was loaded over HTTPS without certificate errors, and ran content such as
scripts that were loaded with certificate errors. */
    ranContentWithCertErrors: boolean;
    /** True if the page was loaded over HTTPS without certificate errors, and displayed content
such as images that were loaded with certificate errors. */
    displayedContentWithCertErrors: boolean;
    /** Security state representing a page that ran insecure content. */
    ranInsecureContentStyle: SecurityState;
    /** Security state representing a page that displayed insecure content. */
    displayedInsecureContentStyle: SecurityState;
  }
  /** The action to take when a certificate error occurs. continue will continue processing the
request and cancel will cancel the request. */
  export type CertificateErrorAction = "continue" | "cancel";
  export type CertificateErrorParameters = {
    /** The ID of the event. */
    eventId: number;
    /** The type of the error. */
    errorType: string;
    /** The url that was requested. */
    requestURL: string;
  };
  export type CertificateErrorHandler = (params: CertificateErrorParameters) => void;
  export type SecurityStateChangedParameters = {
    /** Security state. */
    securityState: SecurityState;
    /** True if the page was loaded over cryptographic transport such as HTTPS. */
    schemeIsCryptographic: boolean;
    /** List of explanations for the security state. If the overall security state is `insecure` or
`warning`, at least one corresponding explanation should be included. */
    explanations: SecurityStateExplanation[];
    /** Information about insecure content on the page. */
    insecureContentStatus: InsecureContentStatus;
    /** Overrides user-visible description of the state. */
    summary?: string;
  };
  export type SecurityStateChangedHandler = (params: SecurityStateChangedParameters) => void;
  export type SetIgnoreCertificateErrorsParameters = {
    /** If true, all certificate errors will be ignored. */
    ignore: boolean;
  };
  export type HandleCertificateErrorParameters = {
    /** The ID of the event. */
    eventId: number;
    /** The action to take on the certificate error. */
    action: CertificateErrorAction;
  };
  export type SetOverrideCertificateErrorsParameters = {
    /** If true, certificate errors will be overridden. */
    override: boolean;
  };
}
export class ServiceWorker {
  private _workerErrorReported: ServiceWorker.WorkerErrorReportedHandler | null = null;
  private _workerRegistrationUpdated: ServiceWorker.WorkerRegistrationUpdatedHandler | null = null;
  private _workerVersionUpdated: ServiceWorker.WorkerVersionUpdatedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  public deliverPushMessage(params: ServiceWorker.DeliverPushMessageParameters) {
    return this._client.send<void>("ServiceWorker.deliverPushMessage", params);
  }
  public disable() {
    return this._client.send<void>("ServiceWorker.disable");
  }
  public dispatchSyncEvent(params: ServiceWorker.DispatchSyncEventParameters) {
    return this._client.send<void>("ServiceWorker.dispatchSyncEvent", params);
  }
  public enable() {
    return this._client.send<void>("ServiceWorker.enable");
  }
  public inspectWorker(params: ServiceWorker.InspectWorkerParameters) {
    return this._client.send<void>("ServiceWorker.inspectWorker", params);
  }
  public setForceUpdateOnPageLoad(params: ServiceWorker.SetForceUpdateOnPageLoadParameters) {
    return this._client.send<void>("ServiceWorker.setForceUpdateOnPageLoad", params);
  }
  public skipWaiting(params: ServiceWorker.SkipWaitingParameters) {
    return this._client.send<void>("ServiceWorker.skipWaiting", params);
  }
  public startWorker(params: ServiceWorker.StartWorkerParameters) {
    return this._client.send<void>("ServiceWorker.startWorker", params);
  }
  public stopAllWorkers() {
    return this._client.send<void>("ServiceWorker.stopAllWorkers");
  }
  public stopWorker(params: ServiceWorker.StopWorkerParameters) {
    return this._client.send<void>("ServiceWorker.stopWorker", params);
  }
  public unregister(params: ServiceWorker.UnregisterParameters) {
    return this._client.send<void>("ServiceWorker.unregister", params);
  }
  public updateRegistration(params: ServiceWorker.UpdateRegistrationParameters) {
    return this._client.send<void>("ServiceWorker.updateRegistration", params);
  }
  get workerErrorReported() {
    return this._workerErrorReported;
  }
  set workerErrorReported(handler) {
    if (this._workerErrorReported) {
      this._client.removeListener("ServiceWorker.workerErrorReported", this._workerErrorReported);
    }
    this._workerErrorReported = handler;
    if (handler) {
      this._client.on("ServiceWorker.workerErrorReported", handler);
    }
  }
  get workerRegistrationUpdated() {
    return this._workerRegistrationUpdated;
  }
  set workerRegistrationUpdated(handler) {
    if (this._workerRegistrationUpdated) {
      this._client.removeListener("ServiceWorker.workerRegistrationUpdated", this._workerRegistrationUpdated);
    }
    this._workerRegistrationUpdated = handler;
    if (handler) {
      this._client.on("ServiceWorker.workerRegistrationUpdated", handler);
    }
  }
  get workerVersionUpdated() {
    return this._workerVersionUpdated;
  }
  set workerVersionUpdated(handler) {
    if (this._workerVersionUpdated) {
      this._client.removeListener("ServiceWorker.workerVersionUpdated", this._workerVersionUpdated);
    }
    this._workerVersionUpdated = handler;
    if (handler) {
      this._client.on("ServiceWorker.workerVersionUpdated", handler);
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
    /** The time at which the response headers of the main script were received from the server.
For cached script it is the last time the cache entry was validated. */
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
  export type WorkerErrorReportedParameters = {
    errorMessage: ServiceWorkerErrorMessage;
  };
  export type WorkerErrorReportedHandler = (params: WorkerErrorReportedParameters) => void;
  export type WorkerRegistrationUpdatedParameters = {
    registrations: ServiceWorkerRegistration[];
  };
  export type WorkerRegistrationUpdatedHandler = (params: WorkerRegistrationUpdatedParameters) => void;
  export type WorkerVersionUpdatedParameters = {
    versions: ServiceWorkerVersion[];
  };
  export type WorkerVersionUpdatedHandler = (params: WorkerVersionUpdatedParameters) => void;
  export type DeliverPushMessageParameters = {
    origin: string;
    registrationId: string;
    data: string;
  };
  export type DispatchSyncEventParameters = {
    origin: string;
    registrationId: string;
    tag: string;
    lastChance: boolean;
  };
  export type InspectWorkerParameters = {
    versionId: string;
  };
  export type SetForceUpdateOnPageLoadParameters = {
    forceUpdateOnPageLoad: boolean;
  };
  export type SkipWaitingParameters = {
    scopeURL: string;
  };
  export type StartWorkerParameters = {
    scopeURL: string;
  };
  export type StopWorkerParameters = {
    versionId: string;
  };
  export type UnregisterParameters = {
    scopeURL: string;
  };
  export type UpdateRegistrationParameters = {
    scopeURL: string;
  };
}
export class Storage {
  private _cacheStorageContentUpdated: Storage.CacheStorageContentUpdatedHandler | null = null;
  private _cacheStorageListUpdated: Storage.CacheStorageListUpdatedHandler | null = null;
  private _indexedDBContentUpdated: Storage.IndexedDBContentUpdatedHandler | null = null;
  private _indexedDBListUpdated: Storage.IndexedDBListUpdatedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Clears storage for origin. */
  public clearDataForOrigin(params: Storage.ClearDataForOriginParameters) {
    return this._client.send<void>("Storage.clearDataForOrigin", params);
  }
  /** Returns usage and quota in bytes. */
  public getUsageAndQuota(params: Storage.GetUsageAndQuotaParameters) {
    return this._client.send<Storage.GetUsageAndQuotaReturn>("Storage.getUsageAndQuota", params);
  }
  /** Registers origin to be notified when an update occurs to its cache storage list. */
  public trackCacheStorageForOrigin(params: Storage.TrackCacheStorageForOriginParameters) {
    return this._client.send<void>("Storage.trackCacheStorageForOrigin", params);
  }
  /** Registers origin to be notified when an update occurs to its IndexedDB. */
  public trackIndexedDBForOrigin(params: Storage.TrackIndexedDBForOriginParameters) {
    return this._client.send<void>("Storage.trackIndexedDBForOrigin", params);
  }
  /** Unregisters origin from receiving notifications for cache storage. */
  public untrackCacheStorageForOrigin(params: Storage.UntrackCacheStorageForOriginParameters) {
    return this._client.send<void>("Storage.untrackCacheStorageForOrigin", params);
  }
  /** Unregisters origin from receiving notifications for IndexedDB. */
  public untrackIndexedDBForOrigin(params: Storage.UntrackIndexedDBForOriginParameters) {
    return this._client.send<void>("Storage.untrackIndexedDBForOrigin", params);
  }
  /** A cache's contents have been modified. */
  get cacheStorageContentUpdated() {
    return this._cacheStorageContentUpdated;
  }
  set cacheStorageContentUpdated(handler) {
    if (this._cacheStorageContentUpdated) {
      this._client.removeListener("Storage.cacheStorageContentUpdated", this._cacheStorageContentUpdated);
    }
    this._cacheStorageContentUpdated = handler;
    if (handler) {
      this._client.on("Storage.cacheStorageContentUpdated", handler);
    }
  }
  /** A cache has been added/deleted. */
  get cacheStorageListUpdated() {
    return this._cacheStorageListUpdated;
  }
  set cacheStorageListUpdated(handler) {
    if (this._cacheStorageListUpdated) {
      this._client.removeListener("Storage.cacheStorageListUpdated", this._cacheStorageListUpdated);
    }
    this._cacheStorageListUpdated = handler;
    if (handler) {
      this._client.on("Storage.cacheStorageListUpdated", handler);
    }
  }
  /** The origin's IndexedDB object store has been modified. */
  get indexedDBContentUpdated() {
    return this._indexedDBContentUpdated;
  }
  set indexedDBContentUpdated(handler) {
    if (this._indexedDBContentUpdated) {
      this._client.removeListener("Storage.indexedDBContentUpdated", this._indexedDBContentUpdated);
    }
    this._indexedDBContentUpdated = handler;
    if (handler) {
      this._client.on("Storage.indexedDBContentUpdated", handler);
    }
  }
  /** The origin's IndexedDB database list has been modified. */
  get indexedDBListUpdated() {
    return this._indexedDBListUpdated;
  }
  set indexedDBListUpdated(handler) {
    if (this._indexedDBListUpdated) {
      this._client.removeListener("Storage.indexedDBListUpdated", this._indexedDBListUpdated);
    }
    this._indexedDBListUpdated = handler;
    if (handler) {
      this._client.on("Storage.indexedDBListUpdated", handler);
    }
  }
}
export namespace Storage {
  /** Enum of possible storage types. */
  export type StorageType = "appcache" | "cookies" | "file_systems" | "indexeddb" | "local_storage" | "shader_cache" | "websql" | "service_workers" | "cache_storage" | "all" | "other";
  /** Usage for a storage type. */
  export interface UsageForType {
    /** Name of storage type. */
    storageType: StorageType;
    /** Storage usage (bytes). */
    usage: number;
  }
  export type CacheStorageContentUpdatedParameters = {
    /** Origin to update. */
    origin: string;
    /** Name of cache in origin. */
    cacheName: string;
  };
  export type CacheStorageContentUpdatedHandler = (params: CacheStorageContentUpdatedParameters) => void;
  export type CacheStorageListUpdatedParameters = {
    /** Origin to update. */
    origin: string;
  };
  export type CacheStorageListUpdatedHandler = (params: CacheStorageListUpdatedParameters) => void;
  export type IndexedDBContentUpdatedParameters = {
    /** Origin to update. */
    origin: string;
    /** Database to update. */
    databaseName: string;
    /** ObjectStore to update. */
    objectStoreName: string;
  };
  export type IndexedDBContentUpdatedHandler = (params: IndexedDBContentUpdatedParameters) => void;
  export type IndexedDBListUpdatedParameters = {
    /** Origin to update. */
    origin: string;
  };
  export type IndexedDBListUpdatedHandler = (params: IndexedDBListUpdatedParameters) => void;
  export type ClearDataForOriginParameters = {
    /** Security origin. */
    origin: string;
    /** Comma separated origin names. */
    storageTypes: string;
  };
  export type GetUsageAndQuotaParameters = {
    /** Security origin. */
    origin: string;
  };
  export type GetUsageAndQuotaReturn = {
    /** Storage usage (bytes). */
    usage: number;
    /** Storage quota (bytes). */
    quota: number;
    /** Storage usage per type (bytes). */
    usageBreakdown: UsageForType[];
  };
  export type TrackCacheStorageForOriginParameters = {
    /** Security origin. */
    origin: string;
  };
  export type TrackIndexedDBForOriginParameters = {
    /** Security origin. */
    origin: string;
  };
  export type UntrackCacheStorageForOriginParameters = {
    /** Security origin. */
    origin: string;
  };
  export type UntrackIndexedDBForOriginParameters = {
    /** Security origin. */
    origin: string;
  };
}
/** The SystemInfo domain defines methods and events for querying low-level system information. */
export class SystemInfo {
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Returns information about the system. */
  public getInfo() {
    return this._client.send<SystemInfo.GetInfoReturn>("SystemInfo.getInfo");
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
  export type GetInfoReturn = {
    /** Information about the GPUs on the system. */
    gpu: GPUInfo;
    /** A platform-dependent description of the model of the machine. On Mac OS, this is, for
example, 'MacBookPro'. Will be the empty string if not supported. */
    modelName: string;
    /** A platform-dependent description of the version of the machine. On Mac OS, this is, for
example, '10.1'. Will be the empty string if not supported. */
    modelVersion: string;
    /** The command line string used to launch the browser. Will be the empty string if not
supported. */
    commandLine: string;
  };
}
/** Supports additional targets discovery and allows to attach to them. */
export class Target {
  private _attachedToTarget: Target.AttachedToTargetHandler | null = null;
  private _detachedFromTarget: Target.DetachedFromTargetHandler | null = null;
  private _receivedMessageFromTarget: Target.ReceivedMessageFromTargetHandler | null = null;
  private _targetCreated: Target.TargetCreatedHandler | null = null;
  private _targetDestroyed: Target.TargetDestroyedHandler | null = null;
  private _targetCrashed: Target.TargetCrashedHandler | null = null;
  private _targetInfoChanged: Target.TargetInfoChangedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Activates (focuses) the target. */
  public activateTarget(params: Target.ActivateTargetParameters) {
    return this._client.send<void>("Target.activateTarget", params);
  }
  /** Attaches to the target with given id. */
  public attachToTarget(params: Target.AttachToTargetParameters) {
    return this._client.send<Target.AttachToTargetReturn>("Target.attachToTarget", params);
  }
  /** Attaches to the browser target, only uses flat sessionId mode. */
  public attachToBrowserTarget() {
    return this._client.send<Target.AttachToBrowserTargetReturn>("Target.attachToBrowserTarget");
  }
  /** Closes the target. If the target is a page that gets closed too. */
  public closeTarget(params: Target.CloseTargetParameters) {
    return this._client.send<Target.CloseTargetReturn>("Target.closeTarget", params);
  }
  /** Inject object to the target's main frame that provides a communication
channel with browser target.

Injected object will be available as `window[bindingName]`.

The object has the follwing API:
- `binding.send(json)` - a method to send messages over the remote debugging protocol
- `binding.onmessage = json => handleMessage(json)` - a callback that will be called for the protocol notifications and command responses. */
  public exposeDevToolsProtocol(params: Target.ExposeDevToolsProtocolParameters) {
    return this._client.send<void>("Target.exposeDevToolsProtocol", params);
  }
  /** Creates a new empty BrowserContext. Similar to an incognito profile but you can have more than
one. */
  public createBrowserContext() {
    return this._client.send<Target.CreateBrowserContextReturn>("Target.createBrowserContext");
  }
  /** Returns all browser contexts created with `Target.createBrowserContext` method. */
  public getBrowserContexts() {
    return this._client.send<Target.GetBrowserContextsReturn>("Target.getBrowserContexts");
  }
  /** Creates a new page. */
  public createTarget(params: Target.CreateTargetParameters) {
    return this._client.send<Target.CreateTargetReturn>("Target.createTarget", params);
  }
  /** Detaches session with given id. */
  public detachFromTarget(params: Target.DetachFromTargetParameters) {
    return this._client.send<void>("Target.detachFromTarget", params);
  }
  /** Deletes a BrowserContext. All the belonging pages will be closed without calling their
beforeunload hooks. */
  public disposeBrowserContext(params: Target.DisposeBrowserContextParameters) {
    return this._client.send<void>("Target.disposeBrowserContext", params);
  }
  /** Returns information about a target. */
  public getTargetInfo(params: Target.GetTargetInfoParameters) {
    return this._client.send<Target.GetTargetInfoReturn>("Target.getTargetInfo", params);
  }
  /** Retrieves a list of available targets. */
  public getTargets() {
    return this._client.send<Target.GetTargetsReturn>("Target.getTargets");
  }
  /** Sends protocol message over session with given id. */
  public sendMessageToTarget(params: Target.SendMessageToTargetParameters) {
    return this._client.send<void>("Target.sendMessageToTarget", params);
  }
  /** Controls whether to automatically attach to new targets which are considered to be related to
this one. When turned on, attaches to all existing related targets as well. When turned off,
automatically detaches from all currently attached targets. */
  public setAutoAttach(params: Target.SetAutoAttachParameters) {
    return this._client.send<void>("Target.setAutoAttach", params);
  }
  /** Controls whether to discover available targets and notify via
`targetCreated/targetInfoChanged/targetDestroyed` events. */
  public setDiscoverTargets(params: Target.SetDiscoverTargetsParameters) {
    return this._client.send<void>("Target.setDiscoverTargets", params);
  }
  /** Enables target discovery for the specified locations, when `setDiscoverTargets` was set to
`true`. */
  public setRemoteLocations(params: Target.SetRemoteLocationsParameters) {
    return this._client.send<void>("Target.setRemoteLocations", params);
  }
  /** Issued when attached to target because of auto-attach or `attachToTarget` command. */
  get attachedToTarget() {
    return this._attachedToTarget;
  }
  set attachedToTarget(handler) {
    if (this._attachedToTarget) {
      this._client.removeListener("Target.attachedToTarget", this._attachedToTarget);
    }
    this._attachedToTarget = handler;
    if (handler) {
      this._client.on("Target.attachedToTarget", handler);
    }
  }
  /** Issued when detached from target for any reason (including `detachFromTarget` command). Can be
issued multiple times per target if multiple sessions have been attached to it. */
  get detachedFromTarget() {
    return this._detachedFromTarget;
  }
  set detachedFromTarget(handler) {
    if (this._detachedFromTarget) {
      this._client.removeListener("Target.detachedFromTarget", this._detachedFromTarget);
    }
    this._detachedFromTarget = handler;
    if (handler) {
      this._client.on("Target.detachedFromTarget", handler);
    }
  }
  /** Notifies about a new protocol message received from the session (as reported in
`attachedToTarget` event). */
  get receivedMessageFromTarget() {
    return this._receivedMessageFromTarget;
  }
  set receivedMessageFromTarget(handler) {
    if (this._receivedMessageFromTarget) {
      this._client.removeListener("Target.receivedMessageFromTarget", this._receivedMessageFromTarget);
    }
    this._receivedMessageFromTarget = handler;
    if (handler) {
      this._client.on("Target.receivedMessageFromTarget", handler);
    }
  }
  /** Issued when a possible inspection target is created. */
  get targetCreated() {
    return this._targetCreated;
  }
  set targetCreated(handler) {
    if (this._targetCreated) {
      this._client.removeListener("Target.targetCreated", this._targetCreated);
    }
    this._targetCreated = handler;
    if (handler) {
      this._client.on("Target.targetCreated", handler);
    }
  }
  /** Issued when a target is destroyed. */
  get targetDestroyed() {
    return this._targetDestroyed;
  }
  set targetDestroyed(handler) {
    if (this._targetDestroyed) {
      this._client.removeListener("Target.targetDestroyed", this._targetDestroyed);
    }
    this._targetDestroyed = handler;
    if (handler) {
      this._client.on("Target.targetDestroyed", handler);
    }
  }
  /** Issued when a target has crashed. */
  get targetCrashed() {
    return this._targetCrashed;
  }
  set targetCrashed(handler) {
    if (this._targetCrashed) {
      this._client.removeListener("Target.targetCrashed", this._targetCrashed);
    }
    this._targetCrashed = handler;
    if (handler) {
      this._client.on("Target.targetCrashed", handler);
    }
  }
  /** Issued when some information about a target has changed. This only happens between
`targetCreated` and `targetDestroyed`. */
  get targetInfoChanged() {
    return this._targetInfoChanged;
  }
  set targetInfoChanged(handler) {
    if (this._targetInfoChanged) {
      this._client.removeListener("Target.targetInfoChanged", this._targetInfoChanged);
    }
    this._targetInfoChanged = handler;
    if (handler) {
      this._client.on("Target.targetInfoChanged", handler);
    }
  }
}
export namespace Target {
  export type TargetID = string;
  /** Unique identifier of attached debugging session. */
  export type SessionID = string;
  export type BrowserContextID = string;
  export interface TargetInfo {
    targetId: TargetID;
    type: string;
    title: string;
    url: string;
    /** Whether the target has an attached client. */
    attached: boolean;
    /** Opener target Id */
    openerId?: TargetID;
    browserContextId?: BrowserContextID;
  }
  export interface RemoteLocation {
    host: string;
    port: number;
  }
  export type AttachedToTargetParameters = {
    /** Identifier assigned to the session used to send/receive messages. */
    sessionId: SessionID;
    targetInfo: TargetInfo;
    waitingForDebugger: boolean;
  };
  export type AttachedToTargetHandler = (params: AttachedToTargetParameters) => void;
  export type DetachedFromTargetParameters = {
    /** Detached session identifier. */
    sessionId: SessionID;
    /** Deprecated. */
    targetId?: TargetID;
  };
  export type DetachedFromTargetHandler = (params: DetachedFromTargetParameters) => void;
  export type ReceivedMessageFromTargetParameters = {
    /** Identifier of a session which sends a message. */
    sessionId: SessionID;
    message: string;
    /** Deprecated. */
    targetId?: TargetID;
  };
  export type ReceivedMessageFromTargetHandler = (params: ReceivedMessageFromTargetParameters) => void;
  export type TargetCreatedParameters = {
    targetInfo: TargetInfo;
  };
  export type TargetCreatedHandler = (params: TargetCreatedParameters) => void;
  export type TargetDestroyedParameters = {
    targetId: TargetID;
  };
  export type TargetDestroyedHandler = (params: TargetDestroyedParameters) => void;
  export type TargetCrashedParameters = {
    targetId: TargetID;
    /** Termination status type. */
    status: string;
    /** Termination error code. */
    errorCode: number;
  };
  export type TargetCrashedHandler = (params: TargetCrashedParameters) => void;
  export type TargetInfoChangedParameters = {
    targetInfo: TargetInfo;
  };
  export type TargetInfoChangedHandler = (params: TargetInfoChangedParameters) => void;
  export type ActivateTargetParameters = {
    targetId: TargetID;
  };
  export type AttachToTargetParameters = {
    targetId: TargetID;
    /** Enables "flat" access to the session via specifying sessionId attribute in the commands. */
    flatten?: boolean;
  };
  export type AttachToTargetReturn = {
    /** Id assigned to the session. */
    sessionId: SessionID;
  };
  export type AttachToBrowserTargetReturn = {
    /** Id assigned to the session. */
    sessionId: SessionID;
  };
  export type CloseTargetParameters = {
    targetId: TargetID;
  };
  export type CloseTargetReturn = {
    success: boolean;
  };
  export type ExposeDevToolsProtocolParameters = {
    targetId: TargetID;
    /** Binding name, 'cdp' if not specified. */
    bindingName?: string;
  };
  export type CreateBrowserContextReturn = {
    /** The id of the context created. */
    browserContextId: BrowserContextID;
  };
  export type GetBrowserContextsReturn = {
    /** An array of browser context ids. */
    browserContextIds: BrowserContextID[];
  };
  export type CreateTargetParameters = {
    /** The initial URL the page will be navigated to. */
    url: string;
    /** Frame width in DIP (headless chrome only). */
    width?: number;
    /** Frame height in DIP (headless chrome only). */
    height?: number;
    /** The browser context to create the page in. */
    browserContextId?: BrowserContextID;
    /** Whether BeginFrames for this target will be controlled via DevTools (headless chrome only,
not supported on MacOS yet, false by default). */
    enableBeginFrameControl?: boolean;
  };
  export type CreateTargetReturn = {
    /** The id of the page opened. */
    targetId: TargetID;
  };
  export type DetachFromTargetParameters = {
    /** Session to detach. */
    sessionId?: SessionID;
    /** Deprecated. */
    targetId?: TargetID;
  };
  export type DisposeBrowserContextParameters = {
    browserContextId: BrowserContextID;
  };
  export type GetTargetInfoParameters = {
    targetId?: TargetID;
  };
  export type GetTargetInfoReturn = {
    targetInfo: TargetInfo;
  };
  export type GetTargetsReturn = {
    /** The list of targets. */
    targetInfos: TargetInfo[];
  };
  export type SendMessageToTargetParameters = {
    message: string;
    /** Identifier of the session. */
    sessionId?: SessionID;
    /** Deprecated. */
    targetId?: TargetID;
  };
  export type SetAutoAttachParameters = {
    /** Whether to auto-attach to related targets. */
    autoAttach: boolean;
    /** Whether to pause new targets when attaching to them. Use `Runtime.runIfWaitingForDebugger`
to run paused targets. */
    waitForDebuggerOnStart: boolean;
    /** Enables "flat" access to the session via specifying sessionId attribute in the commands. */
    flatten?: boolean;
  };
  export type SetDiscoverTargetsParameters = {
    /** Whether to discover available targets. */
    discover: boolean;
  };
  export type SetRemoteLocationsParameters = {
    /** List of remote locations. */
    locations: RemoteLocation[];
  };
}
/** The Tethering domain defines methods and events for browser port binding. */
export class Tethering {
  private _accepted: Tethering.AcceptedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Request browser port binding. */
  public bind(params: Tethering.BindParameters) {
    return this._client.send<void>("Tethering.bind", params);
  }
  /** Request browser port unbinding. */
  public unbind(params: Tethering.UnbindParameters) {
    return this._client.send<void>("Tethering.unbind", params);
  }
  /** Informs that port was successfully bound and got a specified connection id. */
  get accepted() {
    return this._accepted;
  }
  set accepted(handler) {
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
  export type AcceptedParameters = {
    /** Port number that was successfully bound. */
    port: number;
    /** Connection id to be used. */
    connectionId: string;
  };
  export type AcceptedHandler = (params: AcceptedParameters) => void;
  export type BindParameters = {
    /** Port number to bind. */
    port: number;
  };
  export type UnbindParameters = {
    /** Port number to unbind. */
    port: number;
  };
}
export class Tracing {
  private _bufferUsage: Tracing.BufferUsageHandler | null = null;
  private _dataCollected: Tracing.DataCollectedHandler | null = null;
  private _tracingComplete: Tracing.TracingCompleteHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Stop trace events collection. */
  public end() {
    return this._client.send<void>("Tracing.end");
  }
  /** Gets supported tracing categories. */
  public getCategories() {
    return this._client.send<Tracing.GetCategoriesReturn>("Tracing.getCategories");
  }
  /** Record a clock sync marker in the trace. */
  public recordClockSyncMarker(params: Tracing.RecordClockSyncMarkerParameters) {
    return this._client.send<void>("Tracing.recordClockSyncMarker", params);
  }
  /** Request a global memory dump. */
  public requestMemoryDump() {
    return this._client.send<Tracing.RequestMemoryDumpReturn>("Tracing.requestMemoryDump");
  }
  /** Start trace events collection. */
  public start(params: Tracing.StartParameters) {
    return this._client.send<void>("Tracing.start", params);
  }
  get bufferUsage() {
    return this._bufferUsage;
  }
  set bufferUsage(handler) {
    if (this._bufferUsage) {
      this._client.removeListener("Tracing.bufferUsage", this._bufferUsage);
    }
    this._bufferUsage = handler;
    if (handler) {
      this._client.on("Tracing.bufferUsage", handler);
    }
  }
  /** Contains an bucket of collected trace events. When tracing is stopped collected events will be
send as a sequence of dataCollected events followed by tracingComplete event. */
  get dataCollected() {
    return this._dataCollected;
  }
  set dataCollected(handler) {
    if (this._dataCollected) {
      this._client.removeListener("Tracing.dataCollected", this._dataCollected);
    }
    this._dataCollected = handler;
    if (handler) {
      this._client.on("Tracing.dataCollected", handler);
    }
  }
  /** Signals that tracing is stopped and there is no trace buffers pending flush, all data were
delivered via dataCollected events. */
  get tracingComplete() {
    return this._tracingComplete;
  }
  set tracingComplete(handler) {
    if (this._tracingComplete) {
      this._client.removeListener("Tracing.tracingComplete", this._tracingComplete);
    }
    this._tracingComplete = handler;
    if (handler) {
      this._client.on("Tracing.tracingComplete", handler);
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
  /** Compression type to use for traces returned via streams. */
  export type StreamCompression = "none" | "gzip";
  export type BufferUsageParameters = {
    /** A number in range [0..1] that indicates the used size of event buffer as a fraction of its
total size. */
    percentFull?: number;
    /** An approximate number of events in the trace log. */
    eventCount?: number;
    /** A number in range [0..1] that indicates the used size of event buffer as a fraction of its
total size. */
    value?: number;
  };
  export type BufferUsageHandler = (params: BufferUsageParameters) => void;
  export type DataCollectedParameters = {
    value: any[];
  };
  export type DataCollectedHandler = (params: DataCollectedParameters) => void;
  export type TracingCompleteParameters = {
    /** A handle of the stream that holds resulting trace data. */
    stream?: IO.StreamHandle;
    /** Compression format of returned stream. */
    streamCompression?: StreamCompression;
  };
  export type TracingCompleteHandler = (params: TracingCompleteParameters) => void;
  export type GetCategoriesReturn = {
    /** A list of supported tracing categories. */
    categories: string[];
  };
  export type RecordClockSyncMarkerParameters = {
    /** The ID of this clock sync marker */
    syncId: string;
  };
  export type RequestMemoryDumpReturn = {
    /** GUID of the resulting global memory dump. */
    dumpGuid: string;
    /** True iff the global memory dump succeeded. */
    success: boolean;
  };
  export type StartParameters = {
    /** Category/tag filter */
    categories?: string;
    /** Tracing options */
    options?: string;
    /** If set, the agent will issue bufferUsage events at this interval, specified in milliseconds */
    bufferUsageReportingInterval?: number;
    /** Whether to report trace events as series of dataCollected events or to save trace to a
stream (defaults to `ReportEvents`). */
    transferMode?: "ReportEvents" | "ReturnAsStream";
    /** Compression format to use. This only applies when using `ReturnAsStream`
transfer mode (defaults to `none`) */
    streamCompression?: StreamCompression;
    traceConfig?: TraceConfig;
  };
}
/** This domain is deprecated - use Runtime or Log instead. */
export class Console {
  private _messageAdded: Console.MessageAddedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Does nothing. */
  public clearMessages() {
    return this._client.send<void>("Console.clearMessages");
  }
  /** Disables console domain, prevents further console messages from being reported to the client. */
  public disable() {
    return this._client.send<void>("Console.disable");
  }
  /** Enables console domain, sends the messages collected so far to the client by means of the
`messageAdded` notification. */
  public enable() {
    return this._client.send<void>("Console.enable");
  }
  /** Issued when new console message is added. */
  get messageAdded() {
    return this._messageAdded;
  }
  set messageAdded(handler) {
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
  export type MessageAddedParameters = {
    /** Console message that has been added. */
    message: ConsoleMessage;
  };
  export type MessageAddedHandler = (params: MessageAddedParameters) => void;
}
/** Debugger domain exposes JavaScript debugging capabilities. It allows setting and removing
breakpoints, stepping through execution, exploring stack traces, etc. */
export class Debugger {
  private _breakpointResolved: Debugger.BreakpointResolvedHandler | null = null;
  private _paused: Debugger.PausedHandler | null = null;
  private _resumed: Debugger.ResumedHandler | null = null;
  private _scriptFailedToParse: Debugger.ScriptFailedToParseHandler | null = null;
  private _scriptParsed: Debugger.ScriptParsedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Continues execution until specific location is reached. */
  public continueToLocation(params: Debugger.ContinueToLocationParameters) {
    return this._client.send<void>("Debugger.continueToLocation", params);
  }
  /** Disables debugger for given page. */
  public disable() {
    return this._client.send<void>("Debugger.disable");
  }
  /** Enables debugger for the given page. Clients should not assume that the debugging has been
enabled until the result for this command is received. */
  public enable() {
    return this._client.send<Debugger.EnableReturn>("Debugger.enable");
  }
  /** Evaluates expression on a given call frame. */
  public evaluateOnCallFrame(params: Debugger.EvaluateOnCallFrameParameters) {
    return this._client.send<Debugger.EvaluateOnCallFrameReturn>("Debugger.evaluateOnCallFrame", params);
  }
  /** Returns possible locations for breakpoint. scriptId in start and end range locations should be
the same. */
  public getPossibleBreakpoints(params: Debugger.GetPossibleBreakpointsParameters) {
    return this._client.send<Debugger.GetPossibleBreakpointsReturn>("Debugger.getPossibleBreakpoints", params);
  }
  /** Returns source for the script with given id. */
  public getScriptSource(params: Debugger.GetScriptSourceParameters) {
    return this._client.send<Debugger.GetScriptSourceReturn>("Debugger.getScriptSource", params);
  }
  /** Returns stack trace with given `stackTraceId`. */
  public getStackTrace(params: Debugger.GetStackTraceParameters) {
    return this._client.send<Debugger.GetStackTraceReturn>("Debugger.getStackTrace", params);
  }
  /** Stops on the next JavaScript statement. */
  public pause() {
    return this._client.send<void>("Debugger.pause");
  }
  public pauseOnAsyncCall(params: Debugger.PauseOnAsyncCallParameters) {
    return this._client.send<void>("Debugger.pauseOnAsyncCall", params);
  }
  /** Removes JavaScript breakpoint. */
  public removeBreakpoint(params: Debugger.RemoveBreakpointParameters) {
    return this._client.send<void>("Debugger.removeBreakpoint", params);
  }
  /** Restarts particular call frame from the beginning. */
  public restartFrame(params: Debugger.RestartFrameParameters) {
    return this._client.send<Debugger.RestartFrameReturn>("Debugger.restartFrame", params);
  }
  /** Resumes JavaScript execution. */
  public resume() {
    return this._client.send<void>("Debugger.resume");
  }
  /** This method is deprecated - use Debugger.stepInto with breakOnAsyncCall and
Debugger.pauseOnAsyncTask instead. Steps into next scheduled async task if any is scheduled
before next pause. Returns success when async task is actually scheduled, returns error if no
task were scheduled or another scheduleStepIntoAsync was called. */
  public scheduleStepIntoAsync() {
    return this._client.send<void>("Debugger.scheduleStepIntoAsync");
  }
  /** Searches for given string in script content. */
  public searchInContent(params: Debugger.SearchInContentParameters) {
    return this._client.send<Debugger.SearchInContentReturn>("Debugger.searchInContent", params);
  }
  /** Enables or disables async call stacks tracking. */
  public setAsyncCallStackDepth(params: Debugger.SetAsyncCallStackDepthParameters) {
    return this._client.send<void>("Debugger.setAsyncCallStackDepth", params);
  }
  /** Replace previous blackbox patterns with passed ones. Forces backend to skip stepping/pausing in
scripts with url matching one of the patterns. VM will try to leave blackboxed script by
performing 'step in' several times, finally resorting to 'step out' if unsuccessful. */
  public setBlackboxPatterns(params: Debugger.SetBlackboxPatternsParameters) {
    return this._client.send<void>("Debugger.setBlackboxPatterns", params);
  }
  /** Makes backend skip steps in the script in blackboxed ranges. VM will try leave blacklisted
scripts by performing 'step in' several times, finally resorting to 'step out' if unsuccessful.
Positions array contains positions where blackbox state is changed. First interval isn't
blackboxed. Array should be sorted. */
  public setBlackboxedRanges(params: Debugger.SetBlackboxedRangesParameters) {
    return this._client.send<void>("Debugger.setBlackboxedRanges", params);
  }
  /** Sets JavaScript breakpoint at a given location. */
  public setBreakpoint(params: Debugger.SetBreakpointParameters) {
    return this._client.send<Debugger.SetBreakpointReturn>("Debugger.setBreakpoint", params);
  }
  /** Sets JavaScript breakpoint at given location specified either by URL or URL regex. Once this
command is issued, all existing parsed scripts will have breakpoints resolved and returned in
`locations` property. Further matching script parsing will result in subsequent
`breakpointResolved` events issued. This logical breakpoint will survive page reloads. */
  public setBreakpointByUrl(params: Debugger.SetBreakpointByUrlParameters) {
    return this._client.send<Debugger.SetBreakpointByUrlReturn>("Debugger.setBreakpointByUrl", params);
  }
  /** Sets JavaScript breakpoint before each call to the given function.
If another function was created from the same source as a given one,
calling it will also trigger the breakpoint. */
  public setBreakpointOnFunctionCall(params: Debugger.SetBreakpointOnFunctionCallParameters) {
    return this._client.send<Debugger.SetBreakpointOnFunctionCallReturn>("Debugger.setBreakpointOnFunctionCall", params);
  }
  /** Activates / deactivates all breakpoints on the page. */
  public setBreakpointsActive(params: Debugger.SetBreakpointsActiveParameters) {
    return this._client.send<void>("Debugger.setBreakpointsActive", params);
  }
  /** Defines pause on exceptions state. Can be set to stop on all exceptions, uncaught exceptions or
no exceptions. Initial pause on exceptions state is `none`. */
  public setPauseOnExceptions(params: Debugger.SetPauseOnExceptionsParameters) {
    return this._client.send<void>("Debugger.setPauseOnExceptions", params);
  }
  /** Changes return value in top frame. Available only at return break position. */
  public setReturnValue(params: Debugger.SetReturnValueParameters) {
    return this._client.send<void>("Debugger.setReturnValue", params);
  }
  /** Edits JavaScript source live. */
  public setScriptSource(params: Debugger.SetScriptSourceParameters) {
    return this._client.send<Debugger.SetScriptSourceReturn>("Debugger.setScriptSource", params);
  }
  /** Makes page not interrupt on any pauses (breakpoint, exception, dom exception etc). */
  public setSkipAllPauses(params: Debugger.SetSkipAllPausesParameters) {
    return this._client.send<void>("Debugger.setSkipAllPauses", params);
  }
  /** Changes value of variable in a callframe. Object-based scopes are not supported and must be
mutated manually. */
  public setVariableValue(params: Debugger.SetVariableValueParameters) {
    return this._client.send<void>("Debugger.setVariableValue", params);
  }
  /** Steps into the function call. */
  public stepInto(params: Debugger.StepIntoParameters) {
    return this._client.send<void>("Debugger.stepInto", params);
  }
  /** Steps out of the function call. */
  public stepOut() {
    return this._client.send<void>("Debugger.stepOut");
  }
  /** Steps over the statement. */
  public stepOver() {
    return this._client.send<void>("Debugger.stepOver");
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
  /** Fired when virtual machine parses script. This event is also fired for all known and uncollected
scripts upon enabling debugger. */
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
}
export namespace Debugger {
  /** Breakpoint identifier. */
  export type BreakpointId = string;
  /** Call frame identifier. */
  export type CallFrameId = string;
  /** Location in the source code. */
  export interface Location {
    /** Script identifier as reported in the `Debugger.scriptParsed`. */
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
    /** JavaScript script name or url. */
    url: string;
    /** Scope chain for this call frame. */
    scopeChain: Scope[];
    /** `this` object for this call frame. */
    this: Runtime.RemoteObject;
    /** The value being returned, if the function is at return point. */
    returnValue?: Runtime.RemoteObject;
  }
  /** Scope description. */
  export interface Scope {
    /** Scope type. */
    type: "global" | "local" | "with" | "closure" | "catch" | "block" | "script" | "eval" | "module";
    /** Object representing the scope. For `global` and `with` scopes it represents the actual
object; for the rest of the scopes, it is artificial transient object enumerating scope
variables as its properties. */
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
    /** Script identifier as reported in the `Debugger.scriptParsed`. */
    scriptId: Runtime.ScriptId;
    /** Line number in the script (0-based). */
    lineNumber: number;
    /** Column number in the script (0-based). */
    columnNumber?: number;
    type?: "debuggerStatement" | "call" | "return";
  }
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
    reason: "XHR" | "DOM" | "EventListener" | "exception" | "assert" | "debugCommand" | "promiseRejection" | "OOM" | "other" | "ambiguous";
    /** Object containing break-specific auxiliary properties. */
    data?: any;
    /** Hit breakpoints IDs */
    hitBreakpoints?: string[];
    /** Async stack trace, if any. */
    asyncStackTrace?: Runtime.StackTrace;
    /** Async stack trace, if any. */
    asyncStackTraceId?: Runtime.StackTraceId;
    /** Just scheduled async call will have this stack trace as parent stack during async execution.
This field is available only after `Debugger.stepInto` call with `breakOnAsynCall` flag. */
    asyncCallStackTraceId?: Runtime.StackTraceId;
  };
  export type PausedHandler = (params: PausedParameters) => void;
  export type ResumedHandler = () => void;
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
    /** True, if this script is ES6 module. */
    isModule?: boolean;
    /** This script length. */
    length?: number;
    /** JavaScript top stack frame of where the script parsed event was triggered if available. */
    stackTrace?: Runtime.StackTrace;
  };
  export type ScriptFailedToParseHandler = (params: ScriptFailedToParseParameters) => void;
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
    /** True, if this script is ES6 module. */
    isModule?: boolean;
    /** This script length. */
    length?: number;
    /** JavaScript top stack frame of where the script parsed event was triggered if available. */
    stackTrace?: Runtime.StackTrace;
  };
  export type ScriptParsedHandler = (params: ScriptParsedParameters) => void;
  export type ContinueToLocationParameters = {
    /** Location to continue to. */
    location: Location;
    targetCallFrames?: "any" | "current";
  };
  export type EnableReturn = {
    /** Unique identifier of the debugger. */
    debuggerId: Runtime.UniqueDebuggerId;
  };
  export type EvaluateOnCallFrameParameters = {
    /** Call frame identifier to evaluate on. */
    callFrameId: CallFrameId;
    /** Expression to evaluate. */
    expression: string;
    /** String object group name to put result into (allows rapid releasing resulting object handles
using `releaseObjectGroup`). */
    objectGroup?: string;
    /** Specifies whether command line API should be available to the evaluated expression, defaults
to false. */
    includeCommandLineAPI?: boolean;
    /** In silent mode exceptions thrown during evaluation are not reported and do not pause
execution. Overrides `setPauseOnException` state. */
    silent?: boolean;
    /** Whether the result is expected to be a JSON object that should be sent by value. */
    returnByValue?: boolean;
    /** Whether preview should be generated for the result. */
    generatePreview?: boolean;
    /** Whether to throw an exception if side effect cannot be ruled out during evaluation. */
    throwOnSideEffect?: boolean;
    /** Terminate execution after timing out (number of milliseconds). */
    timeout?: Runtime.TimeDelta;
  };
  export type EvaluateOnCallFrameReturn = {
    /** Object wrapper for the evaluation result. */
    result: Runtime.RemoteObject;
    /** Exception details. */
    exceptionDetails?: Runtime.ExceptionDetails;
  };
  export type GetPossibleBreakpointsParameters = {
    /** Start of range to search possible breakpoint locations in. */
    start: Location;
    /** End of range to search possible breakpoint locations in (excluding). When not specified, end
of scripts is used as end of range. */
    end?: Location;
    /** Only consider locations which are in the same (non-nested) function as start. */
    restrictToFunction?: boolean;
  };
  export type GetPossibleBreakpointsReturn = {
    /** List of the possible breakpoint locations. */
    locations: BreakLocation[];
  };
  export type GetScriptSourceParameters = {
    /** Id of the script to get source for. */
    scriptId: Runtime.ScriptId;
  };
  export type GetScriptSourceReturn = {
    /** Script source. */
    scriptSource: string;
  };
  export type GetStackTraceParameters = {
    stackTraceId: Runtime.StackTraceId;
  };
  export type GetStackTraceReturn = {
    stackTrace: Runtime.StackTrace;
  };
  export type PauseOnAsyncCallParameters = {
    /** Debugger will pause when async call with given stack trace is started. */
    parentStackTraceId: Runtime.StackTraceId;
  };
  export type RemoveBreakpointParameters = {
    breakpointId: BreakpointId;
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
    /** Async stack trace, if any. */
    asyncStackTraceId?: Runtime.StackTraceId;
  };
  export type SearchInContentParameters = {
    /** Id of the script to search in. */
    scriptId: Runtime.ScriptId;
    /** String to search for. */
    query: string;
    /** If true, search is case sensitive. */
    caseSensitive?: boolean;
    /** If true, treats string parameter as regex. */
    isRegex?: boolean;
  };
  export type SearchInContentReturn = {
    /** List of search matches. */
    result: SearchMatch[];
  };
  export type SetAsyncCallStackDepthParameters = {
    /** Maximum depth of async call stacks. Setting to `0` will effectively disable collecting async
call stacks (default). */
    maxDepth: number;
  };
  export type SetBlackboxPatternsParameters = {
    /** Array of regexps that will be used to check script url for blackbox state. */
    patterns: string[];
  };
  export type SetBlackboxedRangesParameters = {
    /** Id of the script. */
    scriptId: Runtime.ScriptId;
    positions: ScriptPosition[];
  };
  export type SetBreakpointParameters = {
    /** Location to set breakpoint in. */
    location: Location;
    /** Expression to use as a breakpoint condition. When specified, debugger will only stop on the
breakpoint if this expression evaluates to true. */
    condition?: string;
  };
  export type SetBreakpointReturn = {
    /** Id of the created breakpoint for further reference. */
    breakpointId: BreakpointId;
    /** Location this breakpoint resolved into. */
    actualLocation: Location;
  };
  export type SetBreakpointByUrlParameters = {
    /** Line number to set breakpoint at. */
    lineNumber: number;
    /** URL of the resources to set breakpoint on. */
    url?: string;
    /** Regex pattern for the URLs of the resources to set breakpoints on. Either `url` or
`urlRegex` must be specified. */
    urlRegex?: string;
    /** Script hash of the resources to set breakpoint on. */
    scriptHash?: string;
    /** Offset in the line to set breakpoint at. */
    columnNumber?: number;
    /** Expression to use as a breakpoint condition. When specified, debugger will only stop on the
breakpoint if this expression evaluates to true. */
    condition?: string;
  };
  export type SetBreakpointByUrlReturn = {
    /** Id of the created breakpoint for further reference. */
    breakpointId: BreakpointId;
    /** List of the locations this breakpoint resolved into upon addition. */
    locations: Location[];
  };
  export type SetBreakpointOnFunctionCallParameters = {
    /** Function object id. */
    objectId: Runtime.RemoteObjectId;
    /** Expression to use as a breakpoint condition. When specified, debugger will
stop on the breakpoint if this expression evaluates to true. */
    condition?: string;
  };
  export type SetBreakpointOnFunctionCallReturn = {
    /** Id of the created breakpoint for further reference. */
    breakpointId: BreakpointId;
  };
  export type SetBreakpointsActiveParameters = {
    /** New value for breakpoints active state. */
    active: boolean;
  };
  export type SetPauseOnExceptionsParameters = {
    /** Pause on exceptions mode. */
    state: "none" | "uncaught" | "all";
  };
  export type SetReturnValueParameters = {
    /** New return value. */
    newValue: Runtime.CallArgument;
  };
  export type SetScriptSourceParameters = {
    /** Id of the script to edit. */
    scriptId: Runtime.ScriptId;
    /** New content of the script. */
    scriptSource: string;
    /** If true the change will not actually be applied. Dry run may be used to get result
description without actually modifying the code. */
    dryRun?: boolean;
  };
  export type SetScriptSourceReturn = {
    /** New stack trace in case editing has happened while VM was stopped. */
    callFrames?: CallFrame[];
    /** Whether current call stack  was modified after applying the changes. */
    stackChanged?: boolean;
    /** Async stack trace, if any. */
    asyncStackTrace?: Runtime.StackTrace;
    /** Async stack trace, if any. */
    asyncStackTraceId?: Runtime.StackTraceId;
    /** Exception details if any. */
    exceptionDetails?: Runtime.ExceptionDetails;
  };
  export type SetSkipAllPausesParameters = {
    /** New value for skip pauses state. */
    skip: boolean;
  };
  export type SetVariableValueParameters = {
    /** 0-based number of scope as was listed in scope chain. Only 'local', 'closure' and 'catch'
scope types are allowed. Other scopes could be manipulated manually. */
    scopeNumber: number;
    /** Variable name. */
    variableName: string;
    /** New variable value. */
    newValue: Runtime.CallArgument;
    /** Id of callframe that holds variable. */
    callFrameId: CallFrameId;
  };
  export type StepIntoParameters = {
    /** Debugger will issue additional Debugger.paused notification if any async task is scheduled
before next pause. */
    breakOnAsyncCall?: boolean;
  };
}
export class HeapProfiler {
  private _addHeapSnapshotChunk: HeapProfiler.AddHeapSnapshotChunkHandler | null = null;
  private _heapStatsUpdate: HeapProfiler.HeapStatsUpdateHandler | null = null;
  private _lastSeenObjectId: HeapProfiler.LastSeenObjectIdHandler | null = null;
  private _reportHeapSnapshotProgress: HeapProfiler.ReportHeapSnapshotProgressHandler | null = null;
  private _resetProfiles: HeapProfiler.ResetProfilesHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Enables console to refer to the node with given id via $x (see Command Line API for more details
$x functions). */
  public addInspectedHeapObject(params: HeapProfiler.AddInspectedHeapObjectParameters) {
    return this._client.send<void>("HeapProfiler.addInspectedHeapObject", params);
  }
  public collectGarbage() {
    return this._client.send<void>("HeapProfiler.collectGarbage");
  }
  public disable() {
    return this._client.send<void>("HeapProfiler.disable");
  }
  public enable() {
    return this._client.send<void>("HeapProfiler.enable");
  }
  public getHeapObjectId(params: HeapProfiler.GetHeapObjectIdParameters) {
    return this._client.send<HeapProfiler.GetHeapObjectIdReturn>("HeapProfiler.getHeapObjectId", params);
  }
  public getObjectByHeapObjectId(params: HeapProfiler.GetObjectByHeapObjectIdParameters) {
    return this._client.send<HeapProfiler.GetObjectByHeapObjectIdReturn>("HeapProfiler.getObjectByHeapObjectId", params);
  }
  public getSamplingProfile() {
    return this._client.send<HeapProfiler.GetSamplingProfileReturn>("HeapProfiler.getSamplingProfile");
  }
  public startSampling(params: HeapProfiler.StartSamplingParameters) {
    return this._client.send<void>("HeapProfiler.startSampling", params);
  }
  public startTrackingHeapObjects(params: HeapProfiler.StartTrackingHeapObjectsParameters) {
    return this._client.send<void>("HeapProfiler.startTrackingHeapObjects", params);
  }
  public stopSampling() {
    return this._client.send<HeapProfiler.StopSamplingReturn>("HeapProfiler.stopSampling");
  }
  public stopTrackingHeapObjects(params: HeapProfiler.StopTrackingHeapObjectsParameters) {
    return this._client.send<void>("HeapProfiler.stopTrackingHeapObjects", params);
  }
  public takeHeapSnapshot(params: HeapProfiler.TakeHeapSnapshotParameters) {
    return this._client.send<void>("HeapProfiler.takeHeapSnapshot", params);
  }
  get addHeapSnapshotChunk() {
    return this._addHeapSnapshotChunk;
  }
  set addHeapSnapshotChunk(handler) {
    if (this._addHeapSnapshotChunk) {
      this._client.removeListener("HeapProfiler.addHeapSnapshotChunk", this._addHeapSnapshotChunk);
    }
    this._addHeapSnapshotChunk = handler;
    if (handler) {
      this._client.on("HeapProfiler.addHeapSnapshotChunk", handler);
    }
  }
  /** If heap objects tracking has been started then backend may send update for one or more fragments */
  get heapStatsUpdate() {
    return this._heapStatsUpdate;
  }
  set heapStatsUpdate(handler) {
    if (this._heapStatsUpdate) {
      this._client.removeListener("HeapProfiler.heapStatsUpdate", this._heapStatsUpdate);
    }
    this._heapStatsUpdate = handler;
    if (handler) {
      this._client.on("HeapProfiler.heapStatsUpdate", handler);
    }
  }
  /** If heap objects tracking has been started then backend regularly sends a current value for last
seen object id and corresponding timestamp. If the were changes in the heap since last event
then one or more heapStatsUpdate events will be sent before a new lastSeenObjectId event. */
  get lastSeenObjectId() {
    return this._lastSeenObjectId;
  }
  set lastSeenObjectId(handler) {
    if (this._lastSeenObjectId) {
      this._client.removeListener("HeapProfiler.lastSeenObjectId", this._lastSeenObjectId);
    }
    this._lastSeenObjectId = handler;
    if (handler) {
      this._client.on("HeapProfiler.lastSeenObjectId", handler);
    }
  }
  get reportHeapSnapshotProgress() {
    return this._reportHeapSnapshotProgress;
  }
  set reportHeapSnapshotProgress(handler) {
    if (this._reportHeapSnapshotProgress) {
      this._client.removeListener("HeapProfiler.reportHeapSnapshotProgress", this._reportHeapSnapshotProgress);
    }
    this._reportHeapSnapshotProgress = handler;
    if (handler) {
      this._client.on("HeapProfiler.reportHeapSnapshotProgress", handler);
    }
  }
  get resetProfiles() {
    return this._resetProfiles;
  }
  set resetProfiles(handler) {
    if (this._resetProfiles) {
      this._client.removeListener("HeapProfiler.resetProfiles", this._resetProfiles);
    }
    this._resetProfiles = handler;
    if (handler) {
      this._client.on("HeapProfiler.resetProfiles", handler);
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
  export type AddHeapSnapshotChunkParameters = {
    chunk: string;
  };
  export type AddHeapSnapshotChunkHandler = (params: AddHeapSnapshotChunkParameters) => void;
  export type HeapStatsUpdateParameters = {
    /** An array of triplets. Each triplet describes a fragment. The first integer is the fragment
index, the second integer is a total count of objects for the fragment, the third integer is
a total size of the objects for the fragment. */
    statsUpdate: number[];
  };
  export type HeapStatsUpdateHandler = (params: HeapStatsUpdateParameters) => void;
  export type LastSeenObjectIdParameters = {
    lastSeenObjectId: number;
    timestamp: number;
  };
  export type LastSeenObjectIdHandler = (params: LastSeenObjectIdParameters) => void;
  export type ReportHeapSnapshotProgressParameters = {
    done: number;
    total: number;
    finished?: boolean;
  };
  export type ReportHeapSnapshotProgressHandler = (params: ReportHeapSnapshotProgressParameters) => void;
  export type ResetProfilesHandler = () => void;
  export type AddInspectedHeapObjectParameters = {
    /** Heap snapshot object id to be accessible by means of $x command line API. */
    heapObjectId: HeapSnapshotObjectId;
  };
  export type GetHeapObjectIdParameters = {
    /** Identifier of the object to get heap object id for. */
    objectId: Runtime.RemoteObjectId;
  };
  export type GetHeapObjectIdReturn = {
    /** Id of the heap snapshot object corresponding to the passed remote object id. */
    heapSnapshotObjectId: HeapSnapshotObjectId;
  };
  export type GetObjectByHeapObjectIdParameters = {
    objectId: HeapSnapshotObjectId;
    /** Symbolic group name that can be used to release multiple objects. */
    objectGroup?: string;
  };
  export type GetObjectByHeapObjectIdReturn = {
    /** Evaluation result. */
    result: Runtime.RemoteObject;
  };
  export type GetSamplingProfileReturn = {
    /** Return the sampling profile being collected. */
    profile: SamplingHeapProfile;
  };
  export type StartSamplingParameters = {
    /** Average sample interval in bytes. Poisson distribution is used for the intervals. The
default value is 32768 bytes. */
    samplingInterval?: number;
  };
  export type StartTrackingHeapObjectsParameters = {
    trackAllocations?: boolean;
  };
  export type StopSamplingReturn = {
    /** Recorded sampling heap profile. */
    profile: SamplingHeapProfile;
  };
  export type StopTrackingHeapObjectsParameters = {
    /** If true 'reportHeapSnapshotProgress' events will be generated while snapshot is being taken
when the tracking is stopped. */
    reportProgress?: boolean;
  };
  export type TakeHeapSnapshotParameters = {
    /** If true 'reportHeapSnapshotProgress' events will be generated while snapshot is being taken. */
    reportProgress?: boolean;
  };
}
export class Profiler {
  private _consoleProfileFinished: Profiler.ConsoleProfileFinishedHandler | null = null;
  private _consoleProfileStarted: Profiler.ConsoleProfileStartedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  public disable() {
    return this._client.send<void>("Profiler.disable");
  }
  public enable() {
    return this._client.send<void>("Profiler.enable");
  }
  /** Collect coverage data for the current isolate. The coverage data may be incomplete due to
garbage collection. */
  public getBestEffortCoverage() {
    return this._client.send<Profiler.GetBestEffortCoverageReturn>("Profiler.getBestEffortCoverage");
  }
  /** Changes CPU profiler sampling interval. Must be called before CPU profiles recording started. */
  public setSamplingInterval(params: Profiler.SetSamplingIntervalParameters) {
    return this._client.send<void>("Profiler.setSamplingInterval", params);
  }
  public start() {
    return this._client.send<void>("Profiler.start");
  }
  /** Enable precise code coverage. Coverage data for JavaScript executed before enabling precise code
coverage may be incomplete. Enabling prevents running optimized code and resets execution
counters. */
  public startPreciseCoverage(params: Profiler.StartPreciseCoverageParameters) {
    return this._client.send<void>("Profiler.startPreciseCoverage", params);
  }
  /** Enable type profile. */
  public startTypeProfile() {
    return this._client.send<void>("Profiler.startTypeProfile");
  }
  public stop() {
    return this._client.send<Profiler.StopReturn>("Profiler.stop");
  }
  /** Disable precise code coverage. Disabling releases unnecessary execution count records and allows
executing optimized code. */
  public stopPreciseCoverage() {
    return this._client.send<void>("Profiler.stopPreciseCoverage");
  }
  /** Disable type profile. Disabling releases type profile data collected so far. */
  public stopTypeProfile() {
    return this._client.send<void>("Profiler.stopTypeProfile");
  }
  /** Collect coverage data for the current isolate, and resets execution counters. Precise code
coverage needs to have started. */
  public takePreciseCoverage() {
    return this._client.send<Profiler.TakePreciseCoverageReturn>("Profiler.takePreciseCoverage");
  }
  /** Collect type profile. */
  public takeTypeProfile() {
    return this._client.send<Profiler.TakeTypeProfileReturn>("Profiler.takeTypeProfile");
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
  /** Sent when new profile recording is started using console.profile() call. */
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
    /** The reason of being not optimized. The function may be deoptimized or marked as don't
optimize. */
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
    /** Time intervals between adjacent samples in microseconds. The first delta is relative to the
profile startTime. */
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
    /** Whether coverage data for this function has block granularity. */
    isBlockCoverage: boolean;
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
  /** Describes a type collected during runtime. */
  export interface TypeObject {
    /** Name of a type collected with type profiling. */
    name: string;
  }
  /** Source offset and types for a parameter or return value. */
  export interface TypeProfileEntry {
    /** Source offset of the parameter or end of function for return values. */
    offset: number;
    /** The types for this parameter or return value. */
    types: TypeObject[];
  }
  /** Type profile data collected during runtime for a JavaScript script. */
  export interface ScriptTypeProfile {
    /** JavaScript script id. */
    scriptId: Runtime.ScriptId;
    /** JavaScript script name or url. */
    url: string;
    /** Type profile entries for parameters and return values of the functions in the script. */
    entries: TypeProfileEntry[];
  }
  export type ConsoleProfileFinishedParameters = {
    id: string;
    /** Location of console.profileEnd(). */
    location: Debugger.Location;
    profile: Profile;
    /** Profile title passed as an argument to console.profile(). */
    title?: string;
  };
  export type ConsoleProfileFinishedHandler = (params: ConsoleProfileFinishedParameters) => void;
  export type ConsoleProfileStartedParameters = {
    id: string;
    /** Location of console.profile(). */
    location: Debugger.Location;
    /** Profile title passed as an argument to console.profile(). */
    title?: string;
  };
  export type ConsoleProfileStartedHandler = (params: ConsoleProfileStartedParameters) => void;
  export type GetBestEffortCoverageReturn = {
    /** Coverage data for the current isolate. */
    result: ScriptCoverage[];
  };
  export type SetSamplingIntervalParameters = {
    /** New sampling interval in microseconds. */
    interval: number;
  };
  export type StartPreciseCoverageParameters = {
    /** Collect accurate call counts beyond simple 'covered' or 'not covered'. */
    callCount?: boolean;
    /** Collect block-based coverage. */
    detailed?: boolean;
  };
  export type StopReturn = {
    /** Recorded profile. */
    profile: Profile;
  };
  export type TakePreciseCoverageReturn = {
    /** Coverage data for the current isolate. */
    result: ScriptCoverage[];
  };
  export type TakeTypeProfileReturn = {
    /** Type profile for all scripts since startTypeProfile() was turned on. */
    result: ScriptTypeProfile[];
  };
}
/** Runtime domain exposes JavaScript runtime by means of remote evaluation and mirror objects.
Evaluation results are returned as mirror object that expose object type, string representation
and unique identifier that can be used for further object reference. Original objects are
maintained in memory unless they are either explicitly released or are released along with the
other objects in their object group. */
export class Runtime {
  private _bindingCalled: Runtime.BindingCalledHandler | null = null;
  private _consoleAPICalled: Runtime.ConsoleAPICalledHandler | null = null;
  private _exceptionRevoked: Runtime.ExceptionRevokedHandler | null = null;
  private _exceptionThrown: Runtime.ExceptionThrownHandler | null = null;
  private _executionContextCreated: Runtime.ExecutionContextCreatedHandler | null = null;
  private _executionContextDestroyed: Runtime.ExecutionContextDestroyedHandler | null = null;
  private _executionContextsCleared: Runtime.ExecutionContextsClearedHandler | null = null;
  private _inspectRequested: Runtime.InspectRequestedHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
  }
  /** Add handler to promise with given promise object id. */
  public awaitPromise(params: Runtime.AwaitPromiseParameters) {
    return this._client.send<Runtime.AwaitPromiseReturn>("Runtime.awaitPromise", params);
  }
  /** Calls function with given declaration on the given object. Object group of the result is
inherited from the target object. */
  public callFunctionOn(params: Runtime.CallFunctionOnParameters) {
    return this._client.send<Runtime.CallFunctionOnReturn>("Runtime.callFunctionOn", params);
  }
  /** Compiles expression. */
  public compileScript(params: Runtime.CompileScriptParameters) {
    return this._client.send<Runtime.CompileScriptReturn>("Runtime.compileScript", params);
  }
  /** Disables reporting of execution contexts creation. */
  public disable() {
    return this._client.send<void>("Runtime.disable");
  }
  /** Discards collected exceptions and console API calls. */
  public discardConsoleEntries() {
    return this._client.send<void>("Runtime.discardConsoleEntries");
  }
  /** Enables reporting of execution contexts creation by means of `executionContextCreated` event.
When the reporting gets enabled the event will be sent immediately for each existing execution
context. */
  public enable() {
    return this._client.send<void>("Runtime.enable");
  }
  /** Evaluates expression on global object. */
  public evaluate(params: Runtime.EvaluateParameters) {
    return this._client.send<Runtime.EvaluateReturn>("Runtime.evaluate", params);
  }
  /** Returns the isolate id. */
  public getIsolateId() {
    return this._client.send<Runtime.GetIsolateIdReturn>("Runtime.getIsolateId");
  }
  /** Returns the JavaScript heap usage.
It is the total usage of the corresponding isolate not scoped to a particular Runtime. */
  public getHeapUsage() {
    return this._client.send<Runtime.GetHeapUsageReturn>("Runtime.getHeapUsage");
  }
  /** Returns properties of a given object. Object group of the result is inherited from the target
object. */
  public getProperties(params: Runtime.GetPropertiesParameters) {
    return this._client.send<Runtime.GetPropertiesReturn>("Runtime.getProperties", params);
  }
  /** Returns all let, const and class variables from global scope. */
  public globalLexicalScopeNames(params: Runtime.GlobalLexicalScopeNamesParameters) {
    return this._client.send<Runtime.GlobalLexicalScopeNamesReturn>("Runtime.globalLexicalScopeNames", params);
  }
  public queryObjects(params: Runtime.QueryObjectsParameters) {
    return this._client.send<Runtime.QueryObjectsReturn>("Runtime.queryObjects", params);
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
  /** Runs script with given id in a given context. */
  public runScript(params: Runtime.RunScriptParameters) {
    return this._client.send<Runtime.RunScriptReturn>("Runtime.runScript", params);
  }
  /** Enables or disables async call stacks tracking. */
  public setAsyncCallStackDepth(params: Runtime.SetAsyncCallStackDepthParameters) {
    return this._client.send<void>("Runtime.setAsyncCallStackDepth", params);
  }
  public setCustomObjectFormatterEnabled(params: Runtime.SetCustomObjectFormatterEnabledParameters) {
    return this._client.send<void>("Runtime.setCustomObjectFormatterEnabled", params);
  }
  public setMaxCallStackSizeToCapture(params: Runtime.SetMaxCallStackSizeToCaptureParameters) {
    return this._client.send<void>("Runtime.setMaxCallStackSizeToCapture", params);
  }
  /** Terminate current or next JavaScript execution.
Will cancel the termination when the outer-most script execution ends. */
  public terminateExecution() {
    return this._client.send<void>("Runtime.terminateExecution");
  }
  /** If executionContextId is empty, adds binding with the given name on the
global objects of all inspected contexts, including those created later,
bindings survive reloads.
If executionContextId is specified, adds binding only on global object of
given execution context.
Binding function takes exactly one argument, this argument should be string,
in case of any other input, function throws an exception.
Each binding function call produces Runtime.bindingCalled notification. */
  public addBinding(params: Runtime.AddBindingParameters) {
    return this._client.send<void>("Runtime.addBinding", params);
  }
  /** This method does not remove binding function from global object but
unsubscribes current runtime agent from Runtime.bindingCalled notifications. */
  public removeBinding(params: Runtime.RemoveBindingParameters) {
    return this._client.send<void>("Runtime.removeBinding", params);
  }
  /** Notification is issued every time when binding is called. */
  get bindingCalled() {
    return this._bindingCalled;
  }
  set bindingCalled(handler) {
    if (this._bindingCalled) {
      this._client.removeListener("Runtime.bindingCalled", this._bindingCalled);
    }
    this._bindingCalled = handler;
    if (handler) {
      this._client.on("Runtime.bindingCalled", handler);
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
  /** Issued when object should be inspected (for example, as a result of inspect() command line API
call). */
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
  /** Primitive value which cannot be JSON-stringified. Includes values `-0`, `NaN`, `Infinity`,
`-Infinity`, and bigint literals. */
  export type UnserializableValue = string;
  /** Mirror object referencing original JavaScript object. */
  export interface RemoteObject {
    /** Object type. */
    type: "object" | "function" | "undefined" | "string" | "number" | "boolean" | "symbol" | "bigint";
    /** Object subtype hint. Specified for `object` type values only. */
    subtype?: "array" | "null" | "node" | "regexp" | "date" | "map" | "set" | "weakmap" | "weakset" | "iterator" | "generator" | "error" | "proxy" | "promise" | "typedarray";
    /** Object class (constructor) name. Specified for `object` type values only. */
    className?: string;
    /** Remote object value in case of primitive values or JSON values (if it was requested). */
    value?: any;
    /** Primitive value which can not be JSON-stringified does not have `value`, but gets this
property. */
    unserializableValue?: UnserializableValue;
    /** String representation of the object. */
    description?: string;
    /** Unique object identifier (for non-primitive values). */
    objectId?: RemoteObjectId;
    /** Preview containing abbreviated property values. Specified for `object` type values only. */
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
    type: "object" | "function" | "undefined" | "string" | "number" | "boolean" | "symbol" | "bigint";
    /** Object subtype hint. Specified for `object` type values only. */
    subtype?: "array" | "null" | "node" | "regexp" | "date" | "map" | "set" | "weakmap" | "weakset" | "iterator" | "generator" | "error";
    /** String representation of the object. */
    description?: string;
    /** True iff some of the properties or entries of the original object did not fit. */
    overflow: boolean;
    /** List of the properties. */
    properties: PropertyPreview[];
    /** List of the entries. Specified for `map` and `set` subtype values only. */
    entries?: EntryPreview[];
  }
  export interface PropertyPreview {
    /** Property name. */
    name: string;
    /** Object type. Accessor means that the property itself is an accessor property. */
    type: "object" | "function" | "undefined" | "string" | "number" | "boolean" | "symbol" | "accessor" | "bigint";
    /** User-friendly property value string. */
    value?: string;
    /** Nested value preview. */
    valuePreview?: ObjectPreview;
    /** Object subtype hint. Specified for `object` type values only. */
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
    /** A function which serves as a getter for the property, or `undefined` if there is no getter
(accessor descriptors only). */
    get?: RemoteObject;
    /** A function which serves as a setter for the property, or `undefined` if there is no setter
(accessor descriptors only). */
    set?: RemoteObject;
    /** True if the type of this property descriptor may be changed and if the property may be
deleted from the corresponding object. */
    configurable: boolean;
    /** True if this property shows up during enumeration of the properties on the corresponding
object. */
    enumerable: boolean;
    /** True if the result was thrown during the evaluation. */
    wasThrown?: boolean;
    /** True if the property is owned for the object. */
    isOwn?: boolean;
    /** Property symbol object, if the property is of the `symbol` type. */
    symbol?: RemoteObject;
  }
  /** Object internal property descriptor. This property isn't normally visible in JavaScript code. */
  export interface InternalPropertyDescriptor {
    /** Conventional property name. */
    name: string;
    /** The value associated with the property. */
    value?: RemoteObject;
  }
  /** Represents function call argument. Either remote object id `objectId`, primitive `value`,
unserializable primitive value or neither of (for undefined) them should be specified. */
  export interface CallArgument {
    /** Primitive value or serializable javascript object. */
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
    /** Unique id of the execution context. It can be used to specify in which execution context
script evaluation should be performed. */
    id: ExecutionContextId;
    /** Execution context origin. */
    origin: string;
    /** Human readable name describing given context. */
    name: string;
    /** Embedder-specific auxiliary data. */
    auxData?: any;
  }
  /** Detailed information about exception (or error) that was thrown during script compilation or
execution. */
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
  /** Number of milliseconds. */
  export type TimeDelta = number;
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
    /** String label of this stack trace. For async traces this may be a name of the function that
initiated the async call. */
    description?: string;
    /** JavaScript function name. */
    callFrames: CallFrame[];
    /** Asynchronous JavaScript stack trace that preceded this stack, if available. */
    parent?: StackTrace;
    /** Asynchronous JavaScript stack trace that preceded this stack, if available. */
    parentId?: StackTraceId;
  }
  /** Unique identifier of current debugger. */
  export type UniqueDebuggerId = string;
  /** If `debuggerId` is set stack trace comes from another debugger and can be resolved there. This
allows to track cross-debugger calls. See `Runtime.StackTrace` and `Debugger.paused` for usages. */
  export interface StackTraceId {
    id: string;
    debuggerId?: UniqueDebuggerId;
  }
  export type BindingCalledParameters = {
    name: string;
    payload: string;
    /** Identifier of the context where the call was made. */
    executionContextId: ExecutionContextId;
  };
  export type BindingCalledHandler = (params: BindingCalledParameters) => void;
  export type ConsoleAPICalledParameters = {
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
    /** Console context descriptor for calls on non-default console context (not console.*):
'anonymous#unique-logger-id' for call on unnamed context, 'name#unique-logger-id' for call
on named context. */
    context?: string;
  };
  export type ConsoleAPICalledHandler = (params: ConsoleAPICalledParameters) => void;
  export type ExceptionRevokedParameters = {
    /** Reason describing why exception was revoked. */
    reason: string;
    /** The id of revoked exception, as reported in `exceptionThrown`. */
    exceptionId: number;
  };
  export type ExceptionRevokedHandler = (params: ExceptionRevokedParameters) => void;
  export type ExceptionThrownParameters = {
    /** Timestamp of the exception. */
    timestamp: Timestamp;
    exceptionDetails: ExceptionDetails;
  };
  export type ExceptionThrownHandler = (params: ExceptionThrownParameters) => void;
  export type ExecutionContextCreatedParameters = {
    /** A newly created execution context. */
    context: ExecutionContextDescription;
  };
  export type ExecutionContextCreatedHandler = (params: ExecutionContextCreatedParameters) => void;
  export type ExecutionContextDestroyedParameters = {
    /** Id of the destroyed context */
    executionContextId: ExecutionContextId;
  };
  export type ExecutionContextDestroyedHandler = (params: ExecutionContextDestroyedParameters) => void;
  export type ExecutionContextsClearedHandler = () => void;
  export type InspectRequestedParameters = {
    object: RemoteObject;
    hints: any;
  };
  export type InspectRequestedHandler = (params: InspectRequestedParameters) => void;
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
    /** Declaration of the function to call. */
    functionDeclaration: string;
    /** Identifier of the object to call function on. Either objectId or executionContextId should
be specified. */
    objectId?: RemoteObjectId;
    /** Call arguments. All call arguments must belong to the same JavaScript world as the target
object. */
    arguments?: CallArgument[];
    /** In silent mode exceptions thrown during evaluation are not reported and do not pause
execution. Overrides `setPauseOnException` state. */
    silent?: boolean;
    /** Whether the result is expected to be a JSON object which should be sent by value. */
    returnByValue?: boolean;
    /** Whether preview should be generated for the result. */
    generatePreview?: boolean;
    /** Whether execution should be treated as initiated by user in the UI. */
    userGesture?: boolean;
    /** Whether execution should `await` for resulting value and return once awaited promise is
resolved. */
    awaitPromise?: boolean;
    /** Specifies execution context which global object will be used to call function on. Either
executionContextId or objectId should be specified. */
    executionContextId?: ExecutionContextId;
    /** Symbolic group name that can be used to release multiple objects. If objectGroup is not
specified and objectId is, objectGroup will be inherited from object. */
    objectGroup?: string;
  };
  export type CallFunctionOnReturn = {
    /** Call result. */
    result: RemoteObject;
    /** Exception details. */
    exceptionDetails?: ExceptionDetails;
  };
  export type CompileScriptParameters = {
    /** Expression to compile. */
    expression: string;
    /** Source url to be set for the script. */
    sourceURL: string;
    /** Specifies whether the compiled script should be persisted. */
    persistScript: boolean;
    /** Specifies in which execution context to perform script run. If the parameter is omitted the
evaluation will be performed in the context of the inspected page. */
    executionContextId?: ExecutionContextId;
  };
  export type CompileScriptReturn = {
    /** Id of the script. */
    scriptId?: ScriptId;
    /** Exception details. */
    exceptionDetails?: ExceptionDetails;
  };
  export type EvaluateParameters = {
    /** Expression to evaluate. */
    expression: string;
    /** Symbolic group name that can be used to release multiple objects. */
    objectGroup?: string;
    /** Determines whether Command Line API should be available during the evaluation. */
    includeCommandLineAPI?: boolean;
    /** In silent mode exceptions thrown during evaluation are not reported and do not pause
execution. Overrides `setPauseOnException` state. */
    silent?: boolean;
    /** Specifies in which execution context to perform evaluation. If the parameter is omitted the
evaluation will be performed in the context of the inspected page. */
    contextId?: ExecutionContextId;
    /** Whether the result is expected to be a JSON object that should be sent by value. */
    returnByValue?: boolean;
    /** Whether preview should be generated for the result. */
    generatePreview?: boolean;
    /** Whether execution should be treated as initiated by user in the UI. */
    userGesture?: boolean;
    /** Whether execution should `await` for resulting value and return once awaited promise is
resolved. */
    awaitPromise?: boolean;
    /** Whether to throw an exception if side effect cannot be ruled out during evaluation. */
    throwOnSideEffect?: boolean;
    /** Terminate execution after timing out (number of milliseconds). */
    timeout?: TimeDelta;
  };
  export type EvaluateReturn = {
    /** Evaluation result. */
    result: RemoteObject;
    /** Exception details. */
    exceptionDetails?: ExceptionDetails;
  };
  export type GetIsolateIdReturn = {
    /** The isolate id. */
    id: string;
  };
  export type GetHeapUsageReturn = {
    /** Used heap size in bytes. */
    usedSize: number;
    /** Allocated heap size in bytes. */
    totalSize: number;
  };
  export type GetPropertiesParameters = {
    /** Identifier of the object to return properties for. */
    objectId: RemoteObjectId;
    /** If true, returns properties belonging only to the element itself, not to its prototype
chain. */
    ownProperties?: boolean;
    /** If true, returns accessor properties (with getter/setter) only; internal properties are not
returned either. */
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
  export type GlobalLexicalScopeNamesParameters = {
    /** Specifies in which execution context to lookup global scope variables. */
    executionContextId?: ExecutionContextId;
  };
  export type GlobalLexicalScopeNamesReturn = {
    names: string[];
  };
  export type QueryObjectsParameters = {
    /** Identifier of the prototype to return objects for. */
    prototypeObjectId: RemoteObjectId;
    /** Symbolic group name that can be used to release the results. */
    objectGroup?: string;
  };
  export type QueryObjectsReturn = {
    /** Array with objects. */
    objects: RemoteObject;
  };
  export type ReleaseObjectParameters = {
    /** Identifier of the object to release. */
    objectId: RemoteObjectId;
  };
  export type ReleaseObjectGroupParameters = {
    /** Symbolic object group name. */
    objectGroup: string;
  };
  export type RunScriptParameters = {
    /** Id of the script to run. */
    scriptId: ScriptId;
    /** Specifies in which execution context to perform script run. If the parameter is omitted the
evaluation will be performed in the context of the inspected page. */
    executionContextId?: ExecutionContextId;
    /** Symbolic group name that can be used to release multiple objects. */
    objectGroup?: string;
    /** In silent mode exceptions thrown during evaluation are not reported and do not pause
execution. Overrides `setPauseOnException` state. */
    silent?: boolean;
    /** Determines whether Command Line API should be available during the evaluation. */
    includeCommandLineAPI?: boolean;
    /** Whether the result is expected to be a JSON object which should be sent by value. */
    returnByValue?: boolean;
    /** Whether preview should be generated for the result. */
    generatePreview?: boolean;
    /** Whether execution should `await` for resulting value and return once awaited promise is
resolved. */
    awaitPromise?: boolean;
  };
  export type RunScriptReturn = {
    /** Run result. */
    result: RemoteObject;
    /** Exception details. */
    exceptionDetails?: ExceptionDetails;
  };
  export type SetAsyncCallStackDepthParameters = {
    /** Maximum depth of async call stacks. Setting to `0` will effectively disable collecting async
call stacks (default). */
    maxDepth: number;
  };
  export type SetCustomObjectFormatterEnabledParameters = {
    enabled: boolean;
  };
  export type SetMaxCallStackSizeToCaptureParameters = {
    size: number;
  };
  export type AddBindingParameters = {
    name: string;
    executionContextId?: ExecutionContextId;
  };
  export type RemoveBindingParameters = {
    name: string;
  };
}
/** This domain is deprecated. */
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
