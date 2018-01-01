// @flow

import type { Card } from './card.js'

export type PlainPlayer = {
  hands: ?Array<PlainCard>
}

export default class Player {
  constructor({
    hands,
  }: PlainPlayer) {
    this.hands = hands || []
  }
  hands: Array<Card>
}
