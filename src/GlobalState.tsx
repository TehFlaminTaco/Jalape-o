import { Chain, Value } from "./Types";

export class GlobalState {
  Chains: Chain[] = [];
  Inputs: Value[] = [];
  Storage: Value[] = [];
  Output: Value = "";
}

export let Global: GlobalState = new GlobalState();

export function WithInputs<T>(tempInps: Value[], f: () => T): T {
  tempInps = tempInps.concat();
  while(tempInps.length < Global.Inputs.length)
    tempInps[tempInps.length] = Global.Inputs[tempInps.length];
  let oldInps = Global.Inputs;
  Global.Inputs = tempInps;
  let res = f();
  Global.Inputs = oldInps;
  return res;
}
