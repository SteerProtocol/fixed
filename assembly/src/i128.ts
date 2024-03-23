import { u128 } from "as-bignum/assembly";
import { atoi128, i128toDecimalString } from "../util";

export class i128 {
    @inline static get Zero(): i128 { return new i128(0, 0); }
    @inline static get One(): i128 { return new i128(1, 0); }
    @inline static get Ten(): i128 { return new i128(10, 0); }
    @inline static get Min(): i128 { return new i128(0, 0); }
    @inline static get Max(): i128 { return new i128(-1, -1); }

    constructor(public low: u64, public high: u64 = 0, public sign: i32 = 0) { }
    /**
     * Performs addition
     * @returns i128
     */
    @inline @operator("+")
    static add(a: i128, b: i128): i128 {
        if (a.isNeg()) return this.add_u(b, a);
        const aLow = a.low;
        const bLow = b.low;
        const bHigh = b.high;
        const low = aLow + b.low - (bHigh >>> 63);
        const high = a.high + b.high + i64(low < bLow);
        return new i128(low, high);
    }
    /**
     * Performs unsigned addition
     * @returns i128
     */
    @inline
    static add_u(a: i128, b: i128): i128 {
        const aLow = a.low;
        const bLow = b.low;
        const bHigh = b.high;
        const low = aLow + b.low - (bHigh >>> 63);
        const high = a.high + b.high + i64(low < bLow);
        return new i128(low, high);
    }
    /**
     * Performs subtraction
     * @returns i128
     */
    @inline @operator("-")
    static sub(a: i128, b: i128): i128 {
        const aLow = a.low;
        const bLow = b.low;
        const low = aLow - bLow;
        const high = a.high - b.high - u64(aLow < bLow);
        return new i128(low, high);
    }
    /**
     * Performs multiplication
     * @returns i128
     */
    @inline @operator("*")
    static mul(a: i128, b: i128): i128 {
        if (a.isNeg()) {
            if (b.isNeg()) return umul128wide(a.abs(), b.abs());
            return umul128wide(a.abs(), b).neg();
        } else if (b.isNeg()) {
            return umul128wide(a, b.abs()).neg();
        } else {
            return umul128wide(a, b);
        }
    }
    /**
     * Performs division
     * @returns i128
     */
    @inline @operator("/")
    static div(a: i128, b: i128): i128 {
        if (b.isZero()) throw new Error("Division by zero");
        // check for integer overflow
        if (a.isNeg()) {
            if (b.isNeg()) return _div(a.abs(), b.abs());
            return _div(a.abs(), b.abs()).neg();
        } else if (b.isNeg()) {
            return _div(a, b.abs()).neg();
        } else {
            return _div(a, b);
        }
    }
    /**
     * Returns true if i128 is positive
     * @returns boolean
     */
    @inline
    isPos(): boolean {
        return this.low >= 0;
    }
    /**
     * Returns true if i128 is negative
     * @returns boolean
     */
    @inline
    isNeg(): boolean {
        return this.low >= u64(I64.MAX_VALUE);
    }
    /**
     * Returns true if i128 is zero
     * @returns boolean
     */
    @inline
    isZero(): boolean {
        return !(this.low | this.high);
    }
    /**
     * Performs bitwise not (~)
     * @returns this
     */
    @inline @operator.prefix("~")
    not(): i128 {
        this.low = ~this.low;
        this.high = ~this.high;
        return this;
    }
    /**
     * Prepends (+) to i128
     * @returns this
     */
    @inline @operator.prefix("+")
    pos(): i128 {
        return this;
    }
    /**
     * Prepends (-) to i128
     * @returns this
     */
    @inline @operator.prefix("-")
    neg(): i128 {
        // Perform 2s complement
        const low = ~this.low;
        const high = ~this.high;
        const rlow = low + 1;
        this.low = rlow;
        this.high = high + u64(rlow < 0);
        return this;
    }
    /**
     * Performs the bang (!) operator
     * @returns boolean
     */
    @inline @operator.prefix("!")
    static isEmpty(value: i128): boolean {
        return !(value.low | value.high)
    }
    /**
     * Performs bitwise or (|)
     * @returns i128
     */
    @inline @operator("|")
    static or(a: i128, b: i128): i128 {
        return new i128(a.low | b.low, a.high | b.high);
    }
    /**
     * Performs bitwise exclusive or (^)
     * @returns i128
     */
    @inline @operator('^')
    static xor(a: i128, b: i128): i128 {
        return new i128(a.low ^ b.low, a.high ^ b.high);
    }
    /**
     * Performs bitwise and (&)
     * @returns i128
     */
    @inline @operator("&")
    static and(a: i128, b: i128): i128 {
        return new i128(a.low & b.low, a.high & b.high);
    }
    /**
     * Performs bitwise shift left (<<)
     * @returns i128
     */
    @inline @operator("<<")
    static shl(value: i128, shift: i32): i128 {
        let shift64 = (shift & 127) as u64;

        const mod1 = ((((shift64 + 127) | shift64) & 64) >> 6) - 1;
        const mod2 = (shift64 >> 6) - 1;

        shift64 &= 63;

        const vl = value.low;
        const lo = vl << shift64;
        let hi = lo & ~mod2;

        hi |= ((value.high << shift64) | ((vl >> (64 - shift64)) & mod1)) & mod2;

        return new i128(lo & mod2, hi);
    }
    /**
     * Performs bitwise unsigned right shift (>>>)
     * @returns i128
     */
    @inline @operator('>>>')
    static shr_u(value: i128, shift: i32): i128 {
        shift &= 127;

        let shift64: i64 = shift;

        let mod1: i64 = ((((shift64 + 127) | shift64) & 64) >>> 6) - 1;
        let mod2: i64 = (shift64 >>> 6) - 1;

        shift64 &= 63;

        let vh = value.high;
        let high = vh >>> shift64;
        let low = high & ~mod2;

        low |= ((value.low >>> shift64) | ((vh << (64 - shift64)) & mod1)) & mod2;

        return new i128(low, high & mod2);
    }
    @inline @operator(">>")
    static shr(value: i128, shift: i32): i128 {
        return this.shr_u(value, shift);
    }
    /**
     * Returns the modulus
     * @returns i128
     */
    @inline @operator("%")
    static mod(a: i128, b: i128): i128 {
        const aAbs = a.abs();
        if (b.isZero()) throw new Error("Division by zero");
        const quot = this.div(aAbs, b);
        const rem = this.sub(aAbs, this.mul(quot, b));
        return rem;
    }
    /**
     * Tests for equality
     * @returns boolean
     */
    @inline @operator("==")
    static eq(a: i128, b: i128): boolean {
        return a.high == b.high && a.low === b.low;
    }
    /**
     * Tests for inequality
     * @returns boolean
     */
    @inline @operator("!=")
    static neq(a: i128, b: i128): boolean {
        return !i128.eq(a, b);
    }
    /**
     * Checks if a < b
     * @returns boolean
     */
    @inline @operator("<")
    static lt(a: i128, b: i128): boolean {
        const aHigh = a.high;
        const bHigh = b.high;
        if (aHigh == bHigh) {
            return a.low < b.low;
        } else {
            return aHigh < bHigh;
        }
    }
    /**
     * Checks if a > b
     * @returns boolean
     */
    @inline @operator(">")
    static gt(a: i128, b: i128): boolean {
        const aHigh = a.high;
        const bHigh = b.high;
        if (aHigh == bHigh) {
            return a.low > b.low;
        } else {
            return aHigh > bHigh;
        }
    }
    /**
     * Checks if a <= b
     * @returns boolean
     */
    @inline @operator("<=")
    static le(a: i128, b: i128): boolean {
        return !this.gt(a, b);
    }
    /**
     * Checks if a >= b
     * @returns boolean
     */
    @inline @operator(">=")
    static ge(a: i128, b: i128): boolean {
        return !this.lt(a, b);
    }
    /**
     * Returns the number of leading zeros
     * @returns i32
     */
    @inline
    static clz(value: i128): i32 {
        return clz128(value.low, value.high);
    }
    /**
     * Returns the number of trailing zeros
     * @returns i32
     */
    @inline
    static ctz(value: i128): i32 {
        return ctz128(value.low, value.high);
    }
    /**
     * Returns the absolute value
     * @returns i128
     */
    @inline
    abs(): i128 {
        const high = this.high;
        if (this.isNeg()) {
            const low = -this.low;
            return new i128(low, ~high + 1);
        }
        return new i128(this.low, high);
    }
    @operator.prefix("++")
    preInc(): i128 {
        const low = this.low;
        const low1 = low + 1;
        this.high += u64(low1 < low);
        this.low = low1;
        return this;
    }
    @operator.prefix("--")
    preDec(): i128 {
        const low = this.low;
        const low1 = low - 1;
        this.high -= u64(low1 > low);
        this.low = low1;
        return this;
    }
    @operator.postfix("++")
    postInc(): i128 {
        return this.clone().preInc();
    }
    @operator.postfix("--")
    postDec(): i128 {
        return this.clone().preDec();
    }
    toString(): string {
        if (this.isZero()) {
            return "0";
        }
        if (this.isNeg()) {
            return "-" + i128toDecimalString(this.neg());
        } else {
            return i128toDecimalString(this);
        }
    }
    /**
     * Returns value a 128-bit unsigned integer
     * @returns u128
     */
    @inline
    toU128(): u128 {
        return new u128(this.low, this.high);
    }
    /**
     * Returns value a a 64-bit integer
     * @returns i64
     */
    @inline
    toI64(): i64 {
        return this.low;
    }
    /**
     * Returns value a a 64-bit unsigned integer
     * @returns u64
     */
    @inline
    toU64(): u64 {
        return this.low;
    }
    /**
     * Returns value a a 64-bit integer
     * @returns i32
     */
    @inline
    toI32(): i32 {
        return <i32>this.low;
    }
    /**
     * Returns value a a 64-bit unsigned integer
     * @returns u32
     */
    @inline
    toU32(): u32 {
        return <u32>this.low;
    }
    /**
     * Returns a new instance of this
     * @returns i128
     */
    @inline
    clone(): i128 {
        return new i128(this.low, this.high);
    }


