/**
 * Represents a fixed-point number
 */
export class Fixed {
  public num: u64;
  constructor(num: u64, public fixedPoint: u64 = 1, public flipped: i32 = 0) {
    this.num = num;
  }
  /**
   * Adds two quantities together to calculate the sum
   * @param x Number | String | Fixed
   * @returns Fixed
   */
  add<T>(x: T): Fixed {
    const f = Fixed.from(x);
    if (this.fixedPoint >= f.fixedPoint) {
      if (this.fixedPoint === f.fixedPoint) {
        return new Fixed(this.num + f.num, f.fixedPoint);
      }
      return new Fixed((f.num * (this.fixedPoint / f.fixedPoint)) + this.num, this.fixedPoint);
    } else {
      return new Fixed((this.num * (f.fixedPoint / this.fixedPoint)) + f.num, f.fixedPoint);
    }
  }
  /**
   * Subtracts two quantities from each other to calculate the difference
   * @param x Number | String | Fixed
   * @returns Fixed
   */
  sub<T>(x: T): Fixed {
    const f = Fixed.from(x);
    if (this.fixedPoint >= f.fixedPoint) {
      if (this.fixedPoint === f.fixedPoint) {
        return new Fixed(this.num - f.num, this.fixedPoint);
      }
      return new Fixed(this.num - (f.num * (this.fixedPoint / f.fixedPoint)), this.fixedPoint);
    } else {
      return new Fixed((this.num * (f.fixedPoint / this.fixedPoint)) - f.num, f.fixedPoint);
    }
  }
  /**
   * Divides two quantities together to calculate the quotient
   * @param x Number | String | Fixed
   * @returns Fixed
  */
  div<T>(x: T): Fixed {
    const f = Fixed.from(x);
    if (this.fixedPoint <= f.fixedPoint) {
      if (this.fixedPoint === f.fixedPoint) {
        const lead = (this.num / f.num) / this.fixedPoint;
        if (!lead) return new Fixed(maximize(this.num) / f.num, this.fixedPoint * 10, true);
        return new Fixed(maximize(this.num) / f.num, this.fixedPoint);
      }
      const right = this.num * (f.fixedPoint / this.fixedPoint);
      const lead = (this.num / this.fixedPoint) / (f.num / f.fixedPoint);
      const digits = decimalCount(lead);
      const quo = maximize(right) / f.num;
      console.log(`Lead: ` + lead.toString());
      return new Fixed(quo, 10 ** (decimalCount(quo) - digits), !lead);
    } else {
      const left = this.num * (this.fixedPoint / f.fixedPoint);
      const digits = decimalCount((this.num / this.fixedPoint) / (f.num / f.fixedPoint));
      const quo = maximize(left) / f.num;
      return new Fixed(quo, 10 ** (decimalCount(quo) - digits));
    }
  }
  /**
   * Multiplies two quantities together to calculate the product
   * @param x Number | String | Fixed
   * @returns Fixed
  */
  mult<T>(x: T): Fixed {
    const f = Fixed.from(x);
    if (this.fixedPoint <= f.fixedPoint) {
      if (this.fixedPoint === f.fixedPoint) return new Fixed(this.num * f.num, this.fixedPoint);
      const right = this.num * (f.fixedPoint / this.fixedPoint);
      const digits = decimalCount((this.num / this.fixedPoint) * (f.num / f.fixedPoint));
      const prod = right * f.num;
      return new Fixed(prod, 10 ** (decimalCount(prod) - digits));
    } else {
      const left = this.num * (this.fixedPoint / f.fixedPoint);
      const digits = decimalCount((this.num / this.fixedPoint) * (f.num / f.fixedPoint));
      const prod = left * f.num;
      return new Fixed(prod, 10 ** (decimalCount(prod) - digits));
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
    let result = new Fixed(0);
    const term = Fixed.from(x - 1).div(x + 1);
    console.log(`Term: ${term.toString()} ${term.fixedPoint}`)
    let powerTerm = term;
    let divisor = 1;

    let lastResult: Fixed = new Fixed(0, 10000);
    while (true) {
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
    const num = this.num / this.fixedPoint;
    if (num % 10 > 4) this.num = num + 1;
    else this.num = num;
    this.fixedPoint = 1;
    return this;
  }
  /**
   * Floors quantity and returns the result
   * @param x Number | String | Fixed
   * @returns Fixed
  */
  floor(): Fixed {
    this.num = this.num / this.fixedPoint;
    this.fixedPoint = 1;
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
    return this.num === f.num && this.fixedPoint === f.fixedPoint;
  }
  /**
   * Checks for inequality between to Fixeds
   * @param x Number | String | Fixed
   * @returns boolean
  */
  neq<T>(x: T): boolean {
    const f = Fixed.from(x);
    return this.num !== f.num || this.fixedPoint !== f.fixedPoint;
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
    const num = this.num.toString();
    let r = "";
    if (this.flipped) {
      return "0." + "0".repeat(i32(decimalCount(this.fixedPoint / 100))) + num;
    }
    const place = num.length + 1 - decimalCount(this.fixedPoint);
    for (let i = 0; i < num.length; i++) {
      if (i === place) r += ".";
      r += num.charAt(i);
    }
    return r;
  }
  static from<T>(n: T): Fixed {
    if (n instanceof Fixed) return n;
    if (isString<T>()) {
      let start = 0;
      let end = n.length << 1;
      let point = 0;
      let val: u64 = 0;
      let inversePoint = false;
      for (; start < end; start += 2) {
        const char = load<u16>(changetype<usize>(n) + <usize>start);
        if (char == 46) {
          point = start + 1;
        } else if (char !== 48) {
          if (!inversePoint && point) {
            inversePoint = true;
          }
          val = ((val * 10) + (char - 48));
        }
      }
      if (point) return new Fixed(val, 10 ** ((end - point) >> 1));
      return new Fixed(val);
    } else {
      return new Fixed(n, 1);
    }
  }
  @operator("+")
  @inline
  static __add(a: Fixed, b: Fixed): Fixed {
    //if (a.multiplier > b.multiplier)
    return a.add(b);
  }
  @operator("-")
  @inline
  static __sub(a: Fixed, b: Fixed): Fixed {
    //if (a.multiplier > b.multiplier)
    return a.sub(b);
  }
  @operator("/")
  @inline
  static __div(a: Fixed, b: Fixed): Fixed {
    //if (a.multiplier > b.multiplier)
    return a.div(b);
  }
  @operator("*")
  @inline
  static __mult(a: Fixed, b: Fixed): Fixed {
    //if (a.multiplier > b.multiplier)
    return a.mult(b);
  }
}

function calcDecimals(x: u64): u64 {
  if (x > 999999999999999999) return 19
  if (x > 99999999999999999) return 18
  if (x > 9999999999999999) return 10000000000000000
  if (x > 999999999999999) return 1000000000000000
  if (x > 99999999999999) return 100000000000000
  if (x > 9999999999999) return 10000000000000
  if (x > 999999999999) return 1000000000000
  if (x > 99999999999) return 100000000000
  if (x > 9999999999) return 10000000000
  if (x > 999999999) return 1000000000
  if (x > 99999999) return 100000000
  if (x > 9999999) return 10000000
  if (x > 999999) return 1000000
  if (x > 99999) return 100000
  if (x > 9999) return 10000
  if (x > 999) return 1000
  if (x > 99) return 100
  if (x > 9) return 10
  return 1;
}

function maximize(x: u64): u64 {
  if (x > 999999999999999999) return x;
  if (x > 99999999999999999) return x * 10;
  if (x > 9999999999999999) return x * 100;
  if (x > 999999999999999) return x * 1000;
  if (x > 99999999999999) return x * 10000;
  if (x > 9999999999999) return x * 100000;
  if (x > 999999999999) return x * 1000000;
  if (x > 99999999999) return x * 10000000;
  if (x > 9999999999) return x * 100000000;
  if (x > 999999999) return x * 1000000000;
  if (x > 99999999) return x * 10000000000;
  if (x > 9999999) return x * 100000000000;
  if (x > 999999) return x * 1000000000000;
  if (x > 99999) return x * 10000000000000;
  if (x > 9999) return x * 100000000000000;
  if (x > 999) return x * 1000000000000000;
  if (x > 99) return x * 10000000000000000;
  if (x > 9) return x * 100000000000000000;
  return x * 1000000000000000000;
}

function minimize(x: u64): u64 {
  if (x <= 99) return x;
  if (x <= 999) return x / 10;
  if (x <= 9990) return x / 1000;
  if (x <= 99900) return x / 10000;
  if (x <= 999000) return x / 10000;
  if (x <= 9990000) return x / 100000;
  if (x <= 99900000) return x / 1000000;
  if (x <= 999000000) return x / 10000000;
  if (x <= 9990000000) return x / 100000000;
  if (x <= 99900000000) return x / 1000000000;
  if (x <= 999000000000) return x / 10000000000;
  if (x <= 9990000000000) return x / 100000000000;
  if (x <= 99900000000000) return x / 1000000000000;
  if (x <= 999000000000000) return x / 10000000000000;
  if (x <= 9990000000000000) return x / 100000000000000;
  if (x <= 99900000000000000) return x / 1000000000000000;
  if (x <= 999000000000000000) return x / 10000000000000000;
  if (x <= 9990000000000000000) return x / 100000000000000000;
  return x / 1000000000000000000;
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