// @flow

export type PlainOtherPlayer = {
  numberOfHands?: number,
  name: string
}

export default class OtherPlayer {
  constructor({
    numberOfHands,
    name
  }: PlainPlayer) {
    this.numberOfHands = numberOfHands || 0
    this.name = name
  }
  numberOfHands: number
  name: string

  addHand(): OtherPlayer {
    return new Player({
      ...this,
      numberOfHands: this.numberOfHands + 1,
    })
  }
}
