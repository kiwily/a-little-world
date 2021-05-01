const socket = io();

var button = document.getElementById("button");
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

io.on('data', (data) => {
  updateQuestions(data.words);
  updateWords(data.questions);
});

function updateWords(words) {
  words.forEach((word, _) => {
    console.log("Question word ", word);
    let question = document.getElementById("question");
    let button = document.createElement('button');
    button.textContent = word;
    button.type = "button";
    button.name = "button";
    question.append(button);
  });
};

function updateQuestions(questions) {
  questions.forEach((question, _) => {
    let word = document.getElementById("word");
    let div = document.createElement('div');
    div.textContent = "Make " + question[0] + " Guess " + question[1];
    word.append(div);
  });
};
