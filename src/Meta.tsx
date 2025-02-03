import { Behaviours, BytesToNames, NamesToBytes } from "./Registry";

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

/* 0 */ Metas.set("noop", "any: noop", "(left: any).noop()\n\nReturns nothing")
/* 1 */
/* 2 */
/* 3 */
/* 4 */
/* 5 */
/* 6 */
/* 7 */
/* 8 */
/* 9 */
/* a */ Metas.set("chainseperator", "chainseperator", "chainseperator\nMeta\n\nSeperates two chains. Not a function.")
/* b */
/* c */
/* d */
/* e */
/* f */
/* 10 */ Metas.set("print", "left: print", "(left: any).print()\n\nOutputs the left-passed value followed by a newline")
/* 11 */ Metas.set("write", "left: write", "(left: any).write()\n\nOutputs the left-passed value and nothing else")
/* 12 */ Metas.set("replace", "haystack: replace needle, replacement", "(haystack: string).replace(arg0: string, arg1: (string...)=>string)=>string\nVectorized\n\nReplaces all instances of the needle RegExp with value.")
/* 13 */ Metas.set("split", "left: split deliminator", "(left: string).split(deliminator: string)=>string[]\nVectorized\n\nSplits the left string by the deliminator RegExp.")
/* 14 */ Metas.set("join", "left: join", "(left: string[]).join()=>string\n\nConcatenates all the values of left together")
/* 15 */ Metas.set("joinby", "left: joinby deliminator", "(left: string[]).joinby(deliminator)=>string\n\nConcatenates all the values of left together by a deliminator")
/* 16 */ Metas.set("words", "left: words", "(left: string).words()=>string[]\nVectorized\n\nSplit the text left by spaces")
/* 17 */ Metas.set("chars", "left: chars", "(left: string).chars()=>string[]\nVectorized\n\nSplit the text left into individual characters")
/* 18 */ Metas.set("lines", "left: lines", "(left: string).lines()=>string[]\nVectorized\n\nSplit the text left by newlines")
/* 19 */ Metas.set("match", "haystack: match needle", "(haystack: string).match(needle: string)=>string|string[]\nVectorized\n\nReturns the first instance of the matched RegExp needle in haystack. If needle has groups, returns an array.")
/* 1a */ Metas.set("matches", "haystack: matches needle", "(haystack: string).matches(needle: string)=>(string|string[])[]\nVectorized\n\nReturns all instances of the matched RegExp needle in haystack. If needel has groups, each instance returns as an array.")
/* 1b */ Metas.set("tostring", "left: tostring", "(left: any).tostring()=>string\n\nStringifies the left value.")
/* 1c */ Metas.set("formatx", "stringFormat: formatx arguments", "(stringFormat: string).formatx(arguments: string[])=>string\nVectorized\n\nReturns stringFormat with all instances of %x replaced with the respective argument index.")
/* 1d */ Metas.set("format1", "stringFormat: format1 arg0", "(stringFormat: string).format1(arg0: string)=>string\nVectorized\n\nReturns stringFormat with all instances of %x replaced with the respective argument index.")
/* 1e */ Metas.set("format2", "stringFormat: format2 arg0, arg1", "(stringFormat: string).format2(arg0: string, arg1: string)=>string\nVectorized\n\nReturns stringFormat with all instances of %x replaced with the respective argument index.")
/* 1f */ Metas.set("format3", "stringFormat: format3 arg0, arg1, arg2", "(stringFormat: string).format3(arg0: string, arg1: string, arg2: string)=>string\nVectorized\n\nReturns stringFormat with all instances of %x replaced with the respective argument index.")
/* 20 */ Metas.set("bytestring", "bytestring", "bytestring\nMeta\n\nUsed to define a string of bytes.")
/* 21 */ Metas.set("singletonbyte", "singletonbyte", "singletonbyte\nMeta\n\nUsed to reference a single byte")
/* 22 */ Metas.set("smazstring", "smazstring", "smazstring\nMeta\n\nUsed to define a string of compressed bytes")
/* 23 */ Metas.set("singletonsmaz", "singletonsmaz", "singletonsmaz\nMeta\nUsed to reference a single compressed byte")
/* 24 */ Metas.set("emptystring", "emptystring", "emptystring()=>string\n\nReturns an empty string.")
/* 25 */ Metas.set("space", "left: space", "space()=>string\n\nReturns a single space")
/* 26 */ Metas.set("pair", "left: pair any", "(left: any[]).pair(right: any)=>any[]\n\nConcatenates right to the end of left. If left isn't an array yet, boxes it.")
/* 27 */ Metas.set("emptylist", "left: emptylist", "emptylist()=>[]\n\nReturns an empty list.")
/* 28 */
/* 29 */
/* 2a */
/* 2b */
/* 2c */
/* 2d */
/* 2e */ Metas.set("range", "start: range end", "(start: any).range(end: any)=>any\n\nIf start and end are numbers, returns a list of numbers from start to end inclusive.\nIf start or end are lists, concatenates the lists together\nIf start or end are strings, concatenates the strings together")
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
/* 41 */
/* 42 */
/* 43 */
/* 44 */
/* 45 */
/* 46 */
/* 47 */
/* 48 */
/* 49 */
/* 4a */
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
/* 5b */ Metas.set("greater", "left: greater any", "(left: any).greater(right: any)=>numbern\nReturns if left is larger than right. Lexigraphically for lists or strings.")
/* 5c */ Metas.set("less", "left: less any", "(left: any).less(right: any)=>number\n\nReturns if left is smaller than right. Lexigraphically for lists or strings.")
/* 5d */ Metas.set("greaterequal", "left: greaterequal any", "(left: any).greaterequal(right: any)=>number\n\nReturns if left is larger than or equal to right. Lexigraphically for lists or strings.")
/* 5e */ Metas.set("lessequal", "left: lessequal any", "(left: any).lessequal(right: any)=>number\n\nReturns if left is smaller than or equal to right. Lexigraphically for lists or strings.")
/* 5f */ Metas.set("compare", "left: compare any", "(left: any).compare(right: any)=>number\n\nReturns -1 if left is less than right, 1 if left is greater than right, or 0 otherwise.")
/* 60 */ Metas.set("sqrt", "n: sqrt", "(n: number).sqrt()=>number\nVectorized\n\nReturns the square root of n")
/* 61 */ Metas.set("square", "left: square", "(left: number).square()\nVectorized\n\nReturns the value of n^3")
/* 62 */ Metas.set("cubed", "n: cubed", "(n: number).cubed() => number\nVectorized\n\nReturns the value of n^3")
/* 63 */ Metas.set("sign", "n: sign", "(n: any).sign()\nVectorized\n\nReturns -1 if n is less than 0, 1 if n is greater than 0, or 0 otherwise.")
/* 64 */ Metas.set("factorial", "n: factorial", "(n: number).factorial()\nVectorized\n\nReturns the product of every positive integer lessthan and including n")
/* 65 */ Metas.set("bitwiseor", "left: bitwiseor right", "(left: number).bitwiseor(right: number)\nVectorized\n\nReturns the value of left | right")
/* 66 */ Metas.set("bitwiseand", "left: bitwiseand right", "(left: number).bitwiseand(right: number)\nVectorized\n\nReturns the value of left & right")
/* 67 */ Metas.set("bitwisexor", "left: bitwisexor right", "(left: number).bitwisexor(right: number)\nVectorized\n\nReturns the value of left xor right")
/* 68 */ Metas.set("bitshiftleft", "left: bitshiftleft right", "(left: number).bitshiftleft(right: number)\nVectorized\n\nReturns the value of left << right")
/* 69 */ Metas.set("bitshiftright", "left: bitshiftright right", "(left: number).bitshiftright(right: number)\nVectorized\n\nReturns the value of left >> right")
/* 6a */
/* 6b */
/* 6c */
/* 6d */
/* 6e */
/* 6f */
/* 70 */
/* 71 */
/* 72 */
/* 73 */
/* 74 */
/* 75 */
/* 76 */
/* 77 */
/* 78 */
/* 79 */
/* 7a */
/* 7b */
/* 7c */
/* 7d */
/* 7e */
/* 7f */
/* 80 */
/* 81 */
/* 82 */
/* 83 */
/* 84 */
/* 85 */
/* 86 */
/* 87 */
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
/* 9e */
/* 9f */
/* a0 */
/* a1 */
/* a2 */
/* a3 */
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
/* b0 */
/* b1 */
/* b2 */
/* b3 */
/* b4 */
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
/* c0 */ Metas.set("callchain0", "left: callchain0", "(left: any).callchain0()\n\nCalls the 1st chain in the current program.")
/* c1 */ Metas.set("callchain1", "left: callchain1", "(left: any).callchain1()\n\nCalls the 2nd chain in the current program.")
/* c2 */ Metas.set("callchain2", "left: callchain2", "(left: any).callchain2()\n\nCalls the 3rd chain in the current program.")
/* c3 */ Metas.set("callchainx", "left: callchainx n", "(left: any).callchainx(n: number)\n\nCalls the nth chain in the current program.")
/* c4 */ Metas.set("bracketstart", "bracketstart", "bracketstart\nMeta\n\nDefines the start of a bracket group.")
/* c5 */ Metas.set("bracketend", "bracketend", "bracketend\nMeta\n\nDefines the end of a bracket group.")
/* c6 */ Metas.set("twogroup", "left: twogroup l0, l1", "(left: any).twogroup(l0: any, l1: any)=>any\n\nExecutes all link arguments in order and returns their result.")
/* c7 */ Metas.set("threegroup", "left: threegroup l0, l1, l2", "(left: any).threegroup(l0: any, l1: any, l2: any)=>any\n\nExecutes all link arguments in order and returns their result.")
/* c8 */ Metas.set("fourgroup", "left: fourgroup l0, l1, l2, l3", "(left: any).fourgroup(l0: any, l1: any, l2: any, l3: any)=>any\n\nExecutes all link arguments in order and returns their result.")
/* c9 */ Metas.set("fivegroup", "left: fivegroup l0, l1, l2, l3, l4", "(left: any).fivegroup(l0: any, l1: any, l2: any, l3: any, l4: any)=>any\n\nExecutes all link arguments in order and returns their result.")
/* ca */
/* cb */
/* cc */
/* cd */
/* ce */
/* cf */
/* d0 */ Metas.set("map", "list: map selector", "(list: any[]).map(selector: (any)=>any)=>any[]\n\nReturns a new version of list with all values mutated by selector")
/* d1 */ Metas.set("filter", "list: filter predicate", "(list any[]).filter(predicate: (any)=>any)=>any[]\n\nReturns a new version of list with only values in which predicate returns truthy")
/* d2 */ Metas.set("reduce", "list: reduce any", "(list: any[]).reduce(accumulator: (any, any)=>any)=>any[]\n\nReturns the result of repeated accumulation across list. The left input to accumulator is the result of the last, or the first value initially.")
/* d3 */ Metas.set("reduceinitial", "list: reduceinitial any, any", "(list: any[]).reduce(accumulator: (any, any)=>any, initial: any)=>any\n\nReturns the result of repeated accumulation across list. The left input to accumulator is the result of the last, or initial inially.")
/* d4 */ Metas.set("fold", "list: fold any", "(list: any[]).fold(accumulator: (any, any)=>any)=>any[]\n\nReturns a new version of list from running accumulator on each adjacant pair of elements.")
/* d5 */ Metas.set("foldinitial", "list: foldinitial any, any", "(list: any[]).foldinitial(accumulator: (any, any)=>any, initial: any)=>any[]\n\nReturns a new version of list from running accumulator on each adjacant pair of elements with initial implicitly prepended.")
/* d6 */ Metas.set("length", "list: length", "(list: any[]|string).length()=>number\n\nReturns the length of list")
/* d7 */ Metas.set("reverse", "list: reverse", "(list: any[]|string).reverse()=>any[]|string\n\nReturns the reversed version of list")
/* d8 */ Metas.set("first", "list: first", "(list: any[]).first()=>any\n\nReturns the first element of list")
/* d9 */ Metas.set("firstwhere", "list: firstwhere predicate", "(list: any[]).firstwhere(predicate: (any)=>any)\n\nReturns the first element of list that matches predicate")
/* da */ Metas.set("firstindexof", "list: firstindexof predicate", "(list: any[]).firstindexof(predicate: (any)=>any)\n\nReturns the index of the first element of list that matches predicate, or -1 otherwise")
/* db */ Metas.set("head", "list: head n", "(list: any[]).head(n: number)=>any[]\nVectorized\n\nReturns the first n elements of list")
/* dc */ Metas.set("last", "list: last", "(list: any[]).last()=>any\n\nReturns the last element of list")
/* dd */ Metas.set("lastwhere", "list: lastwhere predicate", "(list: any[]).lastwhere(predicate: (any)=>any)\n\nReturns the last element of list that matches predicate")
/* de */ Metas.set("lastindexof", "list: lastindexof predicate", "(list: any[]).lastindexof(predicate: (any)=>any)\n\nReturns the index of the last element of list that matches predicate, or -1 otherwise")
/* df */ Metas.set("tail", "list: tail any", "(list: any[]).tail(n: number)=>any[]\n\nReturns the last n elements of list")
/* e0 */ Metas.set("atindex", "list: atindex any", "(list: any[]).atindex(index: number)=>any\nVectorized\n\nReturns the element index from list")
/* e1 */ Metas.set("slice", "list: slice any, any", "(list: any[]).slice(index: number, length: number): any[]\nVectorized\n\nReturns length elements from list starting at and including index.")
/* e2 */ Metas.set("sort", "list: sort", "(list: any[]).sort()\n\nReturns a sorted list by lexigraphical comparison")
/* e3 */ Metas.set("sortby", "list: sortby comparer", "(list: any[]).sortby(comparer: (any, any)=>number)=>any[]\n\nReturns a sorted list by comparer. Comparer should return -1 when the left argument should be sorted before the right, 1 when the right should be sorted before the left, and 0 otherwise")
/* e4 */ Metas.set("unique", "list: unique", "(list: any[]).unique()=>any[]\n\nReturns only unique elements of list")
/* e5 */ Metas.set("uniqueby", "list: uniqueby selector", "(list: any[]).uniqueby(selector: (any)=>any)=>any[]\n\nReturns only unique elements of list by a given selector")
/* e6 */ Metas.set("permutations", "list: permutations", "(list: any[]).permutations()=>any[]\n\nReturns all orderings of list.")
/* e7 */ Metas.set("choices", "list: choices", "(list: any[]).choices()\n\nReturns all ordered combinations of list.")
/* e8 */ Metas.set("choicesoflength", "list: choicesoflength any", "(list: any[]).choicesoflength(n: number)\n\nReturns all ordered combinations of length n of list")
/* e9 */ Metas.set("sum", "list: sum", "(list: any[]).sum()\n\nReturns the sum of list")
/* ea */ Metas.set("sumby", "list: sumby any", "(list: any[]).sumby(selector: (any)=>number)\n\nReturns the sum of the elements of list mapped by selector")
/* eb */ Metas.set("product", "list: product", "(list: any[]).product()\n\nReturns the product of list")
/* ec */ Metas.set("productby", "list: productby any", "(list: any[]).productby(arg0)\n\nReturns the product of list mapped by selector")
/* ed */
/* ee */
/* ef */
/* f0 */
/* f1 */
/* f2 */
/* f3 */
/* f4 */
/* f5 */
/* f6 */
/* f7 */
/* f8 */
/* f9 */
/* fa */
/* fb */
/* fc */
/* fd */
/* fe */
/* ff */

export function ValidateMeta() {
    let s = "";
    for(let i=0; i < 256; i++){
        if(!BytesToNames.has(i))
            s += `/* ${i.toString(16)} */\n`
        else{
            let allNames = [...NamesToBytes.entries()].filter(c=>c[1] === i).map(c=>c[0]);
            for(let name of allNames){
                if(!name.match(/^[\w_0-9]+$/))
                    continue;
                if(Metas.has(name))
                    s += `/* ${i.toString(16)} */ Metas.set("${name}", ${JSON.stringify(Metas.getStructure(name)!)}, ${JSON.stringify(Metas.getDescription(name)!)})\n`
                else{
                    let args = new Array(Math.max(0, (Behaviours.get(i)??[]).length - 1)).fill(' any').join();
                    let namedArgs = new Array(Math.max(0, (Behaviours.get(i)??[]).length - 1)).fill(0).map((_,i)=>`arg${i}`).join(', ');
                    Metas.set(name, `any: ${name}${args}`, `(left: any).${name}(${namedArgs})\n\n`);
                    s += `/* ${i.toString(16)} */ Metas.set("${name}", "any: ${name}${args}", "(left: any).${name}(${namedArgs})\\n\\n");\n`
                }
            }
        }
    }
    console.log(s);
}