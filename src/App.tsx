import "./styles.css";
import AceEditor from "react-ace";
import { Ace } from "ace-builds";
import { ByteMap, ToCharacters, FromCharacters, NamesToBytes } from "./Registry";
import {compress, decompress} from "@remusao/smaz";
import {
  Compile,
  Evaluate,
  ParseAsPseudoLinks,
  ParseVerbose,
  TrimPseudoLinks,
} from "./Parser";

import "./Links/NumberConstant";
import "./Links/LinkGroup";
import "./Links/CallChain";
import "./Links/Negative";
import "./Links/StringConstant";
import "./Links/Pair";
import "./Links/Input";
import "./Links/Math";
import "./Links/ListComprehension";
import "./Links/Noop";
import "./Links/Strings";
import "./Links/ControlFlow";
import "./Links/Store";
import { AsString } from "./Types";
import { Global } from "./GlobalState";
import ace from "react-ace";
import "ace-builds/src-noconflict/ext-language_tools"
import { Metas, ValidateMeta } from "./Meta";

import ByteRunner from "./RunnerWorker.tsx?worker";
import { RunData, TalkData } from "./RunData";

const VERSION = 5;

let lastByteCode: Uint8Array = new Uint8Array([]);
let byteSource: "verbose"|"hex" = "verbose";
let CurWorker: Worker | undefined = undefined;
let WorkerLocked: boolean = true;

function runBytecode(byteCode: Uint8Array){
  if(WorkerLocked || CurWorker === undefined){
    CurWorker?.terminate(); // Kill any currently living workers.
    CurWorker = new ByteRunner();
    CurWorker!.onmessage = (event: MessageEvent<TalkData>)=> {
      switch(event.data[0]){
        case 'lock':
          WorkerLocked = true; break;
        case 'unlock':
          WorkerLocked = false; break;
        case 'output':
          document.getElementById(
            "output"
          )!.textContent = event.data[1];
          break;
      }
    }
  }
  lastByteCode = byteCode;
  // Try to parse inputfield as a json object (implicitly wrapped in [])
  let inputText = (document.getElementById("inputfield") as HTMLTextAreaElement)
    .value;
  inputText = `[${inputText}]`;
  try {
    let parsedInput = JSON.parse(inputText);
    Global.Inputs = parsedInput;
  } catch (e) {
    document.getElementById(
      "output"
    )!.textContent = `Invalid input, must be in JSON format separated by commas`;
    return;
  }
  WorkerLocked = true;
  CurWorker!.postMessage([
    Global.Inputs,
    byteCode
  ] as RunData)
}

function reRunBytecode(){
  runBytecode(lastByteCode);
}

const lamb = document.createElement("div");
function HTMLEscape(text: string): string {
  lamb.innerText = text;
  return lamb.innerHTML;
}

function codeChanged(newCode: string) {
  UpdateURL()
  byteSource = "verbose";
  if (newCode.length === 0) {
    let s = "   00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F";
    for (let y = 0; y < 16; y++) {
      s += `<br>${y.toString(16).toUpperCase()}0`;
      for (let x = 0; x < 16; x++) {
        let c = ByteMap.get(y * 16 + x) ?? "??";
        s += c === "??" ? ` ${c}` : ` <span class='singlecharacter'>${HTMLEscape(c)}</span> `;
      }
    }
    document.getElementById("modified")!.innerHTML = s;
    return;
  }
  try {
    let parsed = ParseVerbose(newCode);
    let byteCode = FromCharacters(parsed);
    let pLinks = ParseAsPseudoLinks(byteCode);
    pLinks = TrimPseudoLinks(pLinks);
    let reEmitted = pLinks.flatMap((c) => [...c.ReEmit()]);
    (document.querySelector("#hexinput") as HTMLTextAreaElement)!.value = reEmitted.map(c=>(c < 16 ? '0' : '') + c.toString(16).toUpperCase()).join(' ');
    let recharacterized = ToCharacters(new Uint8Array(reEmitted));
    document.getElementById("modified")!.innerHTML = recharacterized;
    runBytecode(new Uint8Array(reEmitted))
  } catch (e) {
    document.getElementById("output")!.textContent = `${e}`;
  }
}

