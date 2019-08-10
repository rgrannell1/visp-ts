
import * as Parsers from "./parser";
import * as PC from "./pc";

const input = PC.input(`

10
10
10

`)
const x = PC.many1(Parsers.expression)(input)

console.log(JSON.stringify(x, null, 2))
