import { u128 } from "as-bignum/assembly";
// @ts-ignore
@inline const I64_MAX: i64 = 100000000000000000;
/**
 * Represents a fixed-point number with arbitrary precision
 */
export class FixedARB {
    constructor(public num: u128, public mag: u128, public neg: boolean = true) { }
    /**
     * Adds two quantities together to calculate the sum
     * @param lhs Number | String | FixedARB
     * @param rhs Number | String | FixedARB
     * @returns FixedARB
     */
    static add<L, R>(lhs: L, rhs: R): FixedARB {
        const l = FixedARB.from(lhs);
        const r = FixedARB.from(rhs);
        if (l.mag >= r.mag) {
            if (l.mag === r.mag) {
                return new FixedARB(l.num + r.num, l.mag);
            }
            const mag = l.mag / r.mag;
            const left = l.num;
            const right = r.num * mag;
            if (l.neg || r.neg) {
                if (l.neg) {
                    if (left > right) {
                        
                    }
                }
            }
            return new FixedARB(left + right, l.mag);
        } else {
            const mag = r.mag / l.mag;
            return new FixedARB((l.num * mag) + r.num, r.mag);
        }
    }
    /**
     * Subtracts two quantities from each other to calculate the difference
     * @param lhs Number | String | Fixed
     * @param rhs Number | String | Fixed
     * @returns Fixed
     */
    static sub<L, R>(lhs: L, rhs: R): FixedARB {
        const l = FixedARB.from(lhs);
        const r = FixedARB.from(rhs);
        if (l.mag >= r.mag) {
            if (l.mag === r.mag) {
                return new FixedARB(l.num - r.num, l.mag);
            }
            const mag = l.mag / r.mag;
            return new FixedARB(l.num - (r.num * mag), l.mag);
        } else {
            const mag = r.mag / l.mag;
            return new FixedARB((l.num * mag) - r.num, r.mag);
        }
    }
    /**
     * Multiplies two quantities together to calculate the product
     * @param lhs Number | String | Fixed
     * @param rhs Number | String | Fixed
     * @returns Fixed
     */
    static mult<L, R>(lhs: L, rhs: R): FixedARB {
        const l = FixedARB.from(lhs);
        const r = FixedARB.from(rhs);
        // May change later. I don't like how mag is done. Can cause overflow.
        return new FixedARB(l.num * r.num, l.mag * r.mag);
    }
    static from<T>(n: T): FixedARB {
        if (n instanceof FixedARB) return n;
        if (isString<T>() || isInteger<T>()) {
            // @ts-ignore;
            const str = n.toString() as string;
            const neg = str.charCodeAt(0) === 45;
            let dec = 0;
            let n = "";
            for (let i = neg ? 1 : 0; i < str.length; i++) {
                if (str.charCodeAt(i) === 46) {
                    dec = i;
                    break;
                }
                n += str.charAt(i);
            }
            const num = u128.fromString(n);
            return new FixedARB(num, u128.pow(u128.from(10), str.length - dec + 1), neg);
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