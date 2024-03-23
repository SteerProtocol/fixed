import { u128 } from "as-bignum/assembly";
import { i128 } from "./src/i128"
import { Fixed128 } from "./fixed128";
import { Fixed64 } from "./fixed64";
/*
//                 9223372036854775807
const a = new i128(9223372036854775807, 0)
const b = new i128(2, 0);
console.log(i64.MAX_VALUE.toString())
const u = i128.div(a, b);
console.log(new i128(-12345, 0).abs().toString())
console.log("i128: " + u.toString());
console.log(" - low: " + u64(u.low).toString());
console.log(" - high: " + u.high.toString());

console.log(i128.div(new i128(-6, 0), new i128(3, 0)).toString());
console.log(new i128(-6, 0).abs().neg().toString());

console.log(i128.add(new i128(-60025, 0), new i128(2550, 0)).toString())

console.log(((u64(12345) * u64(10)) >> 32).toString());
console.log((12345 % 10).toString());
console.log(i128.fromString(U64.MAX_VALUE.toString()).toString());
console.log(Fixed128.log_taylor(i128.fromI32(10)).toString());
console.log(Fixed128.log(10).toString());
console.log(Math.log(10).toString());

const x = Fixed128.from("0.00000000019082149292705877");
console.log("Num: " + x.num.toString());
console.log("Mag: " + x.mag.toString());
console.log("Result: " + x.toString());
*/
const a = (i128.fromI64(9223372036854775808) * i128.fromI32(2)) / i128.fromI32(2);
console.log(a.isNeg().toString())
console.log(`A: ${a.low} ${a.high} = ${a.toString()}`);
const b = (u128.fromI64(9223372036854775808) * u128.from(2)) / u128.from(2);
console.log(`B: ${b.lo} ${b.hi} = ${b.toString()}`);