function changeHex(evnt: React.ChangeEvent<HTMLTextAreaElement>){
  UpdateURL()
  byteSource = "hex";
  let modified = evnt.target.value.replaceAll(/[^a-f0-9 ]/gi,"");
  modified = modified.replaceAll(/ (?!$)/g,"");
  modified = modified.toUpperCase();
  modified = modified.replaceAll(/(\w\w)(?=\w)/g, "$1 ");
  evnt.target.value = modified;
  if(modified.length === 0){
    let s = "   00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F";
    for (let y = 0; y < 16; y++) {
      s += `\n${y.toString(16).toUpperCase()}0`;
      for (let x = 0; x < 16; x++) {
        let c = ByteMap.get(y * 16 + x) ?? "??";
        s += c === "??" ? ` ${c}` : ` <span class='singlecharacter'>${HTMLEscape(c)}</span> `;
      }
    }
    document.getElementById("modified")!.innerHTML = s;
    return;
  }
  let bytes = new Uint8Array(modified.split(' ').filter(c=>c.length).map(c=>+`0x${c}`));
  let recharacterized = ToCharacters(bytes);
  document.getElementById("modified")!.innerHTML = recharacterized;
  runBytecode(bytes);
}

function changeTab(evnt: React.MouseEvent<HTMLButtonElement>){
  let tab = (evnt.target as HTMLButtonElement).getAttribute("data-tab");
  document.querySelectorAll(".btn.tab, .editor").forEach(t=>{
    if(!t.getAttribute("data-tab"))
      t.setAttribute("data-tab","verbose");
    if(t.getAttribute("data-tab") === tab)
      t.classList.add("active")
    else
      t.classList.remove("active")
  });
}

function changeInput(){
  UpdateURL()
  reRunBytecode();
}

function CheckForUpdates(): string {
  fetch(`../version.txt`, {cache: "no-store"}).then(c=>c.text()).then(c=>{
    if(+c > VERSION){
      document.querySelector(".middle")!.innerHTML = `v${VERSION} - A newer version is available <a href='../${VERSION}'>HERE</a>`
    }else{
      document.querySelector(".middle")!.innerHTML = `v${VERSION}`;
    }
  }).catch(()=>{
    document.querySelector(".middle")!.innerHTML = `v${VERSION} - Could not find newer version`;
  });

  return "Checking for updates...";
}

let editor: Ace.Editor|null;

function UpdateURL(){
  let url = new URL(window.location.href);
  let inpText = (document.querySelector("#inputfield") as HTMLTextAreaElement).value;
  url.searchParams.delete("input");
  url.searchParams.delete("short");
  url.searchParams.delete("verbose");
  url.searchParams.delete("hex");
  if(inpText !== "")
    url.searchParams.set("input", inpText);
  if(byteSource === "hex"){
    let txt = btoa((document.querySelector('#hexinput')! as HTMLTextAreaElement).value.split(' ').filter(c=>c.length).map(c=>String.fromCharCode(+`0x${c}`)).join(''));
    url.searchParams.set("hex", txt);
  }else{
    let text = editor!.getValue();
    let smaz = new URL(url);
    let verbose = new URL(url);
    smaz.searchParams.set("short", btoa([...compress(text)].map(c=>String.fromCharCode(c)).join('')));
    verbose.searchParams.set("verbose", text);
    if(`${smaz}`.length < `${verbose}`.length){
      url = smaz;
    }else{
      url = verbose;
    }
  }
  window.history.pushState(null, '', url);
}

function LoadSmazd(text: string){
  let verbose = decompress(new Uint8Array(atob(text).split('').map(c=>c.charCodeAt(0))));
  editor!.setValue(verbose);
}

function LoadVerbose(text: string){
  editor!.setValue(text);
}

function LoadHex(text: string){
  (document.querySelector('#hexinput')! as HTMLTextAreaElement).value = atob(text).split('').map(c=>c.charCodeAt(0)).map(c=>(c < 16 ? '0' : '') + c.toString(16).toUpperCase()).join(' ');
}

function hexPad(n: number, places: number = 4){
  let s = n.toString(16);
  while(s.length < places) s = `0${s}`;
  return s;
}

function RenderHex(Heap: Uint8Array){
  let heap = "   0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F\n";
  for (let i = 0; i < Heap.length; i += 16) {
    heap += `${hexPad(i, 4)}: `;
    for (let j = 0; j < 16; j++) {
      if (Heap[i + j] !== undefined) {
        heap += `${hexPad(Heap[i + j], 2)}`;
        heap += " ";
      } else heap += `   `;
    }
    heap += "\n";
  }
  return heap;
}

