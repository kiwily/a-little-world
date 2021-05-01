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
  if (listGame.includes(req.body.nameNewGame)) {
    const game = req.body.nameNewGame;
    if (games[game] === undefined) {
      games[game] = {
        players: {},
        started: false,
        game: null
      }
    }
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
    socket.on('join', () => {
        games[partieId].players[socket.id] = {
            socket,
            playerName: "lol",
            ready: false
        }
    });
    // If player is ready update it and check if all players are ready
    socket.on('ready', () => {
      games[partieId].players[socket.id].ready = true;
      let allReady = true;
      Object.values(games[partieId].players).forEach((player, _) => {
        allReady = allReady && player.ready
      })
      // All players are ready: start game
      if (allReady){
        games[partieId].started = true;
        games[partieId].game = new Game()
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

const id = setTimeout(loop, 300);

server.listen(PORT, () => {
  console.log(`listening on :${PORT}`);
});

function loop() {
  Object.keys(games).forEach((game) => {
    if (game.started){
      io.emit('data', (msg) => {
          listGame.push(msg);
      });
    }
  });
}