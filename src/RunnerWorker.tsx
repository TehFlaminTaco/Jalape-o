import { Compile, Evaluate, ParseAsPseudoLinks, TrimPseudoLinks } from "./Parser";
import { Global } from "./GlobalState";
import { AsString, Value } from "./Types";
import { RunData } from "./RunData";

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

self.onmessage = (event: MessageEvent<RunData>) => {
    try {
        Global.Inputs = event.data[0];
        let pLinks = ParseAsPseudoLinks(event.data[1]);
        pLinks = TrimPseudoLinks(pLinks);
        let compiled = Compile(pLinks);
        Global.Output = '';
        let res = Evaluate(compiled, Global.Inputs[0]);
        self.postMessage(['output', AsString(res)]);
        self.postMessage(['unlock']);
    }catch(e){
        self.postMessage(['output',`${e}`]);
    }
}

export {}