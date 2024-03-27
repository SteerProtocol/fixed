import { Fixed64 } from "../assembly/fixed64";
import { describe, expect, initialize } from "./lib/test";

initialize("@steerprotocol/fixed");
describe("Should Perform Methods", () => {
  expect(Fixed64.round(600.25))
    .toEqual(Math.round(600.25))
    .desc("Round 600.25")
    .test(true);

  expect(Fixed64.floor(600.25))
    .toEqual(Math.floor(600.25))
    .desc("Floor 600.25")
    .test(true);

  expect(Fixed64.ceil(600.25))
    .toEqual(Math.ceil(600.25))
    .desc("Ceil 600.25")
    .test(true);

  expect(Fixed64.eq(600.25, 600.25))
    .toEqual(600.25 === 600.25)
    .desc("600.25 === 600.25")
    .test(true);

  expect(Fixed64.abs(600.25))
    .toEqual(abs(600.25))
    .desc("Abs 600.25")
    .test(true);

  expect(Fixed64.abs(-600.25))
    .toEqual(abs(-600.25))
    .desc("Abs -600.25")
    .test(true);

  expect(Fixed64.eq(320.2, 600.25))
    .toEqual(320.2 === 600.25)
    .desc("320.2 === 600.25")
    .test(true);

  expect(Fixed64.eq(600.25, 600.25))
    .toEqual(600.25 === 600.25)
    .desc("600.25 === 600.25")
    .test(true);

  expect(Fixed64.gt(600.25, 600.24))
    .toEqual(600.25 > 600.24)
    .desc("600.25 > 600.24")
    .test(true);

  expect(Fixed64.gt(600.25, -600.25))
    .toEqual(600.25 > -600.25)
    .desc("600.25 > -600.25")
    .test(true);

  expect(Fixed64.lt(600.25, 600.24))
    .toEqual(600.25 < 600.24)
    .desc("600.25 < 600.24")
    .test(true);

  expect(Fixed64.lt(600.25, -600.25))
    .toEqual(600.25 < -600.25)
    .desc("600.25 < -600.25")
    .test(true);

  expect(Fixed64.pow(2, 4))
    .toEqual(Math.pow(2, 4))
    .desc("Pow 2^4")
    .test(true);

  // TODO: Implement later
  /*expect(Fixed.pow(2, -4))
    .toEqual(Math.pow(2, -4))
    .desc("Pow 2^-4")
    .show(true);*/

  expect(Fixed64.max(2, 4))
    .toEqual(Math.max(2, 4))
    .desc("Max 2 4")
    .test(true);

  expect(Fixed64.max(4, 2))
    .toEqual(Math.max(4, 2))
    .desc("Max 4 2")
    .test(true);

  expect(Fixed64.min(2, 4))
    .toEqual(Math.min(2, 4))
    .desc("Min 2 4")
    .test(true);

  expect(Fixed64.min(4, 2))
    .toEqual(Math.min(4, 2))
    .desc("Min 4 2")
    .test(true);

});