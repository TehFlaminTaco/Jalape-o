import { FromCharacters, ToCharacters } from "./Registry";
import { Value } from "./Types";

/**
 * Converts a non-negative integer to an array of bytes. Each byte is a 7-bit integer, with the most significant bit set to 1 for all but the last byte.
 * Whilst theoretically should support big integers, the current implementation is limited to double precision.
 * @param n A non-negative integer
 */
export function ToInt7(n: number): Uint8Array {
  let byteArr = [];
  while (n > 0) {
    byteArr.push(128 + (n % 128));
    n = Math.floor(n / 128);
  }
  byteArr[0] -= 128;
  return new Uint8Array(byteArr.reverse());
}

/**
 * Converts a string of characters in Jalapeño's character set to a non-negative integer.
 * @param str A string of characters in Jalapeño's character set
 * @param start The index to start parsing from
 * @returns A tuple containing the parsed integer and the index of the next un-consumed character
 */
export function FromInt7(str: Uint8Array, start: number = 0): [number, number] {
  // Int7's are BIG-endian
  let n = 0;
  let i = start;
  while (i < str.length && str[i] >= 128) {
    n = n * 128 + str[i] - 128;
    i++;
  }
  n = n * 128 + str[i];
  return [n, i + 1];
}

export function VectorizedOver(a: Value, f: (x: Value) => Value): Value {
  if (typeof a === "object") return a.map(b=>VectorizedOver(b, f));
  return f(a);
}

declare global {
  interface String {
    capitalizeWords(): string;
  }
  interface Array<T> {
    last(): T;
    fromToBase(sourceBase: number, targetBase: number): number[];
    toInt255(): number[];
    fromInt255(): number[];
  }
  interface Math {
    factorial(n: number): number;
  }
}

/**
 * Capitalizes the first letter of each word in a string. Assumes the string is lower-case to begin with.
 */
String.prototype.capitalizeWords = function (this: string): string {
  return this.replaceAll(/( |^)\w/g, (c) => c.toUpperCase());
};

Array.prototype.last = function <T>(this: Array<T>): T {
  return this[this.length - 1];
};

Array.prototype.fromToBase = function (
  this: number[],
  sourceBase: number,
  targetBase: number
): number[] {
  let result: number[] = [];
  for (let digit of this) {
    let carry = digit;
    for (let i = 0; i < result.length; i++) {
      carry += result[i] * sourceBase;
      result[i] = carry % targetBase;
      carry = Math.floor(carry / targetBase);
    }
    while (carry > 0) {
      result.push(carry % targetBase);
      carry = Math.floor(carry / targetBase);
    }
  }
  result.reverse();
  return result;
};

Array.prototype.toInt255 = function (this: Array<number>): number[] {
  return this.fromToBase(256, 255);
};
Array.prototype.fromInt255 = function (this: Array<number>): number[] {
  return this.fromToBase(255, 256);
};

Math.factorial = function (n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};
