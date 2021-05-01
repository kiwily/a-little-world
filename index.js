const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require("path");
const { Server } = require("socket.io");
const { Game } = require("./backend/game.js");

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const games = {};

app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static(path.join(__dirname, "public")));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "hub.html"));
});

app.post('/join-game', (req, res) => {
  const game = req.body["join-game"];
  if (games[game] === undefined) {
    games[game] = {
      players: {},
      started: false,
      game: null
    }
  }
  res.redirect(`/game/${req.body["join-game"]}`);
});
app.get('/game/:gameId', (req, res) => {
  const gameId = req?.params?.gameId || ""
  if (games[gameId] === undefined) {
    console.log("Game ID Undefined", gameId);
    res.redirect("/");
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ------------- SOCKET TIME -------------
const io = new Server(server);

io.on('connection', (socket) => {
    console.log("[\x1b[32m+\x1b[0m] User connected\x1b[33m", socket.id, "\x1b[0m");
    const partieId = socket.handshake.headers.referer.split("/").pop();
    // Add a new player to the game
    socket.on('join', () => {
        games[partieId].players[socket.id] = {
            socket,
            playerName: socket.id,
            ready: false
        }
        console.log(games)
    });
    // If player is ready update it and check if all players are ready
    socket.on('ready', (playerName) => {
      games[partieId].players[socket.id].ready = true;
      games[partieId].players[socket.id].playerName = playerName;
      // Test if everyone is ready
      let allReady = true;
      Object.values(games[partieId].players).forEach((player, _) => {
        allReady = allReady && player.ready
      })
      // All players are ready: start game
      if (allReady){
        const playerNames = Object.values(games[partieId].players).map(x => x.playerName);
        games[partieId].started = true;
        games[partieId].game = new Game(playerNames)

        Object.values(games[partieId].players).forEach(player => {
          player.socket.emit('start');
        });
      }
    });

    socket.on('disconnect', () => {
        console.log("[\x1b[31m-\x1b[0m] User disconnected\x1b[33m", socket.id, "\x1b[0m");
    });
});

const id = setInterval(loop, 5000);

server.listen(PORT, () => {
  console.log(`listening on :${PORT}`);
});

function loop() {
  // Send data for each game separately
  Object.values(games).forEach((gameOverview) => {
    // Only if game is playing
    if (gameOverview.started){
      gameOverview.game.refresh();
      // Each player receives different info
      Object.values(gameOverview.players).forEach((player) => {
        const data = {
          words: gameOverview.game.words,
          indications: gameOverview.game.assignedMessages[player.playerName]
        };
        player.socket.emit('data', data);
      });
    }
  });
}
