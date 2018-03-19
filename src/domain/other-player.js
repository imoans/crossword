// @flow

export type PlainOtherPlayer = {
  numberOfHands?: number,
  name: string,
  id: string,
}

export default class OtherPlayer {
  constructor({
    numberOfHands,
    name,
    id,
  }: PlainPlayer) {
    this.numberOfHands = numberOfHands || 0
    this.name = name
    this.id = id
  }
  numberOfHands: number
  name: string
  id: ?string

  addHand(): OtherPlayer {
    return new Player({
      ...this,
      numberOfHands: this.numberOfHands + 1,
    })
  }
}
