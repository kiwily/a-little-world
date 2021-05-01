const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const bodyParser = require('body-parser');

const path = require("path");

const listGame = [];

app.use(bodyParser.urlencoded({extended:true}));

app.use('/static', express.static(path.join(__dirname, "public")));
app.get('/hub', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "hub.html"));
});
app.post('/createGame', (req, res) => {
  listGame.push(req.body.nameNewGame);
  res.redirect('/game/'+req.body.nameNewGame);
});
app.post('/joinGame', (req, res) => {
  if (listGame.includes(req.body.nameNewGame)) {
    res.redirect('/game/'+req.body.nameNewGame);
  }
  else{
    res.redirect('/hub');
  }
});
app.get('/game/:gameId', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on('connection', (socket) => {
  console.log("[\x1b[32m+\x1b[0m] User connected\x1b[33m", socket.id, "\x1b[0m");
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
  socket.on('disconnect', () => {
    console.log("[\x1b[31m-\x1b[0m] User disconnected\x1b[33m", socket.id, "\x1b[0m");
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
