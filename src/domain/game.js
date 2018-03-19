// @flow

import type { Player } from './player'
import type { Card } from './card'

import Progress, { PlainProgress } from './progress'
import Field, { PlainField } from './field'

export type PlayerIdsByOrder = { [order: number]: string }

type PlainGame = {
  playerIdsByOrder: PlayerIdsByOrder,
  players: Array<Player>,
  progress?: Progress,
  field?: Field,
}

export default class Game {
  constructor({
    playerIdsByOrder,
    players,
    progress,
    field
  }: PlainGame = {}) {
    this.players = players || []
    this.progress = progress || new Progress()
    this.field = field || new Field()
    this.playerIdsByOrder = playerIdsByOrder
  }
  playerIdsByOrder: PlayerIdsByOrder
  players: Array<Players>
  progress: Progress
  field: Field

  getNumberOfPlayers(): number {
    return this.players.length
  }

  getPlayersName(): Array<string> {
    return this.players.map(player => player.name)
  }

  getPlayer(id: string): ?Player {
    return this.players.find(player => player.id === id)
  }

  updatePlayer(player: Player): Game {
    return new Game({
      ...this,
      players: this.players.filter(p => player.id !== p.id).concat(player)
    })
  }

  deletePlayer(id: string): Game {
    return new Game({
      ...this,
      players: this.players.filter(player => player !== id),
    })
  }

  dealHands(handByPlayerId: {[id: string]: Array<Card>}): Game {
    const players = this.players.map(player => {
      return player.addHand(handByPlayerId[player.id])
    })
    return new Game({ ...this, players })
  }

  getPlayerIds(): Array<string> {
    return this.players.map(player => player.id)
  }

  getHands(playerId: string): Array<Card> {
    const player = this.players.filter(player => player.id === playerId)
    return player.hands
  }
}
