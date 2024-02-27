/**
 * Represents a fixed-point number up to 128 bits
 */
export class Fixed {
  public num: u64 = 0;
  constructor(public high: u64, public low: u64, public pt: u64 = 1) {
    console.log(`High: ${this.high} Low: ${this.low} Pt: ${this.pt}`);
  }
  /**
   * Adds two quantities together to calculate the sum
   * @param x Number | String | Fixed
   * @returns Fixed
   */
  add<T>(x: T): Fixed {
    const f = Fixed.from(x);
    if (this.pt >= f.pt) {
      if (this.pt === f.pt) {
        return new Fixed(this.high + f.high, this.low + f.low, this.pt);
      }
      return new Fixed(this.high + f.high, this.low + (f.low * f.pt), this.pt);
    } else {
      return new Fixed(this.high + f.high, f.low + (this.low * this.pt), f.pt);
    }
  }
  /**
   * Subtracts two quantities from each other to calculate the difference
   * @param x Number | String | Fixed
   * @returns Fixed
   */
  sub<T>(x: T): Fixed {
    const f = Fixed.from(x);
    if (this.pt >= f.pt) {
      if (this.pt === f.pt) {
        return new Fixed(this.high - f.high, this.low - f.low, this.pt);
      }
      const flow = (f.low * f.pt);
      if (this.low < flow) {
        return new Fixed(this.high - f.high - 1, this.low + (f.low * f.pt), this.pt);
      }
      return new Fixed(this.high - f.high, this.low - (f.low * f.pt), this.pt);
    } else {
      return new Fixed(this.high - f.high, (this.low * this.pt) - f.low, f.pt);
    }
  }
  /**
   * Divides two quantities together to calculate the quotient
   * @param x Number | String | Fixed
   * @returns Fixed
  */
  div<T>(x: T): Fixed {
    const f = Fixed.from(x);
    const left: u64 = (this.high * this.pt) + this.low;
    const right: u64 = (f.high * f.pt) + f.low;
    const ratio: u64 = expand(left)
    if (this.pt >= f.pt) {
      if (this.pt === f.pt) {
        const value: u64 = left * ratio / right
        const high = value / ratio;
        const low = value % ratio;
        return new Fixed(high, low, get_power(low));
      }
      const pt_rat: u64 = (this.pt / f.pt);
      const ratio_rat: u64 = ratio * pt_rat;
      const value: u64 = left * ratio / right
      const high = value / ratio_rat;
      const low = value % ratio_rat;
      if (high) return new Fixed(high, low, get_power(low));
      return new Fixed(high, low, get_power(low) * pt_rat);
    } else {
      const pt_rat: u64 = (f.pt / this.pt);
      const ratio_rat: u64 = ratio * pt_rat;
      const value: u64 = left * ratio / right
      const high = value / ratio_rat;
      const low = value % ratio_rat;
      if (high) return new Fixed(high, low, get_power(low));
      return new Fixed(high, low, get_power(low) * pt_rat);
    }
  }
  /**
   * Multiplies two quantities together to calculate the product
   * @param x Number | String | Fixed
   * @returns Fixed
  */
  mult<T>(x: T): Fixed {
    const f = Fixed.from(x);
    if (this.pt <= f.pt) {
      if (this.pt === f.pt) return new Fixed(this.high * f.high, this.low * f.low, this.pt);
      const value = this.high + this.low;
      return new Fixed(1, 2);
    } else {
      const left = this.num //* (this.fixedPoint / f.fixedPoint);
      console.log("Right: " + f.num.toString());
      console.log("Left: " + this.num.toString())
      const digits = decimalCount((this.num / this.pt) * (f.num / f.pt));
      const prod = left * f.num;
      return new Fixed(prod, (decimalCount(prod) - digits));
    }
  }
  /**
   * Calculates the natural log and returns the quantity
   * @param x Number | String | Fixed
   * @returns Fixed
  */
  log(x: f64): f64 {
    let result = 0.0;
    const term = (x - 1) / (x + 1);
    let powerTerm = term
    let divisor = 1;

    let lastResult = -0.0;
    while (true) {
      result += powerTerm / divisor;
      if (result === lastResult) {
        console.log("Found accuracy at " + divisor.toString() + " operations");
        return lastResult * 2;
      }
      powerTerm *= (term * term);
      divisor += 2;
      lastResult = result;
    }
  }
  logFixed(x: u64): Fixed {
    let result = new Fixed(0, 1, 2);
    const term = Fixed.from(x - 1).div(x + 1);
    console.log(`Term: ${term.toString()} ${term.pt}`)
    let powerTerm = term;
    let divisor = 1;

    let lastResult: Fixed = new Fixed(0, 10000);
    while (true) {
      console.log("Divisor: " + divisor.toString());
      result = result.add(powerTerm.div(divisor));
      if (result.eq(lastResult)) {
        console.log("Found accuracy at " + divisor.toString() + " operations");
        return lastResult.mult(2);
      }
      powerTerm = powerTerm.mult(term.mult(term));
      divisor += 2;
      lastResult = result;
    }
  }
  /**
   * Rounds quantity and returns result
   * @param x Number | String | Fixed
   * @returns Fixed
  */
  round(): Fixed {
    const num = this.num / this.pt;
    if (num % 10 > 4) this.num = num + 1;
    else this.num = num;
    this.pt = 1;
    return this;
  }
  /**
   * Floors quantity and returns the result
   * @param x Number | String | Fixed
   * @returns Fixed
  */
  floor(): Fixed {
    this.num = this.num / this.pt;
    this.pt = 1;
    return this;
  }
  min<T>(x: T): Fixed {
    const f = Fixed.from(x);
    return f;
  }
  max<T>(x: T): Fixed {
    const f = Fixed.from(x);
    return f;
  }
  gt<T>(x: T): boolean {
    const f = Fixed.from(x);
    return true;
  }
  lt<T>(x: T): boolean {
    const f = Fixed.from(x);
    return true;
  }
  /**
   * Checks for equality between to Fixeds
   * @param x Number | String | Fixed
   * @returns boolean
  */
  eq<T>(x: T): boolean {
    const f = Fixed.from(x);
    return this.num === f.num && this.pt === f.pt;
  }
  /**
   * Checks for inequality between to Fixeds
   * @param x Number | String | Fixed
   * @returns boolean
  */
  neq<T>(x: T): boolean {
    const f = Fixed.from(x);
    return this.num !== f.num || this.pt !== f.pt;
  }

