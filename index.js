const express = require('express');
const { sockets } = require("./backend/server.js");
const http = require('http');

//const { Backend } = require("/backend/server.js");

const PORT = 3000;

const app = express();
const server = http.createServer(app);

const path = require("path");

const listGame = [];

app.use('/static', express.static(path.join(__dirname, "public")));
app.get('/hub', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "hub.html"));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get('/hub', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

sockets(server)

server.listen(PORT, () => {
  console.log(`listening on :${PORT}`);
});

//Backend.run()
