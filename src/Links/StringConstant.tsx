import { QRegister } from "../Registry";
import { Link, Value } from "../Types";
import { compress } from "@remusao/smaz";

let CheekyCompressions: Map<string, number> = new Map();

export function CompressString(text: string): Uint8Array {
  if (CheekyCompressions.has(text))
    return new Uint8Array([CheekyCompressions.get(text)!]);
  let smazhed = compress(text);
  let bytes = new TextEncoder().encode(text);
  if (smazhed.length < bytes.length) {
    if (smazhed.length === 1) return new Uint8Array([0x23, ...smazhed]);
    return new Uint8Array([0x22, ...[...smazhed].toInt255()].concat([0xff]));
  }

  if (bytes.length === 1) return new Uint8Array([0x21, ...bytes]);
  return new Uint8Array([0x20, ...[...bytes].toInt255()].concat([0xff]));
}

function SmazString(this: Link): Value {
  return this.store["string"];
}

function ByteString(this: Link): Value {
  return this.store["string"];
}

function SingletonSmaz(this: Link): Value {
  return this.store["string"];
}

function SingletonByte(this: Link): Value {
  return this.store["string"];
}

QRegister("ByteString", ByteString, '"', 0x20);
QRegister("SingletonByte", SingletonByte, "'", 0x21);
QRegister("SmazString", SmazString, "„", 0x22);
QRegister("SingletonSmaz", SingletonSmaz, "›", 0x23);

function EmptyString(): Value {
  return "";
}

function Space(): Value {
  return " ";
}

function CapitalAlphabet(): Value {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
}

function LowercaseAlphabet(): Value {
  return "abcdefghijklmnopqrstuvwxyz";
}

function PrintableAscii(): Value {
  return " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
}

function AlphaNumeric(): Value {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
}

function Digits(): Value {
  return "0123456789"
}

QRegister("EmptyString", EmptyString, '"₀', 0x24);
CheekyCompressions.set("", 0x24);
QRegister("Space", Space, " ", 0x25);
CheekyCompressions.set(" ", 0x25);
QRegister("CapitalAlphabet", CapitalAlphabet, 'A', 0x26);
CheekyCompressions.set("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 0x26);
QRegister("LowercaseAlphabet", LowercaseAlphabet, 'a', 0x27);
CheekyCompressions.set("abcdefghijklmnopqrstuvwxyz", 0x27);
QRegister("PrintableAscii", PrintableAscii, "¢₁", 0x28);
CheekyCompressions.set(" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~", 0x28);
QRegister("AlphaNumeric", AlphaNumeric, 'A₀', 0x9F)
CheekyCompressions.set("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 0x9F);
QRegister("Digits", Digits, '0₉', 0x9E);
CheekyCompressions.set("0123456789", 0x9E);