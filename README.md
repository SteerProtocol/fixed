# Fixed

9:11-11:20 
Fixed is a TypeScript library for working with fixed-point numbers. It provides functionality for performing arithmetic operations and comparisons on fixed-point numbers with customizable precision.

### Installation

To use Fixed in your TypeScript project, you can install it via npm:

```bash
npm install as-fixed
```

### Usage

Here's how you can use Fixed in your TypeScript code:

```ts
import { Fixed } from "as-fixed";

// Create fixed-point numbers
const num1 = new Fixed(12345, 2); // 123.45
const num2 = Fixed.from("67.89");  // 67.89

// Perform arithmetic operations
const sum = num1.add(num2);        // 191.34
const difference = num1.sub(num2); // 55.56
const product = num1.mult(num2);   // 838201.05
const quotient = num1.div(num2);   // 1.819925677
```

### API
**Constructor**

`Fixed(num: u64, fixedPoint: u64 = 0)`: Creates a new fixed-point number with the specified integer value and fixed-point precision.

**Methods**

`add(x: T)`: Fixed: Adds two fixed-point numbers together to calculate the sum.
`sub(x: T)`: Fixed: Subtracts one fixed-point number from another to calculate the difference.
`div(x: T)`: Fixed: Divides one fixed-point number by another to calculate the quotient.
`mult(x: T)`: Fixed: Multiplies two fixed-point numbers together to calculate the product.
`eq(x: T)`: boolean: Checks for equality between two fixed-point numbers.
`neq(x: T)`: boolean: Checks for inequality between two fixed-point numbers.

### Examples

```ts
const num1 = new Fixed(12345, 2);
const num2 = Fixed.from("67.89");

const sum = num1.add(num2); // 191.34
console.log(sum.num);       // 19134
console.log(sum.fixedPoint);// 100
```

Contributing

Contributions to Fixed are welcome! Feel free to open issues or pull requests on the GitHub repository.
License

This project is licensed under the MIT License. See the LICENSE file for details.