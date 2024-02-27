import { Fixed } from "./math";

const high = Fixed.from("600.25"); // 1000038055242.1866
const low = Fixed.from("25.5"); // 1000037713754.5096

//const a = Fixed.from("3.41");
//const b = Fixed.from("5.2");

//const c = Fixed.from("10");
//const d = Fixed.from("1.81");

//console.log("(Fixed Point) A.mul: " + high.fixedPoint.toString());
//console.log("(Fixed Point) B.mul: " + low.fixedPoint.toString());
console.log("(Fixed Point) Add 600.25 and 25.5: " + (high + low).toString());
console.log("(Native Math) Add 600.25 and 25.5: " + (600.25 + 25.5).toString());
console.log("(Fixed Point) Sub 600.25 and 25.5: " + (high - low).toString());
console.log("(Native Math) Sub 600.25 and 25.5: " + (600.25 - 25.5).toString());
console.log("(Fixed Point) Div 600.25 and 25.5: " + (high / low).toString());
console.log("(Native Math) Div 600.25 and 25.5: " + (600.25 / 25.5).toString());
//console.log("(Fixed Point) Mult 600 and 25.5: " + (high * low).toString());
//console.log("(Native Math) Mult 600 and 25.5: " + (600.25 * 25.5).toString());
//console.log("(Fixed Point) Log(10): " + high.log(10).toString());
//console.log("(Fixed Point) LogFixed(10): " + high.logFixed(10).toString());
//console.log("(Native Math) Log(10): " + Math.log(10).toString());
//console.log("(Fixed Point) Round(25.5): " + low.round().toString());
//console.log("(Native Math) Round(25.5): " + Math.round(25.5).toString());
//console.log(`(Native Math) Div 9 and 11 ${Fixed.from("9").div(11).toString()} ${Fixed.from("9").div(11).fixedPoint} Flipped: ${Fixed.from("9").div(11).flipped}`);

//const e = c.mult(d)

//console.log(`${e.toString()}\n${e.flipped}\n${e.fixedPoint}\n${e.num}`);