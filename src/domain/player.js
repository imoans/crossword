// @flow

import type { Card } from './card.js'
export type PlainPlayer = {
  hands?: Array<PlainCard>,
  name: string,
  id?: string,
}

export default class Player {
  constructor({
    hands,
    name,
    id,
  }: PlainPlayer = {}) {
    this.hands = hands || []
    this.name = name || 'dummy'
    this.id = id
  }
  hands: Array<Card>
  name: string
  id: ?string

  addHands(cards: Array<Card>): Player {
    return new Player({
      ...this,
      hands: this.hands.concat(cards),
    })
  }

  putHand(card: Card): Player {
    return new Player({
      ...this,
      hands: this.hands.filter(hand => hand.id !== card.id),
    })
  }
}