    static fromU64(x: u64): i128 { return new i128(x, 0); }
    static fromI64(x: i64): i128 { return new i128(u64(x), x >> 63, i32(x < 0)); }
    // Pretty sure this is wrong ^^^
    static fromU32(x: u32): i128 { return new i128(i64(x), 0); }
    static fromI32(x: i32): i128 { return new i128(i64(x), 0); }
    static fromHiLo(low: i64, high: u64 = 0): i128 { return new i128(low, high); }
    static fromString(value: string): i128 { return atoi128(value) }

    static fromU128(x: u128): i128 { return new i128(x.lo, x.hi); }
}

function clz128(low: i64, high: u64): i32 {
    const mask: u64 = <i64>(high ^ (high - 1)) >> 63;
    return <i32>clz((high & ~mask) | (low & mask)) + (<i32>mask & 64);
}

function ctz128(low: i64, high: u64): i32 {
    const mask: u64 = <i64>(low ^ (low - 1)) >> 63;
    return <i32>ctz((high & mask) | (low & ~mask)) + (<i32>mask & 64);
}

function _div(a: i128, b: i128): i128 {
    const alow = a.low;
    const ahigh = a.high;
    const blow = b.low;
    const bhigh = b.high;

    // 0 / x
    if (!(alow | blow)) {
        return new i128(0, 0);
    }

    // x / 0
    const blz = clz128(blow, bhigh);
    if (blz === 128) {
        throw new RangeError("Division by zero");
    }

    // x / 1
    if (blz === 127) {
        return new i128(alow, ahigh);
    }

    // x / x
    if (alow === blow && ahigh == bhigh) {
        return new i128(1, 0);
    }

    const btz = ctz128(blow, bhigh);

    if (!(ahigh | bhigh)) {
        // x % 2 = 0
        if (!(blow & (blow - 1))) {
            return new i128(alow >> btz, 0);
        } else {
            const low = alow / blow;
            return new i128(low, 0);
        }
    }

    return udivmod128(a, b);
}

