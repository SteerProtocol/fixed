import { abs_no_branch } from "./util";
//                           9223372036854775807
@inline const I64_MAX: i64 = 100000000000000000;
/**
 * Represents a fixed-point number up to 64 bits
 */
export class Fixed {
  constructor(public num: i64, public mag: i64 = 1) { }
  /**
   * Adds two quantities together to calculate the sum
   * @param x Number | String | Fixed
   * @returns Fixed
   */
  add<T>(x: T): Fixed {
    const f = Fixed.from(x);
    if (this.mag >= f.mag) {
      if (this.mag === f.mag) {
        return new Fixed(this.num + f.num, this.mag);
      }
      const mag = this.mag / f.mag;
      return new Fixed(this.num + (f.num * mag), this.mag);
    } else {
      const mag = f.mag / this.mag;
      return new Fixed((this.num * mag) + f.num, f.mag);
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
      if (this.mag === f.mag) {
        return new Fixed(this.num - f.num, this.mag);
      }
      const mag = this.mag / f.mag;
      return new Fixed(this.num - (f.num * mag), this.mag);
    } else {
      const mag = f.mag / this.mag;
      return new Fixed((this.num * mag) - f.num, f.mag);
    }
  }
  /**
   * Multiplies two quantities together to calculate the product
   * @param x Number | String | Fixed
   * @returns Fixed
   */
  mult<T>(x: T): Fixed {
    const f = Fixed.from(x);
    return new Fixed(this.num * f.num, this.mag * f.mag);
  }
  /**
   * Subtracts two quantities from each other to calculate the difference
   * @param x Number | String | Fixed
   * @param mode 0 = raw | 1 = nearest | 2 = ceil | 3 = floor
   * @returns Fixed
   */
  div<T>(x: T, mode: i32 = 0): Fixed {
    const f = Fixed.from(x);
    const high = get_expansion(this.num / this.mag);
    const expansion = (I64_MAX / high);
    switch (mode) {
      case 0: {
        const result = (this.num * expansion) / f.num;
        return new Fixed(result, expansion);
      }
      case 1: {
        const result = (this.num * expansion) / f.num;
        if (result % 10 > 4) {
          return new Fixed((result / 10) + 1, expansion);
        }
        return new Fixed(result / 10, expansion);
      }
      case 1: {
        const result = ((this.num - 1 * expansion) / f.num) + 1;
        return new Fixed(result, expansion * 10);
      }
      case 2: {
        const result = ((this.num + 1 * expansion) / f.num) - 1;
        return new Fixed(result, expansion * 10);
      }
    }
    return unreachable();
  }
  /**
   * Calculates the natural log and returns the quantity as an integer
   * @param x Number | String | Fixed
   * @returns Fixed
  */
  static log10<T>(x: T): Fixed {
    const f = Fixed.from(x);
    const v = f.num / f.mag;
    if (v < 10000000000) return new Fixed(log10_i32(v), 1);
    else return new Fixed(log10_i64(v), 1);
  }
  toString(): string {
    console.log(`N - ${this.num} M - ${this.mag}`)
    const high = this.num / this.mag;
    const low = abs_no_branch(this.num % this.mag);
    let p = "";
    let mag = get_mag(low);
    while ((mag *= 10) < this.mag) {
      p += "0";
    }
    if (!high && this.num < 0) return `-${high}.${p}${low}`;
    return `${high}.${p}${low}`;
  }
  static from<T>(n: T): Fixed {
    if (n instanceof Fixed) return n;
    const s = n.toString();
    const neg = s.charCodeAt(0) === 45 ? true : false;
    let start = neg ? 2 : 0;
    let end = s.length << 1;
    let point = 0;
    let val: i64 = 0;
    for (; start < end; start += 2) {
      const char = load<u16>(changetype<usize>(s) + <usize>start);
      if (char == 46) {
        point = start + 2;
      } else {
        val = ((val * 10) + (char - 48));
      }
    }
    console.log(`Created Fixed Point: N - ${neg ? -val : val} M - ${10 ** ((end - point) >> 1)}`);
    if (point) return new Fixed(neg ? -val : val, 10 ** ((end - point) >> 1));
    return new Fixed(neg ? -val : val, 1);
  }
  @operator("+")
  @inline
  static add(a: Fixed, b: Fixed): Fixed {
    return a.add(b);
  }
}

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
console.log(i64.MAX_VALUE.toString())