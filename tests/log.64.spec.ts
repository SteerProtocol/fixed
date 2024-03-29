import { Fixed64 } from "../assembly/fixed64";
import { describe, expect, initialize } from "./lib/test";

initialize("@steerprotocol/fixed");
describe("Should Perform Logarithms", () => {
  expect(Fixed64.log10(153))
    .toEqual(Math.round(Math.log10(153)))
    .desc("Log10(153)")
    .test(true);
  expect(Fixed64.log10(1530000000000))
    .toEqual(Math.round(Math.log10(1530000000000)))
    .desc("Log10(1530000000000)")
    .test(true);

  expect(Fixed64.log(10))
    .toEqual(Math.log(10))
    .desc("Log(12)")
    .show(true);
});
