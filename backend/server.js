
const { Server } = require("socket.io");

exports.sockets = function sockets(server) {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log("[\x1b[32m+\x1b[0m] User connected\x1b[33m", socket.id, "\x1b[0m");
        socket.on('chat message', (msg) => {
            console.log('message: ' + msg);
            socket.emit('chat message', msg);
        });
        socket.on('Join a new game', (msg) => {
            listGame.push(msg);
        });
        socket.on('Join a current game', (msg) => {
            // if (listGame.includes(msg)) {
            // }
        });
        socket.on('disconnect', () => {
            console.log("[\x1b[31m-\x1b[0m] User disconnected\x1b[33m", socket.id, "\x1b[0m");
        });
    });
}