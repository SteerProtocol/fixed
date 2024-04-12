import { Fixed128 } from "./fixed128";/*
import { Float } from "./float";

let f = new Float(0b0, 0b10000000101, 0b0101010010000000000000000000000000000000000000000000);

console.log(`Sign: ${f.sign}`);
console.log(`Exponent: ${f.exponent}`);
console.log(`Mantissa: ${f.mantissa}`);

f = Float.fromFloat(85.125);
console.log(`Sign: ${f.sign.toString(2)}`);
console.log(`Exponent: ${f.exponent.toString(2)}`);
console.log(`Mantissa: ${f.mantissa.toString(2)}`);

console.log(`Reinterpret:
${f.reinterpret().toString(2)}
==
${reinterpret<u64>(f64(85.125)).toString(2)}`);

f = Float.fromInt(85, 125);

console.log(`Reinterpret:
${f.reinterpret().toString(2)}
==
${reinterpret<u64>(f64(85.125)).toString(2)}`);
*/
console.log(`Log(10): ${Fixed128.log(10)}`);/*
console.log(Float.fromInt(85, 125).toString())*/