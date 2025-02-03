import { Global, WithInputs } from "../GlobalState";
import { QRegister } from "../Registry";
import { AsList, AsNumber, Link, Value } from "../Types";

function Map(left: Value, right: Link): Value {
  return AsList(left).map((x) => right.Call(x));
}

function Filter(left: Value, right: Link): Value {
  return AsList(left).filter((x) => right.Call(x));
}

function Reduce(left: Value, right: Link): Value {
  return AsList(left).reduce((acc, x) =>
    WithInputs([acc, x], () => right.Call(acc))
  );
}

function ReduceInitial(left: Value, initial: Link, right: Link): Value {
  return AsList(left).reduce(
    (acc, x) => WithInputs([acc, x], () => right.Call(acc)),
    initial.Call(Global.Inputs[0])
  );
}

function Fold(left: Value, right: Link) {
  let l = AsList(left);
  if (l.length <= 1) return [];
  let outList = [];
  for (let i = 1; i < l.length; i++) {
    outList.push(WithInputs([l[i - 1], l[i]], () => right.Call(l[i - 1])));
  }
  return outList;
}

function FoldInitial(left: Value, initial: Link, right: Link) {
  let l = AsList(left);
  if (l.length <= 0) return [];
  let outList = [];
  let lVal = initial.Call(Global.Inputs[0]);
  for (let i = 0; i < l.length; i++) {
    outList.push(WithInputs([lVal, l[i]], () => right.Call(lVal)));
    lVal = l[i];
  }
  return outList.slice(1);
}

function Length(left: Value): Value {
  if (typeof left === "string") return left.length;
  if (typeof left === "object") return left.length;
  if (typeof left === "number")
    return Math.floor(Math.log10(Math.abs(left))) + 1;
  return 0;
}

function Reverse(left: Value): Value {
  if (typeof left === "string") return left.split("").reverse().join("");
  if (typeof left === "object") return AsList(left).reverse();
  return left;
}

function First(left: Value): Value {
  if (typeof left === "string") return left[0];
  return AsList(left)[0];
}

function Head(left: Value, count: Link): Value {
  if (typeof left === "string")
    return left.slice(0, AsNumber(count.Call(Global.Inputs[0])));
  return AsList(left).slice(0, AsNumber(count.Call(Global.Inputs[0])));
}

function Last(left: Value): Value {
  if (typeof left === "string") return left.slice(-1);
  return AsList(left).last();
}

function Tail(left: Value, count: Link): Value {
  if (typeof left === "string")
    return left.slice(AsNumber(count.Call(Global.Inputs[0])));
  return AsList(left).slice(AsNumber(count.Call(Global.Inputs[0])));
}

function AtIndex(left: Value, index: Link): Value {
  return AsList(left)[AsNumber(index.Call(Global.Inputs[0]))];
}

function Slice(left: Value, start: Link, length: Link): Value {
  return AsList(left).slice(
    AsNumber(start.Call(Global.Inputs[0])),
    AsNumber(start.Call(Global.Inputs[0])) + AsNumber(length.Call(Global.Inputs[0]))
  );
}

// MORE COMPLICATED FUNCTIONS TIME~
function Sort(left: Value): Value {
  return AsList(left)
    .concat()
    .sort((a, b) => AsNumber(a) - AsNumber(b));
}

function SortBy(left: Value, right: Link): Value {
  return AsList(left)
    .concat()
    .sort((a, b) =>
      WithInputs([a, b], () => {
        return AsNumber(right.Call(a));
      })
    );
}

function Unique(left: Value): Value {
  return AsList(left).filter((v, i, a) => a.indexOf(v) === i);
}

function UniqueBy(left: Value, right: Link): Value {
  return AsList(left).filter(
    (v, i, a) => a.findIndex((x) => right.Call(x) === right.Call(v)) === i
  );
}

function _PermutationIndex(l: Value[], index: number): Value[] {
  l = l.concat();
  let selectionIndexes = [0];
  let selectionModulo = 2;
  while (selectionModulo <= l.length) {
    selectionIndexes.push(index % selectionModulo);
    index = Math.floor(index / selectionModulo);
    selectionModulo++;
  }
  selectionIndexes = selectionIndexes.reverse();
  let outList = [];
  for (let i = 0; i < selectionIndexes.length; i++) {
    outList.push(l.splice(selectionIndexes[i], 1)[0]);
  }
  return outList;
}

function Permutations(left: Value): Value {
  let l = AsList(left);
  let outList = [];
  for (let i = 0; i < Math.factorial(l.length); i++) {
    outList.push(_PermutationIndex(l, i));
  }
  return outList;
}

// Breaks down for large lists, but so do I
function _ChoiceIndex(l: Value[], index: number): Value[] {
  let outList = [];
  for (let i = 0; i < l.length; i++) {
    if ((index & (1 << i)) !== 0) {
      outList.push(l[i]);
    }
  }
  return outList;
}

function Choices(left: Value): Value {
  let l = AsList(left);
  let outList = [];
  for (let i = 0; i < Math.pow(2, l.length); i++) {
    outList.push(_ChoiceIndex(l, i));
  }
  return outList;
}

function ChoicesOfLength(left: Value, right: Link): Value {
  let l = AsList(left);
  let targetLength = AsNumber(right.Call(Global.Inputs[0]));
  let outList = [];
  for (let i = 0; i < Math.pow(2, l.length); i++) {
    let choice = _ChoiceIndex(l, i);
    if (choice.length === targetLength) {
      outList.push(choice);
    }
  }
  return outList;
}

function Sum(left: Value): Value {
  return AsList(left).reduce((acc, x) => AsNumber(acc) + AsNumber(x), 0);
}

function SumBy(left: Value, right: Link): Value {
  return Sum(AsList(left).map((x) => right.Call(x)));
}

function Product(left: Value): Value {
  return AsList(left).reduce((acc, x) => AsNumber(acc) * AsNumber(x), 1);
}

function ProductBy(left: Value, right: Link): Value {
  return Product(AsList(left).map((x) => right.Call(x)));
}

/*
    List Comprehension functions are mapped to bytes 0xD0...
    They should use symbols that are list related, or represent their function.
    Duplicate symbols are never allowed, but substring suffixes are allowed. eg. '↧' and '↧₁'
*/

QRegister(Map, "↦", 0xd0);
QRegister(Filter, "↥", 0xd1);
QRegister(Reduce, "↧", 0xd2);
QRegister(ReduceInitial, "↧₁", 0xd3);
QRegister(Fold, "↩", 0xd4);
QRegister(FoldInitial, "↩₁", 0xd5);
QRegister(Length, "↔", 0xd6);
QRegister(Reverse, "↶", 0xd7);
QRegister(First, "⇤₁", 0xd8);
QRegister(Head, "⇤ₓ", 0xd9);
QRegister(Last, "⇥", 0xda);
QRegister(Tail, "⇥ₓ", 0xdb);
QRegister(AtIndex, "⇪", 0xdc);
QRegister(Slice, "⇪ₓ", 0xdd);
QRegister(Sort, "⇅", 0xde);
QRegister(SortBy, "⇅ₓ", 0xdf);
QRegister(Unique, "u", 0xe0);
QRegister(UniqueBy, "uₓ", 0xe1);
QRegister(Permutations, "p", 0xe2);
QRegister(Choices, "c", 0xe3);
QRegister(ChoicesOfLength, "cₓ", 0xe4);
QRegister(Sum, "Σ", 0xe5);
QRegister(SumBy, "Σₓ", 0xe6);
QRegister(Product, "Π", 0xe7);
QRegister(ProductBy, "Πₓ", 0xe8);
