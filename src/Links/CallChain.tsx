import { Global, WithInputs } from "../GlobalState";
import { QRegister } from "../Registry";
import { Value, Link, AsNumber } from "../Types";
import { NumberConstant } from "./NumberConstant";

function CallChain0(left: Value): Value {
  return WithInputs([left], ()=>Global.Chains[0].Call(left));
}

function CallChain1(left: Value): Value {
  return WithInputs([left], ()=>Global.Chains[1].Call(left));
}

function CallChain2(left: Value): Value {
  return WithInputs([left], ()=>Global.Chains[2].Call(left));
}

function CallChainX(left: Value, number: Link): Value {
  let index = AsNumber(number.Call()) >>> 0;
  return WithInputs([left], ()=>Global.Chains[index].Call(left));
}

export function CallChainIndex(ind: number): string {
  switch (ind) {
    case 0:
      return "C₀";
    case 1:
      return "C₁";
    case 2:
      return "C₂";
    default:
      return `Cₓ${NumberConstant(ind)}`;
  }
}

QRegister("CallChain0", CallChain0, "C₀", 0xc0);
QRegister("CallChain1", CallChain1, "C₁", 0xc1);
QRegister("CallChain2", CallChain2, "C₂", 0xc2);
QRegister("CallChainX", CallChainX, "Cₓ", 0xc3);
