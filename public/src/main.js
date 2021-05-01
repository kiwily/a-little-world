const socket = io();


socket.emit('join', {});

socket.on('start', () => {
    pauseView.className = "invisible";
    gameView.className = "";
});

socket.on('data', (data) => {
  console.log("receiving", data)
  updateIndications(data.indications);
  updateWords(data.words);
});

function updateWords(words) {
  console.log("update word ", words);
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

function updateIndications(indications) {
  console.log("update indic ", indications);
  indications.forEach((indication, _) => {
    let word = document.getElementById("word");
    let div = document.createElement('div');
    div.textContent = "Make " + indication.player + " Guess " + indication.word;
    word.append(div);
  });
};
