// @flow

export const range = (start: number, length: number): Array => {
  return Array.from(Array(length)).map((_, i) => i + start)
}

export const unique = (array: Array): Array => {
  return array.filter((item, pos, arr) => arr.indexOf(item) === pos)
}

export const shuffle = (array: Array): Array => {
  return array
    .map(value => ({ sort: Math.random(), value }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}
