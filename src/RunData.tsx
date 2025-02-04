import { Value } from "./Types";

export type RunData = [
    inputs: Value[],
    bytes: Uint8Array
]

export type TalkData = [type: "lock"|"unlock"]|[type: "output", text: string]