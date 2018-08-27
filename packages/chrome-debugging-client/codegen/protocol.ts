/**
 * Describes the protocol.json
 */
export interface IProtocol {
  domains: IDomain[];
  version?: IVersion;
}

export interface IVersion {
  major: string;
  minor: string;
}

export interface IDomain extends IDoc {
  domain: string;
  commands?: ICommand[];
  events?: IEvent[];
  types?: Type[];
}

export interface ICommand extends IDoc {
  name: string;
  parameters?: NamedDescriptor[];
  returns?: NamedDescriptor[];
}

export interface IEvent extends IDoc {
  name: string;
  parameters?: NamedDescriptor[];
}

export interface IDoc {
  description?: string;
  deprecated?: boolean;
  experimental?: boolean;
  hidden?: boolean;
}

export type TypeRefOrDescriptor = ITypeRef | Descriptor;
export type Descriptor =
  | IObjectDescriptor
  | IArrayDescriptor
  | IEnumDescriptor
  | StringDescriptor
  | INumberDescriptor
  | IBooleanDescriptor
  | IAnyDescriptor;
export type StringDescriptor = IStringDescriptor | IEnumDescriptor;

export type Type = TypeRefOrDescriptor & {
  id: string;
};

export interface ITypeRef extends IDoc {
  $ref: string;
}

export type NamedDescriptor = TypeRefOrDescriptor & {
  name: string;
  optional?: boolean;
};

export interface IObjectDescriptor extends IDoc {
  description?: string;
  hidden?: boolean;
  type: "object";
  properties?: NamedDescriptor[];
}

export interface IAnyDescriptor extends IDoc {
  type: "any";
}

export interface IArrayDescriptor extends IDoc {
  type: "array";
  items: TypeRefOrDescriptor;
}

export interface IStringDescriptor extends IDoc {
  type: "string";
}

export interface IEnumDescriptor extends IDoc {
  type: "string";
  enum: string[];
}

export interface INumberDescriptor extends IDoc {
  type: "integer" | "number";
}

export interface IBooleanDescriptor extends IDoc {
  type: "boolean";
}

export function isTypeRef(desc: TypeRefOrDescriptor): desc is ITypeRef {
  return "$ref" in desc;
}

export function isObjectDescriptor(
  desc: Descriptor,
): desc is IObjectDescriptor {
  return "object" === desc.type;
}

export function isArrayDescriptor(desc: Descriptor): desc is IArrayDescriptor {
  return "array" === desc.type;
}

export function isStringDescriptor(desc: Descriptor): desc is StringDescriptor {
  return "string" === desc.type;
}

export function isEnumDescriptor(
  desc: StringDescriptor,
): desc is IEnumDescriptor {
  return "enum" in desc;
}

export function isNumberDescriptor(
  desc: Descriptor,
): desc is INumberDescriptor {
  return "number" === desc.type || "integer" === desc.type;
}
