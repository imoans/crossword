// @flow

export const range = (start, length) => {
  return Array.from(Array(length)).map((_, i) => i + start)
}
