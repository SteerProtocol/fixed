import { Fixed128 } from "../assembly/fixed128";
import { describe, expect, initialize } from "./lib/test";

initialize("@steerprotocol/fixed");
describe("Should Perform Subtraction", () => {
  expect(Fixed128.sub(600.25, 25.5))
    .toEqual(600.25 - 25.5)
    .desc("600.25 - 25.5")
    .test(true);

  expect(Fixed128.sub(0.5, 0.5))
    .toEqual(0.5 - 0.5)
    .desc("0.5 - 0.5")
    .test(true);

  expect(Fixed128.sub(0.6, 0.5))
    .toEqual(0.1)
    .desc("0.6 - 0.5")
    .test(true);

  expect(Fixed128.sub(0.55, 0.5))
    .toEqual(0.55 - 0.5)
    .desc("0.55 - 0.5")
    .test(true);
});