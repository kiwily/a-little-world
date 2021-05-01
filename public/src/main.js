const socket = io();

function clickButton(event) {
  io.emit('value of the button', this.textContent);
}

var pauseView = document.getElementById('pause');
var gameView = document.getElementById('game');
gameView.visible = false;

io.emit('join');

io.on('start', () => {
    pauseView.visible = false;
    gameView.visible = true;
});

io.on('data', (data) => {
  updateIndications(data.indications);
  updateWords(data.words);
});

function updateWords(words) {
  words.forEach((word, _) => {
    let divprinc = document.getElementById("words");
    let button = document.createElement('button');
    button.textContent = word;
    button.type = "button";
    button.name = "button";
    divprinc.append(button);
    button.addEventListener("click", clickButton);
  });
};

function updateIndications(indications) {
  indications.forEach((indication, _) => {
    let divprinc = document.getElementById("indications");
    let div = document.createElement('div');
    div.textContent = "Make " + indication.player + " Guess " + indication.word;
    divprinc.append(div);
  });
};
