// @flow

import type { Card } from './card.js'
import type { Player } from './player.js'
import GameForClient from './game-for-client'

export default class GameServiceForClient {
  constructor(game: ?GameForClient) {
    this.game = game || new GameForClient()
  }

  putCard(card: Card, point: Point, word: string): GameForClient {
    return this.game.putCard(card, point, word)
  }

  putFirstCard(point: Point): GameForClient {
    const card = this.game.field.pickCardToDraw()
    const field = this.game.field.putFirstCard(card, point)
    return new GameForClient({ ...this.game, field })
  }

  // TODO other player
  // TODO どこがhandの数知ってるのがいい?
  drawCard(): GameForClient {
    const card = this.game.field.pickCardToDraw()
    const you = this.game.you.addHand([card])
    return new GameForClient({ ...this.game, you })
  }
}
