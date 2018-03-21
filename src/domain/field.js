// @flow

import fetch from 'isomorphic-fetch'
import Card from './card'

type Point = {
  x: number,
  y: number,
}
type CardsArrangement = { [cardId: string]: Point }
type CardsMap = { [cardId: string]: Card }

export type PlainField = {
  cardsArrangement?: CardsArrangement,
  cardsMap?: CardsMap,
  temporaryCardsArrangament?: CardsArrangement,
}

export default class Field {
  constructor({
    cardsArrangement,
    cardsMap,
    temporaryCardsArrangament,
  }: PlainField = {}) {
    this.cardsArrangement = cardsArrangement || {}
    this.cardsMap = cardsMap || {}
    this.temporaryCardsArrangament = temporaryCardsArrangament || {}
  }
  cardsArrangement: CardsArrangement
  cardsMap: CardsMap
  temporaryCardsArrangament: CardsArrangement

  getCardByPoint(point: Point): ?Card {
    const cardsArrangement = {
      ...this.cardsArrangement,
      ...this.temporaryCardsArrangament,
    }

    const id = Object.keys(cardsArrangement).find(id => {
      const cardPoint = cardsArrangement[id]
      return cardPoint.x === point.x && cardPoint.y === point.y
    })
    if (id == null) return null
    return this.cardsMap[id]
  }

  confirmPuttingCard(): Field {
    const cardsArrangement = {
      ...this.temporaryCardsArrangament,
      ...this.cardsArrangement,
    }

    return new Field({
      ...this,
      cardsArrangement,
      temporaryCardsArrangament: {},
    })
  }

  getTemporaryCards(): Array<Card> {
    return Object.keys(this.temporaryCardsArrangament).map(id => this.cardsMap[id])
  }

  cancelPuttingCard(): Field {
    const temporaryCardsArrangament = { ...this.temporaryCardsArrangament }
    const cardsMap = { ...this.cardsMap }

    Object.keys(this.temporaryCardsArrangament).forEach(id => {
      delete cardsMap[id]
    })

    return new Field({
      ...this,
      temporaryCardsArrangament: {},
      cardsMap
    })
  }

  putCard(card: Card, point: Point): Field {
    if (!this.isValidPointToPut(point)) return this
    const temporaryCardsArrangament = {
      ...this.temporaryCardsArrangament,
      [card.id]: point,
    }
    const cardsMap = Object.assign({}, this.cardsMap, { [card.id]: card })

    return new Field({
      ...this,
      temporaryCardsArrangament,
      cardsMap
    })
  }

  putFirstCard(card: Card, point: Point): Field {
    const cardsArrangement = Object.assign({}, this.cardsArrangement, { [card.id]: point })
    const cardsMap = Object.assign({}, this.cardsMap, { [card.id]: card })

    return new Field({
      ...this,
      cardsArrangement,
      cardsMap
    })
  }

  isValidPointToPut(point: Point): boolean {
    const { x, y } = point
    const right = { x: x + 1, y }
    const left = { x: x - 1, y }
    const up = { x, y: y + 1 }
    const down = { x, y: y - 1 }
    return [right, left, up, down].some(point => this.getCardByPoint(point) != null)
  }
}
