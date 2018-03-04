// @flow

import Player, { PlainPlayer } from './player'
import OtherPlayer, { PlainOtherPlayer } from './other-player'
import type { Card, PlainCard } from './card'
import type { PlayerIdsByOrder } from './game'

import Progress, { PlainProgress } from './progress'
import Field, { PlainField } from './field'

type PlainGameForClient = {
  playerIdsByOrder: PlayerIdsByOrder,
  you?: Player | PlainPlayer,
  otherPlayers?: Array<OtherPlayer> | Array<PlainOtherPlayer>,
  progress?: Progress | PlainProgress,
  field?: Field | PlainField,
}

export default class Game {
  constructor({
    playerIdsByOrder,
    you,
    otherPlayers,
    progress,
    field
  }: PlainGame = {}) {
    this.you = this.initializeYou(you)
    this.otherPlayers = this.initializeOtherPlayers(otherPlayers)
    this.progress = this.initializeProgress(progress)
    this.field = this.initializeField(field)
    this.playerIdsByOrder = playerIdsByOrder || this.initializePlayerIdsByOrder()
  }
  playerIdsByOrder: PlayerIdsByOrder
  you: Player
  otherPlayers: Array<OtherPlayer>
  progress: Progress
  field: Field

  initializeYou(you: null | Player | PlainPlayer): Player {
    if (you == null) {
      return new Player({ name: 'dummy' })
    } else if (you instanceof Player) {
      return you
    } else {
      return new Player(you)
    }
  }

  initializeOtherPlayers(otherPlayers: null | Array<OtherPlayer> | Array<PlainOtherPlayer>): Array<OtherPlayer> {
    if (otherPlayers == null) {
      return []
    } else if (otherPlayers[0] instanceof OtherPlayer) {
      return otherPlayers
    } else {
      return otherPlayers.map(player => new OtherPlayer(player))
    }
  }

  initializeProgress(progress: null | Progress | PlainProgress): Progress {
    if (progress == null) {
      return new Progress()
    } else if (progress instanceof Progress) {
      return progress
    } else {
      return new Progress(progress)
    }
  }

  initializeField(field: null | Field | PlainField): Field {
    if (field == null) {
      return new Field()
    } else if (field instanceof Field) {
      return field
    } else {
      return new Field(field)
    }
  }

  initializePlayerIdsByOrder(): PlayerIdsByOrder {
    // TODO To randomize
    const playerIdsByOrder = {}
    const players = [...this.otherPlayers, this.you]
    players.forEach((player, i) => {
      playerIdsByOrder[i + 1] = player.name
    })

    return playerIdsByOrder
  }

  getPlayerNameOnTurn(): string {
    const { turn } = this.progress
    const order = turn % this.getNumberOfPlayers() + 1

    return this.playerIdsByOrder[order]
  }

  getNumberOfPlayers(): number {
    return this.otherPlayers.length + 1
  }

  getPlayersName(): Array<string> {
    const otherPlayerNames = this.otherPlayers.map(player => player.name)
    return [ this.you.name, ...otherPlayerNames ]
  }

  // TODO other players
  putCard(card: Card, point: Point, word: string): Game {
    const field = this.field.putCard(card, point, word)
    const you = this.you.putHand(card)

    return new Game({ ...this, you, field })
  }

  dealHands(yourHands: Array<Card>): Game {
    const you = this.you.addHands(yourHands)
    const otherPlayers = this.otherPlayers.map(
      player => player.addHand(yourHands.length)
    )
    return new Game({ ...this, you, otherPlayers })
  }

  getYourHands(): Array<Card> {
    return this.you.hands
  }
}
