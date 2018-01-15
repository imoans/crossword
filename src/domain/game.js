// @flow

import type { Player } from './player.js'
import Progress, { PlainProgress } from './progress'
import Field, { PlainField } from './field'

type PlainGame = {
    players: Array<string>,
    progress?: PlainProgress,
    field?: PlainField,
}

export default class Game {
  constructor({
    players,
    progress,
    field
  }: PlainGame) {
    this.players = players
    this.progress = new Progress(progress)
    this.field = new Field(field)
  }
  players: Array<string>
  progress: Progress
  field: Field
}
