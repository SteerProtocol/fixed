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

console.log("u128:  " + u128.div(new u128(a.low, a.high), new u128(b.low, b.high)).toString());
console.log(" - low: " + u128.div(new u128(a.low, a.high), new u128(b.low, b.high)).lo.toString());
console.log(" - high: " + u128.div(new u128(a.low, a.high), new u128(b.low, b.high)).hi.toString());

console.log(i128.div(new i128(-6, 0), new i128(3, 0)).toString());
console.log(new i128(-6, 0).abs().neg().toString());

console.log(i128.add(i128.fromI32(60025), i128.fromI32(2550)).toString())