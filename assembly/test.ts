import { u128 } from "as-bignum/assembly";
import { i128 } from "./i128"
//                 9223372036854775807
const a = new i128(9223372036854775807, 0)
const b = new i128(2, 0);
console.log(i64.MAX_VALUE.toString())
const u = i128.div(a, b);
console.log(new i128(-12345, 0).abs().tostr_u())
console.log("i128: " + u.tostr_u());
console.log(" - low: " + u64(u.low).toString());
console.log(" - high: " + u.high.toString());

console.log("u128:  " + u128.div(new u128(a.low, a.high), new u128(b.low, b.high)).toString());
console.log(" - low: " + u128.div(new u128(a.low, a.high), new u128(b.low, b.high)).lo.toString());
console.log(" - high: " + u128.div(new u128(a.low, a.high), new u128(b.low, b.high)).hi.toString());