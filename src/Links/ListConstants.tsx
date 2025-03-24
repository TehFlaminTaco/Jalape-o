import { QRegister } from "../Registry";
import { Link, Value, AsList, Truthy, Vectorized, AsNumber } from "../Types";

function Pair(left: Value, right: Link): Value {
  return AsList(left, true).concat([right.Call()]);
}

function EmptyList(): Value {
  return [];
}

function To(left: Value, r: Link): Value {
  let right = r.Call();
  // If left and right are numbers, return a range of numbers from left to right.
  if (typeof left === "number" && typeof right === "number") {
    let result = [];
    if (left < right) {
      for (let i = left; i <= right; i++) {
        result.push(i);
      }
    } else {
      for (let i = left; i >= right; i--) {
        result.push(i);
      }
    }
    return result;
  }
  // If left or right are lists, concatenate. (I know this isn't range, but it's the `..` operator)
  if (typeof left === "object" || typeof right === "object") {
    return AsList(left).concat(AsList(right));
  }
  // If left or right are strings, concatenate.
  if (typeof left === "string" || typeof right === "string") {
    return `${left}${right}`;
  }
  // If none of the above, return either if truthy
  return Truthy(left) ? left : right;
}

function Range(left: Value): Value {
  return new Vectorized(left).get(n => {
    let num = AsNumber(n);
    let res: number[] = [];
    if(num < 0){
      for(let i=-1; i >= num; i--)
        res.push(i)
      return res;
    }else for(let i=1; i <= num; i++){
      res.push(i)
    }
    return res;
  })
}

function Box(left: Value, right: Link): Value {
  return [right.Call()];
}

QRegister("Pair", Pair, ",", 0x29, ",");
QRegister("EmptyList", EmptyList, "∅", 0x2A);
QRegister("To", To, "‥", 0x2e, "..");
QRegister("Range", Range, "⇹", 0xB2);
QRegister("Box", Box, "□", 0x2f, "□");
