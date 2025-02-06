import { FromInt7, ToInt7 } from "./Helpers";
import { CallChainIndex } from "./Links/CallChain";
import { NumberConstant } from "./Links/NumberConstant";
import { decompress } from "@remusao/smaz";
import {
  NamesToBytes,
  CharMap,
  FromCharacters,
  ByteMap,
  BytesToNames,
  ToCharacters,
  Behaviours,
} from "./Registry";
import { CompressString } from "./Links/StringConstant";
import { Behaviour, Chain, Link, Value } from "./Types";
import { Global } from "./GlobalState";
import { InputIndexLink } from "./Links/Input";

/*
When converting from Verbose source to bytecode (And thus, character code)
 there are a few things to consider:

Functions:
    These are things like `permutations` or `sum` and do not contain any fancy charcters
Labels:
    These take the form of `MAIN:` and `$MAIN` for defining and calling respectively.
    These split up links
Constants:
    Either strings eg. `"Hello, World!"` or numbers `1`
    These should be replaced by the most optimal option when possible.
Brackets:
    `{ }` used to seperate context of links.
    By default, arguments will take exactly one link per argument
    To modify the result of a link of an argument, eg. `filter { length == 5 }`
     (rather than filtering by length, and checking that the result of the filter is == 5)
     We need to somehow bind `length` to the next link of `== 5`
     When brackets are used, it will either prefix it with a `join2`, `join3` or relevant func
     OR it will use bracket functions, which take 2 bytes instead of 1 :(
*/

