import { bench, blackbox } from "as-bench/assembly/bench";
import { Fixed64 } from "../assembly/fixed64";
/*
bench("Create Fixed from String", () => {
  blackbox<Fixed>(Fixed.from("3.14"));
});

bench("Create Fixed from Float", () => {
  blackbox<Fixed>(Fixed.from(3.14));
});

bench("Create Fixed from Integer", () => {
  blackbox<Fixed>(Fixed.from(314));
});
*/
const l = Fixed64.from(25.5);
const r = Fixed64.from(600.25);

bench("Add 25.5 and 600.25", () => {
  blackbox<Fixed64>(Fixed64.add(l, r));
});

bench("Subtract 25.5 from 600.25", () => {
  blackbox<Fixed64>(Fixed64.sub(r, l));
});

bench("Multiply 25.5 and 600.25", () => {
  blackbox<Fixed64>(Fixed64.mult(l, r));
});

/*bench("Divide 25.5 and 600.25", () => {
  blackbox<Fixed>(Fixed.div(l, r));
});*/

bench("Calculate log10(153)", () => {
  blackbox<Fixed64>(Fixed64.log10(153));
});