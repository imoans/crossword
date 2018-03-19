// @flow

import type { Action } from './actions'
import State from './state'

const initialState = new State()

export default function reducer(
  state: State = initialState,
  action: Action
): State {

  const { type, payload } = action

  switch (type) {
    case 'setPlayerIds': {
      const { playerByClientId } = payload
      return state.setPlayerIds(playerByClientId)
    }
    default:
      return state
  }
}
