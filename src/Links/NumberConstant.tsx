import { Value, Link } from "../Types";
import { QRegister, ToCharacters } from "../Registry";
import { FromInt7, ToInt7 } from "../Helpers";

function NegativeOne(): Value {
  return -1;
}

function Half(): Value {
  return 0.5;
}

function OneHundred(): Value {
  return 100;
}

function Zero(): Value {
  return 0;
}

function One(): Value {
  return 1;
}

function Two(): Value {
  return 2;
}

function Three(): Value {
  return 3;
}

function Four(): Value {
  return 4;
}

function Five(): Value {
  return 5;
}

function Six(): Value {
  return 6;
}

function Seven(): Value {
  return 7;
}

function Eight(): Value {
  return 8;
}

function Nine(): Value {
  return 9;
}

function Ten(): Value {
  return 10;
}

function Pi(): Value {
  return Math.PI;
}

function E(): Value {
  return Math.E;
}

function IntegerConstant(this: Link): Value {
  return this.store["integer"];
}
function FloatConstant(this: Link): Value {
  return this.store["float"];
}

export function NumberConstant(n: number): string {
  if (n === -1) return `-₁`;
  if (n === 0.5) return `½`;
  if (n === 100) return "e₂";
  if (n < 0) return `-${NumberConstant(-n)}`;
  if (n % 1 === 0 && n >= 0 && n <= 9) {
    return `${n >>> 0}`;
  }
  if (n === 10) return "e₁";
  if (n % 1 === 0) {
    return `${ToCharacters(ToInt7(n).reverse())}\$`;
  } else {
    // A power of 2 exponent is more true to the defintion of a float, but we care more about intention, so we're using a power of 10
    let exp = 0;
    while (n % 1 > 0.0000001) {
      // 0.0000001 is arbitrary, but it's a good enough approximation for our purposes
      n *= 10;
      exp++;
    }

    return `${ToCharacters(new Uint8Array([exp]))}${ToCharacters(
      ToInt7(n).reverse()
    )}‰`;
  }
}

QRegister("Zero", Zero, "0", 0x30);
QRegister("One", One, "1", 0x31);
QRegister("Two", Two, "2", 0x32);
QRegister("Three", Three, "3", 0x33);
QRegister("Four", Four, "4", 0x34);
QRegister("Five", Five, "5", 0x35);
QRegister("Six", Six, "6", 0x36);
QRegister("Seven", Seven, "7", 0x37);
QRegister("Eight", Eight, "8", 0x38);
QRegister("Nine", Nine, "9", 0x39);
QRegister("Ten", Ten, "e₁", 0x3a);
QRegister("OneHundred", OneHundred, "e₂", 0x3b);
QRegister("NegativeOne", NegativeOne, "-₁", 0x3c);
QRegister("Half", Half, "½", 0x3d);
QRegister("IntegerConstant", IntegerConstant, "$", 0x3e);
QRegister("FloatConstant", FloatConstant, "‰", 0x3f);
QRegister("Pi", Pi, "π", 0x41)
QRegister("E", E, "e", 0x42)