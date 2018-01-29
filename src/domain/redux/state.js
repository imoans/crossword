// @flow

import type { Game } from '../game'

export type PlainState = {
  game: ?Game
}

export default class State {
  game: ?Game

  constructor(plain: PlainState = {}) {
    this.game = plain.game || {}
  }

  set(params: PlainState): State {
    if (params == null) {
      return this
    }

    const props = { ...this, ...params }
    return new State(props)
  }
}
