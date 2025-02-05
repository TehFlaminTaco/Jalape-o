# Jalapeño
[Interpreter](https://tehflamintaco.github.io/Jalape-o/)

Jalapeño is a weakly [tacit](https://en.wikipedia.org/wiki/Tacit_programming) [Code-golf](https://en.wikipedia.org/wiki/Code_golf) programming language inspired by languages like [Jelly](https://github.com/DennisMitchell/jellylanguage) and [Vyxal](https://github.com/Vyxal/Vyxal).

It is inspired by the concept of expression chaining in traditional languages, where:
```javascript
input
    .split(" ")
    .map(word => word.reverse())
    .join(" ");
```

Can be expressed as `words map reverse joinwords`, which then compiles down to 4 bytes: `w↦↶w₋`

## Program Modes

Programs can be represented by three modes which each compile down to the next.

 1. **Verbose Mode**: Programs consist of function names, brackets, and comments. Where possible, the compiler will attempt to simplify syntax when compiling. Returns Character-code. This compilation is lossy.
 2. **Character Mode**: A mapping of characters (with optional subscript suffixes) to bytecode. Examples of single character codes are `↩₁`, `A` and `Fₓ`.
 3. **Byte Mode**: The raw code that is executed as bytes.

## Chains
Each Jalapeño program is made up of some number of chains, with the last chain executing immediately.

In **Verbose Mode**, chains are seperated by terminating each chain with a *name*, in the form of `:NAME`, they can then be called via `$NAME`.

In **Character Mode** and **Byte Mode**, chains are seperated by `§`, and may be called with one of `C₀` for the first chain, `C₁` for the second, `C₂` for the third, or `Cₓ(index)` to call an arbitrary chain.

## Behaviours
Behaviours refer to the individual functionality of a Link. Behaviours always have a constant number of arguments.

A Behaviour's first input is usually the **Left Value**, or the result of the previous Link in the chain.

A Behaviour's arguments are taken as the next `x` Links, where `x` is the number of arguments. If no link are available, either because the next link is a `}` or the chain is terminated, it instead implicitly uses the current scopes inputs respective to the argument index.

The arguments are always passed as callable links. They may be called arbitrarily many times, with arbitrary inputs. If there is no input to be passed to an argument, the Behaviour's **Left Value** and current inputs are passed instaed.

## Links
A chain is thus some number of links. A Link refers to any number of elements which compose a single function call, this includes any child links for arguments.

* `capitalalphabet` (verbose) or `A` (character) is a single Link which has no arguments.
* `3+2` is two links and one child link. Consisting of `3` and `+2`, where `+2` is the `addition` behaviour, and has the child link `2`.
* `9o$` is a single link representing an Integer constant (1337). `9o` is treated as an Int7 value

The **Left Value** is never included in an individual link.

Links are parsed from right to left in **Character Mode**/**Byte Mode**. The following characters have special parsing rules
* `{`: Treats everything to the right of it (Or up to the next chain / `}`) as one link.
* `}`: Treats everything to the left of it (Or to the previous chain / `{`) as one link.
* `$`: Integer constant, treats the bytes left of it as [Int7](https://en.wikipedia.org/wiki/Variable-length_quantity)
* `‰`: Float constant, traets the bytes to the left as an integer, and then an additional byte as an exponent. Resolves as `integer / (10 ^ exponent)`
* `"`: Bytestring. Terminated by `0xFF`, treats the bytes between as Base-255 encoded UTF8.
* `'`: Character, Treats the left byte as a single character string.
* `„`: Compressed string. Terminated by `0xFF`, treats the bytes between as Base-255 encoded [Smaz](https://github.com/antirez/smaz)
* `›`: Compressed Singleton. Treats the left byte as a single character [Smaz](https://github.com/antirez/smaz) encoded string.

## Function List

The most up-to-date function list can be seen by hovering over the character map on [The Interpreter](https://tehflamintaco.github.io/Jalape-o/)