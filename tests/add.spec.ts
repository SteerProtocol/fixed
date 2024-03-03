import { Fixed } from "../assembly/fixed";
import { describe, expect, initialize } from "./lib/test";

initialize("@steerprotocol/fixed");

describe("Should perform addition", () => {
  expect(Fixed.from(600.25).add(Fixed.from(25.5)))
    .toEqual(600.25 + 25.5)
    .desc("600.25 + 25.5")
    .test(true);
});
