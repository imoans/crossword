// @flow

export type PlainProgress = {
  turn?: number,

}

export default class Progress {
  constructor({
    turn,
  }) {
    this.turn = turn || 1
  }
}
