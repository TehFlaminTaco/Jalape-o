import { QRegister } from "../Registry";
import { Link, Value } from "../Types";

function BracketStart(this: Link, left: Value): Value {
  let children = this.store["children"] as Link[];
  for (let i = 0; i < children.length; i++) {
    left = children[i].Call(left);
  }
  return left;
}

function BracketEnd(this: Link, left: Value): Value {
  let children = this.store["children"] as Link[];
  for (let i = 0; i < children.length; i++) {
    left = children[i].Call(left);
  }
  return left;
}

function TwoGroup(left: Value, a: Link, b: Link): Value {
  left = a.Call(left);
  return b.Call(left);
}

function ThreeGroup(left: Value, a: Link, b: Link, c: Link): Value {
  left = a.Call(left);
  left = b.Call(left);
  return c.Call(left);
}

function FourGroup(left: Value, a: Link, b: Link, c: Link, d: Link): Value {
  left = a.Call(left);
  left = b.Call(left);
  left = c.Call(left);
  return d.Call(left);
}

function FiveGroup(
  left: Value,
  a: Link,
  b: Link,
  c: Link,
  d: Link,
  e: Link
): Value {
  left = a.Call(left);
  left = b.Call(left);
  left = c.Call(left);
  left = d.Call(left);
  return e.Call(left);
}

QRegister(BracketStart, "{", 0xc4);
QRegister(BracketEnd, "}", 0xc5);
QRegister(TwoGroup, "{₂", 0xc6);
QRegister(ThreeGroup, "{₃", 0xc7);
QRegister(FourGroup, "{₄", 0xc8);
QRegister(FiveGroup, "{₅", 0xc9);
