import { Global, WithInputs } from "./GlobalState";
import { VectorizedOver } from "./Helpers";

export type Value = undefined | number | string | Value[];
export type Behaviour = Function;

export function AsNumber(v: Value): number {
  switch (typeof v) {
    case "number":
      return v;
    case "string":
      return +v;
    case "object":
      return AsNumber(v[0] as Value);
    case "undefined":
      return 0;
    default:
      throw new Error(`Unexpected value type ${typeof v}`);
  }
}

export function AsString(v: Value): string {
  if (typeof v === "object") return `[${v.map(AsString).join(",")}]`;
  return `${v}`;
}

export function AsList(v: Value, boxString: boolean = false): Value[] {
  if (typeof v === "string" && !boxString) return v.split('');
  if (typeof v !== "object") return [v];
  return v;
}

export function Truthy(v: Value): boolean {
  switch (typeof v) {
    case "number":
      return v !== 0;
    case "string":
      return v.trim() !== "";
    case "object":
      return (v as Value[]).length > 0;
    case "undefined":
      return false;
    default:
      throw new Error(`Unexpected value type ${typeof v}`);
  }
}

const NoArgument: unique symbol = Symbol();

export class Link {
  Method: Behaviour;
  Arguments: Link[] = [];
  store: { [key: string]: any } = {};

  constructor(method: Behaviour, args: Link[]) {
    this.Method = method;
    this.Arguments = args;
  }

  Call(...left: Value[]): Value {
    if(left.length === 0)
      return this.Method(Global.Inputs[0], ...this.Arguments);
    else
      return WithInputs(left, ()=>this.Method(left[0], ...this.Arguments));
  }

  CallSoftly(left: Value): Value {
    return this.Method(left, ...this.Arguments);
  }
}

export class Chain {
  Links: Link[] = [];
  Call(first: Value): Value {
    for (let l of this.Links) {
      first = l.CallSoftly(first);
    }
    return first;
  }

  CallSoftly(first: Value): Value {
    for (let l of this.Links) {
      first = l.CallSoftly(first);
    }
    return first;
  }

  constructor(links: Link[]) {
    this.Links = links;
  }
}

export class Vectorized {
  values: Value[];

  private vectorizeFrom(targets: Value[], method: (...v: Value[]) => Value): Value {
    if(targets.length === 1)
      return VectorizedOver(targets[0], method)
    else
      return VectorizedOver(targets[0], (l: Value)=>this.vectorizeFrom(targets.slice(1), (...v: Value[]) => method(l, ...v)))
  }

  map(method: (...v: Value[]) => Value): Vectorized {
    return new Vectorized(this.vectorizeFrom(this.values, method));
  }

  get(method: ((...v: Value[]) => Value)|undefined): Value {
    if(method === undefined){
      return this.values[0];
    }
    return this.vectorizeFrom(this.values, method);
  }

  constructor(...val: Value[]){
    this.values = val;
  }
}