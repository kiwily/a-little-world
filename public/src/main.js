const wordsDiv = document.querySelector("div#words");
const indicationsDiv = document.querySelector("div#indications");
function updateWords(words) {
  while (wordsDiv.firstChild) {
    wordsDiv.removeChild(wordsDiv.firstChild);
  }

  words.forEach((word, _) => {
    const question = document.getElementById("words");
    const button = document.createElement('button');
    button.textContent = word;
    button.type = "button";
    button.name = "button";
    question.append(button);
  });
};

function updateIndications(indications) {
  while (indicationsDiv.firstChild) {
    indicationsDiv.removeChild(indicationsDiv.firstChild);
  }

  indications.forEach((indication, _) => {
    const word = document.getElementById("indications");
    const div = document.createElement('div');
    div.textContent = "Make " + indication.playerName + " Guess " + indication.word;
    word.append(div);
  });
};
