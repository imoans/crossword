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
      deckLength: this.game.deck.length,
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

  putCard(card: Card, point: Point): Game {
    const field = this.game.field.putCard(card, point)
    return new Game({ ...this.game, field })
  }

  confirmPutCard(isWordValid: boolean, playerId: string): Game {
    if (!isWordValid) {
      const game = this.game.drawCard(playerId).goToNextTurn()
      const field = game.field.cancelPuttingCard()
      return new Game ({
        ...game,
        field,
      })
    }

    const field = this.game.field.confirmPutCard()
    const player = this.game.getPlayer(playerId).addHands(card)
    return new Game({
      ...this.game.updatePlayer(player),
      field,
    })
  }

  putFirstCard(point: Point): Game {
    return this.game.putFirstCard(point)
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
