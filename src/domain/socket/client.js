// @flow

import { DOMAIN_EVENTS, NETWORK_EVENTS } from 'events'
import GameForClient, { type PlainGameForClient } from '../game-for-client'
import type { Point } from '../point'
import type { Card } from '../card'
import domainActions from '../redux/client/actions'

type Params = {
  url: string,
  io: any,
  dispacth: any,
}

class Socket {
  constructor(params: Params) {
    this.server = io.connect(params.url)
    this.dispacth = params.dispacth
  }

  server: any

  registerEvent() {
    this.server.on(DOMAIN_EVENTS.updateGame, this.updateGame)
    this.server.on(DOMAIN_EVENTS.failedToPutCard, this.failedToPutCard)
    this.server.on(NETWORK_EVENTS.disconnect, this.disconnect)
  }

  addPlayer(playerName: string) {
    this.server.emit(DOMAIN_EVENTS.addPlayer, playerName)
  }

  startGame(pointToPutFirstCard: Point) {
    this.server.emit(DOMAIN_EVENTS.startGame, pointToPutFirstCard)
  }

  putCard({ card: Card, point: Point }) {
    this.server.emit(DOMAIN_EVENTS.putCard, { card, point })
  }

  skipTurn() {
    this.server.emit(DOMAIN_EVENTS.skipTurn)
  }

  cancelPutting() {
    this.server.emit(DOMAIN_EVENTS.cancelPutting)
  }

  confirmPutCard(word: string) {
    this.server.emit(DOMAIN_EVENTS.confirmPutCard, word)
  }

  updateGame(plainGameForClient) {
    const game = new GameForClient(plainGameForClient)
    this.dispatch(domainActions.updateGame(game))
  }

  failedToPutCard(handler) {
    handler()
  }

  disconnect(handler) {
    handler()
  }
}
