// @flow

import type { Card } from './card.js'
import type { Player } from './player.js'
import Game from './game.js'

export default GameService {
  constructor(game: Game) {
    this.game = game
  }

  putCard(card: Card, point: Point, word: string): Game {
    const field = this.game.field.addCard(card, point, word)
    return new Game({ field })
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

    return new Game({ players })
  }

  startGame(): Game {
    const progress = this.game.progress.start()
    return new Game({ progress })
  }

  createNewGame(players: Array<Player>): Game {
    return new Game({ players })
  }

  join(player: Player): Game {
    const players = this.game.players.slice().add(player)
    return new Game({ players })
  }
}
