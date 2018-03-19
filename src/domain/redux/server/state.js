// @flow

import Game from '../../game'

export type PlainDomainState = {
  game: ?Game
}

export default class DomainState {
  game: ?Game

  constructor(plain: PlainDomainState = {}) {
    this.game = plain.game || new Game()
  }

  set(params: PlainDomainState): DomainState {
    if (params == null) return this

    return new DomainState({
      ...this,
      ...params,
    })
  }
}
