import { Behaviours, ByteMap, BytesToNames, CharMap, NamesToBytes } from "./Registry";

export class Metas {
    static structures: Map<string, string> = new Map();
    static descriptions: Map<string, string> = new Map();

    static getStructure(name: string): string | undefined {
        return Metas.structures.get(name);
    };
    static getDescription(name: string): string | undefined {
        return Metas.descriptions.get(name);
    }
    static set(name: string, structure: string, description: string){
        this.structures.set(name, structure);
        this.descriptions.set(name, description);
    }
    static has(name: string){
        return this.structures.has(name);
    }
}

/* 0 */ Metas.set("noop", "noop", "noop()\n\nReturns nothing")
/* 1 */ Metas.set("format1", "stringFormat: format1 arg0", "(stringFormat: string).format1(arg0: string)=>string\nVectorized\n\nReturns stringFormat with all instances of %x replaced with the respective argument index.")
/* 2 */ Metas.set("format2", "stringFormat: format2 arg0, arg1", "(stringFormat: string).format2(arg0: string, arg1: string)=>string\nVectorized\n\nReturns stringFormat with all instances of %x replaced with the respective argument index.")
/* 3 */ Metas.set("format3", "stringFormat: format3 arg0, arg1, arg2", "(stringFormat: string).format3(arg0: string, arg1: string, arg2: string)=>string\nVectorized\n\nReturns stringFormat with all instances of %x replaced with the respective argument index.")
/* 4 */ Metas.set("formatx", "stringFormat: formatx arguments", "(stringFormat: string).formatx(arguments: string[])=>string\nVectorized\n\nReturns stringFormat with all instances of %x replaced with the respective argument index.")
/* 5 */
/* 6 */
/* 7 */
/* 8 */
/* 9 */
/* a */ Metas.set("chainseperator", "chainseperator", "chainseperator\nMeta\n\nSeperates two chains. Not a function.")
/* b */
/* c */ Metas.set("grid", "text: grid", "(text: string).grid()=>string[][]\nVectorized\n\nReturns text split by lines then characters.");
/* d */ Metas.set("joingrid", "grid: joingrid", "(grid: string[][]).joingrid()=>string\n\nReturns grid joined by lines then characters");
/* e */ Metas.set("padleft", "text: padleft padding, count", "(text: string|any[]).padleft(padding: any, count: number)=>string|any[]\nVectorized\n\nPads text with padding to the left until length count.");
/* f */ Metas.set("padright", "text: padright padding, count", "(text: string|any[]).padright(padding: any, count: number)=>string|any[]\nVectorized\n\nPads text with padding to the right until length count.");
/* 10 */ Metas.set("print", "left: print", "(left: any).print()\n\nOutputs the left-passed value followed by a newline")
/* 11 */ Metas.set("write", "left: write", "(left: any).write()\n\nOutputs the left-passed value and nothing else")
/* 12 */ Metas.set("replace", "haystack: replace needle, replacement", "(haystack: string).replace(needle: string, replacement: (string...)=>string)=>string\nVectorized\n\nReplaces all instances of the needle RegExp via replacement.")
/* 13 */ Metas.set("split", "text: split deliminator", "(text: string).split(deliminator: string)=>string[]\nVectorized\n\nSplits the left string by the deliminator RegExp.")
/* 14 */ Metas.set("join", "list: join", "(list: string[]).join()=>string\n\nConcatenates all the values of list together")
/* 15 */ Metas.set("joinby", "list: joinby deliminator", "(list: string[]).joinby(deliminator)=>string\n\nConcatenates all the values of list together by a deliminator")
/* 16 */ Metas.set("joinwords", "list: joinwords", "(list: string[]).joinwords()=>string\n\nJoins list by spaces.")
/* 17 */ Metas.set("joinlines", "list: joinlines", "(list: string[]).joinlines()=>string\n\nJoins list by newlines.")
/* 18 */ Metas.set("words", "left: words", "(left: string).words()=>string[]\nVectorized\n\nSplit the text left by spaces")
/* 19 */ Metas.set("chars", "left: chars", "(left: string).chars()=>string[]\nVectorized\n\nSplit the text left into individual characters")
/* 1a */ Metas.set("lines", "left: lines", "(left: string).lines()=>string[]\nVectorized\n\nSplit the text left by newlines")
/* 1b */ Metas.set("match", "haystack: match needle", "(haystack: string).match(needle: string)=>string|string[]\nVectorized\n\nReturns the first instance of the matched RegExp needle in haystack. If needle has groups, returns an array.")
/* 1c */ Metas.set("matches", "haystack: matches needle", "(haystack: string).matches(needle: string)=>(string|string[])[]\nVectorized\n\nReturns all instances of the matched RegExp needle in haystack. If needel has groups, each instance returns as an array.")
/* 1d */ Metas.set("tostring", "left: tostring", "(left: any).tostring()=>string\n\nStringifies the left value.")
/* 1e */ Metas.set("byte", "character: byte", "(character: string).byte()=>number|number[]\nVectorized\n\nReturns the character code of 'character'. If 'character' is longer than 1, returns an array")
/* 1f */ Metas.set("char", "ordinal: char", "(ordinal: number).char()=>string\nVectorized\nReturns the string represented by character code 'ordinal'")
/* 20 */ Metas.set("bytestring", "bytestring", "bytestring\nMeta\n\nUsed to define a string of bytes.")
/* 21 */ Metas.set("singletonbyte", "singletonbyte", "singletonbyte\nMeta\n\nUsed to reference a single byte")
/* 22 */ Metas.set("smazstring", "smazstring", "smazstring\nMeta\n\nUsed to define a string of compressed bytes")
/* 23 */ Metas.set("singletonsmaz", "singletonsmaz", "singletonsmaz\nMeta\nUsed to reference a single compressed byte")
/* 24 */ Metas.set("emptystring", "emptystring", "emptystring()=>string\n\nReturns an empty string.")
/* 25 */ Metas.set("space", "space", "space()=>string\n\nReturns a single space")
/* 26 */ Metas.set("capitalalphabet", "capitalalphabet", "capitalalphabet()=>\n\nReturns the entire alphabet in uppercase")
/* 27 */ Metas.set("lowercasealphabet", "lowercasealphabet", "lowercasealphabet()=>\n\nReturns the entire alphabet in lowercase")
/* 28 */ Metas.set("printableascii", "printableascii", "printableascii()=>\n\nReturns the entire printable ascii range")
/* 29 */ Metas.set("pair", "left: pair any", "(left: any[]).pair(right: any)=>any[]\n\nConcatenates right to the end of left. If left isn't an array yet, boxes it.")
/* 2a */ Metas.set("emptylist", "left: emptylist", "emptylist()=>any[]\n\nReturns an empty list.")
/* 2b */ Metas.set("upper", "str: upper", "(str: string).upper()=>string\nVectorized\n\nReturns str as an uppercase string")
/* 2c */ Metas.set("lower", "str: lower", "(str: string).lower()=>string\nVectorized\n\nReturns str as a lowercase string")
/* 2d */ Metas.set("capitalizewords", "str: capitalizewords", "(str: string).capitalizewords()=>string\nVectorized\n\nReturns str with the start of each space delimiated 'word' capitalized")
/* 2e */ Metas.set("to", "start: to end", "(start: any).to(end: any)=>any\n\nIf start and end are numbers, returns a list of numbers from start to end inclusive.\nIf start or end are lists, concatenates the lists together\nIf start or end are strings, concatenates the strings together")
/* 2f */ Metas.set("box", "box value", "box(value: any)=>any[]\n\nReturns a list contaning only value.")
/* 30 */ Metas.set("zero", "zero", "zero()=>number\n\nReturns the constant number zero")
/* 31 */ Metas.set("one", "one", "one()=>number\n\nReturns the constant number one")
/* 32 */ Metas.set("two", "two", "two()=>number\n\nReturns the constant number two")
/* 33 */ Metas.set("three", "three", "three()=>number\n\nReturns the constant number three")
/* 34 */ Metas.set("four", "four", "four()=>number\n\nReturns the constant number four")
/* 35 */ Metas.set("five", "five", "five()=>number\n\nReturns the constant number five")
/* 36 */ Metas.set("six", "six", "six()=>number\n\nReturns the constant number six")
/* 37 */ Metas.set("seven", "seven", "seven()=>number\n\nReturns the constant number seven")
/* 38 */ Metas.set("eight", "eight", "eight()=>number\n\nReturns the constant number eight")
/* 39 */ Metas.set("nine", "nine", "nine()=>number\n\nReturns the constant numbernine")
/* 3a */ Metas.set("ten", "ten", "ten()=>number\n\nReturns the constant number ten")
/* 3b */ Metas.set("onehundred", "onehundred", "onehundred()=>number\n\nReturns the constant number 100")
/* 3c */ Metas.set("negativeone", "negativeone", "negativeone()=>number\n\nReturns the constant number -1")
/* 3d */ Metas.set("half", "half", "half()=>number\n\nReturns the constant number 0.5")
/* 3e */ Metas.set("integerconstant", "integerconstant", "integerconstant\nMeta\n\nUsed to denote an integer constant.")
/* 3f */ Metas.set("floatconstant", "floatconstant", "floatconstant\nMeta\n\nUsed to denote a floatingpoint constant.")
/* 40 */ Metas.set("negative", "negative value", "negative(value: any)=>any\n\nIf value is a list, returns 0-value.\nIf value is a list or a string, reverses it.")
/* 41 */ Metas.set("pi", "pi", "pi()=>number\n\nReturns the constant value 3.141592653589793")
/* 42 */ Metas.set("e", "e", "e()=>number\n\nReturns the constant value 2.718281828459045")
/* 43 */ Metas.set("tonumber", "left: tonumber", "(left: any).tonumber()=>number\n\nReturns left as a number.");
/* 44 */ Metas.set("tobase", "n: tobase b", "(n: number).tobase(b: number)=>string|number[]\nVectorized\n\nReturns n in base b. If b is a string, returns mapped to the index of characters in b, otherwise, returns a bigendian array");
/* 45 */ Metas.set("frombase", "n: frombase b", "(n: string|number[]).frombase(b: number)=>number\nVectorized\n\nConverts n from base b into a number. Expects an array of numbers expect where b is a string, where it translates from indexes of characters in b");
/* 46 */ Metas.set("translatebase", "n: translatebase from, to", "(n: string|number[]).translatebase(from: number, to: number)=>string|number[]\nVectorized\n\nEffectively frombase(from):tobase(to), but works on arbitrarily large intermediate values");
/* 47 */ Metas.set("tobinary", "n: tobinary", "(n: number).tobinary()=>string\nVectorized\n\nReturns n as a binary string.");
/* 48 */ Metas.set("frombinary", "n: frombinary", "(n: string).frombinary()=>number\nVectorized\n\nReturns the number represented by the binary n.");
/* 49 */ Metas.set("tohex", "n: tohex", "(n: number).tohex()=>string\nVectorized\n\nReturns n as a hexadecimal string");
/* 4a */ Metas.set("fromhex", "n: fromhex", "(n: string).fromhex()=>number\nVectorized\n\nReturns the number represented by the hexadecimal n.");
/* 4b */
/* 4c */
/* 4d */
/* 4e */
/* 4f */
/* 50 */ Metas.set("add", "left: add right", "(left: number).add(right: number)=>number\nVectorized\n\nReturns the value of left + right")
/* 51 */ Metas.set("subtract", "left: subtract right", "(left: number).subtract(right: number)=>number\nVectorized\n\nReturns the value of left - right")
/* 52 */ Metas.set("multiply", "left: multiply right", "(left: number).multiply(right: number)=>number\nVectorized\n\nReturns the value of left * right")
/* 53 */ Metas.set("divide", "left: divide right", "(left: number).divide(right: number)=>number\nVectorized\n\nReturns the value of left / right")
/* 54 */ Metas.set("modulo", "left: modulo right", "(left: number).modulo(right: number)=>number\nVectorized\n\nReturns the value of left % right")
/* 55 */ Metas.set("power", "left: power right", "(left: number).power(right: number)=>number\nVectorized\n\nReturns the value of left ^ right")
/* 56 */ Metas.set("and", "left: and right", "(left: number).and(right: number)=>number\nVectorized\n\nReturns the value of left && right")
/* 57 */ Metas.set("or", "left: or right", "(left: number).or(right: number)=>number\nVectorized\n\nReturns the value of left || right")
/* 58 */ Metas.set("not", "condition: not", "(condition: any).not()=>number\n\nReturns the inverse of the truthyness of condition")
/* 59 */ Metas.set("equal", "left: equal right", "(left: any).equal(right: any)=>number\n\nReturns if left is equivilent to right")
/* 5a */ Metas.set("notequal", "left: notequal any", "(left: any).notequal(right: any)=>number\n\nReturns if left is not equivilent to right")
/* 5b */ Metas.set("greater", "left: greater any", "(left: any).greater(right: any)=>number\n\nReturns if left is larger than right. Lexigraphically for lists or strings.")
/* 5c */ Metas.set("less", "left: less any", "(left: any).less(right: any)=>number\n\nReturns if left is smaller than right. Lexigraphically for lists or strings.")
/* 5d */ Metas.set("greaterequal", "left: greaterequal any", "(left: any).greaterequal(right: any)=>number\n\nReturns if left is larger than or equal to right. Lexigraphically for lists or strings.")
/* 5e */ Metas.set("lessequal", "left: lessequal any", "(left: any).lessequal(right: any)=>number\n\nReturns if left is smaller than or equal to right. Lexigraphically for lists or strings.")
/* 5f */ Metas.set("compare", "left: compare right", "(left: any).compare(right: any)=>number\n\nReturns -1 if left is less than right, 1 if left is greater than right, or 0 otherwise.")
/* 60 */ Metas.set("sqrt", "n: sqrt", "(n: number).sqrt()=>number\nVectorized\n\nReturns the square root of n")
/* 61 */ Metas.set("square", "left: square", "(left: number).square()=>number\nVectorized\n\nReturns the value of n^3")
/* 62 */ Metas.set("cubed", "n: cubed", "(n: number).cubed()=>number\nVectorized\n\nReturns the value of n^3")
/* 63 */ Metas.set("sign", "n: sign", "(n: any).sign()=>number\nVectorized\n\nReturns -1 if n is less than 0, 1 if n is greater than 0, or 0 otherwise.")
/* 64 */ Metas.set("factorial", "n: factorial", "(n: number).factorial()=>number\nVectorized\n\nReturns the product of every positive integer lessthan and including n")
/* 65 */ Metas.set("bitwiseor", "left: bitwiseor right", "(left: number).bitwiseor(right: number)=>number\nVectorized\n\nReturns the value of left | right")
/* 66 */ Metas.set("bitwiseand", "left: bitwiseand right", "(left: number).bitwiseand(right: number)=>number\nVectorized\n\nReturns the value of left & right")
/* 67 */ Metas.set("bitwisexor", "left: bitwisexor right", "(left: number).bitwisexor(right: number)=>number\nVectorized\n\nReturns the value of left xor right")
/* 68 */ Metas.set("bitshiftleft", "left: bitshiftleft right", "(left: number).bitshiftleft(right: number)=>number\nVectorized\n\nReturns the value of left << right")
/* 69 */ Metas.set("bitshiftright", "left: bitshiftright right", "(left: number).bitshiftright(right: number)=>number\nVectorized\n\nReturns the value of left >> right")
/* 6a */ Metas.set("randomdecimal", "randomdecimal", "randomdecimal()=>number\n\nReturns a random value between [0,1)")
/* 6b */ Metas.set("randominteger", "max: randominteger", "(max: number|any[]).randominteger()=>number\n\nReturns a random integer between [0,max). If Max is an array, returns a random element from it instead.")
/* 6c */ Metas.set("randomfloat", "max: randomfloat", "(max: number|any[]).randomfloat()=>number\n\nReturns a random floating point number between [0,max). If Max is an array, returns a random element from it instead.")
/* 6d */ Metas.set("loge", "n: loge", "(n: number).loge()=>number\nVectorized\n\nReturns the value of n to the natural log e")
/* 6e */ Metas.set("log", "n: log base", "(n: number).log(base: number)=>number\nVectorized\n\nReturns the value of n to the log base")
/* 6f */ Metas.set("primefactors", "n: primefactors", "(n: number).primefactors()=>number[]\nVectorized\n\nReturns all prime factors of n")
/* 70 */ Metas.set("factors", "n: factors", "(n: number).factors()=>number[]\nVectorized\n\nReturns all factors of n including 1 and n")
/* 71 */ Metas.set("isprime", "n: isprime", "(n: number).isprime()=>number\nVectorized\n\nReturns 1 if n is prime, 0 otherwise")
/* 72 */ Metas.set("sin", "n: sin", "(n: number).sin()=>number\nVectorized\n\nReturns the result of standard trigonometry sin(n)")
/* 73 */ Metas.set("cos", "n: cos", "(n: number).cos()=>number\nVectorized\n\nReturns the result of standard trigonometry cos(n)")
/* 74 */ Metas.set("tan", "n: tan", "(n: number).tan()=>number\nVectorized\n\nReturns the result of standard trigonometry tan(n)")
/* 75 */ Metas.set("asin", "n: asin", "(n: number).asin()=>number\nVectorized\n\nReturns the result of standard trigonometry asin(n)")
/* 76 */ Metas.set("acos", "n: acos", "(n: number).acos()=>number\nVectorized\n\nReturns the result of standard trigonometry acos(n)")
/* 77 */ Metas.set("atan", "n: atan", "(n: number).atan()=>number\nVectorized\n\nReturns the result of standard trigonometry atan(n)")
/* 78 */ Metas.set("atan2", "n: atan2", "(y: number).atan2(x: number)=>number\nVectorized\n\nReturns the result of standard trigonometry atan2(y, x)")
/* 79 */ Metas.set("abs", "n: number", "(n: number).abs()=>number\nVectorized\n\nReturns the absolute value of n");
/* 7a */ Metas.set("floor", "n: floor", "(n: number).floor()\n\nRounds n to negative infinity");
/* 7b */ Metas.set("ceil", "n: ceil", "(n: number).ceil()\n\nRounds n to infinity");
/* 7c */ Metas.set("increment", "left: increment", "(left: number).increment()=>number\nVectorized\n\nReturns the value of left + 1");
/* 7d */ Metas.set("decrement", "left: decrement", "(left: number).decrement()=>number\nVectorized\n\nReturns the value of left - 1");
/* 7e */
/* 7f */
/* 80 */ Metas.set("store0", "value: store0", "(value: any).store0()=>any\n\nStores value into box[0] and returns it")
/* 81 */ Metas.set("store1", "value: store1", "(value: any).store1()=>any\n\nStores value into box[1] and returns it")
/* 82 */ Metas.set("store2", "value: store2", "(value: any).store2()=>any\n\nStores value into box[2] and returns it")
/* 83 */ Metas.set("storex", "value: storex box", "(value: any).storex(box: number)=>any\nVectorized\n\nStores value into box[box] and returns it")
/* 84 */ Metas.set("load0", "load0", "load0()=>any\n\nReturns the value at box[0]")
/* 85 */ Metas.set("load1", "load1", "load1()=>any\n\nReturns the value at box[1]")
/* 86 */ Metas.set("load2", "load2", "load2()=>any\n\nReturns the value at box[2]")
/* 87 */ Metas.set("loadx", "loadx box", "loadx(box: number)=>any\nVectorized\n\nReturns the value at box[box]")
/* 88 */
/* 89 */
/* 8a */
/* 8b */
/* 8c */
/* 8d */
/* 8e */
/* 8f */
/* 90 */ Metas.set("input0", "input0", "input0()=>any\n\nReturns the 1st (left) input to the current function")
/* 91 */ Metas.set("input1", "input1", "input1()=>any\n\nReturns the 2nd input to the current function")
/* 92 */ Metas.set("input2", "input2", "input2()=>any\n\nReturns the 3rd input to the current function")
/* 93 */ Metas.set("input3", "input3", "input3()=>any\n\nReturns the 4th input to the current function")
/* 94 */ Metas.set("inputx", "inputx n", "inputx(n: number)=>any\n\nReturns the nth input to the current function")
/* 95 */
/* 96 */
/* 97 */
/* 98 */
/* 99 */
/* 9a */
/* 9b */
/* 9c */
/* 9d */
/* 9e */ Metas.set("digits", "digits", "digits()=>string\n\nReturns the string \"0123456789\"")
/* 9f */ Metas.set("alphanumeric", "alphanumeric", "alphanumberic()=>string\n\nReturns a string contaning all upper and lower-case letters, as well as all digits")
/* a0 */ Metas.set("if", "condition: if then", "(condition: any).if(then: ()=>any)=>any\n\nIf condition is truthy, returns the result of then, otherwise, returns condition.")
/* a1 */ Metas.set("ifelse", "condition: ifelse then, else", "(condition: any).ifelse(then: ()=>any, else: ()=>any)=>any\n\nif condition is truthy, retursn the result of then, otherwise returns the result of else.")
/* a2 */ Metas.set("while", "initial: while condition, body", "(initial: any).while(condition: (any)=>any, body: (any)=>any)=>any\n\nWhile the result of condition(initial) is truthy, sets initial to the result of body(initial). Returns the current value of initial.")
/* a3 */ Metas.set("toliteral", "left: toliteral", "(left: any).toliteral()\n\nReturns left as a CharacterCode literal. Does not perform any optimizations.");
/* a4 */
/* a5 */
/* a6 */
/* a7 */
/* a8 */
/* a9 */
/* aa */
/* ab */
/* ac */
/* ad */
/* ae */
/* af */
/* b0 */ Metas.set("antihead", "list: antihead count", "(list: any[]|string).antihead(count: number)=>any[]|string\nVectorized\n\nReturns list without the first elements.");
/* b1 */ Metas.set("antitail", "list: antitail count", "(list: any[]|string).antitail(count: number)=>any[]|string\nVectorized\n\nReturns list without the last elements.");
/* b2 */ Metas.set("range", "count: range", "(count: number).range()=>number[]\nVectorized\n\nReturns a list of numbers from 1 to count, or from -1 to count if count is negative.");
/* b3 */ Metas.set("prefixes", "list: prefixes", "(list: any[]).prefixes()=>any[][]\n\nReturns all prefixes of list. eg. [1,2,3] becomes [[1],[1,2],[1,2,3]]");
/* b4 */ Metas.set("suffixes", "list: suffixes", "(list: any[]).suffixes()=>any[][]\n\nReturns all suffixes of list. eg. [1,2,3] becomes [[3],[2,3],[1,2,3]]");
/* b5 */
/* b6 */
/* b7 */
/* b8 */
/* b9 */
/* ba */
/* bb */
/* bc */
/* bd */
/* be */
/* bf */
/* c0 */ Metas.set("callchain0", "left: callchain0", "(left: any).callchain0()=>any\n\nCalls the 1st chain in the current program.")
/* c1 */ Metas.set("callchain1", "left: callchain1", "(left: any).callchain1()=>any\n\nCalls the 2nd chain in the current program.")
/* c2 */ Metas.set("callchain2", "left: callchain2", "(left: any).callchain2()=>any\n\nCalls the 3rd chain in the current program.")
/* c3 */ Metas.set("callchainx", "left: callchainx n", "(left: any).callchainx(n: number)=>any\n\nCalls the nth chain in the current program.")
/* c4 */ Metas.set("bracketstart", "bracketstart", "bracketstart\nMeta\n\nDefines the start of a bracket group.")
/* c5 */ Metas.set("bracketend", "bracketend", "bracketend\nMeta\n\nDefines the end of a bracket group.")
/* c6 */ Metas.set("twogroup", "left: twogroup l0, l1", "(left: any).twogroup(l0: any, l1: any)=>any\n\nExecutes all link arguments in order and returns their result.")
/* c7 */ Metas.set("threegroup", "left: threegroup l0, l1, l2", "(left: any).threegroup(l0: any, l1: any, l2: any)=>any\n\nExecutes all link arguments in order and returns their result.")
/* c8 */ Metas.set("fourgroup", "left: fourgroup l0, l1, l2, l3", "(left: any).fourgroup(l0: any, l1: any, l2: any, l3: any)=>any\n\nExecutes all link arguments in order and returns their result.")
/* c9 */ Metas.set("fivegroup", "left: fivegroup l0, l1, l2, l3, l4", "(left: any).fivegroup(l0: any, l1: any, l2: any, l3: any, l4: any)=>any\n\nExecutes all link arguments in order and returns their result.")
/* ca */
/* cb */ Metas.set("apply", "list: apply method", "(list: any[]).apply(method: (any,any)=>any)=>any\n\nRun method passing each element of list as arguments.");
/* cc */ Metas.set("zipby", "left: zipby arg0, arg1", "(left: any[]).zipby(method: (any,any), right: any[])=>any[]\n\nRun method on each indexwise pair of elements from left and right, returning the resulting single list. Ignores indexes which only appear on one list");
/* cd */ Metas.set("zip", "left: zip arg0", "(left: any[]).zip(right: any[])=>any[][]\n\nReturn left with indexwise pairs of right concatenated to each element. Ignores indexes which only appear on one list");
/* ce */ Metas.set("zipmaximally", "left: zipmaximally right", "(left: any[]).zipmaximally(right: any[])=>any[]\n\nReturn left with indexwise pairs of right concatenated to each element. Where only one list has an element, returns it alone.");
/* cf */ Metas.set("indexmap", "list: indexmap selector", "(list: any).indexmap(selector: (any,number)=>any)=>any[]\n\nReturns left mapped over selector with indexes passed as the second argument");
/* d0 */ Metas.set("map", "list: map selector", "(list: any[]).map(selector: (any)=>any)=>any[]\n\nReturns a new version of list with all values mutated by selector")
/* d1 */ Metas.set("filter", "list: filter predicate", "(list any[]).filter(predicate: (any)=>any)=>any[]\n\nReturns a new version of list with only values in which predicate returns truthy")
/* d2 */ Metas.set("reduce", "list: reduce accumulator", "(list: any[]).reduce(accumulator: (any, any)=>any)=>any[]\n\nReturns the result of repeated accumulation across list. The left input to accumulator is the result of the last, or the first value initially.")
/* d3 */ Metas.set("reduceinitial", "list: reduceinitial accumulator, initial", "(list: any[]).reduce(accumulator: (any, any)=>any, initial: any)=>any\n\nReturns the result of repeated accumulation across list. The left input to accumulator is the result of the last, or initial inially.")
/* d4 */ Metas.set("fold", "list: fold accumulator", "(list: any[]).fold(accumulator: (any, any)=>any)=>any[]\n\nReturns a new version of list from running accumulator on each adjacant pair of elements.")
/* d5 */ Metas.set("foldinitial", "list: foldinitial accumulator, initial", "(list: any[]).foldinitial(accumulator: (any, any)=>any, initial: any)=>any[]\n\nReturns a new version of list from running accumulator on each adjacant pair of elements with initial implicitly prepended.")
/* d6 */ Metas.set("length", "list: length", "(list: any[]|string).length()=>number\n\nReturns the length of list")
/* d7 */ Metas.set("reverse", "list: reverse", "(list: any[]|string).reverse()=>any[]|string\n\nReturns the reversed version of list")
/* d8 */ Metas.set("first", "list: first", "(list: any[]).first()=>any\n\nReturns the first element of list")
/* d9 */ Metas.set("firstwhere", "list: firstwhere predicate", "(list: any[]).firstwhere(predicate: (any)=>any)=>any\n\nReturns the first element of list that matches predicate")
/* da */ Metas.set("firstindexof", "list: firstindexof predicate", "(list: any[]).firstindexof(predicate: (any)=>any)=>number\n\nReturns the index of the first element of list that matches predicate, or -1 otherwise")
/* db */ Metas.set("head", "list: head n", "(list: any[]).head(n: number)=>any[]\nVectorized\n\nReturns the first n elements of list")
/* dc */ Metas.set("last", "list: last", "(list: any[]).last()=>any\n\nReturns the last element of list")
/* dd */ Metas.set("lastwhere", "list: lastwhere predicate", "(list: any[]).lastwhere(predicate: (any)=>any)=>any\n\nReturns the last element of list that matches predicate")
/* de */ Metas.set("lastindexof", "list: lastindexof predicate", "(list: any[]).lastindexof(predicate: (any)=>any)=>number\n\nReturns the index of the last element of list that matches predicate, or -1 otherwise")
/* df */ Metas.set("tail", "list: tail any", "(list: any[]).tail(n: number)=>any[]\n\nReturns the last n elements of list")
/* e0 */ Metas.set("atindex", "list: atindex any", "(list: any[]).atindex(index: number)=>any\nVectorized\n\nReturns the element index from list")
/* e1 */ Metas.set("slice", "list: slice any, any", "(list: any[]).slice(index: number, length: number)=>any[]\nVectorized\n\nReturns length elements from list starting at and including index.")
/* e2 */ Metas.set("sort", "list: sort", "(list: any[]).sort()=>any[]\n\nReturns a sorted list by lexigraphical comparison")
/* e3 */ Metas.set("sortby", "list: sortby comparer", "(list: any[]).sortby(comparer: (any, any)=>number)=>any[]\n\nReturns a sorted list by comparer. Comparer should return -1 when the left argument should be sorted before the right, 1 when the right should be sorted before the left, and 0 otherwise")
/* e4 */ Metas.set("unique", "list: unique", "(list: any[]).unique()=>any[]\n\nReturns only unique elements of list")
/* e5 */ Metas.set("uniqueby", "list: uniqueby selector", "(list: any[]).uniqueby(selector: (any)=>any)=>any[]\n\nReturns only unique elements of list by a given selector")
/* e6 */ Metas.set("permutations", "list: permutations", "(list: any[]).permutations()=>any[]\n\nReturns all orderings of list.")
/* e7 */ Metas.set("choices", "list: choices", "(list: any[]).choices()=>any[][]\n\nReturns all ordered combinations of list.")
/* e8 */ Metas.set("choicesoflength", "list: choicesoflength any", "(list: any[]).choicesoflength(n: number)=>any[][]\n\nReturns all ordered combinations of length n of list")
/* e9 */ Metas.set("sum", "list: sum", "(list: any[]).sum()=>any\n\nReturns the sum of list")
/* ea */ Metas.set("sumby", "list: sumby any", "(list: any[]).sumby(selector: (any)=>number)=>any\n\nReturns the sum of the elements of list mapped by selector")
/* eb */ Metas.set("product", "list: product", "(list: any[]).product()=>any\n\nReturns the product of list")
/* ec */ Metas.set("productby", "list: productby selector", "(list: any[]).productby(selector: (any)=>any)=>any\n\nReturns the product of list mapped by selector")
/* ed */ Metas.set("deepmap", "list: deepmap selector", "(list: any[]).deepmap(selector: (any)=>any)=>any\n\nReturns a new list modified by selector. Sublists are recursed into.")
/* ee */ Metas.set("union", "left: union right", "(left: any[]).union(right: any[])=>any[]\n\nReturns a list containing all elements of left, and elements of right which do not yet appear in the list")
/* ef */ Metas.set("intersect", "left: intersect right", "(left: any[]).intersect(right: any[])=>any[]\n\nReturns all elements of left that appear in right")
/* f0 */ Metas.set("max", "list: max", "(list: any[]).max()=>any\n\nReturns the maximum lexigraphical value of list.")
/* f1 */ Metas.set("maxby", "list: maxby selector", "(list: any[]).maxby(selector: (any)=>any)=>any\n\nReturns the maximum lexigraphical value of list by selector")
/* f2 */ Metas.set("min", "list: min", "(list: any[]).min()=>any\n\nReturns the minimum lexigraphical value of list.")
/* f3 */ Metas.set("minby", "list: minby selector", "(list: any[]).minby(selector: (any)=>any)=>any\n\nReturns the minimum lexigraphical value of list by selector")
/* f4 */ Metas.set("groupby", "list: groupby selector", "(list: any[]).groupby(selector: (any)=>any)=>any[][]\n\nReturns list split into sublists in which selector(element) is equal.")
/* f5 */ Metas.set("splitbetween", "list: splitbetween predicate", "(list: any[]).splitbetween(predicate: (any,any)=>any)=>any[][]\n\nReturns list split between any two elements such predicate(left,right) is truthy")
/* f6 */ Metas.set("splitat", "list: splitat predicate", "(list: any[]).splitat(predicate: (any)=>any)=>any[][]\n\nReturns a list split at any element where predicate(element) is truthy, skipping that element")
/* f7 */ Metas.set("transpose", "list: transpose", "(a: any[][]).transpose()=>any[][]\n\nReturns 'list' transpose, such that list[x][y] => list[y][x]")
/* f8 */ Metas.set("without", "a: without b", "(a: any[]).without(b)=>any[]\n\nReturns a list of all elements of 'a' that do not appear in 'b")
/* f9 */ Metas.set("repeat", "list: repeat count", "(list: string|any[]).repeat(count)=>string|any[]\nVectorized\n\nRepeats the input list count times.");
/* fa */ Metas.set("cartesianproduct", "left: cartesianproduct right", "(left: any[]).cartesianproduct(right: any[])=>any[][]\n\nReturns the cartesian product of left and right. (Returns a new list contaning all combinations of elements in left and right)");
/* fb */ Metas.set("allcartesianproducts", "lists: allcartesianproducts", "(lists: any[][]).allcartesianproducts()=>any[][]\n\nReturns the cartesian product of all lists in lists. (A new list contaning all combinations of elements in the children of lists)");
/* fc */ Metas.set("flatten", "list: flatten", "(list: any).flatten()=>any[]\n\nReturns all elements of list as a 1 dimensional list, flattening any sub-ists.");
/* fd */ Metas.set("flattenupto", "list: flattenupto depth", "(list: any[]).flattenupto(depth: number)=>any[]\nVectorized\n\nFlattens the first depth dimensions of list, preserving sublists of depth greater than depth.");
/* fe */ Metas.set("rotateleft", "list: rotateleft count", "(list: any[]|string|number).rotateleft(count: number)=>any[]|string|number\nVectorized\n\nRotates the elements of list left (Towards index 0) count times. If list is a string, acts on the characters of list. If list is a number, acts on the binary digits (Up to the largest 1)");
/* ff */ Metas.set("rotateright", "list: rotateright count", "(list: any[]|string|number).rotateright(count: number)=>any[]|string|number\nVectorized\n\nRotates the elements of list right (Away from index 0) count times. If list is a string, acts on the characters of list. If list is a number, acts on the binary digits (Up to the largest 1)");

