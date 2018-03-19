// @flow

import type { State } from './state'

const ActionTypes = {
  startGame: 'startGame',
  putCard: 'putCard',
  setState: 'setState',
}

export type ActionTypeNames = $Key<typeof ActionTypes>

export interface Action {
  type: ActionTypeNames,
  payload?: Objct,
}

const actionCreators = {
  updateGame(game: Game): Action {
    return { type: 'updateGame', payload: { game } }
  },

  setState(state: State) {
    return { type: 'setState', payload: { state } }
  }
}

export default actionCreators
