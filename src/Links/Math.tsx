import { Global } from "../GlobalState";
import { QRegister } from "../Registry";
import { AsList, AsNumber, AsString, Link, Truthy, Value, Vectorized } from "../Types";

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
    return Truthy(left) ? left : right
  }
  return Adder(left, r.Call());
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
    return Truthy(left) ? left : right;
  }
  return Subtractor(left, r.Call());
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
    // Visaversa
    if (typeof right === "string") {
      return right.repeat(AsNumber(left));
    }
    // If both are numbers, multiply them.
    if (typeof left === "number" && typeof right === "number") {
      return left * right;
    }
    // If none of the above, treat like && for truthy values
    return Truthy(left) ? right :  left;
  }
  return Multiplier(left, r.Call());
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
    return Truthy(left) ? right :  left;
  }
  return Divider(left, r.Call());
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
    return Truthy(left) ? right :  left;
  }
  return Modulator(left, r.Call());
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
    return Truthy(left) ? right :  left;
  }
  return Powerer(left, r.Call());
}

function And(left: Value, r: Link): Value {
  return Truthy(left) ? r.Call() : left;
}

function Or(left: Value, r: Link): Value {
  return Truthy(left) ? left :  r.Call();
}

function Not(left: Value): Value {
  return !Truthy(left) ? 1 : 0;
}

export function _Equal(left: Value, right: Value): number {
  if(typeof(left) === "undefined" || typeof(right) === "undefined")
    return typeof(left) === typeof(right) ? 1 : 0;
  if(typeof(left) === "string" || typeof(right) === "string")
    return AsString(left) === AsString(right) ? 1 : 0;
  if(typeof(left) !== typeof(right))
    return 0;
  if(typeof(left) === "object"){
    let lList = left as Value[];
    let rList = right as Value[];
    if(lList.length !== rList.length)
      return 0;
    for(let i=0; i < lList.length; i++){
      if(!_Equal(lList[i], rList[i]))
        return 0;
    }
    return 1;
  }
  return left === right ? 1 : 0;
}

function Equal(left: Value, r: Link): number {
  let right = r.Call();
  return _Equal(left, right);
}

function NotEqual(left: Value, r: Link): Value {
  return 1 - Equal(left, r);
}

export function _Compare(left: Value, right: Value): number {
  if(typeof(left) === "undefined" || typeof(right) === "undefined")
    return 0; // Undefined is unorderable.
  if(typeof(left) === "string" || typeof(right) === "string")
    return AsString(left).localeCompare(AsString(right));
  if(typeof(left) !== typeof(right)) // Incompatable types are unorderable
    return 0;
  if(typeof(left) === "object"){
    let lList = left as Value[];
    let rList = right as Value[];
    let minLength = Math.min(lList.length, rList.length)
    for(let i=0; i < minLength; i++){
      let compared = _Compare(lList[i], rList[i]);
      if(compared!==0)
        return compared;
    }
    if(lList.length === rList.length)
      return 0;
    if(lList.length < rList.length)
      return -1;
    return 1;
  }
  if(typeof(left) === 'number'){
    return Math.sign(AsNumber(left) - AsNumber(right))
  }
  return 0; // Unknown, Unorderable.
}

function Compare(left: Value, r: Link): Value {
  return _Compare(left, r.Call())
}

function Greater(left: Value, r: Link): Value {
  return _Compare(left, r.Call()) > 0 ? 1 : 0;
}

function Less(left: Value, r: Link): Value {
  return _Compare(left, r.Call()) < 0 ? 1 : 0;
}

function GreaterEqual(left: Value, r: Link): Value {
  let right = r.Call();
  return _Compare(left, r.Call()) > 0 ? 1 : _Equal(left, right);
}

function LessEqual(left: Value, r: Link): Value {
  let right = r.Call();
  return _Compare(left, r.Call()) < 0 ? 1 : _Equal(left, right);
}

function BitwiseOr(left: Value, right: Link): Value {
  return new Vectorized(left, right.Call()).get((left: Value, right: Value)=>
    AsNumber(left)|AsNumber(right)
  )
}

function BitwiseAnd(left: Value, right: Link): Value {
  return new Vectorized(left, right.Call()).get((left: Value, right: Value)=>
    AsNumber(left)&AsNumber(right)
  )
}

function BitwiseXor(left: Value, right: Link): Value {
  return new Vectorized(left, right.Call()).get((left: Value, right: Value)=>
    AsNumber(left)^AsNumber(right)
  )
}

