import { u128 } from "as-bignum/assembly";

// @ts-ignore
@inline const I64_MAX: i64 = 100000000000000000;
/**
 * Represents a fixed-point number up to 64 bits
 */
export class Fixed64 {
  constructor(public num: i64, public mag: i64 = 1) { }
  /**
   * Adds two quantities together to calculate the sum
   * @param lhs Number | String | Fixed
   * @param rhs Number | String | Fixed
   * @returns Fixed
   */
  static add<L, R>(lhs: L, rhs: R): Fixed64 {
    const l = Fixed64.from(lhs);
    const r = Fixed64.from(rhs);
    if (l.mag >= r.mag) {
      if (l.mag === r.mag) {
        return new Fixed64(l.num + r.num, l.mag);
      }
      const mag = l.mag / r.mag;
      return new Fixed64(l.num + (r.num * mag), l.mag);
    } else {
      const mag = r.mag / l.mag;
      return new Fixed64((l.num * mag) + r.num, r.mag);
    }
  }
  /**
   * Subtracts two quantities from each other to calculate the difference
   * @param lhs Number | String | Fixed
   * @param rhs Number | String | Fixed
   * @returns Fixed
   */
  static sub<L, R>(lhs: L, rhs: R): Fixed64 {
    const l = Fixed64.from(lhs);
    const r = Fixed64.from(rhs);
    if (l.mag >= r.mag) {
      if (l.mag === r.mag) {
        return new Fixed64(l.num - r.num, l.mag);
      }
      const mag = l.mag / r.mag;
      return new Fixed64(l.num - (r.num * mag), l.mag);
    } else {
      const mag = r.mag / l.mag;
      return new Fixed64((l.num * mag) - r.num, r.mag);
    }
  }
  /**
   * Multiplies two quantities together to calculate the product
   * @param lhs Number | String | Fixed
   * @param rhs Number | String | Fixed
   * @returns Fixed
   */
  static mult<L, R>(lhs: L, rhs: R): Fixed64 {
    const l = Fixed64.from(lhs);
    const r = Fixed64.from(rhs);
    // May change later. I don't like how mag is done. Can cause overflow.
    return new Fixed64(l.num * r.num, l.mag * r.mag);
  }
  /**
   * Divides divident and divisor to calculate the quotient.
   * @param dividend Number | String | Fixed
   * @param divisor Number | String | Fixed
   * @param mode 0 = raw | 1 = nearest | 2 = ceil | 3 = floor
   * @returns Fixed
   */
  static div<D, A>(dividend: D, divisor: A, mode: i32 = 0): Fixed64 {
    const divd = Fixed64.from(dividend);
    const divr = Fixed64.from(divisor);
    if (divd.mag >= divr.mag) {
      const mag = divd.mag / divr.mag;
      const expansion = I64_MAX / get_expansion(abs(divd.num));
      switch (mode) {
        case 0: {
          const result = (divd.num * expansion) / divr.num;
          return new Fixed64(result, expansion * mag);
        }
        case 1: {
          const result = (divd.num * expansion) / divr.num;
          if (result % 10 > 4) {
            return new Fixed64((result / 10) + 1, expansion);
          }
          return new Fixed64(result / 10, expansion * 10);
        }
        case 2: {
          const result = ((divd.num - 1 * expansion) / divr.num) + 1;
          return new Fixed64(result, expansion * 10);
        }
        case 3: {
          const result = ((divd.num + 1 * expansion) / divr.num) - 1;
          return new Fixed64(result, expansion * 10);
        }
      }
      return unreachable();
    } else {
      const mag = divr.mag / divd.mag;
      const expansion = I64_MAX / get_expansion(abs(divd.num));
      switch (mode) {
        case 0: {
          const result = (divd.num * expansion) / divr.num;
          return new Fixed64(result, expansion / mag);
        }
        case 1: {
          const result = (divd.num * expansion) / divr.num;
          if (result % 10 > 4) {
            return new Fixed64((result / 10) + 1, expansion);
          }
          return new Fixed64(result / 10, expansion * 10);
        }
        case 2: {
          const result = ((divd.num - 1 * expansion) / divr.num) + 1;
          return new Fixed64(result, expansion * 10);
        }
        case 3: {
          const result = ((divd.num + 1 * expansion) / divr.num) - 1;
          return new Fixed64(result, expansion * 10);
        }
      }
      return unreachable();
    }
  }
  /**
   * Rounds quantity and returns result
   * @param x Number | String | Fixed
   * @returns Fixed
  */
  static round<T>(x: T): Fixed64 {
    const f = Fixed64.from(x);
    const mag = f.mag;
    if (mag === 1) return f;
    const high = f.num / (mag / 10);
    const rem = high % 10;
    if (rem > 4) {
      f.num = (high / 10) + 1;
      f.mag = 1;
      return f;
    } else {
      f.num = high / 10;
      f.mag = 1;
      return f;
    }
  }
  /**
   * Floors quantity and returns the result
   * @param x Number | String | Fixed
   * @returns Fixed
  */
  static floor<T>(x: T): Fixed64 {
    const f = Fixed64.from(x);
    const mag = f.mag;
    if (mag === 1) return f;
    f.num = f.num / mag;
    f.mag = 1;
    return f;
  }
  /**
   * Ceils quantity and returns the result
   * @param x Number | String | Fixed
   * @returns Fixed
  */
  static ceil<T>(x: T): Fixed64 {
    const f = Fixed64.from(x);
    const mag = f.mag;
    if (mag === 1) return f;
    f.num = (f.num / mag) + 1;
    f.mag = 1;
    return f;
  }
  /**
   * Gets the absolute value and returns the result
   * @param x Number | String | Fixed
   * @returns Fixed
   */
  static abs<T>(x: T): Fixed64 {
    const f = Fixed64.from(x);
    f.num = abs(f.num);
    return f;
  }
  /**
   * Tests for equality and returns the result
   * @param lhs Number | String | Fixed
   * @param rhs Number | String | Fixed
   * @returns boolean
   */
  static eq<L, R>(lhs: L, rhs: R): boolean {
    const l = Fixed64.from(lhs);
    const r = Fixed64.from(rhs);
    const l_mag = l.mag;
    const r_mag = r.mag;
    if (l_mag !== r_mag) {
      return false;
    } else if (l_mag >= r_mag) {
      if (l_mag === r_mag) {
        return l.num === r.num;
      } else {
        const mag = l_mag / r_mag;
        return l.num === (r.num * mag);
      }
    } else {
      const mag = r_mag / l_mag;
      return (l.num * mag) === r.num;
    }
  }
  /**
 * Tests for inequality and returns the result
 * @param lhs Number | String | Fixed
 * @param rhs Number | String | Fixed
 * @returns boolean
 */
  static neq<L, R>(lhs: L, rhs: R): boolean {
    const l = Fixed64.from(lhs);
    const r = Fixed64.from(rhs);
    const l_mag = l.mag;
    const r_mag = r.mag;
    if (l_mag !== r_mag) {
      return true;
    } else if (l_mag >= r_mag) {
      if (l_mag === r_mag) {
        return l.num !== r.num;
      } else {
        const mag = l_mag / r_mag;
        return l.num !== (r.num * mag);
      }
    } else {
      const mag = r_mag / l_mag;
      return (l.num * mag) !== r.num;
    }
  }
  /**
   * Tests if lhs is greater than rhs and returns the result
   * @param lhs Number | String | Fixed
   * @param rhs Number | String | Fixed
   * @returns boolean
   */
  static gt<L, R>(lhs: L, rhs: R): boolean {
    const l = Fixed64.from(lhs);
    const r = Fixed64.from(rhs);
    const l_mag = l.mag;
    const r_mag = r.mag;
    if (l_mag === r_mag) {
      return l.num > r.num;
    } else if (l_mag > r_mag) {
      const mag = l_mag / r_mag;
      return l.num > (r.num * mag);
    } else {
      const mag = r_mag / l_mag;
      return (l.num * mag) > r.num;
    }
  }
  /**
   * Tests if lhs is less than rhs and returns the result
   * @param lhs Number | String | Fixed
   * @param rhs Number | String | Fixed
   * @returns boolean
   */
  static lt<L, R>(lhs: L, rhs: R): boolean {
    const l = Fixed64.from(lhs);
    const r = Fixed64.from(rhs);
    const l_mag = l.mag;
    const r_mag = r.mag;
    if (l_mag === r_mag) {
      return l.num < r.num;
    } else if (l_mag > r_mag) {
      const mag = l_mag / r_mag;
      return l.num < (r.num * mag);
    } else {
      const mag = r_mag / l_mag;
      return (l.num * mag) < r.num;
    }
  }
  /**
   * Raises x to x^pwr and returns the result
   * Only for integers at the moment
   * @param x Number | String | Fixed
   * @param pwr Number | String | Fixed
   * @returns Fixed
   */
  static pow<L, R>(x: L, pwr: R): Fixed64 {
    const base = Fixed64.from(x);
    const power = Fixed64.from(pwr);

    if (power.num === 0) {
      return new Fixed64(1);
    } else if (base.num === 0) {
      return new Fixed64(0);
    } else if (power.num === 1 && power.mag === 1) {
      return base;
    } else if (power.mag === 1 && power.num > 0) {
      let result = base;
      for (let i: i64 = 1; i < power.num; i++) {
        result = Fixed64.mult(result, base);
      }
      return result;
    } else if (power.mag === 1 && power.num < 0) {
      const reciprocalBase = Fixed64.div(1, base);
      let result = reciprocalBase;
      for (let i: i64 = 1; i < -power.num; i++) {
        result = Fixed64.mult(result, reciprocalBase);
      }
      return result;
    }
    return unreachable();
  }
  /**
   * Calculates the minimum of two numbers and returns the result
   * @param lhs Number | String | Fixed
   * @param rhs Number | String | Fixed
   * @returns Fixed
   */
  static min<L, R>(lhs: L, rhs: R): Fixed64 {
    const l = Fixed64.from(lhs);
    const r = Fixed64.from(rhs);
    if (Fixed64.lt(l, r)) {
      return l;
    } else {
      return r;
    }
  }

