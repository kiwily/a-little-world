const socket = io();
document.getElementById("start").addEventListener("click", Start);
document.getElementById("join").addEventListener("click", Join);

function Start() {
  socket.emit('Join a new game', document.getElementById('nameNewGame').value);
  document.getElementById('nameNewGame').value = '';
}

function Join() {
  socket.emit('Join a current game', document.getElementById('nameGame').value);
  document.getElementById('nameGame').value = '';
}
