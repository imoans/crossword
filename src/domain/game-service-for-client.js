// @flow

import type { Card } from './card.js'
import type { Player } from './player.js'
import GameForClient from './game-for-client'

export default class GameServiceForClient {
  constructor(game: ?GameForClient) {
    this.game = game || new GameForClient()
  }

  addPlayerByName(playerName: string): GameForClient {
    const you = new Player({ name: playerName })
    return new GameForClient({
      ...this.game,
      you,
    })
  }

  addOtherPlayerByName(otherPlayerName: string): GameForClient {
    const otherPlayer = new OtherPlayer({ name: otherPlayerName })
    return new GameForClient({
      ...this.game,
      otherPlayerName: this.game.otherPlayerName.concat(otherPlayer),
    })
  }

  startGame(pointToPutFirstCard: Point): GameForClient {
    const progress = this.game.progress.start()
    const gameSetFirstCard = this.putFirstCard(pointToPutFirstCard)

    return new GameForClient({ ...this.gameSetFirstCard, progress })
  }

  putCard(card: Card, point: Point): GameForClient {
    return this.game.putCard(card, point)
  }
}
