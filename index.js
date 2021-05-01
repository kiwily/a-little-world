const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require("path");
const { Server } = require("socket.io");
const { Game } = require("./backend/game.js");

const { BidirectionalObject } = require("./utils/BidirectionalObject");
const { Console } = require('console');

const PORT = 3000;
const TIMING = 5;

const app = express();
const server = http.createServer(app);
const games = {};
const playerNameToSocketId = {};

app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render('hub', { title: 'Hey', message: 'Hello there!' });
});

app.post('/', (req, res) => {
  const game = req.body["join-game"];
  if (games[game] === undefined) {
    games[game] = {
      players: {},
      started: false,
      game: null,
      counter: TIMING
    }
  } else if (games[game].started){
    res.redirect(`/`);
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
        if (games[partieId] === undefined) {
          return;
        };
        games[partieId].players[socket.id] = {
            socket,
            playerName: socket.id,
            ready: false,
            score: 0,
            position: 0
        }
    });
    // If player is ready update it and check if all players are ready
    socket.on('ready', (playerName) => {
        if (games[partieId] === undefined) {
          return;
        };
        playerNameToSocketId[playerName] = socket.id;
        games[partieId].players[socket.id].ready = true;
        games[partieId].players[socket.id].playerName = playerName;
        // Test if everyone is ready
        let allReady = true;
        Object.values(games[partieId].players).forEach((player, _) => {
            console.log("ready", allReady, player.ready);
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

    socket.on('tentative', (word) => {
        if (games[partieId] === undefined) {
          return;
        };
        const playerName = games[partieId].players[socket.id].playerName;
        const result = games[partieId].game.assignedWords[playerName] === word;
        console.log("TENTATIVE", word, games[partieId].game.assignedWords)
        const teammate = games[partieId].players[playerNameToSocketId[games[partieId].game.assignedHelper[playerName]]];
        if (result) {
            games[partieId].players[socket.id].score += 1;
            teammate.score += 2;
            games[partieId].game.refresh();
        } else {
            games[partieId].players[socket.id].score -= 1;
        }
        console.log(games[partieId].players[socket.id].score)
        socket.emit("result", result)
    });

    socket.on('disconnect', () => {
        console.log("[\x1b[31m-\x1b[0m] User disconnected\x1b[33m", socket.id, "\x1b[0m");
    });
});

const id = setInterval(loop, 1000);

server.listen(PORT, () => {
  console.log(`listening on :${PORT}`);
});

function loop() {
  // Send data for each game separately
  Object.values(games).forEach((gameOverview) => {
    // Only if game is playing
    if (gameOverview.started){
        gameOverview.counter -= 1;
        const is_ended = (gameOverview.counter <= 0);
        const scoreDict = {};
        Object.values(gameOverview.players).forEach(({ playerName, score }) => {
                scoreDict[score] = playerName;
        });
        Object.keys(scoreDict).sort().forEach((score, i) => {
                const playerName = scoreDict[score]
                gameOverview.players[playerNameToSocketId[playerName]].position = i + 1;
        });
        // Each player receives different info
        Object.values(gameOverview.players).forEach(({ socket, playerName, position }) => {
            if (is_ended) {
                const data = {
                    players: Object.values(gameOverview.players).map(p => {
                        return {
                            "playerName": p.playerName,
                            "score": p.score,
                            "position": p.position
                        }
                    })
                };
                socket.emit('finish', data);
                console.log("DISCONNECTED")
                socket.disconnect();
            } else {
                const data = {
                    words: gameOverview.game.possibleWords[playerName],
                    indications: gameOverview.game.assignedMessages[playerName],
                    counter: gameOverview.counter,
                    position
                };
                socket.emit('data', data);
            }
        });
    }
  });
}