function CopyCMC(){
  let hex = [...lastByteCode].map(c=>(c < 16 ? '0' : '') + c.toString(16).toUpperCase()).join(' ');
  let code = ToCharacters(lastByteCode);

  let copyText = `[Jalapeño](https://www.github.com/TehFlaminTaco/Jalape-o), ${lastByteCode.length} bytes. [\`${code}\`](${window.location}) (Hex: \`${hex}\`)`;
  navigator.clipboard.writeText(copyText);
}

function CopyCodeGolf() {
  let hex = RenderHex(lastByteCode).replaceAll(/^/gm, "    ");
  let code = ToCharacters(lastByteCode);

  let s = `# [Jalapeño](https://www.github.com/TehFlaminTaco/Jalape-o), ${lastByteCode.length} bytes\n`
  s += `    ${code}\n\n`
  s += `## Hex-Dump of Bytecode\n`
  s += `${hex}\n\n[Try it Online!](${window.location})`

  navigator.clipboard.writeText(s);
}

function SetupAce(e: Ace.Editor){
  ValidateMeta();
  editor = e;
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true
  })
  const wordCompleter = {
    getCompletions: function(editor: Ace.Editor, session: Ace.EditSession, pos: Ace.Point, prefix: string, callback: Ace.CompleterCallback) {
      callback(null, [...NamesToBytes.keys()].map(c=>({
        caption: Metas.getStructure(c)!,
        value: c,
        meta: "",
        docText: Metas.getDescription(c)!
      })));
    }
  }
  setTimeout(()=>e.completers = [wordCompleter],100);
}

export default function App() {
  const search = new URL(`${window.location}`).searchParams;
  setTimeout(()=>{
    if(search.has("input"))
      (document.querySelector("#inputfield") as HTMLTextAreaElement).value = search.get("input")!;
    if(search.has("short"))
      LoadSmazd(search.get("short")!)
    else if(search.has("verbose"))
      LoadVerbose(search.get("verbose")!)
    else if(search.has("hex")){
      LoadHex(search.get("hex")!);
      (document.querySelector('#btn_tab_hex') as HTMLButtonElement)!.click();
    }
  },100)
  return (
    <div className="App">
      <div id="buttons">
        <div className="left">
          <button onClick={changeTab} data-tab="verbose" className="btn tab active" id='btn_tab_code'>Code</button>
          <button onClick={changeTab} data-tab="hex"     className="btn tab"        id='btn_tab_hex' >Hex</button>
        </div>
        <div className="middle">{CheckForUpdates()}</div>
        <div className="right">
          <button className="btn" onClick={CopyCodeGolf}>Code-Golf</button>
          <button className="btn" onClick={CopyCMC}>CMC</button>
        </div>
      </div>
      <div id="main">
        <div id="editors">
          <AceEditor data-tab="verbose" className="editor active" width="100%" height="100%" onLoad={SetupAce} onChange={codeChanged} />
          <div data-tab="hex" className="editor">
            <div id="hexgutter">
              <span className='gutter' data-index={0x00}>00</span>
            </div>
            <div id="hexright">
              <div id="hexcolumns">
                <span className='hexcolumn' data-index={0x00}>00</span> <span className='hexcolumn' data-index={0x01}>01</span> <span className='hexcolumn' data-index={0x02}>02</span> <span className='hexcolumn' data-index={0x03}>03</span> <span className='hexcolumn' data-index={0x04}>04</span> <span className='hexcolumn' data-index={0x05}>05</span> <span className='hexcolumn' data-index={0x06}>06</span> <span className='hexcolumn' data-index={0x07}>07</span> <span className='hexcolumn' data-index={0x08}>08</span> <span className='hexcolumn' data-index={0x09}>09</span> <span className='hexcolumn' data-index={0x0A}>0A</span> <span className='hexcolumn' data-index={0x0B}>0B</span> <span className='hexcolumn' data-index={0x0C}>0C</span> <span className='hexcolumn' data-index={0x0D}>0D</span> <span className='hexcolumn' data-index={0x0E}>0E</span> <span className='hexcolumn' data-index={0x0F}>0F</span>
              </div>
              <textarea
                id="hexinput"
                placeholder = "00 01 02..."
                spellCheck="false"
                onChange={changeHex}
              />
            </div>
          </div>
        </div>
        <div id="results">
          <div id="modified"></div>
          <div id="input">
            <textarea
              id="inputfield"
              placeholder="Program Input..."
              spellCheck="false"
              onChange={changeInput}
            />
          </div>
          <div id="output"></div>
        </div>
      </div>
    </div>
  );
}
