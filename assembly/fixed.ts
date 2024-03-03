@inline const HIGH = offsetof<Fixed>("high");
@inline const LOW = offsetof<Fixed>("low");
@inline const MAG = offsetof<Fixed>("mag");

/**
 * Represents a fixed-point number up to 128 bits
 */
export class Fixed {
  public num: u64 = 0;
  constructor(public high: u64, public low: u64, public mag: u64 = 1) {
    //console.log(`High: ${this.high} Low: ${this.low} Pt: ${this.pt}`);
  }
  /**
   * Adds two quantities together to calculate the sum
   * @param x Number | String | Fixed
   * @returns Fixed
   */
  add<T>(x: T): Fixed {
    const f = Fixed.from(x);
    if (this.mag >= f.mag) {
      if (this.mag === f.mag) return new Fixed(this.high + f.high, this.low + f.low, this.mag);
      const low = this.low + (f.low * (this.mag / f.mag));
      const pt = this.mag / f.mag;
      if (low > pt) {
        return new Fixed(this.high + f.high + (low / this.mag), low % this.mag, this.mag);
      }
      return new Fixed(this.high + f.high, low, this.mag);
    } else {
      return new Fixed(this.high + f.high, f.low + (this.low * (this.mag / f.mag)), f.mag);
    }
  }
  /**
   * Subtracts two quantities from each other to calculate the difference
   * @param x Number | String | Fixed
   * @returns Fixed
   */
  sub<T>(x: T): Fixed {
    const f = Fixed.from(x);
    if (this.mag >= f.mag) {
      if (this.mag === f.mag) return new Fixed(this.high - f.high, this.low - f.low, this.mag);
      const flow = (f.low * f.mag);
      if (this.low < flow) {
        return new Fixed(this.high - f.high - 1, this.low + (f.low * (f.mag / this.mag)), this.mag);
      }
      return new Fixed(this.high - f.high, this.low - (f.low * (f.mag / this.mag)), this.mag);
    } else {
      return new Fixed(this.high - f.high, (this.low * (this.mag / f.mag)) - f.low, f.mag);
    }
  }
  /**
   * Divides two quantities together to calculate the quotient
   * @param x Number | String | Fixed
   * @returns Fixed
  */
  div<T>(x: T): Fixed {
    const f = Fixed.from(x);
    if (f.eq(1)) return this;
    const left: u64 = (this.high * this.mag) + this.low;
    const right: u64 = (f.high * f.mag) + f.low;
    const ratio: u64 = expand(left)
    if (this.mag >= f.mag) {
      if (this.mag === f.mag) {
        const value: u64 = left * ratio / right
        const high = value / ratio;
        const low = value % ratio;
        return new Fixed(high, low, get_power(low));
      }
      const pt_rat: u64 = (this.mag / f.mag);
      const ratio_rat: u64 = ratio * pt_rat;
      const value: u64 = left * ratio / right
      const high = value / ratio_rat;
      const low = value % ratio_rat;
      if (high) return new Fixed(high, low, get_power(low));
      return new Fixed(high, low, get_power(low) * pt_rat);
    } else {
      const pt_rat: u64 = (f.mag / this.mag);
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
    if (this.mag === f.mag) {
      return new Fixed(this.high * f.high, this.low * f.low);
    }
    if (!this.high || !f.high) {
      const left = this.low;
      const right = f.low;
      const product = left * right;
      const ratio = get_power(product) / get_power(this.high * f.high);
      const high = product / ratio;
      const low = product % ratio;
      return new Fixed(high, low, ratio);
    }
    const left = (this.high * this.mag) + this.low;
    const right = (f.high * f.mag) + f.low;
    const product = left * right;
    const ratio = get_power(product) / get_power(this.high * f.high);
    const high = product / ratio;
    const low = product % ratio;
    return new Fixed(high, low, ratio);
  }
  /**
   * Calculates the natural log and returns the quantity as an integer
   * @param x Number | String | Fixed
   * @returns Fixed
  */
  static log10<T>(x: T): Fixed {
    const f = Fixed.from(x);
    const v = f.high;

    return new Fixed(log10_32(v), 0, 1);
  }
  /**
   * Calculates the natural log and returns the quantity
   * @param x Number | String | Fixed
   * @returns Fixed
  */
  log(x: f64): f64 {
    let result = 0.0;
    let result_fx = new Fixed(0, 0, 1);
    const term = (x - 1) / (x + 1);
    const term_fx = Fixed.from(term);
    console.log(`Term: ${term} FX: ${term_fx.toString()}`);
    let powerTerm = term;
    let powerTerm_fx = term_fx;
    let divisor = 1;
    let i = 0;
    let lastResult = -0.0;
    while (true) {
      result += powerTerm / divisor;
      result_fx = powerTerm_fx.div(divisor);
      if (i < 10) {
        console.log(`Result: ${powerTerm / divisor} FX: ${result_fx}`);
        i++;
      }
      if (result === lastResult) {
        console.log("Found accuracy at " + divisor.toString() + " operations");
        return lastResult * 2;
      }
      powerTerm *= (term * term);
      powerTerm_fx = Fixed.from(powerTerm);
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
    const low = this.low / (this.mag / 10);
    if (low > 4) this.high++;
    this.low = 0;
    this.mag = 1;
    return this;
  }
  /**
   * Floors quantity and returns the result
   * @param x Number | String | Fixed
   * @returns Fixed
  */
  floor(): Fixed {
    this.num = this.num / this.mag;
    this.mag = 1;
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
    return this.mag === f.mag && this.high === f.high && this.low === f.low;
  }
  /**
   * Checks for inequality between to Fixeds
   * @param x Number | String | Fixed
   * @returns boolean
  */
  neq<T>(x: T): boolean {
    const f = Fixed.from(x);
    return this.num !== f.num || this.mag !== f.mag;
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
    let pt = this.mag;
    console.log(`PT: ${pt} Low: ${this.low}`)
    while ((pt /= 10) > this.low) pfix += "0";
    return `${this.high}.${pfix}${this.low}`;
  }
  static from<T>(n: T): Fixed {
    const s = n.toString();
    let high: u64 = 0;
    let start = 0;
    let end = s.length << 1;
    let point = 0;
    let val: u64 = 0;
    for (; start < end; start += 2) {
      const char = load<u16>(changetype<usize>(s) + <usize>start);
      if (char == 46) {
        point = start + 2;
        high = val;
        val = 0;
      } else {
        val = ((val * 10) + (char - 48));
      }
    }
    if (point) return new Fixed(high, val, 10 ** ((end - point) >> 1));
    return Fixed.fromNumber(val);
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

@inline function log10_32(x: u64): u64 {
  switch (true) {
    case (x >= 1000000000): return 9;
    case (x >= 100000000): return 8;
    case (x >= 10000000): return 7;
    case (x >= 1000000): return 6;
    case (x >= 100000): return 5;
    case (x >= 10000): return 4;
    case (x >= 1000): return 3;
    case (x >= 100): return 2;
    case (x >= 10): return 1;
    default: return 0;
  }
}

@inline function log10_64(x: u64): u64 {
  switch (true) {
    case (x >= 10000000000000000000): return 19;
    case (x >= 1000000000000000000): return 18;
    case (x >= 100000000000000000): return 17;
    case (x >= 10000000000000000): return 16;
    case (x >= 1000000000000000): return 15;
    case (x >= 100000000000000): return 14;
    case (x >= 10000000000000): return 13;
    case (x >= 1000000000000): return 12;
    case (x >= 100000000000): return 11;
    case (x >= 10000000000): return 10;
    case (x >= 1000000000): return 9;
    case (x >= 100000000): return 8;
    case (x >= 10000000): return 7;
    case (x >= 1000000): return 6;
    case (x >= 100000): return 5;
    case (x >= 10000): return 4;
    case (x >= 1000): return 3;
    case (x >= 100): return 2;
    case (x >= 10): return 1;
    default: return 0;
  }
}