const ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require("path");
const { Server } = require("socket.io");
// const { Game } = require("./backend/game.js");

const { BidirectionalObject } = require("./utils/BidirectionalObject");
const { Console } = require('console');
const { resolve } = require('path');

const PORT = 3000;
const TIMING = 2;

const app = express();
const server = http.createServer(app);

// BDD
const Parties = {};
const Players = {};

app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render('hub', {});
});

app.post('/', (req, res) => {
  const partyId = req.body["join-game"];

  Parties[partyId] = Parties[partyId] || {
    partyId: partyId,
    players: [],
  };
  res.redirect(`/party/${partyId}`);
});

app.get('/party/:partyId', (req, res) => {
  const partyId = req?.params?.partyId || ""
  if (Parties[partyId] === undefined) {
    res.redirect("/")
  } else {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  }
});

// ------------- SOCKET TIME -------------
const io = new Server(server);

io.on('connection', (socket) => {
    console.log("[\x1b[32m+\x1b[0m] User connected\x1b[33m", socket.id, "\x1b[0m");
    const partyId = socket.handshake.headers.referer.split("/").pop();

    if (Parties[partyId] === undefined) {
      throw new Error(`Access Not Existing Party > ${partyId}`);
    };

    Players[socket.id] = Players[socket.id] || {
      playerId: socket.id,
      partyId: partyId,
      emit: socket.emit.bind(socket),
    };

    Parties[partyId].players.push(Players[socket.id]); // Deep reference no need to actualise

    // Warn the Player (client) about its partyId (for broadcast listening)
    socket.emit("party id", partyId);

    // Get the Public Id of Player (type by user)
    socket.on('ready', (playerPublicId) => {
        // The game doesn't exist anymore
        if (Parties[partyId] === undefined) {
          return;
        };

        // Update Player
        Players[socket.id].playerPublicId = playerPublicId;

        // Is everyone Public
        let everyPlayersInArePublic = true;
        Parties[partyId].players.forEach((player, i) => {
          // If player not still in party pass
          if (player === undefined || player?.partyId !== partyId) {
            return;
          };

          if (player?.playerPublicId === undefined) {
            everyPlayersInArePublic = false; // Can leave loop from there
          };
        });

        console.log("Ready", partyId, everyPlayersInArePublic);
        // Party can start and not already started
        if (everyPlayersInArePublic && Parties[partyId]?.mainLoopId === undefined) {
          // Start Party
          Parties[partyId].startTime = Date.now();
          updateQuestions(Parties[partyId]);
          mainLoop(Parties[partyId])
          Parties[partyId].mainLoopId = setInterval(() => {
            mainLoop(Parties[partyId])
          }, 1000);
          // Warn all players that the party starts
          // TODO: pack sockets in sessions
          io.emit(`party ${partyId} start`);
          return;
        }

        // Warn every player in the new public statuses
        const publicUpdate = Parties[partyId].players.map((player, i) => {
          // If player not still in party pass
          if (player === undefined || player?.partyId !== partyId) {
            return 0; // Player not exist anymore
          };
          if (player?.playerPublicId === undefined) {
            return 1; // Player still private
          };
          return player.playerPublicId;
        });
        // Send update to every one, let the client decide to listen or not
        // TODO: pack sockets in sessions
        io.emit(`party ${partyId} public-update`, {publicUpdate: publicUpdate});
    });

    socket.on('clicked', (word) => {
        // Return if doesn't receive a string
        if (typeof word !== "string") {
          // Warn Player of problem in its emit
          return;
        }

        // The game doesn't exist anymore
        if (Parties[partyId] === undefined) {
          return;
        };

        // Return if the player has no word to guess
        if (Players[socket.id]?.word === undefined) {
          // Warn Player of false attempt
          return;
        };

        // Is the player right
        if (Players[socket.id].word.toLowerCase() === word.toLowerCase()) {
          // Update Score
          Players[socket.id].score = (Players[socket.id].score || 0) + 1;
          // Update Helper if exist
          if (Players[socket.id].helper !== undefined && Players[socket.id].helper?.playerId !== undefined) {
            Players[socket.id].helper.score = (Players[socket.id].helper.score || 0) + 1;
          };

          // Create new word question
          updateQuestions(Parties[partyId]);

          // Warn Player about its right answer
          socket.emit("clicked result", true);
          return;
        };

        // Player is wrong
        Players[socket.id].score = (Players[socket.id].score || 0) - 1;
        // Warn Player about its wrong answer
        socket.emit("clicked result", false);
        return;
    });

    socket.on('disconnect', () => {
        console.log("[\x1b[31m-\x1b[0m] User disconnected\x1b[33m", socket.id, "\x1b[0m");
        // Remove player from Party
        // Get its i in player list
        if (Parties[partyId].players.length === 1) {
          // Close Party
          Parties[partyId].players = [];
          // TODO: Free partyId
        } else {
          let iPlayer = -1;
          for (let i = 0; i < Parties[partyId].players.length; i++) {
            // Is the correct player associated, is so keep i to remove
            if (Parties[partyId].player[i].playerId === socket.id) {
              break;
            };
          };

          // If player found
          if (iPlayer >= 0) {
            Parties[partyId].players.splice(iPlayer, 1);
          };
        };
        // Remove Player from accessible ones
        Players[socket.id] = undefined;
    });
});

// ------------- LAUCH SERVER -------------

server.listen(PORT, () => {
  console.log(`listening on :${PORT}`);
});

// ------------- UPDATE LOOP -------------
const { Words } = require("./utils/Words.js");

function updateQuestions(party) {
  // Assign a word to each player
  const wordsOfRound = [];
  party.players.forEach((player, i) => {
    const chosenWord = Words[Math.floor(Math.random() * Words.length)];
    // TODO: Avoid to player to have the same word
    player.word = chosenWord;
    wordsOfRound.push(chosenWord);
  });

  // Assign a helper to each player
  // Determine available helpers
  const chosenPlayersId = [];
  party.players.forEach((player, i) => {
    chosenPlayersId.push(player.playerId);
  });
  // Assign helpers pairs
  party.players.forEach((player, i) => {
    // TODO: No be able to be its own helper
    const iChosenPlayerId = Math.floor(Math.random() * chosenPlayersId.length);
    const chosenPlayerId = chosenPlayersId[iChosenPlayerId];
    // Remove chosen one from available
    chosenPlayersId.splice(iChosenPlayerId, 1);
    // Assign helper
    player.helper = Players[chosenPlayerId];
    Players[chosenPlayerId].helpy = player;

    // Alert the helper of its new helpy
    Players[chosenPlayerId].emit("helpy", {
      publicId: player.playerPublicId,
      word: player.word,
    });
  });

  // Assign a team word list to each player
  party.players.forEach((player, i) => {
    const wordsList = [];
    for (let i = 0; i < 4; i++) {
      // TODO: Choose Word List with wordsOfRound
      const chosenWord = Words[Math.floor(Math.random() * Words.length)];
      wordsList.push(chosenWord);
    };
    // Replace on of the word with the player word
    wordsList[Math.floor(Math.random() * wordsList.length)] = player.word;

    // Alert the player of its new word list
    player.emit("wordlist", wordsList);
  });
};

function mainLoop(party) {
  // TODO: Send time update to Players
  // TODO: Lauch auto question update at random
  return;
}
