import { u128 } from "as-bignum/assembly";
import { i128, umul128wide, umul64wide } from "./i128"

const a = new i128(6, 0);
const b = new i128(2, 0);

console.log(i128.add(a, b).toString());

console.log(umul64wide(123456789, 123456789).low.toString())
console.log(i64.MAX_VALUE.toString());
const u = umul128wide(new i128(3875820019684212736, 54), new i128(2, 0));
console.log(u.low.toString())
console.log(u.high.toString());

const w = new u128(3875820019684212736, 54) * new u128(2, 0);
console.log(w.lo.toString());
console.log(w.hi.toString());
console.log(new u128(u64(u.low), u.high).toString())