const wordsDiv = document.querySelector("div#words");
const divIndications = document.querySelector("div#indications");

let updateWordsId = undefined;
function updateWords(words) {
  if (updateWordsId !== undefined) {
    clearTimeout(updateWordsId);
    updateWordsId = undefined;
  };

  const clickedValues = Object.values(clickedTimeout)
  if (clickedValues.length > 0 && clickedValues[0] !== undefined) {
    updateWordsId = setTimeout((_) => {updateWords(words)}, 50);
    return;
  };

  while (wordsDiv.firstChild) {
    wordsDiv.removeChild(wordsDiv.firstChild);
  };

  words.forEach((word, _) => {
    const question = document.getElementById("words");
    const button = document.createElement('button');
    button.textContent = word;
    button.type = "button";
    button.name = "button";
    question.appendChild(button);
  });
};

function updateIndications(publicId, word) {
  while (divIndications.firstChild) {
    divIndications.removeChild(divIndications.firstChild);
  };

  const div = document.createElement('div');
  div.textContent = "Make " + publicId + " Guess " + word;
  divIndications.appendChild(div);
};
