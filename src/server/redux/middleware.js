// @flow

import type { State } from './state'
import domainActions from '../../domain/redux/server/actions'
import actions from './actions'
import socket from '../../index'

type Next = (action) => State

const createMiddleware = () => (store) => (next: Next) => {
  const getPlayerByClientId = () => {
    return store.getState().server.playerByClientId
  }

  const getGameForServer = () => {
    return store.getState().domain.game
  }

  const emitGameToClient = () => {
    const gameForServer = getGameForServer()

    Object.keys(getPlayerByClientId()).forEach(id => {
      const service = new GameService(gameForServer)
      const gameForClient = service.getGameForClientByPlayerId(id)
      socket.emitGame(id, gameForClient)
    })
  }

  return (action) => {
    if (action.type !== 'setState' || action.type !== 'setPlayerIds') {
      emitGameToClient()
    }

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
