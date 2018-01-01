// @flow

import Progress, { PlainProgress } from './progress.js'
import Field, { PlainField } from './field.js'

type PlainGame = {
    players: Array<string>,
    progress?: PlainProgress,
    field?: PlainField,
}

export default class Game {
  constructor({
    players,
    progress,
  }: PlainGame) {
    this.players = players
    this.progress = new Progress(progress)
    this.field = new Field(field)
  }
  players: Array<string>
  progress: Progress
  field: Field
}
