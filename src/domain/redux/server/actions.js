// @flow

import type { DomainState } from './state'

export const ActionTypes = {
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
  },

  startGame(pointToPutFirstCard: Point) {
    return (dispatch, getState) => {
      const game = getState().domain.game
      const gameIsStarted = new GameService(game).startGame()
      const gameSetOrder = new GameService(gameIsStarted).setOrder()
      const gameSetDeck = gameSetOrder.setDeck()
      const gameDealtHands = gameSetDeck.dealHands()
      const gameSetFirstCard = new GameService(gameDealtHands).putFirstCard(pointToPutFirstCard)

      dispatch(domainActions.updateGame(gameSetFirstCard))
    }
  },

  skipTurn(playerId: string) {
    return (dispatch, getState) => {
      const game = getState().domain.game
      const gameCancelPuttingCards = new GameService(game).cancelPuttingCard(playerId)
      const newGame = gameCancelPuttingCards.drawCard(playerId).goToNextTurn()
      dispatch(domainActions.updateGame(newGame))
    }
  },

  confirmPutCard(isWordValid, playerId) {
    return (dispatch, getState) => {
      const service = new GameService(getState().domain.game)
      const game = service.confirmPutCard(isWordValid, playerId)

      dispatch(domainActions.updateGame(newGame))
    }
  },

  putCard(card: Card, point: Point, playerId: string) {
    return (dispatch, getState) => {
      const service = new GameService(getState().domain.game)
      const newGame = service.putCard(card, point, playerId)

      dispatch(domainActions.updateGame(newGame))
    }
  },

  disconnect(): () =>  void {
    return (dispatch, getState) => {
      const gameNotInProgress = new GameService(game).pauseGame()
      dispatch(domainActions.updateGame(newGame))
    }
  },

  deletePlayer(playerId: string) {
    return (dispatch, getState) => {
      const game = getState().domain.game.deletePlayer(id)
      dispatch(domainActions.updateGame(game))
    }
  },

  addPlayer(player: plainPlayer | Player) {
    return (dispatch, getState) => {
      // TODO plain player
      const game = new GameService(getState().domain.game).join(player)
      dispatch(domainActions.updateGame(game))
    }
  },
}

export default domainActions
