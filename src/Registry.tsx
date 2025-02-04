import { Behaviour } from "./Types";

export let ByteMap: Map<number, string> = new Map();
export let CharMap: Map<string, number> = new Map();

export let NamesToBytes: Map<string, number> = new Map();
export let BytesToNames: Map<number, string> = new Map();

export let Behaviours: Map<number, Behaviour> = new Map();

const ASSERT_UNIQUE = true;

// Substring numbers
// ₀₁₂₃₄₅₆₇₈₉ₓ₊₋

export function FromCharacters(charCode: string): Uint8Array {
  const chars = [...charCode.matchAll(/¿[0-9A-Fa-f]{2}\?|.[₀-₉ₓ₊₋]?/g)];
  const res = new Uint8Array(chars.length);
  let i = 0;
  for (const c of chars) {
    if (c[0][0] === "¿") {
      res[i++] = +`0x${c[0].substring(1, 3).toLowerCase()}`;
    } else {
      if (!CharMap.has(c[0]))
        throw new Error(`No conversion for character '${c}'`);
      res[i++] = CharMap.get(c[0])!;
    }
  }
  return res;
}

export function ToCharacters(byteCode: Uint8Array): string {
  let s = "";
  for (const b of byteCode) {
    if (!ByteMap.has(b)) {
      s += `¿${b < 16 ? "0" : ""}${b.toString(16)}?`;
    } else {
      s += ByteMap.get(b)!;
    }
  }
  return s;
}

export function Register(
  name: string,
  char: string,
  byte: number,
  behaviour: Behaviour,
  ...aliases: string[]
) {
  if(!char.match(/^.[₀-₉ₓ₊₋]?$/))
    throw new Error(`Bad character representation for "${name}". "${char}" is not a valid token`)
  if (ASSERT_UNIQUE) {
    if (ByteMap.has(byte))
      throw new Error(
        `Duplicate bytecode defined [${name}, ${char}, 0x${byte.toString(
          16
        )}] (Already defined as ${ByteMap.get(byte)} : ${BytesToNames.get(
          byte
        )})`
      );
    if (CharMap.has(char))
      throw new Error(
        `Duplicate charcode defined [${name}, ${char}, 0x${byte.toString(
          16
        )}] (Already defined as ${CharMap.get(char)} : ${BytesToNames.get(
          CharMap.get(char)!
        )})`
      );
    if (NamesToBytes.has(name))
      throw new Error(
        `Duplicate name defined [${name}, ${char}, 0x${byte.toString(
          16
        )}] (Already defined as ${NamesToBytes.get(name)} : ${ByteMap.get(
          NamesToBytes.get(name)!
        )})`
      );
  }
  ByteMap.set(byte, char);
  CharMap.set(char, byte);
  NamesToBytes.set(name.toLowerCase(), byte);
  BytesToNames.set(byte, name.toLowerCase());
  Behaviours.set(byte, behaviour);
  for (const alias of aliases) {
    NamesToBytes.set(alias.toLowerCase(), byte);
  }
}

export function QRegister(
  behaviourName: string,
  behaviour: Behaviour,
  char: string,
  byte: number,
  ...aliases: string[]
) {
  Register(behaviourName, char, byte, behaviour, ...aliases);
}

declare global {
  interface Function {
    Register: (char: string, byte: number) => void;
  }
}

Register("chainseperator", "§", 0x0a, () => {
  throw new Error("Don't evaluate me!");
});
