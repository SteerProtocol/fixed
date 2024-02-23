import { Fixed } from "./math";

const high = Fixed.from("600"); // 1000038055242.1866
const low = Fixed.from("25.5"); // 1000037713754.5096

const a = Fixed.from("3.41");
const b = Fixed.from("5.2");

console.log("(Fixed Point) A.mul: " + high.fixedPoint.toString());
console.log("(Fixed Point) B.mul: " + low.fixedPoint.toString());
console.log("(Fixed Point) Add 600 and 25.5: " + (a + b).num.toString());
console.log("(Native Math) Add 600 and 25.5: 8.61");
console.log("(Fixed Point) Sub 600 and 25.5: " + (b - a).num.toString());
console.log("(Native Math) Sub 600 and 25.5: 1.79");
console.log("(Fixed Point) Div 600 and 25.5: " + (high / low).num.toString());
console.log("(Native Math) Div 600 and 25.5: 23.529411764705885");
console.log("(Fixed Point) Mult 600 and 25.5: " + (high * low).num.toString());
console.log("(Native Math) Mult 600 and 25.5: 15300.0")
console.log("(Fixed Point) Log(10): " + high.log(10).toString());
console.log("(Native Math) Log(10): " + Math.log(10).toString());
//console.log((reinterpret<f64>(0x4005BF0A8B145769)).toString());
//const E = u64(271828182845904523536);
//console.log((E < U64.MAX_VALUE).toString());
//console.log(E.toString());
//console.log(U64.MAX_VALUE.toString());