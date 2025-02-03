import { QRegister, NamesToBytes } from "../Registry";
import { Value } from "../Types";

function Negative(left: Value, right: Value): Value {
  switch (typeof right) {
    case "number":
      return -right;
    case "string":
      return right.split("").reverse().join("");
    case "object":
      return right.reverse();
    default:
      return right;
  }
}

QRegister(Negative, "-₀", 0x40);