const TheBeast =
  /(?<comment>#.+)|(?<string>"(?:[^"]|\\[\0-\xff])*")|(?<number>-?\d+(?:\.\d*)?|-?\d*(?:\.\d+)|-?0(?:[xX][a-fA-F0-9]+|[bB][01]+|[oO][0-7]+))|:(?<label>[\w_0-9]+)|\$(?<callLabel>[\w_0-9]+)|(?<operator>\|\||\&\&|==|<=|>=|\.\.|<>|[!@$%^&*()-=+|<>,.?/\\:;])|(?<bracket>[{}])|(?<func>[\w_0-9]+)/gim;

export let LastLabelNames: string[] = [];

export function ParseVerbose(verboseText: string): string {
  let s = "";

  const Labels: Map<string, number> = new Map();
  let ChainIndex = 0;
  let chunked = [...verboseText.matchAll(TheBeast)];
  LastLabelNames = [];
  for (let i = 0; i < chunked.length; i++) {
    let part = chunked[i];
    if (part.groups === undefined) continue;
    let label = (part.groups["label"] ?? "").trim();
    if (label !== "") {
      LastLabelNames.push(label);
      Labels.set(label.toLowerCase(), ChainIndex++);
    }
  }

  ChainIndex = 0;

  for (let i = 0; i < chunked.length; i++)
    try {
      let part = chunked[i];
      if (part.groups === undefined) continue;
      let bracket = (part.groups["bracket"] ?? "").trim();
      let callLabel = (part.groups["callLabel"] ?? "").trim();
      let comment = (part.groups["comment"] ?? "").trim();
      let func = (part.groups["func"] ?? "").trim().toLowerCase();
      let label = (part.groups["label"] ?? "").trim();
      let number = (part.groups["number"] ?? "").trim();
      let operator = (part.groups["operator"] ?? "").trim();
      let string = (part.groups["string"] ?? "").trim();
      if (operator !== "") func = operator;
      if (comment !== "") continue;
      if (callLabel !== "") {
        let ind = Labels.get(callLabel.toLowerCase());
        if (ind === undefined) throw new Error(`Unknown label: ${callLabel}`);
        s += CallChainIndex(ind);
        continue;
      }
      if (bracket !== "") {
        s += bracket;
        continue;
      }
      if (func !== "") {
        if (!NamesToBytes.has(func)) throw new Error(`Unknown method: ${func}`);
        s += ByteMap.get(NamesToBytes.get(func)!)!;
        continue;
      }
      if (label !== "") {
        s += "§";
        ChainIndex++;
        continue;
      }
      if (number !== "") {
        s += NumberConstant(+number);
        continue;
      }
      if (string !== "") {
        s += ToCharacters(CompressString(JSON.parse(string)).reverse());
      }
    } catch (e) {
      let part = chunked[i];
      let ind = part.index;
      let line = verboseText.substring(0, ind).replace(/[^\n]+/g, "").length;
      let index = verboseText.substring(0, ind).replace(/.*\n/s, "").length;
      throw new Error(`Parsing error at ${line + 1}:${index}\n${e}`);
    }
  return s;
}

class PseudoLink {
  code: number;
  children: PseudoLink[] = [];
  store: { [key: string]: any } = {};

  constructor(code: number) {
    this.code = code;
  }

  ReEmit(): Uint8Array {
    let bytes = [this.code];
    switch (this.code) {
      case 0xc4:
        // Bracket
        for (let child of this.children) {
          bytes.push(...child.ReEmit());
        }
        break;
      case 0xc5:
        // End bracket
        for (let child of this.children.reverse()) {
          bytes.splice(0, 0, ...child.ReEmit());
        }
        if (!this.store["dontemitstart"]) bytes.splice(0, 0, 0xc4);
        break;
      case 0x3e:
        // Integer
        bytes.splice(0, 0, ...ToInt7(this.store["integer"]).reverse());
        break;
      case 0x3f:
        // Float
        let exp = 0;
        let n = this.store["float"];
        while (n % 1 > 0.0000001) {
          // 0.0000001 is arbitrary, but it's a good enough approximation for our purposes
          n *= 10;
          exp++;
        }
        bytes.splice(0, 0, ...ToInt7(+n).reverse());
        bytes.splice(0, 0, exp);
        break;
      case 0x20:
      case 0x21:
      case 0x22:
      case 0x23: {
        // Strings
        bytes.splice(0, 0, ...(this.store["bytes"] as number[]));
        break;
      }
    }
    return new Uint8Array(bytes);
  }
}

function SimplifyBlocks(chain: PseudoLink[]): PseudoLink[] {
  // Iterate through the chain for any 0xc5 or 0xc4 links, and try to optimize them into nGroups
  for (let i = chain.length - 1; i >= 0; i--) {
    let plink = chain[i];
    plink.children = SimplifyBlocks(plink.children);
    if (plink.code !== 0xc4 && plink.code !== 0xc5) continue;
    // Iterate through the children of this link, and count how many required LINKS there are.
    let linkCount = 0;
    for (let j = plink.children.length - 1; j >= 0; j--) {
      let child = plink.children[j];
      let expectedMethod = Behaviours.get(child.code);
      if (expectedMethod === undefined) {
        console.error(`Unknown method: ${BytesToNames.get(child.code)}`);
        continue;
      }
      let argCount = Math.max(expectedMethod.length - 1, 0);
      linkCount -= argCount;
      if (linkCount < 0) break;
      linkCount++;
    }
    switch (linkCount) {
      case 0:
        // This can be a no-op instead. Replace it.
        chain.splice(i, 1, new PseudoLink(0x00));
        break;
      case 1:
        // This should just be the children, the block isn't used.
        chain.splice(i, 1, ...plink.children);
        break;
      case 2:
      case 3:
      case 4:
      case 5:
        // This is a group2, group3, group4, group5
        chain.splice(i, 1, new PseudoLink(0xc4 + linkCount), ...plink.children);
        break;
      default:
        // Standard block behaviour is fine, explcitiely do nothing.
        break;
    }
  }

  return chain;
}

function TrimPseudoChain(
  chain: PseudoLink[],
  chainIndex: number
): PseudoLink[] {
  chain = SimplifyBlocks(chain);
  // if the start of this chain is a 0xc5 end bracket, we don't need to emit a 0xC4 start bracket when re-emitting
  if (chain[0].code === 0xc5) chain[0].store["dontemitstart"] = true;
  // Additionally, any 0xC5 end brackets at the end of the chain can be simplified to 0xc4 start brackets flipwize
  else if (chain[chain.length - 1].code === 0xc5)
    chain[chain.length - 1].code = 0xc4;
  // Any FIRST link that is a 0x22 or 0x23 (A string), and they start (their first byte) with a terminator byte (0xFF), strip it.
  if (chainIndex === 0 && (chain[0].code === 0x22 || chain[0].code === 0x20)) {
    let bytes = chain[0].store["bytes"] as number[];
    if (bytes[0] === 0xff) bytes.shift();
  }
  return chain;
}

export function TrimPseudoLinks(links: PseudoLink[]): PseudoLink[] {
  // First, split links by 0x0A (Chain seperator)
  if (links.length === 0) return [];
  let currentChain: PseudoLink[] = [];
  let chains: PseudoLink[][] = [currentChain];
  for (let link of links) {
    if (link.code === 0x0a) {
      currentChain = [];
      chains.push(currentChain);
    } else {
      currentChain.push(link);
    }
  }
  // Trim any empty chains from the end.
  while (chains[chains.length - 1].length === 0) chains.pop();

  let cindex = 0;
  // Now, for each chain, trim the fat.
  for (let chain of chains) {
    let trimmedChain = TrimPseudoChain(chain, cindex++);
    chain.splice(0, chain.length, ...trimmedChain);
  }

  // Rejoin the chains
  let trimmedLinks: PseudoLink[] = [];
  let first = true;
  for (let chain of chains) {
    if (!first) trimmedLinks.push(new PseudoLink(0x0a));
    first = false;
    for (let link of chain) {
      trimmedLinks.push(link);
    }
  }
  return trimmedLinks;
}

export function ParseAsPseudoLinks(byteCode: Uint8Array): PseudoLink[] {
  let linkStack: PseudoLink[] = [];
  // Go from right to left and pluck out the links
  let i = byteCode.length - 1;
  // Bytes with special parse rules:
  // 0x0A - Chain seperator, split on this byte, if we're parsing we've made a mistake
  // 0xC4 / 0xC5 - Brackets { }, parse inner contents as a single link
  // 0x3E / 0x3F - $ and ‰, define integers and floats respectively.
  // SAVE THIS SPACE: Special qoutes for strings / characters
  while (i >= 0) {
    const byte = byteCode[i];
    switch (byte) {
      case 0xc4: {
        // This is a start bracket with no matched end bracket
        // So just take the whole linkStack and wrap it in a bracket
        let bracket = new PseudoLink(0xc4);
        bracket.children = linkStack.reverse();
        linkStack = [bracket];
        break;
      }
      case 0xc5: {
        // Find the matching start bracket of the same depth.
        let d = 0;
        let endBracket = i;
        while (i >= 0) {
          let b = byteCode[i];
          if (b === 0x0a) break; // Chain seperator, we're done
          if (b === 0xc5) d++; // Immediately, we'll find a }, which increases the depth
          if (b === 0xc4) d--; // WHen we find the last {, we'll have d === 0
          if (b === 0x3e) {
            // Number constant, the next few bytes are in Int7 format
            i--;
            while (byteCode[i] >= 0x80) i--;
          }
          if (b === 0x3f) {
            // Float constant, the next few bytes are in Int7 format with an additional exponent byte
            i--;
            while (byteCode[i] >= 0x80) i--;
            i--;
          }
          if (b === 0x20 || b === 0x22) {
            // Bytestring or Smazstring
            i--;
            while (byteCode[i] !== 0xff) i--;
          }
          if (b === 0x21 || b === 0x23) {
            // Singleton byte or singleton smaz
            i--;
          }
          if (d === 0) break;
          i--;
        }
        // i is now the index of the matching start bracket
        // Parse the contents of the bracket
        let brac = new PseudoLink(0xc5);
        brac.children = ParseAsPseudoLinks(byteCode.slice(i + 1, endBracket));
        linkStack.push(brac);
        break;
      }
      case 0x3e: {
        // Integer constant, the next few bytes are in Int7 format
        let int7bytes = [];
        i--;
        while (byteCode[i] >= 0x80) {
          int7bytes.push(byteCode[i]);
          i--;
        }
        int7bytes.push(byteCode[i]);
        let numberLink = new PseudoLink(0x3e);
        numberLink.store["integer"] = FromInt7(new Uint8Array(int7bytes))[0];
        linkStack.push(numberLink);
        break;
      }
      case 0x3f: {
        // Float constant, the next few bytes are in Int7 format with an additional exponent byte
        let int7bytes = [];
        i--;
        while (byteCode[i] >= 0x80) {
          int7bytes.push(byteCode[i]);
          i--;
        }
        int7bytes.push(byteCode[i]);
        let exponent = byteCode[i - 1];
        i--;
        let floatLink = new PseudoLink(0x3f);
        floatLink.store["float"] =
          FromInt7(new Uint8Array(int7bytes))[0] / 10 ** exponent;
        linkStack.push(floatLink);
        break;
      }
      case 0x20: {
        // Bytestring. Terminated by 0x00. Mostly like a smaz string.
        let currentBytes = [];
        i--;
        while (i >= 0 && byteCode[i] !== 0xff) {
          currentBytes.push(byteCode[i]);
          i--;
        }
        let link = new PseudoLink(0x20);
        link.store["string"] = new TextDecoder().decode(
          new Uint8Array(currentBytes.fromInt255())
        );
        link.store["bytes"] = [0xff, ...currentBytes.reverse()];
        linkStack.push(link);
        break;
      }
      case 0x21: {
        // Singleton byte. Insanely simple.
        i--;
        let link = new PseudoLink(0x21);
        link.store["string"] = String.fromCharCode(byteCode[i]);
        link.store["bytes"] = [byteCode[i]];
        linkStack.push(link);
        break;
      }
      case 0x22: {
        // Smazstring, Terminated by 0x00. Mostly like a byte string.
        let currentBytes = [];
        i--;
        while (i >= 0 && byteCode[i] !== 0xff) {
          currentBytes.push(byteCode[i]);
          i--;
        }
        let link = new PseudoLink(0x22);
        link.store["string"] = decompress(
          new Uint8Array(currentBytes.fromInt255())
        );
        link.store["bytes"] = [0xff, ...currentBytes.reverse()];
        linkStack.push(link);
        break;
      }
      case 0x23: {
        // Smaz singleton. Not as simple.
        i--;
        let link = new PseudoLink(0x23);
        link.store["string"] = decompress(new Uint8Array([byteCode[i]]));
        link.store["bytes"] = [byteCode[i]];
        linkStack.push(link);
        break;
      }
      default: {
        // Normal byte just push it to the stack
        linkStack.push(new PseudoLink(byte));
      }
    }
    i--;
  }
  return linkStack.reverse();
}

export function Compile(pLinks: PseudoLink[]): Chain[] {
  if (pLinks.length === 0) return [];
  // Iterate through pLinks right to left, building Links as needed
  let linkStack: Link[] = [];
  let chains: Link[][] = [linkStack];
  for (let i = pLinks.length - 1; i >= 0; i--) {
    let pLink = pLinks[i];
    if (pLink.code === 0x0a) {
      linkStack = [];
      chains.push(linkStack);
      continue;
    }
    let knownMethod = Behaviours.get(pLink.code);
    if (!knownMethod)
      throw new Error(`Unknown method: ${BytesToNames.get(pLink.code)}`);
    let argCount = Math.max(knownMethod.length - 1, 0); // -1 because the first argument is the left value
    let args = linkStack.splice(0, argCount);
    // If args count is still less than the required arguments, we add a bunch of fake links from input 1
    let inputIndex = 1;
    while (args.length < argCount) {
      args.push(InputIndexLink(inputIndex++));
    }
    let link = new Link(knownMethod, args);
    link.store = pLink.store;
    link.store["children"] = Compile(pLink.children);
    linkStack.unshift(link);
  }
  return chains.map((c) => new Chain(c)).reverse();
}

export function Evaluate(chains: Chain[], first: Value): Value {
  Global.Chains = chains;
  return chains.last().Call(first);
}
