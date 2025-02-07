import { Global, WithInputs } from "../GlobalState";
import { QRegister } from "../Registry";
import { AsList, AsNumber, Link, Truthy, Value, Vectorized } from "../Types";
import { _Compare, _Equal } from "./Math";

function Map(left: Value, right: Link): Value {
  return AsList(left).map((x) => right.Call(x));
}

function IndexMap(left: Value, right: Link): Value {
  return AsList(left).map((x, i) => right.Call(x, i));
}

function DeepMap(left: Value, right: Link): Value {
  return new Vectorized(left).get(v=>right.Call(v));
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
    initial.Call()
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
  let lVal = initial.Call();
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
  return AsList(left).concat().reverse();
}

function First(left: Value): Value {
  if (typeof left === "string") return left[0];
  return AsList(left)[0];
}

function FirstWhere(left: Value, predicate: Link): Value {
  if (typeof left === "string") left = left.split('');
  left = AsList(left);
  for(let i=0; i < left.length; i++)
    if(Truthy(predicate.Call(left[i])))
      return left[i];
  return undefined;
}

function FirstIndexOf(left: Value, predicate: Link): Value {
  if (typeof left === "string") left = left.split('');
  left = AsList(left);
  for(let i=0; i < left.length; i++)
    if(Truthy(predicate.Call(left[i])))
      return i;
  return -1;
}

function Head(left: Value, count: Link): Value {
  return new Vectorized(count.Call()).get(count => {
    if (typeof left === "string")
      return left.slice(0, AsNumber(count));
    return AsList(left).slice(0, AsNumber(count));
  });
}

function Last(left: Value): Value {
  if (typeof left === "string") return left.slice(-1);
  return AsList(left).last();
}

function LastWhere(left: Value, predicate: Link): Value {
  if (typeof left === "string") left = left.split('');
  left = AsList(left);
  for(let i=left.length - 1; i >= 0; i--)
    if(Truthy(predicate.Call(left[i])))
      return left[i];
  return undefined;
}

function LastIndexOf(left: Value, predicate: Link): Value {
  if (typeof left === "string") left = left.split('');
  left = AsList(left);
  for(let i=left.length - 1; i >= 0; i--)
    if(Truthy(predicate.Call(left[i])))
      return i;
  return -1;
}

function Tail(left: Value, count: Link): Value {
  return new Vectorized(count.Call()).get(count => {
    if (typeof left === "string")
      return left.slice(AsNumber(count));
    return AsList(left).slice(AsNumber(count));
  });
}

function AtIndex(left: Value, index: Link): Value {
  return new Vectorized(index.Call()).get(index=>AsList(left)[AsNumber(index)]);
}

function Slice(left: Value, start: Link, length: Link): Value {
  return new Vectorized(start.Call(), length.Call()).get((start, length)=>
    AsList(left).slice(
      AsNumber(start),
      AsNumber(start) + AsNumber(length)
    )
  );
}

// MORE COMPLICATED FUNCTIONS TIME~
function Sort(left: Value): Value {
  return AsList(left)
    .concat()
    .sort((a, b) => _Compare(a,b));
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
  return AsList(left).filter(
    (v, i, a) => a.findIndex((x) => _Equal(x, v)) === i
  );
}

