const io = new Server(server);

var button = document.getElementById("question").getElementById("button")
button.addEventListener("click", clickButton);

function clickButton() {
  io.emit('value of the button', button.value);
  button.value = '';
}
var pauseView = document.getElementById('pause');
var gameView = document.getElementById('game');
gameView.visible = false;

io.emit('join');

io.on('start', () => {
    pauseView.visible = false;
    gameView.visible = true;
});

io.emit('data', (data) => {
  updateQuestions(data.words);
  updateWords(data.questions);
});

function updateWords(words) {
  words.forEach((word, _) => {
    
    console.log("Question word ", word);
  });
};


function updateQuestions(questions) {
  if (typeof word !== String || typeof color !== String) {
    return;
  };
  console.log("Color >", color, ", word >", word);
};
