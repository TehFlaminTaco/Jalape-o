import { QRegister } from "../Registry";

function Noop() {
  return undefined;
}

QRegister("Noop", Noop, "⦻", 0x00);