  /**
   * Calculates the maximum of two numbers and returns the result
   * @param lhs Number | String | Fixed
   * @param rhs Number | String | Fixed
   * @returns Fixed
   */
  static max<L, R>(lhs: L, rhs: R): Fixed64 {
    const l = Fixed64.from(lhs);
    const r = Fixed64.from(rhs);
    if (Fixed64.gt(l, r)) {
      return l;
    } else {
      return r;
    }
  }
  /**
   * Calculates the natural log and returns the quantity
   * @param x Number | String | Fixed
   * @returns Fixed
  */
  static log(x: u64, mag: u64 = 1000000000000000000): Fixed64 {
    const mag_u128 = u128.from(mag);
    let result: u64 = 0;
    const term: u64 = ((x - 1) * mag) / (x + 1);
    const term_u128 = u128.div(
      u128.mul(
        u128.fromU64(term),
        u128.from(term)
      ),
      u128.fromU64(mag)
    );
    let powerTerm: u64 = term;
    let divisor = 1;
    let lastResult: u64 = 0;
    while (true) {
      result += powerTerm / divisor;
      if (result === lastResult) {
        return new Fixed64(result * 2, mag);
      }
      powerTerm = u128.div(
        u128.mul(
          u128.fromU64(powerTerm),
          term_u128
        ),
        mag_u128
      ).toU64();
      divisor += 2;
      lastResult = result;
    }
  }
  /**
   * Calculates the natural log and returns the quantity as an integer
   * @param x Number | String | Fixed
   * @returns Fixed
  */
  static log10<T>(x: T): Fixed64 {
    const f = Fixed64.from(x);
    const v = f.num / f.mag;
    if (v < 10000000000) return new Fixed64(log10_i32(v), 1);
    else return new Fixed64(log10_i64(v), 1);
  }
  toString(): string {
    //console.log(`N - ${this.num} M - ${this.mag}`)
    const high = this.num / this.mag;
    const low = abs(this.num % this.mag);
    let p = "";
    let mag = get_mag(low);
    while ((mag *= 10) < this.mag) {
      p += "0";
    }
    if (!high && this.num < 0) return `-${high}.${p}${low}`;
    return `${high}.${p}${low}`;
  }
  static from<T>(n: T): Fixed64 {
    if (n instanceof Fixed64) return n;
    if (isString<T>() || isFloat<T>() || isInteger<T>()) {
      // @ts-ignore
      const str = n.toString().split(".") as string[];
      let high = str[0];
      const neg = high.charCodeAt(0) === 45;
      if (neg) high = high.slice(1, high.length);
      if (str.length === 2) {
        const low = (str[1] || "").slice(0, 16);
        const mag: u64 = u64(10) ** low.length;
        let num = (i64.parse(high) * mag) + i64.parse(low);
        return new Fixed64(neg ? -num : num, mag);
      } else {
        const num = i64.parse(high)
        return new Fixed64(neg ? -num : num);
      }
    }
    return unreachable();
  }
  @operator("+")
  @inline
  static _add(a: Fixed64, b: Fixed64): Fixed64 {
    return Fixed64.add(a, b);
  }
  @operator("-")
  @inline
  static _sub(a: Fixed64, b: Fixed64): Fixed64 {
    return Fixed64.sub(a, b);
  }
  @operator("*")
  @inline
  static _mult(a: Fixed64, b: Fixed64): Fixed64 {
    return Fixed64.mult(a, b);
  }
  @operator("/")
  @inline
  static _div(a: Fixed64, b: Fixed64): Fixed64 {
    return Fixed64.div(a, b);
  }
  @operator("**")
  @inline
  static _pow(a: Fixed64, b: Fixed64): Fixed64 {
    return Fixed64.pow(a, b);
  }
  @operator("==")
  @inline
  static _eq(a: Fixed64, b: Fixed64): boolean {
    return Fixed64.eq(a, b);
  }
  @operator("!=")
  @inline
  static _neq(a: Fixed64, b: Fixed64): boolean {
    return Fixed64.eq(a, b);
  }
  @operator(">")
  @inline
  static _gt(a: Fixed64, b: Fixed64): boolean {
    return Fixed64.gt(a, b);
  }
  @operator("<")
  @inline
  static _lt(a: Fixed64, b: Fixed64): boolean {
    return Fixed64.lt(a, b);
  }
}

