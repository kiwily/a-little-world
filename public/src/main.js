const socket = io();


socket.emit('join', {});

socket.on('start', () => {
    pauseView.className = "invisible";
    gameView.className = "";
});

socket.on('data', (data) => {
  console.log("receiving", data)
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
