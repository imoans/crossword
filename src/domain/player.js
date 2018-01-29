// @flow

import type { Card } from './card.js'

export type PlainPlayer = {
  hands?: Array<PlainCard>,
  name: string
}

export default class Player {
  constructor({
    hands,
    name
  }: PlainPlayer) {
    this.hands = hands || []
    this.name = name
  }
  hands: Array<Card>
  name: string

  addHand(cards: Array<Card>): Player {
    return new Player({
      hands: [...this.hands, ...cards],
      name: this.name,
    })
  }
}
