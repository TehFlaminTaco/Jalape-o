import { Global } from "../GlobalState";
import { QRegister } from "../Registry";
import { AsNumber, Link, Value } from "../Types";
import { NumberConstant } from "./NumberConstant";

function Input0(): Value {
  return Global.Inputs[0];
}

function Input1(): Value {
  return Global.Inputs[1];
}

function Input2(): Value {
  return Global.Inputs[2];
}

function Input3(): Value {
  return Global.Inputs[3];
}

function InputX(_left: Value, n: Link): Value {
  return Global.Inputs[AsNumber(n.Call()) >>> 0];
}

export function InputIndex(ind: number): string {
  switch (ind) {
    case 0:
      return "I₀";
    case 1:
      return "I₁";
    case 2:
      return "I₂";
    case 3:
      return "I₃";
    default:
      return `Iₓ${NumberConstant(ind)}`;
  }
}

function _InputIndexLink(this: Link): Value {
  return Global.Inputs[this.store["index"]];
}

export function InputIndexLink(ind: number): Link {
  let l = new Link(_InputIndexLink, []);
  l.store["index"] = ind;
  return l;
}

QRegister("Input0", Input0, "I₀", 0x90);
QRegister("Input1", Input1, "I₁", 0x91);
QRegister("Input2", Input2, "I₂", 0x92);
QRegister("Input3", Input3, "I₃", 0x93);
QRegister("InputX", InputX, "Iₓ", 0x94);
