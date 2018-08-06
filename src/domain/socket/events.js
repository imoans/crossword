// @flow

export const DOMAIN_EVENTS = Object.freeze({
  updateGame: 'updateGame',
  failedToPutCard: 'failedToPutCard',
  startGame: 'startGame',
  addPlayer: 'addPlayer',
  putCard: 'putCard',
  skipTurn: 'skipTurn',
  cancelPuttingCard: 'cancelPuttingCard',
  confirmPutCard: 'confirmPutCard',
})

export const NETWORK_EVENTS = Object.freeze({
  disconnect: 'disconnect',
})
