// @flow

import GameService from '../domain/game-service'
import GameForClient from '../domain/game-for-client'
import Game from '../domain/game'
import Player from '../domain/player'
import OtherPlayer from '../domain/other-player'
import store from './redux/store'
import actions from './redux/actions'
import http from 'http'

export default class IO {
  constructor(socket: any, port: number) {
    this.server = http.createServer()
    this.listen(port)

    this.io = socket.listen(this.server)
    this.io.on('connection', (client) => {
      this.client = client
      this.registerEvent()
    })
  }

  server: any
  io: any
  client: any

  listen(port: number) {
    if (this.server.listening) return
    this.server.listen(port)
  }

  registerEvent() {
    this.client.on('addPlayer', this.addPlayer)
    this.client.on('startGame', this.startGame)
    this.client.on('putCard', this.putCard)
    this.client.on('skipTurn', this.skipTurn)
    this.client.on('cancelPuttingCard', this.cancelPuttingCard)
    this.client.on('confirmPutCard', this.confirmPutCard)
    this.client.on('disconnect', this.disconnect)
  }

  emitGame(clientId: string, game: GameForClient) {
    this.io.to(clientId).emit('updateGame', gameForClient)
  }

  addPlayer(playerName: string) {
    store.dispatch(actions.addPlayer(playerName, this.client.id))
  }

  startGame(pointToPutFirstCard: Point) {
    store.dispatch(actions.startGame(pointToPutFirstCard))
  }

  putCard({ card, point }) {
    store.dispatch(actions.putCard(card, point, this.client.id))
  }

  skipTurn() {
    store.dispatch(actions.skipTurn(this.client.id))
  }

  cancelPuttingCard() {
    store.dispatch(actions.cancelPuttingCard(this.client.id))
  }

  async confirmPutCard(word: string) {
    await store.dispatch(actions.confirmPutCard(word, this.client.id))
  }

  disconnect() {
    store.dispatch(actions.disconnect(this.client.id))
  }
}
