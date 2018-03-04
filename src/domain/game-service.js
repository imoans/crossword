// @flow

import type { Card } from './card.js'
import type { Player } from './player.js'
import Game from './game.js'
import GameForClient from './game-for-client'

export default class GameService {
  constructor(game: ?Game) {
    this.game = game || new Game()
  }

  goToNextTurn(): Game {
    const progress = this.game.progress.goToNextTurn()

    return new Game({ ...this.game, progress })
  }

  dealHands(): Game {
    const playerIds = this.game.getPlayersName()
    const handByPlayerId = this.game.field.dealHands(playerIds)

    return this.game.dealHands(handByPlayerId)
  }

  putCard(card: Card, point: Point, word: string): Game {
    const field = this.game.field.putCard(card, point, word)
    return new Game({ ...this.game, field })
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

  join(player: Player): Game {
    const players = this.game.players.slice().add(player)
    return new Game({ ...this.game, players })
  }
}
