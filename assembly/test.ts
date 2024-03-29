import { u128 } from "as-bignum/assembly";
import { i128 } from "./src/i128"
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
console.log(i128.fromString(U64.MAX_VALUE.toString()).toString())