function BitshiftLeft(left: Value, right: Link): Value {
  return new Vectorized(left, right.Call()).get((left: Value, right: Value)=>
    AsNumber(left)<<AsNumber(right)
  )
}

function BitshiftRight(left: Value, right: Link): Value {
  return new Vectorized(left, right.Call()).get((left: Value, right: Value)=>
    AsNumber(left)>>AsNumber(right)
  )
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

function RandomDecimal(): Value {
  return Math.random();
}

function RandomInteger(max: Value): Value {
  if(typeof(max) === 'object')
    return max[(Math.random() * max.length) >>> 0];
  return (Math.random() * AsNumber(max)) >>> 0;
}

function RandomFloat(max: Value): Value {
  if(typeof(max) === 'object')
    return max[(Math.random() * max.length) >>> 0];
  return (Math.random() * AsNumber(max));
}

function LogE(n: Value): Value {
  return new Vectorized(n).get((n: Value) => Math.log(AsNumber(n)));
}

function Log(n: Value, base: Link): Value {
  return new Vectorized(n, base.Call()).get((n: Value, base: Value) => Math.log(AsNumber(n)) / Math.log(AsNumber(base)));
}

function PrimeFactors(n: Value): Value {
  return new Vectorized(n).get((n: Value)=>{n = AsNumber(n);
    const factors: number[] = [];
    let div = 2;
    while(n >= 2){
      if(n % div === 0){
        factors.push(div);
        n /= div;
      }else{
        div++;
      }
    }
    return factors;
  })
}

function IsPrime(n: Value): Value {
  return new Vectorized(n).get((n: Value)=>{n = AsNumber(n);
    for(let i=2; i * i <= n; i++){
      if(n%i === 0)
        return 0;
    }
    return 1;
  });
}

function Factors(n: Value): Value {
  return new Vectorized(n).get((n: Value)=>{n = AsNumber(n);
    let factors = [];
    for(let i=1; i <= n; i++){
      if(n % i === 0)
        factors.push(i);
    }
    return factors;
  });
}

function Sin(n: Value): Value {
  return new Vectorized(n).get((n: Value) => Math.sin(AsNumber(n)));
}
function Cos(n: Value): Value {
  return new Vectorized(n).get((n: Value) => Math.cos(AsNumber(n)));
}
function Tan(n: Value): Value {
  return new Vectorized(n).get((n: Value) => Math.tan(AsNumber(n)));
}
function ASin(n: Value): Value {
  return new Vectorized(n).get((n: Value) => Math.asin(AsNumber(n)));
}
function ACos(n: Value): Value {
  return new Vectorized(n).get((n: Value) => Math.acos(AsNumber(n)));
}
function ATan(n: Value): Value {
  return new Vectorized(n).get((n: Value) => Math.atan(AsNumber(n)));
}
function ATan2(y: Value, x: Link): Value {
  return new Vectorized(y, x.Call()).get((y: Value, x: Value) => Math.atan2(AsNumber(y), AsNumber(x)));
}

function ToBase(v: Value, base: Link): Value {
  return new Vectorized(v, base.Call()).get((v, base)=>{
    let n = Math.abs(AsNumber(v)) >>> 0;
    let b = AsNumber(base);
    if(typeof(base) === "string") b = base.length;
    b = Math.max(1, AsNumber(b)) >>> 0;
    let l: Value[] = [];
    if(b === 1)
      l = [0].repeat(n)
    else{
      while(n > 0){
        l.unshift(n % b);
        n = (n / b) >>> 0;
      }
    }
    if(typeof(base) === "string")
      return l.map(c=>base.charAt(AsNumber(c))).join('');
    return l;
  });
}

function FromBase(list: Value, base: Link): Value {
  return new Vectorized(base.Call()).get(base=>{
    let l = AsList(list);
    if(typeof(base) === 'string'){
      l = l.map(c=>AsString(base).indexOf(AsString(c)));
      base = base.length;
    }
    base = Math.max(1, AsNumber(base)) >>> 0;
    if(base === 1)
      return l.length;
    let n = 0;
    while(l.length){
      n *= base;
      n += AsNumber(l.pop());
    }
    return n;
  });
}

function TranslateBase(list: Value, fromBase: Link, toBase: Link) {
  return new Vectorized(fromBase.Call(), toBase.Call()).get((fromBase, toBase)=>{
    let l = AsList(list);
    let fB = AsNumber(fromBase);
    if(typeof(fromBase) === 'string'){
      fB = fromBase.length;
      l = l.map(c=>fromBase.indexOf(AsString(c)));
    }
    let tB = AsNumber(toBase);
    if(typeof(toBase) === "string") tB = toBase.length;
    l = l.fromToBase(fB, tB);
    if(typeof(toBase) === "string")
      return l.map(c=>toBase.charAt(AsNumber(c))).join('');
    return l;
  })
}

function ToBinary(n: Value): Value {
  return new Vectorized(n).get(n=>AsNumber(n).toString(2));
}
function FromBinary(b: Value): Value {
  return new Vectorized(b).get(n=>+('0b'+AsString(n)));
}
function ToHex(n: Value): Value {
  return new Vectorized(n).get(n=>AsNumber(n).toString(16));
}
function FromHex(h: Value): Value {
  return new Vectorized(h).get(n=>+('0x'+AsString(n)));
}

function ToNumber(left: Value): Value {
  return AsNumber(left);
}

QRegister("Add", Add, "+", 0x50, "+");
QRegister("Subtract", Subtract, "-", 0x51, "-");
QRegister("Multiply", Multiply, "*", 0x52, "*");
QRegister("Divide", Divide, "/", 0x53, "/");
QRegister("Modulo", Modulo, "%", 0x54, "%");
QRegister("Power", Power, "^", 0x55, "^");
QRegister("And", And, "&", 0x56, "&&");
QRegister("Or", Or, "|", 0x57, "||");
QRegister("Not", Not, "¬", 0x58, "!");
QRegister("Equal", Equal, "=", 0x59, "=");
QRegister("NotEqual", NotEqual, "≠", 0x5a, "!=");
QRegister("Greater", Greater, ">", 0x5b, ">");
QRegister("Less", Less, "<", 0x5c, "<");
QRegister("GreaterEqual", GreaterEqual, "≥", 0x5d, ">=");
QRegister("LessEqual", LessEqual, "≤", 0x5e, "<=");
QRegister("Compare", Compare, "≡", 0x5f, "<>");
QRegister("Sqrt", Sqrt, "√", 0x60);
QRegister("Square", Square, "²", 0x61);
QRegister("Cubed", Cubed, "³", 0x62);
QRegister("Sign", Sign, "±", 0x63);
QRegister("Factorial", Factorial, "!", 0x64);
QRegister("BitwiseOr", BitwiseOr, "|₂", 0x65, '|');
QRegister("BitwiseAnd", BitwiseAnd, "&₂", 0x66, '&');
QRegister("BitwiseXor", BitwiseXor, "~", 0x67, '~');
QRegister("BitshiftLeft", BitshiftLeft, "«", 0x68, '<<');
QRegister("BitshiftRight", BitshiftRight, "»", 0x69, '>>');
QRegister("RandomDecimal", RandomDecimal, "r₀", 0x6A)
QRegister("RandomInteger", RandomInteger, "r₁", 0x6B)
QRegister("RandomFloat", RandomFloat, "r₂", 0x6C)
QRegister("LogE", LogE, "l", 0x6D);
QRegister("Log", Log, "lₓ", 0x6E);
QRegister("PrimeFactors", PrimeFactors, "f₁", 0x6F);
QRegister("Factors", Factors, "f", 0x70);
QRegister("IsPrime", IsPrime, "′", 0x71);
QRegister("Sin", Sin, "◿", 0x72);
QRegister("Cos", Cos, "◹", 0x73);
QRegister("Tan", Tan, "◸", 0x74);
QRegister("ASin", ASin, "◿₋", 0x75);
QRegister("ACos", ACos, "◹₋", 0x76);
QRegister("ATan", ATan, "◸₋", 0x77);
QRegister("ATan2", ATan2, "◸₂", 0x78);
QRegister("ToNumber", ToNumber, "N", 0x43);
QRegister("ToBase", ToBase, "b", 0x44);
QRegister("FromBase", FromBase, "b₋", 0x45);
QRegister("TranslateBase", TranslateBase, "bₓ", 0x46);
QRegister("ToBinary", ToBinary, "β", 0x47);
QRegister("FromBinary", FromBinary, "β₋", 0x48);
QRegister("ToHex", ToHex, "η", 0x49);
QRegister("FromHex", FromHex, "η₋", 0x4A);