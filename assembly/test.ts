import { Fixed64 } from "./fixed64";
//                                      9999500033329732
const c = new Fixed64(99995000333, 10000000000000000);
console.log(c.toString())
console.log(Math.log(1.0001).toString())

const p = 12345;
function getTickFromPrice(price: f64): f64 {
    const tick = Math.log(price) / Math.log(f64(1.0001));
    return tick;
}
console.log("Fixed.log " + Fixed64.log(p, 1000000000000000).toString());
console.log("Math.log  " + Math.log(p).toString());
console.log(`Real: ${getTickFromPrice(p)} Fixed: ${Fixed64.divi(Fixed64.log(p, 1000000000000000), c)}`)