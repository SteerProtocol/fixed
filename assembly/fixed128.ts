import { MpZ } from "@hypercubed/as-mpz";

// @ts-ignore
@inline const I64_MAX: i64 = 100000000000000000;
/**
 * Represents a fixed-point number up to 128 bits
 */
export class Fixed128 {
  constructor(public high: i64, public low: u64, public mag: u64 = 1) { }
  /**
   * Adds two quantities together to calculate the sum
   * @param lhs Number | String | Fixed
   * @param rhs Number | String | Fixed
   * @returns Fixed
   */
  static add<L, R>(lhs: L, rhs: R): Fixed128 {
    const l = Fixed128.from(lhs);
    const r = Fixed128.from(rhs);
    console.log(`Left:\n - High: ${l.high}\n - Low: ${l.low}\n - Mag: ${l.mag}`);
    console.log(`Right:\n - High: ${r.high}\n - Low: ${r.low}\n - Mag: ${r.mag}`);
    if (l.mag >= r.mag) {
      if (l.mag === r.mag) {
        const low = l.low + r.low;
        const overflow = low >= l.mag;
        if (overflow) {
          const high = l.high + r.high + 1;
          return new Fixed128(high, low % l.mag, l.mag / 10);
        } else {
          const high = l.high + r.high;
          return new Fixed128(high, low, l.mag);
        }
      }
      const mag = l.mag / r.mag;
      const r_low = (r.low * mag);
      const low = l.low + r_low;
      const overflow = low >= l.mag;
      if (overflow) {
        const high = l.high + r.high + 1;
        return new Fixed128(high, low % r.mag, l.mag / 10);
      } else {
        const high = l.high + r.high;
        return new Fixed128(high, low, l.mag);
      }
    } else {
      const mag = r.mag / l.mag;
      const low = (l.low * mag) + r.low;
      const overflow = low >= r.mag;
      if (overflow) {
        const high = l.high + r.high + 1;
        return new Fixed128(high, low % r.mag, r.mag / 10);
      } else {
        const high = l.high + r.high;
        return new Fixed128(high, low, r.mag);
      }
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
        const low = l.low - r.low;
        const carry = u64(i64(low) < i64(0));
        const high = l.high - r.high;
        const underflow = low <= (l.mag / 10);
        if (carry) {
          if (underflow) return new Fixed128(high - 1, (low + 10), get_expansion(low));
          return new Fixed128(high - 1, low + 10, l.mag);
        } else {
          if (underflow) return new Fixed128(high, low, get_expansion(low));
          return new Fixed128(high, low, l.mag);
        }
      }
      const mag = l.mag / r.mag;
      const low = l.low + (r.low * mag);
      const carry = u64(i64(low) < i64(0));
      const high = l.high - r.high;
      const underflow = low <= (l.mag / 10);
      if (carry) {
        if (underflow) return new Fixed128(high - 1, (low + 10), get_expansion(low));
        return new Fixed128(high - 1, low + 10, l.mag);
      } else {
        if (underflow) return new Fixed128(high, low, get_expansion(low));
        return new Fixed128(high, low, l.mag);
      }
    } else {
      const mag = r.mag / l.mag;
      const low = (l.low * mag) + r.low;
      const carry = u64(i64(low) < i64(0));
      const high = l.high - r.high;
      const underflow = low <= (r.mag / 10);
      if (carry) {
        if (underflow) return new Fixed128(high - 1, (low + 10), get_expansion(low));
        return new Fixed128(high - 1, low + 10, r.mag);
      } else {
        if (underflow) return new Fixed128(high, low, get_expansion(low));
        return new Fixed128(high, low, r.mag);
      }
    }
  }
  toString(): string {
    //console.log(`N - ${this.num} M - ${this.mag}`)
    return `${this.high}.${this.low}`;
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
        return new Fixed128(neg ? -i64.parse(high) : i64.parse(high), u64.parse(low), mag);
      } else {
        const num = i64.parse(high);
        return new Fixed128(neg ? -num : num, 0, 1);
      }
    }
    return unreachable();
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