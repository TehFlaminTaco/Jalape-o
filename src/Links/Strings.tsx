import { Global, WithInputs } from "../GlobalState";
import { VectorizedOver } from "../Helpers";
import { QRegister } from "../Registry";
import { AsList, AsNumber, AsString, Link, Value, Vectorized } from "../Types";

function Print(left: Value): Value {
  Global.Output += `${AsString(left)}\n`;
  self.postMessage(['output',`${Global.Output}`])
  return undefined;
}

function Write(left: Value): Value {
  Global.Output += `${AsString(left)}`;
  self.postMessage(['output',`${Global.Output}`])
  return undefined;
}

function Replace(haystack: Value, needle: Link, replacement: Link): Value {
  return new Vectorized(haystack, needle.Call()).get((haystack, needle)=>{
    let h = AsString(haystack);
    let n = new RegExp(AsString(needle), "g");
    return h.replaceAll(n, (...args) =>
      WithInputs(args, () => AsString(replacement.Call(args[0])))
    );
  });
}

function Split(left: Value, separator: Link): Value {
  return new Vectorized(left, separator.Call()).get((left, separator)=>
    AsString(left)
      .split(AsString(separator))
      .map((x) => x as Value)
  );
}

function Join(left: Value): Value {
  return AsList(left).join("");
}

function JoinBy(left: Value, separator: Link): Value {
  return new Vectorized(separator.Call()).get(separator => 
    AsList(left).map(AsString).join(AsString(separator))
  );
}

function Words(left: Value): Value {
  return new Vectorized(left).get(left =>
    AsString(left)
      .split(" ")
      .map((x) => x as Value)
  );
}

function Chars(left: Value): Value {
  return new Vectorized(left).get(left =>
    AsString(left)
      .split("")
      .map((x) => x as Value)
  );
}

function Lines(left: Value): Value {
  return new Vectorized(left).get(left =>
    AsString(left)
      .split("\n")
      .map((x) => x as Value)
  );
}

function JoinWords(left: Value): Value {
  return AsList(left).map(AsString).join(" ");
}

function JoinLines(left: Value): Value {
  return AsList(left).map(AsString).join("\n");
}

function Match(left: Value, right: Link): Value {
  // Return the first match
  return new Vectorized(left, right.Call()).get((left, right)=>{
    let h = AsString(left);
    let r = new RegExp(AsString(right));
    let m = h.match(r);
    if (!m) return [];
    if (m.length === 1) return m[0];
    return [...m];
  });
}

function Matches(left: Value, right: Link): Value {
  // Return all matches
  return new Vectorized(left, right.Call()).get((left, right)=>{
    let h = AsString(left);
    let r = new RegExp(AsString(right), "g");
    let m = [...h.matchAll(r)];
    return m.map((x) => {
      if (x.length === 1) return x[0];
      return [...x];
    });
  });
}

function ToString(left: Value): Value {
  return AsString(left);
}

function _FormatX(left: Value, children: Value[]): string {
  return AsString(left).replaceAll(/%(.)/g, function(_,n){
    let v = +n;
    if(v!==v) // NaN
      return n;
    return AsString(children[v]);
  })
}

function FormatX(left: Value, children: Link){
  return _FormatX(left, AsList(children.Call()))
}

function Format1(left: Value, child1: Link){
  return new Vectorized(left).get(left=>_FormatX(left, [
    child1.Call()
  ]));
}

function Format2(left: Value, child1: Link, child2: Link){
  return new Vectorized(left).get(left=>_FormatX(left, [
    child1.Call(),
    child2.Call()
  ]));
}

function Format3(left: Value, child1: Link, child2: Link, child3: Link){
  return new Vectorized(left).get(left=>_FormatX(left, [
    child1.Call(),
    child2.Call(),
    child3.Call()
  ]));
}

function Byte(left: Value): Value {
  return new Vectorized(left).get(left=>{
      left = AsString(left);
      if(left.length === 0)
        return undefined;
      if(left.length === 1)
        return left.charCodeAt(0);
      return left.split('').map(c=>c.charCodeAt(0));
  })
}

function Char(left: Value): Value {
  return new Vectorized(left).get(left=>{
    left = AsNumber(left);
    if(left !== left) return '';
    return String.fromCharCode(left);
  })
}

function Lower(left: Value): Value {
  return new Vectorized(left).get(left=>AsString(left).toLowerCase());
}
function Upper(left: Value): Value {
  return new Vectorized(left).get(left=>AsString(left).toUpperCase());
}
function CapitalizeWords(left: Value): Value {
  return new Vectorized(left).get(left=>AsString(left).capitalizeWords());
}


function Grid(str: Value): Value {
  return new Vectorized(str).get(str=>{
      let g = AsString(str)
        .split('\n')
      let lineMax = Math.max(...g.map(c=>c.length));
      return g.map(c=>c.padEnd(lineMax, ' ').split(''));
    });
}

function JoinGrid(grid: Value): Value {
  return AsList(grid)
    .map(c=>AsList(c)
      .map(AsString)
      .join('')
    ).join('\n');
}

function PadLeft(str: Value, padding: Link, count: Link): Value {
  let c = AsNumber(count.Call());
  if(typeof(str) === "string"){
    let p = AsString(padding.Call());
    return p.repeat(Math.ceil(c / p.length)).substring(0, c - str.length) + str
  }
  let l = AsList(str).concat();
  let p = padding.Call();
  while(l.length < c)
    l = [p].concat(l);
  return l;
}

function PadRight(str: Value, padding: Link, count: Link): Value {
  let c = AsNumber(count.Call());
  if(typeof(str) === "string"){
    let p = AsString(padding.Call());
    return str + p.repeat(Math.ceil(c / p.length)).substring(str.length, Math.max(str.length, c))
  }
  let l = AsList(str).concat();
  let p = padding.Call();
  while(l.length < c)
    l = l.concat([p]);
  return l;
}

QRegister("Print", Print, "P", 0x10);
QRegister("Write", Write, "W", 0x11);
QRegister("Replace", Replace, "R", 0x12);
QRegister("Split", Split, "S", 0x13);
QRegister("Join", Join, "J", 0x14);
QRegister("JoinBy", JoinBy, "j", 0x15);
QRegister("JoinWords", JoinWords, "w₋", 0x16);
QRegister("JoinLines", JoinLines, "L₋", 0x17);
QRegister("Words", Words, "w", 0x18);
QRegister("Chars", Chars, "C", 0x19);
QRegister("Lines", Lines, "L", 0x1A);
QRegister("Match", Match, "M", 0x1B);
QRegister("Matches", Matches, "m", 0x1C);
QRegister("ToString", ToString, "s", 0x1D);
QRegister("Format1", Format1, "F₁", 0x01);
QRegister("Format2", Format2, "F₂", 0x02);
QRegister("Format3", Format3, "F₃", 0x03);
QRegister("FormatX", FormatX, "Fₓ", 0x04);
QRegister("Byte", Byte, "B", 0x1E);
QRegister("Char", Char, "B₋", 0x1F);
QRegister("Upper", Upper, "U", 0x2B);
QRegister("Lower", Lower, "U₋", 0x2C);
QRegister("CapitalizeWords", CapitalizeWords, "T", 0x2D);
QRegister("Grid", Grid, "G₊", 0x0C);
QRegister("JoinGrid", JoinGrid, "G₋", 0x0D);
QRegister("PadLeft", PadLeft, "L₊", 0x0E);
QRegister("PadRight", PadRight, "R₊", 0x0F);