//@inline const E = 271828182845904523536;
//const E_Fixed = Fnum.from("2.71828182845904523536");
/**
 * Represents a fixed-point number
 */
export class Fixed {
  public num: u64;
  constructor(num: u64, public fixedPoint: u64 = 0) {
    this.num = num;
  }
  /**
   * Adds two Fnums together to calculate the sum
   * @param x Number | String | Fnum
   * @returns Fnum
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
   * Subtracts two Fnums from each other to calculate the difference
   * @param x Number | String | Fnum
   * @returns Fnum
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
   * Divides two Fnums together to calculate the quotient
   * @param x Number | String | Fnum
   * @returns Fnum
  */
  div<T>(x: T): Fixed {
    const f = Fixed.from(x);
    //     25.5                 600
    //if (this.fixedPoint < f.fixedPoint) {
    return new Fixed(maximize(this.num) / f.num, /*how do i calculate fixedPoint?*/);
    //}
    //return new Fnum(quo, this.fixedPoint);
  }
  mult<T>(x: T): Fixed {
    const f = Fixed.from(x);
    if (this.fixedPoint < f.fixedPoint) {
      if (this.fixedPoint === f.fixedPoint) return new Fixed(this.num * f.num, this.fixedPoint);
      return new Fixed((minimize(this.num) * f.num), 10000);
    }
    return new Fixed((this.num * f.num) / this.fixedPoint);
  }
  //round<T>(x: T): Fnum {
  //  const f = Fnum.from(x);
  //}
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
   * Checks for equality between to Fnums
   * @param x Number | String | Fnum
   * @returns boolean
  */
  eq<T>(x: T): boolean {
    const f = Fixed.from(x);
    return this.num === f.num && this.fixedPoint === f.fixedPoint;
  }
  /**
   * Checks for inequality between to Fnums
   * @param x Number | String | Fnum
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
  /*toString(): string {
    const num = this.num.toString();
    let r = "";
    const place = num.length - decimalCount(this.fixedPoint);
    console.log(`${this.fixedPoint} ${decimalCount(this.fixedPoint)} ${num.length}`)
    for (let i = 0; i < num.length; i++) {
      if (i === place) r += ".";
      r += num.charAt(i);
    }
    return r;
  }*/
  static from<T>(n: T): Fixed {
    if (n instanceof Fixed) return n;
    if (isString<T>()) {
      let start = 0;
      let end = n.length << 1;
      let point = 0;
      let val: u64 = 0;
      for (; start < end; start += 2) {
        const char = load<u16>(changetype<usize>(n) + <usize>start);
        if (char == 46) {
          point = start + 1;
        } else {
          val = ((val * 10) + (char - 48));
        }
      }
      if (point) return new Fixed(val, 10 ** ((end - point) >> 1));
      return new Fixed(val);
    } else {
      return new Fixed(n, 0);
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
  if (x > 999999999999999999) return 19
  if (x > 99999999999999999) return 18
  if (x > 9999999999999999) return 10000000000000000
  if (x > 999999999999999) return 1000000000000000
  if (x > 99999999999999) return 100000000000000
  if (x > 9999999999999) return 10000000000000
  if (x > 999999999999) return 1000000000000
  if (x > 99999999999) return 100000000000
  if (x > 9999999999) return 10000000000
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