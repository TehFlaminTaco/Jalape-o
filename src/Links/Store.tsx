import { Global } from "../GlobalState";
import { QRegister } from "../Registry";
import { AsNumber, Link, Value } from "../Types";

function Store0(left: Value): Value {
    Global.Storage[0] = left;
    return left;
}

function Store1(left: Value): Value {
    Global.Storage[1] = left;
    return left;
}

function Store2(left: Value): Value {
    Global.Storage[2] = left;
    return left;
}

function StoreX(left: Value, x: Link): Value {
    Global.Storage[AsNumber(x.Call(Global.Inputs[0]))] = left;
    return left;
}

function Load0(): Value {
    return Global.Storage[0];
}

function Load1(): Value {
    return Global.Storage[1];
}

function Load2(): Value {
    return Global.Storage[2];
}

function LoadX(_: Value, x: Link): Value {
    return Global.Storage[AsNumber(x.Call(Global.Inputs[0]))];
}
//₀₁₂ₓ
QRegister("Store0", Store0, '⤞₀', 0x80);
QRegister("Store1", Store1, '⤞₁', 0x81);
QRegister("Store2", Store2, '⤞₂', 0x82);
QRegister("StoreX", StoreX, '⤞ₓ', 0x83);
QRegister("Load0", Load0, '⤝₀', 0x84);
QRegister("Load1", Load1, '⤝₁', 0x85);
QRegister("Load2", Load2, '⤝₂', 0x86);
QRegister("LoadX", LoadX, '⤝ₓ', 0x87);