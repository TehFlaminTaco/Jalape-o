import { Global } from "../GlobalState";
import { QRegister } from "../Registry";
import { AsNumber, AsString, Link, Value } from "../Types";

function Add(left: Value, r: Link): Value {
  function Adder(left: Value, right: Value): Value {
    // If left is a list, add right to each element of it.
    if (typeof left === "object") {
      return left.map((v: Value) => Adder(v, right));
    }
    // If right is a list, add left to each element of it.
    if (typeof right === "object") {
      return right.map((v: Value) => Adder(left, v));
    }
    // If Left OR right is a string, concatenate them.
    if (typeof left === "string" || typeof right === "string") {
      return `${AsString(left)}${AsString(right)}`;
    }
    // If both are numbers, add them.
    if (typeof left === "number" && typeof right === "number") {
      return left + right;
    }
    // If none of the above, return either if truthy
    return left || right;
  }
  return Adder(left, r.Call(Global.Inputs[0]));
}

function Subtract(left: Value, r: Link): Value {
  function Subtractor(left: Value, right: Value): Value {
    // If left is a list, subtract right from each element of it.
    if (typeof left === "object") {
      return left.map((v: Value) => Subtractor(v, right));
    }
    // If right is a list, subtract left from each element of it.
    if (typeof right === "object") {
      return right.map((v: Value) => Subtractor(left, v));
    }
    // If left is a string, remove all instances of RIGHT as a string from it
    if (typeof left === "string") {
      return left.split(right as string).join("");
    }
    // If both are numbers, subtract them.
    if (typeof left === "number" && typeof right === "number") {
      return left - right;
    }
    // If none of the above, return either if truthy
    return left || right;
  }
  return Subtractor(left, r.Call(Global.Inputs[0]));
}

function Multiply(left: Value, r: Link): Value {
  function Multiplier(left: Value, right: Value): Value {
    // If left is a list, multiply right to each element of it.
    if (typeof left === "object") {
      return left.map((v: Value) => Multiplier(v, right));
    }
    // If right is a list, multiply left to each element of it.
    if (typeof right === "object") {
      return right.map((v: Value) => Multiplier(left, v));
    }
    // If left is a string, repeat it right times.
    if (typeof left === "string") {
      return left.repeat(AsNumber(right));
    }
    // If both are numbers, multiply them.
    if (typeof left === "number" && typeof right === "number") {
      return left * right;
    }
    // If none of the above, treat like && for truthy values
    return left && right;
  }
  return Multiplier(left, r.Call(Global.Inputs[0]));
}

function Divide(left: Value, r: Link): Value {
  function Divider(left: Value, right: Value): Value {
    // If left is a list, divide right from each element of it.
    if (typeof left === "object") {
      return left.map((v: Value) => Divider(v, right));
    }
    // If right is a list, divide left from each element of it.
    if (typeof right === "object") {
      return right.map((v: Value) => Divider(left, v));
    }
    // If left is a string, remove exactly one instance of RIGHT as a string from it
    if (typeof left === "string") {
      return left.replace(AsString(right), "");
    }
    // If both are numbers, divide them.
    if (typeof left === "number" && typeof right === "number") {
      return left / right;
    }
    // If none of the above, treat like || for truthy values
    return left && right;
  }
  return Divider(left, r.Call(Global.Inputs[0]));
}

function Modulo(left: Value, r: Link): Value {
  function Modulator(left: Value, right: Value): Value {
    // If left is a list, modulo right from each element of it.
    if (typeof left === "object") {
      return left.map((v: Value) => Modulator(v, right));
    }
    // If right is a list, modulo left from each element of it.
    if (typeof right === "object") {
      return right.map((v: Value) => Modulator(left, v));
    }
    // If left is a string, split it into chunks of RIGHT length.
    if (typeof left === "string") {
      let rightNum = AsNumber(right);
      let result = [];
      for (let i = 0; i < left.length; i += rightNum) {
        result.push(left.slice(i, i + rightNum));
      }
      return result;
    }
    // If both are numbers, modulo them.
    if (typeof left === "number" && typeof right === "number") {
      return left % right;
    }
    // If none of the above, treat like || for truthy values
    return left && right;
  }
  return Modulator(left, r.Call(Global.Inputs[0]));
}

function Power(left: Value, r: Link): Value {
  function Powerer(left: Value, right: Value): Value {
    // If left is a list, raise each element of it to the power of right.
    if (typeof left === "object") {
      return left.map((v: Value) => Powerer(v, right));
    }
    // If right is a list, raise left to the power of each element of it.
    if (typeof right === "object") {
      return right.map((v: Value) => Powerer(left, v));
    }
    // If both are numbers, raise left to the power of right.
    if (typeof left === "number" && typeof right === "number") {
      return Math.pow(left, right);
    }
    // If none of the above, treat like || for truthy values
    return left && right;
  }
  return Powerer(left, r.Call(Global.Inputs[0]));
}

