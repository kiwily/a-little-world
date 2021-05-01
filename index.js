const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require("path");
const { Server } = require("socket.io");
const { Game } = require("./backend/game.js");

const { BidirectionalObject } = require("./utils/BidirectionalObject");
const { Console } = require('console');
const { resolve } = require('path');

const PORT = 3000;
const TIMING = 60;
const ERRORS = {
    "1": 'Cannot join a started game.',
    "2": 'This game name is undefined.'
};

const app = express();
const server = http.createServer(app);
const games = {};
const playerNameToSocketId = {};

app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    const error = ERRORS[req.query.e] || "";
    res.render('hub', { error });
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
    res.redirect(`/game/${req.body["join-game"]}`);
  } else if (games[game].started){
    res.redirect("/?e=1")
  } else {
    res.redirect(`/game/${req.body["join-game"]}`);
  }
});
app.get('/game/:gameId', (req, res) => {
  const gameId = req?.params?.gameId || ""
  if (games[gameId] === undefined) {
    res.redirect("/?e=2")
  } else {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  }
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
            Id: socket.id,
            playerName: '',
            ready: false,
            score: 0,
            position: 0
        }
        const playerNames = Object.values(games[partieId].players).map(x => { return {
            "playerName": x.playerName,
            "ready": x.ready
        }});
        Object.values(games[partieId].players).forEach(player => {
            player.socket.emit('waiting-update', playerNames);
        });
    });
    // If player is ready update it and check if all players are ready
    socket.on('ready', (newPlayerName) => {
        if (games[partieId] === undefined) {
          return;
        };

        Object.values(games[partieId].players).forEach(player => {
            player.socket.emit('new-player-name', newPlayerName);
        });
        // playerNameToSocketId[newPlayerName] = socket.id;
        games[partieId].players[socket.id].ready = true;
        games[partieId].players[socket.id].playerName = newPlayerName;
        const playerNames = Object.values(games[partieId].players).map(x => { return {
            "playerName": x.playerName,
            "ready": x.ready
        }});
        Object.values(games[partieId].players).forEach(player => {
            player.socket.emit('waiting-update', playerNames);
        });

        // Test if everyone is ready
        let allReady = true;
        Object.values(games[partieId].players).forEach(({ready}, _) => {
            allReady = allReady && ready
        })
        // All players are ready: start game
        if (allReady){
            games[partieId].started = true;
            games[partieId].game = new Game(games[partieId].players)

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

        const teammate = games[partieId].players[playerNameToSocketId[games[partieId].game.assignedHelper[playerName]]];
        if (result) {
            games[partieId].players[socket.id].score += 1;
            teammate.score += 2;
            games[partieId].game.refresh();
        } else {
            games[partieId].players[socket.id].score -= 1;
        }

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
        const is_ended = (gameOverview.counter < 0);
        const scoreDict = {};
        Object.values(gameOverview.players).forEach(({ Id, score }) => {
                scoreDict[score] = Id;
        });
        Object.keys(scoreDict).sort().forEach((score, i) => {
                const Id = scoreDict[score]
                gameOverview.players[Id].position = i + 1;
        });
        // Each player receives different info
        Object.values(gameOverview.players).forEach(({ socket, playerName, position, Id }) => {
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
                    words: gameOverview.game.possibleWords[Id],
                    indications: gameOverview.game.assignedMessages[Id],
                    counter: gameOverview.counter,
                    position
                };
                socket.emit('data', data);
            }
        });
    }
  });
}