function udivmod128(a: i128, b: i128): i128 {
    const aLow = a.low;
    const aHigh = a.high;
    const bLow = b.low;
    const bHigh = b.high;

    const aLowZero = clz128(aLow, aHigh);
    const bLowZero = clz128(bLow, bHigh);
    let off = bLowZero - aLowZero;
    // @ts-ignore
    let nb = b << off;
    let quotient = i128.Zero;
    let n = a.clone();

    let mask = i128.One;
    // @ts-ignore
    mask <<= 128 - bLowZero;
    // @ts-ignore
    --mask;
    // @ts-ignore
    mask <<= off;

    let i = 0;
    while (n >= b) {
        ++i;
        // @ts-ignore
        quotient <<= 1;
        // @ts-ignore
        if ((n & mask) >= nb) {
            // @ts-ignore
            ++quotient;
            // @ts-ignore
            n -= nb;
        }
        // @ts-ignore
        mask |= mask >>> 1;
        nb >>= 1;
    }
    // @ts-ignore
    quotient <<= (bLowZero - aLowZero - i + 1);

    //__divmod_quot_hi = q.hi;
    //__divmod_rem_lo = n.lo;
    //__divmod_rem_hi = n.hi;
    return quotient;
}

export function umul64wide(a: u64, b: u64): i128 {
    const alow = a & 0xFFFFFFFF;
    const ahigh = a >>> 32;
    const blow = b & 0xFFFFFFFF;
    const bhigh = b >>> 32;

    const r0 = alow * blow;
    const r1 = alow * bhigh;
    const r2 = ahigh * blow;
    const r3 = ahigh * bhigh;

    const carry = ((((r0 >>> 32) + <u64>(<u32>r1) + <u64>(<u32>r2)) >>> 32));

    const low = r0 + (r1 << 32) + (r2 << 32);
    const high = r3 + (r1 >> 32) + (r2 >> 32) + carry;

    return new i128(low, high);
}

