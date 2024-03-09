import { Fixed } from "./fixed";

function getTickFromPrice(price: f64): i32 {
  const tick = Math.log(price) / Math.log(f64(1.0001));
  return i32(tick);
}

const log_10001 = new Fixed(99995000333297, 1000000000000000000);
function getTickFromPrice_fx(price: u64): Fixed {
  const tick = Fixed.log(price).div(log_10001);
  return Fixed.round(tick);
}

console.log(getTickFromPrice(2).toString());

console.log(getTickFromPrice_fx(2).toString());