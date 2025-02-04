import { Global } from "../GlobalState";
import { QRegister } from "../Registry";
import { Value, Link, Truthy } from "../Types";

function If(left: Value, truthy: Link): Value {
    if (Truthy(left))
        return truthy.Call();
    return left;
}

function IfElse(left: Value, truthy: Link, falsy: Link): Value {
    return Truthy(left) ? truthy.Call() : falsy.Call();
}

function While(left: Value, condition: Link, body: Link): Value {
    let initial = left;
    while(Truthy(condition.Call(left)))
        left = body.Call(left)
    return left;
}

QRegister("If", If, '?', 0xA0, '?');
QRegister("IfElse", IfElse, '?ₓ', 0xA1)
QRegister("While", While, '‽', 0xA2)