const listGame = [];

var url = new URL('http://index.html');

function Start() {
  var name = document.getElementById('nameNewGame').value;
  listGame.push(name);
  document.getElementById('nameNewGame').value = '';
}

function Join() {
  var name = document.getElementById('nameGame').value;
  if (listGame.includes(name)) {

  }
  document.getElementById('nameGame').value = '';
}
