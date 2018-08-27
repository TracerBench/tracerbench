/**
 * Debugging Protocol Domains
 * Generated on Mon Aug 20 2018 10:05:40 GMT-0700 (PDT)
 */
/* tslint:disable */
import { IDebuggingProtocolClient } from "../lib/types";
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
}
export namespace Browser {
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
  private _documentUpdated: DOM.DocumentUpdatedHandler | null = null;
  private _setChildNodes: DOM.SetChildNodesHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
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
  /** Returns the root DOM node (and optionally the subtree) to the caller. */
  public getDocument(params: DOM.GetDocumentParameters) {
    return this._client.send<DOM.GetDocumentReturn>("DOM.getDocument", params);
  }
  /** Returns the root DOM node (and optionally the subtree) to the caller. */
  public getFlattenedDocument(params: DOM.GetFlattenedDocumentParameters) {
    return this._client.send<DOM.GetFlattenedDocumentReturn>("DOM.getFlattenedDocument", params);
  }
  /** Returns node's HTML markup. */
  public getOuterHTML(params: DOM.GetOuterHTMLParameters) {
    return this._client.send<DOM.GetOuterHTMLReturn>("DOM.getOuterHTML", params);
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
  /** Moves node into the new container, places it before the given anchor. */
  public moveTo(params: DOM.MoveToParameters) {
    return this._client.send<DOM.MoveToReturn>("DOM.moveTo", params);
  }
  /** Executes `querySelector` on a given node. */
  public querySelector(params: DOM.QuerySelectorParameters) {
    return this._client.send<DOM.QuerySelectorReturn>("DOM.querySelector", params);
  }
  /** Executes `querySelectorAll` on a given node. */
  public querySelectorAll(params: DOM.QuerySelectorAllParameters) {
    return this._client.send<DOM.QuerySelectorAllReturn>("DOM.querySelectorAll", params);
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
  export type DocumentUpdatedHandler = () => void;
  export type SetChildNodesParameters = {
    /** Parent node id to populate with children. */
    parentId: NodeId;
    /** Child nodes array. */
    nodes: Node[];
  };
  export type SetChildNodesHandler = (params: SetChildNodesParameters) => void;
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
  export type SetXHRBreakpointParameters = {
    /** Resource URL substring. All XHRs having this substring in the URL will get stopped upon. */
    url: string;
  };
}
/** This domain emulates different environments for the page. */
export class Emulation {
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
  /** Emulates the given media for CSS media queries. */
  public setEmulatedMedia(params: Emulation.SetEmulatedMediaParameters) {
    return this._client.send<void>("Emulation.setEmulatedMedia", params);
  }
  /** Overrides the Geolocation Position or Error. Omitting any of the parameters emulates position
unavailable. */
  public setGeolocationOverride(params: Emulation.SetGeolocationOverrideParameters) {
    return this._client.send<void>("Emulation.setGeolocationOverride", params);
  }
  /** Switches script execution in the page. */
  public setScriptExecutionDisabled(params: Emulation.SetScriptExecutionDisabledParameters) {
    return this._client.send<void>("Emulation.setScriptExecutionDisabled", params);
  }
  /** Enables touch on platforms which do not support them. */
  public setTouchEmulationEnabled(params: Emulation.SetTouchEmulationEnabledParameters) {
    return this._client.send<void>("Emulation.setTouchEmulationEnabled", params);
  }
  /** Allows overriding user agent with the given string. */
  public setUserAgentOverride(params: Emulation.SetUserAgentOverrideParameters) {
    return this._client.send<void>("Emulation.setUserAgentOverride", params);
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
  export type CanEmulateReturn = {
    /** True if emulation is supported. */
    result: boolean;
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
  export type SetUserAgentOverrideParameters = {
    /** User agent to use. */
    userAgent: string;
    /** Browser langugage to emulate. */
    acceptLanguage?: string;
    /** The platform navigator.platform should return. */
    platform?: string;
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
  /** Dispatches a touch event to the page. */
  public dispatchTouchEvent(params: Input.DispatchTouchEventParameters) {
    return this._client.send<void>("Input.dispatchTouchEvent", params);
  }
  /** Ignores input events (useful while auditing page). */
  public setIgnoreInputEvents(params: Input.SetIgnoreInputEventsParameters) {
    return this._client.send<void>("Input.setIgnoreInputEvents", params);
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
  export type SetIgnoreInputEventsParameters = {
    /** Ignores input events processing when set to true. */
    ignore: boolean;
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
/** Network domain allows tracking network activities of the page. It exposes information about http,
file, data and other requests and responses, their headers, bodies, timing, etc. */
export class Network {
  private _dataReceived: Network.DataReceivedHandler | null = null;
  private _eventSourceMessageReceived: Network.EventSourceMessageReceivedHandler | null = null;
  private _loadingFailed: Network.LoadingFailedHandler | null = null;
  private _loadingFinished: Network.LoadingFinishedHandler | null = null;
  private _requestServedFromCache: Network.RequestServedFromCacheHandler | null = null;
  private _requestWillBeSent: Network.RequestWillBeSentHandler | null = null;
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
  /** Clears browser cache. */
  public clearBrowserCache() {
    return this._client.send<void>("Network.clearBrowserCache");
  }
  /** Clears browser cookies. */
  public clearBrowserCookies() {
    return this._client.send<void>("Network.clearBrowserCookies");
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
  /** Specifies whether to always send extra HTTP headers with the requests from this page. */
  public setExtraHTTPHeaders(params: Network.SetExtraHTTPHeadersParameters) {
    return this._client.send<void>("Network.setExtraHTTPHeaders", params);
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
  export type SetExtraHTTPHeadersParameters = {
    /** Map with extra HTTP headers. */
    headers: Headers;
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
/** Actions and events related to the inspected page belong to the page domain. */
export class Page {
  private _domContentEventFired: Page.DomContentEventFiredHandler | null = null;
  private _frameAttached: Page.FrameAttachedHandler | null = null;
  private _frameDetached: Page.FrameDetachedHandler | null = null;
  private _frameNavigated: Page.FrameNavigatedHandler | null = null;
  private _interstitialHidden: Page.InterstitialHiddenHandler | null = null;
  private _interstitialShown: Page.InterstitialShownHandler | null = null;
  private _javascriptDialogClosed: Page.JavascriptDialogClosedHandler | null = null;
  private _javascriptDialogOpening: Page.JavascriptDialogOpeningHandler | null = null;
  private _lifecycleEvent: Page.LifecycleEventHandler | null = null;
  private _loadEventFired: Page.LoadEventFiredHandler | null = null;
  private _windowOpen: Page.WindowOpenHandler | null = null;
  private _client: IDebuggingProtocolClient;
  constructor(client: IDebuggingProtocolClient) {
    this._client = client;
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
  /** Creates an isolated world for the given frame. */
  public createIsolatedWorld(params: Page.CreateIsolatedWorldParameters) {
    return this._client.send<Page.CreateIsolatedWorldReturn>("Page.createIsolatedWorld", params);
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
  /** Removes given script from the list. */
  public removeScriptToEvaluateOnNewDocument(params: Page.RemoveScriptToEvaluateOnNewDocumentParameters) {
    return this._client.send<void>("Page.removeScriptToEvaluateOnNewDocument", params);
  }
  /** Sets given markup as the document's HTML. */
  public setDocumentContent(params: Page.SetDocumentContentParameters) {
    return this._client.send<void>("Page.setDocumentContent", params);
  }
  /** Force the page stop all navigations and pending resource fetches. */
  public stopLoading() {
    return this._client.send<void>("Page.stopLoading");
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
  export type GetAppManifestReturn = {
    /** Manifest location. */
    url: string;
    errors: AppManifestError[];
    /** Manifest content. */
    data?: string;
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
  export type RemoveScriptToEvaluateOnNewDocumentParameters = {
    identifier: ScriptIdentifier;
  };
  export type SetDocumentContentParameters = {
    /** Frame id to set HTML for. */
    frameId: FrameId;
    /** HTML content to set. */
    html: string;
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
}
/** Supports additional targets discovery and allows to attach to them. */
export class Target {
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
  /** Closes the target. If the target is a page that gets closed too. */
  public closeTarget(params: Target.CloseTargetParameters) {
    return this._client.send<Target.CloseTargetReturn>("Target.closeTarget", params);
  }
  /** Creates a new page. */
  public createTarget(params: Target.CreateTargetParameters) {
    return this._client.send<Target.CreateTargetReturn>("Target.createTarget", params);
  }
  /** Detaches session with given id. */
  public detachFromTarget(params: Target.DetachFromTargetParameters) {
    return this._client.send<void>("Target.detachFromTarget", params);
  }
  /** Retrieves a list of available targets. */
  public getTargets() {
    return this._client.send<Target.GetTargetsReturn>("Target.getTargets");
  }
  /** Sends protocol message over session with given id. */
  public sendMessageToTarget(params: Target.SendMessageToTargetParameters) {
    return this._client.send<void>("Target.sendMessageToTarget", params);
  }
  /** Controls whether to discover available targets and notify via
`targetCreated/targetInfoChanged/targetDestroyed` events. */
  public setDiscoverTargets(params: Target.SetDiscoverTargetsParameters) {
    return this._client.send<void>("Target.setDiscoverTargets", params);
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
  export type BrowserContextID = any;
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
  export type CloseTargetParameters = {
    targetId: TargetID;
  };
  export type CloseTargetReturn = {
    success: boolean;
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
  export type SetDiscoverTargetsParameters = {
    /** Whether to discover available targets. */
    discover: boolean;
  };
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
  /** Stops on the next JavaScript statement. */
  public pause() {
    return this._client.send<void>("Debugger.pause");
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
  /** Searches for given string in script content. */
  public searchInContent(params: Debugger.SearchInContentParameters) {
    return this._client.send<Debugger.SearchInContentReturn>("Debugger.searchInContent", params);
  }
  /** Enables or disables async call stacks tracking. */
  public setAsyncCallStackDepth(params: Debugger.SetAsyncCallStackDepthParameters) {
    return this._client.send<void>("Debugger.setAsyncCallStackDepth", params);
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
  /** Activates / deactivates all breakpoints on the page. */
  public setBreakpointsActive(params: Debugger.SetBreakpointsActiveParameters) {
    return this._client.send<void>("Debugger.setBreakpointsActive", params);
  }
  /** Defines pause on exceptions state. Can be set to stop on all exceptions, uncaught exceptions or
no exceptions. Initial pause on exceptions state is `none`. */
  public setPauseOnExceptions(params: Debugger.SetPauseOnExceptionsParameters) {
    return this._client.send<void>("Debugger.setPauseOnExceptions", params);
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
  export type SetBreakpointsActiveParameters = {
    /** New value for breakpoints active state. */
    active: boolean;
  };
  export type SetPauseOnExceptionsParameters = {
    /** Pause on exceptions mode. */
    state: "none" | "uncaught" | "all";
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
  public stop() {
    return this._client.send<Profiler.StopReturn>("Profiler.stop");
  }
  /** Disable precise code coverage. Disabling releases unnecessary execution count records and allows
executing optimized code. */
  public stopPreciseCoverage() {
    return this._client.send<void>("Profiler.stopPreciseCoverage");
  }
  /** Collect coverage data for the current isolate, and resets execution counters. Precise code
coverage needs to have started. */
  public takePreciseCoverage() {
    return this._client.send<Profiler.TakePreciseCoverageReturn>("Profiler.takePreciseCoverage");
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
}
/** Runtime domain exposes JavaScript runtime by means of remote evaluation and mirror objects.
Evaluation results are returned as mirror object that expose object type, string representation
and unique identifier that can be used for further object reference. Original objects are
maintained in memory unless they are either explicitly released or are released along with the
other objects in their object group. */
export class Runtime {
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
  export type UniqueDebuggerId = any;
  export type StackTraceId = any;
  export type ObjectPreview = any;
  export type CustomPreview = any;
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
}