  // Helper function to count leading zeros
  clz(x: u32): i32 {
    if (x == 0) return 32;
    let count: i32 = 0;
    while ((x & 0x80000000) == 0) {
      x <<= 1;
      count++;
    }
    return count;
  }
  toString(): string {
    let pfix = "";
    let pt = this.pt;
    while ((pt /= 10) > this.low) pfix += "0";
    return `H: ${this.high} L: ${this.low} V: ${this.high}.${pfix}${this.low}`;
  }
  static from<T>(n: T): Fixed {
    if (n instanceof Fixed) return n;
    if (isString<T>()) {
      let high: u64 = 0;
      let start = 0;
      let end = n.length << 1;
      let point = 0;
      let val: u64 = 0;
      for (; start < end; start += 2) {
        const char = load<u16>(changetype<usize>(n) + <usize>start);
        if (char == 46) {
          point = start + 2;
          high = val;
          val = 0;
        } else {
          val = ((val * 10) + (char - 48));
        }
      }
      if (point) return new Fixed(high, val, 10 ** ((end - point) >> 1));
      return Fixed.fromNumber(val)
    } else {
      return Fixed.fromNumber(u64(n), 1);
    }
  }
  static fromNumber(num: u64, fixedPoint: u32 = 1): Fixed {
    if (fixedPoint === 0) {
      return new Fixed(num, 0, fixedPoint);
    } else {
      const high = num / fixedPoint;
      return new Fixed(num, num - (high * fixedPoint), fixedPoint);
    }
  }
  @operator("+")
  @inline
  static add(a: Fixed, b: Fixed): Fixed {
    //if (a.multiplier > b.multiplier)
    return a.add(b);
  }
  @operator("-")
  @inline
  static sub(a: Fixed, b: Fixed): Fixed {
    //if (a.multiplier > b.multiplier)
    return a.sub(b);
  }
  @operator("/")
  @inline
  static div(a: Fixed, b: Fixed): Fixed {
    //if (a.multiplier > b.multiplier)
    return a.div(b);
  }
  @operator("*")
  @inline
  static mult(a: Fixed, b: Fixed): Fixed {
    //if (a.multiplier > b.multiplier)
    return a.mult(b);
  }
}

function expand(x: u64): u64 {
  if (x < 10) return 1000000000000000000;
  if (x < 100) return 100000000000000000;
  if (x < 1000) return 10000000000000000;
  if (x < 10000) return 1000000000000000;
  if (x < 100000) return 100000000000000;
  if (x < 1000000) return 10000000000000;
  if (x < 10000000) return 1000000000000;
  if (x < 100000000) return 100000000000;
  if (x < 1000000000) return 10000000000;
  if (x < 10000000000) return 1000000000;
  if (x < 100000000000) return 100000000;
  if (x < 1000000000000) return 10000000;
  if (x < 10000000000000) return 1000000;
  if (x < 100000000000000) return 100000;
  if (x < 1000000000000000) return 10000;
  if (x < 10000000000000000) return 1000;
  if (x < 100000000000000000) return 100;
  if (x < 1000000000000000000) return 10;
  return 1;
}

function get_power(x: u64): u64 {
  if (x < 10) return 10;
  if (x < 100) return 100;
  if (x < 1000) return 1000;
  if (x < 10000) return 10000;
  if (x < 100000) return 100000;
  if (x < 1000000) return 1000000;
  if (x < 10000000) return 10000000;
  if (x < 100000000) return 100000000;
  if (x < 1000000000) return 1000000000;
  if (x < 10000000000) return 10000000000;
  if (x < 100000000000) return 100000000000;
  if (x < 1000000000000) return 1000000000000;
  if (x < 10000000000000) return 10000000000000;
  if (x < 100000000000000) return 100000000000000;
  if (x < 1000000000000000) return 1000000000000000;
  if (x < 10000000000000000) return 10000000000000000;
  if (x < 100000000000000000) return 100000000000000000;
  if (x < 1000000000000000000) return 1000000000000000000;
  return 1;
}

function decimalCount(x: u64): u64 {
  if (x === 0) return 0;
  if (x > 999999999999999999) return 19
  if (x > 99999999999999999) return 18
  if (x > 9999999999999999) return 17
  if (x > 999999999999999) return 16
  if (x > 99999999999999) return 15
  if (x > 9999999999999) return 14
  if (x > 999999999999) return 13
  if (x > 99999999999) return 12
  if (x > 9999999999) return 11
  if (x > 999999999) return 10
  if (x > 99999999) return 9
  if (x > 9999999) return 8
  if (x > 999999) return 7
  if (x > 99999) return 6
  if (x > 9999) return 5
  if (x > 999) return 4
  if (x > 99) return 3
  if (x > 9) return 2
  return 1;
}