// @flow

import Player, { PlainPlayer } from './player'
import OtherPlayer, { PlainOtherPlayer } from './other-player'
import type { Card, PlainCard } from './card'
import type { PlayerIdsByOrder } from './game'

import Progress, { PlainProgress } from './progress'
import Field, { PlainField } from './field'

type PlainGameForClient = {
  playerIdsByOrder?: PlayerIdsByOrder,
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
    this.playerIdsByOrder = playerIdsByOrder || {}
  }
  playerIdsByOrder: PlayerIdsByOrder
  you: ?Player
  otherPlayers: Array<OtherPlayer>
  progress: Progress
  field: Field

  initializeYou(you: null | Player | PlainPlayer): ?Player {
    if (you == null) {
      return null
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

  isYourTurn(): boolean {
    return this.getPlayerOnTurn().id === this.you.id
  }

  getPlayerOnTurn(): Player | OtherPlayer {
    if (this.playerIdsByOrder.length === 0) return ''
    const { turn } = this.progress
    const numberOfPlayers = this.getNumberOfPlayers()
    const order = turn % numberOfPlayers === 0 ? numberOfPlayers : turn % numberOfPlayers

    return this.getPlayerById(this.playerIdsByOrder[order])
  }

  getNumberOfPlayers(): number {
    const numberOfOtherPlayers = this.otherPlayers.length
    if (this.you == null) return numberOfOtherPlayers
    return numberOfOtherPlayers + 1
  }

  getPlayersName(): Array<string> {
    const otherPlayerNames = this.otherPlayers.map(player => player.name)
    return [ this.you.name, ...otherPlayerNames ]
  }

  getPlayerIds(): Array<string> {
    const otherPlayerIds = this.otherPlayers.map(player => player.id)
    return [ this.you.id, ...otherPlayerIds ]
  }

  getPlayerById(id: string): Player | OtherPlayer {
    if (this.you.id === id) return this.you
    return this.otherPlayers.find(op => op.id === id)
  }

  getNumberOfHandsByPlayerId(id: string): number {
    const player = this.getPlayerById(id)
    if (player instanceof Player) return player.hands.length
    return player.numberOfHands
  }

  putCard(card: Card, point: Point): Game {
    const field = this.field.putCard(card, point)
    const you = this.you.putHand(card)

    return new Game({ ...this, you, field })
  }

  dealHands(yourHands: Array<Card>): Game {
    const you = this.you.addHand(yourHands)
    const otherPlayers = this.otherPlayers.map(
      player => player.addHand(yourHands.length)
    )
    return new Game({ ...this, you, otherPlayers })
  }

  isJoined(): boolean {
    return this.you != null
  }

  getYourHands(): Array<Card> {
    return this.you.hands
  }
}
