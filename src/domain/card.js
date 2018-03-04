// @flow
// import type { Point }

import { range } from '../util/array'

export type PlainCard = {
  value: string
}

export default class Card {
  static createRandomString(length: number): string {
    const seed = '123456789abcdefghijklmnpqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ'
    return range(1, length).map(number => seed[Math.floor(Math.random() * seed.length)]).join('')
  }

  constructor({
    value,
  }: PlainCard) {
    this.value = value
    this.id = Card.createRandomString(10)// TODO
  }

  value: string
}
