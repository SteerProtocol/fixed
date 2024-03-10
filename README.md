# Fixed

Fixed is a TypeScript library for working with fixed-point numbers. It provides functionality for performing arithmetic operations and comparisons on fixed-point numbers with customizable precision.

### Installation

To use Fixed64 in your TypeScript project, you can install it via npm:

```bash
npm install as-fixed
```

### Usage

Here's how you can use Fixed in your AssemblyScript code:

```ts
import { Fixed64 } from "as-fixed";

// Create fixed-point numbers
const num1 = new Fixed64(12345, 100); // 123.45
const num2 = Fixed64.from("67.89");  // 67.89

// Perform arithmetic operations
const sum = Fixed64.add(num1, num2);        // 191.34
const difference = Fixed64.sub(num1, num2); // 55.56
const product = Fixed64.mult(num1, num2);   // 838201.05
const quotient = Fixed64.div(num1, num2);   // 1.819925677
const log = Fixed64.log(10); // 2.302585092994046

// You can use operators
const pow = num1 ** 5;
if (num1 > num2) {
  // Do something
} else if (num1 === num2) {
  // Do something else
}
```

### API
**Constructor**

`new Fixed64(num: u64, mag: u64 = 0)`

`Fixed64.from<T>(x: T): Fixed64`

**Methods**

*Operations*

`Fixed64.add<L, R>(lhs: L, rhs: R): Fixed64`

`Fixed64.sub<L, R>(lhs: L, rhs: R): Fixed64`

`Fixed64.mult<L, R>(lhs: L, rhs: R): Fixed64`

`Fixed64.div<L, R>(lhs: L, rhs: R): Fixed64`

`Fixed64.pow<T>(x: T): Fixed64`

*Comparisions*

`Fixed64.eq<L, R>(lhs: L, rhs: R): boolean`

`Fixed64.neq<L, R>(lhs: L, rhs: R): boolean`

`Fixed64.gt<L, R>(lhs: L, rhs: R): boolean`

`Fixed64.lt<L, R>(lhs: L, rhs: R): boolean`

*Utilities*

`Fixed64.round<T>(x: T): Fixed64`

`Fixed64.floor<T>(x: T): Fixed64`

`Fixed64.ceil<T>(x: T): Fixed64`

`Fixed64.max<T>(x: T): Fixed64`

`Fixed64.min<T>(x: T): Fixed64`

`Fixed64.log<T>(x: T, mag?: u64): Fixed64`

`Fixed64.log10<T>(x: T): Fixed64`

Contributing

Contributions to Fixed64 are welcome! Feel free to open issues or pull requests on the GitHub repository.
License

This project is licensed under the MIT License. See the LICENSE file for details.