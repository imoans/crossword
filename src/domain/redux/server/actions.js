// @flow

import type { DomainState } from './state'

const ActionTypes = {
  updateGame: 'updateGame',
  setState: 'setState',
}

export type ActionTypeNames = $Key<typeof ActionTypes>

export interface Action {
  type: ActionTypeNames,
  payload?: Objct,
}

const domainActions = {
  updateGame(game: Game): Action {
    return { type: 'updateGame', payload: { game } }
  },

  setState(state: DomainState) {
    return { type: 'setState', payload: { state } }
  }
}

export default domainActions
