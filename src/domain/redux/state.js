// @flow

import GameForClient from '../game-for-client'

export type PlainState = {
  game: ?GameForClient
}

export default class State {
  game: ?Game

  constructor(plain: PlainState = {}) {
    this.game = plain.game || new GameForClient()
  }

  set(params: PlainState): State {
    if (params == null) {
      return this
    }

    const props = { ...this, ...params }
    return new State(props)
  }
}
