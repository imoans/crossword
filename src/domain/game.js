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
    this.playerIdsByOrder = playerIdsByOrder || this.initializePlayerIdsByOrder()
  }
  playerIdsByOrder: PlayerIdsByOrder
  players: Array<Players>
  progress: Progress
  field: Field

  initializePlayerIdsByOrder(): PlayerIdsByOrder {
    // TODO To randomize
    const playerIdsByOrder = {}
    this.players.forEach((player, i) => {
      playerIdsByOrder[i + 1] = player.name
    })

    return playerIdsByOrder
  }

  getNumberOfPlayers(): number {
    return this.players.length
  }

  getPlayersName(): Array<string> {
    return this.players.map(player => player.name)
  }

  getPlayer(id: string): Player {
    return this.players.filter(player => player.name === id)[0]
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
