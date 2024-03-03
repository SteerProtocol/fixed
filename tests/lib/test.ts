import { rainbow } from "as-rainbow/assembly";
import { Fixed } from "../../assembly/fixed";


@external("test", "getSerializedInteger")
export declare function getSerializedInteger(data: u64, ptr: usize): void;


@external("test", "getSerializedBuffer")
export declare function getSerializedBuffer(data: ArrayBuffer): ArrayBuffer;

let currentSuite = "";
let failedSuite = false;
let failed = false;
let initialized = false;
let _name = "";
export function initialize(name: string | null = null): void {
  if (initialized) return;
  if (name) _name = name
  console.log(
    rainbow.boldMk(
      "Running tests for " + rainbow.italicMk(_name),
    ),
  );
  initialized = true;
}

export function describe(suiteName: string, test: () => void): void {
  initialize();
  console.log(rainbow.boldMk(`Running test suite: ${suiteName}\n`));
  currentSuite = suiteName;
  test();
  if (!failedSuite) {
    console.log(
      rainbow.boldMk(
        rainbow.green(` - Completed suite tests without faliure\n`),
      ),
    );
  } else {
    console.log(rainbow.boldMk(rainbow.red(` - Failed test suite\n`)));
  }
  failedSuite = false;
}

export function expect<T>(left: T): Expectation {
  if (isString<T>()) return new Expectation(<string>left);
  else if (left instanceof Fixed)
    return new Expectation(left.toString());
  else if (isInteger<T>() || isFloat<T>()) {
    // @ts-ignore
    return new Expectation(left.toString());
  }
  throw new Error("Expected of type String, Fixed, or Number");
}

export function report(): void {
  if (failed) {
    console.log(rainbow.boldMk(rainbow.red("❌ Tests failed!")));
    return process.exit(1);
  } else {
    console.log(rainbow.boldMk(rainbow.green("✅ All tests passed!")));
  }
}

export class Expectation {
  public left: string;
  public right: string;
  public _reason: string = "";
  constructor(left: string) {
    this.left = left;
    this.right = left;
  }
  toEqual<T>(right: T): Expectation {
    if (isString<T>()) this.right = <string>right;
    else if (right instanceof Fixed)
      this.right = right.toString();
    // @ts-ignore
    else if (isInteger<T>() || isFloat<T>()) this.right = right.toString();
    return this;
  }
  desc(reason: string): Expectation {
    this._reason = reason;
    return this;
  }
  test(report: boolean = false): void {
    // @ts-ignore
    const left: string = this.left.toString();
    // @ts-ignore
    const right: string = this.right.toString();
    if (left == right) {
      if (!report) return;
      console.log(rainbow.boldMk(rainbow.green(` > ${this._reason}`)));
      if (left.length >= 100) {
        console.log(
          rainbow.italicMk(
            `    - (recieved) ${left.slice(
              0,
              100,
            )}...\n    - (expected) ${right.slice(0, 100)}...`,
          ),
        );
      } else {
        console.log(
          rainbow.italicMk(`    - (recieved) ${left}\n    - (expected) ${right}`),
        );
      }
    } else {
      failed = true;
      failedSuite = true;
      console.log(
        rainbow.boldMk(rainbow.red(` > Failed ${currentSuite} because\n`)),
      );
      console.log(
        rainbow.italicMk(
          `    - (recieved) ${left}\n      ${rainbow.italicMk(
            "Does not equal",
          )}\n    - (expected) ${right}\n`,
        ),
      );
    }
  }
}
