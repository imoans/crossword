var _this = this;

var GameService = require('../domain/game-service');
var GameForClient = require('../domain/game-for-client');
var Game = require('../domain/game');

var server = require('http').createServer();
var io = require('socket.io').listen(server);

var userByClientId = {};

io.on('connection', function (client) {
  client.on('addUser', function (userName) {
    userByClientId[client.id] = userName;
    io.emit('addUser', userName);
  });

  client.on('startGame', function (players) {
    var game = new Game({ players: players });
    var gameService = new GameService(game);
    var newGame = gameService.startGame();

    var service = new GameService(newGame);
    var gameForSever = _this.service.dealHands();

    Object.keys(userByClientId).forEact(function (id) {
      var otherPlayers = gameForSever.players.filter(function (player) {
        return player.name !== userByClientId[id];
      });

      var gameForClient = new GameService(Object.assign({}, gameForSever, {
        you: gameForSever.getPlayer(userByClientId[id]),
        otherPlayers: otherPlayers
      }));

      it.to(id).emit('dealHands', gameForClient);
    });
  });
  client.on('disconnect', function () {
    console.log('disconnect');
  });
});

server.on('request', function (req, res) {
  console.log('request');
});

server.listen(8000);
console.log('listening on 8000');
