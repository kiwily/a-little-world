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
    console.log("joining id", games)
    res.redirect(`/game/${req.body["join-game"]}`);
  }
});
app.get('/game/:gameId', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ------------- SOCKET TIME -------------
const io = new Server(server);

io.on('connection', (socket) => {
    console.log("[\x1b[32m+\x1b[0m] User connected\x1b[33m", socket.id, "\x1b[0m");
    const partieId = socket.handshake.headers.referer.split("/").pop();
    // Add a new player to the game
    console.log("games", games)
    console.log("partie", partieId)
    socket.on('join', () => {
        games[partieId].players[socket.id] = {
            socket,
            playerName: socket.id,
            ready: false
        }
        console.log(games)
    });
    // If player is ready update it and check if all players are ready
    socket.on('ready', () => {
      games[partieId].players[socket.id].ready = true;
      const playerIds = games[partieId].players.map(x => x.playerName);
      console.log("player ids", playerIds)
      let allReady = true;
      Object.values(games[partieId].players).forEach((player, _) => {
        allReady = allReady && player.ready
      })
      // All players are ready: start game
      if (allReady){
        games[partieId].started = true;
        games[partieId].game = new Game(playerIds)
      }
    });
    socket.on('Join a current game', (msg) => {
        // if (listGame.includes(msg)) {
        // }
    });
    socket.on('disconnect', () => {
        console.log("[\x1b[31m-\x1b[0m] User disconnected\x1b[33m", socket.id, "\x1b[0m");
    });
});

const id = setInterval(loop, 2000);

server.listen(PORT, () => {
  console.log(`listening on :${PORT}`);
});

function loop() {
  // Send data for each game separately
  Object.values(games).forEach((game) => {
    // Only if game is playing
    if (game.started){
      // Each player receives different info
      Object.values(game.players).forEach((player) => {
        const data = {
          words: game.words,
          indications: game.assignedMessages[player.playerName]
        };
        player.socket.emit('data', data);
      }); 
    }
  });
}