// @ts-ignore
@inline function log10_i32(x: i64): i64 {
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

// @ts-ignore
@inline function log10_i64(x: i64): i64 {
  switch (true) {
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

function get_mag(x: i64): i64 {
  switch (true) {
    case (x >= 100000000000000000): return 100000000000000000;
    case (x >= 10000000000000000): return 10000000000000000;
    case (x >= 1000000000000000): return 1000000000000000;
    case (x >= 100000000000000): return 100000000000000;
    case (x >= 10000000000000): return 10000000000000;
    case (x >= 1000000000000): return 1000000000000;
    case (x >= 100000000000): return 100000000000;
    case (x >= 10000000000): return 10000000000;
    case (x >= 1000000000): return 1000000000;
    case (x >= 100000000): return 100000000;
    case (x >= 10000000): return 10000000;
    case (x >= 1000000): return 1000000;
    case (x >= 100000): return 100000;
    case (x >= 10000): return 10000;
    case (x >= 1000): return 1000;
    case (x >= 100): return 100;
    case (x >= 10): return 10;
    default: return 1;
  }
}

function get_expansion(x: i64): i64 {
  switch (true) {
    case (x >= 100000000000000000): return 1000000000000000000;
    case (x >= 10000000000000000): return 100000000000000000;
    case (x >= 1000000000000000): return 10000000000000000;
    case (x >= 100000000000000): return 1000000000000000;
    case (x >= 10000000000000): return 100000000000000;
    case (x >= 1000000000000): return 10000000000000;
    case (x >= 100000000000): return 1000000000000;
    case (x >= 10000000000): return 100000000000;
    case (x >= 1000000000): return 10000000000;
    case (x >= 100000000): return 1000000000;
    case (x >= 10000000): return 100000000;
    case (x >= 1000000): return 10000000;
    case (x >= 100000): return 1000000;
    case (x >= 10000): return 100000;
    case (x >= 1000): return 10000;
    case (x >= 100): return 1000;
    case (x >= 10): return 100;
    default: return 10;
  }
}