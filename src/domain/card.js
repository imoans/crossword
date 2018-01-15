// @flow

export type PlainCard = {
  value: string
}

export default class Card {
  constructor({
    value,
  }: PlainCard) {
    this.value = value
  }

  value: string
}
