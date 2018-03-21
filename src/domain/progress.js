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
    this.turn = turn || 0
    this.isInProgress = isInProgress || false
  }
  turn: number
  isInProgress: boolean

  goToNextTurn(): Progress {
    return new Progress({
      ...this,
      turn: this.turn + 1
    })

  }

  start(): Progress {
    return new Progress({
      ...this,
      turn: 1,
      isInProgress: true,
    })
  }

  pause(): Progress {
    return new Progress({
      ...this,
      isInProgress: false,
    })
  }
}