function UniqueBy(left: Value, right: Link): Value {
  return AsList(left).filter(
    (v, i, a) => a.findIndex((x) => _Equal(right.Call(x), right.Call(v))) === i
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
  let targetLength = AsNumber(right.Call());
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

function Union(left: Value, r: Link): Value {
  let right = AsList(r.Call());
  let l = AsList(left).concat();
  for(let e of right){
    if(l.some((v:Value)=>_Equal(e,v))) continue;
    l.push(e);
  }
  if(typeof left === 'string')
    return l.join('');
  return l;
}

function Intersect(left: Value, r: Link): Value {
  let right = AsList(r.Call());
  let i = [];
  for(let e of AsList(left)){
    if(!right.some((v:Value)=>_Equal(e,v))) continue;
    i.push(e);
  }
  if(typeof left === 'string')
    return i.join('');
  return i;
}

function Without(left: Value, r: Link): Value {
  let right = AsList(r.Call());
  let l = AsList(left);
  let i = [];
  for(let e of l){
    if(right.some((v:Value)=>_Equal(e,v))) continue;
    i.push(e);
  }
  if(typeof left === 'string')
    return i.join('');
  return i;
}

function Max(left: Value): Value {
  left = AsList(left);
  if(left.length === 0)
    return undefined;
  let best = left[0];
  for(let i=1; i < left.length; i++){
    if (_Compare(best, left[i]) < 0){
      best = left[i]
    }
  }
  return best;
}

function MaxBy(left: Value, selector: Link): Value {
  left = AsList(left);
  if(left.length === 0)
    return undefined;
  let best = left[0];
  let bestValue = selector.Call(best);
  for(let i=1; i < left.length; i++){
    let lValue = selector.Call(left[i]);
    if (_Compare(bestValue, lValue) < 0){
      best = left[i];
      bestValue = lValue;
    }
  }
  return best;
}

function Min(left: Value): Value {
  left = AsList(left);
  if(left.length === 0)
    return undefined;
  let best = left[0];
  for(let i=1; i < left.length; i++){
    if (_Compare(best, left[i]) > 0){
      best = left[i]
    }
  }
  return best;
}

function MinBy(left: Value, selector: Link): Value {
  left = AsList(left);
  if(left.length === 0)
    return undefined;
  let best = left[0];
  let bestValue = selector.Call(best);
  for(let i=1; i < left.length; i++){
    let lValue = selector.Call(left[i]);
    if (_Compare(bestValue, lValue) > 0){
      best = left[i];
      bestValue = lValue;
    }
  }
  return best;
}

function GroupBy(left: Value, selector: Link): Value {
  let groups: [Value, Value[]][] = [];
  for(let e of AsList(left)) {
    let key = selector.Call(e);
    let g: Value[]|undefined = undefined;
    for(let group of groups){
      if(_Equal(key, group[0])){
        g = group[1];
        break;
      }
    }
    if(!g){
      groups.push([key, g=[]])
    }
    g.push(e);
  }
  if(typeof(left) === "string")
    return groups.map(c=>c[1].join(""));
  return groups.map(c=>c[1]);
}

function SplitBetween(left: Value, predicate: Link): Value {
  let l = AsList(left);
  if(l.length === 0) return [];
  let last = l[0];
  let cur: Value[] = [l[0]];
  let lists: Value[][] = [cur];
  for(let i=1; i < l.length; i++){
    if(WithInputs([last, l[i]], ()=>Truthy(predicate.Call(last)))){
      lists.push(cur = []);
    }
    cur.push(l[i]);
    last = l[i];
  }
  if(typeof(left) === "string")
    return lists.map(c=>c.join(""));
  return lists;
}

function SplitAt(left: Value, predicate: Link): Value {
  let l = AsList(left);
  if(l.length === 0) return [];
  let cur: Value[] = [];
  let lists: Value[][] = [cur];
  for(let i=0; i < l.length; i++){
    if(Truthy(predicate.Call(l[i]))){
      lists.push(cur = []);
    }else{
      cur.push(l[i]);
    }
  }
  if(typeof(left) === "string")
    return lists.map(c=>c.join(""));
  return lists;
}

function Transpose(left: Value): Value {
  if(typeof(left) === "string"){
    // Horror oneliners make me happy.
    return (Transpose(left.split('\n').map(c=>c.split(''))) as Value[][]).map(c=>c.map(c=>c??' ').join('')).join('\n');
  }
  left = AsList(left);
  let l: Value[][] = [];
  for(let y=0; y < left.length; y++){
    let lefty = AsList(left[y]);
    for(let x = 0; x < lefty.length; x++){
      l[x] ??= [];
      while(l[x].length < y)
        l[x].push(undefined);
      l[x][y] = lefty[x];
    }
  }
  return l;
}

function Repeat(left: Value, right: Link) {
  return new Vectorized(right.Call()).get(right => {
    if(typeof(left) === "string")  return left.repeat(AsNumber(right));
    return AsList(left).repeat(AsNumber(right))
  })
}

function CartesianProduct(list: Value, secondList: Link): Value {
  let left = AsList(list);
  let right = AsList(secondList.Call());
  return left.flatMap(l => {
    l = AsList(l);
    return right.map(r => (l as Value[]).concat([r]));
  })
}

function AllCartesianProducts(lists: Value): Value {
  lists = AsList(lists).concat();
  if(lists.length <= 1) return lists;
  if(lists.length === 2){
    let left = AsList(lists[0]);
    let right = AsList(lists[1]);
    return left.flatMap(l => {
      l = AsList(l);
      return right.map(r => (l as Value[]).concat([r]));
    })
  }
  let left = AsList(lists.splice(0, 1)[0]);
  let right = AsList(AllCartesianProducts(lists));
  return left.flatMap(l => {
    l = AsList(l);
    return right.map(r => (l as Value[]).concat(r));
  })
}

function Flatten(list: Value): Value {
  return AsList(list).flat();
}

function FlattenUpto(list: Value, depth: Link) {
  list = AsList(list);
  return new Vectorized(depth.Call()).get(depth => {
    depth = Math.max(0, AsNumber(depth)) >>> 0;
    return list.flat(depth as 0); // Not actually 0, but shuts typescript up. :(
  })
}

function RotateLeft(list: Value, count: Link){
  return new Vectorized(count.Call()).get(count => {
    count = AsNumber(count);
    let l = AsList(list);
    if(typeof(list) === 'number')
      l = AsList(list.toString(2));
    l = l.concat();
    l = l.concat(l.splice(0, count));
    if(typeof(list) === 'number')
      return +('0b'+l.join());
    if(typeof(list) === 'string')
      return l.join();
    return l;
  });
}

function RotateRight(list: Value, count: Link){
  return new Vectorized(count.Call()).get(count => {
    count = AsNumber(count);
    let l = AsList(list);
    if(typeof(list) === 'number')
      l = AsList(list.toString(2));
    l = l.concat();
    l = l.splice(-count).concat(l);
    if(typeof(list) === 'number')
      return +('0b'+l.join());
    if(typeof(list) === 'string')
      return l.join();
    return l;
  });
}

function ZipBy(left: Value, method: Link, right: Link){
  let r = AsList(right.Call());
  let l = AsList(left);
  let len = Math.min(l.length, r.length);
  let zipped = [];
  for(let i=0; i < len; i++)
    zipped[i] = method.Call(l[i], r[i]);
  return zipped;
}


function Zip(left: Value, right: Link){
  let r = AsList(right.Call());
  let l = AsList(left);
  let len = Math.min(l.length, r.length);
  let zipped = [];
  for(let i=0; i < len; i++)
    zipped[i] = AsList(l[i]).concat(AsList(r[i]))
  return zipped;
}

function ZipMaximally(left: Value, right: Link){
  let r = AsList(right.Call());
  let l = AsList(left);
  let len = Math.min(l.length, r.length);
  let zipped = [];
  for(let i=0; i < len; i++)
    zipped[i] = AsList(l[i] ?? []).concat(AsList(r[i] ?? []))
  return zipped;
}

function Apply(list: Value, method: Link){
  return method.Call(...AsList(list));
}

/*
    List Comprehension functions are mapped to bytes 0xD0...
    They should use symbols that are list related, or represent their function.
    Duplicate symbols are never allowed, but substring suffixes are allowed. eg. '↧' and '↧₁'
*/

QRegister("Apply", Apply, "↩₋", 0xcb);
QRegister("ZipBy", ZipBy, "↭ₓ", 0xcc);
QRegister("Zip", Zip, "↭", 0xcd);
QRegister("ZipMaximally", ZipMaximally, "↭₊", 0xce);
QRegister("IndexMap", IndexMap, "↦₁", 0xcf);
QRegister("Map", Map, "↦", 0xd0);
QRegister("Filter", Filter, "↥", 0xd1);
QRegister("Reduce", Reduce, "↧", 0xd2);
QRegister("ReduceInitial", ReduceInitial, "↧₁", 0xd3);
QRegister("Fold", Fold, "↩", 0xd4);
QRegister("FoldInitial", FoldInitial, "↩₁", 0xd5);
QRegister("Length", Length, "↔", 0xd6);
QRegister("Reverse", Reverse, "↶", 0xd7);
QRegister("First", First, "⇤", 0xd8);
QRegister("FirstWhere", FirstWhere, "⇤₀", 0xd9);
QRegister("FirstIndexOf", FirstIndexOf, "⇤₁", 0xdA);
QRegister("Head", Head, "⇤ₓ", 0xdB);
QRegister("Last", Last, "⇥", 0xdC);
QRegister("LastWhere", LastWhere, "⇥₀", 0xdD);
QRegister("LastIndexOf", LastIndexOf, "⇥₁", 0xdE);
QRegister("Tail", Tail, "⇥ₓ", 0xdF);
QRegister("AtIndex", AtIndex, "⇪", 0xE0);
QRegister("Slice", Slice, "⇪ₓ", 0xE1);
QRegister("Sort", Sort, "⇅", 0xE2);
QRegister("SortBy", SortBy, "⇅ₓ", 0xE3);
QRegister("Unique", Unique, "u", 0xe4);
QRegister("UniqueBy", UniqueBy, "uₓ", 0xe5);
QRegister("Permutations", Permutations, "p", 0xe6);
QRegister("Choices", Choices, "c", 0xe7);
QRegister("ChoicesOfLength", ChoicesOfLength, "cₓ", 0xe8);
QRegister("Sum", Sum, "Σ", 0xe9);
QRegister("SumBy", SumBy, "Σₓ", 0xea);
QRegister("Product", Product, "Π", 0xeb);
QRegister("ProductBy", ProductBy, "Πₓ", 0xec);
QRegister("DeepMap", DeepMap, "↦ₓ", 0xed);
QRegister("Union", Union, "∪", 0xee);
QRegister("Intersect", Intersect, "∩", 0xef);
QRegister("Max", Max, '⇈', 0xf0);
QRegister("MaxBy", MaxBy, '⇈ₓ', 0xf1);
QRegister("Min", Min, '⇊', 0xf2);
QRegister("MinBy", MinBy, '⇊ₓ', 0xf3);
QRegister("GroupBy", GroupBy, "G", 0xf4);
QRegister("SplitBetween", SplitBetween, "⇋", 0xf5)
QRegister("SplitAt", SplitAt, "⇋₁", 0xf6)
QRegister("Transpose", Transpose, "‘", 0xf7);
QRegister("Without", Without, "∖", 0xf8);
QRegister("Repeat", Repeat, "r", 0xf9)
QRegister("CartesianProduct", CartesianProduct, '×', 0xfa);
QRegister("AllCartesianProducts", AllCartesianProducts, '×ₓ', 0xfb);
QRegister("Flatten", Flatten, "_", 0xfc);
QRegister("FlattenUpto", FlattenUpto, "_ₓ", 0xfd);
QRegister("RotateLeft", RotateLeft, "↺", 0xfe);
QRegister("RotateRight", RotateRight, "↻", 0xff);