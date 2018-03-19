// @flow

import fetch from 'isomorphic-fetch'
import Card from './card'

const NUMBER_OF_INITIAL_HANDS = 5

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
  cardsMap: CardsMap

  getCardByPoint(point: Point): ?Card {
    const id = Object.keys(this.cardsArrangement).find(id => {
      const cardPoint = this.cardsArrangement[id]
      return cardPoint.x === point.x && cardPoint.y === point.y
    })
    if (id == null) return null
    return this.cardsMap[id]
  }

  dealHands(playerIds: Array<string>): { [playerId: string]: Array<Card>} {
    const handByPlayerId = {}
    playerIds.forEach(id => {
      const hand = []
      for (let i = 1; i <= NUMBER_OF_INITIAL_HANDS; i++) {
        hand.push(this.pickCardToDraw())
      }
      handByPlayerId[id] = hand
    })

    return handByPlayerId
  }

  confirmPutCard(card: Card, point: Point, isWordValid: boolean): ?Field {
    if (isWordValid) return null

    const cardsArrangement = { ...this.cardsArrangement }
    const cardsMap = { ...this.cardsMap }
    delete cardsArrangement[card.id]
    delete cardsMap[card.id]

    return new Field({
      cardsArrangement,
      cardsMap
    })
  }

  putCard(card: Card, point: Point): Field {
    const cardsArrangement = Object.assign({}, this.cardsArrangement, { [card.id]: point })
    const cardsMap = Object.assign({}, this.cardsMap, { [card.id]: card })

    return new Field({
      cardsArrangement,
      cardsMap
    })
  }

  putFirstCard(card: Card, point: Point): Field {
    const cardsArrangement = Object.assign({}, this.cardsArrangement, { [card.id]: point })
    const cardsMap = Object.assign({}, this.cardsMap, { [card.id]: card })

    return new Field({
      cardsArrangement,
      cardsMap
    })
  }

  pickCardToDraw(): Card {
    const seed = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'
    const value = seed[Math.floor(Math.random() * seed.length)] // TODO
    return new Card({ value })
  }
}