export function WeaklyDefinied() {return undefined}

export function ValidateMeta() {
    let s = "";
    for(let i=0; i < 256; i++){
        if(BytesToNames.has(i)){
            let allNames = [...NamesToBytes.entries()].filter(c=>c[1] === i).map(c=>c[0]);
            for(let name of allNames){
                if(!name.match(/^[\w_0-9]+$/))
                    continue;
                if(!Metas.has(name)){
                    let args = new Array(Math.max(0, (Behaviours.get(i)??[]).length - 1)).fill(0).map((_,i)=>` arg${i}`).join();
                    let namedArgs = new Array(Math.max(0, (Behaviours.get(i)??[]).length - 1)).fill(0).map((_,i)=>`arg${i}: any`).join(', ');
                    Metas.set(name, `left: ${name}${args}`, `(left: any).${name}(${namedArgs})\n\n##### A DESCRIPTION HAS YET TO BE PROVIDED ####`);
                    s += `/* ${i.toString(16)} */ Metas.set("${name}", "left: ${name}${args}", "(left: any).${name}(${namedArgs})\\n\\n");\n`
                }
            }
        }
    }

    let ascii = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ".split('');
    ascii = ascii.concat(ascii.map(c=>c+"₊")).filter(c=>!CharMap.has(c));
    for(let i=0; i < 256; i++){
        if(!ByteMap.has(i)){
            // Create a false-mapping to the next available ascii character.
            if(ascii.length === 0){
                console.error("Coudn't finish mapping all spare character :(");
                break;
            }
            let c = ascii.splice(0,1)[0];
            ByteMap.set(i, c);
            CharMap.set(c, i);
            Behaviours.set(i, WeaklyDefinied);
            BytesToNames.set(i, "weaklydefined");
            Metas.set("weaklydefined", "", "");
        }
    }


    console.log(s);
}