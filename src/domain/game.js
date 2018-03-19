// @flow

import type { Player } from './player'
import Card from './card'
import Progress, { PlainProgress } from './progress'
import Field, { PlainField } from './field'
import { range, shuffle } from '../util/array'

export type PlayerIdsByOrder = { [order: number]: string }

const VALUES_OF_CARDS = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'
const NUMBER_OF_INITIAL_HANDS = 5

type PlainGame = {
  playerIdsByOrder: PlayerIdsByOrder,
  players: Array<Player>,
  progress?: Progress,
  field?: Field,
  deck?: Array<Card>,
}

export default class Game {
  constructor({
    playerIdsByOrder,
    players,
    progress,
    field,
    deck,
  }: PlainGame = {}) {
    this.players = players || []
    this.progress = progress || new Progress()
    this.field = field || new Field()
    this.playerIdsByOrder = playerIdsByOrder
    this.deck = deck || []
  }
  playerIdsByOrder: PlayerIdsByOrder
  players: Array<Players>
  progress: Progress
  field: Field
  deck: Array<Card>

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

  isDrawableCard(): boolean {
    return this.deck.length > 0
  }

  setDeck(): Game {
    if (this.isDrawableCard()) return this
    const deck = shuffle(VALUES_OF_CARDS.split('').map(value => new Card({ value })))
    return new Game({ ...this, deck })
  }

  dealHands(): Game {
    if (!this.isDrawableCard()) return this
    const deck = this.deck.slice()
    const players = this.players.map(player => {
      return player.addHands(deck.splice(0, NUMBER_OF_INITIAL_HANDS))
    })

    return new Game({ ...this, players, deck })
  }

  putFirstCard(point: Point): Game {
    const deck = this.deck.slice()
    const card = deck.splice(0, 1)[0]
    const field = this.field.putFirstCard(card, point)
    return new Game({ ...this, field, deck })
  }

  drawCard(playerId: string): Game {
    if (!this.isDrawableCard()) return this

    const deck = this.deck.slice()

    const players = this.game.players.map(player => {
      if (player.id === playerId) {
        return player.addHands(deck.splice(0, 1))
      } else return player
    })

    return new Game({ ...this, players, deck })
  }

  getPlayerIds(): Array<string> {
    return this.players.map(player => player.id)
  }

  getAllHands(): Array<Card> {
    return this.players
      .map(player => this.getHands(player.id))
      .reduce((hands, current) => hands.concat(current))
  }

  getHands(playerId: string): Array<Card> {
    const player = this.players.find(player => player.id === playerId)
    return player.hands
  }
}