function And(left: Value, r: Link): Value {
  return left && r.Call(Global.Inputs[0]);
}

function Or(left: Value, r: Link): Value {
  return left || r.Call(Global.Inputs[0]);
}

function Not(left: Value): Value {
  return !left ? 1 : 0;
}

function Equal(left: Value, r: Link): Value {
  return left == r.Call(Global.Inputs[0]) ? 1 : 0;
}

function NotEqual(left: Value, r: Link): Value {
  return left != r.Call(Global.Inputs[0]) ? 1 : 0;
}

function _Compare(left: Value, right: Value): number {
  if (typeof left !== typeof right) {
    return 0;
  }
  if (typeof left === "number") {
    return Math.sign(left - (right as number));
  }
  if (typeof left === "string") {
    return left.localeCompare(right as string);
  }
  if (typeof left === "object") {
    let r = right as Value[];
    // Lexographical comparison of arrays
    let minLength = Math.min(left.length, r.length);
    for (let i = 0; i < minLength; i++) {
      let comp = _Compare(left[i], r[i]);
      if (comp !== 0) return comp;
    }
    return Math.sign(left.length - r.length);
  }
  return 0;
}

function Compare(left: Value, r: Link): Value {
  return _Compare(left, r.Call(Global.Inputs[0])) === 0 ? 1 : 0;
}

function Greater(left: Value, r: Link): Value {
  return _Compare(left, r.Call(Global.Inputs[0])) > 0 ? 1 : 0;
}

function Less(left: Value, r: Link): Value {
  return _Compare(left, r.Call(Global.Inputs[0])) < 0 ? 1 : 0;
}

function GreaterEqual(left: Value, r: Link): Value {
  return _Compare(left, r.Call(Global.Inputs[0])) >= 0 ? 1 : 0;
}

function LessEqual(left: Value, r: Link): Value {
  return _Compare(left, r.Call(Global.Inputs[0])) <= 0 ? 1 : 0;
}

function Sqrt(left: Value): Value {
  if (typeof left === "number") {
    return Math.sqrt(left);
  }
  if (typeof left === "object") {
    return left.map((v: Value) => Sqrt(v));
  }
  if (typeof left === "string") {
    return Sqrt(AsNumber(left));
  }
  return left;
}

function Square(left: Value): Value {
  if (typeof left === "number") {
    return left * left;
  }
  if (typeof left === "object") {
    return left.map((v: Value) => Square(v));
  }
  if (typeof left === "string") {
    return Square(AsNumber(left));
  }
  return left;
}

function Cubed(left: Value): Value {
  if (typeof left === "number") {
    return left * left * left;
  }
  if (typeof left === "object") {
    return left.map((v: Value) => Cubed(v));
  }
  if (typeof left === "string") {
    return Cubed(AsNumber(left));
  }
  return left;
}

function Sign(left: Value): Value {
  if (typeof left === "number") {
    return Math.sign(left);
  }
  if (typeof left === "object") {
    return left.map((v: Value) => Sign(v));
  }
  if (typeof left === "string") {
    return Sign(AsNumber(left));
  }
  return left;
}

function Factorial(left: Value): Value {
  if (typeof left === "number") {
    let result = 1;
    for (let i = 2; i <= left; i++) {
      result *= i;
    }
    return result;
  }
  if (typeof left === "object") {
    return left.map((v: Value) => Factorial(v));
  }
  if (typeof left === "string") {
    return Factorial(AsNumber(left));
  }
  return left;
}

QRegister(Add, "+", 0x50, "+");
QRegister(Subtract, "-", 0x51, "-");
QRegister(Multiply, "*", 0x52, "*");
QRegister(Divide, "/", 0x53, "/");
QRegister(Modulo, "%", 0x54, "%");
QRegister(Power, "^", 0x55, "^");
QRegister(And, "&", 0x56, "&&");
QRegister(Or, "|", 0x57, "||");
QRegister(Not, "¬", 0x58, "!");
QRegister(Equal, "=", 0x59, "=");
QRegister(NotEqual, "≠", 0x5a, "!=");
QRegister(Greater, ">", 0x5b, ">");
QRegister(Less, "<", 0x5c, "<");
QRegister(GreaterEqual, "≥", 0x5d, ">=");
QRegister(LessEqual, "≤", 0x5e, "<=");
QRegister(Compare, "≡", 0x5f, "<>");
QRegister(Sqrt, "√", 0x60);
QRegister(Square, "²", 0x61);
QRegister(Cubed, "³", 0x62);
QRegister(Sign, "±", 0x63);
QRegister(Factorial, "!", 0x64);
