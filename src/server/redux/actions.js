// @flow

import type { State, PlayerByClientId } from './state'
import io from '../index'
import Player from '../../domain/player'
import type { Point } from '../../domain/field'
import type { Card } from '../../domain/card'
import GameForClient from '../../domain/game-for-client'
import Game from '../../domain/game'
import domainActions from '../../domain/redux/server/actions'
import GameService from '../../domain/game-service'
import isWordExisted from '../util/is-word-existed'

const ActionTypes = {
  setState: 'setState',
  setPlayerIds: 'setPlayerIds',
}

export type ActionTypeNames = $Key<typeof ActionTypes>

export interface Action {
  type: ActionTypeNames,
  payload?: Objct,
}

const actions = {
  addPlayer(player: Player): void {
    return (dispatch, getState) => {
      // TODO clientIdどうする?
      const playerByClientId = { ...getState().server.playerByClientId }
      dispatch(setPlayerIds(playerByClientId))
    }
  },

  deletePlayer(player: Player): void {
    return (dispatch, getState) => {
      const playerByClientId = { ...getState().server.playerByClientId }
      const clientId = Objct.keys(playerByClientId).find(id => playerByClientId[id] === player.id)
      delete playerByClientId[clientId]

      dispatch(setPlayerIds(playerByClientId))
    }
  },

  setPlayerIds(playerByClientId: PlayerByClientId): Action {
    return { type: 'setPlayerIds', payload: { playerByClientId } }
  },

  setState(state: State): Action {
    return { type: 'setState', payload: { state } }
  },
}

export default actions