export function multi3(a: i128, b: i128): i128 {
    const aLow = u64(a.low);
    const aHigh = a.high;
    const bLow = u64(b.low);
    const bHigh = b.high;

    let aLowLow = aLow & 0xFFFFFFFF;
    let aLowHigh = aLow >> 32;
    let bLowLow = bLow & 0xFFFFFFFF;
    let bLowHigh = bLow >> 32;

    let tmp = aLowLow * bLowLow;
    let w1 = tmp & 0xFFFFFFFF;

    tmp = aLowHigh * bLowLow + (tmp >> 32);
    const k = tmp & 0xFFFFFFFF;
    const w = tmp >> 32;
    tmp = aLowLow * bLowHigh + k;

    let low = (tmp << 32) | w1;
    let high = aLowHigh * bLowHigh + w;
    high += aHigh * bLow;
    high += aLow * bHigh;
    high += tmp >> 32;

    return new i128(low, high);
}

export function umul128wide(a: i128, b: i128): i128 {
    const aLow = u64(a.low);
    const aHigh = a.high;
    const bLow = u64(b.low);
    const bHigh = b.high;

    const aLowLow = aLow & 0xFFFFFFFF;
    const aLowHigh = aLow >>> 32;
    const bLowLow = bLow & 0xFFFFFFFF;
    const bLowHigh = bLow >>> 32;

    const p0 = aLowLow * bLowLow;
    const p1 = aLowLow * bLowHigh;
    const p2 = aLowHigh * bLowLow;
    const p3 = aLowHigh * bLowHigh;

    const carry = (((p0 >>> 32) + (p1 & 0xFFFFFFFF) + (p2 & 0xFFFFFFFF)) >>> 32);

    const low = p0 + (p1 << 32) + (p2 << 32);
    const high = p3 + (p1 >>> 32) + (p2 >>> 32) + (aHigh * bLow) + (aLow * bHigh) + carry;

    return new i128(low, high);
}