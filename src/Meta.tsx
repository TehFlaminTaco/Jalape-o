import { Behaviours, BytesToNames, NamesToBytes } from "./Registry";

export const Metas: Map<string, string> = new Map();

export function ValidateMeta() {
    let s = "";
    for(let i=0; i < 256; i++){
        if(!BytesToNames.has(i))
            s += `// ${i.toString(16)}\n`
        else{
            let allNames = [...NamesToBytes.entries()].filter(c=>c[1] === i).map(c=>c[0]);
            for(let name of allNames){
                if(!name.match(/^[\w_0-9]+$/))
                    continue;
                if(Metas.has(name))
                    s += `Metas.set("${name}", "${Metas.get(name)!}") // ${i.toString(16)}\n`
                else{
                    let args = new Array(Math.max(0, (Behaviours.get(i)??[]).length - 1)).fill(' any').join();
                    Metas.set(name, `any: ${name}${args}`);
                    s += `Metas.set("${name}", "any: ${name}${args}") // ${i.toString(16)}\n`
                }
            }
        }
    }
    console.log(s);
}