import { CharCode } from "util/string";
import { i128 } from "./src/i128";
// Use LUT wrapped by function for lazy compilation
// @ts-ignore: decorator
@lazy const RadixCharsTable = memory.data<u8>([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 36, 36, 36, 36, 36, 36,
    36, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 36, 36, 36, 36,
    36, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35
]);

function processU64(digits: Uint8Array, value: u64): void {
    const length = digits.length - 1;
    for (let i = 63; i != -1; --i) {
        for (let j = 0; j <= length; ++j) {
            unchecked(digits[j] += (u8(digits[j] >= 5) * 3));
        }
        for (let j = length; j != -1; --j) {
            let d = unchecked(digits[j]) << 1;
            if (j < length) unchecked(digits[j + 1] |= u8(d > 15));
            unchecked(digits[j] = d & 15);
        }
        unchecked(digits[0] += u8((value & (1 << i)) != 0));
    }
}

export function i128toDecimalString(value: i128): string {
    const length = 40;
    const digits = new Uint8Array(length);
    let result = "";
    let start = false;

    processU64(digits, value.high);
    processU64(digits, u64(value.abs().low));

    for (let i = length - 1; i != -1; --i) {
        let d = unchecked(digits[i]);
        if (!start && d != 0) start = true;
        if (start) {
            assert(<u32>d <= 9);
            result += String.fromCharCode(0x30 + d);
        }
    }
    return result;
}

export function atoi128(str: string, radix: i32 = 10): i128 {
    if (radix < 2 || radix > 36) {
        throw new Error("Invalid radix");
    }
    const len = str.length;
    if (!len) return i128.Zero;

    const first = str.charCodeAt(0);
    if (len == 1 && first == CharCode._0) {
        return i128.Zero;
    }
    const isNeg = first == CharCode.MINUS;
    // @ts-ignore
    let index = i32(isNeg | (first == CharCode.PLUS));

    if (str.charCodeAt(index) == CharCode._0) {
        let second = str.charCodeAt(++index);
        if ((second | 32) == CharCode.x) {
            radix = 16; ++index;
        } else if ((second | 32) == CharCode.o) {
            radix = 8; ++index;
        } else if ((second | 32) == CharCode.b) {
            radix = 2; ++index;
        } else if (second == CharCode._0) {
            // skip leading zeros
            while (index < len && str.charCodeAt(index) == CharCode._0) ++index;
        }
    }
    let result = i128.Zero;
    const table = RadixCharsTable;

    if (index >= len) return result;

    if (ASC_SHRINK_LEVEL >= 1) {
        let radix128 = i128.fromU64(radix);
        do {
            let n: u32 = str.charCodeAt(index) - CharCode._0;
            if (n > <u32>(CharCode.z - CharCode._0)) break;

            let num = load<u8>(table + n);
            if (num >= <u8>radix) break;

            // @ts-ignore
            result *= radix128;
            // @ts-ignore
            result += i128.fromU64(num);
        } while (++index < len);
    } else {
        switch (radix) {
            case 2: {
                do {
                    let num: u32 = str.charCodeAt(index) - CharCode._0;
                    if (num >= 2) break;
                    // @ts-ignore
                    result <<= 1;
                    // @ts-ignore
                    result |= i128.fromU64(num);
                } while (++index < len);
                break;
            }
            case 10: {
                do {
                    let num: u32 = str.charCodeAt(index) - CharCode._0;
                    if (num >= 10) break;
                    // @ts-ignore
                    result = (result << 3) + (result << 1);
                    // @ts-ignore
                    result += i128.fromU64(num);
                } while (++index < len);
                break;
            }
            case 16: {
                do {
                    let n: u32 = str.charCodeAt(index) - CharCode._0;
                    if (n > <u32>(CharCode.z - CharCode._0)) break;

                    let num = load<u8>(table + n);
                    if (num >= 16) break;

                    // @ts-ignore
                    result <<= 4;
                    // @ts-ignore
                    result |= i128.fromU64(num);
                } while (++index < len);
                break;
            }
            default: {
                let radix128 = i128.fromU64(radix);
                do {
                    let n: u32 = str.charCodeAt(index) - CharCode._0;
                    if (n > <u32>(CharCode.z - CharCode._0)) break;

                    let num = load<u8>(table + n);
                    if (num >= <u8>radix) break;

                    // @ts-ignore
                    result *= radix128;
                    // @ts-ignore
                    result += i128.fromU64(num);
                } while (++index < len);
                break;
            }
        }
    }
    // @ts-ignore
    return isNeg ? -result : result;
}
