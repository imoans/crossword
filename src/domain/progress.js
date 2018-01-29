// @flow

export type PlainProgress = {
  turn?: number,
  isInProgress?: boolean,
}

export default class Progress {
  constructor({
    turn,
    isInProgress
  }: PlainProgress = {}) {
    this.turn = turn || 1
    this.inInProgress = isInProgress || false
  }
  turn: number
  isInProgress: boolean

  start(): Progress {
    return new Progress({
      turn: this.turn,
      isInProgress: true,
    })
  }
}
