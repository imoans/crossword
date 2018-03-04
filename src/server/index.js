import GameService from '../domain/game-service'
import GameForClient from '../domain/game-for-client'
import Game from '../domain/game'
import Player from '../domain/player'
import OtherPlayer from '../domain/other-player'

const server = require('http').createServer()
const io = require('socket.io').listen(server)

const userByClientId = {}

io.on('connection', (client) => {
  client.on('addUser', (userName) => {
    userByClientId[client.id] = userName
    io.emit('addUser', userName)
  })

  client.on('startGame', (plainPlayers) => {
    const players = plainPlayers.map(player => new Player(player))
    const game = new Game({ players })
    const gameService = new GameService(game)
    const newGame = gameService.startGame()

    const service = new GameService(newGame)
    const gameForServer = service.dealHands()

    Object.keys(userByClientId).forEach(id => {
      const yourName = userByClientId[id]
      const otherPlayers = gameForServer.players
      .filter(player => player.name !== yourName)
      .map(player => {
        const numberOfHands = player.hands.length
        const name = player.name
        return new OtherPlayer({ name, numberOfHands })
      })

      const gameForClient = new GameForClient({
        playerIdsByOrder: gameForServer.playerIdsByOrder,
        field: gameForServer.field,
        progress: gameForServer.progress,
        you: gameForServer.getPlayer(yourName),
        otherPlayers,
      })

      io.to(id).emit('dealHands', gameForClient)
    })
  })
  client.on('disconnect', () => {
    console.log('disconnect')
  })
})

server.on('request', (req, res) => {
  console.log('request')
})

server.listen(8000)
console.log('listening on 8000')
