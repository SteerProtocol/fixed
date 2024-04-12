import { decimalCount32 } from "util/number";
import { Fixed128 } from "./fixed128";
import { i128 } from "./src/i128";

export class Float {
    public storage: u64;
    public sign: u64;
    public exponent: u64;
    public mantissa: u64;
    public int: i64 = 0;
    public dec: u64 = 0;
    constructor(sign: u64, exponent: u64, mantissa: u64) {
        this.sign = sign;
        this.exponent = exponent;
        this.mantissa = mantissa;
    }
    reinterpret(): u64 {
        return (this.sign << 63) | (this.exponent << 52) | this.mantissa;
    }
    static fromFixed(x: Fixed128): Float {
        const i = i128.div(x.num, x.mag);
        const d = i128.mod(x.num, x.mag);
        return Float.fromInt(i.toU64(), d.toU64());
    }
    static fromFloat(x: f64): Float {
        const bytes = reinterpret<u64>(x);
        const sign = (bytes >> 63) & 0x1;
        const exp = (bytes >> 52) & 0x7FF;
        const mantissa = (bytes << 11) >> 11;
        return new Float(sign, exp, mantissa);
    }
    static fromInt(a: i64, b: u64): Float {
        const signBit = u32(a < 0);
        const msb = 63 - clz(a)
        const expBits = msb + 1023;
        // biased at 1023
        let temp = b;
        let rem: u64 = 0;
        // should use decimalCount64
        for (let i = 0; i < i32(decimalCount32(u32(b))); i++) {
            temp = (temp << 1) / 10;
            rem <<= 1;
            if (temp === 1) rem |= 1;
        }
        const m = ((a << 3) | rem);
        const mantissaBits = m << (clz(m) - 11);
        const f = new Float(signBit, expBits, mantissaBits);
        f.int = a;
        f.dec = b;
        return f;
    }
}