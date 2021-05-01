const express = require('express');
const { sockets } = require("./backend/server.js");
const http = require('http');

//const { Backend } = require("/backend/server.js");

const PORT = 3000;

const app = express();
const server = http.createServer(app);
const bodyParser = require('body-parser');

const path = require("path");

const listGame = [];

app.use(bodyParser.urlencoded({extended:true}));

app.use('/static', express.static(path.join(__dirname, "public")));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "hub.html"));
});

app.post('/join-game', (req, res) => {
  if (listGame.includes(req.body.nameNewGame)) {
    res.redirect(`/game/${req.body["join-game"]}`);
  }
  else{
    listGame.push(req.body.nameNewGame);
    res.redirect(`/game/${req.body["join-game"]}`);
  };
});
app.get('/game/:gameId', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

sockets(server)

server.listen(PORT, () => {
  console.log(`listening on :${PORT}`);
});

//Backend.run()
