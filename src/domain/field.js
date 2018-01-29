// @flow

import Card from './card'

const NUMBER_OF_HANDS = 5

type Point = {
  x: number,
  y: number,
}
type CardsArrangement = { [cardId: string]: Point }
type CardsMap = { [cardId: string]: Card }

export type PlainField = {
  cardsArrangement?: CardsArrangement,
  cardsMap?: CardsMap
}

export default class Field {
  constructor({
    cardsArrangement,
    cardsMap
  }: PlainField = {}) {
    this.cardsArrangement = cardsArrangement || {}
    this.cardsMap = cardsMap || {}
  }
  cardsArrangement: CardsArrangement

  validateWord(word: string): boolean {
    // TODO
    return true
  }

  dealHands(playerIds: Array<string>): { [playerId: string]: Array<Card>} {
    const handByPlayerId = {}
    playerIds.forEach(id => {
      const hand = []
      for (let i = 1; i <= NUMBER_OF_HANDS; i++) {
        hand.push(this.pickCardToDraw())
      }
      handByPlayerId[id] = hand
    })

    return handByPlayerId
  }

  putCard(card: Card, point: Point, word: string): Field {
    if (!validateWord(word)) {
      throw new Error('This card can not put here')
    }

    const cardsArrangement = Object.assign({}, this.cardsArrangement, { [card.id]: point })
    const cardsMap = Object.assign({}, this.cardsMap, { [card.id]: card })

    return new Field({
      cardsArrangement,
      cardsMap
    })
  }

  pickCardToDraw(): Card {
    const value = 'あ' // TODO
    return new Card({ value })
  }
}
