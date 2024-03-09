import { Fixed } from "../assembly/fixed";
import { describe, expect, initialize } from "./lib/test";

initialize("@steerprotocol/fixed");
describe("Should Perform Methods", () => {
  expect(Fixed.round(600.25))
    .toEqual(Math.round(600.25))
    .desc("Round 600.25")
    .test(true);
  
  expect(Fixed.floor(600.25))
    .toEqual(Math.floor(600.25))
    .desc("Floor 600.25")
    .test(true);
  
  expect(Fixed.ceil(600.25))
    .toEqual(Math.ceil(600.25))
    .desc("Ceil 600.25")
    .test(true);
});