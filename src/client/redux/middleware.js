// @flow

import type { State } from './state'
import domainActions from '../../domain/redux/server/actions'
import actions from './actions'
import socket from '../../index'

type Next = (action) => State

const createMiddleware = () => (store) => (next: Next) => {
  return (action) => {
    // TODO
    if (action.type === 'disconnect') {}

    if (action.type === 'addPlayer') {
      store.dispatch(actions.addPlayer(action.payload))
    }

    if (action.type === 'deletePlayer') {
      store.dispatch(actions.deletePlayer(action.payload))
    }
  }
}
