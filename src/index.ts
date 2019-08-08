
import Parsers from "./parser";
import PC from "./pc";

const input = PC.input(`; merp
; merp
; merp
`)
const x = PC.many1(Parsers.comment)(input)

console.log(x)
