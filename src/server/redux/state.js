// @flow

import type { Player } from '../../domain/player'

type PlayerByClientId = {
  [clientId: string]: string,
}

export type PlainState = {
  playerByClientId: PlayerByClientId
}

export default class State {
  playerByClientId: PlayerByClientId

  constructor(plain: PlainState = {}) {
    this.playerByClientId = plain.playerByClientId || {}
  }

  setPlayerIds(playerByClientId: PlayerByClientId): State {
    return new State({
      ...this,
      playerByClientId: {
        ...this.playerByClientId,
        ...playerByClientId,
      }
    })
  }
}
