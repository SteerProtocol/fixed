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
  
  expect(Fixed.eq(600.25, 600.25))
    .toEqual(600.25 === 600.25)
    .desc("600.25 === 600.25")
    .test(true);
  
  expect(Fixed.abs(600.25))
    .toEqual(abs(600.25))
    .desc("Abs 600.25")
    .test(true);

  expect(Fixed.abs(-600.25))
    .toEqual(abs(-600.25))
    .desc("Abs -600.25")
    .test(true);
  
  expect(Fixed.eq(320.2, 600.25))
    .toEqual(320.2 === 600.25)
    .desc("320.2 === 600.25")
    .test(true);
  
  expect(Fixed.eq(600.25, 600.25))
    .toEqual(600.25 === 600.25)
    .desc("600.25 === 600.25")
    .test(true);
  
  expect(Fixed.gt(600.25, 600.24))
    .toEqual(600.25 > 600.24)
    .desc("600.25 > 600.24")
    .test(true);

  expect(Fixed.gt(600.25, -600.25))
    .toEqual(600.25 > -600.25)
    .desc("600.25 > -600.25")
    .test(true);
  
  expect(Fixed.lt(600.25, 600.24))
    .toEqual(600.25 < 600.24)
    .desc("600.25 < 600.24")
    .test(true);

  expect(Fixed.lt(600.25, -600.25))
    .toEqual(600.25 < -600.25)
    .desc("600.25 < -600.25")
    .test(true);
  
  expect(Fixed.pow(2, 4))
    .toEqual(Math.pow(2, 4))
    .desc("Pow 2^4")
    .test(true);
  
  // TODO: Implement later
  /*expect(Fixed.pow(2, -4))
    .toEqual(Math.pow(2, -4))
    .desc("Pow 2^-4")
    .show(true);*/
  
  expect(Fixed.max(2, 4))
    .toEqual(Math.max(2, 4))
    .desc("Max 2 4")
    .test(true);

  expect(Fixed.max(4, 2))
    .toEqual(Math.max(4, 2))
    .desc("Max 4 2")
    .test(true);
  
  expect(Fixed.min(2, 4))
    .toEqual(Math.min(2, 4))
    .desc("Min 2 4")
    .test(true);

  expect(Fixed.min(4, 2))
    .toEqual(Math.min(4, 2))
    .desc("Min 4 2")
    .test(true);

});