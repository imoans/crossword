// @flow

import type { Card } from './card.js'
import type { Player } from './player.js'
import Game from './game.js'
import GameForClient from './game-for-client'
import OtherPlayer from './other-player'

export default class GameService {
  constructor(game: ?Game) {
    this.game = game || new Game()
  }

  getGameForClientByPlayerId(id: string): GameForClient {
    const otherPlayers = this.game.players
      .filter(player => player.id !== id)
      .map(player => new OtherPlayer({
        id: player.id,
        name: player.name,
        numberOfHands: player.hands.length
      }))

    return new GameForClient({
      you: this.game.getPlayer(id),
      otherPlayers,
      field: this.game.field,
      progress: this.game.progress,
      playerIdsByOrder: this.game.playerIdsByOrder,
    })
  }

  setOrder(): Game {
    if (this.game.getNumberOfPlayers() === 0) return this.game

    // TODO To randomize
    const playerIdsByOrder = {}
    this.game.players.forEach((player, i) => {
      playerIdsByOrder[i + 1] = player.id
    })

    return new Game({
      ...this.game,
      playerIdsByOrder,
    })
  }

  mergeGameForClient(gameForClient: GameForClient): Game {
    return new Game({
      ...this.game.updatePlayer(gameForClient.you),
      field: gameForClient.field,
      progress: gameForClient.progress,
      playerIdsByOrder: gameForClient.playerIdsByOrder,
    })
  }

  goToNextTurn(): Game {
    const progress = this.game.progress.goToNextTurn()
    return new Game({ ...this.game, progress })
  }

  dealHands(): Game {
    const playerIds = this.game.getPlayerIds()
    const handByPlayerId = this.game.field.dealHands(playerIds)

    return this.game.dealHands(handByPlayerId)
  }

  putCard(card: Card, point: Point, word: string): Game {
    const field = this.game.field.putCard(card, point, word)
    return new Game({ ...this.game, field })
  }

  confirmPutCard(card: Card, point: Point, isWordValid: boolean, playerId: string): Game {
    const field = this.game.field.confirmPutCard(card, point, isWordValid)
    if (field == null) return this.goToNextTurn()

    const player = this.game.getPlayer(playerId).addHand(card)
    return new Game({
      ...this.game.updatePlayer(player),
      field
    })
  }

  putFirstCard(point: Point): Game {
    const card = this.game.field.pickCardToDraw()
    const field = this.game.field.putFirstCard(card, point)
    return new Game({ ...this.game, field })
  }

  drawCard(playerId: string): Game {
    const card = this.game.field.pickCardToDraw()

    let newPlayer
    const players = this.game.players.map(player => {
      if (player.id === playerId) {
        newPlayer = player.addHand(card)
      }
    })
    if (newPlayer == null) {
      throw new Error('Player with specified id does not exist')
    }

    return new Game({ ...this.game, players })
  }

  startGame(): Game {
    const progress = this.game.progress.start()
    return new Game({ ...this.game, progress })
  }

  pauseGame(): Game {
    const progress = this.game.progress.pause()
    return new Game({ ...this.game, progress })
  }

  join(player: Player): Game {
    const players = this.game.players.concat(player)
    return new Game({ ...this.game, players })
  }
}
