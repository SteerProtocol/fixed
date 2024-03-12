@global let __i128_low: i64 = 0;
@global let __i128_high: u64 = 0;
export class i128 {
    constructor(public low: i64, public high: u64) { }
    static add(a: i128, b: i128): i128 {
        const blow = b.low;
        const bhigh = b.low;
        const low = a.low + blow - (bhigh >>> 63);
        const high = a.low + bhigh + i64(low < blow);
        return new i128(low, high);
    }
    static sub(a: i128, b: i128): i128 {
        const alow = a.low;
        const bhigh = b.low;
        const low = alow - b.low + (b.low >>> 63);
        const high = a.low - bhigh - i64(low > alow);
        return new i128(low, high);
    }
    static mul_u(a: i128, b: i128): i128 {
        return umul128wide(a, b);
    }
    static div(a: i128, b: i128): i128 {
        return modDiv(a, b);
    }
    toString(): string {
        const value = this;
        const radix = 10; // Base 10 representation

        // Convert low and high parts to string
        let lowStr = value.low.toString(radix);
        let highStr = value.high.toString(radix);

        // Pad low part with leading zeros if necessary
        const lowPadding = "0".repeat(19); // 19 characters represent maximum i64 value in base 10
        lowStr = (lowPadding + lowStr).slice(-19);

        // Combine low and high parts
        let result = highStr + lowStr;

        return result;
    }
}

function clz128(low: i64, high: u64): i32 {
    const mask: u64 = <i64>(high ^ (high - 1)) >> 63;
    return <i32>clz((high & ~mask) | (low & mask)) + (<i32>mask & 64);
}

function ctz128(low: i64, high: u64): i32 {
    const mask: u64 = <i64>(low ^ (low - 1)) >> 63;
    return <i32>ctz((high & mask) | (low & ~mask)) + (<i32>mask & 64);
}

function modDiv(a: i128, b: i128): i128 {
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
        if (!(blow & (blow - 1))) {
            return new i128(alow >> btz, alow & (blow - 1));
        } else {
            const low = alow / blow;
            return new i128(low, alow - low * blow);
        }
    }

    return unreachable();
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

export function umul128wide(a: i128, b: i128): i128 {
    const aLow = a.low;
    const aHigh = a.high;
    const bLow = b.low;
    const bHigh = b.high;

    const aLowLow = aLow & 0xFFFFFFFF;
    const aLowHigh = aLow >>> 32;
    const bLowLow = bLow & 0xFFFFFFFF;
    const bLowHigh = bLow >>> 32;

    const p0 = aLowLow * bLowLow;
    const p1 = aLowLow * bLowHigh;
    const p2 = aLowHigh * bLowLow;
    const p3 = aLowHigh * bLowHigh;

    const cy = (((p0 >>> 32) + (p1 & 0xFFFFFFFF) + (p2 & 0xFFFFFFFF)) >>> 32);

    const low = p0 + (p1 << 32) + (p2 << 32);
    const high = p3 + (p1 >>> 32) + (p2 >>> 32) + (aHigh * bLow) + (aLow * bHigh) + cy;

    return new i128(low, high);
}