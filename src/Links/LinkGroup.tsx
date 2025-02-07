import { QRegister } from "../Registry";
import { Link, Value } from "../Types";

function BracketStart(this: Link, left: Value): Value {
  let children = this.store["children"] as Link[];
  for (let i = 0; i < children.length; i++) {
    left = children[i].CallSoftly(left);
  }
  return left;
}

function BracketEnd(this: Link, left: Value): Value {
  let children = this.store["children"] as Link[];
  for (let i = 0; i < children.length; i++) {
    left = children[i].CallSoftly(left);
  }
  return left;
}

function TwoGroup(left: Value, a: Link, b: Link): Value {
  left = a.CallSoftly(left);
  return b.CallSoftly(left);
}

function ThreeGroup(left: Value, a: Link, b: Link, c: Link): Value {
  left = a.CallSoftly(left);
  left = b.CallSoftly(left);
  return c.CallSoftly(left);
}

function FourGroup(left: Value, a: Link, b: Link, c: Link, d: Link): Value {
  left = a.CallSoftly(left);
  left = b.CallSoftly(left);
  left = c.CallSoftly(left);
  return d.CallSoftly(left);
}

function FiveGroup(
  left: Value,
  a: Link,
  b: Link,
  c: Link,
  d: Link,
  e: Link
): Value {
  left = a.CallSoftly(left);
  left = b.CallSoftly(left);
  left = c.CallSoftly(left);
  left = d.CallSoftly(left);
  return e.CallSoftly(left);
}

QRegister("BracketStart", BracketStart, "{", 0xc4);
QRegister("BracketEnd", BracketEnd, "}", 0xc5);
QRegister("TwoGroup", TwoGroup, "{₂", 0xc6);
QRegister("ThreeGroup", ThreeGroup, "{₃", 0xc7);
QRegister("FourGroup", FourGroup, "{₄", 0xc8);
QRegister("FiveGroup", FiveGroup, "{₅", 0xc9);
