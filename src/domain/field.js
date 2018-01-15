// @flow

type Point = {
  x: number,
  y: number,
}
type CardsArrangement = { [cardId: string]: Point }
type cardsMap = { [cardId: string]: Card }

export type PlainField = {
  cardsArrangement?: CardsArrangement,
  cardsMap?: cardsMap
}

export default class Field {
  constructor({
    cardsArrangement,
    cardsMap
  }: PlainField) {
    this.cardsArrangement = cardsArrangement || {}
  }
  cardsArrangement: CardsArrangement

  validateWord(word: string): boolean {
    // TODO
    return true
  }

  putCard(card: Card, point: Point, word: string): Field {
    if (!validateWord(word)) {
      throw new Error('This card can not put here')
    }

    const cardsArrangement = Object.assign({}, this.cardsArrangement, { card.id: point })
    const cardsMap = Object.assign({}, this.cardsMap, { card.id: card })

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
