// @flow

import type { Player } from './player'
import type { Card } from './card'

import Progress, { PlainProgress } from './progress'
import Field, { PlainField } from './field'

type PlainGame = {
  players: Array<Players>,
  progress?: Progress,
  field?: Field,
}

export default class Game {
  constructor({
    players,
    progress,
    field
  }: PlainGame) {
    this.players = players
    this.progress = progress || new Progress()
    this.field = field || new Field()
  }
  players: Array<Players>
  progress: Progress
  field: Field

  getPlayersName(): Array<string> {
    return this.players.map(player => player.name)
  }

  dealHands(handByPlayerId: {[id: string]: Array<Card>}): Game {
    const players = this.players.map(
      player => player.addHand(handByPlayerId[player.name])
    )
    return new Game({ ...this, players })
  }

  getHands(playerId: string): Array<Card> {
    const player = this.players.filter(player => player.name === playerId)
    return player.hands
  }
}
