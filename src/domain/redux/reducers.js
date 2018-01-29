// @flow

import type { Action } from './actions'
import State from './state'
import GameService from '../game-service'

const initialState = new State()

export default function reducer(
  state: State = initialState,
  action: Action
): State {

  const { type, payload } = action

  switch (type) {
    case 'updateGame': {
      const { game } = payload
      return state.set({ game })
    }
    default:
      return state
  }
}
