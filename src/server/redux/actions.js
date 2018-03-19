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

const ActionTypes = {
  setState: 'setState',
}

export type ActionTypeNames = $Key<typeof ActionTypes>

export interface Action {
  type: ActionTypeNames,
  payload?: Objct,
}

const emitGameToClient = (
  playerByClientId,
  gameForServer: Game,
): void => {
  Object.keys(playerByClientId).forEach(id => {
    const service = new GameService(gameForServer)
    const gameForClient = service.getGameForClientByPlayerId(id)
    io.to(id).emit('updateGame', gameForClient)
  })
}

const actions = {
  updateGame(plainGameForClient): void {
    return (dispatch, getState) => {
      const gameForClient = new GameForClient(plainGameForClient)
      const service = new GameService(getState().domain.game)
      const game = service.mergeGameForClient(gameForClient)

      dispatch(domainActions.updateGame(game))
      emitGameToClient(getState().server.playerByClientId, game)
    }
  },

  startGame(pointToPutFirstCard: Point): void {
    return (dispatch, getState) => {
      const game = getState().domain.game
      const gameIsStarted = new GameService(game).startGame()
      const gameSetOrder = new GameService(gameIsStarted).setOrder()

      const gameDealtHands = new GameService(gameSetOrder).dealHands()
      const gameSetFirstCard = new GameService(gameDealtHands).putFirstCard(pointToPutFirstCard)

      dispatch(domainActions.updateGame(gameSetFirstCard))
      emitGameToClient(getState().server.playerByClientId, gameSetFirstCard)
    }
  },

  disconnect(clientId: string): void {
    return (dispatch, getState) => {
      const playerByClientId = { ...getState().server.playerByClientId }
      const id = playerByClientId[clientId]
      const deletedPlayer = getState().domain.game.getPlayer(id)
      const game = getState().domain.game.deletePlayer(id)

      delete playerByClientId[clientId]
      dispatch(actions.setPlayerIds(playerByClientId))

      // TODO
      const gameNotInProgress = new GameService(game).pauseGame()
      dispatch(domainActions.updateGame(gameNotInProgress))
      emitGameToClient(playerByClientId, gameNotInProgress)
      io.emit('disconnect', deletedPlayer.name)
    }
  },

  confirmPutCard({ word, clientId, card, point }): void {
    return (dispatch, getState) => {
      const service = new GameService(getState().domain.game)
      const playerByClientId = getState().server.playerByClientId
      const id = playerByClientId[clientId]
      const game = service.confirmPutCard(card, point, word, id)

      emitGameToClient(playerByClientId, game)
    }
  },

  deletePlayer(clientId: string): void {
    return (dispatch, getState) => {
      const playerByClientId = { ...getState().server.playerByClientId }
      const id = playerByClientId[clientId]
      const game = getState().domain.game.deletePlayer(id)

      delete playerByClientId[clientId]
      dispatch(actions.setPlayerIds(playerByClientId))
      dispatch(domainActions.updateGame(game))
      emitGameToClient(playerByClientId, game)
    }
  },

  addPlayer(playerName: string, clientId: string) {
    return (dispatch, getState) => {
      const playerByClientId = getState().server.playerByClientId

      const player = new Player({
        id: clientId,
        name: playerName,
      })

      const newPlayerByClientId = {
        ...playerByClientId,
        [clientId]: clientId,
      }

      const game = new GameService(getState().domain.game).join(player)
      dispatch(domainActions.updateGame(game))
      dispatch(actions.setPlayerIds(newPlayerByClientId))
      emitGameToClient(newPlayerByClientId, game)
    }
  },

  setPlayerIds(playerByClientId: PlayerByClientId) {
    return { type: 'setPlayerIds', payload: { playerByClientId } }
  },

  setState(state: State) {
    return { type: 'setState', payload: { state } }
  },
}

export default actions
