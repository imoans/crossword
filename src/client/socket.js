// @flow

import io from 'socket.io-client'
import GameForClient, { type PlainGameForClient } from '../domain/game-for-client'
import type { Point } from '../domain/point'
import type { Card } from '../domain/card'
import store from './redux/store'
import domainActions from '../domain/redux/client/actions'

const SOCKET_SERVER_URL = 'http://localhost:8000'

class Socket {
  constructor(url: string) {
    this.server = io.connect(url)
  }

  server: any

  registerEvent() {
    this.server.on('updateGame', this.updateGame)
    this.server.on('failedToPutCard', this.failedToPutCard)
    this.server.on('disconnect', this.failedToPutCard)
  }

  addPlayer(playerName: string) {
    this.server.emit('addPlayer', playerName)
  }

  startGame(pointToPutFirstCard: Point) {
    this.server.emit('startGame', pointToPutFirstCard)
  }

  putCard({ card: Card, point: Point }) {
    this.server.emit('putCard', { card, point })
  }

  skipTurn() {
    this.server.emit('skipTurn')
  }

  cancelPutting() {
    this.server.emit('cancelPutting')
  }

  confirmPutCard(word: string) {
    this.server.emit('confirmPutCard', word)
  }

  updateGame(plainGameForClient: PlainGameForClient) {
    const game = new GameForClient(plainGameForClient)
    store.dispatch(domainActions.updateGame(game))
  }

  failedToPutCard(word: string) {
    store.dispatch(actions.setInfo(`${word} is invalid!`))
  }

  disconnect(playerName: string) {
    store.dispatch(actions.setInfo(`${playerName} disconnect`))
  }
}

export default new Socket(SOCKET_SERVER_URL)
