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

QRegister(ByteString, '"', 0x20);
QRegister(SingletonByte, "'", 0x21);
QRegister(SmazString, "»", 0x22);
QRegister(SingletonSmaz, "›", 0x23);

function EmptyString(this: Link): Value {
  return "";
}

function Space(this: Link): Value {
  return " ";
}

QRegister(EmptyString, '"₀', 0x24);
CheekyCompressions.set("", 0x24);
QRegister(Space, " ", 0x25);
CheekyCompressions.set(" ", 0x25);
