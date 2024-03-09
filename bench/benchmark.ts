import { bench, blackbox } from "as-bench/assembly/bench";
import { Fixed } from "../assembly/fixed";
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
const l = Fixed.from(25.5);
const r = Fixed.from(600.25);

bench("Add 25.5 and 600.25", () => {
  blackbox<Fixed>(Fixed.add(l, r));
});

bench("Subtract 25.5 from 600.25", () => {
  blackbox<Fixed>(Fixed.sub(r, l));
});

bench("Multiply 25.5 and 600.25", () => {
  blackbox<Fixed>(Fixed.mult(l, r));
});

/*bench("Divide 25.5 and 600.25", () => {
  blackbox<Fixed>(Fixed.div(l, r));
});*/

bench("Calculate log10(153)", () => {
  blackbox<Fixed>(Fixed.log10(153));
});