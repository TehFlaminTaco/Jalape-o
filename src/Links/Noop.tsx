import { QRegister } from "../Registry";

function Noop() {
  return undefined;
}

QRegister(Noop, "⦻", 0x00);
