@inline export function abs_no_branch(x: i64): i64 {
  const mask = x >> 63;
  return (x + mask) ^ mask;
}