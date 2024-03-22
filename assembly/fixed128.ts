import { u128 } from "as-bignum/assembly";
import { i128 } from "./src/i128";

// @ts-ignore
@inline const I64_MAX: i64 = 100000000000000000;
/**
 * Represents a fixed-point number up to 64 bits
 */
export class Fixed128 {
  constructor(public num: i128, public mag: i128 = new i128(1, 0)) { }
  /**
   * Adds two quantities together to calculate the sum
   * @param lhs Number | String | Fixed
   * @param rhs Number | String | Fixed
   * @returns Fixed
   */
  static add<L, R>(lhs: L, rhs: R): Fixed128 {
    const l = Fixed128.from(lhs);
    const r = Fixed128.from(rhs);
    console.log(`LN: ${l.num} LM: ${l.mag} RN: ${r.num} RM: ${r.mag}`)
    if (l.mag >= r.mag) {
      if (l.mag === r.mag) {
        return new Fixed128(
          i128.add(
            l.num,
            r.num
          ),
          l.mag
        );
      }
      const mag = i128.div(l.mag, r.mag);
      console.log(`Calculating ${l.num} + ${i128.mul(r.num, mag)} = ${l.num + (r.num * mag)}`)
      return new Fixed128(
        i128.add(
          l.num,
          i128.mul(
            r.num,
            mag
          )
        ),
        l.mag
      );
    } else {
      const mag = i128.div(r.mag, l.mag);
      console.log(`Calculating ${i128.mul(l.num, mag)} + ${r.num} = ${(l.num * mag) + r.num}`)
      return new Fixed128(
        i128.add(
          i128.mul(
            l.num,
            mag
          ),
          r.num
        ),
        r.mag
      );
    }
  }
  /**
   * Subtracts two quantities from each other to calculate the difference
   * @param lhs Number | String | Fixed
   * @param rhs Number | String | Fixed
   * @returns Fixed
   */
  static sub<L, R>(lhs: L, rhs: R): Fixed128 {
    const l = Fixed128.from(lhs);
    const r = Fixed128.from(rhs);
    if (l.mag >= r.mag) {
      if (l.mag === r.mag) {
        return new Fixed128(l.num - r.num, l.mag);
      }
      const mag = l.mag / r.mag;
      return new Fixed128(l.num - (r.num * mag), l.mag);
    } else {
      const mag = r.mag / l.mag;
      return new Fixed128((l.num * mag) - r.num, r.mag);
    }
  }
  /**
   * Multiplies two quantities together to calculate the product
   * @param lhs Number | String | Fixed
   * @param rhs Number | String | Fixed
   * @returns Fixed
   */
  static mult<L, R>(lhs: L, rhs: R): Fixed128 {
    const l = Fixed128.from(lhs);
    const r = Fixed128.from(rhs);
    // May change later. I don't like how mag is done. Can cause overflow.
    return new Fixed128(l.num * r.num, l.mag * r.mag);
  }
  /**
   * Divides dividend and divisor to calculate the quotient with configurable precision
   * @param dividend Number | String | Fixed
   * @param divisor Number | String | Fixed
   * @returns Fixed
   */
  static divp<D, A>(dividend: D, divisor: A, precision: i128 = i128.fromU64(100)): Fixed128 {
    const l = Fixed128.from(dividend);
    const r = Fixed128.from(divisor);
    if (l.mag >= r.mag) {
      const result = (l.num * precision) / r.num;
      return new Fixed128(result, precision);
    } else {
      const result = (l.num * precision) / r.num;
      return new Fixed128(result, precision);
    }
  }

  /**
   * Rounds quantity and returns result
   * @param x Number | String | Fixed
   * @returns Fixed
  */
  static round<T>(x: T): Fixed128 {
    const f = Fixed128.from(x);
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
  static floor<T>(x: T): Fixed128 {
    const f = Fixed128.from(x);
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
  static ceil<T>(x: T): Fixed128 {
    const f = Fixed128.from(x);
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
  static abs<T>(x: T): Fixed128 {
    const f = Fixed128.from(x);
    f.num = f.num.abs();
    return f;
  }

  /**
     * Calculates the natural log and returns the quantity
     * @param x Number | String | Fixed
     * @returns Fixed
    */
  static log(x: i128, mag: i128 = i128.fromI64(1000000000000000000)): Fixed128 {
    const x_u = x.toU128();
    const mag_u = mag.toU128();
    let result = u128.Zero;
    const term = ((x_u - u128.One) * mag_u) / (x_u + u128.One);
    const term_sq = u128.div(u128.mul(term, term), mag_u);
    let powerTerm = term;
    let divisor = u128.One;
    let lastResult = u128.Zero;
    while (true) {
      result += powerTerm / divisor;
      if (result === lastResult) {
        result *= u128.from(2);
        return new Fixed128(i128.fromHiLo(result.lo, result.hi), i128.fromHiLo(mag_u.lo, mag_u.hi));
      }
      powerTerm = u128.div(
        u128.mul(
          powerTerm,
          term_sq
        ),
        mag_u
      );
      divisor += u128.fromI32(2);
      lastResult = result;
    }
  }

  toString(): string {
    const n = this.num;
    const m = this.mag;
    const high = n.abs() / m;
    const ten = i128.Ten;
    const low = (n % m).abs();
    let p = "";
    if (low > i128.Zero) {
      let tmp = m / ten;
      while (tmp > low) {
        p += "0";
        tmp /= ten;
      }
    }
    if (n < i128.Zero) return `-${high.toString()}.${p}${low.toString()}`;
    return `${high.toString()}.${p}${low.toString()}`;
  }
  static from<T>(n: T): Fixed128 {
    if (n instanceof Fixed128) return n;
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
        return new Fixed128(i128.fromI64(neg ? -num : num), i128.fromU64(mag));
      } else {
        const num = i64.parse(high)
        return new Fixed128(i128.fromI64(neg ? -num : num));
      }
    }
    return unreachable();
  }
  @operator("+")
  @inline
  static _add(a: Fixed128, b: Fixed128): Fixed128 {
    return Fixed128.add(a, b);
  }
  @operator("-")
  @inline
  static _sub(a: Fixed128, b: Fixed128): Fixed128 {
    return Fixed128.sub(a, b);
  }
  @operator("*")
  @inline
  static _mult(a: Fixed128, b: Fixed128): Fixed128 {
    return Fixed128.mult(a, b);
  }
  @operator("/")
  @inline
  static _div(a: Fixed128, b: Fixed128): Fixed128 {
    return Fixed128.div(a, b);
  }
  @operator("**")
  @inline
  static _pow(a: Fixed128, b: Fixed128): Fixed128 {
    return Fixed128.pow(a, b);
  }
  @operator("==")
  @inline
  static _eq(a: Fixed128, b: Fixed128): boolean {
    return Fixed128.eq(a, b);
  }
  @operator("!=")
  @inline
  static _neq(a: Fixed128, b: Fixed128): boolean {
    return Fixed128.eq(a, b);
  }
  @operator(">")
  @inline
  static _gt(a: Fixed128, b: Fixed128): boolean {
    return Fixed128.gt(a, b);
  }
  @operator("<")
  @inline
  static _lt(a: Fixed128, b: Fixed128): boolean {
    return Fixed128.lt(a, b);
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