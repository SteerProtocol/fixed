# Fixed

Fixed is a TypeScript library for working with fixed-point numbers. It provides functionality for performing arithmetic operations and comparisons on fixed-point numbers with customizable precision.

### Installation

To use Fixed in your TypeScript project, you can install it via npm:

```bash
npm install as-fixed
```

### Usage

Here's how you can use Fixed in your AssemblyScript code:

```ts
import { Fixed } from "as-fixed";

// Create fixed-point numbers
const num1 = new Fixed(12345, 100); // 123.45
const num2 = Fixed.from("67.89");  // 67.89

// Perform arithmetic operations
const sum = num1.add(num2);        // 191.34
const difference = num1.sub(num2); // 55.56
const product = num1.mult(num2);   // 838201.05
const quotient = num1.div(num2);   // 1.819925677
const log = Fixed.log(10); // 2.302585092994046

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

`new Fixed(num: u64, mag: u64 = 0)`

`Fixed.from<T>(x: T): Fixed`

**Methods**

*Operations*

`Fixed.add<L, R>(lhs: L, rhs: R): Fixed`

`Fixed.sub<L, R>(lhs: L, rhs: R): Fixed`

`Fixed.mult<L, R>(lhs: L, rhs: R): Fixed`

`Fixed.div<L, R>(lhs: L, rhs: R): Fixed`

`Fixed.pow<T>(x: T): Fixed`

*Comparisions*

`Fixed.eq<L, R>(lhs: L, rhs: R): boolean`

`Fixed.neq<L, R>(lhs: L, rhs: R): boolean`

`Fixed.gt<L, R>(lhs: L, rhs: R): boolean`

`Fixed.lt<L, R>(lhs: L, rhs: R): boolean`

*Utilities*

`Fixed.round<T>(x: T): Fixed`

`Fixed.floor<T>(x: T): Fixed`

`Fixed.ceil<T>(x: T): Fixed`

`Fixed.max<T>(x: T): Fixed`

`Fixed.min<T>(x: T): Fixed`

`Fixed.log<T>(x: T, mag?: u64): Fixed`

`Fixed.log10<T>(x: T): Fixed`

Contributing

Contributions to Fixed are welcome! Feel free to open issues or pull requests on the GitHub repository.
License

This project is licensed under the MIT License. See the LICENSE file for details.