import { Fixed128 } from "../assembly/fixed128";
import { describe, expect, initialize } from "./lib/test";

initialize("@steerprotocol/fixed");
describe("Should Perform Addition", () => {
  expect(Fixed128.add(600.25, 25.5))
    .toEqual(600.25 + 25.5)
    .desc("600.25 + 25.5")
    .test(true);

  expect(Fixed128.add(25.5, 600.25))
    .toEqual(25.5 + 600.25)
    .desc("25.5 + 600.25")
    .test(true);

  expect(Fixed128.add(0.5, 0.5))
    .toEqual(0.5 + 0.5)
    .desc("0.5 + 0.5")
    .test(true);

  expect(Fixed128.add(0.6, 0.5))
    .toEqual(0.6 + 0.5)
    .desc("0.6 + 0.5")
    .test(true);

  expect(Fixed128.add(0.55, 0.5))
    .toEqual(0.55 + 0.5)
    .desc("0.55 + 0.5")
    .test(true);

  expect(Fixed128.add(0.5, 0.55))
    .toEqual(0.5 + 0.55)
    .desc("0.5 + 0.55")
    .test(true);
});