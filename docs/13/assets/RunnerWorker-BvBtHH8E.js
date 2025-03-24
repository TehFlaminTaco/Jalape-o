var _r=Object.defineProperty;var Yr=(R,x,z)=>x in R?_r(R,x,{enumerable:!0,configurable:!0,writable:!0,value:z}):R[x]=z;var y=(R,x,z)=>Yr(R,typeof x!="symbol"?x+"":x,z);(function(){"use strict";function R(e){let t=[];for(;e>0;)t.push(128+e%128),e=Math.floor(e/128);return t[0]-=128,new Uint8Array(t.reverse())}function x(e,t=0){let n=0,r=t;for(;r<e.length&&e[r]>=128;)n=n*128+e[r]-128,r++;return n=n*128+e[r],[n,r+1]}function z(e,t){return typeof e=="object"?e.map(n=>z(n,t)):t(e)}String.prototype.capitalizeWords=function(){return this.replaceAll(/( |^)\w/g,e=>e.toUpperCase())},Array.prototype.last=function(){return this[this.length-1]},Array.prototype.fromToBase=function(e,t){let n=[];for(let r of this){let i=r;for(let o=0;o<n.length;o++)i+=n[o]*e,n[o]=i%t,i=Math.floor(i/t);for(;i>0;)n.push(i%t),i=Math.floor(i/t)}return n.reverse(),n},Array.prototype.toInt255=function(){return this.fromToBase(256,255)},Array.prototype.fromInt255=function(){return this.fromToBase(255,256)},Math.factorial=function(e){let t=1;for(let n=2;n<=e;n++)t*=n;return t},Array.prototype.repeat=function(e){let t=[];for(let n=0;n<e;n++)t=t.concat(this);return t};class re{constructor(){y(this,"Chains",[]);y(this,"Inputs",[]);y(this,"Storage",[]);y(this,"Output","")}}let g=new re;function b(e,t){for(e=e.concat();e.length<g.Inputs.length;)e[e.length]=g.Inputs[e.length];let n=g.Inputs;g.Inputs=e;let r=t();return g.Inputs=n,r}let M=new Map,k=new Map,L=new Map,I=new Map,V=new Map;function F(e){let t="";for(const n of e)M.has(n)?t+=M.get(n):t+=`¿${n<16?"0":""}${n.toString(16)}?`;return t}function N(e,t,n,r,...i){if(!t.match(/^.[₀-₉ₓ₊₋]?$/))throw new Error(`Bad character representation for "${e}". "${t}" is not a valid token`);{if(M.has(n))throw new Error(`Duplicate bytecode defined [${e}, ${t}, 0x${n.toString(16)}] (Already defined as ${M.get(n)} : ${I.get(n)})`);if(k.has(t))throw new Error(`Duplicate charcode defined [${e}, ${t}, 0x${n.toString(16)}] (Already defined as ${k.get(t)} : ${I.get(k.get(t))})`);if(L.has(e))throw new Error(`Duplicate name defined [${e}, ${t}, 0x${n.toString(16)}] (Already defined as ${L.get(e)} : ${M.get(L.get(e))})`)}M.set(n,t),k.set(t,n),L.set(e.toLowerCase(),n),I.set(n,e.toLowerCase()),V.set(n,r);for(const o of i)L.set(o.toLowerCase(),n)}function s(e,t,n,r,...i){N(e,n,r,t,...i)}N("chainseperator","§",10,()=>{throw new Error("Don't evaluate me!")});function c(e){switch(typeof e){case"number":return e;case"string":return+e;case"object":return c(e[0]);case"undefined":return 0;default:throw new Error(`Unexpected value type ${typeof e}`)}}function p(e){return typeof e=="object"?`[${e.map(p).join(",")}]`:`${e}`}function u(e,t=!1){return typeof e=="string"&&!t?e.split(""):typeof e=="number"?`${e}`.split("").map(n=>+n):typeof e!="object"?[e]:e}function d(e){switch(typeof e){case"number":return e!==0;case"string":return e.trim()!=="";case"object":return e.length>0;case"undefined":return!1;default:throw new Error(`Unexpected value type ${typeof e}`)}}class D{constructor(t,n){y(this,"Method");y(this,"Arguments",[]);y(this,"store",{});this.Method=t,this.Arguments=n}Call(...t){return t.length===0?this.Method(g.Inputs[0],...this.Arguments):b(t,()=>this.Method(t[0],...this.Arguments))}CallSoftly(t){return this.Method(t,...this.Arguments)}}class ie{constructor(t){y(this,"Links",[]);this.Links=t}Call(t){for(let n of this.Links)t=n.CallSoftly(t);return t}CallSoftly(t){for(let n of this.Links)t=n.CallSoftly(t);return t}}class f{constructor(...t){y(this,"values");this.values=t}vectorizeFrom(t,n){return t.length===1?z(t[0],n):z(t[0],r=>this.vectorizeFrom(t.slice(1),(...i)=>n(r,...i)))}map(t){return new f(this.vectorizeFrom(this.values,t))}get(t){return t===void 0?this.values[0]:this.vectorizeFrom(this.values,t)}}function ae(){return-1}function se(){return .5}function oe(){return 100}function le(){return 0}function ue(){return 1}function ce(){return 2}function fe(){return 3}function he(){return 4}function pe(){return 5}function ge(){return 6}function me(){return 7}function de(){return 8}function ye(){return 9}function be(){return 10}function we(){return Math.PI}function Ce(){return Math.E}function Re(){return this.store.integer}function xe(){return this.store.float}function G(e){if(e===-1)return"-₁";if(e===.5)return"½";if(e===100)return"e₂";if(e<0)return`-${G(-e)}`;if(e%1===0&&e>=0&&e<=9)return`${e>>>0}`;if(e===10)return"e₁";if(e%1===0)return`${F(R(e).reverse())}$`;{let t=0;for(;e%1>1e-7;)e*=10,t++;return`${F(new Uint8Array([t]))}${F(R(e).reverse())}‰`}}s("Zero",le,"0",48),s("One",ue,"1",49),s("Two",ce,"2",50),s("Three",fe,"3",51),s("Four",he,"4",52),s("Five",pe,"5",53),s("Six",ge,"6",54),s("Seven",me,"7",55),s("Eight",de,"8",56),s("Nine",ye,"9",57),s("Ten",be,"e₁",58),s("OneHundred",oe,"e₂",59),s("NegativeOne",ae,"-₁",60),s("Half",se,"½",61),s("IntegerConstant",Re,"$",62),s("FloatConstant",xe,"‰",63),s("Pi",we,"π",65),s("E",Ce,"e",66);function ve(e){return b([e],()=>g.Chains[0].Call(e))}function Se(e){return b([e],()=>g.Chains[1].Call(e))}function ze(e){return b([e],()=>g.Chains[2].Call(e))}function Me(e,t){let n=c(t.Call())>>>0;return b([e],()=>g.Chains[n].Call(e))}s("CallChain0",ve,"C₀",192),s("CallChain1",Se,"C₁",193),s("CallChain2",ze,"C₂",194),s("CallChainX",Me,"Cₓ",195);function W(){return{chars:new Map,code:void 0}}function Ae(e){const t=W();for(let n=0;n<e.length;n+=1){const r=e[n];let i=t;for(let o=0;o<r.length;o+=1){const l=r.charCodeAt(o);let h=i.chars.get(l);h===void 0&&(h=W(),i.chars.set(l,h)),i=h}i.code=n}return t}const Ie=new Uint8Array(0);class ke{constructor(t,n=3e4){this.trie=Ae(t),this.buffer=new Uint8Array(n),this.verbatim=new Uint8Array(255)}getCompressedSize(t){if(t.length===0)return 0;let n=0,r=0,i=0;for(;i<t.length;){let o=-1,l=-1,h=this.trie;for(let m=i;m<t.length&&(h=h.chars.get(t.charCodeAt(m)),h!==void 0);m+=1)h.code!==void 0&&(l=h.code,o=m+1);l===-1?(r++,i++,r===255&&(n+=2+r,r=0)):(r!==0&&(n+=2+(r===1?0:r),r=0),n++,i=o)}return r!==0&&(n+=2+(r===1?0:r)),n}compress(t){if(t.length===0)return Ie;let n=0,r=0,i=0;const o=t.length;for(;i<t.length;){let l=-1,h=-1,m=this.trie;for(let A=i;A<o&&(m=m.chars.get(t.charCodeAt(A)),m!==void 0);A+=1)m.code!==void 0&&(h=m.code,l=A+1);h===-1?(this.verbatim[r++]=t.charCodeAt(i++),r===255&&(n=this.flushVerbatim(r,n),r=0)):(r!==0&&(n=this.flushVerbatim(r,n),r=0),this.buffer[n++]=h,i=l)}return r!==0&&(n=this.flushVerbatim(r,n)),this.buffer.slice(0,n)}flushVerbatim(t,n){if(t===1)this.buffer[n++]=254,this.buffer[n++]=this.verbatim[0];else{this.buffer[n++]=255,this.buffer[n++]=t;for(let r=0;r<t;r+=1)this.buffer[n++]=this.verbatim[r]}return n}}class Le{constructor(t){this.codebook=t}decompress(t){if(t.byteLength===0)return"";let n="",r=0;for(;r<t.byteLength;)if(t[r]===254)n+=String.fromCharCode(t[r+1]),r+=2;else if(t[r]===255){const i=r+t[r+1]+2;for(r+=2;r<i;r+=1)n+=String.fromCharCode(t[r])}else n+=this.codebook[t[r]],r+=1;return n}}class Ve{constructor(t,n=3e4){this.codebook=t,this.compressor=new ke(t,n),this.decompressor=new Le(t)}compress(t){return this.compressor.compress(t)}getCompressedSize(t){return this.compressor.getCompressedSize(t)}decompress(t){return this.decompressor.decompress(t)}}const je=` ;the;e;t;a;of;o;and;i;n;s;e ;r; th; t;in;he;th;h;he ;to;\r
;l;s ;d; a;an;er;c; o;d ;on; of;re;of ;t ;, ;is;u;at;   ;n ;or;which;f;m;as;it;that;
;was;en;  ; w;es; an; i;f ;g;p;nd; s;nd ;ed ;w;ed;http://;https://;for;te;ing;y ;The; c;ti;r ;his;st; in;ar;nt;,; to;y;ng; h;with;le;al;to ;b;ou;be;were; b;se;o ;ent;ha;ng ;their;";hi;from; f;in ;de;ion;me;v;.;ve;all;re ;ri;ro;is ;co;f t;are;ea;. ;her; m;er ; p;es ;by;they;di;ra;ic;not;s, ;d t;at ;ce;la;h ;ne;as ;tio;on ;n t;io;we; a ;om;, a;s o;ur;li;ll;ch;had;this;e t;g ;e\r
; wh;ere; co;e o;a ;us; d;ss;
\r
;\r
\r;="; be; e;s a;ma;one;t t;or ;but;el;so;l ;e s;s,;no;ter; wa;iv;ho;e a; r;hat;s t;ns;ch ;wh;tr;ut;/;have;ly ;ta; ha; on;tha;-; l;ati;en ;pe; re;there;ass;si; fo;wa;ec;our;who;its;z;fo;rs;>;ot;un;<;im;th ;nc;ate;><;ver;ad; we;ly;ee; n;id; cl;ac;il;</;rt; wi;div;e, ; it;whi; ma;ge;x;e c;men;.com`.split(";");let B;function H(){return B===void 0&&(B=new Ve(je)),B}function J(e){return H().decompress(e)}function Fe(e){return H().compress(e)}let S=new Map;function Te(e){if(S.has(e))return new Uint8Array([S.get(e)]);let t=new TextEncoder().encode(e);if(![...e].some(n=>n.charCodeAt(0)>127)){let n=Fe(e);if(n.length<t.length)return n.length===1?new Uint8Array([35,...n]):new Uint8Array([34,...[...n].toInt255()].concat([255]))}return t.length===1?new Uint8Array([33,...t]):new Uint8Array([32,...[...t].toInt255()].concat([255]))}function Be(){return this.store.string}function $e(){return this.store.string}function Ee(){return this.store.string}function qe(){return this.store.string}s("ByteString",$e,'"',32),s("SingletonByte",qe,"'",33),s("SmazString",Be,"„",34),s("SingletonSmaz",Ee,"›",35);function Pe(){return""}function Ue(){return" "}function Oe(){return"ABCDEFGHIJKLMNOPQRSTUVWXYZ"}function Ne(){return"abcdefghijklmnopqrstuvwxyz"}function De(){return" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"}function Ge(){return"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"}function We(){return"0123456789"}s("EmptyString",Pe,'"₀',36),S.set("",36),s("Space",Ue," ",37),S.set(" ",37),s("CapitalAlphabet",Oe,"A",38),S.set("ABCDEFGHIJKLMNOPQRSTUVWXYZ",38),s("LowercaseAlphabet",Ne,"a",39),S.set("abcdefghijklmnopqrstuvwxyz",39),s("PrintableAscii",De,"¢₁",40),S.set(" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",40),s("AlphaNumeric",Ge,"A₀",159),S.set("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",159),s("Digits",We,"0₉",158),S.set("0123456789",158);function He(){return g.Inputs[0]}function Je(){return g.Inputs[1]}function Xe(){return g.Inputs[2]}function Ze(){return g.Inputs[3]}function _e(e,t){return g.Inputs[c(t.Call())>>>0]}function Ye(){return g.Inputs[this.store.index]}function Qe(e){let t=new D(Ye,[]);return t.store.index=e,t}s("Input0",He,"I₀",144),s("Input1",Je,"I₁",145),s("Input2",Xe,"I₂",146),s("Input3",Ze,"I₃",147),s("InputX",_e,"Iₓ",148);class w{constructor(t){y(this,"code");y(this,"children",[]);y(this,"store",{});this.code=t}ReEmit(){let t=[this.code];switch(this.code){case 196:for(let i of this.children)t.push(...i.ReEmit());break;case 197:for(let i of this.children.reverse())t.splice(0,0,...i.ReEmit());this.store.dontemitstart||t.splice(0,0,196);break;case 62:t.splice(0,0,...R(this.store.integer).reverse());break;case 63:let n=0,r=this.store.float;for(;r%1>1e-7;)r*=10,n++;t.splice(0,0,...R(+r).reverse()),t.splice(0,0,n);break;case 32:case 33:case 34:case 35:{t.splice(0,0,...this.store.bytes);break}}return new Uint8Array(t)}}function X(e){for(let t=e.length-1;t>=0;t--){let n=e[t];if(n.children=X(n.children),n.code!==196&&n.code!==197)continue;let r=0;for(let i=n.children.length-1;i>=0;i--){let o=n.children[i],l=V.get(o.code);if(l===void 0){console.error(`Unknown method: ${I.get(o.code)}`);continue}let h=Math.max(l.length-1,0);if(r-=h,r<0)break;r++}switch(r){case 0:e.splice(t,1,new w(0));break;case 1:e.splice(t,1,...n.children);break;case 2:case 3:case 4:case 5:e.splice(t,1,new w(196+r),...n.children);break}}return e}function Ke(e,t){if(e=X(e),e[0].code===197?e[0].store.dontemitstart=!0:e[e.length-1].code===197&&(e[e.length-1].code=196),t===0&&(e[0].code===34||e[0].code===32)){let n=e[0].store.bytes;n[0]===255&&n.shift()}return e}function et(e){if(e.length===0)return[];let t=[],n=[t];for(let l of e)l.code===10?(t=[],n.push(t)):t.push(l);for(;n[n.length-1].length===0;)n.pop();let r=0;for(let l of n){let h=Ke(l,r++);l.splice(0,l.length,...h)}let i=[],o=!0;for(let l of n){o||i.push(new w(10)),o=!1;for(let h of l)i.push(h)}return i}function Z(e){let t=[],n=e.length-1;for(;n>=0;){const r=e[n];switch(r){case 196:{let i=new w(196);i.children=t.reverse(),t=[i];break}case 197:{let i=0,o=n;for(;n>=0;){let h=e[n];if(h===10)break;if(h===197&&i++,h===196&&i--,h===62)for(n--;e[n]>=128;)n--;if(h===63){for(n--;e[n]>=128;)n--;n--}if(h===32||h===34)for(n--;e[n]!==255;)n--;if((h===33||h===35)&&n--,i===0)break;n--}let l=new w(197);l.children=Z(e.slice(n+1,o)),t.push(l);break}case 62:{let i=[];for(n--;e[n]>=128;)i.push(e[n]),n--;i.push(e[n]);let o=new w(62);o.store.integer=x(new Uint8Array(i))[0],t.push(o);break}case 63:{let i=[];for(n--;e[n]>=128;)i.push(e[n]),n--;i.push(e[n]);let o=e[n-1];n--;let l=new w(63);l.store.float=x(new Uint8Array(i))[0]/10**o,t.push(l);break}case 32:{let i=[];for(n--;n>=0&&e[n]!==255;)i.push(e[n]),n--;let o=new w(32);o.store.string=new TextDecoder().decode(new Uint8Array(i.fromInt255())),o.store.bytes=[255,...i.reverse()],t.push(o);break}case 33:{n--;let i=new w(33);i.store.string=String.fromCharCode(e[n]),i.store.bytes=[e[n]],t.push(i);break}case 34:{let i=[];for(n--;n>=0&&e[n]!==255;)i.push(e[n]),n--;let o=new w(34);o.store.string=J(new Uint8Array(i.fromInt255())),o.store.bytes=[255,...i.reverse()],t.push(o);break}case 35:{n--;let i=new w(35);i.store.string=J(new Uint8Array([e[n]])),i.store.bytes=[e[n]],t.push(i);break}default:t.push(new w(r))}n--}return t.reverse()}function _(e){if(e.length===0)return[];let t=[],n=[t];for(let r=e.length-1;r>=0;r--){let i=e[r];if(i.code===10){t=[],n.push(t);continue}let o=V.get(i.code);if(!o)throw new Error(`Unknown method: ${I.get(i.code)}`);let l=Math.max(o.length-1,0),h=t.splice(0,l),m=1;for(;h.length<l;)h.push(Qe(m++));let A=new D(o,h);A.store=i.store,A.store.children=_(i.children),t.unshift(A)}return n.map(r=>new ie(r)).reverse()}function tt(e,t){return g.Chains=e,e.last().Call(t)}function nt(e){let t=this.store.children;for(let n=0;n<t.length;n++)e=t[n].CallSoftly(e);return e}function rt(e){let t=this.store.children;for(let n=0;n<t.length;n++)e=t[n].CallSoftly(e);return e}function it(e,t,n){return e=t.CallSoftly(e),n.CallSoftly(e)}function at(e,t,n,r){return e=t.CallSoftly(e),e=n.CallSoftly(e),r.CallSoftly(e)}function st(e,t,n,r,i){return e=t.CallSoftly(e),e=n.CallSoftly(e),e=r.CallSoftly(e),i.CallSoftly(e)}function ot(e,t,n,r,i,o){return e=t.CallSoftly(e),e=n.CallSoftly(e),e=r.CallSoftly(e),e=i.CallSoftly(e),o.CallSoftly(e)}s("BracketStart",nt,"{",196),s("BracketEnd",rt,"}",197),s("TwoGroup",it,"{₂",198),s("ThreeGroup",at,"{₃",199),s("FourGroup",st,"{₄",200),s("FiveGroup",ot,"{₅",201);function lt(e,t){switch(typeof t){case"number":return-t;case"string":return t.split("").reverse().join("");case"object":return t.reverse();default:return t}}s("Negative",lt,"-₀",64);function ut(e,t){return u(e,!0).concat([t.Call()])}function ct(){return[]}function ft(e,t){let n=t.Call();if(typeof e=="number"&&typeof n=="number"){let r=[];if(e<n)for(let i=e;i<=n;i++)r.push(i);else for(let i=e;i>=n;i--)r.push(i);return r}return typeof e=="object"||typeof n=="object"?u(e).concat(u(n)):typeof e=="string"||typeof n=="string"?`${e}${n}`:d(e)?e:n}function ht(e){return new f(e).get(t=>{let n=c(t),r=[];if(n<0){for(let i=-1;i>=n;i--)r.push(i);return r}else for(let i=1;i<=n;i++)r.push(i);return r})}function pt(e,t){return[t.Call()]}s("Pair",ut,",",41,","),s("EmptyList",ct,"∅",42),s("To",ft,"‥",46,".."),s("Range",ht,"⇹",178),s("Box",pt,"□",47,"□");function gt(e,t){function n(r,i){return typeof r=="object"?r.map(o=>n(o,i)):typeof i=="object"?i.map(o=>n(r,o)):typeof r=="string"||typeof i=="string"?`${p(r)}${p(i)}`:typeof r=="number"&&typeof i=="number"?r+i:d(r)?r:i}return n(e,t.Call())}function mt(e,t){function n(r,i){return typeof r=="object"?r.map(o=>n(o,i)):typeof i=="object"?i.map(o=>n(r,o)):typeof r=="string"?r.split(i).join(""):typeof r=="number"&&typeof i=="number"?r-i:d(r)?r:i}return n(e,t.Call())}function dt(e,t){function n(r,i){return typeof r=="object"?r.map(o=>n(o,i)):typeof i=="object"?i.map(o=>n(r,o)):typeof r=="string"?r.repeat(c(i)):typeof i=="string"?i.repeat(c(r)):typeof r=="number"&&typeof i=="number"?r*i:d(r)?i:r}return n(e,t.Call())}function yt(e,t){function n(r,i){return typeof r=="object"?r.map(o=>n(o,i)):typeof i=="object"?i.map(o=>n(r,o)):typeof r=="string"?r.replace(p(i),""):typeof r=="number"&&typeof i=="number"?r/i:d(r)?i:r}return n(e,t.Call())}function bt(e,t){function n(r,i){if(typeof r=="object")return r.map(o=>n(o,i));if(typeof i=="object")return i.map(o=>n(r,o));if(typeof r=="string"){let o=c(i),l=[];for(let h=0;h<r.length;h+=o)l.push(r.slice(h,h+o));return l}return typeof r=="number"&&typeof i=="number"?r%i:d(r)?i:r}return n(e,t.Call())}function wt(e,t){function n(r,i){return typeof r=="object"?r.map(o=>n(o,i)):typeof i=="object"?i.map(o=>n(r,o)):typeof r=="number"&&typeof i=="number"?Math.pow(r,i):d(r)?i:r}return n(e,t.Call())}function Ct(e,t){return d(e)?t.Call():e}function Rt(e,t){return d(e)?e:t.Call()}function xt(e){return d(e)?0:1}function v(e,t){if(typeof e>"u"||typeof t>"u")return typeof e==typeof t?1:0;if(typeof e=="string"||typeof t=="string")return p(e)===p(t)?1:0;if(typeof e!=typeof t)return 0;if(typeof e=="object"){let n=e,r=t;if(n.length!==r.length)return 0;for(let i=0;i<n.length;i++)if(!v(n[i],r[i]))return 0;return 1}return e===t?1:0}function Y(e,t){let n=t.Call();return v(e,n)}function vt(e,t){return 1-Y(e,t)}function C(e,t){if(typeof e>"u"||typeof t>"u")return 0;if(typeof e=="string"||typeof t=="string")return p(e).localeCompare(p(t));if(typeof e!=typeof t)return 0;if(typeof e=="object"){let n=e,r=t,i=Math.min(n.length,r.length);for(let o=0;o<i;o++){let l=C(n[o],r[o]);if(l!==0)return l}return n.length===r.length?0:n.length<r.length?-1:1}return typeof e=="number"?Math.sign(c(e)-c(t)):0}function St(e,t){return C(e,t.Call())}function zt(e,t){return C(e,t.Call())>0?1:0}function Mt(e,t){return C(e,t.Call())<0?1:0}function At(e,t){let n=t.Call();return C(e,t.Call())>0?1:v(e,n)}function It(e,t){let n=t.Call();return C(e,t.Call())<0?1:v(e,n)}function kt(e,t){return new f(e,t.Call()).get((n,r)=>c(n)|c(r))}function Lt(e,t){return new f(e,t.Call()).get((n,r)=>c(n)&c(r))}function Vt(e,t){return new f(e,t.Call()).get((n,r)=>c(n)^c(r))}function jt(e,t){return new f(e,t.Call()).get((n,r)=>c(n)<<c(r))}function Ft(e,t){return new f(e,t.Call()).get((n,r)=>c(n)>>c(r))}function $(e){return typeof e=="number"?Math.sqrt(e):typeof e=="object"?e.map(t=>$(t)):typeof e=="string"?$(c(e)):e}function E(e){return typeof e=="number"?e*e:typeof e=="object"?e.map(t=>E(t)):typeof e=="string"?E(c(e)):e}function q(e){return typeof e=="number"?e*e*e:typeof e=="object"?e.map(t=>q(t)):typeof e=="string"?q(c(e)):e}function P(e){return typeof e=="number"?Math.sign(e):typeof e=="object"?e.map(t=>P(t)):typeof e=="string"?P(c(e)):e}function U(e){if(typeof e=="number"){let t=1;for(let n=2;n<=e;n++)t*=n;return t}return typeof e=="object"?e.map(t=>U(t)):typeof e=="string"?U(c(e)):e}function Tt(){return Math.random()}function Bt(e){return typeof e=="object"?e[Math.random()*e.length>>>0]:Math.random()*c(e)>>>0}function $t(e){return typeof e=="object"?e[Math.random()*e.length>>>0]:Math.random()*c(e)}function Et(e){return new f(e).get(t=>Math.log(c(t)))}function qt(e,t){return new f(e,t.Call()).get((n,r)=>Math.log(c(n))/Math.log(c(r)))}function Pt(e){return new f(e).get(t=>{t=c(t);const n=[];let r=2;for(;t>=2;)t%r===0?(n.push(r),t/=r):r++;return n})}function Ut(e){return new f(e).get(t=>{t=c(t);for(let n=2;n*n<=t;n++)if(t%n===0)return 0;return 1})}function Ot(e){return new f(e).get(t=>{t=c(t);let n=[];for(let r=1;r<=t;r++)t%r===0&&n.push(r);return n})}function Nt(e){return new f(e).get(t=>Math.sin(c(t)))}function Dt(e){return new f(e).get(t=>Math.cos(c(t)))}function Gt(e){return new f(e).get(t=>Math.tan(c(t)))}function Wt(e){return new f(e).get(t=>Math.asin(c(t)))}function Ht(e){return new f(e).get(t=>Math.acos(c(t)))}function Jt(e){return new f(e).get(t=>Math.atan(c(t)))}function Xt(e,t){return new f(e,t.Call()).get((n,r)=>Math.atan2(c(n),c(r)))}function Zt(e){return new f(e).get(t=>Math.abs(c(t)))}function _t(e,t){return new f(e,t.Call()).get((n,r)=>{let i=Math.abs(c(n))>>>0,o=c(r);typeof r=="string"&&(o=r.length),o=Math.max(1,c(o))>>>0;let l=[];if(o===1)l=[0].repeat(i);else for(;i>0;)l.unshift(i%o),i=i/o>>>0;return typeof r=="string"?l.map(h=>r.charAt(c(h))).join(""):l})}function Yt(e,t){return new f(t.Call()).get(n=>{let r=u(e);if(typeof n=="string"&&(r=r.map(o=>p(n).indexOf(p(o))),n=n.length),n=Math.max(1,c(n))>>>0,n===1)return r.length;let i=0;for(;r.length;)i*=n,i+=c(r.pop());return i})}function Qt(e,t,n){return new f(t.Call(),n.Call()).get((r,i)=>{let o=u(e),l=c(r);typeof r=="string"&&(l=r.length,o=o.map(m=>r.indexOf(p(m))));let h=c(i);return typeof i=="string"&&(h=i.length),o=o.fromToBase(l,h),typeof i=="string"?o.map(m=>i.charAt(c(m))).join(""):o})}function Kt(e){return new f(e).get(t=>c(t).toString(2))}function en(e){return new f(e).get(t=>+("0b"+p(t)))}function tn(e){return new f(e).get(t=>c(t).toString(16))}function nn(e){return new f(e).get(t=>+("0x"+p(t)))}function rn(e){return c(e)}function an(e){return new f(e).get(t=>Math.floor(c(t)))}function sn(e){return new f(e).get(t=>Math.ceil(c(t)))}function on(e){return new f(e).get(t=>c(t)-1)}function ln(e){return new f(e).get(t=>c(t)+1)}s("Add",gt,"+",80,"+"),s("Subtract",mt,"-",81,"-"),s("Multiply",dt,"*",82,"*"),s("Divide",yt,"/",83,"/"),s("Modulo",bt,"%",84,"%"),s("Power",wt,"^",85,"^"),s("And",Ct,"&",86,"&&"),s("Or",Rt,"|",87,"||"),s("Not",xt,"¬",88,"!"),s("Equal",Y,"=",89,"="),s("NotEqual",vt,"≠",90,"!="),s("Greater",zt,">",91,">"),s("Less",Mt,"<",92,"<"),s("GreaterEqual",At,"≥",93,">="),s("LessEqual",It,"≤",94,"<="),s("Compare",St,"≡",95,"<>"),s("Sqrt",$,"√",96),s("Square",E,"²",97),s("Cubed",q,"³",98),s("Sign",P,"±",99),s("Factorial",U,"!",100),s("BitwiseOr",kt,"|₂",101,"|"),s("BitwiseAnd",Lt,"&₂",102,"&"),s("BitwiseXor",Vt,"~",103,"~"),s("BitshiftLeft",jt,"«",104,"<<"),s("BitshiftRight",Ft,"»",105,">>"),s("RandomDecimal",Tt,"r₀",106),s("RandomInteger",Bt,"r₁",107),s("RandomFloat",$t,"r₂",108),s("LogE",Et,"l",109),s("Log",qt,"lₓ",110),s("PrimeFactors",Pt,"f₁",111),s("Factors",Ot,"f",112),s("IsPrime",Ut,"′",113),s("Sin",Nt,"◿",114),s("Cos",Dt,"◹",115),s("Tan",Gt,"◸",116),s("ASin",Wt,"◿₋",117),s("ACos",Ht,"◹₋",118),s("ATan",Jt,"◸₋",119),s("ATan2",Xt,"◸₂",120),s("Abs",Zt,"-₊",121),s("Floor",an,"⭳",122),s("Ceil",sn,"⭱",123),s("ToNumber",rn,"N",67),s("ToBase",_t,"b",68),s("FromBase",Yt,"b₋",69),s("TranslateBase",Qt,"bₓ",70),s("ToBinary",Kt,"β",71),s("FromBinary",en,"β₋",72),s("ToHex",tn,"η",73),s("FromHex",nn,"η₋",74),s("Increment",ln,"∆",124),s("Decrement",on,"∇",125);function un(e,t){return u(e).map(n=>t.Call(n))}function cn(e,t){return u(e).map((n,r)=>t.Call(n,r))}function fn(e,t){return new f(e).get(n=>t.Call(n))}function hn(e,t){return u(e).filter(n=>t.Call(n))}function pn(e,t){return u(e).reduce((n,r)=>b([n,r],()=>t.Call(n)))}function gn(e,t,n){return u(e).reduce((r,i)=>b([r,i],()=>n.Call(r)),t.Call())}function mn(e,t){let n=u(e);if(n.length<=1)return[];let r=[];for(let i=1;i<n.length;i++)r.push(b([n[i-1],n[i]],()=>t.Call(n[i-1])));return r}function dn(e,t,n){let r=u(e);if(r.length<=0)return[];let i=[],o=t.Call();for(let l=0;l<r.length;l++)i.push(b([o,r[l]],()=>n.Call(o))),o=r[l];return i.slice(1)}function yn(e){return typeof e=="string"||typeof e=="object"?e.length:typeof e=="number"?Math.floor(Math.log10(Math.abs(e)))+1:0}function bn(e){return typeof e=="string"?e.split("").reverse().join(""):u(e).concat().reverse()}function wn(e){return typeof e=="string"?e[0]:u(e)[0]}function Cn(e,t){typeof e=="string"&&(e=e.split("")),e=u(e);for(let n=0;n<e.length;n++)if(d(t.Call(e[n])))return e[n]}function Rn(e,t){typeof e=="string"&&(e=e.split("")),e=u(e);for(let n=0;n<e.length;n++)if(d(t.Call(e[n])))return n;return-1}function xn(e,t){return new f(t.Call()).get(n=>typeof e=="string"?e.slice(0,c(n)):u(e).slice(0,c(n)))}function vn(e,t){return new f(t.Call()).get(n=>typeof e=="string"?e.slice(c(n)):u(e).slice(c(n)))}function Sn(e){return typeof e=="string"?e.slice(-1):u(e).last()}function zn(e,t){typeof e=="string"&&(e=e.split("")),e=u(e);for(let n=e.length-1;n>=0;n--)if(d(t.Call(e[n])))return e[n]}function Mn(e,t){typeof e=="string"&&(e=e.split("")),e=u(e);for(let n=e.length-1;n>=0;n--)if(d(t.Call(e[n])))return n;return-1}function An(e,t){return new f(t.Call()).get(n=>typeof e=="string"?e.slice(e.length-c(n)):(e=u(e),u(e).slice(u(e).length-c(n))))}function In(e,t){return new f(t.Call()).get(n=>typeof e=="string"?e.slice(0,e.length-c(n)):(e=u(e),u(e).slice(0,u(e).length-c(n))))}function kn(e,t){return new f(t.Call()).get(n=>u(e)[c(n)])}function Ln(e,t,n){return new f(t.Call(),n.Call()).get((r,i)=>u(e).slice(c(r),c(r)+c(i)))}function Vn(e){return u(e).concat().sort((t,n)=>C(t,n))}function jn(e,t){return u(e).concat().sort((n,r)=>b([n,r],()=>c(t.Call(n))))}function Fn(e){return u(e).filter((t,n,r)=>r.findIndex(i=>v(i,t))===n)}function Tn(e,t){return u(e).filter((n,r,i)=>i.findIndex(o=>v(t.Call(o),t.Call(n)))===r)}function Bn(e,t){e=e.concat();let n=[0],r=2;for(;r<=e.length;)n.push(t%r),t=Math.floor(t/r),r++;n=n.reverse();let i=[];for(let o=0;o<n.length;o++)i.push(e.splice(n[o],1)[0]);return i}function $n(e){let t=u(e),n=[];for(let r=0;r<Math.factorial(t.length);r++)n.push(Bn(t,r));return n}function Q(e,t){let n=[];for(let r=0;r<e.length;r++)t&1<<r&&n.push(e[r]);return n}function En(e){let t=u(e),n=[];for(let r=0;r<Math.pow(2,t.length);r++)n.push(Q(t,r));return n}function qn(e,t){let n=u(e),r=c(t.Call()),i=[];for(let o=0;o<Math.pow(2,n.length);o++){let l=Q(n,o);l.length===r&&i.push(l)}return i}function K(e){return u(e).reduce((t,n)=>c(t)+c(n),0)}function Pn(e,t){return K(u(e).map(n=>t.Call(n)))}function ee(e){return u(e).reduce((t,n)=>c(t)*c(n),1)}function Un(e,t){return ee(u(e).map(n=>t.Call(n)))}function On(e,t){let n=u(t.Call()),r=u(e).concat();for(let i of n)r.some(o=>v(i,o))||r.push(i);return typeof e=="string"?r.join(""):r}function Nn(e,t){let n=u(t.Call()),r=[];for(let i of u(e))n.some(o=>v(i,o))&&r.push(i);return typeof e=="string"?r.join(""):r}function Dn(e,t){let n=u(t.Call()),r=u(e),i=[];for(let o of r)n.some(l=>v(o,l))||i.push(o);return typeof e=="string"?i.join(""):i}function Gn(e){if(e=u(e),e.length===0)return;let t=e[0];for(let n=1;n<e.length;n++)C(t,e[n])<0&&(t=e[n]);return t}function Wn(e,t){if(e=u(e),e.length===0)return;let n=e[0],r=t.Call(n);for(let i=1;i<e.length;i++){let o=t.Call(e[i]);C(r,o)<0&&(n=e[i],r=o)}return n}function Hn(e){if(e=u(e),e.length===0)return;let t=e[0];for(let n=1;n<e.length;n++)C(t,e[n])>0&&(t=e[n]);return t}function Jn(e,t){if(e=u(e),e.length===0)return;let n=e[0],r=t.Call(n);for(let i=1;i<e.length;i++){let o=t.Call(e[i]);C(r,o)>0&&(n=e[i],r=o)}return n}function Xn(e,t){let n=[];for(let r of u(e)){let i=t.Call(r),o;for(let l of n)if(v(i,l[0])){o=l[1];break}o||n.push([i,o=[]]),o.push(r)}return typeof e=="string"?n.map(r=>r[1].join("")):n.map(r=>r[1])}function Zn(e,t){let n=u(e);if(n.length===0)return[];let r=n[0],i=[n[0]],o=[i];for(let l=1;l<n.length;l++)b([r,n[l]],()=>d(t.Call(r)))&&o.push(i=[]),i.push(n[l]),r=n[l];return typeof e=="string"?o.map(l=>l.join("")):o}function _n(e,t){let n=u(e);if(n.length===0)return[];let r=[],i=[r];for(let o=0;o<n.length;o++)d(t.Call(n[o]))?i.push(r=[]):r.push(n[o]);return typeof e=="string"?i.map(o=>o.join("")):i}function te(e){if(typeof e=="string")return te(e.split(`
`).map(n=>n.split(""))).map(n=>n.map(r=>r??" ").join("")).join(`
`);e=u(e);let t=[];for(let n=0;n<e.length;n++){let r=u(e[n]);for(let i=0;i<r.length;i++){for(t[i]??(t[i]=[]);t[i].length<n;)t[i].push(void 0);t[i][n]=r[i]}}return t}function Yn(e,t){return new f(t.Call()).get(n=>typeof e=="string"?e.repeat(c(n)):u(e).repeat(c(n)))}function Qn(e,t){let n=u(e),r=u(t.Call());return n.flatMap(i=>(i=u(i),r.map(o=>i.concat([o]))))}function ne(e){if(e=u(e).concat(),e.length<=1)return e;if(e.length===2){let r=u(e[0]),i=u(e[1]);return r.flatMap(o=>(o=u(o),i.map(l=>o.concat([l]))))}let t=u(e.splice(0,1)[0]),n=u(ne(e));return t.flatMap(r=>(r=u(r),n.map(i=>r.concat(i))))}function Kn(e){return u(e).flat(1/0)}function er(e,t){return e=u(e),new f(t.Call()).get(n=>(n=Math.max(0,c(n))>>>0,e.flat(n)))}function tr(e,t){return new f(t.Call()).get(n=>{n=c(n);let r=u(e);return typeof e=="number"&&(r=u(e.toString(2))),r=r.concat(),r=r.concat(r.splice(0,n)),typeof e=="number"?+("0b"+r.join("")):typeof e=="string"?r.join(""):r})}function nr(e,t){return new f(t.Call()).get(n=>{n=c(n);let r=u(e);return typeof e=="number"&&(r=u(e.toString(2))),r=r.concat(),r=r.splice(-n).concat(r),typeof e=="number"?+("0b"+r.join("")):typeof e=="string"?r.join(""):r})}function rr(e,t,n){let r=u(n.Call()),i=u(e),o=Math.min(i.length,r.length),l=[];for(let h=0;h<o;h++)l[h]=t.Call(i[h],r[h]);return l}function ir(e,t){let n=u(t.Call()),r=u(e),i=Math.min(r.length,n.length),o=[];for(let l=0;l<i;l++)o[l]=u(r[l]).concat(u(n[l],!0));return o}function ar(e,t){let n=u(t.Call()),r=u(e),i=Math.min(r.length,n.length),o=[];for(let l=0;l<i;l++)o[l]=u(r[l]??[]).concat(u(n[l]??[],!0));return o}function sr(e,t){return t.Call(...u(e))}function or(e){let t=typeof e=="string"?e:u(e);typeof e=="number"&&(t=`${e}`);let n=[];for(let r=1;r<=t.length;r++)n.push(t.slice(0,r));return typeof e=="number"?n.map(r=>+r):n}function lr(e){let t=typeof e=="string"?e:u(e);typeof e=="number"&&(t=`${e}`);let n=[];for(let r=1;r<=t.length;r++)n.push(t.slice(t.length-r,r));return typeof e=="number"?n.map(r=>+r):n}s("Apply",sr,"↩₋",203),s("ZipBy",rr,"↭ₓ",204),s("Zip",ir,"↭",205),s("ZipMaximally",ar,"↭₊",206),s("IndexMap",cn,"↦₁",207),s("Map",un,"↦",208),s("Filter",hn,"↥",209),s("Reduce",pn,"↧",210),s("ReduceInitial",gn,"↧₁",211),s("Fold",mn,"↩",212),s("FoldInitial",dn,"↩₁",213),s("Length",yn,"↔",214),s("Reverse",bn,"↶",215),s("First",wn,"⇤",216),s("FirstWhere",Cn,"⇤₀",217),s("FirstIndexOf",Rn,"⇤₁",218),s("Head",xn,"⇤ₓ",219),s("AntiHead",vn,"⇤₋",176),s("Last",Sn,"⇥",220),s("LastWhere",zn,"⇥₀",221),s("LastIndexOf",Mn,"⇥₁",222),s("Tail",An,"⇥ₓ",223),s("AntiTail",In,"⇥₋",177),s("AtIndex",kn,"⇪",224),s("Slice",Ln,"⇪ₓ",225),s("Sort",Vn,"⇅",226),s("SortBy",jn,"⇅ₓ",227),s("Unique",Fn,"u",228),s("UniqueBy",Tn,"uₓ",229),s("Permutations",$n,"p",230),s("Choices",En,"c",231),s("ChoicesOfLength",qn,"cₓ",232),s("Sum",K,"Σ",233),s("SumBy",Pn,"Σₓ",234),s("Product",ee,"Π",235),s("ProductBy",Un,"Πₓ",236),s("DeepMap",fn,"↦ₓ",237),s("Union",On,"∪",238),s("Intersect",Nn,"∩",239),s("Max",Gn,"⇈",240),s("MaxBy",Wn,"⇈ₓ",241),s("Min",Hn,"⇊",242),s("MinBy",Jn,"⇊ₓ",243),s("GroupBy",Xn,"G",244),s("SplitBetween",Zn,"⇋",245),s("SplitAt",_n,"⇋₁",246),s("Transpose",te,"‘",247),s("Without",Dn,"∖",248),s("Repeat",Yn,"r",249),s("CartesianProduct",Qn,"×",250),s("AllCartesianProducts",ne,"×ₓ",251),s("Flatten",Kn,"_",252),s("FlattenUpto",er,"_ₓ",253),s("RotateLeft",tr,"↺",254),s("RotateRight",nr,"↻",255),s("Prefixes",or,"⥅",179),s("Suffixes",lr,"⥆",180);function ur(){}s("Noop",ur,"⦻",0);function cr(e){g.Output+=`${p(e)}
`,self.postMessage(["output",`${g.Output}`])}function fr(e){g.Output+=`${p(e)}`,self.postMessage(["output",`${g.Output}`])}function hr(e,t,n){return new f(e,t.Call()).get((r,i)=>{let o=p(r),l=new RegExp(p(i),"g");return o.replaceAll(l,(...h)=>b(h,()=>p(n.Call(h[0]))))})}function pr(e,t){return new f(e,t.Call()).get((n,r)=>p(n).split(p(r)).map(i=>i))}function gr(e){return u(e).join("")}function mr(e,t){return new f(t.Call()).get(n=>u(e).map(p).join(p(n)))}function dr(e){return new f(e).get(t=>p(t).split(" ").map(n=>n))}function yr(e){return new f(e).get(t=>p(t).split("").map(n=>n))}function br(e){return new f(e).get(t=>p(t).split(`
`).map(n=>n))}function wr(e){return u(e).map(p).join(" ")}function Cr(e){return u(e).map(p).join(`
`)}function Rr(e,t){return new f(e,t.Call()).get((n,r)=>{let i=p(n),o=new RegExp(p(r)),l=i.match(o);return l?l.length===1?l[0]:[...l]:[]})}function xr(e,t){return new f(e,t.Call()).get((n,r)=>{let i=p(n),o=new RegExp(p(r),"g");return[...i.matchAll(o)].map(h=>h.length===1?h[0]:[...h])})}function vr(e){return p(e)}function T(e,t){return p(e).replaceAll(/%(.)/g,function(n,r){let i=+r;return i!==i?r:p(t[i])})}function Sr(e,t){return T(e,u(t.Call()))}function zr(e,t){return new f(e).get(n=>T(n,[t.Call()]))}function Mr(e,t,n){return new f(e).get(r=>T(r,[t.Call(),n.Call()]))}function Ar(e,t,n,r){return new f(e).get(i=>T(i,[t.Call(),n.Call(),r.Call()]))}function Ir(e){return new f(e).get(t=>{if(t=p(t),t.length!==0)return t.length===1?t.charCodeAt(0):t.split("").map(n=>n.charCodeAt(0))})}function kr(e){return new f(e).get(t=>(t=c(t),t!==t?"":String.fromCharCode(t)))}function Lr(e){return new f(e).get(t=>p(t).toLowerCase())}function Vr(e){return new f(e).get(t=>p(t).toUpperCase())}function jr(e){return new f(e).get(t=>p(t).capitalizeWords())}function Fr(e){return new f(e).get(t=>{let n=p(t).split(`
`),r=Math.max(...n.map(i=>i.length));return n.map(i=>i.padEnd(r," ").split(""))})}function Tr(e){return u(e).map(t=>u(t).map(p).join("")).join(`
`)}function Br(e,t,n){let r=c(n.Call());if(typeof e=="string"){let l=p(t.Call());return l.repeat(Math.ceil(r/l.length)).substring(0,r-e.length)+e}let i=u(e).concat(),o=t.Call();for(;i.length<r;)i=[o].concat(i);return i}function $r(e,t,n){let r=c(n.Call());if(typeof e=="string"){let l=p(t.Call());return e+l.repeat(Math.ceil(r/l.length)).substring(e.length,Math.max(e.length,r))}let i=u(e).concat(),o=t.Call();for(;i.length<r;)i=i.concat([o]);return i}function O(e){if(typeof e=="string")return F(Te(e).reverse());if(typeof e=="number")return G(e);if(typeof e=="object")return e.length===0?"∅":e.length===1?`□${O(e[0])}`:`{□${e.map(O).join(",")}}`}s("Print",cr,"P",16),s("Write",fr,"W",17),s("Replace",hr,"R",18),s("Split",pr,"S",19),s("Join",gr,"J",20),s("JoinBy",mr,"j",21),s("JoinWords",wr,"w₋",22),s("JoinLines",Cr,"L₋",23),s("Words",dr,"w",24),s("Chars",yr,"C",25),s("Lines",br,"L",26),s("Match",Rr,"M",27),s("Matches",xr,"m",28),s("ToString",vr,"s",29),s("Format1",zr,"F₁",1),s("Format2",Mr,"F₂",2),s("Format3",Ar,"F₃",3),s("FormatX",Sr,"Fₓ",4),s("Byte",Ir,"B",30),s("Char",kr,"B₋",31),s("Upper",Vr,"U",43),s("Lower",Lr,"U₋",44),s("CapitalizeWords",jr,"T",45),s("Grid",Fr,"G₊",12),s("JoinGrid",Tr,"G₋",13),s("PadLeft",Br,"L₊",14),s("PadRight",$r,"R₊",15),s("ToLiteral",O,"Q",163);function Er(e,t){return d(e)?t.Call():e}function qr(e,t,n){return d(e)?t.Call():n.Call()}function Pr(e,t,n){for(;d(t.Call(e));)e=n.Call(e);return e}s("If",Er,"?",160,"?"),s("IfElse",qr,"?ₓ",161),s("While",Pr,"‽",162);function Ur(e){return g.Storage[0]=e,e}function Or(e){return g.Storage[1]=e,e}function Nr(e){return g.Storage[2]=e,e}function Dr(e,t){return new f(t.Call()).get(n=>(g.Storage[c(n)]=e,e)),e}function Gr(){return g.Storage[0]}function Wr(){return g.Storage[1]}function Hr(){return g.Storage[2]}function Jr(e,t){return new f(t.Call()).get(n=>g.Storage[c(n)])}s("Store0",Ur,"⤞₀",128),s("Store1",Or,"⤞₁",129),s("Store2",Nr,"⤞₂",130),s("StoreX",Dr,"⤞ₓ",131),s("Load0",Gr,"⤝₀",132),s("Load1",Wr,"⤝₁",133),s("Load2",Hr,"⤝₂",134),s("LoadX",Jr,"⤝ₓ",135);const j=class j{static getStructure(t){return j.structures.get(t)}static getDescription(t){return j.descriptions.get(t)}static set(t,n,r){this.structures.set(t,n),this.descriptions.set(t,r)}static has(t){return this.structures.has(t)}};y(j,"structures",new Map),y(j,"descriptions",new Map);let a=j;a.set("noop","noop",`noop()

Returns nothing`),a.set("format1","stringFormat: format1 arg0",`(stringFormat: string).format1(arg0: string)=>string
Vectorized

Returns stringFormat with all instances of %x replaced with the respective argument index.`),a.set("format2","stringFormat: format2 arg0, arg1",`(stringFormat: string).format2(arg0: string, arg1: string)=>string
Vectorized

Returns stringFormat with all instances of %x replaced with the respective argument index.`),a.set("format3","stringFormat: format3 arg0, arg1, arg2",`(stringFormat: string).format3(arg0: string, arg1: string, arg2: string)=>string
Vectorized

Returns stringFormat with all instances of %x replaced with the respective argument index.`),a.set("formatx","stringFormat: formatx arguments",`(stringFormat: string).formatx(arguments: string[])=>string
Vectorized

Returns stringFormat with all instances of %x replaced with the respective argument index.`),a.set("chainseperator","chainseperator",`chainseperator
Meta

Seperates two chains. Not a function.`),a.set("grid","text: grid",`(text: string).grid()=>string[][]
Vectorized

Returns text split by lines then characters.`),a.set("joingrid","grid: joingrid",`(grid: string[][]).joingrid()=>string

Returns grid joined by lines then characters`),a.set("padleft","text: padleft padding, count",`(text: string|any[]).padleft(padding: any, count: number)=>string|any[]
Vectorized

Pads text with padding to the left until length count.`),a.set("padright","text: padright padding, count",`(text: string|any[]).padright(padding: any, count: number)=>string|any[]
Vectorized

Pads text with padding to the right until length count.`),a.set("print","left: print",`(left: any).print()

Outputs the left-passed value followed by a newline`),a.set("write","left: write",`(left: any).write()

Outputs the left-passed value and nothing else`),a.set("replace","haystack: replace needle, replacement",`(haystack: string).replace(needle: string, replacement: (string...)=>string)=>string
Vectorized

Replaces all instances of the needle RegExp via replacement.`),a.set("split","text: split deliminator",`(text: string).split(deliminator: string)=>string[]
Vectorized

Splits the left string by the deliminator RegExp.`),a.set("join","list: join",`(list: string[]).join()=>string

Concatenates all the values of list together`),a.set("joinby","list: joinby deliminator",`(list: string[]).joinby(deliminator)=>string

Concatenates all the values of list together by a deliminator`),a.set("joinwords","list: joinwords",`(list: string[]).joinwords()=>string

Joins list by spaces.`),a.set("joinlines","list: joinlines",`(list: string[]).joinlines()=>string

Joins list by newlines.`),a.set("words","left: words",`(left: string).words()=>string[]
Vectorized

Split the text left by spaces`),a.set("chars","left: chars",`(left: string).chars()=>string[]
Vectorized

Split the text left into individual characters`),a.set("lines","left: lines",`(left: string).lines()=>string[]
Vectorized

Split the text left by newlines`),a.set("match","haystack: match needle",`(haystack: string).match(needle: string)=>string|string[]
Vectorized

Returns the first instance of the matched RegExp needle in haystack. If needle has groups, returns an array.`),a.set("matches","haystack: matches needle",`(haystack: string).matches(needle: string)=>(string|string[])[]
Vectorized

Returns all instances of the matched RegExp needle in haystack. If needel has groups, each instance returns as an array.`),a.set("tostring","left: tostring",`(left: any).tostring()=>string

Stringifies the left value.`),a.set("byte","character: byte",`(character: string).byte()=>number|number[]
Vectorized

Returns the character code of 'character'. If 'character' is longer than 1, returns an array`),a.set("char","ordinal: char",`(ordinal: number).char()=>string
Vectorized
Returns the string represented by character code 'ordinal'`),a.set("bytestring","bytestring",`bytestring
Meta

Used to define a string of bytes.`),a.set("singletonbyte","singletonbyte",`singletonbyte
Meta

Used to reference a single byte`),a.set("smazstring","smazstring",`smazstring
Meta

Used to define a string of compressed bytes`),a.set("singletonsmaz","singletonsmaz",`singletonsmaz
Meta
Used to reference a single compressed byte`),a.set("emptystring","emptystring",`emptystring()=>string

Returns an empty string.`),a.set("space","space",`space()=>string

Returns a single space`),a.set("capitalalphabet","capitalalphabet",`capitalalphabet()=>

Returns the entire alphabet in uppercase`),a.set("lowercasealphabet","lowercasealphabet",`lowercasealphabet()=>

Returns the entire alphabet in lowercase`),a.set("printableascii","printableascii",`printableascii()=>

Returns the entire printable ascii range`),a.set("pair","left: pair any",`(left: any[]).pair(right: any)=>any[]

Concatenates right to the end of left. If left isn't an array yet, boxes it.`),a.set("emptylist","left: emptylist",`emptylist()=>any[]

Returns an empty list.`),a.set("upper","str: upper",`(str: string).upper()=>string
Vectorized

Returns str as an uppercase string`),a.set("lower","str: lower",`(str: string).lower()=>string
Vectorized

Returns str as a lowercase string`),a.set("capitalizewords","str: capitalizewords",`(str: string).capitalizewords()=>string
Vectorized

Returns str with the start of each space delimiated 'word' capitalized`),a.set("to","start: to end",`(start: any).to(end: any)=>any

If start and end are numbers, returns a list of numbers from start to end inclusive.
If start or end are lists, concatenates the lists together
If start or end are strings, concatenates the strings together`),a.set("box","box value",`box(value: any)=>any[]

Returns a list contaning only value.`),a.set("zero","zero",`zero()=>number

Returns the constant number zero`),a.set("one","one",`one()=>number

Returns the constant number one`),a.set("two","two",`two()=>number

Returns the constant number two`),a.set("three","three",`three()=>number

Returns the constant number three`),a.set("four","four",`four()=>number

Returns the constant number four`),a.set("five","five",`five()=>number

Returns the constant number five`),a.set("six","six",`six()=>number

Returns the constant number six`),a.set("seven","seven",`seven()=>number

Returns the constant number seven`),a.set("eight","eight",`eight()=>number

Returns the constant number eight`),a.set("nine","nine",`nine()=>number

Returns the constant numbernine`),a.set("ten","ten",`ten()=>number

Returns the constant number ten`),a.set("onehundred","onehundred",`onehundred()=>number

Returns the constant number 100`),a.set("negativeone","negativeone",`negativeone()=>number

Returns the constant number -1`),a.set("half","half",`half()=>number

Returns the constant number 0.5`),a.set("integerconstant","integerconstant",`integerconstant
Meta

Used to denote an integer constant.`),a.set("floatconstant","floatconstant",`floatconstant
Meta

Used to denote a floatingpoint constant.`),a.set("negative","negative value",`negative(value: any)=>any

If value is a list, returns 0-value.
If value is a list or a string, reverses it.`),a.set("pi","pi",`pi()=>number

Returns the constant value 3.141592653589793`),a.set("e","e",`e()=>number

Returns the constant value 2.718281828459045`),a.set("tonumber","left: tonumber",`(left: any).tonumber()=>number

Returns left as a number.`),a.set("tobase","n: tobase b",`(n: number).tobase(b: number)=>string|number[]
Vectorized

Returns n in base b. If b is a string, returns mapped to the index of characters in b, otherwise, returns a bigendian array`),a.set("frombase","n: frombase b",`(n: string|number[]).frombase(b: number)=>number
Vectorized

Converts n from base b into a number. Expects an array of numbers expect where b is a string, where it translates from indexes of characters in b`),a.set("translatebase","n: translatebase from, to",`(n: string|number[]).translatebase(from: number, to: number)=>string|number[]
Vectorized

Effectively frombase(from):tobase(to), but works on arbitrarily large intermediate values`),a.set("tobinary","n: tobinary",`(n: number).tobinary()=>string
Vectorized

Returns n as a binary string.`),a.set("frombinary","n: frombinary",`(n: string).frombinary()=>number
Vectorized

Returns the number represented by the binary n.`),a.set("tohex","n: tohex",`(n: number).tohex()=>string
Vectorized

Returns n as a hexadecimal string`),a.set("fromhex","n: fromhex",`(n: string).fromhex()=>number
Vectorized

Returns the number represented by the hexadecimal n.`),a.set("add","left: add right",`(left: number).add(right: number)=>number
Vectorized

Returns the value of left + right`),a.set("subtract","left: subtract right",`(left: number).subtract(right: number)=>number
Vectorized

Returns the value of left - right`),a.set("multiply","left: multiply right",`(left: number).multiply(right: number)=>number
Vectorized

Returns the value of left * right`),a.set("divide","left: divide right",`(left: number).divide(right: number)=>number
Vectorized

Returns the value of left / right`),a.set("modulo","left: modulo right",`(left: number).modulo(right: number)=>number
Vectorized

Returns the value of left % right`),a.set("power","left: power right",`(left: number).power(right: number)=>number
Vectorized

Returns the value of left ^ right`),a.set("and","left: and right",`(left: number).and(right: number)=>number
Vectorized

Returns the value of left && right`),a.set("or","left: or right",`(left: number).or(right: number)=>number
Vectorized

Returns the value of left || right`),a.set("not","condition: not",`(condition: any).not()=>number

Returns the inverse of the truthyness of condition`),a.set("equal","left: equal right",`(left: any).equal(right: any)=>number

Returns if left is equivilent to right`),a.set("notequal","left: notequal any",`(left: any).notequal(right: any)=>number

Returns if left is not equivilent to right`),a.set("greater","left: greater any",`(left: any).greater(right: any)=>number

Returns if left is larger than right. Lexigraphically for lists or strings.`),a.set("less","left: less any",`(left: any).less(right: any)=>number

Returns if left is smaller than right. Lexigraphically for lists or strings.`),a.set("greaterequal","left: greaterequal any",`(left: any).greaterequal(right: any)=>number

Returns if left is larger than or equal to right. Lexigraphically for lists or strings.`),a.set("lessequal","left: lessequal any",`(left: any).lessequal(right: any)=>number

Returns if left is smaller than or equal to right. Lexigraphically for lists or strings.`),a.set("compare","left: compare right",`(left: any).compare(right: any)=>number

Returns -1 if left is less than right, 1 if left is greater than right, or 0 otherwise.`),a.set("sqrt","n: sqrt",`(n: number).sqrt()=>number
Vectorized

Returns the square root of n`),a.set("square","left: square",`(left: number).square()=>number
Vectorized

Returns the value of n^3`),a.set("cubed","n: cubed",`(n: number).cubed()=>number
Vectorized

Returns the value of n^3`),a.set("sign","n: sign",`(n: any).sign()=>number
Vectorized

Returns -1 if n is less than 0, 1 if n is greater than 0, or 0 otherwise.`),a.set("factorial","n: factorial",`(n: number).factorial()=>number
Vectorized

Returns the product of every positive integer lessthan and including n`),a.set("bitwiseor","left: bitwiseor right",`(left: number).bitwiseor(right: number)=>number
Vectorized

Returns the value of left | right`),a.set("bitwiseand","left: bitwiseand right",`(left: number).bitwiseand(right: number)=>number
Vectorized

Returns the value of left & right`),a.set("bitwisexor","left: bitwisexor right",`(left: number).bitwisexor(right: number)=>number
Vectorized

Returns the value of left xor right`),a.set("bitshiftleft","left: bitshiftleft right",`(left: number).bitshiftleft(right: number)=>number
Vectorized

Returns the value of left << right`),a.set("bitshiftright","left: bitshiftright right",`(left: number).bitshiftright(right: number)=>number
Vectorized

Returns the value of left >> right`),a.set("randomdecimal","randomdecimal",`randomdecimal()=>number

Returns a random value between [0,1)`),a.set("randominteger","max: randominteger",`(max: number|any[]).randominteger()=>number

Returns a random integer between [0,max). If Max is an array, returns a random element from it instead.`),a.set("randomfloat","max: randomfloat",`(max: number|any[]).randomfloat()=>number

Returns a random floating point number between [0,max). If Max is an array, returns a random element from it instead.`),a.set("loge","n: loge",`(n: number).loge()=>number
Vectorized

Returns the value of n to the natural log e`),a.set("log","n: log base",`(n: number).log(base: number)=>number
Vectorized

Returns the value of n to the log base`),a.set("primefactors","n: primefactors",`(n: number).primefactors()=>number[]
Vectorized

Returns all prime factors of n`),a.set("factors","n: factors",`(n: number).factors()=>number[]
Vectorized

Returns all factors of n including 1 and n`),a.set("isprime","n: isprime",`(n: number).isprime()=>number
Vectorized

Returns 1 if n is prime, 0 otherwise`),a.set("sin","n: sin",`(n: number).sin()=>number
Vectorized

Returns the result of standard trigonometry sin(n)`),a.set("cos","n: cos",`(n: number).cos()=>number
Vectorized

Returns the result of standard trigonometry cos(n)`),a.set("tan","n: tan",`(n: number).tan()=>number
Vectorized

Returns the result of standard trigonometry tan(n)`),a.set("asin","n: asin",`(n: number).asin()=>number
Vectorized

Returns the result of standard trigonometry asin(n)`),a.set("acos","n: acos",`(n: number).acos()=>number
Vectorized

Returns the result of standard trigonometry acos(n)`),a.set("atan","n: atan",`(n: number).atan()=>number
Vectorized

Returns the result of standard trigonometry atan(n)`),a.set("atan2","n: atan2",`(y: number).atan2(x: number)=>number
Vectorized

Returns the result of standard trigonometry atan2(y, x)`),a.set("abs","n: number",`(n: number).abs()=>number
Vectorized

Returns the absolute value of n`),a.set("floor","n: floor",`(n: number).floor()

Rounds n to negative infinity`),a.set("ceil","n: ceil",`(n: number).ceil()

Rounds n to infinity`),a.set("increment","left: increment",`(left: number).increment()=>number
Vectorized

Returns the value of left + 1`),a.set("decrement","left: decrement",`(left: number).decrement()=>number
Vectorized

Returns the value of left - 1`),a.set("store0","value: store0",`(value: any).store0()=>any

Stores value into box[0] and returns it`),a.set("store1","value: store1",`(value: any).store1()=>any

Stores value into box[1] and returns it`),a.set("store2","value: store2",`(value: any).store2()=>any

Stores value into box[2] and returns it`),a.set("storex","value: storex box",`(value: any).storex(box: number)=>any
Vectorized

Stores value into box[box] and returns it`),a.set("load0","load0",`load0()=>any

Returns the value at box[0]`),a.set("load1","load1",`load1()=>any

Returns the value at box[1]`),a.set("load2","load2",`load2()=>any

Returns the value at box[2]`),a.set("loadx","loadx box",`loadx(box: number)=>any
Vectorized

Returns the value at box[box]`),a.set("input0","input0",`input0()=>any

Returns the 1st (left) input to the current function`),a.set("input1","input1",`input1()=>any

Returns the 2nd input to the current function`),a.set("input2","input2",`input2()=>any

Returns the 3rd input to the current function`),a.set("input3","input3",`input3()=>any

Returns the 4th input to the current function`),a.set("inputx","inputx n",`inputx(n: number)=>any

Returns the nth input to the current function`),a.set("digits","digits",`digits()=>string

Returns the string "0123456789"`),a.set("alphanumeric","alphanumeric",`alphanumberic()=>string

Returns a string contaning all upper and lower-case letters, as well as all digits`),a.set("if","condition: if then",`(condition: any).if(then: ()=>any)=>any

If condition is truthy, returns the result of then, otherwise, returns condition.`),a.set("ifelse","condition: ifelse then, else",`(condition: any).ifelse(then: ()=>any, else: ()=>any)=>any

if condition is truthy, retursn the result of then, otherwise returns the result of else.`),a.set("while","initial: while condition, body",`(initial: any).while(condition: (any)=>any, body: (any)=>any)=>any

While the result of condition(initial) is truthy, sets initial to the result of body(initial). Returns the current value of initial.`),a.set("toliteral","left: toliteral",`(left: any).toliteral()

Returns left as a CharacterCode literal. Does not perform any optimizations.`),a.set("antihead","list: antihead count",`(list: any[]|string).antihead(count: number)=>any[]|string
Vectorized

Returns list without the first elements.`),a.set("antitail","list: antitail count",`(list: any[]|string).antitail(count: number)=>any[]|string
Vectorized

Returns list without the last elements.`),a.set("range","count: range",`(count: number).range()=>number[]
Vectorized

Returns a list of numbers from 1 to count, or from -1 to count if count is negative.`),a.set("prefixes","list: prefixes",`(list: any[]).prefixes()=>any[][]

Returns all prefixes of list. eg. [1,2,3] becomes [[1],[1,2],[1,2,3]]`),a.set("suffixes","list: suffixes",`(list: any[]).suffixes()=>any[][]

Returns all suffixes of list. eg. [1,2,3] becomes [[3],[2,3],[1,2,3]]`),a.set("callchain0","left: callchain0",`(left: any).callchain0()=>any

Calls the 1st chain in the current program.`),a.set("callchain1","left: callchain1",`(left: any).callchain1()=>any

Calls the 2nd chain in the current program.`),a.set("callchain2","left: callchain2",`(left: any).callchain2()=>any

Calls the 3rd chain in the current program.`),a.set("callchainx","left: callchainx n",`(left: any).callchainx(n: number)=>any

Calls the nth chain in the current program.`),a.set("bracketstart","bracketstart",`bracketstart
Meta

Defines the start of a bracket group.`),a.set("bracketend","bracketend",`bracketend
Meta

Defines the end of a bracket group.`),a.set("twogroup","left: twogroup l0, l1",`(left: any).twogroup(l0: any, l1: any)=>any

Executes all link arguments in order and returns their result.`),a.set("threegroup","left: threegroup l0, l1, l2",`(left: any).threegroup(l0: any, l1: any, l2: any)=>any

Executes all link arguments in order and returns their result.`),a.set("fourgroup","left: fourgroup l0, l1, l2, l3",`(left: any).fourgroup(l0: any, l1: any, l2: any, l3: any)=>any

Executes all link arguments in order and returns their result.`),a.set("fivegroup","left: fivegroup l0, l1, l2, l3, l4",`(left: any).fivegroup(l0: any, l1: any, l2: any, l3: any, l4: any)=>any

Executes all link arguments in order and returns their result.`),a.set("apply","list: apply method",`(list: any[]).apply(method: (any,any)=>any)=>any

Run method passing each element of list as arguments.`),a.set("zipby","left: zipby arg0, arg1",`(left: any[]).zipby(method: (any,any), right: any[])=>any[]

Run method on each indexwise pair of elements from left and right, returning the resulting single list. Ignores indexes which only appear on one list`),a.set("zip","left: zip arg0",`(left: any[]).zip(right: any[])=>any[][]

Return left with indexwise pairs of right concatenated to each element. Ignores indexes which only appear on one list`),a.set("zipmaximally","left: zipmaximally right",`(left: any[]).zipmaximally(right: any[])=>any[]

Return left with indexwise pairs of right concatenated to each element. Where only one list has an element, returns it alone.`),a.set("indexmap","list: indexmap selector",`(list: any).indexmap(selector: (any,number)=>any)=>any[]

Returns left mapped over selector with indexes passed as the second argument`),a.set("map","list: map selector",`(list: any[]).map(selector: (any)=>any)=>any[]

Returns a new version of list with all values mutated by selector`),a.set("filter","list: filter predicate",`(list any[]).filter(predicate: (any)=>any)=>any[]

Returns a new version of list with only values in which predicate returns truthy`),a.set("reduce","list: reduce accumulator",`(list: any[]).reduce(accumulator: (any, any)=>any)=>any[]

Returns the result of repeated accumulation across list. The left input to accumulator is the result of the last, or the first value initially.`),a.set("reduceinitial","list: reduceinitial accumulator, initial",`(list: any[]).reduce(accumulator: (any, any)=>any, initial: any)=>any

Returns the result of repeated accumulation across list. The left input to accumulator is the result of the last, or initial inially.`),a.set("fold","list: fold accumulator",`(list: any[]).fold(accumulator: (any, any)=>any)=>any[]

Returns a new version of list from running accumulator on each adjacant pair of elements.`),a.set("foldinitial","list: foldinitial accumulator, initial",`(list: any[]).foldinitial(accumulator: (any, any)=>any, initial: any)=>any[]

Returns a new version of list from running accumulator on each adjacant pair of elements with initial implicitly prepended.`),a.set("length","list: length",`(list: any[]|string).length()=>number

Returns the length of list`),a.set("reverse","list: reverse",`(list: any[]|string).reverse()=>any[]|string

Returns the reversed version of list`),a.set("first","list: first",`(list: any[]).first()=>any

Returns the first element of list`),a.set("firstwhere","list: firstwhere predicate",`(list: any[]).firstwhere(predicate: (any)=>any)=>any

Returns the first element of list that matches predicate`),a.set("firstindexof","list: firstindexof predicate",`(list: any[]).firstindexof(predicate: (any)=>any)=>number

Returns the index of the first element of list that matches predicate, or -1 otherwise`),a.set("head","list: head n",`(list: any[]).head(n: number)=>any[]
Vectorized

Returns the first n elements of list`),a.set("last","list: last",`(list: any[]).last()=>any

Returns the last element of list`),a.set("lastwhere","list: lastwhere predicate",`(list: any[]).lastwhere(predicate: (any)=>any)=>any

Returns the last element of list that matches predicate`),a.set("lastindexof","list: lastindexof predicate",`(list: any[]).lastindexof(predicate: (any)=>any)=>number

Returns the index of the last element of list that matches predicate, or -1 otherwise`),a.set("tail","list: tail any",`(list: any[]).tail(n: number)=>any[]

Returns the last n elements of list`),a.set("atindex","list: atindex any",`(list: any[]).atindex(index: number)=>any
Vectorized

Returns the element index from list`),a.set("slice","list: slice any, any",`(list: any[]).slice(index: number, length: number)=>any[]
Vectorized

Returns length elements from list starting at and including index.`),a.set("sort","list: sort",`(list: any[]).sort()=>any[]

Returns a sorted list by lexigraphical comparison`),a.set("sortby","list: sortby comparer",`(list: any[]).sortby(comparer: (any, any)=>number)=>any[]

Returns a sorted list by comparer. Comparer should return -1 when the left argument should be sorted before the right, 1 when the right should be sorted before the left, and 0 otherwise`),a.set("unique","list: unique",`(list: any[]).unique()=>any[]

Returns only unique elements of list`),a.set("uniqueby","list: uniqueby selector",`(list: any[]).uniqueby(selector: (any)=>any)=>any[]

Returns only unique elements of list by a given selector`),a.set("permutations","list: permutations",`(list: any[]).permutations()=>any[]

Returns all orderings of list.`),a.set("choices","list: choices",`(list: any[]).choices()=>any[][]

Returns all ordered combinations of list.`),a.set("choicesoflength","list: choicesoflength any",`(list: any[]).choicesoflength(n: number)=>any[][]

Returns all ordered combinations of length n of list`),a.set("sum","list: sum",`(list: any[]).sum()=>any

Returns the sum of list`),a.set("sumby","list: sumby any",`(list: any[]).sumby(selector: (any)=>number)=>any

Returns the sum of the elements of list mapped by selector`),a.set("product","list: product",`(list: any[]).product()=>any

Returns the product of list`),a.set("productby","list: productby selector",`(list: any[]).productby(selector: (any)=>any)=>any

Returns the product of list mapped by selector`),a.set("deepmap","list: deepmap selector",`(list: any[]).deepmap(selector: (any)=>any)=>any

Returns a new list modified by selector. Sublists are recursed into.`),a.set("union","left: union right",`(left: any[]).union(right: any[])=>any[]

Returns a list containing all elements of left, and elements of right which do not yet appear in the list`),a.set("intersect","left: intersect right",`(left: any[]).intersect(right: any[])=>any[]

Returns all elements of left that appear in right`),a.set("max","list: max",`(list: any[]).max()=>any

Returns the maximum lexigraphical value of list.`),a.set("maxby","list: maxby selector",`(list: any[]).maxby(selector: (any)=>any)=>any

Returns the maximum lexigraphical value of list by selector`),a.set("min","list: min",`(list: any[]).min()=>any

Returns the minimum lexigraphical value of list.`),a.set("minby","list: minby selector",`(list: any[]).minby(selector: (any)=>any)=>any

Returns the minimum lexigraphical value of list by selector`),a.set("groupby","list: groupby selector",`(list: any[]).groupby(selector: (any)=>any)=>any[][]

Returns list split into sublists in which selector(element) is equal.`),a.set("splitbetween","list: splitbetween predicate",`(list: any[]).splitbetween(predicate: (any,any)=>any)=>any[][]

Returns list split between any two elements such predicate(left,right) is truthy`),a.set("splitat","list: splitat predicate",`(list: any[]).splitat(predicate: (any)=>any)=>any[][]

Returns a list split at any element where predicate(element) is truthy, skipping that element`),a.set("transpose","list: transpose",`(a: any[][]).transpose()=>any[][]

Returns 'list' transpose, such that list[x][y] => list[y][x]`),a.set("without","a: without b",`(a: any[]).without(b)=>any[]

Returns a list of all elements of 'a' that do not appear in 'b`),a.set("repeat","list: repeat count",`(list: string|any[]).repeat(count)=>string|any[]
Vectorized

Repeats the input list count times.`),a.set("cartesianproduct","left: cartesianproduct right",`(left: any[]).cartesianproduct(right: any[])=>any[][]

Returns the cartesian product of left and right. (Returns a new list contaning all combinations of elements in left and right)`),a.set("allcartesianproducts","lists: allcartesianproducts",`(lists: any[][]).allcartesianproducts()=>any[][]

Returns the cartesian product of all lists in lists. (A new list contaning all combinations of elements in the children of lists)`),a.set("flatten","list: flatten",`(list: any).flatten()=>any[]

Returns all elements of list as a 1 dimensional list, flattening any sub-ists.`),a.set("flattenupto","list: flattenupto depth",`(list: any[]).flattenupto(depth: number)=>any[]
Vectorized

Flattens the first depth dimensions of list, preserving sublists of depth greater than depth.`),a.set("rotateleft","list: rotateleft count",`(list: any[]|string|number).rotateleft(count: number)=>any[]|string|number
Vectorized

Rotates the elements of list left (Towards index 0) count times. If list is a string, acts on the characters of list. If list is a number, acts on the binary digits (Up to the largest 1)`),a.set("rotateright","list: rotateright count",`(list: any[]|string|number).rotateright(count: number)=>any[]|string|number
Vectorized

Rotates the elements of list right (Away from index 0) count times. If list is a string, acts on the characters of list. If list is a number, acts on the binary digits (Up to the largest 1)`);function Xr(){}function Zr(){let e="";for(let n=0;n<256;n++)if(I.has(n)){let r=[...L.entries()].filter(i=>i[1]===n).map(i=>i[0]);for(let i of r)if(i.match(/^[\w_0-9]+$/)&&!a.has(i)){let o=new Array(Math.max(0,(V.get(n)??[]).length-1)).fill(0).map((h,m)=>` arg${m}`).join(),l=new Array(Math.max(0,(V.get(n)??[]).length-1)).fill(0).map((h,m)=>`arg${m}: any`).join(", ");a.set(i,`left: ${i}${o}`,`(left: any).${i}(${l})

##### A DESCRIPTION HAS YET TO BE PROVIDED ####`),e+=`/* ${n.toString(16)} */ Metas.set("${i}", "left: ${i}${o}", "(left: any).${i}(${l})\\n\\n");
`}}let t=" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ".split("");t=t.concat(t.map(n=>n+"₊")).filter(n=>!k.has(n));for(let n=0;n<256;n++)if(!M.has(n)){if(t.length===0){console.error("Coudn't finish mapping all spare character :(");break}let r=t.splice(0,1)[0];M.set(n,r),k.set(r,n),V.set(n,Xr),I.set(n,"weaklydefined"),a.set("weaklydefined","","")}console.log(e)}Zr(),self.onmessage=e=>{try{g.Inputs=e.data[0];let t=Z(e.data[1]);t=et(t);let n=_(t);g.Output="";let r=tt(n,g.Inputs[0]);r!==void 0&&(g.Output+=p(r)),self.postMessage(["output",g.Output]),self.postMessage(["unlock"])}catch(t){self.postMessage(["output",`${t}`])}}})();
